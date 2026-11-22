import ContentWrapper from '../reactComponents/ContentWrapper';
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
    },
    {question:"Where is the ceremony?",
      answer:"Weather allowing, the ceremony will be at the top of Gunstock mountain.  All guests must take the chairlift up and down.  Unfortunately there is no option for getting to the ceremony outside of the chair lift"
    },
  {question:"What footwear would be recommended?",
      answer:"Guests will be going up and down hills off the ski lift to get to the reception.  Stiletto and other shoes like that would not be advised."
    }]

    return(<ContentWrapper title="Q+A">
{questions.map((item,index)=> (
                <FAQItem key={index}
                         question={item.question}
                         answer={item.answer}/>
            ))}
    </ContentWrapper>);

}

export default Questions;