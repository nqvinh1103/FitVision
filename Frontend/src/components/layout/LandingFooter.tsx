export function LandingFooter() {
  return (
    <footer className="w-full border-t border-border bg-white px-4 py-12 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">PRODUCT</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <a href="#features" className="transition-colors hover:text-foreground">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  Security
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">COMPANY</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">LEGAL</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <a href="#privacy" className="transition-colors hover:text-foreground">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  Terms
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">CONNECT</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between border-t border-border pt-8 text-xs text-muted-foreground md:flex-row">
          <p>&copy; 2024 FitVision AI. All rights reserved.</p>
          <p>Powered by Edge Computing &amp; Computer Vision</p>
        </div>
      </div>
    </footer>
  )
}
