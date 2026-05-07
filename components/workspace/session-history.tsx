export function SessionHistory({ sessions }: { sessions: Array<{ id: string; title: string }> }) {
  return (
    <div className="space-y-2">
      {sessions.map((session) => (
        <div key={session.id} className="rounded-md border p-2 text-sm">
          {session.title}
        </div>
      ))}
    </div>
  );
}
