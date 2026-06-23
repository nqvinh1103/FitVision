import { SparklesIcon, ZapIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function QuickAiBuilder() {
  return (
    <section className="relative col-span-12 mt-6 overflow-hidden border border-dashed border-border/60 bg-muted/20 p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, currentColor 25%, transparent 25%, transparent 75%, currentColor 75%, currentColor), repeating-linear-gradient(45deg, currentColor 25%, transparent 25%, transparent 75%, currentColor 75%, currentColor)",
          backgroundPosition: "0 0, 10px 10px",
          backgroundSize: "20px 20px",
        }}
      />

      <h2 className="relative z-10 mb-6 flex items-center gap-2 font-heading text-2xl uppercase">
        <SparklesIcon className="size-5 text-accent" />
        Quick AI Builder
      </h2>

      <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-xs font-bold tracking-widest text-muted-foreground uppercase">
            Target protocol
          </label>
          <Select defaultValue="hypertrophy">
            <SelectTrigger className="w-full rounded-none">
              <SelectValue placeholder="Select protocol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hypertrophy">Hypertrophy — Upper bias</SelectItem>
              <SelectItem value="strength">Strength — Powerlifting prep</SelectItem>
              <SelectItem value="conditioning">Conditioning — Metcon</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold tracking-widest text-muted-foreground uppercase">
            Duration &amp; intensity
          </label>
          <Select defaultValue="4weeks">
            <SelectTrigger className="w-full rounded-none">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4weeks">4 weeks — RPE 8–9</SelectItem>
              <SelectItem value="8weeks">8 weeks — Periodized</SelectItem>
              <SelectItem value="12weeks">12 weeks — Peak cycle</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button className="w-full rounded-none bg-accent font-heading text-xl text-accent-foreground uppercase hover:bg-accent/90">
            Generate plan
            <ZapIcon />
          </Button>
        </div>
      </div>
    </section>
  )
}
