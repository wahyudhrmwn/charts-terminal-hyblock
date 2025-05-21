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

const PlotlyChart2 = () => {
  // Dummy data untuk contoh
  const [data] = useState({
    time: Array.from({ length: 24 }, (_, i) =>
      new Date(2023, 0, 1, i).toISOString()
    ),
    whaleRetailDelta: Array.from(
      { length: 24 },
      () => Math.random() * 800 - 400
    ),
    trueRetailLongPct: Array.from(
      { length: 24 },
      () => Math.random() * 40 + 30
    ),
    trueRetailShortPct: Array.from(
      { length: 24 },
      () => Math.random() * 40 + 30
    ),
    topTraderLongPct: Array.from({ length: 24 }, () => Math.random() * 30 + 50),
    topTraderShortPct: Array.from(
      { length: 24 },
      () => Math.random() * 30 + 50
    ),
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
          // Whale vs Retail Delta (sumbu Y kiri)
          {
            x: data.time,
            y: data.whaleRetailDelta,
            type: "scatter",
            mode: "lines",
            name: "Whale vs Retail Delta",
            line: { color: "#F0B90B", width: 2 },
            yaxis: "y",
            fill: "tozeroy",
            fillcolor: "rgba(240, 185, 11, 0.1)",
          },
          // True Retail Long Percentage (sumbu Y kanan)
          {
            x: data.time,
            y: data.trueRetailLongPct,
            type: "scatter",
            mode: "lines",
            name: "True Retail Long %",
            line: { color: "#2EBD85", width: 2, dash: "solid" },
            yaxis: "y2",
          },
          // True Retail Short Percentage (sumbu Y kanan)
          {
            x: data.time,
            y: data.trueRetailShortPct,
            type: "scatter",
            mode: "lines",
            name: "True Retail Short %",
            line: { color: "#F6465D", width: 2, dash: "solid" },
            yaxis: "y2",
          },
          // Top Trader Long Percentage (sumbu Y kanan)
          {
            x: data.time,
            y: data.topTraderLongPct,
            type: "scatter",
            mode: "lines",
            name: "Top Trader Long %",
            line: { color: "#1E88E5", width: 2, dash: "dot" },
            yaxis: "y2",
          },
          // Top Trader Short Percentage (sumbu Y kanan)
          {
            x: data.time,
            y: data.topTraderShortPct,
            type: "scatter",
            mode: "lines",
            name: "Top Trader Short %",
            line: { color: "#9C27B0", width: 2, dash: "dot" },
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
            title: {
              text: "Whale vs Retail Delta - Binance",
              font: { color: "#848E9C" },
            },
            titlefont: { color: "#F0B90B" },
            tickfont: { color: "#848E9C" },
            side: "left",
            showgrid: true,
            gridcolor: "rgba(43, 49, 57, 0.8)",
            linecolor: "#2B3139",
            zeroline: true,
            zerolinecolor: "rgba(240, 185, 11, 0.5)",
            zerolinewidth: 1,
          },
          yaxis2: {
            title: {
              text: "Position Percentage - Binance",
              font: { color: "#848E9C" },
            },
            titlefont: { color: "#848E9C" },
            tickfont: { color: "#848E9C" },
            ticksuffix: "%",
            overlaying: "y",
            side: "right",
            showgrid: false,
            zeroline: false,
            linecolor: "#2B3139",
            range: [0, 100], // Percentage range 0-100%
          },
          legend: {
            orientation: "h",
            y: 1.12,
            x: 0.5,
            xanchor: "center",
            font: { color: "#EAECEF" },
            bgcolor: "rgba(0,0,0,0)",
          },
          plot_bgcolor: "#1E2026",
          paper_bgcolor: "#1E2026",
          hovermode: "x unified",
          annotations: [
            {
              text: "Binance Data",
              font: {
                size: 10,
                color: "#848E9C",
              },
              showarrow: false,
              x: 1,
              y: 1.05,
              xref: "paper",
              yref: "paper",
              xanchor: "right",
              yanchor: "bottom",
            },
          ],
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

export default PlotlyChart2;
