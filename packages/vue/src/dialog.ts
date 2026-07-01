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
      const body = document.body
      // Compensate for the scrollbar so the page doesn't shift on open.
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      const prevOverflow = body.style.overflow
      const prevPaddingRight = body.style.paddingRight
      body.style.overflow = 'hidden'
      if (scrollbarWidth > 0) {
        const currentPad = parseFloat(getComputedStyle(body).paddingRight) || 0
        body.style.paddingRight = `${currentPad + scrollbarWidth}px`
      }
      return () => {
        body.style.overflow = prevOverflow
        body.style.paddingRight = prevPaddingRight
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
        h(
          'div',
          {
            class: 'mcpe-dialog-overlay',
            onClick: close,
          },
          [
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
                        width: '16',
                        height: '16',
                        viewBox: '0 0 24 24',
                        fill: 'none',
                        stroke: 'currentColor',
                        'stroke-width': '2',
                        'stroke-linecap': 'round',
                        'stroke-linejoin': 'round',
                        'aria-hidden': 'true',
                      },
                      [
                        h('path', { d: 'M18 6 6 18' }),
                        h('path', { d: 'm6 6 12 12' }),
                      ]
                    ),
                  ]
                ),
              ]
            ),
          ]
        ),
      ])
    }
  },
})
