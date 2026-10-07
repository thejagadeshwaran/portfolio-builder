import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

// =========================================================
// PAGES
// =========================================================

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PortfolioBuilder from "./pages/PortfolioBuilder";
import PortfolioPreview from "./pages/PortfolioPreview";
import PublicPortfolio from "./pages/PublicPortfolio";

// =========================================================
// APP
// =========================================================

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =================================================
            PUBLIC ROUTES
        ================================================= */}

        {/* Home */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Register */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* =================================================
            PUBLIC PORTFOLIO
            Example:
            http://localhost:3000/portfolio/demo
        ================================================= */}

        <Route
          path="/portfolio/:username"
          element={<PublicPortfolio />}
        />

        {/* =================================================
            PROTECTED ROUTES
        ================================================= */}

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Portfolio Builder */}
        <Route
          path="/builder"
          element={
            <ProtectedRoute>
              <PortfolioBuilder />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            PORTFOLIO PREVIEW
        ================================================= */}

        {/* Preview without ID */}
        <Route
          path="/preview"
          element={
            <ProtectedRoute>
              <PortfolioPreview />
            </ProtectedRoute>
          }
        />

        {/* Preview with MongoDB ID */}
        <Route
          path="/preview/:id"
          element={
            <ProtectedRoute>
              <PortfolioPreview />
            </ProtectedRoute>
          }
        />

        {/* =================================================
            FALLBACK ROUTE
        ================================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;