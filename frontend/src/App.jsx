import { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Heart,
  Bookmark,
  Plus,
} from "lucide-react";
import Login from "./Login";
import Register from "./Register";
import "./App.css";

function App() {
  const [page, setPage] = useState("login");

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [search, setSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All");

  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const [showCreate, setShowCreate] = useState(false);

  const [content, setContent] = useState("");
  const [topic, setTopic] = useState("AI / ML");

  const [posts, setPosts] = useState([]);

  // ELI5
  const [eli5Loading, setEli5Loading] = useState(false);
  const [eli5Explanation, setEli5Explanation] = useState("");
  const [showEli5, setShowEli5] = useState(false);

  // EDIT
  const [editingPost, setEditingPost] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editTopic, setEditTopic] = useState("AI / ML");

  // GET POSTS
  useEffect(() => {
    fetch("http://localhost:5000/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error(error));
  }, []);

  // CREATE POST
  const createPost = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      alert("Please write a snippet");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content,
            topic,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setPosts((prev) => [data, ...prev]);

      setContent("");
      setTopic("AI / ML");
      setShowCreate(false);
    } catch (error) {
      console.error(error);
      alert("Failed to create snippet");
    }
  };

  // GEMINI ELI5
  const explainPost = async (postContent) => {
    setEli5Loading(true);
    setShowEli5(true);
    setEli5Explanation("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/gemini/explain",
        {
          content: postContent,
        }
      );

      setEli5Explanation(response.data.explanation);
    } catch (error) {
      console.error("ELI5 error:", error);
      setEli5Explanation(
        "Sorry, I couldn't generate the explanation."
      );
    } finally {
      setEli5Loading(false);
    }
  };

  // LIKE
  const likePost = async (postId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/posts/${postId}/like`,
        {
          method: "POST",
        }
      );

      const updatedPost = await response.json();

      setPosts((prev) =>
        prev.map((post) =>
          post._id === updatedPost._id
            ? updatedPost
            : post
        )
      );
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  // BOOKMARK
  const bookmarkPost = async (postId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/posts/${postId}/bookmark`,
        {
          method: "POST",
        }
      );

      const updatedPost = await response.json();

      setPosts((prev) =>
        prev.map((post) =>
          post._id === updatedPost._id
            ? updatedPost
            : post
        )
      );
    } catch (error) {
      console.error("Bookmark error:", error);
    }
  };

  // DELETE
  const deletePost = async (postId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this snippet?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/posts/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setPosts((prev) =>
        prev.filter((post) => post._id !== postId)
      );
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete post");
    }
  };

  // OPEN EDIT
  const openEdit = (post) => {
    setEditingPost(post);
    setEditContent(post.content);
    setEditTopic(post.topic);
  };

  // SAVE EDIT
  const saveEdit = async () => {
    if (!editContent.trim()) {
      alert("Please write a snippet");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/posts/${editingPost._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: editContent,
            topic: editTopic,
          }),
        }
      );

      const updatedPost = await response.json();

      if (!response.ok) {
        alert(updatedPost.message);
        return;
      }

      setPosts((prev) =>
        prev.map((post) =>
          post._id === updatedPost._id
            ? updatedPost
            : post
        )
      );

      setEditingPost(null);
      setEditContent("");
      setEditTopic("AI / ML");
    } catch (error) {
      console.error("Edit error:", error);
      alert("Failed to edit post");
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setPage("login");
    setShowProfile(false);
    setShowBookmarks(false);
  };

  // LOGIN / REGISTER
  if (!user) {
    if (page === "register") {
      return (
        <Register
          goLogin={() => setPage("login")}
        />
      );
    }

    return (
      <Login
        onLogin={(loggedUser) => setUser(loggedUser)}
        goRegister={() => setPage("register")}
      />
    );
  }

  // SEARCH + TOPIC FILTER
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.content
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      post.topic
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      post.author?.name
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const matchesTopic =
      selectedTopic === "All" ||
      post.topic === selectedTopic;

    return matchesSearch && matchesTopic;
  });

  return (
    <div className="app">

      {/* NAVBAR */}

      <nav className="navbar">

        <div className="logo">
          <span className="logo-icon">B</span>
          BiteSize
        </div>

        <div className="nav-links">

          {/* EXPLORE */}

          <span
            onClick={() => {
              setShowProfile(false);
              setShowBookmarks(false);
              setSelectedTopic("All");
              setSearch("");

              setTimeout(() => {
                document
                  .querySelector(".posts")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  });
              }, 100);
            }}
            style={{ cursor: "pointer" }}
          >
            Explore
          </span>

          {/* BOOKMARKS */}

          <span
            onClick={() => {
              setShowProfile(false);
              setShowBookmarks(true);

              setTimeout(() => {
                document
                  .querySelector(".posts")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  });
              }, 100);
            }}
            style={{ cursor: "pointer" }}
          >
            Bookmarks
          </span>

          {/* PROFILE */}

          <span
            onClick={() => {
              setShowBookmarks(false);
              setShowProfile(true);
            }}
            style={{ cursor: "pointer" }}
          >
            Profile
          </span>

          {/* LOGOUT */}

          <button onClick={logout}>
            Logout
          </button>

        </div>

        {/* CREATE */}

        <button
          className="create-btn"
          onClick={() => {
            setShowProfile(false);
            setShowBookmarks(false);
            setShowCreate(true);
          }}
        >
          <Plus size={18} />
          Create
        </button>

      </nav>


      {/* MAIN */}

      <main className="main">

        {/* HERO */}

        <section className="hero">

          <div>

            <p className="eyebrow">
              LEARN • SHARE • SIMPLIFY
            </p>

            <h1>
              Learn something new,
              <br />
              <span>one bite at a time.</span>
            </h1>

            <p className="hero-text">
              Discover short educational snippets and simplify
              complex concepts with AI.
            </p>

          </div>

        </section>


        {/* SEARCH */}

        <div className="search-box">

          <Search size={21} />

          <input
            type="text"
            placeholder="Search topics, concepts or snippets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>


        {/* TOPICS */}

        <div className="topics">

          <button
            className={
              selectedTopic === "All"
                ? "active"
                : ""
            }
            onClick={() => setSelectedTopic("All")}
          >
            All
          </button>

          <button
            className={
              selectedTopic === "AI / ML"
                ? "active"
                : ""
            }
            onClick={() =>
              setSelectedTopic("AI / ML")
            }
          >
            AI / ML
          </button>

          <button
            className={
              selectedTopic === "Programming"
                ? "active"
                : ""
            }
            onClick={() =>
              setSelectedTopic("Programming")
            }
          >
            Programming
          </button>

          <button
            className={
              selectedTopic === "DBMS"
                ? "active"
                : ""
            }
            onClick={() =>
              setSelectedTopic("DBMS")
            }
          >
            DBMS
          </button>

          <button
            className={
              selectedTopic === "Data Science"
                ? "active"
                : ""
            }
            onClick={() =>
              setSelectedTopic("Data Science")
            }
          >
            Data Science
          </button>

          <button
            className={
              selectedTopic === "Cloud"
                ? "active"
                : ""
            }
            onClick={() =>
              setSelectedTopic("Cloud")
            }
          >
            Cloud
          </button>

        </div>


        {/* SECTION HEADER */}

        <section className="section-header">

          <div>

            <h2>
              {showProfile
                ? "My Profile"
                : showBookmarks
                ? "Bookmarked Snippets"
                : "Latest Snippets"}
            </h2>

            <p>
              {showProfile
                ? "Your BiteSize learning profile"
                : showBookmarks
                ? "Your saved educational snippets"
                : "Quick knowledge from the learning community"}
            </p>

          </div>

        </section>


        {/* PROFILE */}

        {showProfile ? (

          <section
            className="profile-card"
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "30px",
              marginBottom: "30px",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.08)",
              textAlign: "center",
            }}
          >

            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "#5b5ce2",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                fontWeight: "bold",
                margin: "0 auto 15px",
              }}
            >
              {user?.name
                ?.charAt(0)
                ?.toUpperCase() || "U"}
            </div>

            <h2>
              {user?.name || "BiteSize User"}
            </h2>

            <p>
              {user?.email || "No email available"}
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "50px",
                marginTop: "30px",
              }}
            >

              <div>
                <h3>{posts.length}</h3>
                <p>Snippets</p>
              </div>

              <div>
                <h3>
                  {posts.reduce(
                    (total, post) =>
                      total + (post.likes || 0),
                    0
                  )}
                </h3>
                <p>Likes</p>
              </div>

              <div>
                <h3>
                  {posts.reduce(
                    (total, post) =>
                      total + (post.bookmarks || 0),
                    0
                  )}
                </h3>
                <p>Bookmarks</p>
              </div>

            </div>

            <button
              onClick={() => {
                setShowProfile(false);
              }}
              style={{
                marginTop: "25px",
                padding: "10px 20px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              ← Back to Explore
            </button>

          </section>

        ) : (

          /* POSTS */

          <section className="posts">

            {showBookmarks ? (

              /* BOOKMARKS */

              posts.filter(
                (post) => post.bookmarks > 0
              ).length === 0 ? (

                <p>No bookmarked snippets yet.</p>

              ) : (

                posts
                  .filter(
                    (post) => post.bookmarks > 0
                  )
                  .map((post) => (

                    <article
                      className="post-card"
                      key={post._id}
                    >

                      <div className="post-top">

                        <span className="topic">
                          {post.topic}
                        </span>

                      </div>

                      <h3>
                        {post.content?.substring(
                          0,
                          45
                        )}

                        {post.content?.length > 45
                          ? "..."
                          : ""}
                      </h3>

                      <p>
                        {post.content}
                      </p>

                      <div className="author">
                        By{" "}
                        {post.author?.name ||
                          "BiteSize learner"}
                      </div>

                      {/* EDIT / DELETE */}

                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          marginTop: "15px",
                        }}
                      >

                        <button
                          onClick={() =>
                            openEdit(post)
                          }
                          style={{
                            padding: "7px 14px",
                            border: "none",
                            borderRadius: "7px",
                            cursor: "pointer",
                          }}
                        >
                          ✏️ Edit
                        </button>

                        <button
                          onClick={() =>
                            deletePost(post._id)
                          }
                          style={{
                            padding: "7px 14px",
                            border: "none",
                            borderRadius: "7px",
                            cursor: "pointer",
                          }}
                        >
                          🗑️ Delete
                        </button>

                      </div>

                      <div className="post-bottom">
                        🔖 {post.bookmarks || 0}
                      </div>

                    </article>

                  ))

              )

            ) : (

              /* NORMAL POSTS */

              filteredPosts.map((post) => (

                <article
                  className="post-card"
                  key={post._id}
                >

                  {/* TOP */}

                  <div className="post-top">

                    <span className="topic">
                      {post.topic}
                    </span>

                    <button
                      className="bookmark"
                      onClick={() =>
                        bookmarkPost(post._id)
                      }
                    >
                      <Bookmark size={19} />
                      {post.bookmarks || 0}
                    </button>

                  </div>


                  {/* TITLE */}

                  <h3>
                    {post.content?.substring(
                      0,
                      45
                    )}

                    {post.content?.length > 45
                      ? "..."
                      : ""}
                  </h3>


                  {/* CONTENT */}

                  <p>
                    {post.content}
                  </p>


                  {/* AUTHOR */}

                  <div className="author">
                    By{" "}
                    {post.author?.name ||
                      "BiteSize learner"}
                  </div>


                  {/* EDIT / DELETE */}

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "15px",
                    }}
                  >

                    <button
                      onClick={() =>
                        openEdit(post)
                      }
                      style={{
                        padding: "7px 14px",
                        border: "none",
                        borderRadius: "7px",
                        cursor: "pointer",
                      }}
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() =>
                        deletePost(post._id)
                      }
                      style={{
                        padding: "7px 14px",
                        border: "none",
                        borderRadius: "7px",
                        cursor: "pointer",
                      }}
                    >
                      🗑️ Delete
                    </button>

                  </div>


                  {/* BOTTOM */}

                  <div className="post-bottom">

                    <div className="actions">

                      {/* LIKE */}

                      <button
                        onClick={() =>
                          likePost(post._id)
                        }
                      >
                        <Heart size={18} />
                        {post.likes || 0}
                      </button>


                      {/* ELI5 */}

                      <button
                        className="eli5-btn"
                        onClick={() =>
                          explainPost(
                            post.content
                          )
                        }
                      >
                        ELI5
                      </button>

                    </div>

                  </div>

                </article>

              ))

            )}

          </section>

        )}

      </main>


      {/* CREATE MODAL */}

      {showCreate && (

        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
          }}
        >

          <div
            style={{
              background: "white",
              width: "500px",
              padding: "30px",
              borderRadius: "15px",
            }}
          >

            <h2>Create a Snippet</h2>

            <p>
              Share something useful in 280 characters.
            </p>

            <br />

            <label>Topic</label>

            <br />

            <select
              value={topic}
              onChange={(e) =>
                setTopic(e.target.value)
              }
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "8px",
              }}
            >
              <option>AI / ML</option>
              <option>Programming</option>
              <option>DBMS</option>
              <option>Data Science</option>
              <option>Cloud</option>
            </select>

            <br />
            <br />

            <label>
              Educational Snippet
            </label>

            <textarea
              value={content}
              onChange={(e) => {
                if (
                  e.target.value.length <= 280
                ) {
                  setContent(e.target.value);
                }
              }}
              placeholder="Share a concept, tip or interesting fact..."
              rows="6"
              style={{
                width: "100%",
                marginTop: "8px",
                padding: "10px",
              }}
            />

            <p>
              {content.length}/280
            </p>

            <button
              type="button"
              onClick={() =>
                setShowCreate(false)
              }
              style={{
                padding: "10px 20px",
                marginRight: "10px",
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={createPost}
              style={{
                padding: "10px 20px",
                background: "#5b5ce2",
                color: "white",
                border: "none",
                borderRadius: "6px",
              }}
            >
              Publish Snippet
            </button>

          </div>

        </div>

      )}


      {/* EDIT MODAL */}

      {editingPost && (

        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100001,
          }}
        >

          <div
            style={{
              background: "white",
              width: "500px",
              padding: "30px",
              borderRadius: "15px",
            }}
          >

            <h2>Edit Snippet</h2>

            <label>Topic</label>

            <select
              value={editTopic}
              onChange={(e) =>
                setEditTopic(e.target.value)
              }
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "8px",
              }}
            >
              <option>AI / ML</option>
              <option>Programming</option>
              <option>DBMS</option>
              <option>Data Science</option>
              <option>Cloud</option>
            </select>

            <br />
            <br />

            <label>
              Educational Snippet
            </label>

            <textarea
              value={editContent}
              onChange={(e) => {
                if (
                  e.target.value.length <= 280
                ) {
                  setEditContent(
                    e.target.value
                  );
                }
              }}
              rows="6"
              style={{
                width: "100%",
                marginTop: "8px",
                padding: "10px",
              }}
            />

            <p>
              {editContent.length}/280
            </p>

            <button
              type="button"
              onClick={() =>
                setEditingPost(null)
              }
              style={{
                padding: "10px 20px",
                marginRight: "10px",
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={saveEdit}
              style={{
                padding: "10px 20px",
                background: "#5b5ce2",
                color: "white",
                border: "none",
                borderRadius: "6px",
              }}
            >
              Save Changes
            </button>

          </div>

        </div>

      )}


      {/* ELI5 MODAL */}

      {showEli5 && (

        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 100000,
          }}
        >

          <div
            style={{
              background: "white",
              width: "90%",
              maxWidth: "600px",
              borderRadius: "16px",
              padding: "28px",
              boxShadow:
                "0 20px 50px rgba(0,0,0,0.2)",
            }}
          >

            <h2 style={{ marginTop: 0 }}>
              ✨ Explain Like I'm 5
            </h2>

            {eli5Loading ? (

              <p>
                Gemini is thinking... 🤖
              </p>

            ) : (

              <p
                style={{
                  lineHeight: "1.7",
                  whiteSpace: "pre-wrap",
                }}
              >
                {eli5Explanation}
              </p>

            )}

            <button
              onClick={() =>
                setShowEli5(false)
              }
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                background: "#111827",
                color: "white",
              }}
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;