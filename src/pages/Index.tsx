
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatInterface from "@/components/ChatInterface";
import StockChart from "@/components/StockChart";
import Watchlist from "@/components/Watchlist";
import RiskAssessment from "@/components/RiskAssessment";
import StockComparison from "@/components/StockComparison";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, ChevronDown, HelpCircle, PieChart, Search, TrendingUp } from "lucide-react";

const Index = () => {
  const { toast } = useToast();
  const [showWelcome, setShowWelcome] = useState(true);

  const dismissWelcome = () => {
    setShowWelcome(false);
    toast({
      title: "Welcome to StockWise AI!",
      description: "Your AI-powered investment assistant is ready to help.",
    });
  };

  return (
    <Layout title="StockWise AI">
      <div className="container mx-auto max-w-7xl px-4 py-6">
        {showWelcome && (
          <div className="mb-8 animate-fade-in rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Welcome to <span className="text-primary">StockWise AI</span>
                </h1>
                <p className="mt-2 max-w-2xl text-muted-foreground">
                  Your personal AI investment assistant. Get personalized stock recommendations,
                  market insights, and learn investment concepts in simple terms.
                </p>
              </div>
              <Button onClick={dismissWelcome} className="gap-1">
                Get Started
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Tabs defaultValue="chat" className="w-full">
              <TabsList className="mb-4 w-full max-w-md">
                <TabsTrigger value="chat" className="gap-1">
                  <Search size={16} />
                  <span>AI Assistant</span>
                </TabsTrigger>
                <TabsTrigger value="charts" className="gap-1">
                  <BarChart3 size={16} />
                  <span>Market Data</span>
                </TabsTrigger>
                <TabsTrigger value="compare" className="gap-1">
                  <TrendingUp size={16} />
                  <span>Compare</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="chat" className="h-[650px] rounded-lg border">
                <ChatInterface />
              </TabsContent>
              
              <TabsContent value="charts">
                <div className="space-y-6">
                  <StockChart symbol="AAPL" name="Apple Inc." />
                  
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Apple Inc. at a Glance</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Market Cap</span>
                            <span className="font-medium">$2.78T</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">P/E Ratio</span>
                            <span className="font-medium">29.5</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Dividend Yield</span>
                            <span className="font-medium">0.54%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">52-Week High</span>
                            <span className="font-medium">$198.23</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">52-Week Low</span>
                            <span className="font-medium">$143.90</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Analyst Recommendations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex h-[140px] flex-col items-center justify-center gap-2">
                          <div className="flex h-8 w-full items-center gap-2">
                            <span className="w-16 text-sm">Buy</span>
                            <div className="h-full flex-grow rounded-full bg-secondary">
                              <div className="h-full w-[75%] rounded-full bg-success"></div>
                            </div>
                            <span className="text-sm font-medium">75%</span>
                          </div>
                          <div className="flex h-8 w-full items-center gap-2">
                            <span className="w-16 text-sm">Hold</span>
                            <div className="h-full flex-grow rounded-full bg-secondary">
                              <div className="h-full w-[20%] rounded-full bg-warning"></div>
                            </div>
                            <span className="text-sm font-medium">20%</span>
                          </div>
                          <div className="flex h-8 w-full items-center gap-2">
                            <span className="w-16 text-sm">Sell</span>
                            <div className="h-full flex-grow rounded-full bg-secondary">
                              <div className="h-full w-[5%] rounded-full bg-destructive"></div>
                            </div>
                            <span className="text-sm font-medium">5%</span>
                          </div>
                        </div>
                        <p className="mt-4 text-xs text-muted-foreground">
                          Based on 32 Wall Street analysts offering 12-month price targets
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="compare">
                <StockComparison />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="flex flex-col gap-6">
            <Watchlist />
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full gap-2">
                  <PieChart size={16} />
                  <span>Risk Assessment</span>
                  <ChevronDown size={14} className="ml-auto" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                  <DialogTitle>Investor Risk Profile</DialogTitle>
                </DialogHeader>
                <RiskAssessment />
              </DialogContent>
            </Dialog>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Learning Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <button className="flex w-full items-center justify-between rounded-md border border-border p-3 text-left transition-colors hover:bg-accent/50">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <HelpCircle size={16} />
                      </div>
                      <div>
                        <p className="font-medium">Investment Basics</p>
                        <p className="text-xs text-muted-foreground">
                          Learn fundamental investing concepts
                        </p>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-muted-foreground" />
                  </button>
                  
                  <button className="flex w-full items-center justify-between rounded-md border border-border p-3 text-left transition-colors hover:bg-accent/50">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <BarChart3 size={16} />
                      </div>
                      <div>
                        <p className="font-medium">Chart Analysis</p>
                        <p className="text-xs text-muted-foreground">
                          How to read stock charts
                        </p>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-muted-foreground" />
                  </button>
                  
                  <button className="flex w-full items-center justify-between rounded-md border border-border p-3 text-left transition-colors hover:bg-accent/50">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <TrendingUp size={16} />
                      </div>
                      <div>
                        <p className="font-medium">Portfolio Building</p>
                        <p className="text-xs text-muted-foreground">
                          Creating a diversified portfolio
                        </p>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-muted-foreground" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
