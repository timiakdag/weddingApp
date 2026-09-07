import PageHeader from '../reactComponents/PageHeader';
import InsideArchDiv from '../reactComponents/InsideArchDiv';
import ArchedTextBox from "../reactComponents/ArchedTextBox";

function ContentWrapper({title,children}){
    return(<div className='w-full'>
            <PageHeader title={title}/>
            <br></br>
            <InsideArchDiv>
                <ArchedTextBox>
                    <div className="px-8 lg:px-20 text-center leading-relaxed text-base lg:text-lg max-w-prose md:w-[250px] lg:w-auto py-4 lg:py-0">
                        {children}
                    </div>
                </ArchedTextBox>
            </InsideArchDiv>
           </div>)
}

export default ContentWrapper;