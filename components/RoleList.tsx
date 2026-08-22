"use client";

import type { Role } from "@/lib/types";
import { PriorityBadge } from "./Badge";
import { RichText } from "./RichText";

export function RoleList({
  roles,
  added,
  onToggle,
}: {
  roles: Role[];
  added: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
      {roles.map((role) => {
        const isAdded = added.includes(role.id);
        return (
          <li
            key={role.id}
            className="grid gap-3 p-5 sm:grid-cols-[minmax(0,11rem)_7.5rem_minmax(0,1fr)_auto] sm:items-start sm:gap-6 sm:p-6"
          >
            <h3 className="text-h3 font-semibold text-ink">{role.name}</h3>

            {/* own column so pills line up regardless of name length */}
            <div className="sm:pt-0.5">
              <PriorityBadge priority={role.priority} />
            </div>

            <p className="text-body text-pretty text-muted">
              <RichText>{role.why}</RichText>
            </p>

            <button
              type="button"
              onClick={() => onToggle(role.id)}
              aria-pressed={isAdded}
              aria-label={isAdded ? `Remove ${role.name} from mission` : `Add ${role.name} to mission`}
              className={`justify-self-start rounded-full border px-4 py-2 text-small font-medium whitespace-nowrap transition-colors sm:justify-self-end ${
                isAdded
                  ? "border-accent bg-accent text-on-accent hover:bg-accent-hover"
                  : "border-line-strong bg-surface text-ink hover:bg-paper-deep"
              }`}
            >
              {isAdded ? "Added" : "Add"}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
