import type { Metadata } from "next"
import BlogCard from "@/components/blog-card"
import { getAllPosts, formatDate } from "@/lib/blog"

export const metadata: Metadata = {
  title: "Blog - Cephalopod Studio",
  description: "App launches, dev diaries, and lessons learned at Cephalopod Studio.",
}

export default function BlogPage() {
  const posts = getAllPosts().map((post) => ({ ...post, formattedDate: formatDate(post.date) }))

  return (
    <div className="relative pt-32 pb-20 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-foreground">
            The <span className="text-secondary">Blog</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Notes from the workshop — app launches, dev diaries, and lessons learned along the way.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <BlogCard key={post.slug} post={post} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}
