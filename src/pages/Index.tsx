
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
import EducationalModal from "@/components/EducationalModal";
import Tooltip from "@/components/Tooltip";

const Index = () => {
  const { toast } = useToast();
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  const dismissWelcome = () => {
    setShowWelcome(false);
    toast({
      title: "Welcome to StockWise AI!",
      description: "Your AI-powered investment assistant is ready to help.",
    });
  };

  const learningResources = {
    basics: {
      title: "Investment Basics",
      description: "Learn fundamental investing concepts for beginners",
      content: {
        text: (
          <>
            <h3>What is Investing?</h3>
            <p>
              Investing is the act of allocating resources, usually money, with the expectation of generating income or profit over time. Unlike saving, where you put money away in a safe place with minimal risk, investing involves putting your money to work to potentially earn a greater return.
            </p>
            
            <h3>Key Investment Terms</h3>
            <ul>
              <li>
                <Tooltip 
                  term="Stock" 
                  explanation="A stock represents partial ownership in a company. When you buy a stock, you're buying a small piece of that company."
                />: A share of ownership in a company
              </li>
              <li>
                <Tooltip 
                  term="Bond" 
                  explanation="Bonds are loans made to large organizations. When you purchase a bond, you are lending money to the issuer for a defined period of time at a fixed interest rate."
                />: A loan made to a company or government
              </li>
              <li>
                <Tooltip 
                  term="Mutual Fund" 
                  explanation="A mutual fund is a pool of money from many investors that is managed by professionals who invest in a diversified portfolio of securities."
                />: A collection of stocks or bonds managed professionally
              </li>
              <li>
                <Tooltip 
                  term="ETF" 
                  explanation="An ETF (Exchange-Traded Fund) is similar to a mutual fund but trades like a stock on an exchange, offering potentially lower fees and greater flexibility."
                />: Exchange-Traded Fund, trades like a stock
              </li>
              <li>
                <Tooltip 
                  term="Dividend" 
                  explanation="A dividend is a portion of a company's earnings that is paid to shareholders, usually in cash or additional shares."
                />: A payment made by a corporation to its shareholders
              </li>
            </ul>
            
            <h3>Investment Strategies for Beginners</h3>
            <ol>
              <li><strong>Dollar-Cost Averaging</strong>: Invest a fixed amount regularly, regardless of market conditions</li>
              <li><strong>Diversification</strong>: Spread investments across different asset classes to reduce risk</li>
              <li><strong>Long-term Investing</strong>: Focus on long-term growth rather than short-term gains</li>
              <li><strong>Index Investing</strong>: Invest in funds that track market indices for broad exposure</li>
            </ol>
            
            <h3>Understanding Risk and Return</h3>
            <p>
              Generally, investments with higher potential returns come with higher risks. Stocks typically offer higher returns than bonds but with greater volatility. Understanding your risk tolerance is crucial for building an appropriate investment portfolio.
            </p>
          </>
        ),
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&h=800",
        video: "https://www.youtube.com/embed/f5j9v9dfinQ"
      }
    },
    charts: {
      title: "Chart Analysis",
      description: "How to read and interpret stock charts",
      content: {
        text: (
          <>
            <h3>Understanding Stock Charts</h3>
            <p>
              Stock charts graphically display a security's price movement over time. Learning to read these charts can help you make more informed investment decisions.
            </p>
            
            <h3>Common Chart Types</h3>
            <ul>
              <li>
                <Tooltip 
                  term="Line Charts" 
                  explanation="The simplest form of chart that shows a line connecting closing prices over time."
                />: Shows closing prices connected by a line
              </li>
              <li>
                <Tooltip 
                  term="Bar Charts" 
                  explanation="Bar charts display the opening, high, low, and closing prices for each time period."
                />: Displays OHLC (Open, High, Low, Close) data
              </li>
              <li>
                <Tooltip 
                  term="Candlestick Charts" 
                  explanation="Similar to bar charts but with colored bodies that show the relationship between opening and closing prices."
                />: Shows price movement with colored bodies
              </li>
            </ul>
            
            <h3>Key Chart Elements</h3>
            <ul>
              <li><strong>Price Scale</strong>: The vertical axis showing price levels</li>
              <li><strong>Time Scale</strong>: The horizontal axis showing time periods</li>
              <li><strong>Volume</strong>: Bars at the bottom showing trading activity</li>
              <li><strong>Moving Averages</strong>: Lines showing average price over specified periods</li>
              <li><strong>Support and Resistance</strong>: Price levels where stocks historically reverse direction</li>
            </ul>
            
            <h3>Basic Chart Patterns</h3>
            <ul>
              <li><strong>Uptrend</strong>: Series of higher highs and higher lows</li>
              <li><strong>Downtrend</strong>: Series of lower highs and lower lows</li>
              <li><strong>Consolidation</strong>: Sideways movement indicating balance between buyers and sellers</li>
              <li><strong>Breakout</strong>: When price moves above or below a consolidation area</li>
            </ul>
            
            <h3>Beginner Tips for Chart Reading</h3>
            <ol>
              <li>Start with longer-term charts (weekly, monthly) to get perspective</li>
              <li>Look for obvious trends before analyzing details</li>
              <li>Consider volume alongside price movements</li>
              <li>Remember that past performance doesn't guarantee future results</li>
              <li>Use charts as one tool among many for decision-making</li>
            </ol>
          </>
        ),
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&h=800",
        video: "https://www.youtube.com/embed/Xxjp_DX8G8U"
      }
    },
    portfolio: {
      title: "Portfolio Building",
      description: "Creating a diversified investment portfolio",
      content: {
        text: (
          <>
            <h3>Building a Strong Investment Portfolio</h3>
            <p>
              A well-constructed investment portfolio balances risk and return according to your financial goals, time horizon, and risk tolerance.
            </p>
            
            <h3>Asset Allocation</h3>
            <p>
              Asset allocation is the process of dividing your investments among different asset classes:
            </p>
            <ul>
              <li>
                <Tooltip 
                  term="Stocks" 
                  explanation="Stocks offer higher potential returns but with greater volatility and risk."
                />: Higher growth potential with higher risk
              </li>
              <li>
                <Tooltip 
                  term="Bonds" 
                  explanation="Bonds typically provide more stable returns than stocks, with lower risk but also lower potential returns."
                />: More stable returns with lower risk
              </li>
              <li>
                <Tooltip 
                  term="Cash & Equivalents" 
                  explanation="Cash and cash equivalents (like money market funds) offer the lowest risk but also the lowest return potential."
                />: Highest liquidity, lowest risk and return
              </li>
              <li>
                <Tooltip 
                  term="Alternative Investments" 
                  explanation="Alternative investments include real estate, commodities, and other non-traditional assets that may perform differently from traditional stocks and bonds."
                />: Real estate, commodities, etc.
              </li>
            </ul>
            
            <h3>Diversification Strategies</h3>
            <ol>
              <li><strong>Across Asset Classes</strong>: Mix stocks, bonds, and other assets</li>
              <li><strong>Within Asset Classes</strong>: Invest in different sectors, industries, and geographic regions</li>
              <li><strong>By Investment Style</strong>: Balance growth, value, and income investments</li>
              <li><strong>By Company Size</strong>: Include large, mid, and small-cap companies</li>
              <li><strong>Internationally</strong>: Invest in both domestic and international markets</li>
            </ol>
            
            <h3>Portfolio Examples by Risk Profile</h3>
            <ul>
              <li><strong>Conservative</strong>: 20-30% stocks, 60-70% bonds, 10% cash</li>
              <li><strong>Moderate</strong>: 50-60% stocks, 35-45% bonds, 5% cash</li>
              <li><strong>Aggressive</strong>: 70-80% stocks, 15-25% bonds, 5% cash</li>
            </ul>
            
            <h3>Rebalancing Your Portfolio</h3>
            <p>
              Over time, some investments will grow faster than others, changing your asset allocation. Rebalancing involves periodically adjusting your portfolio back to your target allocation, typically annually.
            </p>
            
            <h3>Common Portfolio Mistakes to Avoid</h3>
            <ul>
              <li>Lack of diversification</li>
              <li>Attempting to time the market</li>
              <li>Letting emotions drive investment decisions</li>
              <li>Ignoring fees and tax implications</li>
              <li>Failing to adjust your strategy as your goals change</li>
            </ul>
          </>
        ),
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&h=800",
        video: "https://www.youtube.com/embed/Hc_HVZqrVPQ"
      }
    }
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
                  <Dialog open={activeDialog === 'basics'} onOpenChange={(open) => setActiveDialog(open ? 'basics' : null)}>
                    <DialogTrigger asChild>
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
                    </DialogTrigger>
                    <EducationalModal {...learningResources.basics} />
                  </Dialog>
                  
                  <Dialog open={activeDialog === 'charts'} onOpenChange={(open) => setActiveDialog(open ? 'charts' : null)}>
                    <DialogTrigger asChild>
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
                    </DialogTrigger>
                    <EducationalModal {...learningResources.charts} />
                  </Dialog>
                  
                  <Dialog open={activeDialog === 'portfolio'} onOpenChange={(open) => setActiveDialog(open ? 'portfolio' : null)}>
                    <DialogTrigger asChild>
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
                    </DialogTrigger>
                    <EducationalModal {...learningResources.portfolio} />
                  </Dialog>
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
