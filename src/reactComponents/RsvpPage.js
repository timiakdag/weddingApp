import Fuse from "fuse.js";
import { useMemo, useRef, useEffect, useState, useCallback } from "react";
import {db} from "../firebase";
import {collection,getDoc,getDocs, doc} from "firebase/firestore";

function RsvpPage({props}){
    const name = props.name;
    const setName = props.setName;
    const partyMembers = props.partyMembers;
    const setPartyMembers = props.setPartyMembers;
    const setGuestStatus = props.setGuestStatus;
    const setSelectedGuest = props.setSelectedGuest;
    const setRsvpStatus = props.setRsvpStatus;
    const rsvpStatus = props.rsvpStatus;
    const setDietaryRequirements = props.setDietaryRequirements;
    const setSongRequests = props.setSongRequests;

    const timeoutRef = useRef(null);
    const invites = collection(db,'invitations');

    const [results,setResults] = useState([]);
    const [allGuests,setAllGuests] = useState([]);
    const [sessionState,setSessionState] = useState("search");
    const [loadingGuests,setLoadingGuests] = useState(true);

    const loadExistingResponse = useCallback(async (partyIdentifier) => {

      try {

        const responseRef = doc(
          db,
          "responses",
          partyIdentifier);

        const responseSnap = await getDoc(responseRef);

        if (!responseSnap.exists()) {return;}

        const data = responseSnap.data();

        setRsvpStatus(data.rsvpStatus || {});

        setDietaryRequirements(data.dietaryRequirements || {});

        setSongRequests(data.songRequests || {yes: [],no: []});

      } catch (err) {

        console.error("Error loading RSVP:",err);
      }},[setRsvpStatus,setDietaryRequirements,setSongRequests]); 

  const fuse = useMemo(() => {
          return new Fuse(allGuests,{
            keys: ["searchText","lookupNames","fullName"],
            threshold: 0.35,
            ignoreLocation: true
          });
        },[allGuests]);
  
  //load of all data 
  useEffect(() => {
      async function loadGuests(){
        try{
           const snapshot = await getDocs(invites);
            const data = snapshot.docs.map(d => d.data());
            setAllGuests(data);
        }finally {
          setLoadingGuests(false);
        }
      }
      loadGuests();
    },[]);

  //Restore data from local storage
  useEffect(() => {

    if (allGuests.length === 0) {
      return;
    }

    const savedPartyIdentifier = localStorage.getItem("partyIdentifier");

    if (!savedPartyIdentifier) {
      return;
    }

    const members = allGuests.filter(g => g.partyIdentifier === savedPartyIdentifier);

    if (members.length === 0) {
      return;
    }

    setPartyMembers(members);
    setSelectedGuest(members[0]);
    setName(members[0].fullName);
    setResults([]);
    setSessionState("party");

  loadExistingResponse(savedPartyIdentifier);}, [allGuests,loadExistingResponse]);
  

  useEffect(() => {
    return () => {
    clearTimeout(timeoutRef.current);
  };}, []);

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

    function searchGuests(input) {
        const tier1 = tier1Search(input);

        // Strong Tier 1 match → use it immediately
        if (tier1.length >= 1) {
            return tier1;
        }

        // Otherwise fallback to fuzzy
        return tier2Search(input);
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

    function normalize(str) {
    return str
      .toLowerCase()
      .replace(/[^a-z\s]/g, "")
      .trim();
    }

    async function selectGuest(guest) {
    setName(guest.fullName);
    setSelectedGuest(guest);
    setResults([]);
    loadParty(guest.partyIdentifier);
    setSessionState("party");
    loadExistingResponse(guest.partyIdentifier);
    }

    function loadParty(partyIdentifier) {
      const members = allGuests.filter(g => g.partyIdentifier === partyIdentifier);

      setPartyMembers(members);

      setRsvpStatus(prev => {
        const updated = { ...prev };

        for (const member of members) {
          updated[member.guestId] ??= null;}

        return updated;})
    }

    if (loadingGuests) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-3 text-black">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
      <div className="text-sm">Loading your guest list...</div>
    </div>
  );
}

return (
  <>
    {sessionState === "search" && (
      <>
        <input
          type="text"
          value={name}
          onChange={handleChange}
          className="border border-black text-black bg-white"
          placeholder="Enter your name"
        />

        {results.length > 0 && (
          <ul className="border w-64 bg-white">
            {results.map(g => (
              <li
                key={g.guestId}
                onClick={() => selectGuest(g)}
                className="p-2 hover:bg-gray-200 cursor-pointer"
              >
                <div className="text-s text-black">
                  {g.fullName}
                </div>
              </li>
            ))}
          </ul>
        )}
      </>
    )}

    {sessionState === "party" && (
      <div className="mt-4 border p-3 w-full md:w-96">
        <h2 className="text-lg font-bold mb-2">Your Party</h2>

        {partyMembers.map(member => (
          <div key={member.guestId} className="flex justify-between items-center mb-2">
            <div>{member.fullName}</div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setGuestStatus(member.guestId, "yes")}
                className={`px-3 py-1 border rounded text-black transition
                ${rsvpStatus[member.guestId] === "yes"
                  ? "bg-blue-200 border-blue-400"
                  : "bg-white border-gray-300 hover:bg-gray-100"
                }`}
              >
                Yes
              </button>

              <button
                type="button"
                onClick={() => setGuestStatus(member.guestId, "no")}
                className={`px-3 py-1 border rounded text-black transition
                ${rsvpStatus[member.guestId] === "no"
                  ? "bg-blue-200 border-blue-400"
                  : "bg-white border-gray-300 hover:bg-gray-100"
                }`}
              >
                No
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </>
);
}

export default RsvpPage;