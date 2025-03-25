
import React from "react";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, PlayCircle } from "lucide-react";
import Tooltip from "@/components/Tooltip";

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
              <PlayCircle size={16} />
              <span>Video</span>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="text" className="text-left">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {content.text}
          </div>
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
    </DialogContent>
  );
};

export default EducationalModal;
