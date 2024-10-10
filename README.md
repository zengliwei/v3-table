# v3-d-table

A data table component for Vue 3.x.

## Features

- [x] Selectable
- [x] Responsive
- [x] i18n support
- [x] Custom toolbar
- [x] Fixed columns supported
- [x] Column filter supported
- [x] Custom column template/renderer supported

## Configuration

### Table Options

| Option           | Type     | Required | Default                                      | Description |
|------------------|----------|----------|----------------------------------------------|-------------|
| columns          | Array    | true     | -                                            |             |
| showToolbar      | Boolean  | false    | true                                         |             |
| toolbarActions   | Array    | false    | []                                           |             |
| showColumnFilter | Boolean  | false    | true                                         |             |
| filterTypes      | Object   | false    | -                                            |             |
| data             | Array    | false    | -                                            |             |
| srcUrl           | String   | false    | -                                            |             |
| srcMethod        | String   | false    | GET                                          |             |
| srcHeaders       | Object   | false    | {Accept: 'application/json'}                 |             |
| srcConditions    | Array    | false    | -                                            |             |
| srcHandler       | Function | false    | -                                            |             |
| height           | String   | false    | -                                            |             |
| autoLoad         | Boolean  | false    | true                                         |             |
| pageSize         | Number   | false    | 50                                           |             |
| pageSizes        | Array    | false    | [20, 50, 100, 200]                           |             |
| page             | Number   | false    | 1                                            |             |
| tipCheckedStatus | String   | false    | :checked item(s) checked                     |             |
| tipPaging        | String   | false    | Page :page of :page_count (:row_total items) |             |
| tipNoData        | String   | false    | No matched data                              |             |
| tipEmptyValue    | String   | false    | -                                            |             |
| labelPrevPage    | String   | false    | Prev                                         |             |
| labelNextPage    | String   | false    | Next                                         |             |

### Column Options

| Option     | Type    | Description                                               |
|------------|---------|-----------------------------------------------------------|
| type       | String  | Optional types are `checkbox`, `index`, `actions`, `data` |
| code       | String  | Column name                                               |
| field      | String  | Field name or expression for data column                  |
| hidden     | Boolean | Whether the column is hidden                              |
| title      | String  | Column title                                              |
| align      | String  | Text align                                                |
| width      | String  | Column width with unit px                                 |
| fixed      | String  | Optional fixed positions are `left`, `right`              |
| filter     | String  | Filter settings                                           |
| sort       | Boolean | Whether the column is sortable                            |
| gbk        | Boolean | Whether the column is sorted by gbk                       |
| sortDir    | String  | Default sort direction                                    |
| renderer   | String  | Cell renderer                                             |
| expandable | Boolean | Whether the column shows expandable icon                  |
| actions    | String  | Row actions                                               |

## Events

| Event Name      | Description |
|-----------------|-------------|
| row-click       |             |
| row-dblclick    |             |
| row-mouseenter  |             |
| row-mouseleave  |             |
| cell-click      |             |
| cell-dblclick   |             |
| cell-mouseenter |             |
| cell-mouseleave |             |
