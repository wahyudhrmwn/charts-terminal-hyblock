'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamic import untuk komponen PlotlyChart2 karena menggunakan 'use client'
const PlotlyChart2 = dynamic(() => import("@/components/PlotlyChart2"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-[#1E2026] rounded-lg p-4 flex items-center justify-center text-[#848E9C] border border-[#2B3139]">
      <div className="flex flex-col items-center gap-2">
        <svg className="animate-spin h-8 w-8 text-[#F0B90B]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Loading chart...</span>
      </div>
    </div>
  )
});

const ChartContainer2 = () => {
  return <PlotlyChart2 />;
};

export default ChartContainer2; 