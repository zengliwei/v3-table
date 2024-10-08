# v3-d-table

A data table component for Vue 3.x.

## Features

- [x] i18n support
- [x] Custom toolbar
- [x] Checkbox column supported
- [x] Fixed columns supported
- [x] Column filter supported
- [x] Custom column template/renderer supported
- [x] Scrollable by vertical and horizontal
- [x] Child items supported

## Configuration

### Table Options

| Option            | Type     | Default                                      | Description                                                             |
|-------------------|----------|----------------------------------------------|-------------------------------------------------------------------------|
| columns           | Array    | -                                            | An array of column settings, see Column Options                         |
| height            | String   | -                                            | Set table height with css style expression                              |
| showToolbar       | Boolean  | true                                         | Whether to show the toolbar at top of the table                         |
| toolbarActions    | Array    | []                                           | Toolbar actions for selected items                                      |
| showColumnFilter  | Boolean  | true                                         | Whether to show the column filter below the table captions              |
| customFilterTypes | Object   | -                                            | Define custom filter types for column filter                            |
| data              | Array    | -                                            | Set table data                                                          |
| srcUrl            | String   | -                                            | Set a source URL to get data remotely                                   |
| srcMethod         | String   | GET                                          | Request method for the source URL                                       |
| srcHeaders        | Object   | {Accept: 'application/json'}                 | Request headers for getting data remotely                               |
| srcParams         | Array    | -                                            | Request parameters for getting data remotely                            |
| srcHandler        | Function | -                                            | Define your customized handler for getting data remotely                |
| autoLoad          | Boolean  | true                                         | Whether to load source data on initializing when `srcUrl` is specified  |
| pageSize          | Number   | 50                                           | Set page size, child items are not contained in this digital            |
| pageSizes         | Array    | [20, 50, 100, 200]                           | Set page size options                                                   |
| page              | Number   | 1                                            | Set which page to show on initializing                                  |
| emptyValue        | String   | -                                            | Set HTML to show when a cell data is null, undefined or an empty string |
| i18nCheckedStatus | String   | :checked item(s) checked                     | i18n: Checked item state on toolbar                                     |
| i18nPaging        | String   | Page :page of :page_count (:row_total items) | i18n: Paging info                                                       |
| i18nNoData        | String   | No matched data                              | i18n: Tip of no matched data                                            |
| i18nPrevPage      | String   | Prev                                         | i18n: Label of previous page button                                     |
| i18nNextPage      | String   | Next                                         | i18n: Label of next page button                                         |

### Column Options

| Option     | Type     | Default | Description                                                           |
|------------|----------|---------|-----------------------------------------------------------------------|
| type       | String   | data    | Optional types are `checkbox`, `index`, `actions`, `data`             |
| code       | String   | -       | Column name                                                           |
| field      | String   | -       | Field name or expression for data column                              |
| hidden     | Boolean  | false   | Whether the column is hidden                                          |
| title      | String   | -       | Column title                                                          |
| align      | String   | -       | Text align                                                            |
| fixed      | String   | -       | Optional fixed positions are `left`, `right`                          |
| width      | Number   | -       | Width of the column, unit `px`                                        |
| sort       | Boolean  | false   | Whether the column is sortable                                        |
| gbk        | Boolean  | false   | Whether the column is sorted by gbk                                   |
| sortDir    | String   | -       | Default sort direction                                                |
| renderer   | Function | -       | Cell renderer: fn (&lt;Object&gt; row, &lt;Object&gt; col): String    |
| tpl        | String   | -       | Cell template                                                         |
| expandable | Boolean  | false   | Whether the cell shows an expandable icon when the row has child item |
| actions    | Array    | -       | Row actions                                                           |
| filter     | Object   | -       | Filter options                                                        |

### Row Action

| Action  | Type     | Description                                                              |
|---------|----------|--------------------------------------------------------------------------|
| label   | String   | Label to show in the action group                                        |
| canShow | Function | Whether to show the action for the row: fn (&lt;Object&gt; row): Boolean |
| handle  | Function | Handle the action: fn (&lt;Object&gt; row): void                         |

### Filter Options

| Option | Type   | Description                                                                                                                         |
|--------|--------|-------------------------------------------------------------------------------------------------------------------------------------|
| type   | String | Filter type, pre-defined types are `text`, `select`, `date`. You can also define your own types with the `customFilterTypes` option |
| op     | String | Optional operations for pre-defined types are `=`, `like`                                                                           |
| params | Object | Parameters of the filter, this is depended on the filter type                                                                       |

### Toolbar Action

| Action | Type     | Description                                      |
|--------|----------|--------------------------------------------------|
| label  | String   | Label to show in the action group                |
| handle | Function | Handle the action: fn (&lt;Array&gt; rows): void |

## Events

| Event Name      | Listener Params |
|-----------------|-----------------|
| row-click       | row             |
| row-dblclick    | row             |
| row-mouseenter  | row             |
| row-mouseleave  | row             |
| cell-click      | row, col        |
| cell-dblclick   | row, col        |
| cell-mouseenter | row, col        |
| cell-mouseleave | row, col        |

| Listener Param     | Description             |
|--------------------|-------------------------|
| &lt;Object&gt; row | Row data                |
| &lt;Object&gt; col | Rebuilt column settings |
