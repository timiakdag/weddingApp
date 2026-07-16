import PageHeader from '../reactComponents/PageHeader';
import InsideArchDiv from '../reactComponents/InsideArchDiv';
import ArchedTextBox from '../reactComponents/ArchedTextBox';

function Schedule() {
    return(<div className='w-full'>
            <PageHeader title="Schedule"/>
            <br></br>
            <InsideArchDiv>
        <ArchedTextBox>
          <div className="px-8 lg:px-20 text-center leading-relaxed text-base lg:text-lg max-w-prose md:w-[250px] lg:w-auto py-4 lg:py-0">
              To be announced soon!
            </div>
        </ArchedTextBox>
      </InsideArchDiv>
           </div>);

}

export default Schedule;