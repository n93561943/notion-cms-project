"use client"

/**
 * 블로그 네비게이션 링크 컴포넌트
 * - usePathname을 사용하므로 클라이언트 컴포넌트로 분리
 */

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "홈" },
  { href: "/categories", label: "카테고리" },
]

interface NavLinksProps {
  className?: string
}

export function NavLinks({ className }: NavLinksProps) {
  const pathname = usePathname()

  return (
    <>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "text-sm transition-colors hover:text-foreground",
            pathname === link.href
              ? "text-foreground font-medium"
              : "text-muted-foreground",
            className
          )}
        >
          {link.label}
        </Link>
      ))}
    </>
  )
}
