"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { removeFromWatchlist } from "@/lib/actions/watchlist.action";
import { toast } from "sonner";

export default function WatchlistTable({ watchlist: initialWatchlist }: WatchlistTableProps) {
  const [watchlist, setWatchlist] = useState<StockWithData[]>(initialWatchlist);
  const [removing, setRemoving] = useState<string | null>(null);

  const handleRemove = async (symbol: string) => {
    if (removing) return;

    setRemoving(symbol);

    try {
      const result = await removeFromWatchlist(symbol);
      
      if (result.success) {
        // Remove from local state
        setWatchlist(prev => prev.filter(stock => stock.symbol !== symbol));
        toast.success(`${symbol} removed from watchlist`);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error('Failed to remove stock from watchlist');
      console.error('Remove from watchlist error:', error);
    } finally {
      setRemoving(null);
    }
  };

  if (watchlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Your watchlist is empty
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Start tracking stocks by adding them to your watchlist
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Browse Stocks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Symbol
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Company
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Price
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Change
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Market Cap
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Added
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {watchlist.map((stock) => (
            <tr
              key={stock.symbol}
              className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <Link
                  href={`/stocks/${stock.symbol}`}
                  className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  {stock.symbol}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-gray-100">
                  {stock.company}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {stock.priceFormatted}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div
                  className={`flex items-center text-sm font-medium ${
                    (stock.changePercent ?? 0) > 0
                      ? "text-green-600 dark:text-green-400"
                      : (stock.changePercent ?? 0) < 0
                      ? "text-red-600 dark:text-red-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {(stock.changePercent ?? 0) > 0 ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (stock.changePercent ?? 0) < 0 ? (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  ) : null}
                  {stock.changeFormatted}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {stock.marketCap}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {new Date(stock.addedAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => handleRemove(stock.symbol)}
                  disabled={removing === stock.symbol}
                  className={`text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 inline-flex items-center gap-1 ${
                    removing === stock.symbol ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  title={`Remove ${stock.symbol} from watchlist`}
                >
                  <Trash2 className="w-4 h-4" />
                  {removing === stock.symbol ? "Removing..." : "Remove"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
