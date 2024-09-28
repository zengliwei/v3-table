<script setup>
import {defineEmits, defineProps, defineComponent, defineExpose, ref, computed, watch, onMounted} from 'vue';
import v3TableTr from './v3-table-tr.vue';
import V3TableActions from "./v3-table-actions.vue";

const emit = defineEmits([
  'row-click', 'row-dblclick', 'row-mouseenter', 'row-mouseleave',
  'cell-click', 'cell-dblclick', 'cell-mouseenter', 'cell-mouseleave',
  'update:page-size'
]);

const props = defineProps({
  columns: {
    type: Array,
    required: true
  },

  rowActions: {
    type: Array,
    default: () => []
  },

  showToolbar: {
    type: Boolean,
    default: true
  },

  toolbarActions: {
    type: Array,
    default: () => []
  },

  showColumnFilter: {
    type: Boolean,
    default: true
  },

  filterTypes: {
    type: Object
  },

  toolbarFilters: {
    type: Array,
    default: []
  },

  data: {
    type: Array,
    default: []
  },

  srcUrl: {
    type: String
  },

  srcMethod: {
    type: String,
    default: 'GET'
  },

  srcConditions: {
    type: Array
  },

  srcHandler: {
    type: Function
  },

  height: {
    type: String
  },

  autoLoad: {
    type: Boolean,
    default: true
  },

  pageSize: {
    type: Number,
    default: 50
  },

  pageSizes: {
    type: Array,
    default: [20, 50, 100, 200]
  },

  page: {
    type: Number,
    default: 1
  },

  tipCheckedStatus: {
    type: String,
    default: ':checked item(s) checked'
  },

  tipPaging: {
    type: String,
    default: 'Page :page of :page_count (:row_total items)'
  },

  tipNoData: {
    type: String,
    default: 'No data'
  },

  labelToolbarFilter: {
    type: String,
    default: 'Filter'
  },

  labelPrevPage: {
    type: String,
    default: 'Prev'
  },

  labelNextPage: {
    type: String,
    default: 'Next'
  }
});

for (let key in props.filterTypes) {
  defineComponent(props.filterTypes[key]);
}

let cols = ref([]),
    rows = ref([]),
    filteredRows = [],
    sourceRows = [],
    activatedRows = ref([]),
    filters = ref([]),
    hasCheckbox = ref(false),
    showAutoWidthCol = ref(false),
    lastLeftFixedColIdx = ref(-1),
    rowTotal = 0,
    toolbarActions = ref(props.toolbarActions.map((action) => {
      action['params'] = [activatedRows.value];
      return action;
    })),
    tipCheckedStatus = computed(() => {
      return props.tipCheckedStatus
          .replace(':checked', activatedRows.value.length)
          .replace(':total', rows.value.length);
    }),
    page = ref(1),
    pageSize = ref(props.pageSize),
    pageCount = computed(() => {
      return Math.ceil(rowTotal / pageSize.value);
    }),
    pages = computed(() => {
      let tmpPages = [];
      for (let p = 1; p <= pageCount.value; p++) {
        tmpPages.push(p);
      }
      return tmpPages;
    }),
    tipPaging = computed(() => {
      return props.tipPaging
          .replace(':page_count', pageCount.value)
          .replace(':page', page.value)
          .replace(':row_total', rowTotal);
    }),
    sortOrders = [];

const elMain = ref(),
    elHeader = ref(),
    elBody = ref(),
    elFooter = ref(),
    elCheckAll = ref();

watch(
    () => props.columns,
    (columns) => {
      /*
       * Show selected status when a checkbox column set.
       */
      hasCheckbox.value = columns.filter((col) => col['type'] === 'checkbox').length > 0;

      /*
       * Checkbox and index columns should be fixed and have default width
       * when there is a column fixed on left side after them.
       */
      let toolCols = ['checkbox', 'index'], tmpLastLeftFixedColIdx = -1;
      for (let c = 0; c < columns.length; c++) {
        if (columns[c]['fixed'] === 'left') {
          tmpLastLeftFixedColIdx = c;
        } else if (toolCols.indexOf(columns[c]['type']) === -1) {
          break;
        }
      }
      lastLeftFixedColIdx.value = tmpLastLeftFixedColIdx;

      if (tmpLastLeftFixedColIdx !== -1) {
        for (let c = 0; c < columns.length; c++) {
          if (columns[c]['type'] === 'checkbox') {
            columns[c]['width'] = columns[c]['width'] || 40;
            columns[c]['fixed'] = 'left';
          } else if (columns[c]['type'] === 'index') {
            columns[c]['width'] = columns[c]['width'] || 60;
            columns[c]['fixed'] = 'left';
          }
        }
      }

      /*
       * Each column fixed on left side should have a left position.
       */
      let leftFixedColLeftArr = [];
      for (let c = 0; c < columns.length; c++) {
        if (columns[c]['fixed'] === 'left') {
          leftFixedColLeftArr[c] += leftFixedColLeftArr[c - 1] || 0;
        } else {
          break;
        }
      }

      /*
       * Each column fixed on right side should have a right position.
       */
      let rightWidthRightArr = [];
      for (let c = columns.length - 1; c >= 0; c--) {
        if (columns[c]['fixed'] === 'right') {
          rightWidthRightArr[c] += rightWidthRightArr[c + 1] || 0;
        } else {
          break;
        }
      }

      let tmpCols = [];
      columns.forEach((col, c) => {
        if (col['width']) {
          showAutoWidthCol.value = true;
        }
        tmpCols.push({
          type: col['type'] || 'data',
          code: col['code'] || col['field'],
          field: col['field'] || false,
          hidden: col['hidden'] || false,
          title: col['title'] || false,
          width: col['width'] || false,
          sort: col['sort'] || false,
          sortDir: col['sortDir'] || false,
          filter: col['filter'] || false,
          expandable: col['expandable'] || false,
          cssClass: {
            'data': col['type'] === 'data' || col['type'] === undefined,
            'align-center': col['align'] === 'center',
            'align-right': col['align'] === 'right',
            'sort': col['sort'],
            'asc': col['sortDir'] === 'asc',
            'desc': col['sortDir'] === 'desc'
          },
          style: {
            left: col['fixed'] ? (leftFixedColLeftArr[c] + 'px') : 'unset',
            right: col['fixed'] ? (rightWidthRightArr[c] + 'px') : 'unset',
            position: col['fixed'] ? 'sticky' : 'unset',
            zIndex: col['fixed'] ? 2 : 1,
            width: col['width'] ? (col['width'] + 'px') : 'auto'
          }
        });
      });

      cols = ref(tmpCols);
    },
    {immediate: true}
);

watch(
    () => pageSize.value,
    (size) => {
      switchPageSize(size);
    }
);

const getAllRows = function (rows) {
  let childRows = [];
  rows.forEach((row) => {
    childRows.push(row);
    if (row['children'] && row['children'].length > 0) {
      childRows.push(...getAllRows(row['children']));
    }
  });
  return childRows;
};

const checkAll = function (status) {
  getAllRows(rows.value).forEach((row) => {
    row['_checked_'] = status;
    status ? activatedRows.value.push(row)
        : activatedRows.value.splice(activatedRows.value.indexOf(row), 1);
  });
};

const checkRow = function (row, status) {
  row['_checked_'] = status;
  status ? activatedRows.value.push(row)
      : activatedRows.value.splice(activatedRows.value.indexOf(row), 1);
  let allChecked = true, hasChecked = false;
  getAllRows(rows.value).forEach((r) => {
    if (!r['_checked_']) {
      allChecked = false;
    } else {
      hasChecked = true;
    }
  });
  elCheckAll.value[0].indeterminate = !allChecked && hasChecked;
};

const clickRow = function (row) {
  checkRow(row, !row['_checked_']);
  emit('row-click', row);
};

const filterByLocal = function () {
  filteredRows = sourceRows.filter((row) => {
    filters.forEach((filter) => {
      if (!row[filter['field']] || filter['v'] === '') {
        return false;
      }
      if (filter['op'] === '='
          && row[filter['field']] !== filter['v']) {
        return false;
      } else if (filter['op'] === 'like'
          && row[filter['field']].indexOf(filter['v']) === -1) {
        return false;
      } else if (filter['op'] === 'date') {
      }
      return true;
    });
  });
  rows.value = filteredRows.slice(0, pageSize.value);
  rowTotal = filteredRows.length;
  page.value = 1;
};

const filter = function () {
  if (props.srcHandler) {
    refreshByRemote();
  } else {
    filterByLocal();
  }
};

const refreshByRemote = function () {
  fetch(props.srcUrl, {
    method: props.srcMethod,
    params: {
      c: props.columns.map((col) => col['field']),
      f: filters,
      p: page,
      ps: pageSize.value
    }
  });
};

const sortByLocal = function () {
  filteredRows.sort((a, b) => {
    for (let s = 0; s < sortOrders.length; s++) {
      let av = a[sortOrders[s].field], bv = b[sortOrders[s].field];
      if (sortOrders[s].gbk) {
        av = av && av.toString().localeCompare(bv);
        bv = bv && bv.toString().localeCompare(av);
      }
      if (av === bv) {
        continue;
      }
      return sortOrders[s].dir === 'asc'
          ? (av > bv ? 1 : -1)
          : (av < bv ? 1 : -1);
    }
    return 0;
  });
  rows.value = filteredRows.slice((page.value - 1) * pageSize.value, page.value * pageSize.value);
};

const sortByRemote = function () {
};

const sort = function (col) {
  if (!col['sort']) return;
  if (sortOrders.filter((sort) => sort.field === col.field).length > 0) {
    sortOrders.sort((a, b) => {
      return a['field'] === col['code'] ? -1 : (b['field'] === col['code'] ? 1 : 0)
    });
    sortOrders[0].dir = sortOrders[0].dir === 'asc' ? 'desc' : 'asc';
  } else {
    sortOrders.unshift({field: col['code'], dir: 'asc', gbk: col['gbk'] || false});
  }
  col['sortDir'] = sortOrders[0].dir;
  col['cssClass']['asc'] = col['sortDir'] === 'asc';
  col['cssClass']['desc'] = col['sortDir'] === 'desc';
  props.srcHandler ? sortByRemote() : sortByLocal();
};

const switchPage = function (p) {
  if (p < 1 || p > pageCount.value) return;
  if (props.srcHandler) {
    refreshByRemote();
  } else {
    page.value = p;
    rows.value = filteredRows.slice((page.value - 1) * pageSize.value, page.value * pageSize.value);
  }
};

const switchPageSize = function (size) {
  pageSize.value = parseInt(size);
  page.value = 1;
  rows.value = filteredRows.slice((page.value - 1) * pageSize.value, page.value * pageSize.value);
  emit('update:page-size', pageSize.value);
};

defineExpose({filter});

if (props.autoLoad) {
  if (props.srcUrl) {
    refreshByRemote();
  } else {
    sourceRows = props.data;
    filteredRows = props.data;
    rows.value = filteredRows.slice((page.value - 1) * pageSize.value, page.value * pageSize.value);
    rowTotal = filteredRows.length;
  }
}

onMounted(() => {
  if (props.height) {
    elMain.value.style.height = `calc(100% - ${elFooter.value.offsetHeight}px)`;
  }
});
</script>

<template>
  <div class="v3-table" :style="{height: height}" ref="elTable">
    <div class="v3-table-main" ref="elMain">
      <div class="v3-table-header" ref="elHeader">

        <div v-if="showToolbar" class="v3-table-header-toolbar">
          <div class="v3-table-header-toolbar-left">
            <div class="v3-table-header-toolbar-actions">
              <v3-table-actions :actions="toolbarActions"/>
            </div>
            <div v-if="hasCheckbox" class="v3-table-header-checked-status" v-text="tipCheckedStatus"></div>
            <div>
              <slot name="toolbar-left"></slot>
            </div>
          </div>
          <div class="v3-table-header-toolbar-right">
            <slot name="toolbar-right"></slot>
          </div>
        </div>

        <table>
          <thead>
          <tr>
            <template v-for="(col, c) in cols">
              <th v-if="col['type'] === 'checkbox'"
                  class="checkbox" :style="col['style']">
                <div>
                  <input ref="elCheckAll" type="checkbox"
                         @click="evt => checkAll(evt.currentTarget.checked)"/>
                </div>
              </th>
              <th v-if="col['type'] === 'index'"
                  class="index" :style="col['style']">
                <div v-text="col['title'] || '#'"></div>
              </th>
              <th v-if="col['type'] === 'data' && !col['hidden']"
                  :class="col['cssClass']" :style="col['style']">
                <div @click="sort(col)"><span v-text="col['title']"></span></div>
              </th>
            </template>
            <th v-if="showAutoWidthCol" class="auto"></th>
            <th v-if="rowActions.length > 0" class="actions"></th>
          </tr>
          <tr v-if="showColumnFilter">
            <template v-for="(col, c) in cols">
              <th v-if="col['type'] === 'checkbox'" class="checkbox"></th>
              <th v-if="col['type'] === 'index'" class="index"></th>
              <th v-if="col['type'] === 'data' && !col['hidden']">
                <component
                    v-if="col['filter']"
                    :is="col['filter']['type']"
                    :params="col['filter']['params']"></component>
              </th>
            </template>
            <th v-if="showAutoWidthCol"></th>
            <th v-if="rowActions.length > 0"></th>
          </tr>
          </thead>
        </table>
      </div>

      <div class="v3-table-body" ref="elBody">
        <table>
          <tbody>
          <template v-if="rows.length > 0">
            <template v-for="(row, r) in rows">
              <v3-table-tr
                  :idx="r"
                  :row="row"
                  :cols="cols"
                  :row-actions="rowActions"
                  :show-auto-width-col="showAutoWidthCol"
                  :last-left-fixed-col-idx="lastLeftFixedColIdx"
                  :activated-rows="activatedRows"
                  @click="(obj) => clickRow(obj)"
                  @dblclick="(obj) => $emit('row-dblclick', obj)"
                  @mouseenter="(obj) => $emit('row-mouseenter', obj)"
                  @mouseleave="(obj) => $emit('row-mouseleave', obj)"
                  @check="(obj, status) => checkRow(obj, status)"
                  @cell-click="(obj, col) => $emit('cell-click', obj, col)"
                  @cell-dblclick="(obj, col) => $emit('cell-dblclick', obj, col)"
                  @cell-mouseenter="(obj, col) => $emit('cell-mouseenter', obj, col)"
                  @cell-mouseleave="(obj, col) => $emit('cell-mouseleave', obj, col)"/>
            </template>
          </template>
          <template v-else>
            <tr>
              <td :colspan="cols.length"
                  class="no-data">
                <div v-text="tipNoData"></div>
              </td>
            </tr>
          </template>
          </tbody>
        </table>
      </div>
    </div>

    <div class="v3-table-footer" ref="elFooter">
      <div class="v3-table-page-sizes">
        <select @change="(evt) => switchPageSize(evt.currentTarget.value)">
          <option v-for="p in pageSizes" :value="p" :selected="p === pageSize" v-text="p"></option>
        </select>
      </div>
      <div v-text="tipPaging"></div>
      <div class="paginator">
        <a href="#" :class="{disabled: page === 1}"
           v-text="props.labelPrevPage"
           @click.prevent="switchPage(page - 1)"></a>
        <select @change="(evt) => switchPage(evt.currentTarget.value)">
          <option v-for="p in pages" :value="p" :selected="p === page" v-text="p"></option>
        </select>
        <a href="#" :class="{disabled: page === pageCount}"
           v-text="props.labelNextPage"
           @click.prevent="switchPage(page + 1)"></a>
      </div>
    </div>

    <div class="v3-table-loader"></div>
  </div>
</template>

<style>
/*
 * Definition and functionally styles only
 */

.v3-table {
  border-color: var(--v3-table-border-color);
  border-style: solid;
  border-width: 1px;
  position: relative;
  width: var(100%);
}

.v3-table * {
  box-sizing: border-box;
}

.v3-table table {
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
  width: 100%;
}

.v3-table th,
.v3-table td {
  border-color: var(--v3-table-border-color);
  border-style: solid;
  border-top-width: 0;
  border-left-width: 0;
  border-bottom-width: 1px;
  border-right-width: 1px;
  line-height: var(--v3-table-line-height);
  padding: var(--v3-table-cell-padding);
}

.v3-table th:last-child,
.v3-table td:last-child {
  border-right-width: 1px;
}

.v3-table th.checkbox > div,
.v3-table td.checkbox > div {
  justify-content: center;
}

.v3-table th > div,
.v3-table td > div {
  display: flex;
  align-items: center;
  padding: var(--v3-table-cell-box-padding);
}

.v3-table .v3-table-cell-lv {
  padding-left: var(--v3-table-cell-lv-padding);
  position: relative;
  height: var(--v3-table-line-height);
  width: var(--v3-table-cell-lv-base-width);
}

.v3-table .v3-table-cell-lv.lv1 {
  width: calc(var(--v3-table-cell-lv-base-width) + var(--v3-table-cell-lv-width) * 1);
}

.v3-table .v3-table-cell-lv.lv2 {
  width: calc(var(--v3-table-cell-lv-base-width) + var(--v3-table-cell-lv-width) * 2);
}

.v3-table .v3-table-cell-lv.lv3 {
  width: calc(var(--v3-table-cell-lv-base-width) + var(--v3-table-cell-lv-width) * 3);
}

.v3-table .v3-table-cell-lv.lv4 {
  width: calc(var(--v3-table-cell-lv-base-width) + var(--v3-table-cell-lv-width) * 4);
}

.v3-table .v3-table-cell-expander {
  cursor: pointer;
  display: block;
  background: var(--v3-table-cell-expander-icon-url) no-repeat center center;
  background-size: var(--v3-table-cell-expander-icon-width) var(--v3-table-cell-expander-icon-height);
  left: var(--v3-table-cell-expander-icon-left);
  top: var(--v3-table-cell-expander-icon-top);
  height: var(--v3-table-line-height);
  width: var(--v3-table-cell-expander-icon-width);
  position: absolute;
}

.v3-table .v3-table-cell-expander.loading {
  background-image: var(--v3-table-cell-expander-loading-icon-url);
}

.v3-table .v3-table-cell-expander.expanded {
  background-image: var(--v3-table-cell-expander-expanded-icon-url);
}

.v3-table .v3-table-main-action {
  background: var(--v3-table-button-bg);
  border: 1px solid var(--v3-table-border-color);
  border-radius: var(--v3-table-button-border-radius);
  color: var(--v3-table-button-color);
  cursor: pointer;
  padding: var(--v3-table-button-padding);
}

.v3-table .v3-table-action-box {
  display: flex;
}

.v3-table .v3-table-action-box .v3-table-main-action {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.v3-table .v3-table-action-expander {
  background: var(--v3-table-button-bg);
  border-color: var(--v3-table-border-color);
  border-style: solid;
  border-width: 1px 1px 1px 0;
  border-top-right-radius: var(--v3-table-button-border-radius);
  border-bottom-right-radius: var(--v3-table-button-border-radius);
  cursor: pointer;
  display: block;
  padding: var(--v3-table-action-expander-padding);
}

.v3-table .v3-table-action-expander::after {
  background: var(--v3-table-action-expander-icon-url) no-repeat center center;
  background-size: var(--v3-table-action-expander-icon-width) var(--v3-table-action-expander-icon-height);
  content: '';
  display: block;
  height: var(--v3-table-action-expander-icon-height);
  width: var(--v3-table-action-expander-icon-width);
}

.v3-table .v3-table-action-expander.expanded::after {
  background-image: var(--v3-table-action-expander-expanded-icon-url);
}

.v3-table .v3-table-actions-dropdown {
  background: var(--v3-table-button-bg);
  border: 1px solid var(--v3-table-border-color);
  border-radius: var(--v3-table-button-border-radius);
  display: none;
  min-width: var(--v3-table-actions-dropdown-min-width);
  position: absolute;
  top: 100%;
}

.v3-table .v3-table-actions-dropdown.expanded {
  display: block;
}

.v3-table .v3-table-action {
  background: var(--v3-table-button-bg);
  border-bottom: 1px solid var(--v3-table-border-color);
  color: var(--v3-table-button-color);
  cursor: pointer;
  display: block;
  padding: var(--v3-table-button-padding);
}

.v3-table .v3-table-action:hover {
  background: var(--v3-table-button-hover-bg);
}

.v3-table .v3-table-action:last-child {
  border-bottom: 0;
}


/*
 * Main Container
 */

.v3-table .v3-table-main {
  overflow: auto;
  position: relative;
}


/*
 * Header
 */

.v3-table .v3-table-header {
  position: sticky;
  top: 0;
  z-index: 3;
}

.v3-table .v3-table-header-toolbar {
  background: var(--v3-table-header-toolbar-bg);
  border-style: solid;
  border-width: 0 0 1px 0;
  border-color: var(--v3-table-border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--v3-table-header-toolbar-font-size);
  padding: var(--v3-table-header-toolbar-padding);
  position: relative;
  z-index: 2;
}

.v3-table .v3-table-header-toolbar > div {
  display: flex;
  align-items: center;
  gap: var(--v3-table-header-toolbar-gap);
  position: relative;
}

.v3-table .v3-table-header-checked-status {
  color: var(--v3-table-header-checked-status-color);
}

.v3-table .v3-table-header table {
  position: relative;
  z-index: 1;
}

.v3-table .v3-table-header th {
  background: var(--v3-table-header-lv1-bg);
  color: var(--v3-table-header-color);
  font-size: var(--v3-table-header-font-size);
  font-weight: var(--v3-table-header-font-weight);
  position: relative;
  text-align: left;
  z-index: 1;
}

.v3-table .v3-table-header tr.lv2 th {
  background: var(--v3-table-header-lv2-bg);
}

.v3-table .v3-table-header th.sort > div {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.v3-table .v3-table-header th.sort > div > span {
  flex: 1 1 auto;
}

.v3-table .v3-table-header th.sort > div::after {
  background: var(--v3-table-header-sort-icon-url) no-repeat center center;
  background-size: var(--v3-table-header-sort-icon-width) var(--v3-table-header-sort-icon-height);
  content: '';
  display: block;
  height: var(--v3-table-header-sort-icon-height);
  width: var(--v3-table-header-sort-icon-width);
}

.v3-table .v3-table-header th.sort.asc > div:after {
  background-image: var(--v3-table-header-sort-asc-icon-url);
}

.v3-table .v3-table-header th.sort.desc > div:after {
  background-image: var(--v3-table-header-sort-desc-icon-url);
}


/*
 * Body
 */

.v3-table .v3-table-body {
  z-index: 1;
}

.v3-table .v3-table-body tr {
  background-color: var(--v3-table-row-bg);
}

.v3-table .v3-table-body tr:nth-child(even) {
  background-color: var(--v3-table-row-even-bg);
}

.v3-table .v3-table-body tr:hover {
  background-color: var(--v3-table-row-hover-bg);
}

.v3-table .v3-table-body tr.activated {
  background-color: var(--v3-table-row-activated-bg);
}

.v3-table .v3-table-body td > div {
  color: var(--v3-table-body-color);
  font-size: var(--v3-table-body-font-size);
  font-weight: var(--v3-table-body-font-weight);
  overflow: hidden;
  text-overflow: ellipsis;
}

.v3-table .v3-table-body td.align-center > div {
  justify-content: center;
}

.v3-table .v3-table-body td.align-right > div {
  justify-content: flex-end;
}

.v3-table .v3-table-header th.actions,
.v3-table .v3-table-body td.actions {
  overflow: unset;
  position: sticky;
  right: 0;
}

.v3-table .v3-table-body td.no-data {
  background-color: var(--v3-table-cell-no-data-bg);
  padding: var(--v3-table-cell-no-data-padding);
}

.v3-table .v3-table-body td.no-data > div {
  justify-content: center;
}


/*
 * Footer
 */

.v3-table .v3-table-footer {
  background: var(--v3-table-footer-bg);
  border-color: var(--v3-table-border-color);
  border-style: solid;
  border-width: 1px 0 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--v3-table-footer-font-size);
}

.v3-table .v3-table-footer > div {
  padding: var(--v3-table-footer-padding);
}

.v3-table .v3-table-footer .paginator {
  display: flex;
  align-items: center;
  gap: var(--v3-table-paginator-gap);
}

.v3-table .v3-table-footer .paginator a {
  color: var(--v3-table-paginator-link-color);
}

.v3-table .v3-table-footer .paginator a.disabled {
  color: var(--v3-table-paginator-link-disabled-color);
  cursor: not-allowed;
}

.v3-table .v3-table-footer .paginator select {
  padding: var(--v3-table-paginator-select-padding);
}


/*
 * Elements
 */

.v3-table a {
  color: var(--v3-table-link-color);
  text-decoration: none;
}

.v3-table select {
  border: 1px solid var(--v3-table-border-color);
  border-radius: var(--v3-table-select-border-radius);
  color: inherit;
  display: block;
  font-size: inherit;
  outline: none;
  padding: var(--v3-table-select-padding);
  width: 100%;
}

.v3-table button {
  background: var(--v3-table-button-bg);
  border: 1px solid var(--v3-table-border-color);
  color: var(--v3-table-button-color);
  cursor: pointer;
  display: block;
  outline: none;
  border-radius: var(--v3-table-button-border-radius);
  font-size: var(--v3-table-button-font-size);
  min-width: var(--v3-table-button-min-width);
  padding: var(--v3-table-button-padding);
}

.v3-table button:hover {
  background: var(--v3-table-button-hover-bg);
}
</style>
