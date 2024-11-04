'use client'

import { useState, useRef, useEffect, useTransition } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export default function SidebarNote({ id, title, children, expandedChildren }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const selectedId = pathname?.split('/')[1] || null
  const [isPending] = useTransition()
  const [isExpanded, setIsExpanded] = useState(false)
  const isActive = id === selectedId

  // Animate after title is edited
  const itemRef = useRef(null)
  const prevTitleRef = useRef(title)

  useEffect(() => {
    if (title !== prevTitleRef.current) {
      prevTitleRef.current = title
      // @ts-ignore
      itemRef.current.classList.add('flash')
    }
  }, [title])

  return (
    <div
      ref={itemRef}
      onAnimationEnd={() => {
        // @ts-ignore
        itemRef.current.classList.remove('flash')
      }}
      className={[
        'sidebar-note-list-item',
        isExpanded ? 'note-expanded' : ''
      ].join(' ')}
    >
      {children}
      <button
        className="sidebar-note-open"
        style={{
          backgroundColor: isPending
            ? 'var(--gray-80)'
            : isActive
              ? 'var(--tertiary-blue)'
              : undefined,
          border: isActive
            ? '1px solid var(--primary-border)'
            : '1px solid transparent'
        }}
        onClick={() => {
          // hide the sidebar
          const sidebarToggle = document.getElementById('sidebar-toggle')
          if (sidebarToggle) {
            // @ts-ignore
            sidebarToggle.checked = true
          }

          const url = new URL(`/note/${id}`, window.location.origin)
          searchParams.forEach((value, key) => {
            url.searchParams.append(key, value)
          })

          router.push(url.pathname + url.search)
        }}
      >
        Open note for preview
      </button>
      <button
        className="sidebar-note-toggle-expand"
        onClick={(e) => {
          e.stopPropagation()
          setIsExpanded(!isExpanded)
        }}
      >
        {isExpanded ? (
          <img
            src="/chevron-down.svg"
            width="10px"
            height="10px"
            alt="Collapse"
          />
        ) : (
          <img src="/chevron-up.svg" width="10px" height="10px" alt="Expand" />
        )}
      </button>
      {isExpanded && expandedChildren}
    </div>
  )
}
