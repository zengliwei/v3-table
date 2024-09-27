<script setup>
import {defineEmits, defineProps, defineComponent, ref, reactive, computed, watch} from 'vue';
import v3TableTr from './v3-table-tr.vue';

defineEmits(['row-click', 'row-db-click']);

const props = defineProps({
  columns: {
    type: Array,
    required: true
  },

  rowActions: {
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

  data: {
    type: Array,
    default: []
  },

  srcUrl: {
    type: String
  },

  srcConditions: {
    type: Array
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

  pagingMsg: {
    type: String,
    default: 'Page :page of :page_count (:row_total items)'
  },

  tipNoData: {
    type: String,
    default: 'No data'
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
    rows = reactive([]),
    filteredRows = reactive([]),
    sourceRows = reactive([]),
    activatedRows = reactive([]),
    filters = reactive([]),
    showAutoWidthCol = ref(false),
    lastLeftFixedColIdx = ref(-1),
    rowTotal = ref(0),
    page = ref(1),
    pageCount = ref(1),
    pages = computed(() => {
      let tmpPages = [];
      for (let p = 1; p <= pageCount.value; p++) {
        tmpPages.push(p);
      }
      return tmpPages;
    }),
    pagingMsg = computed(() => {
      return props.pagingMsg
          .replace(':page_count', pageCount.value)
          .replace(':page', page.value)
          .replace(':row_total', rowTotal.value);
    }),
    sortOrders = [];

watch(
    () => props.columns,
    (columns) => {

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
      lastLeftFixedColIdx = tmpLastLeftFixedColIdx;

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
          showAutoWidthCol = true;
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

      cols = reactive(tmpCols);
    },
    {immediate: true}
);

const checkAll = function () {
  console.log('checkAll');
};

const updateData = function (data, total) {
  rows = data;
  rowTotal = total || data.length;
  pageCount = Math.ceil(total / props.pageSize);
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
  updateData(filteredRows.slice(0, props.pageSize), filteredRows.length);
  page = 1;
};

const filterByRemote = function () {
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
  updateData(filteredRows.slice(0, props.pageSize), filteredRows.length);
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
};

const updatePage = function (p) {
  if (p < 1 || p > pageCount) return;
  if (props.srcUrl) {
    filterByRemote();
  } else {
    page = p;
    updateData(filteredRows.slice((page - 1) * props.pageSize, page * props.pageSize), filteredRows.length);
  }
};
</script>

<template>
  <div class="v3-table">
    <div class="v3-table-header">
      <table>
        <thead>
        <tr>
          <template v-for="(col, c) in cols">
            <th v-if="col['type'] === 'checkbox'"
                class="checkbox" :style="col['style']">
              <div><input type="checkbox" @click="checkAll"/></div>
            </th>
            <th v-if="col['type'] === 'index'"
                class="index" :style="col['style']">
              <div>#</div>
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
    <div class="v3-table-body">
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
                @click="(obj) => $emit('row-click', obj)"
                @db-click="(obj) => $emit('row-db-click', obj)"></v3-table-tr>
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
    <div class="v3-table-footer">
      <div></div>
      <div v-text="pagingMsg"></div>
      <div class="paginator">
        <a href="#" :class="{disabled: page === 1}"
           v-text="props.labelPrevPage"
           @click.prevent="updatePage(page - 1)"></a>
        <select @change="(evt) => updatePage(evt.currentTarget.value)">
          <option v-for="p in pages" :value="p" v-text="p"></option>
        </select>
        <a href="#" :class="{disabled: page === pageCount}"
           v-text="props.labelNextPage"
           @click.prevent="updatePage(page + 1)"></a>
      </div>
    </div>
  </div>
</template>

<style>
.v3-table {
  --v3-table-width: 100%;
  --v3-table-border-color: #DCDFE6;

  --v3-table-header-lv1-bg: linear-gradient(#f4f5f8, #f1f3f6);
  --v3-table-header-lv2-bg: linear-gradient(#f4f5f8, #f1f3f6);
  --v3-table-header-color: #545454;
  --v3-table-header-font-size: .875rem;
  --v3-table-header-font-weight: 400;
  --v3-table-header-sort-icon: url('data:image/svg+xml;utf8,<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-arrows-up-down"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 3l0 18" /><path d="M10 6l-3 -3l-3 3" /><path d="M20 18l-3 3l-3 -3" /><path d="M17 21l0 -18" /></svg>');
  --v3-table-header-sort-asc-icon: url('data:image/svg+xml;utf8,<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-up"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M16 9l-4 -4" /><path d="M8 9l4 -4" /></svg>');
  --v3-table-header-sort-desc-icon: url('data:image/svg+xml;utf8,<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-down"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M16 15l-4 4" /><path d="M8 15l4 4" /></svg>');
  --v3-table-header-sort-icon-height: .875rem;
  --v3-table-header-sort-icon-width: .875rem;

  --v3-table-body-color: #545454;
  --v3-table-body-font-size: .875rem;
  --v3-table-body-font-weight: 400;

  --v3-table-row-bg: #fff;
  --v3-table-row-even-bg: #f6f6f7;
  --v3-table-row-hover-bg: #f4f5f8;
  --v3-table-row-activated-bg: #f1f3f6;

  --v3-table-footer-bg: #f4f5f8;
  --v3-table-footer-padding: .5rem 1rem;
  --v3-table-footer-font-size: .75rem;

  --v3-table-paginator-gap: .5rem;
  --v3-table-paginator-disabled-color: #ccc;

  --v3-table-cell-padding: .3125rem;
  --v3-table-cell-box-padding: 0 .3125rem;
  --v3-table-cell-no-data-bg: #fff;
  --v3-table-cell-no-data-padding: 1rem;

  --v3-table-link-color: #007bff;
}

.v3-table {
  overflow: auto;
  position: relative;
  width: var(--v3-table-width);
}

.v3-table a {
  color: var(--v3-table-link-color);
  text-decoration: none;
}

.v3-table table {
  border-color: var(--v3-table-border-color);
  border-style: solid;
  border-width: 1px 0 0 1px;
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
  box-sizing: border-box;
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
  align-content: center;
  padding: var(--v3-table-cell-box-padding);
}

.v3-table .v3-table-header {
  position: sticky;
  top: 0;
  z-index: 3;
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
  background: var(--v3-table-header-sort-icon) no-repeat center center;
  background-size: var(--v3-table-header-sort-icon-width) var(--v3-table-header-sort-icon-height);
  content: '';
  display: block;
  height: var(--v3-table-header-sort-icon-height);
  width: var(--v3-table-header-sort-icon-width);
}

.v3-table .v3-table-header th.sort.asc > div:after {
  background-image: var(--v3-table-header-sort-asc-icon);
}

.v3-table .v3-table-header th.sort.desc > div:after {
  background-image: var(--v3-table-header-sort-desc-icon);
}

.v3-table .v3-table-body table {
  border-top: 0;
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

.v3-table .v3-table-footer {
  background: var(--v3-table-footer-bg);
  border-color: var(--v3-table-border-color);
  border-style: solid;
  border-width: 0 1px 1px 1px;
  display: flex;
  justify-content: space-between;
  font-size: var(--v3-table-footer-font-size);
}

.v3-table .v3-table-footer > div {
  padding: var(--v3-table-footer-padding);
}

.v3-table .v3-table-footer .paginator {
  display: flex;
  gap: var(--v3-table-paginator-gap);
}

.v3-table .v3-table-footer .paginator .disabled {
  color: var(--v3-table-paginator-disabled-color);
  cursor: not-allowed;
}
</style>
