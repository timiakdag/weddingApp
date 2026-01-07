function InsideArchDiv({children, className =""}){
    return(<div className={`w-8/12 md:w-1/2 lg:w-3/4 mx-auto ${className}`}>
        {children}
    </div>);
}

export default InsideArchDiv;