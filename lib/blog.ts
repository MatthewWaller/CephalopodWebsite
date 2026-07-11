import fs from "fs"
import path from "path"
import { marked } from "marked"

export type BlogPostMeta = {
  title: string
  date: string
  slug: string
  filename: string
  excerpt: string
  image: string | null
}

const root = process.cwd()

export function getAllPosts(): BlogPostMeta[] {
  const index = JSON.parse(fs.readFileSync(path.join(root, "blog_index.json"), "utf8")) as BlogPostMeta[]
  return index
    .map((post) => ({
      ...post,
      image: post.image ? post.image.replace("../blog_assets/", "/blog_assets/") : null,
    }))
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPostBySlug(slug: string): (BlogPostMeta & { html: string }) | null {
  const post = getAllPosts().find((p) => p.slug === slug)
  if (!post) return null

  const markdown = fs.readFileSync(path.join(root, "blog_posts", post.filename), "utf8")
  const frontmatterMatch = markdown.match(/^---\s*\n(.*?)\n---\s*\n(.*)$/s)
  let body = frontmatterMatch ? frontmatterMatch[2] : markdown

  // Clean up leading indentation outside code blocks (mirrors the old blog_post.html logic)
  let inCodeBlock = false
  body = body
    .split("\n")
    .map((line) => {
      const trimmed = line.trim()
      if (trimmed.startsWith("```")) {
        inCodeBlock = !inCodeBlock
        return trimmed
      }
      if (inCodeBlock) return line
      if (/^(!\[|#|-|\*|>|\[)/.test(trimmed)) return trimmed
      const leadingSpaces = line.match(/^(\s*)/)![1].length
      if (leadingSpaces >= 4) return line.slice(leadingSpaces)
      return line
    })
    .join("\n")

  let html = marked.parse(body, { async: false }) as string
  html = html.replace(/src="\.\.\/blog_assets\//g, 'src="/blog_assets/')

  return { ...post, html }
}

export function formatDate(dateStr: string): string {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
