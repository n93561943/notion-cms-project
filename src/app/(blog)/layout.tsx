/**
 * 블로그 레이아웃
 * - Header + main + Footer 구조
 * - 모든 블로그 페이지(홈, 글 상세, 카테고리)에 적용
 */

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
