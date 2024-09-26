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

  selectable: {
    type: Boolean,
    default: false
  },

  showColumnFilter: {
    type: Boolean,
    default: true
  },

  showIndexNumber: {
    type: Boolean,
    default: false
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
    leftFixedColNum = ref(0);

watch(
    () => props.columns,
    (columns) => {
      let tmpCols = [], tmpShowAutoWidthCol = false;
      columns.forEach((col) => {
        if (col['width']) {
          tmpShowAutoWidthCol = true;
        }
        tmpCols.push({
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
          }
        });
      });
      cols = tmpCols;
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
          <th v-if="selectable" class="check">
            <div><input type="checkbox" @click="checkAll"/></div>
          </th>
          <th v-if="showIndexNumber" class="index">
            <div>#</div>
          </th>
          <template v-for="(col, c) in cols">
            <th v-if="!col.hidden" :class="col.cssClass">
              <div v-text="col.title"></div>
            </th>
          </template>
          <th v-if="showAutoWidthCol" class="auto"></th>
          <th v-if="rowActions.length > 0" class="actions"></th>
        </tr>
        <tr v-if="showColumnFilter">
          <th v-if="selectable"></th>
          <th v-if="showIndexNumber"></th>
          <template v-for="(col, c) in cols">
            <th v-if="!col.hidden">
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
                :selectable="selectable"
                :showIndexNumber="showIndexNumber"
                :showAutoWidthCol="showAutoWidthCol"
                @click="(obj) => $emit('row-click', obj)"
                @db-click="(obj) => $emit('row-db-click', obj)"></v3-table-tr>
          </template>
        </template>
        <template v-else>
          <tr>
            <td :colspan="cols.length + (selectable ? 1 : 0) + (showIndexNumber ? 1 : 0) + (showAutoWidthCol ? 1 : 0)"
                class="no-data">
              <div v-text="tipNoData"></div>
            </td>
          </tr>
        </template>
        </tbody>
      </table>
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

  --v3-table-body-color: #545454;
  --v3-table-body-font-size: .875rem;
  --v3-table-body-font-weight: 400;

  --v3-table-row-bg: #fff;
  --v3-table-row-even-bg: #f6f6f7;
  --v3-table-row-hover-bg: #f4f5f8;
  --v3-table-row-activated-bg: #f1f3f6;

  --v3-table-cell-padding: .3125rem;
  --v3-table-cell-box-padding: 0 .3125rem;
  --v3-table-cell-check-width: 2rem;
  --v3-table-cell-index-width: 3rem;
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

.v3-table th.check {
  width: var(--v3-table-cell-check-width);
}

.v3-table th.check > div {
  justify-content: center;
}

.v3-table th.index {
  width: var(--v3-table-cell-index-width);
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
