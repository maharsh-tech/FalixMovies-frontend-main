// src/pages/Home.jsx
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import HeroSlider from "../components/HomeHero";
import HomeSections from "../components/HomeSections";
import SEO from "../components/SEO";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const BASE = import.meta.env.VITE_BASE_URL; // Base Url for backend
  const SITENAME = import.meta.env.VITE_SITENAME;

  // States
  const [heroPopularMovies, setHeroPopularMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTv, setTrendingTv] = useState([]);
  const [pinnedMedia, setPinnedMedia] = useState([]);
  const [isHeroLoading, setIsHeroLoading] = useState(true);
  const [isTrendingMoviesLoading, setIsTrendingMoviesLoading] = useState(true);
  const [isTrendingTvLoading, setIsTrendingTvLoading] = useState(true);

  useEffect(() => {
    setIsHeroLoading(true);
    window.scrollTo(0, 0);
    axios
      .get(`${BASE}/api/movies`, {
        params: {
          sort_by: "rating:desc",
          sort_by: "release_year:desc",
          page: 1,
          page_size: 10,
        },
      })
      .then((response) => {
        setHeroPopularMovies(response.data.movies);
        setIsHeroLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching hero popular movies:", error);
        setIsHeroLoading(false);
      });
  }, [BASE]);

  useEffect(() => {
    setIsTrendingMoviesLoading(true);
    axios
      .get(`${BASE}/api/movies`, {
        params: {
          sort_by: "updated_on:desc",
          page: 1,
          page_size: 20,
        },
      })
      .then((response) => {
        setTrendingMovies(response.data.movies);
        setIsTrendingMoviesLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching trending movies:", error);
        setIsTrendingMoviesLoading(false);
      });
  }, [BASE]);

  useEffect(() => {
    setIsTrendingTvLoading(true);
    axios
      .get(`${BASE}/api/tvshows`, {
        params: {
          sort_by: "updated_on:desc",
          page: 1,
          page_size: 20,
        },
      })
      .then((response) => {
        setTrendingTv(response.data.tv_shows);
        setIsTrendingTvLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching trending TV shows:", error);
        setIsTrendingTvLoading(false);
      });
  }, [BASE]);

  // Fetch pinned media
  useEffect(() => {
    axios
      .get(`${BASE}/api/pinned`)
      .then((response) => {
        setPinnedMedia(response.data);
      })
      .catch((error) => {
        console.error("Error fetching pinned media:", error);
      });
  }, [BASE]);

  // Merge pinned movies at the start of trending movies
  const moviesWithPinned = useMemo(() => {
    const pinnedMovies = pinnedMedia
      .filter((item) => item.media_type === "movie")
      .map((item) => ({ ...item, isPinned: true }));
    
    // Get pinned movie IDs to filter duplicates
    const pinnedIds = new Set(pinnedMovies.map((m) => m.tmdb_id));
    
    // Filter out pinned movies from trending to avoid duplicates
    const filteredTrending = trendingMovies.filter(
      (m) => !pinnedIds.has(m.tmdb_id)
    );
    
    return [...pinnedMovies, ...filteredTrending];
  }, [pinnedMedia, trendingMovies]);

  // Merge pinned TV shows at the start of trending TV
  const tvWithPinned = useMemo(() => {
    const pinnedTv = pinnedMedia
      .filter((item) => item.media_type === "tv")
      .map((item) => ({ ...item, isPinned: true }));
    
    // Get pinned TV IDs to filter duplicates
    const pinnedIds = new Set(pinnedTv.map((t) => t.tmdb_id));
    
    // Filter out pinned TV from trending to avoid duplicates
    const filteredTrending = trendingTv.filter(
      (t) => !pinnedIds.has(t.tmdb_id)
    );
    
    return [...pinnedTv, ...filteredTrending];
  }, [pinnedMedia, trendingTv]);

  return (
    <div>
      <ToastContainer style={{ fontSize: "0.8rem" }} />
      {/* SEO SECTION */}
      <SEO
        title={SITENAME}
        description={`Discover a world of entertainment where every show, movie, and exclusive content takes you on a journey beyond the screen. ${SITENAME} offers endless options for every mood, helping you relax, escape, and imagine more. Stream your favorites, dream big, and repeat the experience, only with ${SITENAME}.`}
        name={SITENAME}
        type="text/html"
        keywords="watch movies online, watch hd movies, watch full movies, streaming movies online, free streaming movie, watch movies free, watch hd movies online, watch series online, watch hd series free, free tv series, free movies online, tv online, tv links, tv links movies, free tv shows, watch tv shows online, watch tv shows online free, free hd movies"
        link={`https://${SITENAME}.com`}
      />
      
      {/* Main Content */}
      <div className="space-y-4">
        {/* Hero Section */}
        <div className="col-span-1 lg:col-span-2 -mt-1">
          <HeroSlider
            movieData={heroPopularMovies}
            isMovieDataLoading={isHeroLoading}
            dataType="heroPopularMovies"
            sliderTypePrev="slideHeroTrendingMovies-prev"
            sliderTypeNext="slideHeroTrendingMovies-next"
          />
        </div>

        {/* Featured Movies Section (with pinned at start) */}
        <div className="mt-8">
          <HomeSections
            movieData={moviesWithPinned}
            isMovieDataLoading={isTrendingMoviesLoading}
            sectionTitle="Latest Movies"
            sectionSeeMoreButtonLink="/Movies"
            dataType="latestMovies"
          />
        </div>

        {/* Featured TV Shows Section (with pinned at start) */}
        <div className="mt-8">
          <HomeSections
            movieData={tvWithPinned}
            isMovieDataLoading={isTrendingTvLoading}
            sectionTitle="Latest Series"
            sectionSeeMoreButtonLink="/Series"
            dataType="latestTv"
          />
        </div>
      </div>
    </div>
  );
}
