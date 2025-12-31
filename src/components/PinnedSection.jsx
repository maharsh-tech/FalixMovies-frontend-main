import { React } from "react";
import MovieCard from "./MovieCard";
import MovieCardSkeleton from "./MovieCardSkeleton";
import { BsPin } from "react-icons/bs";

export default function PinnedSection({ pinnedData, isPinnedLoading }) {
  // Don't render anything if no pinned items and not loading
  if (!isPinnedLoading && (!pinnedData || pinnedData.length === 0)) {
    return null;
  }

  return (
    <>
      {/* Title */}
      <div className="mt-[2.5rem] flex items-center flex-wrap gap-3 text-primaryTextColor pb-[1.5rem] md:mt-[5rem]">
        <div className="pl-[1rem] border-l-2 border-primaryBtn">
          <p className="text-[0.8rem] uppercase font-bold sm:text-[1rem] flex items-center gap-2">
            <BsPin className="text-primaryBtn" />
            Pinned by Owner
          </p>
        </div>
      </div>

      {/* Pinned Movies/Series Grid */}
      <div className="">
        {!isPinnedLoading ? (
          <div className="relative">
            <div className="grid gap-x-2 gap-y-6 grid-cols-2 md:grid-cols-3 bsmmd:grid-cols-4 lg:grid-cols-5 blgxl:grid-cols-6 xl:grid-cols-7">
              {pinnedData.map((movie, index) => {
                return <MovieCard key={index} movie={movie} />;
              })}
            </div>
          </div>
        ) : (
          <>
            <MovieCardSkeleton />
          </>
        )}
      </div>
    </>
  );
}
