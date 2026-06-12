// RecentPostsSidebar renders the right rail on both the blog index and
// blog post pages. It lists the N most recent posts as small cards, each
// linking to its post page. On post detail pages, the current post is
// excluded so the sidebar always shows neighbors.

import { POSTS } from '../data/blog'
import TagPill from './TagPill'

export default function RecentPostsSidebar({ currentSlug, limit = 5 }) {
  // Exclude the current post (if any), then slice down to the limit.
  // POSTS is already sorted by date desc, so this is straight prefix.
  const recent = POSTS
    .filter((p) => p.slug !== currentSlug)
    .slice(0, limit)

  if (recent.length === 0) return null

  return (
    <aside className="blog-sidebar" aria-label="Recent posts">
      <h2 className="blog-sidebar-head">Recent</h2>
      <ul className="blog-sidebar-list">
        {recent.map((post) => (
          <li key={post.slug} className="blog-sidebar-item">
            <a href={`/blog/${post.slug}`} className="blog-sidebar-link">
              <span className="blog-sidebar-date">{post.date}</span>
              <span className="blog-sidebar-title">{post.title}</span>
              {post.tags.length > 0 && (
                <span className="blog-sidebar-tags">
                  {/* Cap to 2 pills here so the sidebar stays scannable
                      even for posts with a long tag list. Small pills
                      so they don't dominate the title row. */}
                  {post.tags.slice(0, 2).map((tag) => (
                    <TagPill key={tag} tag={tag} small />
                  ))}
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}
