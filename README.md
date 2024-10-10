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

| Option             | Type     | Description |
|--------------------|----------|-------------|
| columns            | Array    |             |
| showToolbar        | Boolean  |             |
| toolbarActions     | Array    |             |
| showColumnFilter   | Boolean  |             |
| filterTypes        | Object   |             |
| data               | Array    |             |
| srcUrl             | String   |             |
| srcMethod          | String   |             |
| srcHeaders         | Object   |             |
| srcConditions      | Array    |             |
| srcHandler         | Function |             |
| height             | String   |             |
| autoLoad           | Boolean  |             |
| pageSize           | Number   |             |
| pageSizes          | Array    |             |
| page               | Number   |             |
| tipCheckedStatus   | String   |             |
| tipPaging          | String   |             |
| tipNoData          | String   |             |
| tipEmptyValue      | String   |             |
| labelToolbarFilter | String   |             |
| labelPrevPage      | String   |             |
| labelNextPage      | String   |             |

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
