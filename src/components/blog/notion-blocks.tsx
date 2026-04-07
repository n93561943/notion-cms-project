/**
 * Notion 블록 렌더링 컴포넌트
 * - Notion API에서 받아온 블록 배열을 HTML로 렌더링
 * - 지원 블록: paragraph, heading_1/2/3, bulleted/numbered_list_item,
 *             quote, code, divider, image, callout, toggle
 * - 서버 컴포넌트
 */

import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import type { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints"

interface NotionBlocksProps {
  blocks: BlockObjectResponse[]
}

/**
 * RichText 배열을 인라인 스타일이 적용된 JSX로 변환합니다.
 */
function RichText({ items }: { items: RichTextItemResponse[] }) {
  return (
    <>
      {items.map((item, index) => {
        const text = item.plain_text
        const { bold, italic, strikethrough, underline, code } = item.annotations

        let element: React.ReactNode = text

        if (code) {
          element = (
            <code
              key={index}
              className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm"
            >
              {text}
            </code>
          )
        } else {
          element = (
            <span
              key={index}
              className={[
                bold ? "font-bold" : "",
                italic ? "italic" : "",
                strikethrough ? "line-through" : "",
                underline ? "underline" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {/* 링크가 있는 경우 a 태그로 감쌉니다 */}
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4 hover:opacity-80"
                >
                  {text}
                </a>
              ) : (
                text
              )}
            </span>
          )
        }

        return element
      })}
    </>
  )
}

/**
 * 단일 블록을 렌더링합니다.
 */
function NotionBlock({ block }: { block: BlockObjectResponse }) {
  switch (block.type) {
    case "paragraph": {
      const { rich_text } = block.paragraph
      if (rich_text.length === 0) {
        return <div className="h-4" />
      }
      return (
        <p className="leading-7 [&:not(:first-child)]:mt-4">
          <RichText items={rich_text} />
        </p>
      )
    }

    case "heading_1": {
      const { rich_text } = block.heading_1
      return (
        <h1 className="mt-10 scroll-m-20 text-3xl font-bold tracking-tight">
          <RichText items={rich_text} />
        </h1>
      )
    }

    case "heading_2": {
      const { rich_text } = block.heading_2
      return (
        <h2 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight border-b border-border pb-2">
          <RichText items={rich_text} />
        </h2>
      )
    }

    case "heading_3": {
      const { rich_text } = block.heading_3
      return (
        <h3 className="mt-6 scroll-m-20 text-xl font-semibold tracking-tight">
          <RichText items={rich_text} />
        </h3>
      )
    }

    case "bulleted_list_item": {
      const { rich_text } = block.bulleted_list_item
      return (
        <li className="mt-1 leading-7 list-disc list-inside">
          <RichText items={rich_text} />
        </li>
      )
    }

    case "numbered_list_item": {
      const { rich_text } = block.numbered_list_item
      return (
        <li className="mt-1 leading-7 list-decimal list-inside">
          <RichText items={rich_text} />
        </li>
      )
    }

    case "quote": {
      const { rich_text } = block.quote
      return (
        <blockquote className="mt-4 border-l-4 border-primary pl-4 italic text-muted-foreground">
          <RichText items={rich_text} />
        </blockquote>
      )
    }

    case "code": {
      const { rich_text, language } = block.code
      const codeText = rich_text.map((item) => item.plain_text).join("")
      return (
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4">
          <code className={`text-sm font-mono language-${language}`}>
            {codeText}
          </code>
        </pre>
      )
    }

    case "divider": {
      return <hr className="my-6 border-border" />
    }

    case "image": {
      // 외부 URL 또는 파일 URL 처리
      const imageUrl =
        block.image.type === "external"
          ? block.image.external.url
          : block.image.file.url

      const caption =
        block.image.caption.length > 0
          ? block.image.caption.map((item) => item.plain_text).join("")
          : ""

      return (
        <figure className="mt-4">
          {/* next/image 대신 img 사용: Notion 파일 URL은 도메인이 동적으로 변경됨 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={caption}
            className="w-full rounded-lg object-cover"
          />
          {caption && (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {caption}
            </figcaption>
          )}
        </figure>
      )
    }

    case "callout": {
      const { rich_text, icon } = block.callout
      const emoji = icon?.type === "emoji" ? icon.emoji : "💡"
      return (
        <div className="mt-4 flex gap-3 rounded-lg border border-border bg-muted/50 p-4">
          <span className="text-xl shrink-0">{emoji}</span>
          <p className="leading-7">
            <RichText items={rich_text} />
          </p>
        </div>
      )
    }

    default:
      // 지원하지 않는 블록 타입은 렌더링하지 않음
      return null
  }
}

/**
 * Notion 블록 배열 전체를 렌더링합니다.
 */
export function NotionBlocks({ blocks }: NotionBlocksProps) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      {blocks.map((block) => (
        <NotionBlock key={block.id} block={block} />
      ))}
    </div>
  )
}
