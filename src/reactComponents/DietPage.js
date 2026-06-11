
function DietPage({props}){
    /*
    partyMembers = {fullName,
                    guestId,
                    }
    */
    const partyMember = props.partyMember;
    const dietReq = props.dietReq;
    const handleDietChange = props.onDietaryChange;
    console.log(partyMember.fullName)
    console.log(dietReq);
    return(
        <>
        <h3>"Any Dietary Requirements for {partyMember.fullName}?"</h3>
        <input type="text" value={dietReq || ""} onChange={(e) => handleDietChange(partyMember.guestId,e.target.value)} className="border border-black text-black bg-white"/>
        </>
    );
}

export default DietPage;