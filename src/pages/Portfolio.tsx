
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from "lucide-react";

const Portfolio = () => {
  return (
    <Layout title="My Portfolio">
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <Card className="w-full animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <PieChart className="h-6 w-6 text-primary" />
              <span>Coming Soon: Portfolio Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Track your investments, analyze performance, and get personalized recommendations
              to optimize your portfolio for better returns.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Portfolio;
