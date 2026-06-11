import { useEffect, useState } from "react";

import {collection,query, where ,doc, getDoc, limit, setDoc, serverTimestamp} from "firebase/firestore";

import { useMemo, useRef } from "react";

import { db } from "../firebase";
import RsvpPage from "../reactComponents/RsvpPage"
import DietPage from "../reactComponents/DietPage";
import SongPage from "../reactComponents/SongPage";
import { set } from "zod";

function Rsvp(){
    //:Doc variables: 
    // name -> name of the selected guest
    // results -> for the type ahead lookup on selecting guests
    // selectedGuest -> the guest object from firebase
    // allGuests -> every guest from the database
    // partyMembers -> list of members in a party
    // rsvpStatus -> Yes or no answer from the party
    // currentPage -> Pagination of RSVP form
    // songRequests -> array of song requests
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
    const [selectedGuest,setSelectedGuest] = useState(null);
    const [partyMembers, setPartyMembers] = useState([]);
    const [rsvpStatus, setRsvpStatus] = useState({});
    const [currentPage,setCurrentPage] = useState(0);
    const [dietaryRequirements,setDietaryRequirements] = useState({});
    const [songRequests,setSongRequests] = useState({yes:[],no:[]});
    const [accessToken,setAccessToken] = useState("");
    const pages = {"RSVP": 0,"DIET": 1, "SONG": 2};
    const songPage = partyMembers.length + 1;
    const responsesCollection = collection(db,"responses")

    async function handleSubmit(e){
      e.preventDefault(e);

       if (!selectedGuest) {
        return;
      }
      try {

      const partyIdentifier =
      selectedGuest.partyIdentifier;

      const responsePayload = {

        updatedAt: serverTimestamp(),
        partyIdentifier,

        selectedGuest: {
          guestId: selectedGuest.guestId,
          fullName: selectedGuest.fullName
        },

        partyMembers: partyMembers.map(member => ({
        guestId: member.guestId,
        fullName: member.fullName,
        })),

        rsvpStatus,

        dietaryRequirements,

        songRequests,
      };
    
    const responseRef = doc(db,"responses",partyIdentifier);

    await setDoc(responseRef,responsePayload)

    console.log(
      "Response saved:");

    } catch (err) {

      console.error("Error saving response:",err);
    }
  }
  

    const setGuestStatus = (guestId,status) => {
      setRsvpStatus(prev => ({
        ...prev,[guestId]:status
      }));
    }

    /*
      Pagination functions -> should probably break this functions up a bit 
    */

    function showFormButtons() {
      if (partyMembers.length == 0) {
        return false
      }else{
        return true
      }
    }

    function handleDietaryChange(guestId, value) {
  setDietaryRequirements(prev => ({
    ...prev,
    [guestId]: value
  }));
}

    function getCurrentPage() {
      let page;
      if (currentPage==0){
        page = <RsvpPage props={{
          "name" : name,
          "setName" : setName,
          "partyMembers": partyMembers,
          "setPartyMembers": setPartyMembers,
          "setGuestStatus": setGuestStatus,
          "setSelectedGuest": setSelectedGuest,
          "setRsvpStatus": setRsvpStatus,
          "rsvpStatus": rsvpStatus,
          "setDietaryRequirements": setDietaryRequirements,
          "setSongRequests":setSongRequests
        }}/>;
      }else if (currentPage<songPage){
        const dietIndex = currentPage - 1;
        page = <DietPage props={{"partyMember": partyMembers[dietIndex],
          "dietReq": dietaryRequirements[partyMembers[dietIndex].guestId],
          "onDietaryChange": handleDietaryChange,
        }}/>;
      }else{
        return  page = <SongPage props={{songRequests,setSongRequests}}></SongPage>;
      }
      return page;
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
      if(currentPage==songPage){
        return true;
      }
      return false;
    }

    return(<div>
            <h1 className="text-3xl text-center">Rsvp</h1>
            <form onSubmit={handleSubmit}>
              {getCurrentPage()}
              {showFormButtons() && (
              <div className="flex justify-between items-center mt-4">
                {showPrevButton() && (
                  <button type="button" onClick={prevPageLogic} className="px-4 py-2 bg-white border rounded hover:bg-gray-100 text-black">Back</button>
                )}
                {showNextButton() && (
                  <button type="button" onClick={nextPageLogic} className="px-4 py-2 bg-white border rounded hover:bg-gray-100 text-black">Next</button>
                )}
                {showSubmitButton && (
                  <input type="submit" className="px-4 py-2 bg-white border rounded hover:bg-gray-100 text-black"/>)}
              
              </div>)}
            </form>
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

/*
import {
  onAuthStateChanged,
  signOut
} from "firebase/auth";

import { auth } from "../firebase";

import SignInForm from "../reactComponents/SignInForm";
import UserPanel from "../reactComponents/UserPanel";

function Rsvp(){
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
      });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
  };

    return(<div>
            <h1 className="text-3xl text-center">Rsvp</h1>
            {!user ? (
        <SignInForm />
      ) : (
        <UserPanel
          user={user}
          onSignOut={handleSignOut}
        />
      )}
          </div>);
}
          */

    