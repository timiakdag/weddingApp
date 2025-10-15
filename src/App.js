import logo from './logo.svg';
import './App.css';
import Home from "./pages/Home";
import About from './pages/About';
import Schedule from './pages/Schedule';
import {Routes, Route} from "react-router-dom";
import Navbar from './reactComponents/Navbar';

function App() {
  return (
    <div className="App">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/ourstory" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;
