import { CareerMapGame } from "@/components/career-map-game";
import React from "react";

export default function CareerMapPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold text-center mb-8">
        Welcome to CareerMap
      </h1>
      <p className="text-center mb-8">
        Discover your potential career path with our free CareerMap game!
      </p>
      <CareerMapGame />
    </div>
  );
}
