
import React, { useState } from "react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, 
  BarChart, Bar
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Sample data
const generateData = (days: number, trend: 'up' | 'down' | 'volatile' = 'up') => {
  const data = [];
  let value = 150;
  
  for (let i = 0; i < days; i++) {
    let change;
    
    if (trend === 'up') {
      change = (Math.random() * 6) - 2; // Mostly up
    } else if (trend === 'down') {
      change = (Math.random() * 6) - 4; // Mostly down
    } else {
      change = (Math.random() * 10) - 5; // Volatile
    }
    
    value += change;
    value = Math.max(value, 50); // Ensure value doesn't go too low
    
    data.push({
      date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: parseFloat(value.toFixed(2)),
      volume: Math.floor(Math.random() * 10000) + 5000
    });
  }
  
  return data;
};

const appleData = generateData(30, 'up');
const microsoftData = generateData(30, 'volatile');
const teslaData = generateData(30, 'down');

type ChartPeriod = '1D' | '1W' | '1M' | '3M' | '1Y' | '5Y';

interface StockChartProps {
  symbol?: string;
  name?: string;
  className?: string;
}

const StockChart = ({
  symbol = "AAPL",
  name = "Apple Inc.",
  className
}: StockChartProps) => {
  const [period, setPeriod] = useState<ChartPeriod>('1M');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  
  // Select dataset based on symbol
  const getStockData = () => {
    switch (symbol) {
      case 'MSFT':
        return microsoftData;
      case 'TSLA':
        return teslaData;
      default:
        return appleData;
    }
  };
  
  const stockData = getStockData();
  
  // Get appropriate data slice based on selected period
  const getChartData = () => {
    switch (period) {
      case '1D':
        return stockData.slice(-1);
      case '1W':
        return stockData.slice(-7);
      case '1M':
        return stockData;
      case '3M':
        return stockData;
      case '1Y':
        return stockData;
      case '5Y':
        return stockData;
      default:
        return stockData;
    }
  };
  
  const chartData = getChartData();
  
  // Calculate metrics
  const currentPrice = chartData[chartData.length - 1]?.value || 0;
  const previousPrice = chartData[0]?.value || 0;
  const priceChange = currentPrice - previousPrice;
  const percentageChange = ((priceChange / previousPrice) * 100).toFixed(2);
  const isPositive = priceChange >= 0;
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-foreground">
            <span className="font-medium">Price:</span> ${payload[0].value}
          </p>
          {chartType === 'bar' && (
            <p className="text-sm text-foreground">
              <span className="font-medium">Volume:</span> {payload[0].payload.volume.toLocaleString()}
            </p>
          )}
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {name}
              <span className="text-sm font-normal text-muted-foreground">
                {symbol}
              </span>
            </CardTitle>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-2xl font-semibold">${currentPrice.toFixed(2)}</span>
              <span
                className={cn(
                  "text-sm font-medium",
                  isPositive ? "text-success" : "text-destructive"
                )}
              >
                {isPositive ? "+" : ""}{priceChange.toFixed(2)} ({percentageChange}%)
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={chartType === 'line' ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setChartType('line')}
              className="h-8 px-2"
            >
              Line
            </Button>
            <Button
              variant={chartType === 'bar' ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setChartType('bar')}
              className="h-8 px-2"
            >
              Volume
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4 pt-2">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={chartData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis 
                  dataKey="date" 
                  tickMargin={10}
                  tickFormatter={(value) => value}
                  style={{ fontSize: '0.75rem' }}
                />
                <YAxis 
                  domain={['auto', 'auto']} 
                  tickFormatter={(value) => `$${value}`}
                  width={50}
                  style={{ fontSize: '0.75rem' }}
                />
                <RechartsTooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            ) : (
              <BarChart data={chartData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis 
                  dataKey="date" 
                  tickMargin={10}
                  style={{ fontSize: '0.75rem' }}
                />
                <YAxis 
                  tickFormatter={(value) => `${value}`}
                  width={50}
                  style={{ fontSize: '0.75rem' }}
                />
                <RechartsTooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="volume" 
                  fill="hsl(var(--primary))" 
                  opacity={0.8}
                  barSize={20}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 flex justify-center">
          <div className="inline-flex rounded-md shadow-sm">
            {(['1D', '1W', '1M', '3M', '1Y', '5Y'] as ChartPeriod[]).map((p) => (
              <Button
                key={p}
                variant={period === p ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setPeriod(p)}
                className={cn(
                  "h-8 px-3 text-xs font-medium transition-all",
                  period === p && "font-semibold"
                )}
              >
                {p}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockChart;
