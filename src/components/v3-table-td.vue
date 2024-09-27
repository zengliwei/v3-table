<script setup>
import {defineProps, defineComponent, ref, watch} from 'vue';

const props = defineProps({
  col: {
    type: Object,
    required: true
  },

  row: {
    type: Object,
    required: true
  },

  lastLeftFixedColIdx: {
    type: Number,
    default: -1
  },

  level: {
    type: Number,
    default: 0
  }
});

const renderContent = function (row, col) {
  let html = (col['renderer'] && col['renderer'] instanceof Function)
      ? col['renderer'](row, col)
      : row[col['code']];
  if ([undefined, null, ''].indexOf(html) > -1) {
    html = '-';
  }
  return html;
};

const switchChild = function (row) {
}
</script>

<template>
  <td v-if="col['type'] === 'data' && !col['hidden']"
      :class="col['cssClass']" :style="col['style']"
      @click="$emit('click')">
    <div>
      <div v-if="col['getChildren']"
           class="flex-shrink-0 w-4 d-flex"
           :style="{marginLeft: level - 1 + 'rem'}">
        <img v-if="row['_has_child_'] && !row['_loading_']" alt
             class="cursor-pointer w-3"
             :style="{transform: row['_expanded_'] ? 'rotate(90deg)' : 'rotate(0deg)'}"
             @click.prevent.stop="switchChild(row)"/>
        <img v-if="row['_loading_']"
             class="w-3 icon-rotate" alt/>
      </div>
      <div v-if="col['tpl']" class="flex-fill" :v-slot="col['tpl']"></div>
      <div v-else class="flex-fill" v-html="renderContent(row, col)"></div>
    </div>
  </td>
</template>
