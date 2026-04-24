"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ExternalLink, ArrowRight, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Publication } from "@/types/publication";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type PublicationsListProps = {
  publications: Publication[];
};

function PublicationCard({
  pub,
  index,
}: {
  pub: Publication;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className={cn(
        "group",
        index % 3 === 1 ? "md:translate-y-8" : "",
        index % 3 === 2 ? "md:-translate-y-4" : ""
      )}
    >
      <div className="border border-[#1A1B4B]/20 bg-[#FFFFFF]  ">
        <div className="relative aspect-[16/10] overflow-hidden bg-[#1A1B4B]/5 ">
          <div className="flex h-full items-center justify-center">
            <FileText className="h-12 w-12 text-[#1A1B4B]/60 " />
          </div>
        </div>
        <div className="p-5">
          <div className="flex flex-wrap gap-2">
            {pub.authors.split(", ").slice(0, 3).map((author) => (
              <Badge
                key={author}
                className="border border-[#1A1B4B]/20 bg-[#FFFFFF] px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-wider  "
              >
                {author}
              </Badge>
            ))}
          </div>
          <h3 className="mt-3 text-base font-semibold uppercase leading-tight line-clamp-2">
            {pub.title}
          </h3>
          <p className="mt-3 text-sm leading-6 text-[#1A1B4B]  line-clamp-3">
            {pub.abstract}
          </p>
          <div className="mt-4 flex items-center justify-between border-t border-[#1A1B4B]/20 pt-4 ">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#1A1B4B]/70 ">
              <Calendar className="h-4 w-4" />
              {format(new Date(pub.publishedDate), "MMM yyyy")}
            </div>
            <Link
              href={pub.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 items-center border border-[#1A1B4B]/20 bg-[#FFFFFF] px-3 text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-[#1A1B4B] transition-colors hover:bg-[#1A1B4B]/10    "
            >
              Read paper
              <ExternalLink className="ml-2 h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function PublicationsList({ publications }: PublicationsListProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {publications.map((pub, index) => (
        <PublicationCard key={pub.id} pub={pub} index={index} />
      ))}
    </div>
  );
}