<script>
import {reactive} from 'vue';

/*
 * In case we need to handle expanded state of all instances of the component,
 * a global variable is needed.
 * So we have to use <scrip> with an export method instead of <script setup>.
 */
const globalInstances = reactive([]);

export default {
  name: 'v3-d-table-actions',

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
          ? `${rectBox.y + rectBox.height + 1}px`
          : `${rectBox.y - rectDropdown.height - 1}px`;
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
  <div class="v3-d-table-actions" ref="elContainer">
    <template v-if="myActions.length === 1">
      <a class="v3-d-table-action"
         v-text="myActions[0]['label']"
         @click.stop="handleAction(myActions[0])"></a>
    </template>
    <template v-if="myActions.length > 1">
      <div ref="elActionBox" class="v3-d-table-action-box">
        <a class="v3-d-table-main-action"
           v-text="myActions[0]['label']"
           @click.stop="handleAction(myActions[0])"></a>
        <span class="v3-d-table-actions-expander"
              @click.stop="evt => dropdown(evt)"></span>
      </div>
      <teleport to="body">
        <div ref="elDropdown"
             :class="{'v3-d-table-actions-dropdown': true, expanded: expanded}"
             :style="dropdownStyle">
          <template v-for="(action, a) in myActions">
            <a v-if="a > 0"
               class="v3-d-table-actions-dropdown-action"
               v-text="action['label']"
               @click.stop="handleAction(action)"></a>
          </template>
        </div>
      </teleport>
    </template>
  </div>
</template>

<style>
.v3-d-table .v3-d-table-main-action {
  background: var(--v3-d-table-button-bg);
  border: 1px solid var(--v3-d-table-border-color);
  border-radius: var(--v3-d-table-button-border-radius);
  color: var(--v3-d-table-button-color);
  cursor: pointer;
  line-height: var(--v3-d-table-button-height);
  height: calc(var(--v3-d-table-button-height) + 2px);
  padding: var(--v3-d-table-button-padding);
}

.v3-d-table .v3-d-table-action-box {
  display: flex;
}

.v3-d-table .v3-d-table-action-box .v3-d-table-main-action {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.v3-d-table .v3-d-table-actions-expander {
  background: var(--v3-d-table-button-bg);
  border-color: var(--v3-d-table-border-color);
  border-style: solid;
  border-width: 1px 1px 1px 0;
  border-top-right-radius: var(--v3-d-table-button-border-radius);
  border-bottom-right-radius: var(--v3-d-table-button-border-radius);
  cursor: pointer;
  display: block;
  padding: var(--v3-d-table-actions-expander-padding);
}

.v3-d-table .v3-d-table-actions-expander::after {
  background: var(--v3-d-table-actions-expander-icon-url) no-repeat center center;
  background-size: var(--v3-d-table-actions-expander-icon-width) var(--v3-d-table-actions-expander-icon-height);
  content: '';
  display: block;
  height: var(--v3-d-table-actions-expander-icon-height);
  width: var(--v3-d-table-actions-expander-icon-width);
}

.v3-d-table-actions-dropdown {
  background: var(--v3-d-table-actions-dropdown-bg);
  border: 1px solid var(--v3-d-table-border-color);
  border-radius: var(--v3-d-table-button-border-radius);
  display: none;
  min-width: var(--v3-d-table-actions-dropdown-min-width);
  overflow: hidden;
  position: absolute;
  z-index: var(--v3-d-table-actions-dropdown-z-index);
}

.v3-d-table-actions-dropdown.expanded {
  display: block;
}

.v3-d-table-actions-dropdown-action {
  background: var(--v3-d-table-actions-dropdown-action-bg);
  border-bottom: 1px solid var(--v3-d-table-border-color);
  color: var(--v3-d-table-button-color);
  cursor: pointer;
  display: block;
  font-size: var(--v3-d-table-actions-dropdown-action-font-size);
  padding: var(--v3-d-table-actions-dropdown-action-padding);
}

.v3-d-table-actions-dropdown-action:last-child {
  border-bottom: 0;
}

.v3-d-table-actions-dropdown-action:hover {
  background: var(--v3-d-table-actions-dropdown-action-hover-bg);
}

.v3-d-table .v3-d-table-action:hover {
  background: var(--v3-d-table-button-hover-bg);
}

.v3-d-table .v3-d-table-action:last-child {
  border-bottom: 0;
}
</style>
