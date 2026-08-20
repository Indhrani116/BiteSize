function Sidebar({
  selectedTopic,
  setSelectedTopic,
  selectedDifficulty,
  setSelectedDifficulty,
  onClear
}) {
  const topics = [
    "JavaScript",
    "Python",
    "DSA",
    "DBMS",
    "Web Development"
  ];

  const difficulties = [
    "Beginner",
    "Intermediate",
    "Advanced"
  ];

  return (
    <aside className="sidebar">

      <div className="sidebar-header">
        <h2>Filters</h2>
      </div>

      <div className="sidebar-section">

        <h3>Topics</h3>

        {topics.map((topic) => (
          <label key={topic} className="filter-option">

            <input
              type="radio"
              name="topic"
              checked={selectedTopic === topic}
              onChange={() => setSelectedTopic(topic)}
            />

            <span>{topic}</span>

          </label>
        ))}

      </div>

      <div className="sidebar-section">

        <h3>Difficulty</h3>

        {difficulties.map((difficulty) => (
          <label
            key={difficulty}
            className="filter-option"
          >

            <input
              type="radio"
              name="difficulty"
              checked={selectedDifficulty === difficulty}
              onChange={() =>
                setSelectedDifficulty(difficulty)
              }
            />

            <span>{difficulty}</span>

          </label>
        ))}

      </div>

      <button
        className="sidebar-clear"
        onClick={onClear}
      >
        Clear Filters
      </button>

    </aside>
  );
}

export default Sidebar;