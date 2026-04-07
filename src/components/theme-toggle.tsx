"use client"

/**
 * 다크/라이트 테마 전환 버튼 컴포넌트
 * - useSyncExternalStore를 활용하여 하이드레이션 불일치 없이 마운트 여부 감지
 * - 마운트 전에는 비활성 버튼 렌더링 (SSR 안전)
 */

import { useSyncExternalStore } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * useSyncExternalStore용 서버/클라이언트 스냅샷 헬퍼
 * - 서버: false (마운트 전 상태)
 * - 클라이언트: true (마운트 후 상태)
 */
function subscribe() {
  return () => {}
}

function useIsMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,  // 클라이언트 스냅샷
    () => false  // 서버 스냅샷
  )
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const isMounted = useIsMounted()

  // 마운트 전에는 비활성 버튼 렌더링 (하이드레이션 불일치 방지)
  if (!isMounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="테마 전환" disabled>
        <Sun className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="테마 전환"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}
