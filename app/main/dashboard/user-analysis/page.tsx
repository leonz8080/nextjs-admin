"use client";

import { DataCard } from "./data-card";
import { ChartMain } from "./chart-main";
import {
  Card,
} from "@/components/ui/card"

export default function Dashboard() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @4xl/main:grid-cols-4">
            <DataCard />
            <DataCard />
            <DataCard />
            <DataCard />
          </div>
          <div style={{ width: "100%", height: "350px" }} className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6">
            <Card className="@container/card w-full h-full">
              <ChartMain />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}