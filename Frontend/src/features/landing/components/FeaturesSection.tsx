import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ChallengesAnimation } from "@/features/landing/components/ChallengesAnimation"
import { KineticAccordion } from "@/features/landing/components/KineticAccordion"
import { PaymentAnimation } from "@/features/landing/components/PaymentAnimation"
import { RAGAnimation } from "@/features/landing/components/RAGAnimation"
import { TrackingAnimation } from "@/features/landing/components/TrackingAnimation"

const accordionItems = [
  {
    id: 1,
    title: "Real-Time AI Tracking",
    description:
      "Advanced computer vision processes your movements frame-by-frame, detecting 33 unique body points in real time. Zero latency. Your data stays on-device. No uploads. No clouds.",
    content: <TrackingAnimation />,
  },
  {
    id: 2,
    title: "Smart RAG Programs",
    description:
      "Intelligent workout generation powered by Retrieval-Augmented Generation. Your preferences and form history are analyzed. The system searches a vector database of proven programs. AI synthesizes a custom plan that adapts to you.",
    content: <RAGAnimation />,
  },
  {
    id: 3,
    title: "PayOS Integration",
    description:
      "Seamless payment processing for premium features, coaching sessions, and program unlocks. Secure transactions. Transparent pricing. All handled through our PayOS partnership.",
    content: <PaymentAnimation />,
  },
  {
    id: 4,
    title: "Social Challenges",
    description:
      "Compete with friends, join global challenges, and build accountability through shared progress. Track leaderboards. Celebrate milestones. Build community.",
    content: <ChallengesAnimation />,
  },
]

export function FeaturesSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" })

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative w-full bg-white px-4 py-20 md:px-0"
    >
      <div className="mx-auto w-full max-w-6xl">
        <motion.div
          className="mb-16 px-4 md:px-12 lg:px-0"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="text-5xl font-black uppercase text-foreground md:text-7xl"
            style={{
              fontFamily: "var(--font-bebas)",
              lineHeight: 1,
              letterSpacing: "-0.03em",
            }}
          >
            Core Features
          </h2>
          <p className="mt-6 max-w-2xl text-base font-medium text-foreground md:text-lg">
            Advanced fitness intelligence powered by computer vision and large language models.
            Hover to explore each feature.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <KineticAccordion items={accordionItems} />
        </motion.div>
      </div>
    </section>
  )
}
