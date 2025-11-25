package controller

import (
	"fmt"
	"regexp"
	"strings"

	"github.com/gin-gonic/gin"

	"nextjs-admin-go/internal/config"
	"nextjs-admin-go/internal/pkg"
)

type EasyQueryForm struct {
	Name   string                 `form:"name" binding:"required"`
	Params map[string]interface{} `form:"params" binding:"required"`
}

func (bc *BaseController) EasyQuery(c *gin.Context) {
	req, err := BindRequest[struct {
		Querys []EasyQueryForm `form:"querys" binding:"required"`
	}](c)
	if err != nil {
		c.JSON(200, gin.H{"result": 400, "message": "Bad request"})
		return
	}

	res := make(map[string]interface{})

	for _, item := range req.Data.Querys {
		query, ok := config.EasyQuerys[item.Name]
		if !ok {
			res[item.Name] = map[string]interface{}{"result": 1, "message": "query-not-found"}
			continue
		}

		if len(req.Permission) > 0 && len(query.Permissions) > 0 {
			if !pkg.HasIntersection(req.Permission, query.Permissions) {
				res[item.Name] = map[string]interface{}{"result": 1, "message": "query-permission"}
				continue
			}
		}

		sqlParsed, args, err := ParseSQLWithParams(query.Source, item.Params)
		if err != nil {
			res[item.Name] = map[string]interface{}{"result": 1, "message": "fail"}
			continue
		}

		rows, err := bc.DB.Raw(sqlParsed, args...).Rows()
		if err != nil {
			res[item.Name] = map[string]interface{}{"result": 1, "message": "fail"}
			continue
		}

		columns, _ := rows.Columns()
		result := []map[string]interface{}{}
		for rows.Next() {
			vals := make([]interface{}, len(columns))
			valPtrs := make([]interface{}, len(columns))

			for i := range vals {
				valPtrs[i] = &vals[i]
			}

			if err := rows.Scan(valPtrs...); err != nil {
				panic(err)
			}

			m := make(map[string]interface{})
			for i, col := range columns {
				m[col] = vals[i]
			}

			result = append(result, m)
		}

		if query.Type == "table" {
			res[item.Name] = map[string]interface{}{"result": 0, "data": result}
		}
		if query.Type == "row" {
			res[item.Name] = map[string]interface{}{"result": 0, "data": result[0]}
		}
		if query.Type == "value" {
			if val, ok := GetFirstCell(result); ok {
				res[item.Name] = map[string]interface{}{"result": 0, "data": val}
			} else {
				res[item.Name] = map[string]interface{}{"result": 1, "message": "fail"}
			}
		}
	}

	c.JSON(200, gin.H{"result": 0, "message": "successful", "data": res})
}

func ParseSQLWithParams(rawSQL string, params map[string]interface{}) (string, []interface{}, error) {
	re := regexp.MustCompile(`\$\{(\w+)\}`)
	matches := re.FindAllStringSubmatch(rawSQL, -1)

	args := []interface{}{}
	usedKeys := make(map[string]bool)

	for _, m := range matches {
		key := m[1]

		value, ok := params[key]
		if !ok {
			return "", nil, fmt.Errorf("missing param for key: %s", key)
		}

		rawSQL = strings.Replace(rawSQL, m[0], "?", 1)

		args = append(args, value)
		usedKeys[key] = true
	}

	for k := range params {
		if !usedKeys[k] {
			// fmt.Printf("warning: param %s not used in SQL\n", k)
		}
	}

	return rawSQL, args, nil
}

func GetFirstCell(data []map[string]interface{}, columns ...string) (interface{}, bool) {
	if len(data) == 0 {
		return nil, false
	}

	firstRow := data[0]
	if len(firstRow) == 0 {
		return nil, false
	}

	if len(columns) > 0 {
		for _, col := range columns {
			if val, ok := firstRow[col]; ok {
				return val, true
			}
		}
		return nil, false
	}

	for _, val := range firstRow {
		return val, true
	}

	return nil, false
}
