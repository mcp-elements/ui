import { Badge, Button, Card, CardContent, Switch } from '@mcp-elements/react'
import { useState } from 'react'

export function Hero() {
  const [switchChecked, setSwitchChecked] = useState(true)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText('npx snuxt-ui add button')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Glow orb */}
      <div className="glow-orb absolute w-[600px] h-[600px] rounded-full top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl">
        {/* Badge */}
        <div className="animate-fade-in-up">
          <Badge variant="outline">v0.1.0 — 31 components</Badge>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mt-6 animate-fade-in-up delay-200">
          Build interfaces
          <br />
          <span className="gradient-text">without framework lock-in</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-muted-foreground mt-6 max-w-xl mx-auto animate-fade-in-up delay-300">
          31 professionally crafted components. CSS-first. Tailwind v4. One CLI
          command. React + Angular.
        </p>

        {/* CTA buttons */}
        <div className="flex gap-3 justify-center mt-8 animate-fade-in-up delay-400">
          <a href="#components" className="mcpe-btn mcpe-btn-primary mcpe-btn-lg">
            Get Started
          </a>
          <Button
            variant="outline"
            size="lg"
            className="font-mono"
            onClick={handleCopy}
          >
            {copied ? 'Copied!' : 'npx snuxt-ui add button'}
            {!copied && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-2"
              >
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
            )}
          </Button>
        </div>

        {/* Floating preview card */}
        <div className="mt-16 animate-fade-in-up delay-500 animate-float">
          <Card className="shadow-2xl p-6 inline-block">
            <CardContent className="flex flex-col gap-4 items-center">
              {/* Button variants row */}
              <div className="flex gap-2 flex-wrap justify-center">
                <Button>Primary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>

              {/* Switch with label */}
              <div className="flex items-center gap-2">
                <Switch
                  checked={switchChecked}
                  onCheckedChange={setSwitchChecked}
                />
                <span className="text-sm text-muted-foreground">
                  {switchChecked ? 'Enabled' : 'Disabled'}
                </span>
              </div>

              {/* Badges row */}
              <div className="flex gap-2 flex-wrap justify-center">
                <Badge>React</Badge>
                <Badge variant="outline">Angular</Badge>
                <Badge variant="secondary">Tailwind v4</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-muted-foreground"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </section>
  )
}
