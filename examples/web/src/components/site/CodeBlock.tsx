import { codeToHtml } from 'shiki'
import { CopyButton } from './CopyButton'

interface CodeBlockProps {
  code: string
  lang?: string
  filename?: string
}

export async function CodeBlock({ code, lang = 'typescript', filename }: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang,
    theme: 'github-dark-dimmed',
  })

  return (
    <div
      className="group relative overflow-hidden rounded-xl"
      style={{ backgroundColor: 'var(--site-bg-elevated)', border: '1px solid var(--site-border)' }}
    >
      {filename ? (
        <div
          className="flex items-center justify-between px-4 py-2 text-xs font-mono"
          style={{ borderBottom: '1px solid var(--site-border)', color: 'var(--site-text-muted)' }}
        >
          <span>{filename}</span>
          <CopyButton text={code} />
        </div>
      ) : (
        <div className="absolute right-3 top-3 z-10 opacity-0 transition-opacity group-hover:opacity-100">
          <CopyButton text={code} />
        </div>
      )}
      <div
        className="overflow-x-auto p-4 text-sm [&_pre]:!bg-transparent [&_pre]:!p-0"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
