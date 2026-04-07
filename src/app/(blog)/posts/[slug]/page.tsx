/**
 * 글 상세 페이지
 * - slug로 Notion 페이지 조회 후 블록 렌더링
 * - 서버 컴포넌트
 */

import { notFound } from "next/navigation"
import { CalendarDays, ChevronLeft, Tag } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"
import { getPostBySlug, getPostContent, getPosts } from "@/lib/notion"
import { NotionBlocks } from "@/components/blog/notion-blocks"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// 정적 경로 생성: 빌드 시 발행된 모든 글의 slug를 사전 생성
// 환경 변수가 없는 경우(CI 빌드 등) 빈 배열 반환
export async function generateStaticParams() {
  if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
    return []
  }
  const posts = await getPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

// 동적 메타데이터 생성
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return { title: "글을 찾을 수 없습니다." }
  }

  return {
    title: post.title,
    description: `${post.category} | ${post.tags.join(", ")}`,
  }
}

// Notion API 응답 캐시: 60초마다 재검증
export const revalidate = 60

/**
 * 발행일 문자열을 "YYYY년 M월 D일" 형식으로 포맷합니다.
 */
function formatDate(dateStr: string): string {
  if (!dateStr) return ""
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // 글 정보와 본문 블록을 순차적으로 조회
  const post = await getPostBySlug(slug)

  // 글이 없거나 발행되지 않은 경우 404
  if (!post || post.status !== "발행됨") {
    notFound()
  }

  const blocks = await getPostContent(post.id)

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      {/* 목록으로 돌아가기 */}
      <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2">
        <Link href="/">
          <ChevronLeft className="h-4 w-4 mr-1" />
          목록으로
        </Link>
      </Button>

      {/* 글 헤더 */}
      <header className="mb-10 space-y-4">
        {/* 카테고리 뱃지 */}
        {post.category && (
          <div>
            <Badge variant="secondary">{post.category}</Badge>
          </div>
        )}

        {/* 글 제목 */}
        <h1 className="text-4xl font-bold tracking-tight leading-tight">
          {post.title}
        </h1>

        {/* 메타 정보 */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {/* 발행일 */}
          {post.publishedAt && (
            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
          )}

          {/* 태그 */}
          {post.tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <Tag className="h-4 w-4" />
              {post.tags.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* 본문 구분선 */}
      <hr className="mb-10 border-border" />

      {/* Notion 블록 본문 */}
      <article>
        <NotionBlocks blocks={blocks} />
      </article>
    </div>
  )
}
