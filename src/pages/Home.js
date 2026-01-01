import img1 from "../images/IMG_0685.png";
import img2 from "../images/IMG_1152.png";
import img3 from "../images/IMG_3314.png";
import img4 from "../images/IMG_3639.png";
import {useState, useEffect} from "react";

const images = [img1,img2,img3,img4]

function Home() {
    const [currentIndex,setCurrentIndex] = useState(0) 

    useEffect(() => {
    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
    }

    const autoplay = setInterval(() => {
        nextSlide()
    }, 5000)

    return () => clearInterval(autoplay)
}, [currentIndex])

    return (<div className="w-full">
                <h1 className="text-3xl text-center">T & T</h1>
                <div className="relative w-1/2 h-[250px] mx-auto overflow-hidden">
                        {images.map((img, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out
                                ${index === currentIndex ? "opacity-100" : "opacity-0"}`}
                            style={{ backgroundImage: `url(${img})` }}
                            />))}
                </div>
            </div>);
}


export default Home;