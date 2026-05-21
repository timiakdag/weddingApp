import ArchedTextBox from "./ArchedTextBox"
import { useEffect, useRef, useState } from "react"


function LeafInput({onSubmit}) {
    const [text,setText] = useState("");
    const textareaRef = useRef(null);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey){
            e.preventDefault();
            handleSubmit();
        }
    }

    const handleSubmit = () => {
        if (!text.trim()) return;
        onSubmit(text);
        setText("");
    }

    const autoResize = () => {
        const el = textareaRef.current;
        if (!el) return;

        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`
    }

    const handleChange = (e) => {
        setText(e.target.value);
    }

    useEffect(() => {
        autoResize();
    },[text])

    return(<>
             <ArchedTextBox className="p-6">
                 <div className="absolute inset-0 pointer-events-none" />

                 <div className="relative z-10 h-full flex flex-col justify-center gap-4">
                    <textarea
                        ref={textareaRef}
                        value={text}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Write about T&T..."
                        rows={1}
                        className="text-white z-10 w-full bg-transparent box-border resize-none overflow-hidden leading-relaxed text-base focus:outline-none"
                    />
                    <button onClick={handleSubmit}>Submit</button>
                 </div>
            </ArchedTextBox>
          </>)
}

export default LeafInput;