import PageHeader from '../reactComponents/PageHeader';
import InsideArchDiv from '../reactComponents/InsideArchDiv';
import ArchedTextBox from '../reactComponents/ArchedTextBox';


function Accommodation() {
    return(<div className='w-full'>
        <PageHeader title="Accommodation"></PageHeader>
        <br></br>
        <InsideArchDiv>
            <ArchedTextBox>
                <div className="px-8 lg:px-20 text-center leading-relaxed text-base lg:text-lg max-w-prose md:w-[250px] lg:w-auto py-4 lg:py-0">
                    <a href='https://gunstockinn.com/'>Gunstock Inn & Suites</a>
                    <br></br>
                    When booking there is a special promo code to have access to the dates.  The promo will be provided at a later date.
                </div>
            </ArchedTextBox>
        </InsideArchDiv>
    </div>)
}

export default Accommodation;