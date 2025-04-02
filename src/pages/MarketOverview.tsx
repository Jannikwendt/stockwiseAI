
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";

const MarketOverview = () => {
  return (
    <Layout title="Market Overview">
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <Card className="w-full animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <BarChart2 className="h-6 w-6 text-primary" />
              <span>Coming Soon: Market Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This page will provide comprehensive market data, sector performance,
              and trending stocks to help you make informed investment decisions.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default MarketOverview;
