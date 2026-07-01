import {
  defineComponent,
  h,
  computed,
  watch,
  onMounted,
  onUnmounted,
  Teleport,
  type PropType,
  type VNode,
} from 'vue'
import { parseScopes } from '@mcp-elements/core'

export const McpeMcpConsentDialog = defineComponent({
  name: 'McpeMcpConsentDialog',
  props: {
    open: { type: Boolean, required: true },
    serverName: { type: String, required: true },
    serverIcon: { type: String, default: undefined },
    scopes: { type: Array as PropType<string[]>, default: () => [] },
  },
  emits: ['approve', 'deny'],
  setup(props, { emit }) {
    const parsedScopes = computed(() => parseScopes(props.scopes.join(' ')))

    const approve = () => emit('approve')
    const deny = () => emit('deny')

    // Match McpeDialog behaviour: Escape closes (deny) + scroll lock while open.
    let unlockScroll: (() => void) | null = null
    const lockScroll = () => {
      const body = document.body
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
      () => props.open,
      (isOpen) => {
        if (isOpen) {
          unlockScroll = lockScroll()
        } else if (unlockScroll) {
          unlockScroll()
          unlockScroll = null
        }
      },
      { immediate: true }
    )

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && props.open) deny()
    }

    onMounted(() => document.addEventListener('keydown', handleKeydown))
    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeydown)
      if (unlockScroll) unlockScroll()
    })

    return () => {
      if (!props.open) return h('span', { style: 'display:none' })

      const iconChild: VNode | string = props.serverIcon
        ? h('img', { src: props.serverIcon, alt: '' })
        : (props.serverName[0]?.toUpperCase() ?? '?')

      return h(Teleport as unknown as string, { to: 'body' }, [
        h(
          'div',
          { class: 'mcpe-dialog-overlay', onClick: deny },
          [
            h(
              'div',
              {
                class: 'mcpe-dialog-content',
                role: 'dialog',
                'aria-modal': 'true',
                'aria-label': `Allow ${props.serverName}?`,
                onClick: (e: MouseEvent) => e.stopPropagation(),
              },
              [
                h('div', { class: 'mcpe-mcp-consent-dialog' }, [
                  h('div', { class: 'mcpe-dialog-header' }, [
                    h('h2', { class: 'mcpe-dialog-title' }, 'Permission Request'),
                    h(
                      'p',
                      { class: 'mcpe-dialog-description' },
                      'Review and approve the permissions this server is requesting.'
                    ),
                  ]),
                  h('div', { class: 'mcpe-mcp-consent-dialog-server' }, [
                    h('div', { class: 'mcpe-mcp-consent-dialog-icon', 'aria-hidden': 'true' }, [iconChild]),
                    h('div', { class: 'mcpe-mcp-consent-dialog-server-text' }, [
                      h('p', { class: 'mcpe-mcp-consent-dialog-server-name' }, props.serverName),
                      h('p', { class: 'mcpe-mcp-consent-dialog-server-meta' }, 'is requesting access to'),
                    ]),
                  ]),
                  h(
                    'div',
                    {
                      class: 'mcpe-mcp-consent-dialog-scopes',
                      role: 'list',
                      'aria-label': 'Requested permissions',
                    },
                    parsedScopes.value.map((s) =>
                      h('div', { class: 'mcpe-mcp-consent-dialog-scope-item', role: 'listitem' }, [
                        h('span', { class: 'mcpe-mcp-consent-dialog-scope-resource' }, s.resource),
                        h(
                          'div',
                          { class: 'mcpe-mcp-consent-dialog-scope-perms' },
                          s.permissions.map((p) =>
                            h(
                              'span',
                              {
                                class: 'mcpe-mcp-consent-dialog-scope-perm',
                                'data-perm': p.toLowerCase(),
                              },
                              p
                            )
                          )
                        ),
                      ])
                    )
                  ),
                  h('div', { class: 'mcpe-mcp-consent-dialog-actions' }, [
                    h(
                      'button',
                      { type: 'button', class: 'mcpe-btn mcpe-btn-outline', onClick: deny },
                      'Deny'
                    ),
                    h(
                      'button',
                      { type: 'button', class: 'mcpe-btn mcpe-btn-primary', onClick: approve },
                      'Allow'
                    ),
                  ]),
                ]),
              ]
            ),
          ]
        ),
      ])
    }
  },
})
