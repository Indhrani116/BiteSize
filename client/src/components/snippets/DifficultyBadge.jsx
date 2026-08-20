function DifficultyBadge({ difficulty }) {
  const className = difficulty
    ? difficulty.toLowerCase()
    : "beginner";

  return (
    <span className={`difficulty-badge ${className}`}>
      {difficulty}
    </span>
  );
}

export default DifficultyBadge;