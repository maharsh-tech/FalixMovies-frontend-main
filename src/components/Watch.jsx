import { AiOutlineClose } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";
import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function WatchTrailer(props) {
  const [sources, setSources] = useState([]);
  const [poster, setPoster] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const BASE = import.meta.env.VITE_BASE_URL;

  const playerRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      if (props.isWatchMoviePopupOpen || props.isWatchEpisodePopupOpen) {
        try {
          let videoSources = [];
          let selectedPoster = "";

          if (props.popUpType === "movie") {
            videoSources = props.id.telegram.map((q) => ({
              src: `${BASE}/dl/${q.id}/${q.name}`,
              type: "video/mp4",
              size: parseInt(q.quality.replace("p", ""), 10),
            }));
            selectedPoster = props.id.backdrop;
          } else if (props.popUpType === "episode") {
            const season = props.id.seasons.find(
              (season) => season.season_number === props.seasonNumber
            );

            if (season) {
              const episode = season.episodes.find(
                (ep) => ep.episode_number === props.episodeNumber
              );

              if (episode) {
                videoSources = episode.telegram.map((q) => ({
                  src: `${BASE}/dl/${q.id}/${q.name}`,
                  type: "video/mp4",
                  size: parseInt(q.quality.replace("p", ""), 10),
                }));
                selectedPoster = episode.episode_backdrop;
              }
            }
          }

          setSources(videoSources);
          setPoster(selectedPoster);
          setIsModalOpen(true);
        } catch (error) {
          console.error("Error processing data:", error);
        }
      }
    };

    fetchData();
  }, [
    props.isWatchMoviePopupOpen,
    props.isWatchEpisodePopupOpen,
    props.popUpType,
    props.id,
    props.seasonNumber,
    props.episodeNumber,
    BASE,
  ]);

  const closeModal = () => {
    setIsModalOpen(false);
    if (props.popUpType === "trailer") {
      props.setIsTrailerPopupOpen(false);
    } else if (props.popUpType === "movie") {
      props.setIsWatchMoviePopupOpen(false);
    } else {
      props.setIsWatchEpisodePopupOpen(false);
    }
  };

<<<<<<< HEAD
  useEffect(() => {
    if (isModalOpen && playerRef.current) {
      if (dplayerInstance.current) {
        dplayerInstance.current.destroy();
      }
      dplayerInstance.current = new DPlayer({
        container: playerRef.current,
        screenshot: true,
        video: {
          url: sources[0]?.src || "",
          pic: poster,
          type: "auto",
        },
      });
    }
    return () => {
      if (dplayerInstance.current) {
        dplayerInstance.current.destroy();
        dplayerInstance.current = null;
      }
    };
  }, [isModalOpen, sources, poster]);
=======
  const plyrProps = {
    source: {
      type: "video",
      sources: sources,
    },
    options: {
      poster: poster,
      settings: ["captions", "quality", "speed"],
      controls: [
        "play-large",
        "play",
        "progress",
        "current-time",
        "mute",
        "volume",
        "captions",
        "settings",
        "fullscreen",
      ],
    },
  };
>>>>>>> upstream/main

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-30 w-full h-screen bg-black/90 backdrop-blur-md flex items-center justify-center"
        >
          <button
            onClick={closeModal}
            className="absolute top-5 right-5 text-white text-2xl z-50"
          >
            <AiOutlineClose />
          </button>

          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
<<<<<<< HEAD
            className="w-full max-w-4xl rounded-lg overflow-hidden shadow-lg relative flex flex-col items-center"
          >
            <div
              ref={playerRef}
              id="player"
              style={{
                width: '100%',
                height: '100%',
                maxWidth: '100vw',
                maxHeight: '60vh',
                borderRadius: '16px',
                background: '#181818',
              }}
              className="sm:max-w-4xl sm:max-h-[70vh] w-full h-[40vh] md:h-[60vh]"
            />
            {isModalOpen && (
              <div className="mt-4 flex items-center justify-center">
                <span className="text-yellow-400 text-lg mr-2">⚠️</span>
                <span className="text-sm text-red-400 font-semibold">If Facing Audio Issues? Use VLC Media Player for best playback compatibility.</span>
              </div>
            )}
=======
            className="w-full max-w-4xl rounded-lg overflow-hidden shadow-lg relative"
          >
            <Plyr ref={playerRef} {...plyrProps} id="player" />
>>>>>>> upstream/main
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
