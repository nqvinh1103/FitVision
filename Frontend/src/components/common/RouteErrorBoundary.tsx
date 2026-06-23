import { Component, type ErrorInfo, type ReactNode } from "react"
import { ErrorFallback } from "@/components/common/ErrorFallback"

interface RouteErrorBoundaryProps {
  children: ReactNode
  fallbackTitle?: string
}

interface RouteErrorBoundaryState {
  hasError: boolean
  message?: string
}

export class RouteErrorBoundary extends Component<
  RouteErrorBoundaryProps,
  RouteErrorBoundaryState
> {
  state: RouteErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(error: Error): RouteErrorBoundaryState {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Route error:", error, info.componentStack)
  }

  handleRetry = () => {
    this.setState({ hasError: false, message: undefined })
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          title={this.props.fallbackTitle}
          message={this.state.message}
          onRetry={this.handleRetry}
        />
      )
    }

    return this.props.children
  }
}
