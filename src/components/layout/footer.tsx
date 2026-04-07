/**
 * 블로그 푸터 컴포넌트
 * - 저작권 정보 및 Notion CMS 기반 링크 제공
 */

import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* 블로그 소개 */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">기술 블로그</h3>
            <p className="text-sm text-muted-foreground">
              Notion CMS 기반 개인 기술 블로그.
              개발 경험과 인사이트를 공유합니다.
            </p>
          </div>

          {/* 바로가기 */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">바로가기</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  전체 글
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-foreground transition-colors">
                  카테고리
                </Link>
              </li>
            </ul>
          </div>

          {/* 외부 링크 */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">링크</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {currentYear} 기술 블로그. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Powered by Next.js · Notion API
          </p>
        </div>
      </div>
    </footer>
  )
}
