import { useReducer, useState } from "react";
import {doc, setDoc, serverTimestamp} from "firebase/firestore";
import { db } from "../firebase";
import { rsvpReducer, initialRsvpState } from "./rsvpReducer";
import RsvpPage from "../reactComponents/RsvpPage"
import DietPage from "../reactComponents/DietPage";
import SongPage from "../reactComponents/SongPage";
import ArchedTextBox from '../reactComponents/ArchedTextBox';
import InsideArchDiv from "../reactComponents/InsideArchDiv";

function Rsvp(){
    //:Doc variables:
    // name -> text in the guest search box
    // rsvp -> the response being built (selectedGuest, partyMembers, additionalGuests, rsvpStatus,
    //   dietaryRequirements, songRequests). Shape and rules are in rsvpReducer.js. Update it with
    //   dispatch(action), never by setting fields directly.
    // attendees -> derived: partyMembers + named additionalGuests. Drives diet pages and the saved partyMembers.
    // currentPage -> Pagination of RSVP form
    // submitStatus -> "idle" | "submitting" | "success" | "error"
    //
    //:Doc database
    // invitations:
    //  allowedGuests - int
    //  fullName - string
    //  guestId - UUID
    //  lookupNames - array
    //  partyIdentifier - UUID
    //  partyMembers - array
    //  pages - dictionary of numbers associated to each page
    //  searchText - for fuzzy search when there is a misspelling
    //  searchTokens - helps scoring the search (not used yet)
    const [name,setName] = useState("");
    const [rsvp, dispatch] = useReducer(rsvpReducer, initialRsvpState);
    const { selectedGuest, partyMembers, additionalGuests, rsvpStatus, dietaryRequirements, songRequests } = rsvp;
    const [currentPage,setCurrentPage] = useState(0);
    const attendees = [...partyMembers, ...additionalGuests.filter(g => g.fullName.trim())];
    const songPage = attendees.length + 1;
    const [submitStatus,setSubmitStatus] = useState("idle");

    async function handleSubmit(e){
      e.preventDefault(e);

       if (!selectedGuest) {
        return;
      }
      try {
      setSubmitStatus("submitting");
      const partyIdentifier =
      selectedGuest.partyIdentifier;

      const responsePayload = {

        updatedAt: serverTimestamp(),
        partyIdentifier,

        selectedGuest: {
          guestId: selectedGuest.guestId,
          fullName: selectedGuest.fullName
        },

        partyMembers: attendees.map(member => member.isAdditionalGuest
          ? {
              guestId: member.guestId,
              fullName: member.fullName.trim(),
              isAdditionalGuest: true,
              hostGuestId: member.hostGuestId,
            }
          : {
              guestId: member.guestId,
              fullName: member.fullName,
            }),

        rsvpStatus,

        dietaryRequirements,

        songRequests,
      };
    
    const responseRef = doc(db,"responses",partyIdentifier);

    await setDoc(responseRef,responsePayload)
    localStorage.setItem("partyIdentifier",partyIdentifier);
    setSubmitStatus("success");

    } catch (err) {

      console.error("Error saving response:",err);
      setSubmitStatus("error");
    }
  }

    /*
      Pagination functions -> should probably break this functions up a bit 
    */

    function showFormButtons() {
      if (partyMembers.length === 0) {
        return false
      }else{
        return true
      }
    }

    function handleDietaryChange(guestId, value) {
      dispatch({ type: "dietChanged", guestId, value });
    }

    function getCurrentPage() {
      let page;
      if (currentPage===0){
        page = <RsvpPage props={{
          "name" : name,
          "setName" : setName,
          "partyMembers": partyMembers,
          "additionalGuests": additionalGuests,
          "rsvpStatus": rsvpStatus,
          "dispatch": dispatch,
        }}/>;
      }else if (currentPage<songPage){
        const dietIndex = currentPage - 1;
        page = <DietPage props={{"partyMember": attendees[dietIndex],
          "dietReq": dietaryRequirements[attendees[dietIndex].guestId],
          "onDietaryChange": handleDietaryChange,
        }}/>;
      }else{
        page = <SongPage props={{songRequests,dispatch}}></SongPage>;
      }
      
      return(<div>
              {page}
            </div>);
    }

    function nextPageLogic(){
      setCurrentPage(prev => prev+1)
    }

    function prevPageLogic(){
      setCurrentPage(prev => prev-1)
    }

    function showPrevButton(){
      if(currentPage>0){
        return true;
      }
      return false;
    }

    function showNextButton(){
      if(currentPage<songPage){
        return true;
      }
      return false;
    }

    function showSubmitButton(){
      if(currentPage===songPage){
        return true;
      }
      return false;
    }

    if (submitStatus === "success") {
      return (
        <div className="text-center p-6">
          <h2 className="text-2xl mb-4">
            Thank You!
          </h2>

          <p className="break-words">
            RSVP has been successfully submitted.
          </p>
        </div>);
    }

    if (submitStatus === "error") {
      return (
        <div className="text-center p-6">
          <h2 className="text-2xl mb-4">
            Oops
          </h2>

          <p>
            Something unexpected happened. Please try again later.
          </p>
        </div>);
    }
    return(<div className="text-center mb-4 w-full max-w-xs lg:max-w-lg">
            <h1 className="text-3xl text-center">Rsvp</h1>
            <InsideArchDiv>
              <ArchedTextBox>
                
              <form onSubmit={handleSubmit} className="w-full max-w-md  min-h-[500px] max-h-[600px] flex flex-col gap-6">
              <div className="flex-1 overflow-y-auto">
                <div className="mt-4 p-3 w-full">
                {getCurrentPage()}
                </div>
              </div>
              {showFormButtons() && (
              <div className="flex justify-between items-center mt-auto pt-6">
                {showPrevButton() && (
                  <button type="button" onClick={prevPageLogic} className="px-4 py-2 bg-white border rounded hover:bg-gray-100 text-black">Back</button>
                )}
                {showNextButton() && (
                  <button type="button" onClick={nextPageLogic} className="px-4 py-2 bg-white border rounded hover:bg-gray-100 text-black">Next</button>
                )}
                {showSubmitButton() && (
                  <input type="submit" disabled={submitStatus === "submitting"} value={submitStatus === "submitting" ? "Submitting..." : "Submit"} className="px-4 py-2 bg-white border rounded hover:bg-gray-100 text-black"/>)}
              
              </div>)}
            </form>
              </ArchedTextBox>
            </InsideArchDiv>
            
          </div>);
}
// const _ = doc(db, 'users', 'alovelace');
// const _ = collection(db, 'users');

/*
add data to firebase
try {
  const docRef = await addDoc(collection(db, "users"), {
    first: "Ada",
    last: "Lovelace",
    born: 1815
  });
  console.log("Document written with ID: ", docRef.id);
} catch (e) {
  console.error("Error adding document: ", e);
}

*/

export default Rsvp;