package lib

import (
	"context"
	"github.com/groovili/gogtrends"
)

func GetTrends(phrases []string) []int {
	items := []*gogtrends.ComparisonItem{}

	for _, phrase := range phrases {
		items = append(items, &gogtrends.ComparisonItem{
			Keyword: phrase,
			Geo:     "US",
			Time:    "today+12-m",
		})
	}

	ctx := context.Background()
	explore, err := gogtrends.Explore(ctx,
		&gogtrends.ExploreRequest{
			ComparisonItems: items,
			Category:        0,
			Property:        "",
		}, "EN")
	if err != nil {
		panic(err)
	}
	l, err := gogtrends.InterestOverTime(ctx, explore[0], "EN")
	if err != nil {
		panic(err)
	}
	return l[len(l)-1].Value
}
