/**
 * 카테고리 목록 페이지
 * - 전체 카테고리를 카드 형태로 표시
 * - 서버 컴포넌트
 */

import Link from "next/link"
import type { Metadata } from "next"
import { getCategories, getPostsByCategory } from "@/lib/notion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "카테고리 | 기술 블로그",
  description: "블로그 카테고리 목록",
}

// Notion API 응답 캐시: 60초마다 재검증
export const revalidate = 60

export default async function CategoriesPage() {
  const categories = await getCategories()

  // 각 카테고리별 글 수 조회
  const categoryWithCount = await Promise.all(
    categories.map(async (category) => {
      const posts = await getPostsByCategory(category)
      return { name: category, count: posts.length }
    })
  )

  return (
    <div className="container mx-auto px-4 py-10">
      {/* 페이지 헤더 */}
      <div className="mb-10 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">카테고리</h1>
        <p className="text-muted-foreground">
          총 {categories.length}개의 카테고리가 있습니다.
        </p>
      </div>

      {/* 카테고리 그리드 */}
      {categoryWithCount.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categoryWithCount.map(({ name, count }) => (
            <Link key={name} href={`/categories/${encodeURIComponent(name)}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <h2 className="text-lg font-semibold">{name}</h2>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">{count}개의 글</Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">카테고리가 없습니다.</p>
      )}
    </div>
  )
}
