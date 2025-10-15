import React, {useState} from "react";
import {Link} from "react-router-dom";

export default function Navbar() {

    const [open,setOpen] = useState(false);

    //space-y-1 div makes the hamburger three lines

    //w-6 sets the width, h-0.5 the height, bg - color

    //fixes class create panel to cover full height of the screen h-full attached to left side
    //Doesn't scroll with the page
    //transform and translate-x-* make it slide in/out smoothly  when open is true translate-x-0
    //transition -300 adds 300ms animation
    return(<div className="fixed top-0 left-0">
            {/* Desktop Menu*/}
            <nav className="hidden md:flex space-x-6">
                <Link to="/" className="hover:text-blue-600 font-medium">Home</Link>
                <Link to="/ourstory" className="hover:text-blue-600 font-medium">Our Story</Link>
            </nav>

            {/*Hamburger button Mobile only */}
            <button className="md:hidden p-2 focus:outline-none" onClick={() => setOpen(!open)}>
                <div className="space-y-1">
                    <span className="block w-6 h-0.5 bg-gray-800"></span>
                    <span className="block w-6 h-0.5 bg-gray-800"></span>
                    <span className="block w-6 h-0.5 bg-gray-800"></span>
                </div>
            </button>
            
            {/* Mobile menu*/}
            <div className={`fixed top-0 left-0 h-full bg-white shadow-lg transform transition-transform duration-300
                ${open ? "translate-x-0" : "-translate-x-full"} md:hidden`}>
                <nav className="flex flex-col p-6 space-y-4 w-48">
                    <Link to="/" onClick={() => setOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
                    <Link to="/ourstory" onClick={() => setOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium">Our Story</Link>
                    <Link to="/schedule" onClick={() => setOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium">Schedule</Link>
                </nav>
            </div>
            {open && (
                <div
                    className="fixed inset-0 md-hidden" 
                    onClick={() => setOpen(false)}
                ></div>
)}
           </div>);
}