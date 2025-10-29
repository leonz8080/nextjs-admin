interface EasyQueryModel {
    type: "table" | "row" | "value";
    source: string;
    permissions?: string[];
}

export const querys = new Map<string, EasyQueryModel>([
    [
        "getMonthUserAddUp",
        {
            type: "table",
            source: "select month, newUser news, retainUser retains, returnRate from MonthAddUp where month > ${start} order by id",
            permissions: ["admin", "userAnalysis"]
        }
    ],
    [
        "getChannelAddUp",
        {
            type: "table",
            source: "select channel name, newUser value from ChannelAddUp where month = ${month}",
            permissions: ["admin", "userAnalysis"]
        }
    ],
    [
        "getMonthSaleAddUp",
        {
            type: "table",
            source: "select month, sales, vipSales from MonthAddUp where month > ${start} order by id",
            permissions: ["admin", "salesAnalysis"]
        }
    ]
]);