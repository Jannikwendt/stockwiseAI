
import React from "react";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, BrainCircuit, PieChart, BarChart3, Youtube, ArrowRight } from "lucide-react";
import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";

type EducationalModalProps = {
  title: string;
  description: string;
  content: {
    text: React.ReactNode;
    image?: string;
    video?: string;
  };
};

const EducationalModal = ({ title, description, content }: EducationalModalProps) => {
  return (
    <DialogContent className="max-w-4xl max-h-[85vh] overflow-auto">
      <DialogHeader>
        <DialogTitle className="text-2xl">{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>

      <Tabs defaultValue="text" className="mt-4">
        <TabsList className="mb-4">
          <TabsTrigger value="text" className="gap-1">
            <BookOpen size={16} />
            <span>Text</span>
          </TabsTrigger>
          {content.image && (
            <TabsTrigger value="image" className="gap-1">
              <BookOpen size={16} />
              <span>Visuals</span>
            </TabsTrigger>
          )}
          {content.video && (
            <TabsTrigger value="video" className="gap-1">
              <Youtube size={16} />
              <span>Video</span>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="text" className="text-left">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {content.text}
          </div>
          
          <Accordion type="single" collapsible className="mt-6">
            <AccordionItem value="related-topics">
              <AccordionTrigger className="text-base font-medium">
                Related Topics
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 py-2">
                  <div className="flex flex-col items-center p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(0,100,255,0.3)]">
                      <BrainCircuit className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-medium">Investment Basics</h3>
                    <p className="text-xs text-center text-muted-foreground mt-1">
                      Learn fundamental investing concepts
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-center p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(0,100,255,0.3)]">
                      <BarChart3 className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-medium">Chart Analysis</h3>
                    <p className="text-xs text-center text-muted-foreground mt-1">
                      How to read stock charts
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-center p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(0,100,255,0.3)]">
                      <PieChart className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-medium">Portfolio Building</h3>
                    <p className="text-xs text-center text-muted-foreground mt-1">
                      Creating a diversified portfolio
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="key-takeaways">
              <AccordionTrigger className="text-base font-medium">
                Key Takeaways
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Start investing early to take advantage of compound growth</li>
                  <li>Diversify your portfolio to manage risk</li>
                  <li>Consider your risk tolerance when selecting investments</li>
                  <li>Regularly review and rebalance your portfolio</li>
                  <li>Focus on long-term performance rather than short-term fluctuations</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        {content.image && (
          <TabsContent value="image" className="flex justify-center">
            <img 
              src={content.image} 
              alt={`Visual for ${title}`} 
              className="max-w-full max-h-[60vh] rounded-lg shadow-md" 
            />
          </TabsContent>
        )}

        {content.video && (
          <TabsContent value="video">
            <div className="aspect-video w-full">
              <iframe
                src={content.video}
                className="w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </TabsContent>
        )}
      </Tabs>
      
      <div className="mt-6 pt-4 border-t">
        <div className="text-sm text-muted-foreground mb-4">
          <p>
            Remember that investing involves risks, including the potential loss of principal. 
            Always do your own research and consider consulting with a financial advisor before making investment decisions.
          </p>
        </div>
        
        <Button className="w-full sm:w-auto animate-pulse hover:animate-none transition-all">
          <span>Explore Your Portfolio</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </DialogContent>
  );
};

export default EducationalModal;
