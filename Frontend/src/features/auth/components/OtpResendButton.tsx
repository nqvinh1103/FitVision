interface OtpResendButtonProps {
  canResend: boolean
  secondsLeft: number
  isPending: boolean
  onResend: () => void
}

export function OtpResendButton({
  canResend,
  secondsLeft,
  isPending,
  onResend,
}: OtpResendButtonProps) {
  return (
    <p className="text-center text-sm text-muted-foreground">
      Didn&apos;t receive the code?{" "}
      <button
        type="button"
        disabled={!canResend || isPending}
        onClick={onResend}
        className="font-semibold text-foreground underline-offset-4 hover:text-accent hover:underline disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending
          ? "Sending..."
          : canResend
            ? "Resend code"
            : `Resend in ${secondsLeft}s`}
      </button>
    </p>
  )
}
