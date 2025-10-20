"use client"

import { useEffect, useState } from "react"
import { CommandDialog, CommandEmpty, CommandInput, CommandList } from "@/components/ui/command"
import {Button} from "@/components/ui/button";
import {Loader2,  Star,  TrendingUp} from "lucide-react";
import Link from "next/link";
import {searchStocks} from "@/lib/actions/finnhub.action";
import {useDebounce} from "@/hooks/useDebounce";
import {addToWatchlist, removeFromWatchlist, enrichStocksWithWatchlistStatus} from "@/lib/actions/watchlist.action";
import {toast} from "sonner";

export default function SearchCommand({ renderAs = 'button', label = 'Add stock', initialStocks }: SearchCommandProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [stocks, setStocks] = useState<StockWithWatchlistStatus[]>(initialStocks);

  const isSearchMode = !!searchTerm.trim();
  const displayStocks = isSearchMode ? stocks : stocks?.slice(0, 10);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen(v => !v)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const handleSearch = async () => {
    if(!isSearchMode) return setStocks(initialStocks);

    setLoading(true)
    try {
        const results = await searchStocks(searchTerm.trim());
        const enrichedResults = await enrichStocksWithWatchlistStatus(results);
        setStocks(enrichedResults);
    } catch {
      setStocks([])
    } finally {
      setLoading(false)
    }
  }

  const debouncedSearch = useDebounce(handleSearch, 300);

  useEffect(() => {
    debouncedSearch();
  }, [searchTerm]);

  const handleSelectStock = () => {
    setOpen(false);
    setSearchTerm("");
    setStocks(initialStocks);
  }

  const handleToggleWatchlist = async (e: React.MouseEvent, stock: StockWithWatchlistStatus) => {
    e.preventDefault();
    e.stopPropagation();

    const originalStocks = [...stocks];
    const wasInWatchlist = stock.isInWatchlist;
    
    // Optimistic update
    setStocks(prevStocks => 
      prevStocks.map(s => 
        s.symbol === stock.symbol 
          ? { ...s, isInWatchlist: !s.isInWatchlist }
          : s
      )
    );

    try {
      if (wasInWatchlist) {
        const result = await removeFromWatchlist(stock.symbol);
        if (result.success) {
          toast.success(`${stock.symbol} removed from watchlist`);
        } else {
          throw new Error(result.error);
        }
      } else {
        const result = await addToWatchlist(stock.symbol, stock.name);
        if (result.success) {
          toast.success(`${stock.symbol} added to watchlist`);
        } else {
          throw new Error(result.error);
        }
      }
    } catch (error) {
      // Revert on error
      setStocks(originalStocks);
      toast.error('Failed to update watchlist. Please try again.');
      console.error('Toggle watchlist error:', error);
    }
  }

  return (
    <>
      {renderAs === 'text' ? (
          <span onClick={() => setOpen(true)} className="search-text">
            {label}
          </span>
      ): (
          <Button onClick={() => setOpen(true)} className="search-btn">
            {label}
          </Button>
      )}
      <CommandDialog open={open} onOpenChange={setOpen} className="search-dialog">
        <div className="search-field">
          <CommandInput value={searchTerm} onValueChange={setSearchTerm} placeholder="Search stocks..." className="search-input" />
          {loading && <Loader2 className="search-loader" />}
        </div>
        <CommandList className="search-list">
          {loading ? (
              <CommandEmpty className="search-list-empty">Loading stocks...</CommandEmpty>
          ) : displayStocks?.length === 0 ? (
              <div className="search-list-indicator">
                {isSearchMode ? 'No results found' : 'No stocks available'}
              </div>
            ) : (
            <ul>
              <div className="search-count">
                {isSearchMode ? 'Search results' : 'Popular stocks'}
                {` `}({displayStocks?.length || 0})
              </div>
              {displayStocks?.map((stock, i) => (
                  <li key={stock.symbol} className="search-item">
                    <Link
                        href={`/stocks/${stock.symbol}`}
                        onClick={handleSelectStock}
                        className="search-item-link"
                    >
                      <TrendingUp className="h-4 w-4 text-gray-500" />
                      <div  className="flex-1">
                        <div className="search-item-name">
                          {stock.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {stock.symbol} | {stock.exchange } | {stock.type}
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleToggleWatchlist(e, stock)}
                        className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                        aria-label={stock.isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
                      >
                        <Star 
                          className={`h-5 w-5 transition-colors ${
                            stock.isInWatchlist 
                              ? "fill-yellow-400 text-yellow-400" 
                              : "text-gray-400 hover:text-yellow-400"
                          }`}
                        />
                      </button>
                    </Link>
                  </li>
              ))}
            </ul>
          )
          }
        </CommandList>
      </CommandDialog>
    </>
  )
}