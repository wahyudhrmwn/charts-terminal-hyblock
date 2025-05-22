'use client';

import React, { useState } from "react";
import DropdownButton from "@/components/DropdownButton";
import ChartContainer from "@/components/ChartContainer";
import ChartContainer2 from "@/components/ChartContainer2";

export default function Home() {
  const [selectedCoin, setSelectedCoin] = useState("BTC");

  const handleCoinChange = (coin: string) => {
    setSelectedCoin(coin);
  };

  return (
    <main className="min-h-screen bg-[#0c0c0c] text-white">
      {/* Hero Section */}
      <div className="py-8 px-4 sm:px-8 min-h-screen">
        <div className="container mx-auto max-w-7xl"> 
          <div className="mb-4 flex flex-wrap items-center gap-4">
            <h1 className="text-2xl font-bold text-[#F0B90B]">Market Analysis</h1>
            <DropdownButton onCoinChange={handleCoinChange} initialCoin={selectedCoin} />
          </div>
          <div className="space-y-6">
            <ChartContainer selectedCoin={selectedCoin} />
            <ChartContainer2 selectedCoin={selectedCoin} />
          </div>
        </div>
      </div>
    </main>
  );
}
