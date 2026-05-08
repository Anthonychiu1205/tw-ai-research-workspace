import { Button, type ButtonProps } from "@/components/ui/button";

export function LoadingButton({
  loading,
  loadingLabel,
  children,
  ...props
}: ButtonProps & { loading?: boolean; loadingLabel?: string }) {
  return (
    <Button {...props} disabled={loading || props.disabled}>
      {loading ? (loadingLabel ?? "Loading...") : children}
    </Button>
  );
}
