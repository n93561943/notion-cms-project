/**
 * 홈 페이지 - 블로그 글 목록
 * - 서버 컴포넌트: Notion API 데이터 fetch
 * - 클라이언트 컴포넌트(PostList)로 필터링 위임
 */

import { Suspense } from "react"
import { getPosts, getCategories } from "@/lib/notion"
import { PostList } from "@/components/blog/post-list"

export const metadata = {
  title: "기술 블로그",
  description: "개발 경험과 인사이트를 공유하는 Notion CMS 기반 기술 블로그",
}

// Notion API 응답 캐시: 60초마다 재검증
export const revalidate = 60

export default async function HomePage() {
  // 발행된 글 목록과 카테고리를 병렬로 조회
  const [posts, categories] = await Promise.all([
    getPosts(),
    getCategories(),
  ])

  return (
    <div className="container mx-auto px-4 py-10">
      {/* 페이지 헤더 */}
      <div className="mb-10 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">기술 블로그</h1>
        <p className="text-muted-foreground">
          총 {posts.length}개의 글이 있습니다.
        </p>
      </div>

      {/* Suspense로 클라이언트 컴포넌트 감싸기 (useSearchParams 요구사항) */}
      <Suspense fallback={<PostListSkeleton />}>
        <PostList posts={posts} categories={categories} />
      </Suspense>
    </div>
  )
}

/**
 * 글 목록 로딩 스켈레톤 UI
 */
function PostListSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-10 w-64 animate-pulse rounded-md bg-muted" />
      <div className="flex gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-8 w-20 animate-pulse rounded-md bg-muted" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    </div>
  )
}
