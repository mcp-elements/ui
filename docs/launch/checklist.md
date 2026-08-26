# 30-day launch checklist — started 2026-08-26

Kill criterion (decided 2026-08-25): if by ~Sept 25 there aren't real strangers using it
(~50+ stars or 3–5 issues/questions from unknown people), archive with a
"use X instead" note and move on.

## Week 1 — sharpen (DONE 2026-08-26)

- [x] McpAppFrame → full SEP-1865 host implementation (core `createAppHost` + React), "preview" dropped
- [x] Reposition: README, homepage hero, metadata, og-image, llms.txt, JSON-LD, GitHub + npm descriptions → "UI primitives for building MCP hosts"
- [x] Angular/Vue frozen (framed as "React-first protocol work" in README; adapters keep shipping)
- [x] Launch drafts refreshed for the SEP-1865 hook

## Week 2 — launch loudly (needs YOU — accounts/karma)

Same-day sequence, Tue–Thu, 8–10am ET:

1. [ ] Publish blog-post-2-mcp-apps.md on dev.to (account: mayurrawte — same as post 1)
2. [ ] r/mcp post (draft in distribution.md — post FIRST, home crowd)
3. [ ] X thread (distribution.md — fill in the dev.to URL in tweet 7)
4. [ ] Show HN (draft in show-hn.md) — ⛔ gated for new accounts as of 2026-07-07.
       Unblock: email hn@ycombinator.com linking the dev.to post + repo; light comment
       karma daily until then. Don't plain-link from the fresh account.
5. [ ] Days 2–5, one per day: r/LocalLLaMA → r/vuejs → r/Angular2 → r/nextjs (check self-promo rules)

## Weeks 3–4 — get listed + compound

Listings (PRs from your GitHub account; one line + link each, follow each repo's CONTRIBUTING):

- [ ] punkpeye/awesome-mcp-devtools — SDK/UI section: https://github.com/punkpeye/awesome-mcp-devtools
- [ ] punkpeye/awesome-mcp-clients — only if a "building clients" resources section exists: https://github.com/punkpeye/awesome-mcp-clients
- [ ] korchasa/awesome-mcp + abordage/awesome-mcp (auto-crawls GitHub; ensure repo topics are set)
- [ ] MCP-UI-Org showcase (mcpui.dev) — position as complementary host-side kit: https://github.com/MCP-UI-Org/mcp-ui
- [ ] modelcontextprotocol docs "If you're building an MCP client" section lists @mcp-ui/client —
      consider a respectful docs PR adding mcp-elements as a copy-paste alternative
      (https://modelcontextprotocol.io/docs/extensions/apps → "Client support")
- [ ] PulseMCP / Glama directories (submission forms on their sites)

Compounding:

- [ ] Small visible commit every 2–3 days (repo last-push reads as alive)
- [ ] Reply to every stranger (issue/comment/DM) within hours
- [ ] Repo topics: add `mcp-apps`, `sep-1865`, `mcp-host` (gh repo edit --add-topic)

## Loose ends (from WIP, still open)

- [ ] ⚠️ Rotate/revoke BOTH npm tokens pasted in chat on 2026-07-07 (one may still be in ~/.npmrc)
- [ ] Runtime-verify Vue/Angular dialog fix (build+parity only so far)
- [ ] Vue smoke-test harness / example app
