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

| Option     | Type     | Default | Description                                               |
|------------|----------|---------|-----------------------------------------------------------|
| type       | String   | data    | Optional types are `checkbox`, `index`, `actions`, `data` |
| code       | String   | -       | Column name                                               |
| field      | String   | -       | Field name or expression for data column                  |
| hidden     | Boolean  | false   | Whether the column is hidden                              |
| title      | String   | -       | Column title                                              |
| align      | String   | -       | Text align                                                |
| fixed      | String   | -       | Optional fixed positions are `left`, `right`              |
| width      | Number   | -       | Width of the column, unit `px`                            |
| filter     | Object   | -       | Filter settings                                           |
| sort       | Boolean  | false   | Whether the column is sortable                            |
| gbk        | Boolean  | false   | Whether the column is sorted by gbk                       |
| sortDir    | String   | -       | Default sort direction                                    |
| renderer   | Function | -       | Cell renderer                                             |
| expandable | Boolean  | false   | Whether the column shows expandable icon                  |
| actions    | Array    | -       | Row actions                                               |

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

| Listener Param | Description            |
|----------------|------------------------|
| row            | Row data               |
| col            | Rebuilt column setting |
