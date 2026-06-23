import { useRef } from "react"
import { motion, useInView } from "framer-motion"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

export function AhaMomentSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" })

  return (
    <section
      id="privacy"
      ref={sectionRef}
      className="relative flex min-h-screen w-full items-center bg-white px-4 py-20 md:px-8"
    >
      <div className="mx-auto w-full max-w-6xl">
        <motion.div
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.h2
            className="mb-6 text-5xl font-bold uppercase text-foreground md:text-7xl"
            style={{ fontFamily: "var(--font-bebas)", lineHeight: 1.1 }}
            variants={itemVariants}
          >
            Zero-Latency
            <br />
            Edge Computing
          </motion.h2>
          <motion.p
            className="max-w-2xl text-lg text-muted-foreground"
            variants={itemVariants}
          >
            MediaPipe runs locally on your device. No videos uploaded. No cloud processing. Your
            form data stays with you.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-8 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {[
            {
              title: "Instant Processing",
              description:
                "Real-time joint detection without any delay. Your movements are tracked immediately.",
            },
            {
              title: "Complete Privacy",
              description:
                "All processing happens on your device. Your data is never sent to our servers.",
            },
            {
              title: "33 Body Points",
              description:
                "Comprehensive tracking of your entire body for advanced form analysis.",
            },
          ].map((feature) => (
            <motion.div
              key={feature.title}
              className="flex flex-col space-y-4 border border-border bg-card p-8"
              variants={itemVariants}
            >
              <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 border border-border bg-card p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="mb-6 text-sm font-bold uppercase text-foreground">Technology Stack</h3>
          <div className="grid grid-cols-2 gap-6 text-sm md:grid-cols-4">
            {[
              { label: "Framework", value: "MediaPipe" },
              { label: "Processing", value: "Edge (Local)" },
              { label: "Latency", value: "<50ms" },
              { label: "Accuracy", value: "99.2%" },
            ].map((spec) => (
              <div key={spec.label}>
                <p className="mb-1 text-muted-foreground">{spec.label}</p>
                <p className="font-semibold text-foreground">{spec.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
