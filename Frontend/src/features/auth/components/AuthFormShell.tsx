import type { ReactNode } from "react"

import { DumbbellIcon } from "lucide-react"



interface AuthFormShellProps {

  title: string

  subtitle?: string

  children: ReactNode

  footer?: ReactNode

}



export function AuthFormShell({ title, subtitle, children, footer }: AuthFormShellProps) {

  return (

    <div className="w-full space-y-8">

      <div className="flex flex-col items-center gap-4 text-center">

        <div className="space-y-2">

          <h1

            className="text-4xl font-bold uppercase tracking-tight text-foreground md:text-5xl"

            style={{ fontFamily: "var(--font-bebas)", lineHeight: 0.95 }}

          >

            {title}

          </h1>

          {subtitle ? (

            <p className="text-sm text-muted-foreground md:text-base">{subtitle}</p>

          ) : null}

        </div>

      </div>



      <div className="space-y-6">{children}</div>



      {footer ? <div className="text-center">{footer}</div> : null}

    </div>

  )

}


