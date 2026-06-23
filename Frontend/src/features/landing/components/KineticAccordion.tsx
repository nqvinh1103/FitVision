import { useState, type ReactNode } from "react"
import { AnimatePresence, LayoutGroup, motion } from "framer-motion"
import { Plus } from "lucide-react"

interface AccordionItem {
  id: number
  title: string
  description: string
  content: ReactNode
}

const easing = [0.83, 0, 0.17, 1] as const

export function KineticAccordion({ items }: { items: AccordionItem[] }) {
  const [activeId, setActiveId] = useState<number | null>(null)

  return (
    <LayoutGroup>
      <div className="w-full space-y-0">
        {items.map((item, index) => (
          <motion.div key={item.id} className="border-t border-[#cacacb]" layout>
            <motion.button
              type="button"
              onClick={() => setActiveId(activeId === item.id ? null : item.id)}
              className="group flex w-full items-center justify-between bg-white px-8 py-8 transition-colors hover:bg-muted md:px-12"
              layout="position"
            >
              <div className="flex flex-1 items-start gap-8 text-left">
                <span
                  className="flex-shrink-0 pt-1 text-lg font-bold tracking-widest text-foreground md:text-xl"
                  style={{ fontFamily: "var(--font-bebas)", letterSpacing: "-0.02em" }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3
                  className="flex-1 pt-0.5 text-3xl font-black uppercase leading-tight text-foreground md:text-5xl"
                  style={{
                    fontFamily: "var(--font-bebas)",
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                  }}
                >
                  {item.title}
                </h3>
              </div>
              <motion.div
                className="flex-shrink-0 text-foreground"
                animate={{ rotate: activeId === item.id ? 45 : 0 }}
                transition={{ duration: 0.3, ease: easing }}
              >
                <Plus size={28} strokeWidth={2.5} />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {activeId === item.id ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: easing }}
                  className="overflow-hidden bg-white"
                  layout="position"
                >
                  <div className="mt-3 grid grid-cols-1 gap-8 px-8 pb-12 md:grid-cols-2 md:px-12">
                    <div>
                      <p className="text-base font-medium leading-relaxed text-foreground">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex min-h-80 items-center justify-center bg-foreground p-8 text-white md:p-12">
                      {item.content}
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </LayoutGroup>
  )
}
