function SnippetCard({ snippet }) {
  return (
    <article className="snippet-card">
      <div className="snippet-card-header">
        <div>
          <h3>{snippet.title}</h3>
          <p className="snippet-author">By {snippet.author}</p>
        </div>

        <span className="snippet-difficulty">
          {snippet.difficulty}
        </span>
      </div>

      <span className="snippet-topic">{snippet.topic}</span>

      <p className="snippet-content">{snippet.content}</p>

      <div className="snippet-actions">
        <button>♡ Like</button>
        <button>💬 Comment</button>
        <button>🔖 Bookmark</button>
        <button>↗ Share</button>
      </div>
    </article>
  );
}

export default SnippetCard;