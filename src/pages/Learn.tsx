
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

const Learn = () => {
  return (
    <Layout title="Learn">
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <Card className="w-full animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <BookOpen className="h-6 w-6 text-primary" />
              <span>Coming Soon: Investment Learning Center</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Access educational resources, tutorials, and market insights to improve your
              investment knowledge and make better financial decisions.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Learn;
