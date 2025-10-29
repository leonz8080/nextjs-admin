"use client";

import { useState, useEffect, useRef } from 'react';

import { UserCard, CardDataModel } from "./user-card";
import { UserChart, ChartDataModel } from "./user-chart";
import { ChannelPie, PieDataModel } from "./channel-pie";
import { UserFunnel, FunnelDataModel } from "./user-funnel";
import {
  Card,
} from "@/components/ui/card"

import { request } from "@/lib/client/utils"

import { useLanguageStore } from "@/hooks/use-global-store";
import { useLocale, useTranslations } from 'next-intl';

export default function UserAnalysis() {
  const t = useTranslations();

  const [chartData, setChartData] = useState<ChartDataModel[]>([]);
  const [pieData, setPieData] = useState<PieDataModel[]>([]);

  const userTotal: CardDataModel = {
    title: t("total-users"),
    amount: '26,390',
    unit: t("month"),
    margin: 5.6
  }

  const newUser: CardDataModel = {
    title: t("new-users"),
    amount: '396',
    unit: t("month"),
    margin: -6
  }

  const retention: CardDataModel = {
    title: t("active-users"),
    amount: '1,130',
    unit: t("day"),
    margin: 15
  }

  const payingUser: CardDataModel = {
    title: t("unique-visitors"),
    amount: '9,801',
    unit: t("day"),
    margin: 8
  }

  const funnelData: FunnelDataModel[] = [
    { name: t("visit"), value: 2867 },
    { name: t("sign-up"), value: 1298 },
    { name: t("conversion"), value: 305 },
    { name: t("repeat-purchase"), value: 197 },
  ]

  async function get() {
    var res = await request('easyQuery', {
      querys: [
        {
          name: 'getMonthUserAddUp',
          params: {
            start: '2024.08',
          }
        },
        {
          name: 'getChannelAddUp',
          params: {
            month: '2025.10',
          }
        },
      ]
    });

    if (res.result != 0 || !res.data) {
      return
    }

    if (res.data.getMonthUserAddUp.result !== 1) {
      setChartData(res.data.getMonthUserAddUp.data);
    }
    if (res.data.getMonthUserAddUp.result !== 1) {
      setPieData(res.data.getChannelAddUp.data);
    }
  }

  useEffect(() => {
    get();
  }, []);

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