import {  useState } from "react"
import axios from "axios";

function SongPage({ props }) {

  const songRequests = props.songRequests;
  const setSongRequests = props.setSongRequests;

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

    setSongRequests(prev => ({
      ...prev,
      yes: [...prev.yes, newSong]
    }));

    setYesArtist("");
    setYesTitle("");
  }

  function addUnwantedSong() {

    if (!noTitle.trim()) return;

    const newSong = {
      artist: noArtist.trim(),
      title: noTitle.trim(),
    };

    setSongRequests(prev => ({
      ...prev,
      no: [...prev.no, newSong]
    }));

    setNoArtist("");
    setNoTitle("");
  }

  function removeWantedSong(index) {

    setSongRequests(prev => ({
      ...prev,
      yes: prev.yes.filter((_, i) => i !== index)
    }));
  }

  function removeUnwantedSong(index) {

    setSongRequests(prev => ({
      ...prev,
      no: prev.no.filter((_, i) => i !== index)
    }));
  }

  return (
    <div className="flex flex-col gap-8">

      {/* SONGS TO HEAR */}

      <div className="border p-4 rounded flex flex-col gap-3">

        <h2 className="text-xl font-semibold">
          Songs You Want To Hear
        </h2>

        <input
          type="text"
          placeholder="Artist"
          value={yesArtist}
          onChange={(e) =>
            setYesArtist(e.target.value)
          }
          className="border border-black p-2 text-black"
        />

        <input
          type="text"
          placeholder="Song Title"
          value={yesTitle}
          onChange={(e) =>
            setYesTitle(e.target.value)
          }
          className="border border-black p-2 text-black"
        />

        <button
          type="button"
          onClick={addWantedSong}
          className="border border-black px-3 py-2 bg-white text-black"
        >
          Add Song
        </button>

        <div className="flex flex-col gap-2">

          {songRequests.yes.map((song, index) => (
            <div
              key={index}
              className="flex justify-between border p-2 text-black"
            >
              <span>
                {song.artist} — {song.title}
              </span>

              <button
                type="button"
                className="text-black"
                onClick={() =>
                  removeWantedSong(index)
                }
              >
                Remove
              </button>
            </div>
          ))}

        </div>
      </div>

      {/* SONGS TO AVOID */}

      <div className="border p-4 rounded flex flex-col gap-3">

        <h2 className="text-xl font-semibold">
          Songs You DON'T Want To Hear
        </h2>

        <input
          type="text"
          placeholder="Artist"
          value={noArtist}
          onChange={(e) =>
            setNoArtist(e.target.value)
          }
          className="border border-black p-2 text-black"
        />

        <input
          type="text"
          placeholder="Song Title"
          value={noTitle}
          onChange={(e) =>
            setNoTitle(e.target.value)
          }
          className="border border-black p-2 text-black"
        />

        <button
          type="button"
          onClick={addUnwantedSong}
          className="border border-black px-3 py-2 bg-white text-black"
        >
          Add Song
        </button>

        <div className="flex flex-col gap-2">

          {songRequests.no.map((song, index) => (
            <div
              key={index}
              className="flex justify-between border p-2 text-black"
            >
              <span>
                {song.artist} — {song.title}
              </span>

              <button
                type="button"
                onClick={() =>
                  removeUnwantedSong(index)
                }
              >
                Remove
              </button>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}

export default SongPage;