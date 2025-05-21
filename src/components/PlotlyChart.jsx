"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

// Menggunakan dynamic import untuk plotly karena isu SSR
const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      Loading chart...
    </div>
  ),
});

const PlotlyChart = () => {
  // Dummy data untuk contoh
  const [data] = useState({
    time: Array.from({ length: 24 }, (_, i) =>
      new Date(2023, 0, 1, i).toISOString()
    ),
    price: Array.from({ length: 24 }, () => Math.random() * 30000 + 40000), // BTC price range
    oiDelta: Array.from({ length: 24 }, () => Math.random() * 200 - 100),
    volDelta: Array.from({ length: 24 }, () => Math.random() * 300 - 150),
  });

  if (typeof window === "undefined") {
    return (
      <div className="w-full h-[500px] bg-[#1E2026] rounded-lg p-4 flex items-center justify-center text-white">
        Loading chart...
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] bg-[#1E2026] rounded-lg p-4 border border-[#2B3139]">
      <Plot
        data={[
          // Price Line (sumbu Y kiri)
          {
            x: data.time,
            y: data.price,
            type: "scatter",
            mode: "lines",
            name: "Price",
            line: { color: "#F0B90B", width: 2 },
            yaxis: "y",
          },
          // OI Delta (sumbu Y kanan)
          {
            x: data.time,
            y: data.oiDelta,
            type: "scatter",
            mode: "lines",
            name: "OI Delta",
            line: { color: "#58B589", width: 2, dash: "solid" },
            yaxis: "y2",
          },
          // Vol Delta (sumbu Y kanan)
          {
            x: data.time,
            y: data.volDelta,
            type: "scatter",
            mode: "lines",
            name: "Vol Delta",
            line: { color: "#C45A5A", width: 2, dash: "dot" },
            yaxis: "y2",
          },
        ]}
        layout={{
          autosize: true,
          margin: { l: 50, r: 50, t: 30, b: 50 },
          xaxis: {
            title: { text: "Time", font: { color: "#848E9C" } },
            tickformat: "%H:%M",
            showgrid: true,
            gridcolor: "rgba(43, 49, 57, 0.8)",
            tickfont: { color: "#848E9C" },
            linecolor: "#2B3139",
          },
          yaxis: {
            title: { text: "Price (USD)", font: { color: "#848E9C" } },
            titlefont: { color: "#F0B90B" },
            tickfont: { color: "#848E9C" },
            side: "left",
            showgrid: true,
            gridcolor: "rgba(43, 49, 57, 0.8)",
            linecolor: "#2B3139",
          },
          yaxis2: {
            title: { text: "OI Delta / Vol Delta", font: { color: "#848E9C" } },
            titlefont: { color: "#848E9C" },
            tickfont: { color: "#848E9C" },
            overlaying: "y",
            side: "right",
            showgrid: false,
            zeroline: true,
            zerolinecolor: "rgba(43, 49, 57, 0.8)",
            linecolor: "#2B3139",
          },
          legend: {
            orientation: "h",
            y: 1.1,
            x: 0.5,
            xanchor: "center",
            font: { color: "#EAECEF" },
            bgcolor: "rgba(0,0,0,0)",
          },
          plot_bgcolor: "#1E2026",
          paper_bgcolor: "#1E2026",
          hovermode: "x unified",
        }}
        config={{
          responsive: true,
          displayModeBar: false,
          staticPlot: false,
          scrollZoom: false,
        }}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default PlotlyChart;
