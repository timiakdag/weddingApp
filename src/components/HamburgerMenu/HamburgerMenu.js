import {Routes, Route, Link } from "react-router-dom";
import About from "../../pages/About";
import Schedule from "../../pages/Schedule";


function HamburgerMenu() {

    return ( <>
      <nav>
        <Link to="/schedule">Schedule</Link> |{" "}
        <Link to="/ourstory">About</Link>
      </nav>

      <Routes>
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/ourstory" element={<About />} />
      </Routes>
    </>);
}

export default HamburgerMenu;
