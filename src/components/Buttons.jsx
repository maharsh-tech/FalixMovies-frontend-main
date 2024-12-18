import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Select, SelectItem } from "@nextui-org/select";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import { Button } from "@nextui-org/button";
import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FaCloudDownloadAlt, FaPlay } from "react-icons/fa";
import Spinner from "./svg/Spinner";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DownloadButton = ({ movieData, btnType }) => {
  const BASE = import.meta.env.VITE_BASE_URL;
  const API_URL = import.meta.env.VITE_API_URL;
  const API_KEY = import.meta.env.VITE_API_KEY;
  const TOKEN_SYSTEM = import.meta.env.VITE_TOKEN_SYSTEM;

  const [selectedSeason, setSelectedSeason] = useState("");
  const [selectedEpisode, setSelectedEpisode] = useState("");
  const [selectedQuality, setSelectedQuality] = useState("");
  const [episodes, setEpisodes] = useState([]);
  const [qualities, setQualities] = useState([]);
  const [loading, setLoading] = useState({});
  const [shortenedUrls, setShortenedUrls] = useState({});
  const [player, setPlayer] = useState(null);
  useEffect(() => {
    if (selectedSeason) {
      const season = movieData.seasons.find(
        (s) => s.season_number === parseInt(selectedSeason)
      );
      if (season) {
        setEpisodes(season.episodes);
        setSelectedEpisode("");
        setQualities([]);
      }
    }
  }, [selectedSeason, movieData.seasons]);

  useEffect(() => {
    if (selectedEpisode) {
      const episode = episodes.find(
        (e) => e.episode_number === parseInt(selectedEpisode)
      );
      if (episode) {
        setQualities(episode.telegram);
        setSelectedQuality("");
      }
    }
  }, [selectedEpisode, episodes]);

  const handleSeasonChange = (e) => setSelectedSeason(e.target.value);
  const handleEpisodeChange = (e) => setSelectedEpisode(e.target.value);
  const handleQualityChange = (e) => setSelectedQuality(e.target.value);

  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  const fullUrl = window.location.href;
  const url = new URL(fullUrl);
  const domain = url.origin;

  const generateToken = () => uuidv4();

  const verifyTokenTimeStamp = async (userId) => {
    try {
      const docSnap = await getDoc(doc(db, "tokens", userId));
      if (docSnap.exists()) {
        const now = new Date();
        const { expiresAt } = docSnap.data();
        if (expiresAt && new Date(expiresAt) > now) return true;
        toast.info("Token is expired. Generating a new token.");
      } else {
        toast.info("No token found, generating a new one...");
      }
    } catch (error) {
      console.error("Error verifying token:", error);
    }
    return false;
  };

  const shortenUrl = async (url) => {
    try {
      const { data } = await axios.get(API_URL, {
        params: { api: API_KEY, url, format: "json" },
      });
      return data.shortenedUrl || url;
    } catch (error) {
      console.error("Error shortening URL:", error);
      return url;
    }
  };

  const getPlayer = async (userId) => {
    try {
      const docSnap = await getDoc(doc(db, "Users", userId));
      if (docSnap.exists()) {
        return docSnap.data().player;
      } else {
        console.error("No player found for user.");
      }
    } catch (error) {
      console.error("Error verifying player:", error);
    }
    return null;
  };

  const handleButtonClick = async (originalUrl, quality) => {
    setLoading((prevState) => ({ ...prevState, [quality]: true }));
    let finalUrl = originalUrl;

    try {
      if (TOKEN_SYSTEM === "true") {
        if (!(await verifyTokenTimeStamp(userId))) {
          const token = generateToken();
          await setDoc(doc(db, "tokens", userId), { token });
          const tokenUrl = `${domain}/token/${token}`;
          finalUrl = await shortenUrl(tokenUrl);
        }
      } else {
        finalUrl = await shortenUrl(originalUrl);
      }

      setShortenedUrls((prev) => ({ ...prev, [originalUrl]: finalUrl }));
    } catch (error) {
      console.error("Error processing URL:", error);
    } finally {
      setLoading((prev) => ({ ...prev, [quality]: false }));
      window.open(finalUrl, "_blank", "noopener noreferrer");
    }
  };

  const generateOriginalUrl = (qualityDetail, encodedName, player) => {
    if (btnType === "Download") {
      return `${BASE}/dl/${qualityDetail.id}/${encodedName}`;
    } else if (player === "MX Player (free)") {
      return `intent:${BASE}/dl/${qualityDetail.id}/${encodedName}#Intent;package=com.mxtech.videoplayer.ad;end`;
    } else if (player === "MX Player (paid)") {
      return `intent:${BASE}/dl/${qualityDetail.id}/${encodedName}#Intent;package=com.mxtech.videoplayer.pro;end`;
    } else {
      return `vlc://${BASE}/dl/${qualityDetail.id}/${encodedName}`;
    }
  };

  const getDownloadLink = async () => {
    if (selectedQuality) {
      const qualityDetail = qualities.find(
        (q) => q.quality === selectedQuality
      );

      if (qualityDetail) {
        const encodedName = encodeURIComponent(qualityDetail.name);
        const player = await getPlayer(userId);
        return generateOriginalUrl(qualityDetail, encodedName, player);
      }
    }
    return "#";
  };
  useEffect(() => {
    const fetchPlayer = async () => {
      const fetchedPlayer = await getPlayer(userId);
      setPlayer(fetchedPlayer);
    };
    fetchPlayer();
  }, [userId]);

  const getDownloadLinkMovie = async (qualityDetail) => {
    if (qualityDetail) {
      const encodedName = encodeURIComponent(qualityDetail.name);
      const player = await getPlayer(userId);
      return generateOriginalUrl(qualityDetail, encodedName, player);
    }
  };

  return (
    <Popover placement="bottom" showArrow={true}>
      <PopoverTrigger>
        <button className="flex justify-center items-center gap-2 uppercase text-otherColor max-w-full grow text-xs rounded-full border-2 border-otherColor py-1 px-3 lg:text-sm sm:px-5 sm:max-w-[15rem] sm:py-2">
          {btnType === "Download" ? (
            <>
              <FaCloudDownloadAlt className="text-lg" /> Download
            </>
          ) : (
            <>
              <FaPlay className="text-lg" /> {player || "Loading..."}
            </>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="bg-btnColor">
        {movieData.media_type === "movie" ? (
          <div className="px-1 py-2 flex gap-1 flex-wrap">
            {movieData.telegram?.map((qualityDetail, index) => {
              const isLoading = loading[qualityDetail.quality];

              return (
                <Button
                  key={index}
                  onClick={async () => {
                    const downloadLink = await getDownloadLinkMovie(
                      qualityDetail
                    );
                    handleButtonClick(downloadLink, qualityDetail.quality);
                  }}
                  size="sm"
                  className="bg-primaryBtn rounded-full"
                  isLoading={isLoading}
                  spinner={<Spinner />}
                >
                  {qualityDetail.quality}
                </Button>
              );
            })}
          </div>
        ) : (
          <div className="px-1 py-2 flex flex-col gap-2">
            <Select
              isRequired
              variant="bordered"
              aria-label="Select season"
              placeholder="Select season"
              className="w-40 mb-2"
              onChange={handleSeasonChange}
              value={selectedSeason}
            >
              {movieData.seasons
                .sort((a, b) => a.season_number - b.season_number)
                .map((season) => (
                  <SelectItem
                    key={season.season_number}
                    value={season.season_number}
                    textValue={`Season ${season.season_number}`}
                  >
                    Season {season.season_number}
                  </SelectItem>
                ))}
            </Select>
            <Select
              isRequired
              variant="bordered"
              aria-label="Select episode"
              placeholder="Select episode"
              className="w-40 mb-2"
              onChange={handleEpisodeChange}
              value={selectedEpisode}
              disabled={!selectedSeason}
            >
              {episodes
                .sort((a, b) => a.episode_number - b.episode_number)
                .map((episode) => (
                  <SelectItem
                    key={episode.episode_number}
                    value={episode.episode_number}
                    textValue={`Episode ${episode.episode_number}`}
                  >
                    {`Episode ${episode.episode_number}`}
                  </SelectItem>
                ))}
            </Select>
            <Select
              isRequired
              variant="bordered"
              aria-label="Select quality"
              placeholder="Select quality"
              className="w-40 mb-2"
              onChange={handleQualityChange}
              value={selectedQuality}
              disabled={!selectedEpisode}
            >
              {qualities?.map((qualityDetail) => (
                <SelectItem
                  key={qualityDetail.quality}
                  value={qualityDetail.quality}
                  textValue={qualityDetail.quality}
                >
                  {qualityDetail.quality}
                </SelectItem>
              ))}
            </Select>
            <Button
              onClick={async () => {
                const downloadLink = await getDownloadLink();
                handleButtonClick(downloadLink, selectedQuality);
              }}
              size="sm"
              className="bg-primaryBtn rounded-full"
              disabled={!selectedQuality}
            >
              {btnType === "Download" ? "Download" : "Open in Player"}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default DownloadButton;
