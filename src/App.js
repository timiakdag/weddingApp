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
    <picture className='block min-h-screen w-full relative bg-local overflow-hidden'>
        <source media="(min-width:1024px)" srcSet={background}/>
        <img src={mobbackground} alt="Background" className="absolute inset-0 w-full h-full object-cover"/>

        <div className="flex md:justify-center relative text-gray-50">
          <Navbar />
        </div>

        <div className="flex justify-center relative z-10 text-gray-50">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/ourstory" element={<About />} />
          </Routes>
        </div>
    </picture>
  );
}

export default App;
