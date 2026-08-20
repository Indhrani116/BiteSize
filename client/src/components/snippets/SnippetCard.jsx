import TopicBadge from "./TopicBadge";
import DifficultyBadge from "./DifficultyBadge";
import Button from "../common/Button";

function SnippetCard({ snippet, onLike, onBookmark, onExplain }) {
  return (
    <article className="snippet-card">

      <div className="snippet-card-top">
        <TopicBadge topic={snippet.topic} />

        <DifficultyBadge
          difficulty={snippet.difficulty}
        />
      </div>

      <h3 className="snippet-title">
        {snippet.title}
      </h3>

      <p className="snippet-content">
        {snippet.content}
      </p>

      <div className="snippet-author">
        @{snippet.author}
      </div>

      <div className="snippet-actions">

        <button onClick={onLike}>
          ❤️ {snippet.likes}
        </button>

        <button>
          💬 {snippet.comments}
        </button>

        <button onClick={onBookmark}>
          🔖 Save
        </button>

      </div>

      <Button
        variant="secondary"
        onClick={onExplain}
      >
        🧠 Explain Like I'm 5
      </Button>

    </article>
  );
}

export default SnippetCard;