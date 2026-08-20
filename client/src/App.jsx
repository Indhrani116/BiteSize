import { BrowserRouter } from "react-router-dom";

import "./App.css";

import PageLayout from "./components/layout/PageLayout";
import UIComponentsDemo from "./pages/UIComponentsDemo";

function App() {
  return (
    <BrowserRouter>

      <PageLayout>

        <UIComponentsDemo />

      </PageLayout>

    </BrowserRouter>
  );
}

export default App;