<script setup>
import {defineProps, ref, onMounted} from 'vue';

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
    ),
    dropdownStyle = ref({});

const elActionBox = ref(), elDropdown = ref();

const handleAction = function (action) {
  action['handle'](...(action['params'] || []));
  expanded.value = false;
};

const dropdown = function () {
  expanded.value = !expanded.value;
  let rectBox = elActionBox.value.getBoundingClientRect(),
      rectDropdown = elDropdown.value.getBoundingClientRect();
  dropdownStyle.value.left = window.innerWidth - (rectBox.x + rectDropdown.width) > 0
      ? `${rectBox.x}px`
      : `${rectBox.x + rectBox.width - rectDropdown.width}px`;
  dropdownStyle.value.top = window.innerHeight - (rectBox.y + rectDropdown.height) > 0
      ? `${rectBox.y + rectBox.height}px`
      : `${rectBox.y - rectDropdown.height}px`;
};

onMounted(() => {
  document.addEventListener('click', () => {
    expanded.value = false;
  });
});
</script>

<template>
  <div class="v3-table-actions">
    <template v-if="actions.length === 1">
      <a class="v3-table-action"
         v-text="actions[0]['label']"
         @click.prevent="handleAction(actions[0])"></a>
    </template>
    <template v-if="actions.length > 1">
      <div ref="elActionBox" class="v3-table-action-box">
        <a class="v3-table-main-action"
           v-text="actions[0]['label']"
           @click.prevent="handleAction(actions[0])"></a>
        <span class="v3-table-actions-expander"
              @click.stop="dropdown()"></span>
      </div>
      <teleport to="body">
        <div ref="elDropdown"
             :class="{'v3-table-actions-dropdown': true, expanded: expanded}"
             :style="dropdownStyle">
          <template v-for="(action, a) in actions">
            <a v-if="a > 1"
               class="v3-table-actions-dropdown-action"
               v-text="action['label']"
               @click.prevent="handleAction(action)"></a>
          </template>
        </div>
      </teleport>
    </template>
  </div>
</template>
