import {Routes, Route, Link } from "react-router-dom";
import About from "../../pages/About";
import Home from "../../pages/Home";


function HamburgerMenu() {

    return (<div>
                <nav>
                    <Link to="/">Home</Link> | {" "}
                    <Link to="/our_story">Our Story</Link>
                </nav>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/our_story" element={<About />} />
                </Routes>
            </div>);
}

export default HamburgerMenu;
