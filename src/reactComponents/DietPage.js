import ArchedTextBox from "./ArchedTextBox";


function DietPage({props}){
    /*
    partyMembers = {fullName,
                    guestId,
                    }
    */
    const partyMember = props.partyMember;
    const dietReq = props.dietReq;
    const handleDietChange = props.onDietaryChange;
    return(
        <>
        <h3 className="break-words text-center">"Any Dietary Requirements for {partyMember.fullName}?"</h3>
        <input type="text" value={dietReq || ""} onChange={(e) => handleDietChange(partyMember.guestId,e.target.value)} className="border border-black text-black bg-white"/>
        </>
    );
}

export default DietPage;