"use client"

/**
 * 글 목록 + 검색 필터 클라이언트 컴포넌트
 * - URL searchParams 기반 카테고리/검색어 필터링
 * - useSearchParams를 사용하므로 클라이언트 컴포넌트
 */

import { useSearchParams } from "next/navigation"
import { PostCard } from "@/components/blog/post-card"
import { CategoryFilter } from "@/components/blog/category-filter"
import { SearchBar } from "@/components/blog/search-bar"
import type { Post } from "@/lib/notion"

interface PostListProps {
  posts: Post[]
  categories: string[]
}

export function PostList({ posts, categories }: PostListProps) {
  const searchParams = useSearchParams()
  const selectedCategory = searchParams.get("category") ?? ""
  const searchQuery = searchParams.get("q") ?? ""

  // 카테고리 필터 적용
  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory
      ? post.category === selectedCategory
      : true

    // 제목 기반 검색 (대소문자 무시)
    const matchesSearch = searchQuery
      ? post.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true

    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-8">
      {/* 검색 영역 */}
      <SearchBar />

      {/* 카테고리 필터 */}
      <CategoryFilter categories={categories} />

      {/* 글 목록 그리드: 데스크톱 3열 → 태블릿 2열 → 모바일 1열 */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted-foreground">
            {searchQuery || selectedCategory
              ? "검색 결과가 없습니다."
              : "아직 작성된 글이 없습니다."}
          </p>
        </div>
      )}
    </div>
  )
}
