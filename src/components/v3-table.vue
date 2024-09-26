<script setup>
import {defineEmits, defineProps, defineComponent, ref, watch} from 'vue';
import v3TableTr from './v3-table-tr.vue';

defineEmits(['row-click', 'row-db-click']);

const props = defineProps({
  columns: {
    type: Array,
    required: true
  },

  data: {
    type: Array,
    default: []
  },

  showColumnFilter: {
    type: Boolean,
    default: true
  },

  filterTypes: {
    type: Object
  },

  remoteUrl: {
    type: String
  },

  remoteConditions: {
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

  tipNoData: {
    type: String,
    default: 'No data'
  }
});

for (let key in props.filterTypes) {
  defineComponent(props.filterTypes[key]);
}

let cols = ref([]),
    rows = ref([]),
    filteredRows = ref([]),
    sourceRows = ref(props.data),
    showAutoWidthCol = ref(false),
    rowActions = ref([]),
    leftFixedColNum = ref(0),
    leftFixedColWidth = ref(0),
    rightFixedColNum = ref(0),
    rightFixedWidth = ref(0);

watch(
    () => props.columns,
    (columns) => {

      let tmpCols = [],
          tmpShowAutoWidthCol = false,
          tmpLeftFixedWidthArr = [],
          tmpLeftFixedColWidth = 0,
          tmpRightWidthArr = [],
          tmpRightFixedColWidth = 0;

      let hasLeftFixedCol = columns.filter((col) => col['fixed'] === 'left').length > 0;
      columns.forEach((col) => {
        switch (col['type']) {
          case 'checkbox':
            col['width'] = col['width'] || 40;
            col['fixed'] = hasLeftFixedCol ? 'left' : false;
            break;
          case 'index':
            col['width'] = col['width'] || 40;
            col['fixed'] = hasLeftFixedCol ? 'left' : false;
            break;
        }
      });

      for (let c = 0; c < columns.length; c++) {
        if (columns[c]['fixed'] === 'left') {
          tmpLeftFixedWidthArr[c] = tmpLeftFixedColWidth;
          tmpLeftFixedColWidth += columns[c]['width'];
        } else {
          leftFixedColWidth = tmpLeftFixedColWidth;
          break;
        }
      }

      for (let c = columns.length - 1; c >= 0; c--) {
        if (columns[c]['fixed'] === 'right') {
          tmpRightWidthArr[c] = tmpRightFixedColWidth;
          tmpRightFixedColWidth += columns[c]['width'];
          rightFixedColNum = c;
        } else {
          rightFixedWidth = tmpRightFixedColWidth;
          break;
        }
      }

      columns.forEach((col, c) => {
        if (col['width']) {
          tmpShowAutoWidthCol = true;
        }
        tmpCols.push({
          type: col['type'] || 'data',
          code: col['code'] || col['field'],
          field: col['field'] || false,
          hidden: col['hidden'] || false,
          title: col['title'] || false,
          width: col['width'] || false,
          filter: col['filter'] || false,
          cssClass: {
            'data': true,
            'align-center': col['align'] === 'center',
            'align-right': col['align'] === 'right',
            'sort': col['sort'],
            'asc': col['sortDir'] === 'asc',
            'desc': col['sortDir'] === 'desc'
          },
          style: {
            left: col['fixed'] ? (tmpLeftFixedWidthArr[c] + 'px') : 'unset',
            right: col['fixed'] ? (tmpRightFixedColWidth[c] + 'px') : 'unset',
            position: col['fixed'] ? 'sticky' : 'unset',
            zIndex: col['fixed'] ? 2 : 1,
            width: col['width'] ? (col['width'] + 'px') : 'auto'
          }
        });
      });

      cols = tmpCols;
      showAutoWidthCol = tmpShowAutoWidthCol;
    },
    {immediate: true}
);

function checkAll() {
  console.log('checkAll');
}
</script>

<template>
  <div class="v3-table">
    <div class="v3-table-header">
      <table>
        <thead>
        <tr>
          <template v-for="(col, c) in cols">
            <th v-if="col['type'] === 'checkbox'" class="checkbox" :style="col.style">
              <div><input type="checkbox" @click="checkAll"/></div>
            </th>
            <th v-if="col['type'] === 'index'" class="index" :style="col.style">
              <div>#</div>
            </th>
            <th v-if="col['type'] === 'data' && !col.hidden" :class="col.cssClass" :style="col.style">
              <div v-text="col.title"></div>
            </th>
          </template>
          <th v-if="showAutoWidthCol" class="auto"></th>
          <th v-if="rowActions.length > 0" class="actions"></th>
        </tr>
        <tr v-if="showColumnFilter">
          <template v-for="(col, c) in cols">
            <th v-if="col['type'] === 'checkbox'" class="checkbox"></th>
            <th v-if="col['type'] === 'index'" class="index"></th>
            <th v-if="col['type'] === 'data' && !col.hidden">
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
                :row="row"
                :cols="cols"
                :rowActions="rowActions[r]"
                :leftFixedColNum="leftFixedColNum"
                :showAutoWidthCol="showAutoWidthCol"
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
    <div class="v3-table-footer"></div>
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

  --v3-table-body-color: #545454;
  --v3-table-body-font-size: .875rem;
  --v3-table-body-font-weight: 400;

  --v3-table-row-bg: #fff;
  --v3-table-row-even-bg: #f6f6f7;
  --v3-table-row-hover-bg: #f4f5f8;
  --v3-table-row-activated-bg: #f1f3f6;

  --v3-table-cell-padding: .3125rem;
  --v3-table-cell-box-padding: 0 .3125rem;
  --v3-table-cell-no-data-bg: #fff;
  --v3-table-cell-no-data-padding: 1rem;
}
</style>

<style scoped>
.v3-table {
  overflow: auto;
  position: relative;
  width: var(--v3-table-width);
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
  padding: var(--v3-table-cell-padding);
}

.v3-table th:last-child,
.v3-table td:last-child {
  border-right-width: 1px;
}

.v3-table th.checkbox > div {
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
</style>
