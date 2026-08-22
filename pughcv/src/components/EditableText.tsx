"use client";

import { useLayoutEffect, useRef } from "react";

/**
 * A textarea that inherits the surrounding document typography and grows with
 * its content, so an editable field looks identical to the rendered text it
 * replaces. Multi-line by design — resume bullets and summaries wrap.
 */
export function EditableText({
  value,
  onChange,
  label,
  placeholder,
  className = "",
}: {
  value: string;
  onChange: (next: string) => void;
  label: string;
  placeholder?: string;
  className?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  // Re-measure on every value change; `auto` first so the box can shrink too.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      rows={1}
      value={value}
      aria-label={label}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`-mx-1 block w-full resize-none overflow-hidden rounded-sm bg-black/[0.04] px-1 py-0 [font:inherit] text-inherit outline-none ring-1 ring-inset ring-transparent placeholder:text-paper-muted/60 hover:bg-black/[0.06] focus:bg-white focus:ring-accent ${className}`}
    />
  );
}

/** Small circular control for removing a list entry in edit mode. */
export function RemoveButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full text-paper-muted/70 transition-colors hover:bg-red-100 hover:text-red-600"
    >
      <svg aria-hidden viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
      </svg>
    </button>
  );
}

/** Dashed "add another" affordance used under each editable list. */
export function AddButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-1.5 rounded-md border border-dashed border-paper-line px-2 py-1 text-[0.7rem] font-sans font-medium text-paper-muted transition-colors hover:border-accent hover:text-accent"
    >
      + {children}
    </button>
  );
}
