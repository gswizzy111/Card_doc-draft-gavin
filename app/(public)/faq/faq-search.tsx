"use client";

import { useId, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import type { FaqSection } from "./faq-data";
import { DocSprite } from "@/components/pixel/sprites";

const INSTAGRAM = "https://www.instagram.com/the_card_doc";

// "Pokemon" finds "Pokémon"; case and accents don't matter
const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** The text with @the_card_doc linked and each search word highlighted. */
function Rich({ text, words }: { text: string; words: string[] }) {
  const parts = text.split(/(@the_card_doc)/);
  return (
    <>
      {parts.map((part, i) =>
        part === "@the_card_doc" ? (
          <a key={i} href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="font-semibold text-coral-deep underline underline-offset-2 hover:text-ink">
            @the_card_doc
          </a>
        ) : (
          <Highlight key={i} text={part} words={words} />
        )
      )}
    </>
  );
}

function Highlight({ text, words }: { text: string; words: string[] }) {
  if (!words.length) return <>{text}</>;
  const folded = fold(text);
  const marks: [number, number][] = [];
  for (const w of words) {
    let at = folded.indexOf(w);
    while (at !== -1) {
      marks.push([at, at + w.length]);
      at = folded.indexOf(w, at + w.length);
    }
  }
  if (!marks.length) return <>{text}</>;
  marks.sort((a, b) => a[0] - b[0]);
  const out: React.ReactNode[] = [];
  let pos = 0;
  for (const [start, end] of marks) {
    if (start < pos) continue;
    if (start > pos) out.push(text.slice(pos, start));
    out.push(<mark key={start} className="bg-butter px-0.5 text-ink">{text.slice(start, end)}</mark>);
    pos = end;
  }
  out.push(text.slice(pos));
  return <>{out}</>;
}

export function FaqSearch({ sections }: { sections: FaqSection[] }) {
  const [query, setQuery] = useState("");
  const inputId = useId();
  const words = useMemo(() => fold(query).split(/\s+/).filter((w) => w.length > 1), [query]);
  const searching = words.length > 0;

  // A question matches when every word appears in it or in its answer
  const results = useMemo(() => {
    if (!searching) return sections;
    return sections
      .map((s) => ({ ...s, items: s.items.filter((it) => words.every((w) => fold(`${it.q} ${it.a}`).includes(w))) }))
      .filter((s) => s.items.length > 0);
  }, [sections, words, searching]);
  const count = results.reduce((n, s) => n + s.items.length, 0);

  return (
    <div>
      {/* Search: the records desk */}
      <div className="px-window-ink relative p-3 pt-5 md:p-4 md:pt-6">
        <span aria-hidden className="absolute -top-4 left-4 z-[1] inline-flex h-7 items-center gap-1.5 bg-butter px-2.5 font-pixel text-xs uppercase text-ink px-frame">
          <span className="text-coral-deep">▶</span>RECORDS
        </span>
        <div className="relative">
        <label htmlFor={inputId} className="sr-only">Search the FAQ</label>
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-soft" strokeWidth={2} />
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions, e.g. slab, PSA, drop-off"
          autoComplete="off"
          className="w-full h-14 rounded-none border-2 border-ink bg-panel pl-12 pr-14 text-base text-ink shadow-[inset_0_3px_0_var(--muted)] placeholder:text-ink-soft outline-none transition-colors focus-visible:border-frame-deep focus-visible:bg-[color-mix(in_srgb,var(--butter)_18%,var(--panel))] focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-frame-deep/35 [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center text-ink hover:bg-butter focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-frame-deep transition-colors duration-100"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        )}
        </div>
      </div>

      {/* Topics, or the result count while searching */}
      <div className="mt-6 min-h-11" aria-live="polite">
        {searching ? (
          <p className="inline-flex min-h-8 items-center bg-panel px-3 py-1.5 font-pixel text-xs uppercase tracking-[0.04em] text-ink px-frame">
            {count === 0 ? "No questions match" : `${count} question${count === 1 ? "" : "s"} match`} &ldquo;{query.trim()}&rdquo;
          </p>
        ) : (
          <nav aria-label="FAQ topics" className="flex flex-wrap gap-3">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="inline-flex min-h-11 items-center gap-2 bg-panel px-3.5 py-2 text-sm font-semibold text-ink px-frame hover:bg-butter focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-frame-deep transition-colors duration-100"
              >
                <span aria-hidden className="size-2 bg-coral-deep" />
                {s.title}
              </a>
            ))}
          </nav>
        )}
      </div>

      {count === 0 ? (
        <div className="px-window px-dialog mt-10 flex items-start gap-4 p-5 pr-10 md:p-6 md:pr-12">
          <DocSprite scale={2} className="shrink-0" />
          <div>
          <p className="font-heading text-2xl uppercase tracking-[0.02em] text-ink">Nothing here yet.</p>
          <p className="mt-2 text-[15px] text-ink-soft">
            Ask us directly: DM{" "}
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="font-semibold text-coral-deep underline underline-offset-2 hover:text-ink">@the_card_doc</a>{" "}
            on Instagram.
          </p>
          </div>
          <span aria-hidden className="px-dialog-next">▼</span>
        </div>
      ) : (
        <div className="mt-10 flex flex-col gap-12 md:gap-14">
          {results.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-28 px-window-ink p-0 md:p-0">
              {/* The file folder's tab */}
              <div className="flex items-center justify-between gap-3 border-b-[3px] border-ink bg-wall px-4 py-3 md:px-6">
                <h2 className="font-heading uppercase text-3xl md:text-4xl tracking-[0.02em] leading-[0.95] text-ink">
                  {section.title}
                </h2>
                <span aria-hidden className="inline-flex h-7 shrink-0 items-center bg-panel px-2 font-pixel text-xs text-ink tabular-nums px-frame">
                  {String(section.items.length).padStart(2, "0")}
                </span>
              </div>
              {/* While searching every match is open, so the answer is right there */}
              <Accordion key={searching ? `s-${query}` : "all"} multiple defaultValue={searching ? section.items.map((it) => it.q) : []} className="px-4 md:px-6">
                {section.items.map((item) => (
                  <AccordionItem key={item.q} value={item.q}>
                    <AccordionTrigger className="min-h-14 gap-3 py-4 font-sans normal-case tracking-normal text-base md:text-lg font-semibold text-ink hover:no-underline">
                      <span className="flex flex-1 items-start gap-2"><span aria-hidden className="menu-cursor invisible mt-[0.3em] group-hover/accordion-trigger:visible group-focus-visible/accordion-trigger:visible group-aria-expanded/accordion-trigger:visible">▶</span><span><Highlight text={item.q} words={words} /></span></span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="px-dialog relative mb-5 bg-[color-mix(in_srgb,var(--powder)_22%,var(--panel))] p-4 pr-9 shadow-[inset_0_0_0_2px_var(--frame)]">
                        <p className="text-[15px] md:text-base text-ink leading-relaxed max-w-[65ch]">
                          <Rich text={item.a} words={words} />
                        </p>
                        <span aria-hidden className="px-dialog-next">▼</span>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
