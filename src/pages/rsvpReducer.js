// Reducer for the RSVP response: everything that ends up in responses/{partyIdentifier}.
//
// These values share one reducer because some rules cover more than one of them:
//  - A named extra guest is attending, so naming one also sets their rsvpStatus to "yes".
//  - An extra guest can't come without their host, so a host's "no" removes that host's extra
//    guests along with any answers keyed by them.
//  - Selecting, loading and resetting a party replace all of the values together.
// Each case below returns the next state in one step, so no render ever sees those rules half-applied.
//
// State shape:
//  selectedGuest       -> invitations doc of the guest who searched, or null
//  partyMembers        -> invitations docs sharing selectedGuest.partyIdentifier
//  additionalGuests    -> extra guests named by the party, one slot per allowedGuests
//                         { guestId: "<hostGuestId>-guest-<i>", fullName, isAdditionalGuest: true, hostGuestId }
//  rsvpStatus          -> { [guestId]: "yes" | "no" | null }
//  dietaryRequirements -> { [guestId]: string }
//  songRequests        -> { yes: [{ artist, title }], no: [{ artist, title }] }

export const initialRsvpState = {
  selectedGuest: null,
  partyMembers: [],
  additionalGuests: [],
  rsvpStatus: {},
  dietaryRequirements: {},
  songRequests: { yes: [], no: [] },
};

// Stable id for an extra-guest slot, so rsvpStatus/dietaryRequirements keys survive resubmits.
export function additionalGuestId(hostGuestId, index) {
  return `${hostGuestId}-guest-${index}`;
}

//:Doc Purpose
// Returns a copy of obj without the given keys. obj itself isn't changed.
function omitKeys(obj, keys) {
  const copy = { ...obj };
  for (const key of keys) {
    delete copy[key];
  }
  return copy;
}

//:Doc Purpose
// Clears the answers that are tied to the guest.
// EX: RSVP status and dietary requirements
function clearAnswers(state, guestIds) {
  return {
    ...state,
    rsvpStatus: omitKeys(state.rsvpStatus, guestIds),
    dietaryRequirements: omitKeys(state.dietaryRequirements, guestIds),
  };
}

//:Doc Purpose
// Removes additional guests and clears their answers in the same step.
// Use this instead of filtering additionalGuests directly, so answers for a removed guest are
// never left behind.
function removeAdditionalGuests(state, guestIds) {
  if (guestIds.length === 0) {
    return state;
  }
  return clearAnswers({
    ...state,
    additionalGuests: state.additionalGuests.filter(g => !guestIds.includes(g.guestId)),
  }, guestIds);
}


//:Doc Purpose
// Reducer function that handles the logic of different events 
export function rsvpReducer(state, action) {
  switch (action.type) {
    // partySelected
    // When:    a guest is picked from search, or a returning guest's party is restored from
    //          localStorage (both in RsvpPage).
    // Payload: { guest, members }. guest is the invitations doc picked; members are all invitations
    //          docs with the same partyIdentifier.
    // Changes: replaces the whole state. Every member starts with rsvpStatus null (unanswered);
    //          everything else is empty.
    // Why:     a new party must never inherit answers from the previous one. Saved answers arrive
    //          afterwards through responseLoaded.
    case "partySelected": {
      const rsvpStatus = {};
      for (const member of action.members) {
        rsvpStatus[member.guestId] = null;
      }
      return {
        ...initialRsvpState,
        selectedGuest: action.guest,
        partyMembers: action.members,
        rsvpStatus,
      };
    }

    // responseLoaded
    // When:    loadExistingResponse in RsvpPage finds a saved responses/{partyIdentifier} doc.
    // Payload: { partyIdentifier, data }. data is the responses doc.
    // Changes: rsvpStatus (saved answers merged over the nulls from partySelected),
    //          dietaryRequirements, songRequests, additionalGuests.
    // Why:     lets a returning guest edit their earlier RSVP instead of starting over.
    case "responseLoaded": {
      // The fetch is async. If the guest switched parties before it finished, ignore it.
      if (state.selectedGuest?.partyIdentifier !== action.partyIdentifier) {
        return state;
      }
      const data = action.data;
      return {
        ...state,
        rsvpStatus: { ...state.rsvpStatus, ...data.rsvpStatus },
        dietaryRequirements: data.dietaryRequirements || {},
        songRequests: data.songRequests || { yes: [], no: [] },
        // Extra guests only exist in responses, never in invitations.
        additionalGuests: (data.partyMembers || []).filter(m => m.isAdditionalGuest),
      };
    }

    // partyCleared
    // When:    "Change Guest" is clicked in RsvpPage.
    // Payload: none.
    // Changes: everything, back to initialRsvpState.
    case "partyCleared":
      return initialRsvpState;

    // guestStatusSet
    // When:    a Yes/No button is clicked for a party member in RsvpPage.
    // Payload: { guestId, status: "yes" | "no" }
    // Changes: sets rsvpStatus[guestId]. On "no", also removes this guest's extra guests and their
    //          rsvpStatus/dietaryRequirements entries.
    // Why:     an extra guest can't attend without their host.
    case "guestStatusSet": {
      const next = {
        ...state,
        rsvpStatus: { ...state.rsvpStatus, [action.guestId]: action.status },
      };
      if (action.status !== "no") {
        return next;
      }
      const hostsExtras = state.additionalGuests
        .filter(g => g.hostGuestId === action.guestId)
        .map(g => g.guestId);
      return removeAdditionalGuests(next, hostsExtras);
    }

    // additionalGuestNamed
    // When:    the text in an extra-guest name box changes in RsvpPage (on every keystroke).
    // Payload: { hostGuestId, index, name }. index is the slot number under that host,
    //          0..allowedGuests-1.
    // Changes: depends on the text:
    //          - empty:           the extra guest and their answers are removed
    //          - whitespace only: the slot is kept (so the box shows what was typed), answers are
    //                             cleared
    //          - a real name:     the slot is added or updated, and rsvpStatus is set to "yes"
    // Why:     a named extra guest is attending. There's no separate Yes/No button for them.
    case "additionalGuestNamed": {
      const guestId = additionalGuestId(action.hostGuestId, action.index);

      if (action.name === "") {
        return removeAdditionalGuests(state, [guestId]);
      }

      const guest = {
        guestId,
        fullName: action.name,
        isAdditionalGuest: true,
        hostGuestId: action.hostGuestId,
      };
      const next = {
        ...state,
        additionalGuests: state.additionalGuests.some(g => g.guestId === guestId)
          ? state.additionalGuests.map(g => (g.guestId === guestId ? guest : g))
          : [...state.additionalGuests, guest],
      };

      // Only whitespace typed so far: keep the text in the box, but they aren't attending yet.
      if (!action.name.trim()) {
        return clearAnswers(next, [guestId]);
      }
      return { ...next, rsvpStatus: { ...next.rsvpStatus, [guestId]: "yes" } };
    }

    // dietChanged
    // When:    the dietary text box changes on a DietPage (one page per attendee).
    // Payload: { guestId, value }
    // Changes: sets dietaryRequirements[guestId].
    case "dietChanged":
      return {
        ...state,
        dietaryRequirements: { ...state.dietaryRequirements, [action.guestId]: action.value },
      };

    // songAdded
    // When:    "Add Song" is clicked on SongPage. SongPage trims the text and skips an empty title
    //          before dispatching.
    // Payload: { list: "yes" | "no", song: { artist, title } }. "yes" means play, "no" means
    //          don't play.
    // Changes: appends the song to songRequests[list]. Songs belong to the party, not to a guest.
    case "songAdded":
      return {
        ...state,
        songRequests: {
          ...state.songRequests,
          [action.list]: [...state.songRequests[action.list], action.song],
        },
      };

    // songRemoved
    // When:    "Remove" is clicked next to a song on SongPage.
    // Payload: { list: "yes" | "no", index }. index is the song's position in that list.
    // Changes: removes that song from songRequests[list].
    case "songRemoved":
      return {
        ...state,
        songRequests: {
          ...state.songRequests,
          [action.list]: state.songRequests[action.list].filter((_, i) => i !== action.index),
        },
      };

    // A typo in an action type would otherwise be silently ignored. Throwing makes it fail loudly.
    default:
      throw new Error(`Unknown RSVP action: ${action.type}`);
  }
}
