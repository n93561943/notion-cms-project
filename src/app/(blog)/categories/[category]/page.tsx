/**
 * 카테고리별 글 목록 페이지
 * - URL 파라미터의 category로 해당 카테고리 글만 조회
 * - 서버 컴포넌트
 */

import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getCategories, getPostsByCategory } from "@/lib/notion"
import { PostCard } from "@/components/blog/post-card"
import { Button } from "@/components/ui/button"

// 정적 경로 생성: 빌드 시 모든 카테고리 사전 생성
// 환경 변수가 없는 경우(CI 빌드 등) 빈 배열 반환
export async function generateStaticParams() {
  if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
    return []
  }
  const categories = await getCategories()
  return categories.map((category) => ({
    category: encodeURIComponent(category),
  }))
}

// 동적 메타데이터 생성
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category } = await params
  const decodedCategory = decodeURIComponent(category)

  return {
    title: `${decodedCategory} | 기술 블로그`,
    description: `${decodedCategory} 카테고리의 글 목록`,
  }
}

// Notion API 응답 캐시: 60초마다 재검증
export const revalidate = 60

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const decodedCategory = decodeURIComponent(category)

  // 해당 카테고리의 글 목록 조회
  const posts = await getPostsByCategory(decodedCategory)

  // 카테고리가 존재하지 않으면 404
  if (posts.length === 0) {
    const categories = await getCategories()
    if (!categories.includes(decodedCategory)) {
      notFound()
    }
  }

  return (
    <div className="container mx-auto px-4 py-10">
      {/* 카테고리 목록으로 돌아가기 */}
      <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2">
        <Link href="/categories">
          <ChevronLeft className="h-4 w-4 mr-1" />
          카테고리 목록
        </Link>
      </Button>

      {/* 페이지 헤더 */}
      <div className="mb-10 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{decodedCategory}</h1>
        <p className="text-muted-foreground">
          총 {posts.length}개의 글이 있습니다.
        </p>
      </div>

      {/* 글 목록 그리드: 데스크톱 3열 → 태블릿 2열 → 모바일 1열 */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">이 카테고리에 글이 없습니다.</p>
      )}
    </div>
  )
}
