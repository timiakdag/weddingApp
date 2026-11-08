import InsideArchDiv from "../reactComponents/InsideArchDiv";
import PageHeader from "../reactComponents/PageHeader";
import LeafInput from "../reactComponents/LeafInput";

function LeafPage() {
    const handleLeafSubmit = (text) => {
        console.log(text);
    };

    return(<div className="w-full min-h-screen flex flex-col">
            <PageHeader title="Community Board" className="text-sm"/>
            <InsideArchDiv className="mt-auto">
                <LeafInput onSubmit={handleLeafSubmit}/>
            </InsideArchDiv>
           </div>);
}


export default LeafPage;