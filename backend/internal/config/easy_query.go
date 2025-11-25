package config

type EasyQuery struct {
	Type        string
	Source      string
	Permissions []string
}

var EasyQuerys = map[string]EasyQuery{
	"getMonthUserAddUp": {
		Type:        "table",
		Source:      "select month, new_user news, retain_user retains, return_rate returnRate from month_add_ups where month > ${start} order by id",
		Permissions: []string{"admin", "userAnalysis"},
	},
	"getChannelAddUp": {
		Type:        "table",
		Source:      "select channel name, new_user value from channel_add_ups where month = ${month}",
		Permissions: []string{"admin", "userAnalysis"},
	},
	"getMonthSaleAddUp": {
		Type:        "table",
		Source:      "select month, sales, vip_sales vipSales from month_add_ups where month > ${start} order by id",
		Permissions: []string{"admin", "salesAnalysis"},
	},
}
