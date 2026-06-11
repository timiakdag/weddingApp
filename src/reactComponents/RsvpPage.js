import Fuse from "fuse.js";
import { useMemo, useRef, useEffect, useState } from "react";
import {db} from "../firebase";
import {collection,query, where ,getDoc,getDocs, doc, limit} from "firebase/firestore";

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

    async function loadExistingResponse(
  partyIdentifier
) {

  try {

    const responseRef = doc(
      db,
      "responses",
      partyIdentifier
    );

    const responseSnap =
      await getDoc(responseRef);

    if (!responseSnap.exists()) {
      return;
    }

    const data = responseSnap.data();

    console.log(
      "Existing RSVP found",
      data
    );

    setRsvpStatus(
      data.rsvpStatus || {}
    );

    setDietaryRequirements(
      data.dietaryRequirements || {}
    );

    setSongRequests(
      data.songRequests || {
        yes: [],
        no: []
      }
    );

  } catch (err) {

    console.error(
      "Error loading RSVP:",
      err
    );
  }
}

    const fuse = useMemo(() => {
          return new Fuse(allGuests,{
            keys: ["searchText","lookupNames","fullName"],
            threshold: 0.35,
            ignoreLocation: true
          });
        },[allGuests]);

    useEffect(() => {
      async function loadGuests(){
        const snapshot = await getDocs(invites);
        const data = snapshot.docs.map(d => d.data());
        setAllGuests(data);
      }
      loadGuests();
    },[]);

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

    function selectGuest(guest) {
    setName(guest.fullName);
    setSelectedGuest(guest);
    setResults([]);
    loadParty(guest.partyIdentifier);
    loadExistingResponse(
    guest.partyIdentifier
  );
    }

    function loadParty(partyIdentifier) {
      const members = allGuests.filter(g => g.partyIdentifier === partyIdentifier);

      setPartyMembers(members);

      const initialStatus = {};
      members.forEach(m => {initialStatus[m.guestId] = null;
      });

      setRsvpStatus(initialStatus);
    }


    return(
        <>
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
                  </div>))}
                </div>)
        }
        </>
    );
}

export default RsvpPage;