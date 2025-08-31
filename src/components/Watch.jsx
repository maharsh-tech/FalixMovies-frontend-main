import { AiOutlineClose } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import DPlayer from "dplayer";
// import "dplayer/dist/DPlayer.min.css"; // Removed to fix Vite build error. Add manually if needed.
import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function WatchTrailer(props) {
  const [sources, setSources] = useState([]);
  const [poster, setPoster] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const BASE = import.meta.env.VITE_BASE_URL;

  const playerRef = useRef(null);
  const dplayerInstance = useRef(null);
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

  useEffect(() => {
    if (isModalOpen && playerRef.current) {
      if (dplayerInstance.current) {
        dplayerInstance.current.destroy();
      }
      dplayerInstance.current = new DPlayer({
        container: playerRef.current,
        screenshot: true,
        video: {
          quality: sources.map((srcObj) => ({
            name: srcObj.size ? `${srcObj.size}p` : "Auto",
            url: srcObj.src,
            type: srcObj.type || "mp4",
          })),
          defaultQuality: 0,
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
            className="w-full max-w-4xl rounded-lg overflow-hidden shadow-lg relative"
          >
            <div ref={playerRef} id="player" style={{width: '100%', height: '100%'}} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
