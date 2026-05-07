export function ErrorState({ message }: { message: string }) {
  return <div className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm">{message}</div>;
}
