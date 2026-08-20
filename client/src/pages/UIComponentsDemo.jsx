import { useState } from "react";

import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import Modal from "../components/common/Modal";
import EmptyState from "../components/common/EmptyState";

import TopicBadge from "../components/snippets/TopicBadge";
import DifficultyBadge from "../components/snippets/DifficultyBadge";
import SnippetCard from "../components/snippets/SnippetCard";

import Sidebar from "../components/layout/Sidebar";

function UIComponentsDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  const clearFilters = () => {
    setSelectedTopic("");
    setSelectedDifficulty("");
  };

  return (
    <div className="ui-demo">

      <div className="ui-demo-header">
        <h1>BiteSize UI Foundation</h1>

        <p>
          Reusable frontend components developed by Member 1.
        </p>
      </div>


      {/* BUTTONS */}

      <section className="ui-demo-section">

        <h2>Buttons</h2>

        <div className="ui-demo-row">

          <Button>
            Create a Bite
          </Button>

          <Button>
            Save
          </Button>

        </div>

      </section>


      {/* BADGES */}

      <section className="ui-demo-section">

        <h2>Badges</h2>

        <div className="ui-demo-row">

          <TopicBadge topic="JavaScript" />

          <DifficultyBadge difficulty="Beginner" />

        </div>

      </section>


      {/* LOADER */}

      <section className="ui-demo-section">

        <h2>Loader</h2>

        <Loader />

      </section>


      {/* SNIPPET CARD */}

      <section className="ui-demo-section">

        <h2>Snippet Card</h2>
<SnippetCard
  snippet={{
    topic: "JavaScript",
    difficulty: "Beginner",
    title: "Understanding Closures",
    content:
      "Closures allow a function to remember variables from its outer scope.",
    author: "@rahul",
    likes: 24,
    comments: 5
  }}
/>

      </section>


      {/* SIDEBAR */}

      <section className="ui-demo-section">

        <h2>Sidebar</h2>

        <div className="demo-layout">

          <Sidebar
            selectedTopic={selectedTopic}
            setSelectedTopic={setSelectedTopic}
            selectedDifficulty={selectedDifficulty}
            setSelectedDifficulty={setSelectedDifficulty}
            onClear={clearFilters}
          />

          <div className="filter-result">

            <p>
              Topic: {selectedTopic || "None"}
            </p>

            <p>
              Difficulty: {selectedDifficulty || "None"}
            </p>

          </div>

        </div>

      </section>


      {/* EMPTY STATE */}

      <section className="ui-demo-section">

        <h2>Empty State</h2>

        <EmptyState
          icon="🔖"
          title="No Saved Bites"
          message="Save useful educational snippets here for quick revision."
          buttonText="Explore Bites"
        />

      </section>


      {/* MODAL */}

      <section className="ui-demo-section">

        <h2>Modal</h2>

        <Button onClick={() => setIsModalOpen(true)}>
          Open Modal
        </Button>

      </section>


      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="BiteSize Modal"
      >

        <p>
          This is a reusable modal component
          created for the BiteSize application.
        </p>

        <br />

        <Button onClick={() => setIsModalOpen(false)}>
          Close
        </Button>

      </Modal>

    </div>
  );
}

export default UIComponentsDemo;