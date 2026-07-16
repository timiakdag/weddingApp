import {useState, useEffect} from "react";
import {AdvancedImage} from '@cloudinary/react';
import {Cloudinary} from "@cloudinary/url-gen";
import {fill} from '@cloudinary/url-gen/actions/resize';
import './Arch.css'
import PageHeader from "../reactComponents/PageHeader";
import InsideArchDiv from "../reactComponents/InsideArchDiv";

const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;


const cld = new Cloudinary({
    cloud: {
        cloudName: CLOUD_NAME
    }
})

const urls = ['IMG_0685_qqyik0','IMG_1152_hv2jud'].map(publicId => {const img = cld.image(publicId);
    img.resize(fill().width(1200).height(600).gravity("faces" || "auto"));
    img.format('auto');
    return img;
});

function Home() {
    const [imagesReady,setImagesReady] = useState(false);
    const [currentIndex,setCurrentIndex] = useState(0) 

    useEffect(() => {
        let loaded = 0;
        urls.forEach(img => {
            const image = new Image();
            image.src = img.toURL();

            image.onload = () => {
                loaded++;
                if (loaded === urls.length) {
                    setImagesReady(true);
                }
            }
        })
    },[])

    useEffect(() => {
        const autoplay = setInterval(() => {
            setCurrentIndex(prev =>
                prev === urls.length - 1 ? 0 : prev + 1
            );
        }, 5000);

        return () => clearInterval(autoplay);}, []
    );

    return (<div className="w-full">
                <PageHeader title="T & T" />
                <InsideArchDiv className="relative h-[300px] lg:h-[500px] overflow-hidden arch-container arch-clip bg-gray-200">
                    {!imagesReady && (
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-white" />
                        </div>)}
                    {urls.map((img, index) => (
                        <AdvancedImage
                        key={index}
                        cldImg={img}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out
                        ${index === currentIndex ? "opacity-100" : "opacity-0"}`}
                        />
                    ))}
                </InsideArchDiv>
                <div className="text-1xl lg:text-3xl text-center pt-4">
                    <h1>September 18, 2027</h1>
                    <h1>Gunstock Mountain Resort</h1>
                </div>
                
            </div>);
}

export default Home;