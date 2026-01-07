import '../pages/Arch.css'

function ArchedTextBox({children, className=""}){
    return(<div className={`relative arch-bg min-h-[300px] lg:h-[500px] arch-container ${className}`}>
            <div className="h-full flex lg:items-center justify-center">
                {children}
            </div>
           </div>);
}

export default ArchedTextBox;