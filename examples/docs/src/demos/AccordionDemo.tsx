import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@mcp-elements/react'

const items = [
  { value: 'item-1' },
  { value: 'item-2' },
  { value: 'item-3' },
]

export function AccordionDemo() {
  return (
    <Accordion items={items} type="single" collapsible className="w-full max-w-sm">
      {(api) => (
        <>
          <AccordionItem>
            <AccordionTrigger
              isExpanded={api.expandedValues.includes('item-1')}
              onClick={() =>
                api.getTriggerProps('item-1', api.expandedValues).onClick()
              }
            >
              Is it accessible?
            </AccordionTrigger>
            {api.expandedValues.includes('item-1') && (
              <AccordionContent>
                <p className="text-sm text-muted-foreground pb-3">
                  Yes. It adheres to WAI-ARIA design patterns.
                </p>
              </AccordionContent>
            )}
          </AccordionItem>

          <AccordionItem>
            <AccordionTrigger
              isExpanded={api.expandedValues.includes('item-2')}
              onClick={() =>
                api.getTriggerProps('item-2', api.expandedValues).onClick()
              }
            >
              Is it styled?
            </AccordionTrigger>
            {api.expandedValues.includes('item-2') && (
              <AccordionContent>
                <p className="text-sm text-muted-foreground pb-3">
                  Yes. Ships with default styles via Tailwind CSS.
                </p>
              </AccordionContent>
            )}
          </AccordionItem>

          <AccordionItem>
            <AccordionTrigger
              isExpanded={api.expandedValues.includes('item-3')}
              onClick={() =>
                api.getTriggerProps('item-3', api.expandedValues).onClick()
              }
            >
              Is it animated?
            </AccordionTrigger>
            {api.expandedValues.includes('item-3') && (
              <AccordionContent>
                <p className="text-sm text-muted-foreground pb-3">
                  Yes. Transitions are handled with CSS for smooth animations.
                </p>
              </AccordionContent>
            )}
          </AccordionItem>
        </>
      )}
    </Accordion>
  )
}
