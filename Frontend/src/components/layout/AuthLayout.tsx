import { Link, Outlet } from "react-router-dom"

import { ArrowLeft, DumbbellIcon } from "lucide-react"

import { RouteErrorBoundary } from "@/components/common/RouteErrorBoundary"



function DiagonalStripes() {

  return (

    <>

      <div

        aria-hidden

        className="pointer-events-none absolute -left-24 -top-10 z-[1] h-40 w-[140%] -rotate-[35deg]"

      >

        <div className="h-1/2 bg-accent" />

        <div className="h-1/2 bg-foreground/10" />

      </div>

      <div

        aria-hidden

        className="pointer-events-none absolute -bottom-16 -right-24 z-[1] h-48 w-[140%] -rotate-[35deg]"

      >

        <div className="h-1/2 bg-foreground/10" />

        <div className="h-1/2 bg-accent" />

      </div>

      <div

        aria-hidden

        className="pointer-events-none absolute left-[8%] top-[18%] z-[1] h-px w-32 rotate-[35deg] bg-foreground/20"

      />

      <div

        aria-hidden

        className="pointer-events-none absolute bottom-[22%] right-[10%] z-[1] h-px w-40 rotate-[35deg] bg-foreground/20"

      />

    </>

  )

}



export function AuthLayout() {

  return (

    <div className="landing relative flex min-h-screen flex-col overflow-hidden bg-white text-foreground">

      <img

        src="/auth-hero.png"

        alt=""

        className="absolute inset-0 h-full w-full object-cover object-left"

      />

      <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/55" />




      <header className="relative z-20 border-b border-border/60 bg-white/70 backdrop-blur-md">

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-20 md:px-8">

          <Link

            to="/"

            className="inline-flex items-center gap-2 text-2xl font-bold uppercase leading-none tracking-tight md:text-3xl"

            style={{ fontFamily: "var(--font-bebas)" }}

          >

            <ArrowLeft className="size-5 text-foreground" />

            <span style={{ color: "#d30005" }}>FitVision AI</span>

          </Link>



          <nav className="hidden items-center gap-8 md:flex">

            <Link

              to="/login"

              className="text-xs font-semibold uppercase tracking-widest text-foreground/70 transition-colors hover:text-accent"

            >

              Sign in

            </Link>

            <Link

              to="/register"

              className="inline-flex rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-foreground/90"

            >

              Start Free Trial

            </Link>

          </nav>

        </div>

      </header>



      <div className="relative z-10 flex flex-1 flex-col px-4 py-8 md:px-8 md:py-12">

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center">

          <RouteErrorBoundary fallbackTitle="Authentication error">

            <Outlet />

          </RouteErrorBoundary>

        </div>



        

      </div>

    </div>

  )

}


