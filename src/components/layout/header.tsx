/**
 * 블로그 헤더 컴포넌트
 * - 로고, 네비게이션, 테마 전환 버튼 포함
 * - 모바일 햄버거 메뉴 지원
 */

import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { NavLinks } from "@/components/layout/nav-links"

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        {/* 블로그 로고 */}
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="text-primary">✦</span>
          <span>기술 블로그</span>
        </Link>

        {/* 데스크탑 네비게이션 */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLinks />
        </nav>

        {/* 우측 액션 영역 */}
        <div className="flex items-center gap-2">
          {/* 다크모드 전환 버튼 */}
          <ThemeToggle />

          {/* 모바일 햄버거 메뉴 */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">메뉴 열기</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>메뉴</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                <NavLinks />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
