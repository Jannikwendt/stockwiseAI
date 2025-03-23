
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Sample data for comparison
const comparisonData = [
  {
    name: "Price Change (%)",
    AAPL: 15.3,
    MSFT: 23.7,
    AMZN: 10.5,
    GOOGL: 18.2,
  },
  {
    name: "P/E Ratio",
    AAPL: 29.5,
    MSFT: 33.8,
    AMZN: 42.1,
    GOOGL: 24.7,
  },
  {
    name: "Dividend Yield (%)",
    AAPL: 0.54,
    MSFT: 0.72,
    AMZN: 0,
    GOOGL: 0.62,
  },
  {
    name: "Revenue Growth (%)",
    AAPL: 7.8,
    MSFT: 12.5,
    AMZN: 15.2,
    GOOGL: 9.7,
  },
  {
    name: "Profit Margin (%)",
    AAPL: 25.3,
    MSFT: 41.5,
    AMZN: 8.5,
    GOOGL: 28.9,
  },
];

// Sample performance data
const generatePerformanceData = () => {
  const data = [];
  for (let i = 0; i < 12; i++) {
    const month = new Date(2023, i, 1).toLocaleDateString('en-US', { month: 'short' });
    data.push({
      month,
      AAPL: 100 + Math.random() * 50 - 10,
      MSFT: 100 + Math.random() * 60 - 5,
      AMZN: 100 + Math.random() * 40 - 15,
      GOOGL: 100 + Math.random() * 45 - 8,
    });
  }
  return data;
};

const performanceData = generatePerformanceData();

const stockColors: Record<string, string> = {
  AAPL: "#34C759",
  MSFT: "#007AFF",
  AMZN: "#FF9500",
  GOOGL: "#FF2D55",
};

interface StockComparisonProps {
  className?: string;
}

const StockComparison = ({ className }: StockComparisonProps) => {
  const [selectedStocks, setSelectedStocks] = useState<string[]>(["AAPL", "MSFT"]);
  const [metric, setMetric] = useState<string>("price");

  const handleStockChange = (index: number, value: string) => {
    setSelectedStocks((prev) => {
      const newStocks = [...prev];
      newStocks[index] = value;
      return newStocks;
    });
  };

  const availableStocks = ["AAPL", "MSFT", "AMZN", "GOOGL"].filter(
    (stock) => !selectedStocks.includes(stock)
  );

  const getMetricData = () => {
    switch (metric) {
      case "price":
        return performanceData;
      default:
        return comparisonData;
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((item: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: item.color }}>
              <span className="font-medium">{item.name}:</span>{" "}
              {isNaN(item.value) ? "N/A" : item.value.toFixed(2)}
              {metric === "price" ? "" : metric === "dividend" ? "%" : ""}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>Stock Comparison</CardTitle>
        <CardDescription>Compare key metrics across different stocks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[0, 1].map((index) => (
            <div key={index} className="space-y-2">
              <Label>Stock {index + 1}</Label>
              <Select
                value={selectedStocks[index] || ""}
                onValueChange={(value) => handleStockChange(index, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a stock" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={selectedStocks[index]}>
                    {selectedStocks[index]}
                  </SelectItem>
                  {availableStocks.map((stock) => (
                    <SelectItem key={stock} value={stock}>
                      {stock}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="fundamentals">Fundamentals</TabsTrigger>
          </TabsList>
          <TabsContent value="performance" className="mt-4">
            <p className="mb-4 text-sm text-muted-foreground">
              Normalized performance comparison (starting at 100)
            </p>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  {selectedStocks.map((stock) => (
                    <Line
                      key={stock}
                      type="monotone"
                      dataKey={stock}
                      stroke={stockColors[stock]}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="fundamentals" className="mt-4">
            <div className="mb-4">
              <Label>Metric</Label>
              <Select value={metric} onValueChange={setMetric}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Price Change (%)</SelectItem>
                  <SelectItem value="pe">P/E Ratio</SelectItem>
                  <SelectItem value="dividend">Dividend Yield (%)</SelectItem>
                  <SelectItem value="revenue">Revenue Growth (%)</SelectItem>
                  <SelectItem value="margin">Profit Margin (%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={comparisonData.filter((item) => {
                    switch (metric) {
                      case "price":
                        return item.name === "Price Change (%)";
                      case "pe":
                        return item.name === "P/E Ratio";
                      case "dividend":
                        return item.name === "Dividend Yield (%)";
                      case "revenue":
                        return item.name === "Revenue Growth (%)";
                      case "margin":
                        return item.name === "Profit Margin (%)";
                      default:
                        return item.name === "Price Change (%)";
                    }
                  })}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  {selectedStocks.map((stock) => (
                    <Bar
                      key={stock}
                      dataKey={stock}
                      fill={stockColors[stock]}
                      radius={[4, 4, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              <p className="mb-1 font-medium">Understanding this metric:</p>
              {metric === "price" && (
                <p>Price change shows the percentage increase or decrease in stock price over the past year.</p>
              )}
              {metric === "pe" && (
                <p>Price-to-Earnings (P/E) ratio measures a company's current share price relative to its per-share earnings. A higher P/E could mean investors expect higher growth in the future.</p>
              )}
              {metric === "dividend" && (
                <p>Dividend yield represents annual dividend income relative to share price, expressed as a percentage. Higher yields provide more income but may indicate slower growth.</p>
              )}
              {metric === "revenue" && (
                <p>Revenue growth shows the percentage increase in a company's revenue compared to the previous year, indicating business expansion.</p>
              )}
              {metric === "margin" && (
                <p>Profit margin represents the percentage of revenue that translates into profit. Higher margins indicate more efficient operations and pricing power.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StockComparison;
