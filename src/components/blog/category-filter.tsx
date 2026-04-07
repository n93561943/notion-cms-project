"use client"

/**
 * 카테고리 필터 컴포넌트
 * - URL 파라미터 기반으로 선택된 카테고리 표시
 * - "전체" 선택 시 모든 글 표시
 * - useRouter/useSearchParams를 사용하므로 클라이언트 컴포넌트
 */

import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CategoryFilterProps {
  categories: string[]
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedCategory = searchParams.get("category") ?? ""

  /**
   * 카테고리 선택 시 URL 쿼리 파라미터를 업데이트합니다.
   */
  function handleSelect(category: string) {
    const params = new URLSearchParams(searchParams.toString())

    if (category) {
      params.set("category", category)
    } else {
      params.delete("category")
    }

    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {/* 전체 보기 버튼 */}
      <Button
        variant={selectedCategory === "" ? "default" : "outline"}
        size="sm"
        onClick={() => handleSelect("")}
        className={cn("text-xs")}
      >
        전체
      </Button>

      {/* 카테고리별 버튼 */}
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          size="sm"
          onClick={() => handleSelect(category)}
          className="text-xs"
        >
          {category}
        </Button>
      ))}
    </div>
  )
}
