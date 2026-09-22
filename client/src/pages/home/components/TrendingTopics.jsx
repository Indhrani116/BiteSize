function TrendingTopics() {
  const topics = ["JavaScript", "DSA", "Python", "DBMS", "AI/ML"];

  return (
    <div>
      <h2>Topics</h2>

      <div>
        {topics.map((topic) => (
          <button key={topic}>{topic}</button>
        ))}
      </div>
    </div>
  );
}

export default TrendingTopics;