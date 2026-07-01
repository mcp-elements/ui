import { defineComponent, h, ref, watch, onUnmounted } from 'vue'
import { cn, createAppBridge } from '@mcp-elements/core'
import type { AppBridge } from '@mcp-elements/core'

export const McpeMcpAppFrame = defineComponent({
  name: 'McpeMcpAppFrame',
  props: {
    src: { type: String, required: true },
    height: { type: Number, default: 480 },
    sandbox: { type: String, default: 'allow-scripts allow-same-origin' },
    class: { type: String, default: '' },
  },
  emits: ['message'],
  setup(props, { emit }) {
    const frameRef = ref<HTMLIFrameElement | null>(null)

    let bridge: AppBridge | null = null
    let unsub: (() => void) | null = null
    let messageHandler: ((e: MessageEvent) => void) | null = null

    const cleanup = () => {
      if (unsub) unsub()
      if (messageHandler) window.removeEventListener('message', messageHandler)
      unsub = null
      messageHandler = null
      bridge = null
    }

    const setup = () => {
      cleanup()
      bridge = createAppBridge({
        postMessage: (env) => frameRef.value?.contentWindow?.postMessage(env, '*'),
      })
      unsub = bridge.onMessage((env) => emit('message', env))
      messageHandler = (e: MessageEvent) => bridge?.receive(e.data)
      window.addEventListener('message', messageHandler)
    }

    // Re-establish the bridge when the iframe mounts or its src changes.
    watch([frameRef, () => props.src], () => {
      if (frameRef.value) setup()
    })

    onUnmounted(cleanup)

    return () =>
      h('div', { class: cn('mcpe-mcp-app-frame', props.class) }, [
        h('iframe', {
          ref: frameRef,
          src: props.src,
          sandbox: props.sandbox,
          height: `${props.height}px`,
          title: 'MCP App',
          'aria-label': 'MCP App frame',
          style: 'display:block;width:100%;border:none',
        }),
      ])
  },
})
