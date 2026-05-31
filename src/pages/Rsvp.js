import { useEffect, useState } from "react";

import {collection,query, where ,getDocs, limit} from "firebase/firestore";
import Fuse from "fuse.js";
import { useMemo, useRef } from "react";

import { db } from "../firebase";

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
    const [results,setResults] = useState([]);
    const [selectedGuest,setSelectedGuest] = useState(null);
    const [allGuests,setAllGuests] = useState([]);
    const [partyMembers, setPartyMembers] = useState([]);
    const [rsvpStatus, setRsvpStatus] = useState({});
    const [currentPage,setCurrentPage] = useState(0);
    const [songRequests,setSongRequests] = useState([]);

    //
    //Variables 
    const timeoutRef = useRef(null);
    const invites = collection(db,'invitations');
    const songPage = partyMembers.length + 1;

    const fuse = useMemo(() => {
      return new Fuse(allGuests,{
        keys: ["searchText","lookupNames","fullName"],
        threshold: 0.35,
        ignoreLocation: true
      });
    },[allGuests]);

    //***
    // Run when the page loads 
    // */

    useEffect(() => {
      async function loadGuests(){
        const snapshot = await getDocs(invites);
        const data = snapshot.docs.map(d => d.data());
        setAllGuests(data);
      }
      loadGuests();
    },[]);

    function normalize(str) {
    return str
      .toLowerCase()
      .replace(/[^a-z\s]/g, "")
      .trim();
    }

    function tier1Search(input) {
      const query = normalize(input);
      const tokens = query.split(" ").filter(Boolean);

      if (!query) return [];

      return allGuests.filter(g =>
        tokens.every(t =>
          g.lookupNames?.some(n => n.includes(t))
        )
      );
    }

    function tier2Search(input) {
    if (!input || input.length < 2) return [];

    return fuse.search(input).map(r => r.item);
    } 

    function searchGuests(input) {
    const tier1 = tier1Search(input);

    // Strong Tier 1 match → use it immediately
    if (tier1.length >= 1) {
      return tier1;
    }

    // Otherwise fallback to fuzzy
    return tier2Search(input);
    }

    function handleChange(e){
      const val = e.target.value;
      setName(val);

      debouncedSearch(val);
      
    }

    function debouncedSearch(value) {
      clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        runSearch(value);
      }, 250);
    }

    function runSearch(value) {
      const inp = value.trim();
      if (inp.length<2) {
        setResults([]);
        return;
      }
      const matches = searchGuests(inp);
      setResults(matches);
    }

    function handleSubmit(e){
      e.preventDefault(e);
      
      //const q = query(invites, where("capital", "==", name)
      //async -> waiting for doc
    }

    function selectGuest(guest) {
    setName(guest.fullName);
    setSelectedGuest(guest);
    setResults([]);
    loadParty(guest.partyIdentifier);
    }

    function setGuestStatus(guestId,status) {
      setRsvpStatus(prev => ({
        ...prev,[guestId]:status
      }));
    }

    function loadParty(partyIdentifier) {
      const members = allGuests.filter(g => g.partyIdentifier === partyIdentifier);

      setPartyMembers(members);

      const initialStatus = {};
      members.forEach(m => {initialStatus[m.guestId] = null;
      });

      setRsvpStatus(initialStatus);
    }

    /*
      Pagination functions -> should probably break this functions up a bit 
    */
    function canContinueFromRsvp() {
        return partyMembers.every(member => rsvpStatus[member.guestId]);
    }

    function updateDietaryRequirement(guestId,value){
      setDietaryRequirements(prev => ({
        ...prev,[guestId]:value
      }));
    }

    return(<div>
            <h1 className="text-3xl text-center">Rsvp</h1>
            <form onSubmit={handleSubmit}>
              <input type="text" value={name} onChange={handleChange} className="border border-black text-black bg-white" placeholder="Enter your name"/>
              {results.length > 0 && (
                <ul className="border w-64 bg-white">
                {results.map(g => (
                  <li
                    key={g.guestId}
                    onClick={() => selectGuest(g)}
                    className="p-2 hover:bg-gray-200 cursor-pointer">
              
                    <div className="text-s text-black">
                      {g.fullName}
                    </div>
                  </li>))}
                </ul>)}
              {partyMembers.length > 0 && (
                <div className="mt-4 border p-3 w-96">
                  <h2 className="text-lg font-bold mb-2">Your Party</h2>

                  {partyMembers.map(member => (
                  <div key={member.guestId} className="flex justify-between items-center mb-2">
        
                    <div>{member.fullName}</div>

                    <div className="flex gap-2">
                     <button 
                        type="button" onClick={() => setGuestStatus(member.guestId, "yes")}
                        className={`px-3 py-1 border rounded text-black transition
                        ${rsvpStatus[member.guestId] === "yes"
                            ? "bg-blue-200 border-blue-400"
                            : "bg-white border-gray-300 hover:bg-gray-100"
                        }`}>
                        Yes
                      </button>

                      <button
                        type="button"
                        onClick={() => setGuestStatus(member.guestId, "no")}
                        className={`px-3 py-1 border rounded text-black transition
                        ${rsvpStatus[member.guestId] === "no"
                          ? "bg-blue-200 border-blue-400"
                          : "bg-white border-gray-300 hover:bg-gray-100"
                        }`}>
                        No
                      </button>
                    </div>
                    <button type="button" disabled={!canContinueFromRsvp()} onClick={() => setCurrentPage(pages.DIET)}>Next</button>
                  </div>))}
                </div>)}
              <input type="submit"/>
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

    