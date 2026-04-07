# Notion CMS 기반 개인 기술 블로그

Notion을 CMS(Content Management System)로 활용하는 개인 기술 블로그입니다. Notion 데이터베이스에 작성한 글이 블로그에 자동으로 게시됩니다.

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS v4 |
| UI 컴포넌트 | shadcn/ui + Radix UI |
| 폼 | React Hook Form + Zod |
| CMS | Notion API |
| 테마 | next-themes (다크모드 지원) |
| 알림 | sonner |

## 로컬 개발 실행 방법

### 1. 저장소 클론

```bash
git clone https://github.com/<your-username>/notion-cms-blog.git
cd notion-cms-blog
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env.example`을 복사하여 `.env.local`을 생성하고 값을 채워넣습니다.

```bash
cp .env.example .env.local
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속합니다.

## 환경 변수

| 변수명 | 설명 |
|--------|------|
| `NOTION_API_KEY` | Notion Integration의 Internal Integration Token |
| `NOTION_DATABASE_ID` | 블로그 글을 관리하는 Notion 데이터베이스 ID |

Notion API 키는 [Notion Integrations](https://www.notion.so/my-integrations)에서 발급받을 수 있습니다.

## 프로젝트 구조

```
src/
├── app/                  # App Router 라우트
│   ├── (marketing)/      # 랜딩 페이지 (Header + Footer 레이아웃)
│   ├── (auth)/           # 로그인/회원가입 (카드 레이아웃)
│   └── (dashboard)/      # 대시보드 (Sidebar + Main 레이아웃)
├── components/
│   ├── ui/               # shadcn/ui 컴포넌트
│   ├── sections/         # 랜딩 페이지 섹션 컴포넌트
│   ├── layout/           # Header, Footer, Sidebar
│   └── providers/        # Theme + Toast 프로바이더
└── lib/
    ├── utils.ts           # cn() 유틸리티 (clsx + tailwind-merge)
    └── validations.ts     # Zod 스키마
```

## 개발 명령어

```bash
npm run dev      # 개발 서버 실행
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
npm run lint     # ESLint 실행
```
