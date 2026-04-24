import fs from "node:fs/promises";
import path from "node:path";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FaqItem = {
  section: string;
  question: string;
  answer: string;
};

const DEFAULT_SECTION = "General";

function cleanupMarkdownText(text: string): string {
  return text
    .replace(/\*\*/g, "")
    .replace(/\\\./g, ".")
    .replace(/\r/g, "")
    .trim();
}

function normalizeHeading(line: string): string {
  return cleanupMarkdownText(line.replace(/^#+\s*/, ""));
}

function getQuestion(line: string): string | null {
  const normalized = normalizeHeading(line);
  const match = normalized.match(/Q:\s*(.+)$/i);
  return match ? match[1].trim() : null;
}

function getSectionHeading(line: string): string | null {
  const normalized = normalizeHeading(line);
  if (!normalized || normalized.includes("Q:") || normalized.includes("A:")) {
    return null;
  }

  const isBoldHeading = /^\*\*.*\*\*$/.test(line.trim()) || /^###\s*\*\*.*\*\*$/.test(line.trim());
  if (!isBoldHeading) {
    return null;
  }

  return normalized;
}

function normalizeAnswer(answerLines: string[]): string {
  return cleanupMarkdownText(
    answerLines
      .join("\n")
      .replace(/^A:\s*/i, "")
      .replace(/\n{3,}/g, "\n\n")
  );
}

async function getFaqItems(): Promise<FaqItem[]> {
  const faqPath = path.join(process.cwd(), "FAQs.docx.md");
  const source = await fs.readFile(faqPath, "utf8");
  const lines = source.split("\n");

  const items: FaqItem[] = [];
  let section = DEFAULT_SECTION;
  let currentQuestion: string | null = null;
  let currentAnswer: string[] = [];

  const pushCurrent = () => {
    if (!currentQuestion) return;
    const answer = normalizeAnswer(currentAnswer);
    if (answer) {
      items.push({
        section,
        question: cleanupMarkdownText(currentQuestion),
        answer,
      });
    }
  };

  for (const line of lines) {
    const maybeQuestion = getQuestion(line);
    if (maybeQuestion) {
      pushCurrent();
      currentQuestion = maybeQuestion;
      currentAnswer = [];
      continue;
    }

    const maybeSection = getSectionHeading(line);
    if (maybeSection) {
      section = maybeSection;
      continue;
    }

    if (currentQuestion) {
      const normalized = normalizeHeading(line);
      if (normalized) {
        currentAnswer.push(normalized.replace(/^A:\s*/i, ""));
      } else if (currentAnswer.length > 0 && currentAnswer[currentAnswer.length - 1] !== "") {
        currentAnswer.push("");
      }
    }
  }

  pushCurrent();
  return items;
}

function renderInlineLinks(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = markdownLinkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const label = match[1];
    const href = match[2];
    const isExternal = href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:");

    if (isExternal) {
      nodes.push(
        <a
          key={`${href}-${match.index}`}
          href={href}
          target={href.startsWith("mailto:") ? undefined : "_blank"}
          rel={href.startsWith("mailto:") ? undefined : "noreferrer"}
          className="underline decoration-gray-400 underline-offset-4 transition-colors hover:text-gray-900 dark:decoration-gray-600 dark:hover:text-gray-100"
        >
          {label}
        </a>
      );
    } else {
      nodes.push(
        <Link
          key={`${href}-${match.index}`}
          href={href}
          className="underline decoration-gray-400 underline-offset-4 transition-colors hover:text-gray-900 dark:decoration-gray-600 dark:hover:text-gray-100"
        >
          {label}
        </Link>
      );
    }

    lastIndex = markdownLinkRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length > 0 ? nodes : [text];
}

function AnswerContent({ answer }: { answer: string }) {
  const blocks = answer.split("\n\n").map((block) => block.trim()).filter(Boolean);

  return (
    <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
      {blocks.map((block, index) => {
        const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
        const isList = lines.length > 0 && lines.every((line) => line.startsWith("* "));

        if (isList) {
          return (
            <ul key={`${index}-list`} className="list-disc pl-6 space-y-2">
              {lines.map((line, listIndex) => (
                <li key={`${index}-${listIndex}`}>{renderInlineLinks(line.replace(/^\*\s+/, ""))}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={`${index}-paragraph`} className="leading-7">
            {renderInlineLinks(lines.join(" "))}
          </p>
        );
      })}
    </div>
  );
}

export default async function FaqPage() {
  const faqs = await getFaqItems();
  const sectionOrder: string[] = [];
  const grouped = new Map<string, FaqItem[]>();

  for (const item of faqs) {
    if (!grouped.has(item.section)) {
      grouped.set(item.section, []);
      sectionOrder.push(item.section);
    }
    grouped.get(item.section)?.push(item);
  }

  return (
    <div className="bg-[#f7f5f1] text-gray-900 dark:bg-[#111416] dark:text-gray-100">
      <main className="mx-auto w-full max-w-[88rem] px-5 py-10 sm:px-7 lg:px-10">
        <section className="border border-gray-300 dark:border-gray-800">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="bg-[#ece8df] p-7 dark:bg-[#171b1d] sm:p-10">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
                FAQ
              </p>
              <h1 className="mt-4 text-balance text-[clamp(1.9rem,4.2vw,3.8rem)] font-semibold uppercase leading-[0.98]">
                Frequently asked questions from mentorship sessions.
              </h1>
              <p className="mt-5 max-w-[58ch] text-sm leading-8 text-gray-700 dark:text-gray-300">
                Answers across personal branding, career growth, public
                speaking, and scholarships.
              </p>
            </div>
            <div className="flex items-center bg-[#171b1d] px-7 py-10 text-gray-100 sm:px-10">
              <p className="text-sm leading-8 text-gray-300">
                Browse by section and expand each question for practical,
                experience-based responses.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-6 border-x border-b border-gray-300 py-14 dark:border-gray-800 md:py-16">
          {sectionOrder.map((section, sectionIndex) => {
            const items = grouped.get(section) ?? [];
            return (
              <section key={section} className="space-y-3">
                <div className="flex items-center gap-3 px-1">
                  <span className="inline-flex h-8 w-8 items-center justify-center border border-gray-300 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-gray-600 dark:border-gray-700 dark:text-gray-300">
                    {sectionIndex + 1}
                  </span>
                  <h2 className="text-base font-semibold uppercase tracking-[0.08em]">
                    {section}
                  </h2>
                </div>
                <div className="border border-gray-300 bg-white/70 px-4 dark:border-gray-800 dark:bg-[#171b1d]">
                  <Accordion type="single" collapsible className="w-full">
                    {items.map((item, index) => (
                      <AccordionItem
                        key={`${section}-${index}`}
                        value={`${section}-${index}`}
                        className="border-gray-300 dark:border-gray-800"
                      >
                        <AccordionTrigger className="text-left text-sm font-semibold uppercase tracking-[0.03em]">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          <AnswerContent answer={item.answer} />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </section>
            );
          })}
        </section>
      </main>
    </div>
  );
}
