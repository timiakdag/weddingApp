import './Arch.css'
import PageHeader from '../reactComponents/PageHeader';
import InsideArchDiv from '../reactComponents/InsideArchDiv';
import ArchedTextBox from '../reactComponents/ArchedTextBox';

function About() {
  return (
    <div className='w-full'>
      <PageHeader title="Our Story"/>

      <InsideArchDiv>
        <ArchedTextBox>
          <div className="px-8 lg:px-20 text-center leading-relaxed text-base lg:text-lg max-w-prose md:w-[250px] lg:w-auto py-4 lg:py-0">
              Taylor from Wakefield and Timur from Arlington both moved to Brighton
              Massachusetts around the same time.
              <br /><br />
              With mutual friends Adel and Nate encouraging the two to meet for months,
              Timur got a call to meet Taylor for the first time at Barcelona wine bar.
              <br /><br />
              After dinner everyone came over to Timur's apartment and the connection
              between Taylor and Timur was strong…
            </div>
        </ArchedTextBox>
      </InsideArchDiv>
    </div>
  );
}

export default About;
