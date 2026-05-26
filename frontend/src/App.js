import { BrowserRouter, Routes, Route } from "react-router-dom";
import Analytics from "./pages/Analytics";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PortfolioBuilder from "./pages/PortfolioBuilder";
import PortfolioPreview from "./pages/PortfolioPreview";
import PublicPortfolio from "./pages/PublicPortfolio";
import SearchPortfolio from "./pages/SearchPortfolio";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={ <ProtectedRoute><Dashboard /></ProtectedRoute>}/>        <Route path="/builder" element={<PortfolioBuilder />} />
        <Route path="/preview" element={<PortfolioPreview />} />
        <Route path="/portfolio/:username" element={<PublicPortfolio />} />
        <Route path="/search"element={<SearchPortfolio />}/>
        <Route path="/analytics"element={<Analytics />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;