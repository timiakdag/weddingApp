function PageHeader({title, className=""}){
    return(<>
            <h1 className={`${className} lg:text-3xl text-center`}>{title}</h1>
           </>);
}

export default PageHeader;