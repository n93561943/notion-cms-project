/**
 * Notion API 클라이언트 및 데이터 조회 함수 모음
 *
 * 주의: 이 프로젝트에서 사용하는 @notionhq/client 버전은 databases.query를 지원하지 않습니다.
 * 대신 search API + pages API를 조합하여 데이터베이스 페이지를 조회합니다.
 *
 * 환경 변수: NOTION_API_KEY, NOTION_DATABASE_ID
 */

import { Client } from "@notionhq/client"
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints/common"
import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints/blocks"

// Notion 클라이언트 초기화
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

// 데이터베이스 ID
const DATABASE_ID = process.env.NOTION_DATABASE_ID!

// ============================
// 타입 정의
// ============================

export interface Post {
  id: string
  slug: string
  title: string
  category: string
  tags: string[]
  publishedAt: string
  status: "초안" | "발행됨"
  excerpt: string
}

// ============================
// 유틸리티 함수
// ============================

/**
 * 페이지 제목을 slug 형식으로 변환합니다.
 * 예: "Next.js 시작하기" → "nextjs-시작하기"
 */
function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\sㄱ-힣]/g, "")
    .trim()
    .replace(/\s+/g, "-")
}

/**
 * Notion 페이지 객체를 Post 타입으로 변환합니다.
 * SDK 내부 타입이 복잡하게 union되어 있으므로 any 캐스팅으로 안전하게 처리합니다.
 */
function pageToPost(page: PageObjectResponse): Post {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const props = page.properties as Record<string, any>

  // 제목 추출 (Title 속성, type: "title")
  const titleRichText = props["Title"]?.title ?? []
  const title = titleRichText.map((t: { plain_text: string }) => t.plain_text).join("") || "제목 없음"

  // 카테고리 추출 (Category 속성, type: "select")
  const category: string = props["Category"]?.select?.name ?? ""

  // 태그 추출 (Tags 속성, type: "multi_select")
  const tags: string[] = (props["Tags"]?.multi_select ?? []).map(
    (t: { name: string }) => t.name
  )

  // 발행일 추출 (Published 속성, type: "date")
  const publishedAt: string = props["Published"]?.date?.start ?? ""

  // 상태 추출 (Status 속성, type: "select")
  const statusValue: string = props["Status"]?.select?.name ?? ""
  const status = statusValue === "발행됨" ? "발행됨" : ("초안" as const)

  return {
    id: page.id,
    slug: titleToSlug(title) || page.id,
    title,
    category,
    tags,
    publishedAt,
    status,
    excerpt: "",
  }
}

// ============================
// 데이터 조회 함수
// ============================

/**
 * 환경 변수 설정 여부를 확인합니다.
 * 빌드 환경에서 API 키가 없으면 빈 결과를 반환합니다.
 */
function isConfigured(): boolean {
  return Boolean(process.env.NOTION_API_KEY && process.env.NOTION_DATABASE_ID)
}

/**
 * 데이터베이스에 속한 모든 페이지를 search API로 조회합니다.
 * - filter: 페이지 오브젝트만
 * - 추후 커서 기반 페이지네이션 추가 가능
 */
async function fetchAllPagesFromDatabase(): Promise<PageObjectResponse[]> {
  const results: PageObjectResponse[] = []
  let cursor: string | undefined = undefined

  // search는 database_id 직접 필터 미지원: 부모 ID 기반으로 클라이언트 필터링
  do {
    const response = await notion.search({
      filter: { property: "object", value: "page" },
      page_size: 100,
      ...(cursor ? { start_cursor: cursor } : {}),
    })

    for (const item of response.results) {
      // 부모가 해당 데이터베이스인 페이지만 수집
      if (
        item.object === "page" &&
        "parent" in item &&
        (item as PageObjectResponse).parent.type === "database_id" &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (item as any).parent.database_id === DATABASE_ID
      ) {
        results.push(item as PageObjectResponse)
      }
    }

    cursor = response.has_more && response.next_cursor ? response.next_cursor : undefined
  } while (cursor)

  return results
}

/**
 * 발행된 글 목록을 최신순(발행일 기준)으로 조회합니다.
 */
export async function getPosts(): Promise<Post[]> {
  // API 키가 없으면 빈 배열 반환 (빌드 환경 대응)
  if (!isConfigured()) return []

  const pages = await fetchAllPagesFromDatabase()

  return pages
    .map(pageToPost)
    .filter((post) => post.status === "발행됨")
    .sort((a, b) => {
      // 발행일 기준 내림차순 정렬
      if (!a.publishedAt) return 1
      if (!b.publishedAt) return -1
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    })
}

/**
 * slug로 개별 글을 조회합니다.
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getPosts()
  return posts.find((p) => p.slug === slug || p.id === slug) ?? null
}

/**
 * 특정 페이지의 본문 블록 목록을 조회합니다.
 */
export async function getPostContent(pageId: string): Promise<BlockObjectResponse[]> {
  if (!isConfigured()) return []

  const response = await notion.blocks.children.list({
    block_id: pageId,
    page_size: 100,
  })

  return response.results.filter(
    (block): block is BlockObjectResponse => "type" in block
  )
}

/**
 * 발행된 글에서 카테고리 목록을 중복 없이 추출합니다.
 */
export async function getCategories(): Promise<string[]> {
  const posts = await getPosts()
  const categories = posts.map((p) => p.category).filter(Boolean)
  return [...new Set(categories)]
}

/**
 * 특정 카테고리에 속하는 발행된 글 목록을 조회합니다.
 */
export async function getPostsByCategory(category: string): Promise<Post[]> {
  const posts = await getPosts()
  return posts.filter((p) => p.category === category)
}
