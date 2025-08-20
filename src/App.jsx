import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import MarketPlace from "./pages/MarketPlace";
import Blog from "./pages/Blog";
import AIWellness from "./pages/AIWellness";
import Membership from "./pages/Membership";
import ContactUs from "./pages/ContactUs";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PersonalWellnessProgrammes from "./pages/services/PersonalWellnessProgrammes";
import BusinessWellnessProgrammes from "./pages/services/BusinessWellnessProgrammes";
import WellnessProgramDetails from "./pages/services/WellnessProgramDetails";
import Podcasts from "./pages/ResourcesHub/Podcasts";
import Webinars from "./pages/ResourcesHub/Webinars";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services/personal-wellness" element={<PersonalWellnessProgrammes />} />
          <Route path="/services/business-wellness" element={<BusinessWellnessProgrammes />} />
          <Route path="/services/program-details" element={<WellnessProgramDetails />} />
          <Route path="/marketplace" element={<MarketPlace />} />
          <Route path="/resources/podcasts" element={<Podcasts />} />
          <Route path="/resources/webinars" element={<Webinars />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/ai-wellness" element={<AIWellness />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
