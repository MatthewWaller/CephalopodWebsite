"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import type { BlogPostMeta } from "@/lib/blog"

const accents = [
  { text: "text-primary", border: "hover:border-primary", shadow: "hover:shadow-primary/20" },
  { text: "text-secondary", border: "hover:border-secondary", shadow: "hover:shadow-secondary/20" },
  { text: "text-accent", border: "hover:border-accent", shadow: "hover:shadow-accent/20" },
]

type BlogCardProps = {
  post: BlogPostMeta & { formattedDate: string }
  index: number
}

export default function BlogCard({ post, index }: BlogCardProps) {
  const accent = accents[index % accents.length]

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      viewport={{ once: true }}
      className="h-full"
    >
      <Link
        href={`/blog/${post.slug}`}
        className={`group flex h-full flex-col overflow-hidden rounded-2xl bg-muted/40 backdrop-blur-sm border-2 border-transparent transition-all duration-300 hover:-translate-y-2 hover:shadow-lg ${accent.border} ${accent.shadow}`}
      >
        {post.image && (
          <div className="relative aspect-[16/9] overflow-hidden">
            <img
              src={post.image}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col p-6">
          <time dateTime={post.date} className={`text-sm font-medium mb-2 ${accent.text}`}>
            {post.formattedDate}
          </time>
          <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{post.excerpt}</p>
          <span className={`mt-auto inline-flex items-center gap-1 text-sm font-medium ${accent.text}`}>
            Read more <ArrowUpRight size={16} />
          </span>
        </div>
      </Link>
    </motion.article>
  )
}
