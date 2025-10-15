import {Routes, Route, Link } from "react-router-dom";
import About from "../../pages/About";
import Home from "../../pages/Home";


function HamburgerMenu() {

    return ( <>
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/ourstory">About</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ourstory" element={<About />} />
      </Routes>
    </>);
}

export default HamburgerMenu;
