import { Tabs, TabsList, TabsTrigger, TabsContent, Badge } from '@mcp-elements/react'
import { SectionHeader } from './SectionHeader'
import { ComponentCard } from './ComponentCard'
import { useInView } from '../hooks/useInView'
import { demos, categories, getDemosByCategory, getCategoryCounts } from '../demos'

const counts = getCategoryCounts()

export function ComponentShowcase() {
  const { ref: gridRef, inView: gridInView } = useInView()

  const tabItems = categories.map(c => ({ value: c, disabled: false }))

  return (
    <section id="components" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="Components"
          badge={<Badge variant="outline">{demos.length} components</Badge>}
        />

        <Tabs items={tabItems} defaultValue="All">
          {(api) => {
            const filtered = getDemosByCategory(api.value)

            return (
              <>
                <TabsList>
                  {categories.map((cat) => (
                    <TabsTrigger
                      key={cat}
                      isActive={api.value === cat}
                      onClick={() => api.setValue(cat)}
                    >
                      {cat} ({counts[cat]})
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent>
                  <div
                    ref={gridRef}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8"
                  >
                    {filtered.map((demo, index) => (
                      <div
                        key={demo.name}
                        style={{
                          opacity: gridInView ? 1 : 0,
                          transform: gridInView ? 'translateY(0)' : 'translateY(20px)',
                          transition: 'opacity 500ms ease-out, transform 500ms ease-out',
                          transitionDelay: `${index * 60}ms`,
                        }}
                      >
                        <ComponentCard name={demo.name} type={demo.type}>
                          <demo.component />
                        </ComponentCard>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </>
            )
          }}
        </Tabs>
      </div>
    </section>
  )
}
