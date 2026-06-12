// BlogPost renders one post at /blog/<slug>. The Blog sub-router delegates
// to this component when the URL has a sub-path. Markdown body is rendered
// through marked, with the same right-rail recent-posts sidebar as the index.

import { useState } from 'react'
import Navbar from '../components/Navbar'
import TagPill from '../components/TagPill'
import RecentPostsSidebar from '../components/RecentPostsSidebar'
import Lightbox from '../components/Lightbox'
import { findPost } from '../data/blog'
// Shared marked instance with marked-highlight + Prism + image-attrs
// extension preconfigured. Importing it here is enough; the side-effect
// registers everything we need.
import { marked } from '../data/marked'

// Click a tag pill on a post page: jump to the index pre-filtered by
// that tag. We push the URL change manually since a button isn't an
// anchor; App.jsx's click interceptor only catches anchor clicks.
function goToTag(tag) {
  window.history.pushState(null, '', `/blog?tag=${encodeURIComponent(tag)}`)
  // Dispatch popstate so App.jsx's listener notices the route change.
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export default function BlogPost({ onHome, slug }) {
  const post = findPost(slug)
  // Currently lightboxed image. null when closed; otherwise { src, alt }.
  // Driven by a delegated click handler on the body container so we
  // don't need to walk the rendered HTML after parse.
  const [zoom, setZoom] = useState(null)

  // Fall through to a friendly not-found view if the slug doesn't match
  // any post. Common when a post is deleted but the URL is still cached
  // somewhere (e.g. a search engine, an old bookmark).
  if (!post) {
    return (
      <div className="blog-page case-study-page">
        <Navbar onHome={onHome} slug="blog" crumbOverride="Blog" label="Not found" />
        <main className="blog-layout">
          <div className="blog-main">
            <header className="blog-head">
              <h1 className="blog-title">Post not found</h1>
              <p className="blog-lede">
                No post matches the slug <code>{slug}</code>.{' '}
                <a href="/blog">Back to the blog index.</a>
              </p>
            </header>
          </div>
          <RecentPostsSidebar />
        </main>
      </div>
    )
  }

  // marked is synchronous when no async extensions are configured.
  // The HTML it returns is then injected via dangerouslySetInnerHTML
  // because rendering markdown to React elements (vs HTML) would need
  // marked-react or a similar adapter and a bigger dep tree.
  const html = marked.parse(post.body)

  // Delegated click handler on the post body. Any <img> inside opens
  // the Lightbox at its src; clicks elsewhere are ignored. Delegation
  // here means new images don't need rebinding when the body re-renders.
  const onBodyClick = (e) => {
    const t = e.target
    if (t.tagName !== 'IMG') return
    e.preventDefault()
    setZoom({ src: t.getAttribute('src'), alt: t.getAttribute('alt') || '' })
  }

  return (
    <div className="blog-page case-study-page">
      <a href="#blog-post-main" className="skip-link">Skip to content</a>
      <Navbar onHome={onHome} slug="blog" crumbOverride="Blog" label={post.title} />

      <main id="blog-post-main" className="blog-layout">
        <article className="blog-main blog-post">
          <header className={`blog-post-head${post.heroImage ? ' has-hero' : ''}`}>
            <div className="blog-post-head-text">
              <p className="blog-post-date">
                {post.date}
                <span className="blog-post-meta-sep"> · </span>
                {post.readMinutes} min
                <span className="blog-post-meta-sep"> · </span>
                {post.words.toLocaleString()} words
                {post.draft && <span className="blog-post-draft"> · draft</span>}
              </p>
              <h1 className="blog-post-title">{post.title}</h1>
              {post.tags.length > 0 && (
                <div className="blog-post-tags">
                  {post.tags.map((tag) => (
                    <TagPill key={tag} tag={tag} onClick={() => goToTag(tag)} />
                  ))}
                </div>
              )}
            </div>
            {/* Hero image, magazine-column-lead style. Clicks open the
                lightbox via the same delegated handler that catches
                inline body images. */}
            {post.heroImage && (
              <figure
                className="blog-post-hero"
                onClick={() => setZoom({ src: post.heroImage, alt: post.heroImageAlt })}
              >
                <img src={post.heroImage} alt={post.heroImageAlt || ''} />
              </figure>
            )}
            {/* Dev-only shortcut: opens the editor with this post
                pre-loaded via /blog-editor?slug=<slug>. The editor reads
                the slug param on mount and clears the URL after loading. */}
            {import.meta.env.DEV && (
              <a
                href={`/blog-editor?slug=${encodeURIComponent(post.slug)}`}
                className="blog-dev-editor-link"
              >
                ✎ Edit this post
              </a>
            )}
          </header>
          {/* Markdown body. Content is from local files we author, so
              dangerouslySetInnerHTML is a controlled-trust path. If we
              ever add user-submitted content, this would need sanitizing. */}
          <div
            className="blog-post-body"
            onClick={onBodyClick}
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <p className="blog-post-foot">
            <a href="/blog">← All posts</a>
          </p>
        </article>

        <RecentPostsSidebar currentSlug={post.slug} />
      </main>

      <Lightbox
        isOpen={!!zoom}
        src={zoom?.src}
        alt={zoom?.alt}
        label={zoom?.alt}
        onClose={() => setZoom(null)}
      />
    </div>
  )
}
