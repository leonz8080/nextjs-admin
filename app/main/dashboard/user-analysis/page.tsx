"use client";

import { UserCard, CardDataModel } from "./user-card";
import { UserChart, ChartDataModel } from "./user-chart";
import { ChannelPie, PieDataModel } from "./channel-pie";
import { UserFunnel, FunnelDataModel } from "./user-funnel";
import {
  Card,
} from "@/components/ui/card"

export default function UserAnalysis() {

  const userTotal: CardDataModel = {
    title: 'Total Users',
    amount: '26,390',
    unit: 'month',
    margin: 5.6
  }

  const newUser: CardDataModel = {
    title: 'New Users',
    amount: '396',
    unit: 'month',
    margin: -6
  }

  const retention: CardDataModel = {
    title: 'Active Users',
    amount: '1,130',
    unit: 'day',
    margin: 15
  }

  const payingUser: CardDataModel = {
    title: 'Unique Visitors',
    amount: '9,801',
    unit: 'day',
    margin: 8
  }

  const chartData: ChartDataModel[] = [
    { month: '2024.10', news: 336, retains: 236, returnRate: 77 },
    { month: '2024.11', news: 312, retains: 189, returnRate: 67 },
    { month: '2024.12', news: 368, retains: 216, returnRate: 70 },
    { month: '2025.1', news: 304, retains: 190, returnRate: 74 },
    { month: '2025.2', news: 250, retains: 166, returnRate: 61 },
    { month: '2025.3', news: 298, retains: 198, returnRate: 72 },
    { month: '2025.4', news: 260, retains: 149, returnRate: 74 },
    { month: '2025.5', news: 347, retains: 201, returnRate: 59 },
    { month: '2025.6', news: 311, retains: 254, returnRate: 66 },
    { month: '2025.7', news: 288, retains: 196, returnRate: 67 },
    { month: '2025.8', news: 265, retains: 192, returnRate: 58 },
    { month: '2025.9', news: 274, retains: 174, returnRate: 65 },
    { month: '2025.10', news: 248, retains: 159, returnRate: 62 },
  ]

  const pieData: PieDataModel[] = [
    { name: 'Search Engine', value: 1063 },
    { name: 'Social Media', value: 759 },
    { name: 'Offline Channels', value: 475 },
    { name: 'Content Community', value: 839 },
    { name: 'Own Channels', value: 550 },
    { name: 'Advertising', value: 1236 },
  ]

  const funnelData: FunnelDataModel[] = [
    { name: 'Visit', value: 2867 },
    { name: 'Sign-up', value: 1298 },
    { name: 'Conversion', value: 305 },
    { name: 'Repeat Purchase', value: 197 },
  ]

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @4xl/main:grid-cols-4">
            <UserCard data={userTotal} />
            <UserCard data={newUser} />
            <UserCard data={retention} />
            <UserCard data={payingUser} />
          </div>
          <div style={{ width: "100%", height: "350px" }} className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6">
            <Card className="@container/card w-full h-full">
              <UserChart data={chartData} />
            </Card>
          </div>
          <div style={{ width: "100%", height: "250px" }} className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-1 @4xl/main:grid-cols-2">
            <Card className="@container/card w-full h-full py-0 px-0">
              <ChannelPie data={pieData} />
            </Card>
            <Card className="@container/card w-full h-full py-0 px-0">
              <UserFunnel data={funnelData} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}