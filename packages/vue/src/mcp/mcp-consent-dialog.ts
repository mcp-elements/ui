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
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
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
        ? h('img', { src: props.serverIcon, alt: '', class: 'h-full w-full object-cover' })
        : (props.serverName[0]?.toUpperCase() ?? '?')

      return h(Teleport as unknown as string, { to: 'body' }, [
        h('div', { class: 'mcpe-dialog-overlay', onClick: deny }),
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
            h('div', { class: 'mcpe-mcp-consent-dialog-server' }, [
              h('div', { class: 'mcpe-mcp-consent-dialog-icon', 'aria-hidden': 'true' }, [iconChild]),
              h('div', {}, [
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
                  h('div', { class: 'flex-1 min-w-0' }, [
                    h('p', { class: 'mcpe-mcp-consent-dialog-scope-resource' }, s.resource),
                    h(
                      'div',
                      { class: 'mcpe-mcp-consent-dialog-scope-perms' },
                      s.permissions.map((p) =>
                        h('span', { class: 'mcpe-mcp-consent-dialog-scope-perm' }, p)
                      )
                    ),
                  ]),
                ])
              )
            ),
            h('div', { class: 'mcpe-mcp-consent-dialog-actions' }, [
              h(
                'button',
                { type: 'button', class: 'mcpe-btn mcpe-btn-outline flex-1', onClick: deny },
                'Deny'
              ),
              h(
                'button',
                { type: 'button', class: 'mcpe-btn mcpe-btn-primary flex-1', onClick: approve },
                'Allow'
              ),
            ]),
          ]
        ),
      ])
    }
  },
})
