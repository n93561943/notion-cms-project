# Development Guidelines

## 1. 프로젝트 개요

- **목적**: Notion API를 CMS로 활용하는 개인 기술 블로그
- **프레임워크**: Next.js 16 App Router (TypeScript)
- **스타일**: Tailwind CSS v4 + shadcn/ui (radix-nova)
- **CMS**: `@notionhq/client` (databases.query 미지원 버전 — 아래 규칙 필수 준수)
- **환경 변수**: `NOTION_API_KEY`, `NOTION_DATABASE_ID`

---

## 2. 디렉토리 구조 및 파일 역할

```
src/
├── app/
│   ├── layout.tsx                        # RootLayout — Providers, 폰트, 전역 메타데이터
│   └── (blog)/
│       ├── layout.tsx                    # BlogLayout — Header + main + Footer
│       ├── page.tsx                      # 홈: 글 목록 (서버 컴포넌트)
│       ├── posts/[slug]/page.tsx         # 글 상세 (서버 컴포넌트)
│       ├── categories/page.tsx           # 카테고리 목록 (서버 컴포넌트)
│       └── categories/[category]/page.tsx # 카테고리별 글 목록 (서버 컴포넌트)
├── components/
│   ├── ui/                               # shadcn/ui 컴포넌트 — 절대 직접 수정 금지
│   ├── blog/
│   │   ├── post-card.tsx                 # 글 카드 (서버 컴포넌트)
│   │   ├── post-list.tsx                 # 글 목록 + 필터 (클라이언트 컴포넌트)
│   │   ├── category-filter.tsx           # 카테고리 탭 필터 (클라이언트 컴포넌트)
│   │   ├── search-bar.tsx                # 검색 폼 (클라이언트 컴포넌트)
│   │   └── notion-blocks.tsx             # Notion 블록 → HTML 렌더러 (서버 컴포넌트)
│   └── layout/
│       ├── header.tsx                    # 헤더 (다크모드, 햄버거 메뉴 포함)
│       ├── footer.tsx                    # 푸터
│       └── nav-links.tsx                 # 내비게이션 링크
└── lib/
    ├── notion.ts                         # Notion API 클라이언트 및 모든 데이터 조회 함수
    ├── utils.ts                          # cn() 유틸리티
    └── validations.ts                    # Zod 스키마
```

---

## 3. ⚠️ Notion API 제약 — 절대 규칙

### `databases.query` 사용 금지

- 현재 설치된 `@notionhq/client` 버전은 `databases.query`를 지원하지 않는다.
- **모든 데이터베이스 페이지 조회**는 `fetchAllPagesFromDatabase()` 함수를 경유한다.
- 새로운 조회 함수를 추가할 때 반드시 기존 함수(`getPosts()`, `getPostsByCategory()` 등)를 조합한다.

```typescript
// ❌ 금지
await notion.databases.query({ database_id: DATABASE_ID })

// ✅ 올바른 방법 — 기존 함수 재사용
const posts = await getPosts()
return posts.filter(p => p.category === category)
```

### `fetchAllPagesFromDatabase()` 내부 동작

- `notion.search()` API로 전체 페이지 조회 후, `parent.database_id === DATABASE_ID` 조건으로 클라이언트 필터링
- 커서 기반 페이지네이션 구현 포함 (자동 반복)

### 환경 변수 가드

- 모든 public API 함수 시작부에 `if (!isConfigured()) return []` 패턴 사용
- `generateStaticParams()`에서는 직접 env 체크: `if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) return []`

---

## 4. Next.js 16 App Router 필수 규칙

### `params` / `searchParams` 는 반드시 `Promise`로 선언하고 `await`

```typescript
// ✅ Next.js 16 올바른 패턴
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
}

// ❌ 금지 — Next.js 14 이하 구 패턴
export default async function PostPage({ params }: { params: { slug: string } }) {
  const { slug } = params
}
```

### `useSearchParams` 사용 컴포넌트 — Suspense 필수

- `useSearchParams`를 사용하는 클라이언트 컴포넌트는 서버 컴포넌트에서 반드시 `<Suspense>`로 감싸야 한다.

```typescript
// 홈 페이지 (서버 컴포넌트)에서 PostList를 감싸는 방식
<Suspense fallback={<PostListSkeleton />}>
  <PostList posts={posts} categories={categories} />
</Suspense>
```

### ISR 캐싱 — 모든 블로그 페이지에 선언

```typescript
// 모든 (blog)/** 페이지 파일 최상단에 선언
export const revalidate = 60
```

---

## 5. 서버 컴포넌트 vs 클라이언트 컴포넌트 판단 기준

| 조건 | 컴포넌트 타입 |
|------|-------------|
| 기본값 | 서버 컴포넌트 |
| `useSearchParams`, `useRouter` 사용 | `"use client"` 클라이언트 컴포넌트 |
| `useState`, `useEffect` 사용 | `"use client"` 클라이언트 컴포넌트 |
| Notion API 직접 호출 | 서버 컴포넌트 전용 (클라이언트 컴포넌트에서 절대 금지) |

- 클라이언트 컴포넌트는 `"use client"` 지시문을 파일 최상단 첫 번째 줄에 선언한다.
- Notion API 키는 서버 사이드에서만 사용한다 — 클라이언트 번들에 노출 금지.

---

## 6. Notion 이미지 처리 규칙

- `next/image` 컴포넌트 사용 **금지** — Notion 파일 URL은 1시간 후 만료되며 도메인이 동적으로 변경됨
- 반드시 `<img>` 태그 사용 + ESLint 억제 주석 추가

```typescript
// ✅ 올바른 Notion 이미지 렌더링
{/* eslint-disable-next-line @next/next/no-img-element */}
<img src={imageUrl} alt={caption} className="w-full rounded-lg object-cover" />
```

---

## 7. 카테고리 URL 인코딩 규칙

- 카테고리를 URL에 포함할 때: `encodeURIComponent(category)`
- 페이지 컴포넌트에서 수신할 때: `decodeURIComponent(category)`

```typescript
// generateStaticParams에서
return categories.map(category => ({ category: encodeURIComponent(category) }))

// 페이지 컴포넌트에서
const decodedCategory = decodeURIComponent(category)
const posts = await getPostsByCategory(decodedCategory)
```

---

## 8. 타입 및 데이터 모델

### `Post` 인터페이스 (src/lib/notion.ts)

```typescript
interface Post {
  id: string       // Notion 페이지 ID
  slug: string     // titleToSlug(title) 결과 또는 id fallback
  title: string
  category: string // 빈 문자열 가능
  tags: string[]
  publishedAt: string // "YYYY-MM-DD" 또는 빈 문자열
  status: "초안" | "발행됨"
  excerpt: string  // 현재 빈 문자열 (미구현)
}
```

- `Post` 타입을 import할 때: `import type { Post } from "@/lib/notion"`
- slug 조회 시 두 가지 매칭: `post.slug === slug || post.id === slug`
- 블로그에는 `status === "발행됨"` 인 글만 노출한다.

### Notion 데이터베이스 속성명 (대소문자 정확히 일치)

| 속성명 | Notion 타입 |
|--------|------------|
| `Title` | title |
| `Category` | select |
| `Tags` | multi_select |
| `Published` | date |
| `Status` | select (`초안` / `발행됨`) |

---

## 9. 컴포넌트 작성 규칙

### className 병합

```typescript
import { cn } from "@/lib/utils"
// 항상 cn()으로 className 병합
className={cn("base-class", condition && "conditional-class")}
```

### shadcn/ui 컴포넌트 추가

```bash
npx shadcn@latest add <component>
# src/components/ui/ 파일은 직접 수정하지 않는다
```

### 날짜 포맷

```typescript
// 한국어 날짜 포맷 표준
new Date(dateStr).toLocaleDateString("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
})
// 출력 예: "2024년 1월 15일"
```

---

## 10. 레이아웃 및 반응형 그리드 표준 패턴

```typescript
// 글 카드 그리드 (홈, 카테고리 페이지 공통)
<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

// 페이지 컨테이너 (홈, 카테고리)
<div className="container mx-auto px-4 py-10">

// 글 상세 페이지 본문 (최대 너비 제한)
<div className="container mx-auto px-4 py-10 max-w-3xl">
```

---

## 11. NotionBlocks 컴포넌트 사용법

- 파일: `src/components/blog/notion-blocks.tsx` (주의: `notion-block-renderer`가 아님)
- export: `NotionBlocks` (named export)
- 지원 블록: `paragraph`, `heading_1/2/3`, `bulleted_list_item`, `numbered_list_item`, `quote`, `code`, `divider`, `image`, `callout`
- 미지원 블록: `null` 반환 (콘솔 에러 없음)

```typescript
import { NotionBlocks } from "@/components/blog/notion-blocks"

<NotionBlocks blocks={blocks} />
```

---

## 12. 새 블로그 페이지 추가 시 체크리스트

1. 반드시 `src/app/(blog)/` 디렉토리 하위에 생성
2. 파일 최상단에 `export const revalidate = 60` 선언
3. `params` 타입은 `Promise<{...}>` 패턴 사용
4. `generateStaticParams()` — env 체크 후 빈 배열 반환 가드 추가
5. `generateMetadata()` — 페이지별 SEO 메타데이터 설정
6. Notion API 호출은 `src/lib/notion.ts`의 기존 함수 재사용 (직접 호출 금지)

---

## 13. 새 Notion API 함수 추가 시 규칙

1. `src/lib/notion.ts` 파일에만 추가
2. 함수 시작부에 `if (!isConfigured()) return []` (또는 적절한 빈값) 가드 추가
3. `databases.query` 절대 사용 금지 — `getPosts()`를 기반으로 클라이언트 필터링
4. 반환 타입을 명시적으로 선언

```typescript
// ✅ 올바른 새 함수 패턴
export async function getPostsByTag(tag: string): Promise<Post[]> {
  if (!isConfigured()) return []
  const posts = await getPosts()
  return posts.filter(p => p.tags.includes(tag))
}
```

---

## 14. 금지 사항

- `notion.databases.query()` 직접 호출 — **절대 금지**
- `src/components/ui/` 파일 직접 수정 — **금지**
- Notion API 호출을 클라이언트 컴포넌트에서 수행 — **금지** (NOTION_API_KEY 노출 위험)
- `next/image`를 Notion 이미지 URL에 사용 — **금지** (URL 만료 문제)
- Next.js 14 이하 `params` 패턴 (`params: { slug: string }`) 사용 — **금지**
- `(blog)` 라우트 그룹 외부에 블로그 페이지 생성 — **금지**
- 블로그 페이지에 `revalidate` 미선언 — **금지**
