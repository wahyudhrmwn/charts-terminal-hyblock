"use client";

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { getWhaleRetailDelta, getTrueRetailLongShort, getTopTraderLongShort } from "../services/api/hyblock";
import { useToken } from "@/context/TokenContext";

// Menggunakan dynamic import untuk plotly karena isu SSR
const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      Loading chart...
    </div>
  ),
});

const PlotlyChart2 = ({ coin = "BTC", timeframe = "1d" }) => {
  const [whaleRetailData, setWhaleRetailData] = useState([]);
  const [trueRetailData, setTrueRetailData] = useState([]);
  const [topTraderData, setTopTraderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, isLoading: tokenLoading, error: tokenError, refreshToken } = useToken();

  // Fungsi untuk memproses data Whale Retail Delta
  const processWhaleRetailData = useCallback((rawData) => {
    if (!rawData.data || !Array.isArray(rawData.data) || rawData.data.length === 0) {
      return [];
    }

    try {      
      // Memastikan data dalam format yang benar
      const validatedData = rawData.data.filter(item => 
        item && typeof item === 'object' && 
        'openDate' in item && 'whaleRetailDelta' in item
      );
      
      if (validatedData.length === 0) {
        console.error("Tidak ada data Whale Retail Delta valid setelah validasi");
        return [];
      }
      
      // Memperbaiki format openDate jika diperlukan
      const processedData = validatedData.map(item => {
        // Salin data item
        const newItem = { ...item };
        
        // Periksa format timestamp (dalam detik atau milidetik)
        const openDateStr = String(newItem.openDate);
        if (openDateStr.length <= 10) {
          newItem.openDate = newItem.openDate * 1000;
        }
        
        return newItem;
      });
      
      // Urutkan data
      return [...processedData].sort((a, b) => a.openDate - b.openDate);
    } catch (err) {
      console.error("Error memproses data Whale Retail Delta:", err);
      return [];
    }
  }, []);

  // Fungsi untuk memproses data True Retail Long Short
  const processTrueRetailData = useCallback((rawData) => {
    if (!rawData.data || !Array.isArray(rawData.data) || rawData.data.length === 0) {
      return [];
    }

    try {
      
      // Memastikan data dalam format yang benar
      const validatedData = rawData.data.filter(item => 
        item && typeof item === 'object' && 
        'openDate' in item && 'longPct' in item && 'shortPct' in item
      );
      
      if (validatedData.length === 0) {
        console.error("Tidak ada data True Retail Long Short valid setelah validasi");
        return [];
      }
      
      // Memperbaiki format openDate jika diperlukan
      const processedData = validatedData.map(item => {
        // Salin data item
        const newItem = { ...item };
        
        // Periksa format timestamp (dalam detik atau milidetik)
        const openDateStr = String(newItem.openDate);
        if (openDateStr.length <= 10) {
          newItem.openDate = newItem.openDate * 1000;
        }
        
        return newItem;
      });
      
      
      // Urutkan data
      return [...processedData].sort((a, b) => a.openDate - b.openDate);
    } catch (err) {
      console.error("Error memproses data True Retail Long Short:", err);
      return [];
    }
  }, []);

  // Fungsi untuk memproses data Top Trader Long Short
  const processTopTraderData = useCallback((rawData) => {
    if (!rawData.data || !Array.isArray(rawData.data) || rawData.data.length === 0) {
      return [];
    }

    try {
      // Memastikan data dalam format yang benar
      const validatedData = rawData.data.filter(item => 
        item && typeof item === 'object' && 
        'openDate' in item && 'longPct' in item && 'shortPct' in item
      );
      
      if (validatedData.length === 0) {
        console.error("Tidak ada data Top Trader Long Short valid setelah validasi");
        return [];
      }
      
      // Memperbaiki format openDate jika diperlukan
      const processedData = validatedData.map(item => {
        // Salin data item
        const newItem = { ...item };
        
        // Periksa format timestamp (dalam detik atau milidetik)
        const openDateStr = String(newItem.openDate);
        if (openDateStr.length <= 10) {
          newItem.openDate = newItem.openDate * 1000;
        }
        
        return newItem;
      });
      
      // Urutkan data
      return [...processedData].sort((a, b) => a.openDate - b.openDate);
    } catch (err) {
      console.error("Error memproses data Top Trader Long Short:", err);
      return [];
    }
  }, []);

  // Fungsi untuk mengambil data dari API
  useEffect(() => {
    if (tokenLoading) {
      return;
    }
    
    if (tokenError) {
      console.error("Token error:", tokenError);
      setError(`Error autentikasi: ${tokenError}`);
      setLoading(false);
      return;
    }

    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);
        setWhaleRetailData([]);
        setTrueRetailData([]);
        setTopTraderData([]);
        
        // Parameter dasar yang sama untuk semua API
        const startTime = Math.floor(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).getTime() / 1000);
        const endTime = Math.floor(new Date().getTime() / 1000);
        const commonParams = {
          coin: coin,
          exchange: "binance", // Menggunakan binance sebagai default
          timeframe: timeframe,
          startTime: startTime,
          endTime: endTime,
        };
        
        
        // Buat semua permintaan API secara paralel
        const [whaleRetailResponse, trueRetailResponse, topTraderResponse] = await Promise.all([
          getWhaleRetailDelta(commonParams),
          getTrueRetailLongShort(commonParams),
          getTopTraderLongShort(commonParams)
        ]);
        
        // Memeriksa error untuk setiap response
        if (whaleRetailResponse.error || trueRetailResponse.error || topTraderResponse.error) {
          // Jika ada error 401/403, coba refresh token
          if ([whaleRetailResponse.status, trueRetailResponse.status, topTraderResponse.status].includes(401) || 
              [whaleRetailResponse.status, trueRetailResponse.status, topTraderResponse.status].includes(403)) {
            await refreshToken();
            setError("Sesi autentikasi diperbarui. Mohon tunggu...");
          } else {
            // Tampilkan error yang paling relevan
            const errorMsg = whaleRetailResponse.error || trueRetailResponse.error || topTraderResponse.error;
            setError(`Error: ${errorMsg}`);
          }
          setLoading(false);
          return;
        }
        
        // Proses data response
        const processedWhaleRetailData = processWhaleRetailData(whaleRetailResponse.data);
        const processedTrueRetailData = processTrueRetailData(trueRetailResponse.data);
        const processedTopTraderData = processTopTraderData(topTraderResponse.data);
        
        // Update state dengan data yang berhasil diproses
        if (processedWhaleRetailData.length > 0) {
          setWhaleRetailData(processedWhaleRetailData);
        }
        
        if (processedTrueRetailData.length > 0) {
          setTrueRetailData(processedTrueRetailData);
        }
        
        if (processedTopTraderData.length > 0) {
          setTopTraderData(processedTopTraderData);
        }
        
        // Hanya tampilkan error jika tidak ada data sama sekali
        if (processedWhaleRetailData.length === 0 && processedTrueRetailData.length === 0 && processedTopTraderData.length === 0) {
          setError("Tidak ada data yang valid untuk ditampilkan");
        } else {
          setError(null);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error saat fetch data:", err);
        setError(`Error: ${err.message || "Terjadi kesalahan saat mengambil data"}`);
        setLoading(false);
      }
    };
    
    if (token) {
      fetchAllData();
    } else {
      setError("Token tidak tersedia. Silakan refresh halaman.");
      setLoading(false);
    }
  }, [coin, timeframe, token, tokenLoading, tokenError, refreshToken, processWhaleRetailData, processTrueRetailData, processTopTraderData]);

  if (typeof window === "undefined") {
    return (
      <div className="w-full h-[500px] bg-[#1E2026] rounded-lg p-4 flex items-center justify-center text-white">
        Loading chart...
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-[400px] bg-[#1E2026] rounded-lg p-4 border border-[#2B3139] flex items-center justify-center text-white">
        Memuat data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[400px] bg-[#1E2026] rounded-lg p-4 border border-[#2B3139] flex items-center justify-center text-white">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] bg-[#1E2026] rounded-lg p-4 border border-[#2B3139]">
      <Plot
        data={[
          // Whale vs Retail Delta (sumbu Y kiri)
          {
            x: whaleRetailData.map(item => new Date(item.openDate)),
            y: whaleRetailData.map(item => item.whaleRetailDelta),
            type: "scatter",
            mode: "lines",
            name: "Whale vs Retail Delta",
            line: { color: "#F0B90B", width: 2 },
            yaxis: "y",
          },
          // True Retail Long Percentage (sumbu Y kanan)
          {
            x: trueRetailData.map(item => new Date(item.openDate)),
            y: trueRetailData.map(item => item.longPct),
            type: "scatter",
            mode: "lines",
            name: "True Retail Long %",
            line: { color: "#2EBD85", width: 2, dash: "solid" },
            yaxis: "y2",
          },
          // True Retail Short Percentage (sumbu Y kanan)
          {
            x: trueRetailData.map(item => new Date(item.openDate)),
            y: trueRetailData.map(item => item.shortPct),
            type: "scatter",
            mode: "lines",
            name: "True Retail Short %",
            line: { color: "#F6465D", width: 2, dash: "solid" },
            yaxis: "y2",
          },
          // Top Trader Long Percentage (sumbu Y kanan)
          {
            x: topTraderData.map(item => new Date(item.openDate)),
            y: topTraderData.map(item => item.longPct),
            type: "scatter",
            mode: "lines",
            name: "Top Trader Long %",
            line: { color: "#1E88E5", width: 2, dash: "dot" },
            yaxis: "y2",
          },
          // Top Trader Short Percentage (sumbu Y kanan)
          {
            x: topTraderData.map(item => new Date(item.openDate)),
            y: topTraderData.map(item => item.shortPct),
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
            // title: { text: "Time", font: { color: "#848E9C" } },
            tickformat: "%d-%b", // Format tanggal yang lebih cocok untuk timeframe 1d
            showgrid: true,
            gridcolor: "rgba(43, 49, 57, 0.8)",
            tickfont: { color: "#848E9C" },
            linecolor: "#2B3139",
            rangeslider: { visible: false }, // Menghilangkan rangeslider
            tickangle: -30, // Memutar label waktu
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
          // annotations: [
          //   {
          //     text: `BTC/USDT - 1d - Binance`,
          //     font: {
          //       size: 10,
          //       color: "#848E9C",
          //     },
          //     showarrow: false,
          //     x: 1,
          //     y: 1.05,
          //     xref: "paper",
          //     yref: "paper",
          //     xanchor: "right",
          //     yanchor: "bottom",
          //   },
          // ],
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
