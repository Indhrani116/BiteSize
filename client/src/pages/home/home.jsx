import FeedHeader from "./components/FeedHeader";
import TrendingTopics from "./components/TrendingTopics";
import SnippetCard from "./components/snippetCard";

function Home() {
  const snippets = [
    {
      id: 1,
      author: "Akshaya",
      topic: "JavaScript",
      content: "JavaScript is used to make web pages interactive.",
      difficulty: "Easy",
    },
    {
      id: 2,
      author: "Rahul",
      topic: "DSA",
      content: "A stack follows the LIFO principle: Last In, First Out.",
      difficulty: "Easy",
    },
    {
      id: 3,
      author: "Priya",
      topic: "Python",
      content: "Python is a high-level programming language known for its simple syntax.",
      difficulty: "Easy",
    },
    {
      id: 4,
      author: "Arjun",
      topic: "DBMS",
      content: "A primary key uniquely identifies each record in a table.",
      difficulty: "Medium",
    },
    {
      id: 5,
      author: "Sneha",
      topic: "AI/ML",
      content: "Machine learning allows computers to learn patterns from data.",
      difficulty: "Medium",
    },
  ];

  return (
    <main>
      <FeedHeader />

      <TrendingTopics />

      <section>
        <h2>Educational Snippets</h2>
        {snippets.map((snippet) => (
  <SnippetCard
    key={snippet.id}
    snippet={{
      ...snippet,
      title: snippet.topic,
    }}
  />
))}

      </section>
    </main>
  );
}

export default Home;