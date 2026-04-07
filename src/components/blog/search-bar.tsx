"use client"

/**
 * 검색 바 컴포넌트
 * - URL 쿼리 파라미터 "q"를 기반으로 검색
 * - form submit 시 router.push로 URL 업데이트
 * - useRouter/useSearchParams를 사용하므로 클라이언트 컴포넌트
 */

import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentQuery = searchParams.get("q") ?? ""

  /**
   * 폼 제출 시 검색어를 URL에 반영합니다.
   */
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = (formData.get("q") as string).trim()

    const params = new URLSearchParams(searchParams.toString())

    if (query) {
      params.set("q", query)
    } else {
      params.delete("q")
    }

    router.push(`?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-md">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          name="q"
          type="search"
          placeholder="글 제목으로 검색..."
          defaultValue={currentQuery}
          className="pl-9"
        />
      </div>
      <Button type="submit" variant="outline">
        검색
      </Button>
    </form>
  )
}
