import { defineComponent, h } from 'vue'
import { cn } from '@mcp-elements/core'

export const McpeCard = defineComponent({
  name: 'McpeCard',
  props: {
    class: { type: String, default: '' },
  },
  setup(props, { slots }) {
    return () =>
      h('div', { class: cn('mcpe-card', props.class) }, slots.default?.())
  },
})

export const McpeCardHeader = defineComponent({
  name: 'McpeCardHeader',
  props: {
    class: { type: String, default: '' },
  },
  setup(props, { slots }) {
    return () =>
      h('div', { class: cn('mcpe-card-header', props.class) }, slots.default?.())
  },
})

export const McpeCardTitle = defineComponent({
  name: 'McpeCardTitle',
  props: {
    class: { type: String, default: '' },
  },
  setup(props, { slots }) {
    return () =>
      h('h3', { class: cn('mcpe-card-title', props.class) }, slots.default?.())
  },
})

export const McpeCardDescription = defineComponent({
  name: 'McpeCardDescription',
  props: {
    class: { type: String, default: '' },
  },
  setup(props, { slots }) {
    return () =>
      h('p', { class: cn('mcpe-card-description', props.class) }, slots.default?.())
  },
})

export const McpeCardContent = defineComponent({
  name: 'McpeCardContent',
  props: {
    class: { type: String, default: '' },
  },
  setup(props, { slots }) {
    return () =>
      h('div', { class: cn('mcpe-card-content', props.class) }, slots.default?.())
  },
})

export const McpeCardFooter = defineComponent({
  name: 'McpeCardFooter',
  props: {
    class: { type: String, default: '' },
  },
  setup(props, { slots }) {
    return () =>
      h('div', { class: cn('mcpe-card-footer', props.class) }, slots.default?.())
  },
})
