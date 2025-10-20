'use server';

import { connectToDatabase } from '@/database/mongoose';
import { Watchlist } from '@/database/models/watchlist.model';
import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';

export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
  if (!email) return [];

  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');

    // Better Auth stores users in the "user" collection
    const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

    if (!user) return [];

    const userId = (user.id as string) || String(user._id || '');
    if (!userId) return [];

    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
    return items.map((i) => String(i.symbol));
  } catch (err) {
    console.error('getWatchlistSymbolsByEmail error:', err);
    return [];
  }
}

export async function addToWatchlist(symbol: string, company: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' };
    }

    await connectToDatabase();

    const existingItem = await Watchlist.findOne({
      userId: session.user.id,
      symbol: symbol.toUpperCase(),
    });

    if (existingItem) {
      return { success: true, message: 'Already in watchlist' };
    }

    await Watchlist.create({
      userId: session.user.id,
      symbol: symbol.toUpperCase(),
      company,
      addedAt: new Date(),
    });

    return { success: true, message: 'Added to watchlist' };
  } catch (err) {
    console.error('addToWatchlist error:', err);
    return { success: false, error: 'Failed to add to watchlist' };
  }
}

export async function removeFromWatchlist(symbol: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user?.id) {
      return { success: false, error: 'Not authenticated' };
    }

    await connectToDatabase();

    await Watchlist.deleteOne({
      userId: session.user.id,
      symbol: symbol.toUpperCase(),
    });

    return { success: true, message: 'Removed from watchlist' };
  } catch (err) {
    console.error('removeFromWatchlist error:', err);
    return { success: false, error: 'Failed to remove from watchlist' };
  }
}

export async function isStockInWatchlist(symbol: string): Promise<boolean> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user?.id) {
      return false;
    }

    await connectToDatabase();

    const item = await Watchlist.findOne({
      userId: session.user.id,
      symbol: symbol.toUpperCase(),
    });

    return !!item;
  } catch (err) {
    console.error('isStockInWatchlist error:', err);
    return false;
  }
}

export async function enrichStocksWithWatchlistStatus(
  stocks: StockWithWatchlistStatus[]
): Promise<StockWithWatchlistStatus[]> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user?.id || !stocks.length) {
      return stocks;
    }

    await connectToDatabase();

    // Get all symbols in user's watchlist
    const watchlistItems = await Watchlist.find(
      { userId: session.user.id },
      { symbol: 1 }
    ).lean();

    const watchlistSymbols = new Set(
      watchlistItems.map(item => item.symbol.toUpperCase())
    );

    // Update isInWatchlist for each stock
    return stocks.map(stock => ({
      ...stock,
      isInWatchlist: watchlistSymbols.has(stock.symbol.toUpperCase())
    }));
  } catch (err) {
    console.error('enrichStocksWithWatchlistStatus error:', err);
    return stocks;
  }
}

export async function getUserWatchlist(): Promise<StockWithData[]> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user?.id) {
      return [];
    }

    await connectToDatabase();

    const items = await Watchlist.find({ userId: session.user.id })
      .sort({ addedAt: -1 })
      .lean();

    if (!items || items.length === 0) {
      return [];
    }

    // Fetch stock data from Finnhub for each watchlist item
    const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY ?? process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
    
    const stocksWithData = await Promise.all(
      items.map(async (item) => {
        try {
          // Fetch quote data
          const quoteRes = await fetch(
            `https://finnhub.io/api/v1/quote?symbol=${item.symbol}&token=${FINNHUB_API_KEY}`,
            { next: { revalidate: 60 } }
          );
          const quote: QuoteData = await quoteRes.json();

          // Fetch profile data
          const profileRes = await fetch(
            `https://finnhub.io/api/v1/stock/profile2?symbol=${item.symbol}&token=${FINNHUB_API_KEY}`,
            { next: { revalidate: 3600 } }
          );
          const profile: ProfileData = await profileRes.json();

          const currentPrice = quote?.c || 0;
          const changePercent = quote?.dp || 0;
          const marketCap = profile?.marketCapitalization || 0;

          return {
            userId: item.userId,
            symbol: item.symbol,
            company: item.company,
            addedAt: item.addedAt,
            currentPrice,
            changePercent,
            priceFormatted: currentPrice > 0 ? `$${currentPrice.toFixed(2)}` : 'N/A',
            changeFormatted: changePercent !== 0 ? `${changePercent > 0 ? '+' : ''}${changePercent.toFixed(2)}%` : 'N/A',
            marketCap: marketCap > 0 ? `$${(marketCap / 1000).toFixed(2)}B` : 'N/A',
            peRatio: 'N/A',
          };
        } catch (error) {
          console.error(`Error fetching data for ${item.symbol}:`, error);
          return {
            userId: item.userId,
            symbol: item.symbol,
            company: item.company,
            addedAt: item.addedAt,
            currentPrice: 0,
            changePercent: 0,
            priceFormatted: 'N/A',
            changeFormatted: 'N/A',
            marketCap: 'N/A',
            peRatio: 'N/A',
          };
        }
      })
    );

    return stocksWithData;
  } catch (err) {
    console.error('getUserWatchlist error:', err);
    return [];
  }
}