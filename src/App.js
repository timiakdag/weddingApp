import logo from './logo.svg';
import './App.css';
import Home from "./pages/Home";
import About from './pages/About';
import Schedule from './pages/Schedule';
import {Routes, Route} from "react-router-dom";
import Navbar from './reactComponents/Navbar';
import background from "./images/websitebackground.webp";
import mobbackground from "./images/mobilebackground.webp";

function App() {
  return (
    <div className="min-h-screen w-full relative">
    {/* DESKTOP BACKGROUND */}
      <div
        className="hidden lg:block absolute inset-0 bg-cover bg-no-repeat bg-top"
        style={{ backgroundImage: `url(${background})` }}
      />

      {/* MOBILE BACKGROUND (two stacked images) */}
      <div className="lg:hidden flex flex-col absolute inset-0 min-h-screen w-full">
        <img
          src={mobbackground}
          alt="Top Mobile"
          className="flex-1 w-full object-cover"
        />

        <img
          src={mobbackground}
          alt="Bottom Mobile"
          className="flex-1 w-full object-cover rotate-180"
        />
     </div>

      {/* FOREGROUND CONTENT */}
      <div className="relative z-10">
        <div className="flex md:justify-center text-gray-50">
          <Navbar />
        </div>

        <div className="flex justify-center text-gray-50 mt-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/ourstory" element={<About />} />
          </Routes>
           </div>
      </div>
    </div>
  );
}

export default App;
