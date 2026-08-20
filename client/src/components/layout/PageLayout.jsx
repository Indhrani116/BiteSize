
import Navbar from "./Navbar";

function PageLayout({ children }) {
  return (
    <div className="app-layout">

      <Navbar />

      <main className="page-container">
        {children}
      </main>

    </div>
  );
}

export default PageLayout;
