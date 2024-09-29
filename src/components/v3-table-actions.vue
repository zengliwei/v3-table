<script>
import {reactive} from 'vue';

const globalInstances = reactive([]);

export default {
  name: 'v3-table-actions',

  expose: ['close'],

  props: {
    actions: {
      type: Array,
      required: true
    }
  },

  data: function () {
    return {
      expanded: false,
      myActions: this.actions.filter((action) => {
        return action['canShow'] instanceof Function
            ? action['canShow'](...(action['params'] || []))
            : true;
      }),
      dropdownStyle: {}
    };
  },

  methods: {
    closeOthers: function () {
      globalInstances.forEach(instance => {
        this !== instance && instance.close();
      });
    },

    handleAction: function (action) {
      this.closeOthers();
      action['handle'](...(action['params'] || []));
      this.expanded = false;
    },

    dropdown: function () {
      if (this.expanded) {
        this.expanded = false;
        return;
      }
      this.closeOthers();
      this.expanded = true;
      let rectBox = this.$refs.elActionBox.getBoundingClientRect(),
          rectDropdown = this.$refs.elDropdown.getBoundingClientRect();
      this.dropdownStyle.left = window.innerWidth - (rectBox.x + rectDropdown.width) > 0
          ? `${rectBox.x}px`
          : `${rectBox.x + rectBox.width - rectDropdown.width}px`;
      this.dropdownStyle.top = window.innerHeight - (rectBox.y + rectDropdown.height) > 0
          ? `${rectBox.y + rectBox.height}px`
          : `${rectBox.y - rectDropdown.height}px`;
    },

    close: function () {
      this.expanded = false;
    },

    docClickListener: function (evt) {
      if (this.$refs.elContainer.contains(evt.target)) {
        return;
      }
      this.expanded = false;
    }
  },

  mounted: function () {
    globalInstances.push(this);
    document.addEventListener('click', this.docClickListener);
  },

  unmounted: function () {
    globalInstances.splice(globalInstances.indexOf(this), 1);
    document.removeEventListener('click', this.docClickListener);
  }
};
</script>

<template>
  <div class="v3-table-actions" ref="elContainer">
    <template v-if="myActions.length === 1">
      <a class="v3-table-action"
         v-text="myActions[0]['label']"
         @click.stop="handleAction(myActions[0])"></a>
    </template>
    <template v-if="myActions.length > 1">
      <div ref="elActionBox" class="v3-table-action-box">
        <a class="v3-table-main-action"
           v-text="myActions[0]['label']"
           @click.stop="handleAction(myActions[0])"></a>
        <span class="v3-table-actions-expander"
              @click.stop="evt => dropdown(evt)"></span>
      </div>
      <teleport to="body">
        <div ref="elDropdown"
             :class="{'v3-table-actions-dropdown': true, expanded: expanded}"
             :style="dropdownStyle">
          <template v-for="(action, a) in myActions">
            <a v-if="a > 0"
               class="v3-table-actions-dropdown-action"
               v-text="action['label']"
               @click.stop="handleAction(action)"></a>
          </template>
        </div>
      </teleport>
    </template>
  </div>
</template>
