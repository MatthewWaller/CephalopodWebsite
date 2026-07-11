import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { getAllPosts, getPostBySlug, formatDate } from "@/lib/blog"

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: `${post.title} - Cephalopod Studio`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  return (
    <div className="relative pt-32 pb-20 min-h-screen">
      <article className="container mx-auto px-4 max-w-3xl">
        <div className="mb-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 transition-colors font-medium mb-6"
          >
            <ArrowLeft size={18} /> Back to Blog
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground leading-tight">{post.title}</h1>
          <time dateTime={post.date} className="text-accent font-medium">
            {formatDate(post.date)}
          </time>
        </div>

        <div
          className="markdown-content content-overlay rounded-2xl p-6 md:p-10"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>
    </div>
  )
}
