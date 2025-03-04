import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ShowTracker() {
  const [shows, setShows] = useState([]);
  const [newShow, setNewShow] = useState("");
  
  useEffect(() => {
    const savedShows = localStorage.getItem("showTracker");
    if (savedShows) {
      setShows(JSON.parse(savedShows));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("showTracker", JSON.stringify(shows));
  }, [shows]);

  const addShow = () => {
    if (newShow.trim() !== "") {
      setShows([...shows, { name: newShow, seasons: [] }]);
      setNewShow("");
    }
  };

  const addSeason = (showIndex) => {
    const episodeCount = parseInt(prompt("How many episodes are in this season?"), 10);
    if (!isNaN(episodeCount) && episodeCount > 0) {
      setShows((prevShows) => {
        const updatedShows = [...prevShows];
        updatedShows[showIndex] = {
          ...updatedShows[showIndex],
          seasons: [
            ...updatedShows[showIndex].seasons,
            { episodes: Array.from({ length: episodeCount }, () => ({ watched: false })), watched: 0 },
          ],
        };
        return updatedShows;
      });
    }
  };

  const toggleEpisode = (showIndex, seasonIndex, episodeIndex) => {
    setShows((prevShows) => {
      const updatedShows = [...prevShows];
      const season = updatedShows[showIndex].seasons[seasonIndex];
      season.episodes[episodeIndex].watched = !season.episodes[episodeIndex].watched;
      season.watched = season.episodes.filter((e) => e.watched).length;
      return updatedShows;
    });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">Show Tracker</h1>
      <div className="mb-6 flex justify-center">
        <input 
          type="text" 
          value={newShow} 
          onChange={(e) => setNewShow(e.target.value)} 
          placeholder="Enter show name" 
          className="p-2 border rounded-lg shadow-sm w-1/3 mr-2"
        />
        <Button onClick={addShow} className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md">Add Show</Button>
      </div>
      <div className="grid gap-6 max-w-3xl mx-auto">
        {shows.map((show, showIndex) => (
          <Card key={showIndex} className="bg-white p-4 rounded-lg shadow-lg">
            <CardContent>
              <h2 className="text-xl font-semibold mb-3">{show.name}</h2>
              <Button onClick={() => addSeason(showIndex)} className="bg-green-500 text-white px-3 py-1 rounded-md">Add Season</Button>
              <div className="mt-4 space-y-4">
                {show.seasons.map((season, seasonIndex) => (
                  <div key={seasonIndex} className="p-3 border rounded-lg bg-gray-50">
                    <h3 className="text-lg font-medium">Season {seasonIndex + 1} ({season.watched}/{season.episodes.length} watched)</h3>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {season.episodes.map((episode, episodeIndex) => (
                        <div key={episodeIndex} className="flex items-center gap-2 p-2 bg-white shadow rounded-md">
                          <input 
                            type="checkbox" 
                            checked={episode.watched} 
                            onChange={() => toggleEpisode(showIndex, seasonIndex, episodeIndex)}
                          />
                          <span>Episode {episodeIndex + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
