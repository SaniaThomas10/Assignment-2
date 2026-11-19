
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Calendar from "./pages/Calendar";
import Todo from "./pages/Todo";
import Journal from "./pages/Journal";
import Inspiration from "./pages/Inspiration";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Main application layout */}
        <Route element={<MainLayout />}>

          <Route path="/" element={<Home />} />

          <Route path="/calendar" element={<Calendar />} />

          <Route path="/todo" element={<Todo />} />

          <Route path="/journal" element={<Journal />} />

          <Route path="/inspiration" element={<Inspiration />} />

        </Route>

        {/* Redirect unknown pages to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
