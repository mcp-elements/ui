import { codeToHtml } from 'shiki'
import { FileCode2 } from 'lucide-react'
import { CopyButton } from './CopyButton'

interface CodeBlockProps {
  code: string
  lang?: string
  filename?: string
  /** Hide the header row entirely (useful for inline snippets). */
  hideHeader?: boolean
}

const LANG_LABEL: Record<string, string> = {
  tsx: 'TSX',
  ts: 'TS',
  typescript: 'TS',
  jsx: 'JSX',
  js: 'JS',
  javascript: 'JS',
  bash: 'Bash',
  sh: 'Bash',
  shell: 'Bash',
  css: 'CSS',
  html: 'HTML',
  json: 'JSON',
  vue: 'Vue',
  angular: 'TS',
}

export async function CodeBlock({ code, lang = 'typescript', filename, hideHeader = false }: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang,
    themes: {
      dark: 'github-dark-dimmed',
      light: 'github-light',
    },
    defaultColor: false,
  })

  const langLabel = LANG_LABEL[lang.toLowerCase()] ?? lang.toUpperCase()

  return (
    <div className="site-codeblock group">
      {!hideHeader && (
        <div className="site-codeblock-header">
          <span className="site-codeblock-filename">
            <FileCode2 className="site-codeblock-filename-icon h-3.5 w-3.5" aria-hidden />
            <span className="truncate">{filename ?? `example.${lang === 'typescript' ? 'ts' : lang}`}</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="site-codeblock-lang">{langLabel}</span>
            <CopyButton text={code} />
          </span>
        </div>
      )}
      {hideHeader && (
        <div className="site-codeblock-copy-floating">
          <CopyButton text={code} />
        </div>
      )}
      <div
        className="site-codeblock-body shiki-host"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
