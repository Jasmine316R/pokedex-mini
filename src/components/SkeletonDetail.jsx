/**
 * SkeletonDetail – card-shaped skeleton placeholder matching
 * the DetailPage layout. Uses shimmer animation already defined
 * in index.css for .skeleton-card.
 */

function SkeletonDetail() {
  return (
    <div className="detail-page" aria-busy="true" aria-label="Loading Pokémon details">
      <div className="detail-nav">
        <span className="skel-line" style={{ width: 60 }} />
        <div className="detail-pager">
          <span className="skel-line" style={{ width: 70 }} />
          <span className="skel-line" style={{ width: 70 }} />
        </div>
      </div>

      <section className="detail-hero skeleton-hero">
        <div className="detail-art">
          <div className="skel-circle" />
        </div>
        <div className="detail-meta">
          <span className="skel-line" style={{ width: 70 }} />
          <span className="skel-line skel-title" style={{ width: "70%" }} />
          <div className="pokemon-card-types">
            <span className="skel-badge" />
            <span className="skel-badge" />
          </div>
          <div className="fact-row" style={{ marginTop: 18 }}>
            <div><span className="skel-line" style={{ width: 50 }} /><span className="skel-line" style={{ width: 70 }} /></div>
            <div><span className="skel-line" style={{ width: 50 }} /><span className="skel-line" style={{ width: 70 }} /></div>
            <div><span className="skel-line" style={{ width: 50 }} /><span className="skel-line" style={{ width: 100 }} /></div>
          </div>
          <div className="detail-actions">
            <span className="skel-btn" />
            <span className="skel-btn" style={{ width: 72 }} />
            <span className="skel-btn" style={{ width: 86 }} />
          </div>
        </div>
      </section>

      {/* Skeleton stat rows */}
      <div className="skel-radar" />
    </div>
  );
}

export default SkeletonDetail;
