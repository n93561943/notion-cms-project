# Notion CMS 기반 개인 기술 블로그 개발 로드맵

## 개요

### PRD 요약

Notion을 CMS로 활용하는 개인 기술 블로그를 구축한다. 작성자는 Notion에서 글을 작성·발행하면 블로그에 자동 반영되는 워크플로우를 경험하고, 독자는 카테고리 필터·검색으로 원하는 글을 빠르게 찾을 수 있다.

### 전체 목표

- Notion API와 Next.js App Router 서버 컴포넌트를 연동하여 별도 DB 없이 블로그 운영
- 글 목록(홈) / 글 상세 / 카테고리 필터 / 기본 검색을 MVP로 우선 완성
- 반응형 레이아웃 및 다크모드를 완전히 지원하여 독자 경험 보장

### 주요 마일스톤

| # | 마일스톤 | 목표 | 우선순위 |
|---|----------|------|---------|
| 1 | 환경 설정 및 기반 정리 | Notion API 클라이언트 완성, 구 코드 정리 | P0 |
| 2 | 글 목록 페이지 구현 | 홈(`/`) 및 글 카드 컴포넌트 완성 | P0 |
| 3 | 글 상세 페이지 구현 | Notion 블록 렌더링 및 상세 레이아웃 완성 | P0 |
| 4 | 카테고리 필터 및 카테고리 페이지 구현 | `/categories/[category]` 완성 | P0 |
| 5 | 검색 기능 구현 | 제목 기반 검색(클라이언트 사이드) | P1 |
| 6 | 스타일링 완성 및 SEO / 최적화 | 반응형 보정, 다크모드, SEO 메타태그, ISR | P0/P1 |

### 기술 스택 확인

| 영역 | 기술 | 상태 |
|------|------|------|
| 프레임워크 | Next.js 16 (App Router) | 완료 |
| CMS | `@notionhq/client` v5.16 | 설치 완료 |
| 스타일링 | Tailwind CSS v4 | 완료 |
| UI 컴포넌트 | shadcn/ui (radix-nova) | 완료 |
| 테마 | next-themes (다크모드) | 완료 |
| 알림 | sonner | 완료 |
| 폼 | React Hook Form + Zod | 완료 (검색에 사용 예정) |
| 배포 | Vercel | 미완료 |

---

## 현재 프로젝트 상태 (작업 시작 전 기준)

- [x] Next.js 16 App Router 스타터 템플릿 구축 완료
- [x] Tailwind CSS v4, shadcn/ui, next-themes, sonner 설치 완료
- [x] `src/lib/notion.ts` — `getPosts()`, `getPostBySlug()`, `getPostContent()`, `getCategories()`, `getPostsByCategory()` 구현 완료
- [x] `src/components/layout/header.tsx` — Header 컴포넌트 구현 완료 (다크모드, 모바일 햄버거 메뉴 포함)
- [x] `src/components/layout/footer.tsx` — Footer 컴포넌트 구현 완료
- [x] `src/app/layout.tsx` — RootLayout 구성 완료 (Providers, Geist 폰트)
- [ ] `src/app/(blog)/` — 디렉토리 미생성 (라우트 구현 필요)
- [ ] `src/components/blog/` — 디렉토리 미생성 (블로그 컴포넌트 구현 필요)
- [ ] `.env.local` — 환경 변수 미설정
- [ ] Notion 데이터베이스 — 생성 및 통합 연결 필요
- [ ] 기존 auth / dashboard / marketing route group 파일 삭제 처리 필요

---

## 마일스톤 1: 환경 설정 및 기반 정리

### 목표

Notion API가 실제로 동작하는 환경을 완성하고, 블로그 전용으로 전환하기 위해 불필요한 구 코드를 정리한다.

### 태스크

#### [1.1] Notion 데이터베이스 및 통합 설정

- **설명**:
  1. Notion에 블로그 데이터베이스를 생성한다. 필수 속성: `Title`(title), `Category`(select), `Tags`(multi_select), `Published`(date), `Status`(select — 선택지: `초안` / `발행됨`)
  2. Notion 내부 통합(Integration)을 생성하고 API 키를 발급한다.
  3. 해당 데이터베이스에 통합을 연결한다(데이터베이스 Share 메뉴에서 통합 추가).
  4. 테스트용 샘플 글을 최소 3개 이상 Status=`발행됨`으로 작성한다.
- **구현 파일**: `.env.local` (환경 변수 추가)
- **완료 기준**:
  - `.env.local`에 `NOTION_API_KEY`, `NOTION_DATABASE_ID` 값이 정상 등록됨
  - 샘플 글 3개 이상이 Status=`발행됨`으로 데이터베이스에 존재함
  - 통합이 데이터베이스에 연결되어 있음
- **예상 시간**: 1시간

#### [1.2] ✅ 테스트: Notion API 연동 검증

- **테스트 도구**: Playwright MCP
- **사전 조건**: [1.1] 완료 후 `npm run dev` 실행 상태
- **테스트 시나리오**:
  - [ ] 정상 조회: `http://localhost:3000`에 접속했을 때 서버 컴포넌트가 에러 없이 렌더링됨 (초기에는 빈 화면이라도 500 에러 없음)
  - [ ] 환경 변수 누락 시: `NOTION_API_KEY` 제거 후 빌드해도 `isConfigured()` 가드 덕분에 빈 배열 반환 확인 (빌드 실패 없음)
  - [ ] API 직접 호출 확인: Node.js REPL 또는 임시 API 라우트로 `getPosts()` 실행 시 샘플 글 목록이 반환됨
- **검증 완료 기준**: 500 에러 없이 렌더링되고, `getPosts()` 호출 시 샘플 글 배열이 반환됨

#### [1.3] 구 route group 파일 정리 및 블로그 레이아웃 뼈대 생성

- **설명**:
  - 삭제 대상: `src/app/(auth)/`, `src/app/(dashboard)/`, `src/app/(marketing)/` 관련 파일 (git status 기준 이미 staged delete 상태이므로 확인 후 정리)
  - `src/app/(blog)/layout.tsx` 생성 — Header + Footer를 감싸는 공통 레이아웃
  - `src/components/blog/` 디렉토리 초기화 (빈 `index.ts` 없이 첫 컴포넌트 추가 시 자연스럽게 생성)
- **구현 파일**:
  - `src/app/(blog)/layout.tsx` (신규 생성)
- **완료 기준**:
  - `(auth)`, `(dashboard)`, `(marketing)` 관련 파일이 존재하지 않음
  - `http://localhost:3000`에 접속 시 Header + Footer가 포함된 기본 레이아웃이 렌더링됨
- **예상 시간**: 30분

### 마일스톤 1 완료 기준 (Definition of Done)

- [ ] `.env.local`에 Notion 자격증명 등록 완료
- [ ] 샘플 데이터 3개 이상 Notion DB에 존재
- [ ] `(blog)/layout.tsx` 생성 완료, Header + Footer 정상 렌더링
- [ ] 구 route group 파일 없음
- [ ] `npm run build` 성공 (빌드 에러 없음)

### 잠재적 리스크

| 리스크 | 대응 방안 |
|--------|-----------|
| `@notionhq/client` v5의 `databases.query` 미지원 | 이미 `search` API + 부모 ID 필터링으로 우회 구현 완료 (`src/lib/notion.ts`) |
| Notion API 호출 지연 (평균 200~500ms) | Phase 6에서 ISR `revalidate` 옵션으로 캐싱 처리 예정 |

---

## 마일스톤 2: 글 목록 페이지 구현

### 목표

홈(`/`)에서 발행된 글을 최신순으로 카드 그리드로 표시하고, 카테고리 필터 UI를 제공한다. (F-01~F-04, F-08~F-09, F-12~F-13 해당)

### 태스크

#### [2.1] PostCard 컴포넌트 구현

- **설명**: 글 카드 UI 컴포넌트를 서버 컴포넌트로 구현한다.
  - 표시 항목: 제목, 카테고리 뱃지, 태그 목록, 발행일(한국어 포맷: `YYYY년 MM월 DD일`)
  - 카드 전체가 `/posts/[slug]`로 이동하는 `<Link>` 래퍼
  - hover 시 미세한 elevation 효과 (shadcn/ui `Card` 컴포넌트 활용)
  - 카테고리 뱃지: shadcn/ui `Badge` 컴포넌트 사용
  - 태그: 각 태그를 작은 `Badge` (variant=outline)로 표시
- **구현 파일**:
  - `src/components/blog/post-card.tsx` (신규 생성)
- **완료 기준**:
  - 제목, 카테고리 뱃지, 태그, 발행일이 올바르게 렌더링됨
  - 카드 클릭 시 `/posts/[slug]`로 라우팅됨
  - 다크모드 스타일 정상 동작
- **예상 시간**: 2시간

#### [2.2] CategoryFilter 컴포넌트 구현

- **설명**: 카테고리 필터 탭 UI를 구현한다.
  - `getCategories()`로 조회한 카테고리 목록을 탭 형태로 표시
  - "전체" 탭 포함
  - 선택된 카테고리는 URL 쿼리 파라미터(`?category=React`)로 상태 관리
  - URL 기반이므로 클라이언트 컴포넌트(`"use client"`)로 구현 (`useSearchParams`, `useRouter` 활용)
- **구현 파일**:
  - `src/components/blog/category-filter.tsx` (신규 생성)
- **완료 기준**:
  - 카테고리 탭 클릭 시 URL이 `?category=[카테고리명]`으로 변경됨
  - "전체" 탭 클릭 시 쿼리 파라미터가 제거됨
  - 현재 선택된 탭이 active 스타일로 표시됨
- **예상 시간**: 2시간

#### [2.3] PostList 서버 컴포넌트 및 홈 페이지 구현

- **설명**: 홈 페이지를 서버 컴포넌트로 구현한다.
  - `getPosts()` 또는 `getPostsByCategory(category)`를 호출하여 글 목록 조회
  - URL `searchParams.category` 값에 따라 필터링 분기
  - 데스크톱 3열 → 태블릿 2열 → 모바일 1열 그리드 레이아웃 (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`)
  - 글이 없을 때의 빈 상태(Empty State) UI 처리
  - `getCategories()`를 병렬 호출(`Promise.all`)하여 `CategoryFilter`에 전달
- **구현 파일**:
  - `src/app/(blog)/page.tsx` (신규 생성)
  - `src/components/blog/post-list.tsx` (신규 생성, 선택적 분리)
- **완료 기준**:
  - 홈에서 샘플 글 카드들이 3열 그리드로 표시됨
  - 카테고리 탭 선택 시 해당 카테고리 글만 표시됨
  - `?category=없는카테고리` 접근 시 빈 상태 메시지 표시
  - 반응형 그리드 정상 동작
- **예상 시간**: 3시간
- **의존성**: [2.1], [2.2] 완료 필요

#### [2.4] ✅ 테스트: 글 목록 페이지 검증

- **테스트 도구**: Playwright MCP
- **테스트 시나리오**:
  - [ ] 정상 렌더링: `http://localhost:3000` 접속 시 샘플 글 카드가 1개 이상 표시됨
  - [ ] 최신순 정렬: 가장 최근 발행일의 글이 첫 번째 카드로 표시됨
  - [ ] 카테고리 필터: 특정 카테고리 탭 클릭 → URL `?category=xxx` 변경 → 해당 카테고리 글만 표시됨
  - [ ] "전체" 탭: 클릭 시 모든 발행 글이 다시 표시됨
  - [ ] 반응형 레이아웃: 브라우저 너비를 375px(모바일), 768px(태블릿), 1280px(데스크톱)으로 변경하여 그리드 열 수 확인
  - [ ] 다크모드: 테마 토글 클릭 후 카드 및 배경 색상이 다크 테마로 전환됨
  - [ ] 빈 상태: Notion DB에서 발행 글을 모두 `초안`으로 변경 후 접속 시 빈 상태 메시지 표시됨 (테스트 후 원복)
  - [ ] 카드 클릭: 카드 클릭 시 `/posts/[slug]` 경로로 라우팅됨 (404가 아닌 라우팅 시도 확인)
- **검증 완료 기준**: 8개 시나리오 모두 통과

### 마일스톤 2 완료 기준 (Definition of Done)

- [ ] 홈 페이지에서 글 목록 카드 그리드 정상 렌더링
- [ ] 카테고리 필터 URL 기반으로 동작
- [ ] 반응형 그리드 3단계 모두 확인
- [ ] 다크모드 스타일 이상 없음
- [ ] `npm run build` + `npm run lint` 통과

### 잠재적 리스크

| 리스크 | 대응 방안 |
|--------|-----------|
| `CategoryFilter`가 클라이언트 컴포넌트이므로 서버 컴포넌트 트리에서 분리 필요 | 카테고리 목록(배열)만 props로 내려받고, 필터링 로직은 홈 서버 컴포넌트에서 처리 |
| 카테고리가 없는 글 처리 | `category` 빈 문자열 시 "미분류" 표시 또는 필터에서 제외 처리 |

---

## 마일스톤 3: 글 상세 페이지 구현

### 목표

`/posts/[slug]`에서 Notion 페이지 블록을 HTML로 렌더링하는 상세 페이지를 완성한다. (F-05~F-07 해당)

### 태스크

#### [3.1] NotionBlockRenderer 컴포넌트 구현

- **설명**: Notion 블록 배열을 받아 HTML로 렌더링하는 서버 컴포넌트를 구현한다.
  - 지원 블록 타입 (MVP 필수):
    - `paragraph` → `<p>`
    - `heading_1`, `heading_2`, `heading_3` → `<h1>`, `<h2>`, `<h3>`
    - `bulleted_list_item` → `<ul><li>`
    - `numbered_list_item` → `<ol><li>`
    - `code` → `<pre><code>` (언어 표시 포함)
    - `quote` → `<blockquote>`
    - `divider` → `<hr>`
    - `image` → `<img>` (Next.js `<Image>` 컴포넌트 사용, external URL 허용)
  - 지원하지 않는 블록 타입: 콘솔 경고 후 렌더링 스킵
  - rich_text 배열 내 `bold`, `italic`, `code`, `link` 인라인 포맷 지원
  - 블로그 글 본문에 적합한 Tailwind prose 스타일 적용 (`prose dark:prose-invert`)
- **구현 파일**:
  - `src/components/blog/notion-block-renderer.tsx` (신규 생성)
- **완료 기준**:
  - 제목, 문단, 목록, 코드, 인용, 구분선 블록이 정상 렌더링됨
  - 인라인 bold/italic/code/link 포맷이 적용됨
  - 미지원 블록은 에러 없이 스킵됨
- **예상 시간**: 4시간

#### [3.2] PostMeta 컴포넌트 구현

- **설명**: 글 상단 메타 정보 영역 컴포넌트를 구현한다.
  - 표시 항목: 카테고리 뱃지, 제목(`<h1>`), 발행일, 태그 목록
  - "← 목록으로" 링크 (`/`로 이동, `Link` 컴포넌트 사용)
- **구현 파일**:
  - `src/components/blog/post-meta.tsx` (신규 생성)
- **완료 기준**:
  - 카테고리, 제목, 발행일, 태그가 올바르게 표시됨
  - "← 목록으로" 클릭 시 홈으로 이동함
- **예상 시간**: 1시간

#### [3.3] 글 상세 페이지 구현

- **설명**: `/posts/[slug]` 동적 라우트 페이지를 서버 컴포넌트로 구현한다.
  - `getPostBySlug(slug)`로 메타 정보 조회
  - `getPostContent(post.id)`로 블록 목록 조회 (두 함수는 `Promise.all`로 병렬 호출)
  - slug에 해당하는 글이 없으면 `notFound()` 호출
  - `generateStaticParams()`로 정적 경로 사전 생성 (ISR 준비)
  - `generateMetadata()`로 글별 SEO 메타태그 생성 (title, description, og:title)
- **구현 파일**:
  - `src/app/(blog)/posts/[slug]/page.tsx` (신규 생성)
- **완료 기준**:
  - 샘플 글의 `/posts/[slug]` 경로 접속 시 제목, 메타 정보, 본문이 모두 렌더링됨
  - 존재하지 않는 slug 접속 시 Next.js 404 페이지로 이동함
  - 페이지 `<title>` 태그에 글 제목이 포함됨
- **예상 시간**: 2시간
- **의존성**: [3.1], [3.2] 완료 필요

#### [3.4] ✅ 테스트: 글 상세 페이지 검증

- **테스트 도구**: Playwright MCP
- **테스트 시나리오**:
  - [ ] 정상 렌더링: 홈에서 첫 번째 카드 클릭 → 상세 페이지 로딩 → 제목, 카테고리, 태그, 발행일, 본문이 표시됨
  - [ ] Notion 블록 렌더링: 본문에 `<h2>`, `<p>`, `<ul>`, `<code>` 등 HTML 요소가 존재함
  - [ ] "목록으로" 내비게이션: "← 목록으로" 클릭 시 홈(`/`)으로 이동함
  - [ ] 404 처리: `/posts/존재하지않는슬러그` 접속 시 404 페이지 표시됨
  - [ ] SEO 메타태그: 페이지 `<title>`이 `글제목 | 기술 블로그` 형식임을 소스 확인
  - [ ] 반응형: 모바일(375px)에서 본문이 가로 스크롤 없이 정상 표시됨
  - [ ] 다크모드: 본문 prose 스타일이 다크모드에서 정상 적용됨 (흰 글자, 어두운 배경)
  - [ ] 이미지 블록: 샘플 글에 이미지 블록이 있는 경우 이미지가 렌더링됨
- **검증 완료 기준**: 8개 시나리오 모두 통과

### 마일스톤 3 완료 기준 (Definition of Done)

- [ ] 모든 샘플 글 상세 페이지 정상 접근 가능
- [ ] 주요 Notion 블록 타입 렌더링 확인 (제목, 문단, 목록, 코드)
- [ ] 404 처리 확인
- [ ] SEO `generateMetadata` 동작 확인
- [ ] `npm run build` 통과 (정적 경로 사전 생성 로그 확인)

### 잠재적 리스크

| 리스크 | 대응 방안 |
|--------|-----------|
| Notion 이미지 URL 만료 (1시간 유효) | MVP에서는 그대로 사용하고, Post-MVP에서 이미지 프록시 또는 저장 전략 수립 |
| `next/image` 외부 도메인 미허용 에러 | `next.config.ts`의 `images.remotePatterns`에 `*.amazonaws.com` 등 Notion 이미지 도메인 추가 |
| 중첩 블록(toggle, column) 미지원 | MVP에서는 미지원 블록 스킵 처리 후 Post-MVP에서 재귀 렌더러로 확장 |

---

## 마일스톤 4: 카테고리 페이지 구현

### 목표

`/categories/[category]`에서 특정 카테고리의 글 목록을 표시한다. (F-08~F-09 완결, 홈 필터와 이중 경로 제공)

### 태스크

#### [4.1] 카테고리 상세 페이지 구현

- **설명**: `/categories/[category]` 동적 라우트 페이지를 서버 컴포넌트로 구현한다.
  - `getPostsByCategory(category)`로 해당 카테고리 글 조회
  - 페이지 상단에 카테고리명 헤딩 표시
  - 홈과 동일한 `PostCard` 그리드 레이아웃 재사용
  - `generateStaticParams()`로 카테고리별 정적 경로 사전 생성
  - 존재하지 않는 카테고리 접근 시 빈 상태 UI 표시 (404 처리가 아닌 빈 목록)
  - `generateMetadata()`로 카테고리별 SEO 메타태그 생성
- **구현 파일**:
  - `src/app/(blog)/categories/[category]/page.tsx` (신규 생성)
- **완료 기준**:
  - `/categories/React` 접속 시 React 카테고리 글만 표시됨
  - 없는 카테고리 접근 시 빈 상태 메시지 표시됨
  - 페이지 타이틀에 카테고리명 포함됨
- **예상 시간**: 2시간
- **의존성**: [2.1] PostCard 컴포넌트 완료 필요

#### [4.2] ✅ 테스트: 카테고리 페이지 검증

- **테스트 도구**: Playwright MCP
- **테스트 시나리오**:
  - [ ] 정상 렌더링: `/categories/[존재하는카테고리]` 접속 시 해당 카테고리 글만 표시됨
  - [ ] 타 카테고리 글 미표시: 다른 카테고리 글이 목록에 없음을 확인
  - [ ] 빈 카테고리: 존재하지 않는 카테고리 접속 시 빈 상태 메시지 표시됨
  - [ ] Footer 링크 동작: Footer의 "카테고리" 링크(`/categories`) 클릭 시 ... (향후 카테고리 목록 페이지 구현 전까지 홈으로 리다이렉트)
  - [ ] 반응형: 모바일/태블릿/데스크톱 그리드 동작 확인
- **검증 완료 기준**: 5개 시나리오 모두 통과

### 마일스톤 4 완료 기준 (Definition of Done)

- [ ] `/categories/[category]` 라우트 정상 동작
- [ ] 홈 카테고리 필터와 동일한 결과 반환 확인
- [ ] `npm run build` 시 카테고리별 정적 경로 생성 로그 확인

---

## 마일스톤 5: 검색 기능 구현 (P1)

### 목표

제목 기반 검색 기능을 제공한다. 클라이언트 사이드 필터링으로 구현하여 Notion API 추가 호출을 최소화한다. (F-10~F-11 해당)

### 태스크

#### [5.1] SearchBar 컴포넌트 구현

- **설명**: 홈 상단에 표시될 검색 입력 컴포넌트를 클라이언트 컴포넌트로 구현한다.
  - React Hook Form + Zod를 사용한 폼 관리
  - Zod 스키마: `z.object({ query: z.string().min(1, "검색어를 입력해주세요") })`
  - 검색어를 URL 쿼리 파라미터(`?q=검색어`)로 반영 (`useRouter().push`)
  - 검색어 초기화 버튼 (X 아이콘) 포함
  - Enter 키 및 검색 버튼으로 검색 실행
  - shadcn/ui `Input` 컴포넌트 + `Button` 컴포넌트 조합
- **구현 파일**:
  - `src/components/blog/search-bar.tsx` (신규 생성)
- **완료 기준**:
  - 검색어 입력 후 Enter/버튼 클릭 시 URL이 `?q=검색어`로 변경됨
  - 빈 검색어 제출 시 Zod 에러 메시지 "검색어를 입력해주세요" 표시됨
  - X 버튼 클릭 시 검색어 초기화 및 URL 쿼리 파라미터 제거됨
- **예상 시간**: 2시간

#### [5.2] 홈 페이지 검색 통합

- **설명**: 홈 서버 컴포넌트에 검색 로직을 통합한다.
  - `searchParams.q` 값이 있으면 `getPosts()`결과를 제목 기반으로 클라이언트 필터링
  - 검색과 카테고리 필터를 동시 적용 가능하도록 처리 (`?q=Next&category=React`)
  - 검색 결과 없을 때 "검색 결과가 없습니다" 빈 상태 UI
  - `SearchBar`를 홈 페이지 헤더 영역에 배치
- **구현 파일**:
  - `src/app/(blog)/page.tsx` (수정)
- **완료 기준**:
  - 검색어 입력 시 제목에 해당 문자열을 포함한 글만 표시됨 (대소문자 구분 없음)
  - 카테고리 필터와 검색이 AND 조건으로 동시 적용됨
  - 검색 결과 없을 때 빈 상태 메시지 표시됨
- **예상 시간**: 1시간
- **의존성**: [5.1] 완료 필요

#### [5.3] ✅ 테스트: 검색 기능 검증

- **테스트 도구**: Playwright MCP
- **테스트 시나리오**:
  - [ ] 정상 검색: 샘플 글 제목의 일부 입력 → Enter → 해당 글이 결과에 표시됨
  - [ ] 대소문자 무관: 영문 제목을 소문자/대문자로 검색해도 동일 결과 반환
  - [ ] 결과 없음: 존재하지 않는 검색어 입력 → "검색 결과가 없습니다" 메시지 표시됨
  - [ ] 빈 검색어 제출: 빈 폼 제출 시 Zod 에러 메시지 "검색어를 입력해주세요" 표시됨
  - [ ] 검색 초기화: X 버튼 클릭 시 전체 글 목록으로 복원됨
  - [ ] 검색 + 카테고리 필터 동시 적용: `?q=키워드&category=카테고리` URL에서 두 조건 동시 필터링됨
  - [ ] URL 직접 접근: `?q=검색어` URL 직접 입력 시 검색 결과가 표시되고 검색창에 검색어가 채워짐
- **검증 완료 기준**: 7개 시나리오 모두 통과

### 마일스톤 5 완료 기준 (Definition of Done)

- [ ] SearchBar 컴포넌트 홈에 배치 완료
- [ ] 검색 + 카테고리 복합 필터 동작 확인
- [ ] 빈 상태 처리 확인
- [ ] `npm run lint` 통과

---

## 마일스톤 6: 스타일링 완성 및 SEO / 최적화

### 목표

반응형 레이아웃 보정, 다크모드 스타일 검수, SEO 메타태그 완성, ISR 캐싱 적용으로 MVP를 완성한다.

### 태스크

#### [6.1] 반응형 레이아웃 최종 보정

- **설명**: 전체 페이지를 모바일/태블릿/데스크톱에서 시각 검수하고 스타일 이슈를 수정한다.
  - 홈 글 카드 그리드: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`
  - 상세 페이지 본문 최대 너비: `max-w-3xl mx-auto`
  - 헤더 모바일 햄버거 메뉴 동작 확인
  - 푸터 3열 → 1열 붕괴 확인
  - 긴 제목이 카드를 벗어나지 않도록 `line-clamp-2` 적용
- **구현 파일**: 각 해당 컴포넌트 파일 수정
- **완료 기준**:
  - 375px, 768px, 1280px 세 breakpoint에서 레이아웃 이상 없음
  - 가로 스크롤 발생 없음
- **예상 시간**: 2시간

#### [6.2] 다크모드 스타일 검수

- **설명**: 다크모드 전환 시 모든 컴포넌트의 색상이 정상적으로 변경되는지 검수한다.
  - `prose dark:prose-invert` 적용 확인 (상세 페이지 본문)
  - Badge, Card, Input 컴포넌트 다크모드 색상 확인
  - 코드 블록 배경색 다크모드 대응 (`bg-muted` 계열 사용)
- **구현 파일**: 필요한 컴포넌트 파일 수정
- **완료 기준**:
  - 라이트/다크 모드 전환 시 모든 영역의 텍스트/배경 색상이 정상 전환됨
  - 시스템 다크모드 연동 동작 확인
- **예상 시간**: 1시간

#### [6.3] 전역 SEO 및 Open Graph 메타태그 적용

- **설명**: 검색 엔진 및 소셜 공유 최적화를 위한 메타태그를 설정한다.
  - `src/app/layout.tsx` — 사이트 전역 메타데이터 (`title`, `description`, `og:site_name`) 확인 및 보완
  - 글 상세 페이지 `generateMetadata()` — `og:title`, `og:description` (excerpt 또는 제목 사용) 추가
  - 카테고리 페이지 `generateMetadata()` — 카테고리별 타이틀 설정
  - `robots.txt` 및 `sitemap.xml` 자동 생성: `src/app/robots.ts`, `src/app/sitemap.ts` 구현 (Next.js 내장 API 활용)
- **구현 파일**:
  - `src/app/layout.tsx` (수정)
  - `src/app/robots.ts` (신규 생성)
  - `src/app/sitemap.ts` (신규 생성)
- **완료 기준**:
  - 상세 페이지 소스에서 `og:title`, `og:description` 태그 확인됨
  - `/robots.txt`, `/sitemap.xml` URL 접근 시 올바른 형식 반환됨
- **예상 시간**: 2시간

#### [6.4] ISR 캐싱 적용

- **설명**: Notion API 호출 결과를 Next.js ISR로 캐싱하여 응답 속도를 개선한다.
  - 홈 페이지, 카테고리 페이지에 `export const revalidate = 3600` (1시간) 적용
  - 상세 페이지는 `revalidate = 86400` (24시간) 또는 `force-static` 검토
  - `notion.ts`의 API 호출 함수에 `next: { revalidate }` 옵션 추가 검토 (fetch 기반 캐싱)
- **구현 파일**:
  - `src/app/(blog)/page.tsx` (수정)
  - `src/app/(blog)/posts/[slug]/page.tsx` (수정)
  - `src/app/(blog)/categories/[category]/page.tsx` (수정)
- **완료 기준**:
  - `npm run build` 후 빌드 출력에서 정적 생성된 경로와 ISR 경로가 구분되어 표시됨
  - 프로덕션 모드(`npm run start`)에서 첫 요청 이후 캐시 히트 확인
- **예상 시간**: 1시간

#### [6.5] ✅ 테스트: 전체 MVP 통합 검증

- **테스트 도구**: Playwright MCP
- **테스트 시나리오**:
  - [ ] 전체 사용자 시나리오: 홈 접속 → 카테고리 필터 → 글 카드 클릭 → 상세 페이지 확인 → "← 목록으로" 클릭 → 홈 복귀
  - [ ] 검색 + 상세 시나리오: 검색어 입력 → 결과 클릭 → 상세 페이지 확인
  - [ ] 카테고리 직접 URL 접근: `/categories/[카테고리]` 직접 입력 후 정상 렌더링
  - [ ] SEO 메타태그: 상세 페이지 소스에서 `og:title` 존재 확인
  - [ ] sitemap: `/sitemap.xml` 접속 시 XML 형식으로 글 URL 목록 표시됨
  - [ ] robots.txt: `/robots.txt` 접속 시 크롤러 허용 설정 확인
  - [ ] 다크모드 전체 시나리오: 다크모드로 전환 후 홈 → 상세 → 카테고리 페이지 전체 시각 확인
  - [ ] 반응형 전체 시나리오: 모바일 너비(375px)에서 홈 → 상세 → 홈 복귀 사용자 여정 이상 없음
  - [ ] 빌드 검증: `npm run build`가 에러 없이 완료됨
- **검증 완료 기준**: 9개 시나리오 모두 통과

### 마일스톤 6 완료 기준 (Definition of Done)

- [ ] 모든 페이지 반응형 이상 없음 (375px / 768px / 1280px)
- [ ] 라이트/다크 모드 모든 페이지 색상 정상
- [ ] `/robots.txt`, `/sitemap.xml` 정상 응답
- [ ] `npm run build` 에러 없음
- [ ] `npm run lint` 에러 없음
- [ ] Vercel 배포 후 프로덕션 URL에서 전체 시나리오 재확인

---

## 전체 구현 파일 목록 요약

### 신규 생성 파일

```
src/
├── app/
│   ├── (blog)/
│   │   ├── layout.tsx                         # Header + Footer 공통 레이아웃
│   │   ├── page.tsx                           # 홈: 글 목록 + 카테고리 필터 + 검색
│   │   ├── posts/
│   │   │   └── [slug]/
│   │   │       └── page.tsx                   # 글 상세 페이지
│   │   └── categories/
│   │       └── [category]/
│   │           └── page.tsx                   # 카테고리별 글 목록
│   ├── robots.ts                              # robots.txt 자동 생성
│   └── sitemap.ts                             # sitemap.xml 자동 생성
└── components/
    └── blog/
        ├── post-card.tsx                      # 글 카드 컴포넌트
        ├── post-list.tsx                      # 글 목록 그리드 (선택적)
        ├── post-meta.tsx                      # 상세 페이지 메타 정보
        ├── notion-block-renderer.tsx          # Notion 블록 → HTML 렌더러
        ├── category-filter.tsx                # 카테고리 필터 탭 (클라이언트)
        └── search-bar.tsx                     # 검색 입력 폼 (클라이언트)
```

### 기존 수정 파일

```
src/
├── app/
│   └── layout.tsx                             # SEO 메타데이터 보완
└── lib/
    └── notion.ts                              # 이미 완성 (수정 불필요)
```

---

## 예상 총 소요 시간

| 마일스톤 | 태스크 수 | 예상 시간 |
|----------|-----------|-----------|
| 마일스톤 1: 환경 설정 | 3개 | 약 2시간 |
| 마일스톤 2: 글 목록 페이지 | 4개 | 약 8시간 |
| 마일스톤 3: 글 상세 페이지 | 4개 | 약 8시간 |
| 마일스톤 4: 카테고리 페이지 | 2개 | 약 3시간 |
| 마일스톤 5: 검색 기능 (P1) | 3개 | 약 4시간 |
| 마일스톤 6: 스타일링 / SEO / 최적화 | 5개 | 약 7시간 |
| **합계** | **21개** | **약 32시간** |

---

## Post-MVP 확장 계획

MVP 완성 이후 우선순위에 따라 순차 구현한다.

| 기능 | 설명 | 예상 난이도 |
|------|------|------------|
| 코드 블록 구문 강조 | Shiki 또는 Prism.js를 사용하여 `code` 블록에 언어별 색상 적용 | 낮음 |
| 목차(TOC) 자동 생성 | 상세 페이지에서 heading 블록을 파싱하여 사이드 TOC 생성 | 중간 |
| 읽기 시간 표시 | 본문 텍스트 길이 기반 예상 읽기 시간 계산 | 낮음 |
| 페이지네이션 / 무한 스크롤 | 글 목록이 많아질 경우 분할 표시 | 중간 |
| 댓글 기능 | giscus(GitHub Discussions 기반) 연동 | 낮음 |
| OG 이미지 자동 생성 | `next/og`로 글별 Open Graph 이미지 동적 생성 | 중간 |
| RSS 피드 | `/feed.xml` 엔드포인트로 RSS 2.0 피드 제공 | 낮음 |
| 관련 글 추천 | 동일 카테고리 또는 태그 기반 하단 추천 글 표시 | 낮음 |
| 조회수 / 좋아요 | 외부 서비스(Supabase, PlanetScale 등) 또는 Vercel KV 활용 | 높음 |
| 뉴스레터 구독 | Resend / Buttondown 등 이메일 서비스 연동 | 높음 |
