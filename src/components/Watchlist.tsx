
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Plus, X, TrendingUp, TrendingDown, Sparkles, Search, Star, StarOff } from "lucide-react";

type Stock = {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
};

const defaultStocks: Stock[] = [
  {
    id: "1",
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 178.72,
    change: 2.34,
    changePercent: 1.32,
  },
  {
    id: "2",
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 405.63,
    change: -1.20,
    changePercent: -0.29,
  },
  {
    id: "3",
    symbol: "TSLA",
    name: "Tesla, Inc.",
    price: 172.63,
    change: 4.82,
    changePercent: 2.87,
  },
  {
    id: "4",
    symbol: "AMZN",
    name: "Amazon.com, Inc.",
    price: 178.75,
    change: 1.45,
    changePercent: 0.82,
  },
];

const popularStocks: Stock[] = [
  {
    id: "5",
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    price: 916.05,
    change: 15.83,
    changePercent: 1.76,
  },
  {
    id: "6",
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 164.34,
    change: 1.05,
    changePercent: 0.64,
  },
  {
    id: "7",
    symbol: "META",
    name: "Meta Platforms, Inc.",
    price: 478.22,
    change: 4.32,
    changePercent: 0.91,
  },
  {
    id: "8",
    symbol: "JPM",
    name: "JPMorgan Chase & Co.",
    price: 197.45,
    change: -2.31,
    changePercent: -1.16,
  },
];

interface WatchlistProps {
  className?: string;
}

const Watchlist = ({ className }: WatchlistProps) => {
  const [watchlist, setWatchlist] = useState<Stock[]>(defaultStocks);
  const [searchTerm, setSearchTerm] = useState("");

  const handleRemoveStock = (id: string) => {
    setWatchlist((prev) => prev.filter((stock) => stock.id !== id));
  };

  const handleAddStock = (stock: Stock) => {
    if (watchlist.some((s) => s.id === stock.id)) return;
    setWatchlist((prev) => [...prev, stock]);
  };

  const filteredPopularStocks = popularStocks.filter(
    (stock) =>
      !watchlist.some((s) => s.id === stock.id) &&
      (stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">My Watchlist</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8 gap-1">
              <Plus size={14} />
              <span>Add Stock</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add to Watchlist</DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  placeholder="Search stocks..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="max-h-[300px] space-y-2 overflow-y-auto pr-1">
                {searchTerm ? (
                  filteredPopularStocks.length > 0 ? (
                    filteredPopularStocks.map((stock) => (
                      <StockRow
                        key={stock.id}
                        stock={stock}
                        actionIcon={<Plus size={16} />}
                        onAction={() => handleAddStock(stock)}
                      />
                    ))
                  ) : (
                    <div className="py-4 text-center text-sm text-muted-foreground">
                      No stocks found. Try a different search term.
                    </div>
                  )
                ) : (
                  <div className="space-y-3">
                    <p className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                      <Sparkles size={14} />
                      <span>Popular Stocks</span>
                    </p>
                    {popularStocks
                      .filter((stock) => !watchlist.some((s) => s.id === stock.id))
                      .map((stock) => (
                        <StockRow
                          key={stock.id}
                          stock={stock}
                          actionIcon={<Plus size={16} />}
                          onAction={() => handleAddStock(stock)}
                        />
                      ))}
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 pr-1">
          {watchlist.length > 0 ? (
            watchlist.map((stock) => (
              <StockRow
                key={stock.id}
                stock={stock}
                actionIcon={<X size={16} />}
                onAction={() => handleRemoveStock(stock.id)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Star size={40} className="mb-2 text-muted-foreground/50" />
              <p className="text-sm font-medium text-muted-foreground">
                Your watchlist is empty
              </p>
              <p className="text-xs text-muted-foreground">
                Add stocks to track their performance
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface StockRowProps {
  stock: Stock;
  actionIcon: React.ReactNode;
  onAction: () => void;
}

const StockRow = ({ stock, actionIcon, onAction }: StockRowProps) => {
  const isPositive = stock.change >= 0;

  return (
    <div className="flex items-center justify-between rounded-md border border-border bg-card p-3 transition-colors hover:bg-accent/50">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
          {stock.symbol.charAt(0)}
        </div>
        <div>
          <p className="font-medium">{stock.symbol}</p>
          <p className="text-xs text-muted-foreground">{stock.name}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="font-medium">${stock.price.toFixed(2)}</p>
          <div className="flex items-center gap-1">
            {isPositive ? (
              <TrendingUp
                size={12}
                className="text-success"
              />
            ) : (
              <TrendingDown
                size={12}
                className="text-destructive"
              />
            )}
            <p
              className={`text-xs ${
                isPositive ? "text-success" : "text-destructive"
              }`}
            >
              {isPositive ? "+" : ""}
              {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0 rounded-full"
          onClick={onAction}
        >
          {actionIcon}
        </Button>
      </div>
    </div>
  );
};

export default Watchlist;
