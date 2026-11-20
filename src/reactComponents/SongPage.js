import {  useState } from "react"

function SongPage({ props }) {

  const songRequests = props.songRequests;
  const dispatch = props.dispatch;

  const [yesArtist, setYesArtist] = useState("");
  const [yesTitle, setYesTitle] = useState("");

  const [noArtist, setNoArtist] = useState("");
  const [noTitle, setNoTitle] = useState("");


  function addWantedSong() {

    if (!yesTitle.trim()) return;

    const newSong = {
      artist: yesArtist.trim(),
      title: yesTitle.trim(),
    };

    dispatch({ type: "songAdded", list: "yes", song: newSong });

    setYesArtist("");
    setYesTitle("");
  }

  function addUnwantedSong() {

    if (!noTitle.trim()) return;

    const newSong = {
      artist: noArtist.trim(),
      title: noTitle.trim(),
    };

    dispatch({ type: "songAdded", list: "no", song: newSong });

    setNoArtist("");
    setNoTitle("");
  }

  function removeWantedSong(index) {

    dispatch({ type: "songRemoved", list: "yes", index });
  }

  function removeUnwantedSong(index) {

    dispatch({ type: "songRemoved", list: "no", index });
  }

  return (
    <div className="flex flex-col gap-8">

      {/* SONGS TO HEAR */}
      <SongEntryBox props={{"topText": "Songs You Want To Hear",
        "artist": yesArtist,
        "setArtist": setYesArtist,
        "title": yesTitle,
        "setTitle": setYesTitle,
        "addSong": addWantedSong,
        "remSong": removeWantedSong,
        "songReq": songRequests.yes
      }}></SongEntryBox>

      <SongEntryBox props={{"topText": "Songs you DON'T Want To Hear",
      "artist": noArtist,
      "setArtist": setNoArtist,
      "title": noTitle,
      "setTitle": setNoTitle,
      "addSong": addUnwantedSong,
      "remSong": removeUnwantedSong,
      "songReq": songRequests.no
      }}></SongEntryBox>
    </div>
  );
}

function SongEntryBox({props}){
  return(<div className="p-3 rounded-lg flex flex-col gap-3 shadow-sm">
        
        <h2 className="text-xl font-semibold">
          {props.topText}
        </h2>

        <input
          type="text"
          placeholder="Artist"
          value={props.artist}
          onChange={(e) =>
            props.setArtist(e.target.value)
          }
          className="border border-black p-2 text-black"
        />

        <input
          type="text"
          placeholder="Song Title"
          value={props.title}
          onChange={(e) =>
            props.setTitle(e.target.value)
          }
          className="border border-black p-2 text-black"
        />

        <button
          type="button"
          onClick={props.addSong}
          className="border border-black px-3 py-2 bg-white text-black"
        >
          Add Song
        </button>
        <div className="flex flex-col gap-2">

          {props.songReq.map((song, index) => (
            <div key={index} className="flex items-center justify-between
            border rounded-md bg-white text-black overflow-hidden">
          
            <span className="flex-1">{song.artist} — {song.title}</span>

            <div className="w-px self-stretch bg-gray-300" />

            

            <button type="button" onClick={() => props.remSong(index)} 
            className="px-3 py-1 mr-2 rounded border border-black text-black hover:bg-red-50 transition">
              Remove
            </button>
</div>
          ))}

        </div>
      </div>)
}

export default SongPage;