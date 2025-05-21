import React from "react";
import DropdownButton from "@/components/DropdownButton";
import ChartContainer from "@/components/ChartContainer";
import ChartContainer2 from "@/components/ChartContainer2";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0c0c0c] text-white">
      {/* Hero Section */}
      <div className="py-8 px-4 sm:px-8 min-h-screen">
        <div className="container mx-auto max-w-7xl"> 
          <div className="mb-4 flex flex-wrap items-center gap-4">
            <h1 className="text-2xl font-bold text-[#F0B90B]">Market Analysis</h1>
            <DropdownButton />
            <div className="flex space-x-2 ml-auto">
              <Link 
                href="/volume-delta" 
                className="px-4 py-2 bg-[#2B3139] text-[#F0B90B] rounded-md hover:bg-[#363f4a] transition-colors"
              >
                Volume Delta
              </Link>
            </div>
          </div>
          <div className="space-y-6">
            <ChartContainer />
            <ChartContainer2 />
          </div>
        </div>
      </div>
    </main>
  );
}
