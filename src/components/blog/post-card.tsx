/**
 * 글 카드 컴포넌트
 * - 제목, 카테고리 뱃지, 태그 목록, 발행일 표시
 * - 서버 컴포넌트 (상태/이벤트 없음)
 */

import Link from "next/link"
import { CalendarDays, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { Post } from "@/lib/notion"

interface PostCardProps {
  post: Post
}

/**
 * 발행일 문자열을 "YYYY년 M월 D일" 형식으로 포맷합니다.
 */
function formatDate(dateStr: string): string {
  if (!dateStr) return ""
  const date = new Date(dateStr)
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/posts/${post.slug}`} className="group block h-full">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader className="space-y-3">
          {/* 카테고리 뱃지 */}
          {post.category && (
            <div>
              <Badge variant="secondary" className="text-xs">
                {post.category}
              </Badge>
            </div>
          )}

          {/* 글 제목 */}
          <h2 className="text-lg font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h2>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* 태그 목록 */}
          {post.tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <Tag className="h-3 w-3 text-muted-foreground shrink-0" />
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* 발행일 */}
          {post.publishedAt && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays className="h-3 w-3 shrink-0" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
