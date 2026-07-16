import PageHeader from '../reactComponents/PageHeader';
import InsideArchDiv from '../reactComponents/InsideArchDiv';
import ArchedTextBox from '../reactComponents/ArchedTextBox';
import FAQItem from '../reactComponents/FAQItem';
import {Link} from "react-router-dom"

function Questions() {
    const questions = [{
        question: "What is the dress code?",
        answer:"To be announced soon!"
        },
      {question:"What transportation will be provided?",
        answer: (<>
                 Buses will be provided for guests staying at Gunstock Inn & Suites before and after the wedding.
                 Please visit our,{" "}
                 <Link to="/schedule" className='text-white underline'>Schedule page</Link>{" "}
                 for bus timetable.
                 </>)
      },
    {question:"Are children allowed at the wedding?",
      answer:"While we adore your little ones, we've decided to keep our wedding and reception an adults-only event."
    }]
    return(<div className='w-full'>
            <PageHeader title="Q+A"/>
            <br></br>
            <InsideArchDiv>
        <ArchedTextBox>
          <div className='px-8 lg:px-20 text-center leading-relaxed text-base lg:text-lg max-w-prose md:w-[250px] lg:w-auto py-4 lg:py-0'>
            {questions.map((item,index)=> (
                <FAQItem key={index}
                         question={item.question}
                         answer={item.answer}/>
            ))}
          </div>
        </ArchedTextBox>
      </InsideArchDiv>
           </div>);

}

export default Questions;