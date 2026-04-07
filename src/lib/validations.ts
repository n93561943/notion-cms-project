/**
 * 블로그 검색 관련 Zod 스키마 정의
 */

import { z } from "zod"

// 글 검색 스키마
export const searchSchema = z.object({
  query: z
    .string()
    .min(1, "검색어를 입력해주세요.")
    .max(100, "검색어는 최대 100자까지 입력할 수 있습니다."),
})

export type SearchInput = z.infer<typeof searchSchema>
