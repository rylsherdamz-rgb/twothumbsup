import { FileText, PenLine, Quote } from "lucide-react";
import Link from "next/link";

const icons = { posts: FileText, quotes: Quote, comments: PenLine };

export default function EmptyState({
  icon = "posts",
  title,
  description,
  action,
}: {
  icon?: "posts" | "quotes" | "comments";
  title: string;
  description: string;
  action?: { label: string; href: string };
}) {
  const Icon = icons[icon];
  return (
    <div className="text-center py-20 border border-[var(--border)] rounded-2xl bg-[var(--surface)]">
      <Icon className="w-8 h-8 text-[var(--text-dim)] mx-auto mb-4" />
      <h3 className="font-serif font-bold text-xl mb-2">{title}</h3>
      <p className="text-sm text-[var(--text-muted)] max-w-sm mx-auto mb-6">{description}</p>
      {action && (
        <Link href={action.href} className="button-primary inline-flex text-sm">
          {action.label}
        </Link>
      )}
    </div>
  );
}