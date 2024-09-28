<script setup>
import {defineProps, ref} from 'vue';

const props = defineProps({
  actions: {
    type: Array,
    required: true
  }
});

const actions = ref(
    props.actions.filter((action) => {
      return action['canShow'] instanceof Function
          ? action['canShow'](...(action['params'] || []))
          : true;
    })
);
</script>

<template>
  <div class="v3-table-actions">
    <template v-if="actions.length === 1">
      <a class="v3-table-action"
         v-text="actions[0]['label']"
         @click.prevent="actions[0]['handle'](...(actions[0]['params'] || []))"></a>
    </template>
    <template v-if="actions.length > 1">
      <div class="v3-table-action-box">
        <a class="v3-table-main-action"
           v-text="actions[0]['label']"
           @click.prevent="actions[0]['handle'](...(actions[0]['params'] || []))"></a>
        <span class="v3-table-action-expander"></span>
      </div>
      <div class="dropdown">
        <template v-for="(action, a) in actions">
          <a v-if="a > 1"
             class="v3-table-action"
             v-text="action['label']"
             @click.prevent="action['action'](...(action['params'] || []))"></a>
        </template>
      </div>
    </template>
  </div>
</template>
