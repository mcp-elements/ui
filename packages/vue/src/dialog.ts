import { defineComponent, h, Teleport, onMounted, onUnmounted, watch } from 'vue'
import { cn } from '@mcp-elements/core'

export const McpeDialog = defineComponent({
  name: 'McpeDialog',
  props: {
    modelValue: { type: Boolean, default: false },
    modal: { type: Boolean, default: true },
    class: { type: String, default: '' },
  },
  emits: ['update:modelValue'],
  setup(props, { slots, emit }) {
    const close = () => emit('update:modelValue', false)

    let unlockScroll: (() => void) | null = null

    const lockScroll = () => {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }

    watch(
      () => props.modelValue,
      (isOpen) => {
        if (isOpen && props.modal) {
          unlockScroll = lockScroll()
        } else if (!isOpen && unlockScroll) {
          unlockScroll()
          unlockScroll = null
        }
      },
      { immediate: true }
    )

    onUnmounted(() => {
      if (unlockScroll) {
        unlockScroll()
      }
    })

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close()
      }
    }

    onMounted(() => {
      document.addEventListener('keydown', handleKeydown)
    })

    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeydown)
    })

    return () => {
      if (!props.modelValue) return h('span', { style: 'display:none' })

      return h(Teleport as unknown as string, { to: 'body' }, [
        h('div', {
          class: 'mcpe-dialog-overlay',
          onClick: close,
        }),
        h(
          'div',
          {
            class: cn('mcpe-dialog-content', props.class),
            role: 'dialog',
            'aria-modal': props.modal,
            onClick: (e: MouseEvent) => e.stopPropagation(),
          },
          [
            slots.default?.(),
            h(
              'button',
              {
                class: 'mcpe-dialog-close',
                'aria-label': 'Close',
                type: 'button',
                onClick: close,
              },
              [
                h(
                  'svg',
                  {
                    xmlns: 'http://www.w3.org/2000/svg',
                    width: '15',
                    height: '15',
                    viewBox: '0 0 24 24',
                    fill: 'none',
                    stroke: 'currentColor',
                    'stroke-width': '2',
                    'stroke-linecap': 'round',
                    'stroke-linejoin': 'round',
                  },
                  [
                    h('path', { d: 'M18 6 6 18' }),
                    h('path', { d: 'm6 6 12 12' }),
                  ]
                ),
                h('span', { class: 'sr-only' }, 'Close'),
              ]
            ),
          ]
        ),
      ])
    }
  },
})
