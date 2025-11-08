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
    return(<div>
            {/* Desktop Menu*/}
            <nav className="hidden md:flex p-4 space-x-6">
                <Link to="/" className="hover:text-blue-600 font-medium">Home</Link>
                <Link to="/ourstory" className="hover:text-blue-600 font-medium">Our Story</Link>
                <Link to="/schedule" className="hover:text-blue-600 font-medium">Schedule</Link>
            </nav>

            {/*Hamburger button Mobile only */}
            <button className="md:hidden p-2 focus:outline-none" onClick={() => setOpen(!open)}>
                <div className="space-y-1">
                    <span className="block w-6 h-0.5 bg-gray-50"></span>
                    <span className="block w-6 h-0.5 bg-gray-50"></span>
                    <span className="block w-6 h-0.5 bg-gray-50"></span>
                </div>
            </button>

            {/*Overlay */}
            {open && (
                <div
                    className="fixed inset-0 md:hidden z-[50]" 
                    onClick={() => setOpen(false)}
                ></div>
            )}
            
            {/* Mobile menu*/}
            <div className={`fixed top-0 left-0 h-full w-48 bg-white shadow-lg transform transition-transform duration-300
                ${open ? "translate-x-0" : "-translate-x-full"} md:hidden z-[100]`}>
                <nav className="flex flex-col p-6 space-y-4">
                    <Link to="/" onClick={() => setOpen(false)} className="block w-full py-2 text-red-700 hover:text-blue-600 font-medium">Home</Link>
                    <Link to="/ourstory" onClick={() => setOpen(false)} className="block w-full py-2 text-red-700 hover:text-blue-600 font-medium">Our Story</Link>
                    <Link to="/schedule" onClick={() => setOpen(false)} className="block w-full py-2 text-red-700 hover:text-blue-600 font-medium">Schedule</Link>
                </nav>
            </div>
            
           </div>);
}