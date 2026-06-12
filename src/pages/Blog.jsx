// Blog is the sub-router for /blog. The `route` prop comes from App.jsx
// (e.g. 'blog' for the index, 'blog/welcome' for a single post). When
// there's a sub-path it delegates to BlogPost; otherwise it renders the
// index list with tag filter and recent-posts sidebar.

import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import TagPill from '../components/TagPill'
import RecentPostsSidebar from '../components/RecentPostsSidebar'
import BlogPost from './BlogPost'
import { POSTS, ALL_TAGS } from '../data/blog'

// Read the ?tag=foo query param off the URL on mount, so a shared link
// like /blog?tag=react lands on the filtered view.
function readTagFromQuery() {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  return params.get('tag')
}

export default function Blog({ onHome, route }) {
  // Compute the sub-path: 'blog' -> '' (index), 'blog/welcome' -> 'welcome'.
  const subPath = route === 'blog' || !route ? '' : route.slice('blog/'.length)

  // Sub-router: a non-empty subPath means we want a single post.
  if (subPath) {
    return <BlogPost onHome={onHome} slug={subPath} />
  }

  return <BlogIndex onHome={onHome} />
}

// BlogIndex is the list-of-posts page. Tag filter state lives here and is
// synced to the URL query string so it's shareable.
function BlogIndex({ onHome }) {
  const [tagFilter, setTagFilter] = useState(null)

  // On mount, restore the filter from the URL. This also runs again if
  // the user uses the browser back button to revisit a filtered URL,
  // because App.jsx's popstate handler unmounts and remounts pages.
  useEffect(() => {
    const initial = readTagFromQuery()
    if (initial && ALL_TAGS.includes(initial)) {
      setTagFilter(initial)
    }
  }, [])

  // Toggle a tag: clicking the active tag clears the filter; clicking
  // any other tag sets it. The URL is updated via replaceState so the
  // user can copy/share the URL but the back button isn't cluttered
  // with every filter toggle.
  const onTagClick = (tag) => {
    const next = tagFilter === tag ? null : tag
    setTagFilter(next)
    const url = new URL(window.location.href)
    if (next) url.searchParams.set('tag', next)
    else url.searchParams.delete('tag')
    window.history.replaceState(null, '', url.pathname + url.search)
  }

  // Filter the post list by the active tag, or show everything when null.
  const visible = tagFilter
    ? POSTS.filter((p) => p.tags.includes(tagFilter))
    : POSTS

  return (
    <div className="blog-page case-study-page">
      <a href="#blog-main" className="skip-link">Skip to content</a>
      <Navbar onHome={onHome} slug="blog" crumbOverride="Blog" />

      <main id="blog-main" className="blog-layout">
        <div className="blog-main">
          <header className="blog-head">
            <div className="blog-head-text">
              <p className="blog-eyebrow">Writing</p>
              <h1 className="blog-title">Blog</h1>
              <p className="blog-lede">Short notes from Anthony. Building, reading, cooking, and the occasional opinion.</p>
            </div>
            {/* Dev-only shortcut to the editor. The import.meta.env.DEV
                check is replaced with a literal `false` at build time in
                production, which lets Vite tree-shake the whole anchor
                out of the prod bundle. */}
            {import.meta.env.DEV && (
              <a href="/blog-editor" className="blog-dev-editor-link">
                ✎ Editor
              </a>
            )}
          </header>

          {ALL_TAGS.length > 0 && (
            <div className="blog-filter" role="group" aria-label="Filter posts by tag">
              {ALL_TAGS.map((tag) => (
                <TagPill
                  key={tag}
                  tag={tag}
                  active={tagFilter === tag}
                  onClick={() => onTagClick(tag)}
                />
              ))}
              {tagFilter && (
                <button
                  type="button"
                  className="blog-filter-clear"
                  onClick={() => onTagClick(tagFilter)}
                >
                  clear filter
                </button>
              )}
            </div>
          )}

          {visible.length === 0 ? (
            <p className="blog-empty">No posts match this filter.</p>
          ) : (
            <ul className="blog-list">
              {visible.map((post) => (
                <li key={post.slug} className="blog-card-wrap">
                  <a className={`blog-card${post.heroImage ? ' has-hero' : ''}`} href={`/blog/${post.slug}`}>
                    <div className="blog-card-body">
                      <div className="blog-card-meta">
                        <span className="blog-card-date">{post.date}</span>
                        <span className="blog-card-readtime">{post.readMinutes} min</span>
                        {post.draft && (
                          <span className="blog-card-draft">draft</span>
                        )}
                      </div>
                      <h2 className="blog-card-title">{post.title}</h2>
                      {post.excerpt && (
                        <p className="blog-card-excerpt">{post.excerpt}</p>
                      )}
                      {post.tags.length > 0 && (
                        <div className="blog-card-tags">
                          {post.tags.map((tag) => (
                            <TagPill key={tag} tag={tag} small />
                          ))}
                        </div>
                      )}
                    </div>
                    {post.heroImage && (
                      <div className="blog-card-hero">
                        <img src={post.heroImage} alt="" />
                      </div>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <RecentPostsSidebar />
      </main>
    </div>
  )
}
