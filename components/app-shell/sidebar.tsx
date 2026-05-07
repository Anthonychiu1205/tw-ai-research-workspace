import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const items = [
  { href: "/workspace", label: "Workspace" },
  { href: "/reports", label: "Reports" },
  { href: "/strategies", label: "Strategies" },
  { href: "/traces", label: "Traces" },
];

export function Sidebar() {
  return (
    <aside className="w-56 border-r border-border p-3">
      <div className="mb-4 text-sm font-semibold">TW AI Research</div>
      <div className="space-y-2">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="block rounded-md px-3 py-2 text-sm hover:bg-muted">
            {item.label}
          </Link>
        ))}
      </div>
      <div className="mt-4">
        <Badge>mock-first</Badge>
      </div>
    </aside>
  );
}
