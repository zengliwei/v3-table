<script setup>
import {defineProps, ref} from 'vue';

const props = defineProps({
  actions: {
    type: Array,
    required: true
  }
});

const expanded = ref(false),
    actions = ref(
        props.actions.filter((action) => {
          return action['canShow'] instanceof Function
              ? action['canShow'](...(action['params'] || []))
              : true;
        })
    );

const handleAction = function (action) {
  action['handle'](...(action['params'] || []));
  expanded.value = false;
};
</script>

<template>
  <div class="v3-table-actions">
    <template v-if="actions.length === 1">
      <a class="v3-table-action"
         v-text="actions[0]['label']"
         @click.prevent="handleAction(actions[0])"></a>
    </template>
    <template v-if="actions.length > 1">
      <div class="v3-table-action-box">
        <a class="v3-table-main-action"
           v-text="actions[0]['label']"
           @click.prevent="handleAction(actions[0])"></a>
        <span :class="{'v3-table-action-expander': true, expanded: expanded}"
              @click="expanded = !expanded"></span>
      </div>
      <div :class="{'v3-table-actions-dropdown': true, expanded: expanded}">
        <template v-for="(action, a) in actions">
          <a v-if="a > 1"
             class="v3-table-action"
             v-text="action['label']"
             @click.prevent="handleAction(action)"></a>
        </template>
      </div>
    </template>
  </div>
</template>
