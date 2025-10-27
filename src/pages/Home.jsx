// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
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
      
      {/* Ad Warning Banner */}
      <div className="mt-20 mb-2 px-4 md:px-8">
        <div className="w-full md:max-w-2xl mx-auto p-2 bg-bgColor/60 backdrop-blur-md border border-otherColor rounded-lg">
          <h2 className="text-center text-otherColor font-semibold mb-0.5">⚠️ Ads Enabled - Caution Site</h2>
          <p className="text-xs sm:text-sm text-secondaryTextColor text-center">
            This site uses ads to support server costs. Please consider disabling ad blockers to support us.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="col-span-1 lg:col-span-2">
          <HeroSlider
            movieData={heroPopularMovies}
            isMovieDataLoading={isHeroLoading}
            dataType="heroPopularMovies"
            sliderTypePrev="slideHeroTrendingMovies-prev"
            sliderTypeNext="slideHeroTrendingMovies-next"
          />
        </div>

        {/* Featured Movies Section */}
        <div className="mt-8">
          <HomeSections
            movieData={trendingMovies}
            isMovieDataLoading={isTrendingMoviesLoading}
            sectionTitle="Latest Movies"
            sectionSeeMoreButtonLink="/Movies"
            dataType="latestMovies"
          />
        </div>

        {/* Featured TV Shows Section */}
        <div className="mt-8">
          <HomeSections
            movieData={trendingTv}
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
