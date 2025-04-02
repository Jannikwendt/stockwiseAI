
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";

const Alerts = () => {
  return (
    <Layout title="Alerts">
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <Card className="w-full animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Bell className="h-6 w-6 text-primary" />
              <span>Coming Soon: Personalized Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Set up custom price alerts, earnings notifications, and market movement warnings
              to stay informed about important changes to your investments.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Alerts;
