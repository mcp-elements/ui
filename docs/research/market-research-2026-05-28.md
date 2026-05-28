# Market Research Update — 2026-05-28

**Research scope:** Competitive landscape, MCP adoption, and gap validation for `mcp-elements` — a multi-framework, MCP-native, copy-paste UI primitives library.  
**Previous research date:** 2026-05-21  
**Research window:** Changes and announcements since May 21, 2026.

---

## TL;DR (Biggest Changes Since May 21)

- **Google A2UI v0.9 is the highest-threat new entrant.** Released April 17, 2026, it is framework-agnostic (React, Angular, Flutter, Lit, SwiftUI) and backed by Google, with AWS, Microsoft, Oracle, and major AI frameworks adopting it. It targets generative UI (agent-rendered components), not MCP-specific primitives — but its multi-framework reach overlaps our positioning. This is the most important development to track.
- **CopilotKit's $27M Series A (May 5) accelerates AG-UI as a protocol standard.** With AWS Bedrock, Microsoft Agent Framework, and Google backing AG-UI, the "agent–UI communication layer" is converging into an infrastructure play. CopilotKit shipped "Enterprise Intelligence" with MCP Apps support — but it remains React-only for components and locked to their AG-UI runtime.
- **The multi-framework MCP UI primitives gap is still wide open.** No library ships copy-paste MCP-specific primitives (server picker, consent dialog, scope inspector, tool-call card, resource browser) across React + Angular + Vue. Every major player either (a) is React-only, or (b) is framework-agnostic at the protocol level but not at the component level. `mcp-elements` has a clear, unoccupied lane.

---

## Competitor Landscape (Updated)

| Library | Stars (approx.) | Frameworks | Distribution | Key Gap | Changes Since May 21 |
|---|---|---|---|---|---|
| **Vercel AI Elements** | ~3.2k | React only | Copy-paste via shadcn CLI + npm | No Vue/Angular; MCP Apps support still open issue (#285) | v1.9 shipped May 11: Voice/Code components, Attachments refactor, Slots. No MCP-native primitives added. |
| **assistant-ui** | ~7.9k | React (web, mobile, terminal) | npm | React-only; no MCP primitives; no Angular/Vue | Launch week (March 2026) added React Native + Ink (terminal). Still React-only. No MCP primitives. |
| **CopilotKit** | ~28.6k | React + Angular (AG-UI protocol) | npm + Enterprise SaaS | Locked to AG-UI runtime; MCP Apps listed but not componentized | $27M Series A (May 5). Shipped Enterprise Intelligence: persistent threads, cross-device sync, governance. MCP Apps listed as supported but no standalone primitives. |
| **Tambo** | ~1.2k | React only | npm + Tambo Cloud | React-only; needs Tambo backend | v1.0 (Feb 2026): SOC2/HIPAA. Built-in MCP support but React only, and runtime-dependent. |
| **shadcn/ui + shadcn.io/ai** | ~80k+ | React only | Copy-paste (shadcn CLI) | React-only; no MCP UI primitives | v4 ships with Radix + Base UI support. MCP server for component browsing only — not MCP UI primitives for apps. |
| **Deep Chat** | ~3.3k | Web Component (all frameworks via custom element) | npm | Web Component only; no composable primitives; no MCP-specific components | v2.4.2: scrollButton, hiddenMessages, upwardsMode. No MCP primitives. No Angular/Vue-native versions. |
| **Google A2UI** | ~2.1k (A2UI repo) | React, Angular, Flutter, Lit, SwiftUI | pip / npm / pub | No MCP-specific primitives; generative UI schema-only (agent declares widgets); no copy-paste | **NEW ENTRANT — v0.9 released April 17, 2026.** Multi-framework. Backed by Google. AWS, Oracle, AG2, Vercel json-render support. Biggest new threat on framework coverage. |
| **Thesys / Crayon** | ~0.8k | React only (Radix/shadcn-based) | npm + C1 API | React-only; requires C1 API backend; no MCP-native primitives | Active in 2026; MCP integration via C1 API gateway. React-only components. |
| **TanStack AI** | ~1.5k | React, Vue, Angular, Solid (hooks layer) | npm | Alpha; hooks only — no pre-built UI components; no MCP primitives | Alpha published January 2026. Hooks/generation layer only — explicitly no UI components. No MCP primitives. |
| **mcp-ui (MCP-UI-Org)** | ~4.9k | TypeScript SDK (iframe/HTML-based) | npm + PyPI + Ruby gem | No component primitives; iframe-embedded HTML only; not composable | v7.1.1 released May 9, 2026. Now standardized into MCP Apps spec. SDK for embedding HTML into MCP tool responses, not a component library. |

---

## New Entries Since May 21

### Google A2UI v0.9 — April 17, 2026
The most significant new development. A2UI is Google's open standard for "declarative generative UI" — an agent declares UI intent via JSON schema, and framework-specific renderers hydrate it. Key facts:
- Supports React, Angular, Flutter, Lit, SwiftUI renderers in v0.9.
- Works over MCP, WebSockets, REST, and A2A protocol as transport.
- **Does not ship MCP-specific primitives.** It is an agent → UI rendering system, not a library of pre-built components that devs copy-paste.
- Adopted by: AG2 (AutoGen creators), AWS Bedrock (proof-of-concept json-render), Oracle Agent Spec.
- Python SDK only for agent side (go/Kotlin coming). Browser-side renderers are npm packages.
- **Threat assessment:** Medium. Overlaps on multi-framework + MCP transport positioning. Does not solve the "give me a pre-built consent dialog / tool-call card" developer need. Different abstraction level (generative/runtime vs. copy-paste primitive).

### TanStack AI (Alpha, January 2026)
Framework-agnostic AI hooks for React, Vue, Angular, Solid, Svelte. Provider adapters for OpenAI, Anthropic, Gemini, Ollama. Explicitly a hooks/state layer — **no UI components included by design.** They describe themselves as "Switzerland of AI tools." This actually creates a positive signal: their hooks layer + mcp-elements UI primitives would be a natural pairing.

### mcp-ui / MCP-UI-Org (active, now standardized)
The `mcp-ui` project (4.9k stars, latest v7.1.1 May 9 2026) pioneered the "UI over MCP" concept and its spec became the official MCP Apps extension. It provides SDK plumbing (AppRenderer, createUIResource) for embedding HTML/iframe UIs in MCP tool responses. **It is not a component library** — it is the protocol layer. `mcp-elements` would sit above it, providing the actual pre-built primitives that developers use with mcp-ui's rendering layer.

---

## MCP Adoption Updates

### Download and Registry Numbers (as of May 24, 2026)
- **Monthly SDK downloads:** 97M+ (Anthropic's own citation, December 2025 update). Still the headline number in circulation.
- **Official MCP registry:** 9,652 servers indexed (May 24, 2026 snapshot).
- **GitHub ecosystem:** 15,926 repositories with `mcp-server` topic.
- **Independent census (Nerq, Q1 2026):** 17,468 MCP servers across all registries.
- **Month-over-month registry growth:** +18% through Q1 2026.

### Enterprise Adoption (Stacklok 2026 survey — most reliable source)
- 41% of surveyed orgs have MCP in some form of production (29% limited + 12% broad).
- 30% in pilot phase.
- 29% planning/evaluating.
- Note: An earlier unsourced "78% of Fortune 500 enterprises use MCP in production" claim from Zuplo has been flagged as unreliable by DigitalApplied.com. The Stacklok numbers are more credible.

### Platform Support (Verified, 2026)
Every major AI platform now supports MCP natively:
- Claude (native), ChatGPT (Apps SDK + Connectors), Google Gemini API + Vertex AI Agent Builder (March 2026), Cursor, Windsurf, Zed, JetBrains AI Assistant, Vercel AI SDK 5, OpenAI Agents SDK, VS Code GitHub Copilot, Goose, Postman, MCPJam.

### MCP Apps Extension (SEP-1865) Status
- Reached **stable status: January 26, 2026** under the Linux Foundation as the first official MCP extension.
- Host support: Claude (web + desktop), ChatGPT, VS Code GitHub Copilot, Goose, Postman, MCPJam.
- Launch partners building MCP Apps: Figma, Canva, Asana, Slack, Amplitude, Box, Clay, Hex, Monday.com, Salesforce.
- **MCP 2026-07-28 Release Candidate** is now published — includes: stateless protocol core, Extensions framework, Tasks, MCP Apps, authorization hardening, formal deprecation policy. MCP Apps is cementing itself as the official interactive UI layer for the protocol.

### Key Implication
The MCP Apps spec becoming stable and entering the spec RC means the "build interactive UIs for MCP tools" problem is formally acknowledged at protocol level. The spec defines the plumbing; **no one has built the developer-friendly component layer for it across frameworks**.

---

## AG-UI / Agent UI Ecosystem

### CopilotKit Series A ($27M, May 5, 2026)
CopilotKit raised $27M (led by Glilot Capital, NfX, SignalFire) and shipped:
- **CopilotKit Enterprise Intelligence:** Self-hostable, Kubernetes-native. Persistent threads, cross-device session sync, governance + compliance tooling.
- **AG-UI protocol adoption:** AWS Bedrock AgentCore (March 2026), Microsoft Agent Framework, Google ADK, LangGraph, CrewAI, AWS Strands, Mastra, LlamaIndex, Agno, PydanticAI — all AG-UI compatible.
- **MCP Apps listed as supported** in Enterprise Intelligence, but no standalone MCP UI primitives shipped.
- Still React-only for components. Angular support is at the protocol level only.

### AWS Bedrock AgentCore (March–April 2026)
- Native AG-UI support added to AgentCore Runtime (14 AWS regions).
- Developers get a browser-based local UI for inspecting token usage, tool calls, execution traces, and agent memory.
- This is a developer-tools UI (debugging/observability), not a production-facing component library.

### Microsoft (April–May 2026)
- AG-UI protocol integrated into Microsoft Agent Framework 1.0.
- Microsoft released a Fluent API for MCP Apps (Azure SDK Blog): Rich UI widgets for Copilot M365, built on Fluent UI React.
- Power Platform: Custom tools + rich UI for app-based conversations in Public Preview (April 22, 2026).
- **Framework note:** All Microsoft UI work is React/Fluent UI React. No Angular-native or Vue-native MCP component layer.

### Google (April 2026)
- A2UI v0.9 is Google's answer to the generative UI layer problem.
- Positions as an open standard, not a proprietary framework.
- Angular renderer is included — this is the **only significant development in Angular-compatible AI UI** since the last research update.

### Protocol Stack Convergence (2026 Consensus)
The developer community has converged on a three-layer stack:
1. **Tool/context layer:** MCP (tool calls, resource access, context injection)
2. **Agent-UI communication:** AG-UI (streaming events, state sync, human-in-the-loop)
3. **Generative UI rendering:** A2UI or MCP Apps (agent-declared or server-declared UI widgets)

**`mcp-elements` sits between layers 1 and 3** — it provides the pre-built, copy-pasteable UI components that developers use to build MCP-aware interfaces, regardless of which protocol layer combination they adopt.

---

## Gap Still Valid?

**YES — The multi-framework MCP UI primitives gap is still completely unoccupied.**

Evidence:

1. **No library ships copy-paste MCP-specific primitives across React + Angular + Vue.** The Feb 2026 DEV.to review of every AI chat UI library (by Alexander Lukashov) explicitly notes zero MCP-native UI libraries in the evaluation. The Akshay Chame Medium guide (May 2026) confirms MCP Apps has "limited implementation tooling."

2. **Every major library is React-only at the component level.** assistant-ui (React), CopilotKit components (React), Vercel AI Elements (React), Tambo (React), Thesys/Crayon (React), shadcn/ui (React). Google A2UI has Angular/Flutter renderer support but is a schema/declarative system, not copy-paste components.

3. **The mcp-ui SDK (4.9k stars, now the official MCP Apps implementation) is a protocol/plumbing layer, not components.** It gives you `AppRenderer` and `createUIResource`. Developers still need to build everything on top. That "everything" is what mcp-elements ships.

4. **TanStack AI explicitly ships no UI components** — they describe themselves as the hooks/state layer. This is a "bring your own UI" signal that validates demand for a composable UI layer.

5. **Enterprise MCP App builders (Figma, Canva, Asana, Slack, Salesforce) are all building custom UI for MCP.** No shared primitives library exists. They are all re-inventing the same patterns (consent flows, tool-call displays, scope pickers).

6. **The market is growing:** 97M+ monthly SDK downloads, 15,926 GitHub repos with mcp-server topic, 18% MoM registry growth in Q1 2026. The audience for mcp-elements is expanding rapidly.

---

## Implications for mcp-elements

### 1. Sharpen the "above-the-protocol" positioning
The A2UI / AG-UI / MCP Apps protocol convergence is accelerating. Lean into being the **component layer above the protocol stack** — "MCP-elements gives you the pre-built UI primitives to wire your MCP server to any framework; you bring the protocol client." Explicitly call out compatibility with mcp-ui, TanStack AI hooks, and Vercel AI SDK as integration points.

### 2. Angular support is now a stronger differentiator
Google A2UI has Angular renderer support — this is the first major AI UI initiative that acknowledges Angular. Enterprise teams using Angular are watching this space. Being the first **copy-paste component library** for Angular-native MCP UI (vs. A2UI's declarative rendering approach) is a specific, ownable claim.

### 3. Consent dialog and scope inspector are the highest-value primitives
The MCP Apps spec's security model centers on sandboxed iframes + user consent for UI-initiated tool calls. The developer community is actively building these consent flows from scratch. Shipping a production-ready, accessible, spec-compliant consent dialog + scope inspector as the first primitives would capture early adopter attention from teams building MCP Apps (especially the Figma/Canva/Slack-tier builders).

### 4. Position against "generative UI" as a complement, not a competitor
A2UI and MCP Apps enable agent-generated interfaces. mcp-elements provides the static/semi-static primitives developers use to **frame those interactions** (app-frame, server picker, scope inspector). These are complementary — consider explicit "works with A2UI" and "works with MCP Apps" documentation from day one.

### 5. mcp-ui (the SDK) is a foundation, not a competitor
With mcp-ui now standardized into MCP Apps, it is the delivery mechanism. mcp-elements components can be distributed as mcp-ui-compatible resources (targeting MCP App hosts like Claude, ChatGPT, VS Code) AND as framework-native components for app developers. Document both usage paths.

### 6. TanStack AI partnership opportunity
TanStack AI explicitly ships no UI. They have React, Vue, Angular, Solid adapter coverage. A "mcp-elements + TanStack AI" integration story would give both projects distribution on the other's user base. Worth reaching out once mcp-elements has a beta.

---

## Sources

- [Vercel AI Elements v1.9 Release](https://vercel.com/changelog/ai-elements-1-9)
- [Vercel AI Elements MCP Support Issue #285](https://github.com/vercel/ai-elements/issues/285)
- [AI Elements MCP page](https://ai-sdk.dev/elements/mcp) → [elements.ai-sdk.dev/mcp](https://elements.ai-sdk.dev/mcp)
- [CopilotKit Series A Blog Post](https://www.copilotkit.ai/blog/series-a)
- [TechCrunch: CopilotKit raises $27M](https://techcrunch.com/2026/05/05/copilotkit-raises-27m-to-help-devs-deploy-app-native-ai-agents/)
- [GeekWire: CopilotKit raises $27M](https://www.geekwire.com/2026/seattles-copilotkit-raises-27m-as-some-of-the-biggest-names-in-tech-adopt-its-ai-agent-protocol/)
- [Google A2UI v0.9 Blog Post](https://developers.googleblog.com/a2ui-v0-9-generative-ui/)
- [Google A2UI GitHub](https://github.com/google/a2ui)
- [A2UI.org](https://a2ui.org/)
- [MCP Adoption Statistics 2026 (DigitalApplied)](https://www.digitalapplied.com/blog/mcp-adoption-statistics-2026-model-context-protocol)
- [MCP Hits 97M Downloads](https://www.digitalapplied.com/blog/mcp-97-million-downloads-model-context-protocol-mainstream)
- [MCP Apps Official Blog Post (Jan 26, 2026)](https://blog.modelcontextprotocol.io/posts/2026-01-26-mcp-apps/)
- [MCP 2026-07-28 Release Candidate](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/)
- [MCP Apps Extension GitHub (ext-apps)](https://github.com/modelcontextprotocol/ext-apps/)
- [SEP-1865 Pull Request](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/1865)
- [MCP-UI GitHub (MCP-UI-Org)](https://github.com/MCP-UI-Org/mcp-ui)
- [MCP-UI Website](https://mcpui.dev/)
- [Tambo 1.0 Intro](https://tambo.co/blog/posts/introducing-tambo-generative-ui)
- [assistant-ui Launch Week (March 2026)](https://www.assistant-ui.com/blog/2026-03-launch-week)
- [Amazon Bedrock AgentCore + AG-UI](https://aws.amazon.com/about-aws/whats-new/2026/03/amazon-bedrock-agentcore-runtime-ag-ui-protocol/)
- [Microsoft Fluent API for MCP Apps](https://devblogs.microsoft.com/azure-sdk/mcp-as-easy-as-1-2-3-introducing-the-fluent-api-for-mcp-apps/)
- [Microsoft AG-UI Integration](https://learn.microsoft.com/en-us/agent-framework/integrations/ag-ui/)
- [TanStack AI Alpha](https://tanstack.com/blog/tanstack-ai-alpha-your-ai-your-way)
- [TanStack AI Docs](https://tanstack.com/ai/latest)
- [DEV.to: I Evaluated Every AI Chat UI Library in 2026](https://dev.to/alexander_lukashov/i-evaluated-every-ai-chat-ui-library-in-2026-heres-what-i-found-and-what-i-built-4p10)
- [Complete Guide to Generative UI Frameworks 2026 (Medium)](https://medium.com/@akshaychame2/the-complete-guide-to-generative-ui-frameworks-in-2026-fde71c4fa8cc)
- [Thesys / Crayon Overview](https://www.thesys.dev/)
- [CopilotKit Developer Guide to Generative UI 2026](https://www.copilotkit.ai/blog/the-developer-s-guide-to-generative-ui-in-2026)
- [WorkOS: MCP Apps Explained](https://workos.com/blog/2026-01-27-mcp-apps)
- [WorkOS: Everything Your Team Needs to Know About MCP 2026](https://workos.com/blog/everything-your-team-needs-to-know-about-mcp-in-2026)
- [Vercel json-render (InfoQ)](https://www.infoq.com/news/2026/03/vercel-json-render/)
- [MCP Apps vs A2UI Comparison](https://sunpeak.ai/blogs/mcp-apps-vs-a2ui/)
- [CopilotKit: A2UI What's New](https://www.copilotkit.ai/blog/a2ui-whats-new-in-google-generative-ui-spec)
