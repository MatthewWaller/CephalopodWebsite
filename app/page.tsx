import HomeClient from "@/components/home-client"
import { projects } from "@/lib/projects"
import { getAllPosts, formatDate } from "@/lib/blog"

export default function Home() {
  const posts = getAllPosts()
    .slice(0, 3)
    .map((post) => ({ ...post, formattedDate: formatDate(post.date) }))

  return <HomeClient projects={projects} posts={posts} />
}
