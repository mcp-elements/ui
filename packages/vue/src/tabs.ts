import { defineComponent, computed, h } from 'vue'
import { cn } from '@mcp-elements/core'

export interface TabsItem {
  value: string
  label: string
  disabled?: boolean
}

export const McpeTabs = defineComponent({
  name: 'McpeTabs',
  props: {
    modelValue: { type: String, default: '' },
    tabs: { type: Array as () => TabsItem[], default: () => [] },
    class: { type: String, default: '' },
  },
  emits: ['update:modelValue'],
  setup(props, { slots, emit }) {
    const activeTab = computed(() => props.modelValue || props.tabs[0]?.value || '')

    const selectTab = (value: string) => emit('update:modelValue', value)

    return () => {
      const triggerNodes = props.tabs.map((tab) => {
        const isActive = tab.value === activeTab.value
        return h(
          'button',
          {
            key: tab.value,
            role: 'tab',
            'aria-selected': isActive,
            tabindex: isActive ? 0 : -1,
            disabled: tab.disabled ?? false,
            class: cn(
              'mcpe-tabs-trigger',
              isActive ? 'mcpe-tabs-trigger-active' : ''
            ),
            onClick: () => {
              if (!tab.disabled) selectTab(tab.value)
            },
          },
          tab.label
        )
      })

      const tabList = h(
        'div',
        { role: 'tablist', class: 'mcpe-tabs-list' },
        triggerNodes
      )

      const activeTabData = props.tabs.find((tab) => tab.value === activeTab.value)
      const contentNodes = activeTabData
        ? [
            h(
              'div',
              {
                key: activeTabData.value,
                role: 'tabpanel',
                class: 'mcpe-tabs-content',
              },
              slots[activeTabData.value]?.() ?? []
            ),
          ]
        : []

      return h('div', { class: cn('mcpe-tabs', props.class) }, [tabList, ...contentNodes])
    }
  },
})
