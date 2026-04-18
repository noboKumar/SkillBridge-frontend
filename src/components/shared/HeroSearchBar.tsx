"use client";

import { Button } from "../ui/button";
import { Search, X, Star, Clock } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { axiosInstance } from "@/lib/axios";
import Link from "next/link";
import Image from "next/image";

interface Tutor {
  id: string;
  user: {
    id: string;
    name: string;
    profilePhoto: string;
  };
  category: {
    id: string;
    name: string;
  };
  hourlyRate: number;
  ratingAverage: number;
  totalReview: number;
  experienceYears: number;
}

const HeroSearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  // const [tutors, setTutors] = useState<Tutor[]>([]);
  const [filteredTutors, setFilteredTutors] = useState<Tutor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [allTutors, setAllTutors] = useState<Tutor[]>([]);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  // Fetch all tutors on component mount
  useEffect(() => {
    fetchAllTutors();
  }, []);

  // Handle clicking outside the search box
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function fetchAllTutors() {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/tutors");
      const tutorsData = response.data?.data || response.data || [];
      setAllTutors(tutorsData);
      // setTutors(tutorsData);
    } catch (error) {
      console.error("Error fetching tutors:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSearch(query: string) {
    setSearchQuery(query);

    if (query.trim().length === 0) {
      setFilteredTutors(allTutors);
      setShowResults(true);
      return;
    }

    const results = allTutors.filter((tutor) => {
      const searchLower = query.toLowerCase();
      return (
        tutor?.user?.name?.toLowerCase().includes(searchLower) ||
        tutor?.category?.name?.toLowerCase().includes(searchLower)
      );
    });

    setFilteredTutors(results);
    setShowResults(true);
  }

  function handleSearch_Button() {
    if (searchQuery.trim().length === 0) {
      setFilteredTutors(allTutors);
    }
    setShowResults(!showResults);
  }

  const displayTutors = filteredTutors.length > 0 ? filteredTutors : allTutors;

  return (
    <div
      className="w-full flex items-center justify-center gap-4 relative"
      ref={searchBoxRef}
    >
      <div className="relative w-full max-w-xl">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-20" />
        <input
          className="border-2 border-slate-300 w-full rounded-2xl p-3 pl-12 pr-4 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-300"
          type="text"
          placeholder="Search Teacher by name or subject..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setShowResults(true)}
        />

        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery("");
              setFilteredTutors(allTutors);
            }}
            className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <Button onClick={handleSearch_Button} className="px-8" size={"lg"}>
        Search
      </Button>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white border-2 border-slate-200 rounded-2xl shadow-2xl max-h-150 overflow-y-auto z-50">
          {/* Header */}
          <div className="sticky top-0 bg-linear-to-r from-sky-50 to-blue-50 px-6 py-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  {searchQuery ? "Search Results" : "All Tutors"}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Found {displayTutors.length} tutor
                  {displayTutors.length !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                onClick={() => setShowResults(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Results List */}
          <div className="divide-y divide-slate-100">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
              </div>
            ) : displayTutors.length === 0 ? (
              <div className="py-12 px-6 text-center">
                <Search size={32} className="mx-auto text-gray-300 mb-3" />
                <p className="text-slate-500 font-medium">No tutors found</p>
                <p className="text-slate-400 text-sm mt-1">
                  Try searching with different keywords
                </p>
              </div>
            ) : (
              displayTutors.slice(0, 8).map((tutor) => (
                <Link key={tutor.id} href={`/tutors/${tutor.id}`}>
                  <div className="px-6 py-4 hover:bg-slate-50 transition-colors duration-200 cursor-pointer group">
                    <div className="flex gap-4 items-start">
                      {/* Tutor Image */}
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 border-slate-200 group-hover:border-sky-300 transition-colors">
                        <Image
                          src={tutor?.user?.profilePhoto}
                          alt={tutor?.user?.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Tutor Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <h4 className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                              {tutor?.user?.name}
                            </h4>
                            <p className="text-sm text-sky-600 font-semibold">
                              {tutor?.category?.name}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xl font-black text-slate-900">
                              ${tutor?.hourlyRate}
                              <span className="text-xs text-slate-500 font-normal">
                                /hr
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-4 text-xs text-slate-600">
                          {/* Rating */}
                          <div className="flex items-center gap-1.5">
                            <div className="flex items-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={12}
                                  className={`${
                                    i < Math.floor(tutor?.ratingAverage)
                                      ? "fill-amber-400 text-amber-400"
                                      : "fill-slate-200 text-slate-200"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="font-semibold text-slate-900">
                              {tutor?.ratingAverage}
                            </span>
                            <span className="text-slate-400">
                              ({tutor?.totalReview})
                            </span>
                          </div>

                          {/* Experience */}
                          <div className="flex items-center gap-1">
                            <Clock size={12} className="text-sky-500" />
                            <span>
                              {tutor?.experienceYears} yr
                              {tutor?.experienceYears !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Arrow Icon */}
                      <div className="text-slate-400 group-hover:text-sky-600 transition-colors shrink-0 mt-1">
                        <svg
                          className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Footer */}
          {displayTutors.length > 8 && (
            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-3 text-center">
              <Link href="/tutors">
                <button className="text-sky-600 font-semibold hover:text-sky-700 transition-colors text-sm">
                  View all {displayTutors.length} tutors →
                </button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HeroSearchBar;
