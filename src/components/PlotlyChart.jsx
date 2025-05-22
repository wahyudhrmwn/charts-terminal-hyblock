"use client";

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { getBidAsk, getOIDelta, getVolDelta } from "../services/api/hyblock";
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

const PlotlyChart = ({ coin = "BTC", timeframe = "1d" }) => {
  const [priceData, setPriceData] = useState([]);
  const [oiDeltaData, setOiDeltaData] = useState([]);
  const [volDeltaData, setVolDeltaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, isLoading: tokenLoading, error: tokenError, refreshToken } = useToken();
  
  // Fungsi untuk memproses data price
  const processPriceData = useCallback((rawData) => {
    if (!rawData.data || !Array.isArray(rawData.data) || rawData.data.length === 0) {
      console.log('rawData nya', rawData);
      console.log('!rawData', !rawData);
      console.log('!Array.isArray(rawData)', !Array.isArray(rawData));
      console.log('!rawData.length', rawData.length === 0);
      console.log("Tidak ada data yang valid untuk diproses");
      return [];
    }

    try {
      console.log("Raw data sample:", rawData.data[0]);
      
      // Memastikan data dalam format yang benar
      const validatedData = rawData.data.filter(item => 
        item && typeof item === 'object' && 
        'openDate' in item && 'bid' in item && 'ask' in item
      );
      
      if (validatedData.length === 0) {
        console.error("Tidak ada data valid setelah validasi");
        return [];
      }
      
      // Memperbaiki format openDate jika diperlukan
      const processedData = validatedData.map(item => {
        // Salin data item
        const newItem = { ...item };
        
        // Periksa format timestamp (dalam detik atau milidetik)
        // Jika timestamp dalam detik (kurang dari 13 digit), kalikan dengan 1000 untuk menjadi milidetik
        const openDateStr = String(newItem.openDate);
        if (openDateStr.length <= 10) {
          console.log(`Mengkonversi format openDate dari detik ke milidetik: ${newItem.openDate} -> ${newItem.openDate * 1000}`);
          newItem.openDate = newItem.openDate * 1000;
        }
        
        return newItem;
      });
      
      console.log("Validated data sample setelah konversi:", processedData[0]);
      
      // Urutkan data
      return [...processedData].sort((a, b) => a.openDate - b.openDate);
    } catch (err) {
      console.error("Error memproses data:", err);
      return [];
    }
  }, []);

  // Fungsi untuk memproses data OI Delta
  const processOIDeltaData = useCallback((rawData) => {
    if (!rawData.data || !Array.isArray(rawData.data) || rawData.data.length === 0) {
      console.log("Tidak ada data OI Delta yang valid untuk diproses");
      return [];
    }

    try {
      console.log("Raw OI Delta data sample:", rawData.data[0]);
      
      // Memastikan data dalam format yang benar
      const validatedData = rawData.data.filter(item => 
        item && typeof item === 'object' && 
        'openDate' in item && 'cumulativeDelta' in item
      );
      
      if (validatedData.length === 0) {
        console.error("Tidak ada data OI Delta valid setelah validasi");
        return [];
      }
      
      // Memperbaiki format openDate jika diperlukan
      const processedData = validatedData.map(item => {
        // Salin data item
        const newItem = { ...item };
        
        // Periksa format timestamp (dalam detik atau milidetik)
        const openDateStr = String(newItem.openDate);
        if (openDateStr.length <= 10) {
          console.log(`Mengkonversi format openDate OI Delta dari detik ke milidetik: ${newItem.openDate} -> ${newItem.openDate * 1000}`);
          newItem.openDate = newItem.openDate * 1000;
        }
        
        return newItem;
      });
      
      console.log("Validated OI Delta data sample setelah konversi:", processedData[0]);
      
      // Urutkan data
      return [...processedData].sort((a, b) => a.openDate - b.openDate);
    } catch (err) {
      console.error("Error memproses data OI Delta:", err);
      return [];
    }
  }, []);

  // Fungsi untuk memproses data Volume Delta
  const processVolDeltaData = useCallback((rawData) => {
    if (!rawData.data || !Array.isArray(rawData.data) || rawData.data.length === 0) {
      console.log("Tidak ada data Volume Delta yang valid untuk diproses");
      return [];
    }

    try {
      console.log("Raw Volume Delta data sample:", rawData.data[0]);
      
      // Memastikan data dalam format yang benar
      const validatedData = rawData.data.filter(item => 
        item && typeof item === 'object' && 
        'openDate' in item && 'volumeDelta' in item
      );
      
      if (validatedData.length === 0) {
        console.error("Tidak ada data Volume Delta valid setelah validasi");
        return [];
      }
      
      // Memperbaiki format openDate jika diperlukan
      const processedData = validatedData.map(item => {
        // Salin data item
        const newItem = { ...item };
        
        // Periksa format timestamp (dalam detik atau milidetik)
        const openDateStr = String(newItem.openDate);
        if (openDateStr.length <= 10) {
          console.log(`Mengkonversi format openDate Volume Delta dari detik ke milidetik: ${newItem.openDate} -> ${newItem.openDate * 1000}`);
          newItem.openDate = newItem.openDate * 1000;
        }
        
        return newItem;
      });
      
      console.log("Validated Volume Delta data sample setelah konversi:", processedData[0]);
      
      // Urutkan data
      return [...processedData].sort((a, b) => a.openDate - b.openDate);
    } catch (err) {
      console.error("Error memproses data Volume Delta:", err);
      return [];
    }
  }, []);

  // Fungsi untuk mengambil data dari API
  useEffect(() => {
    if (tokenLoading) {
      console.log("Menunggu token...");
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
        setPriceData([]);
        setOiDeltaData([]);
        setVolDeltaData([]);
        
        // Parameter dasar yang sama untuk semua API
        const startTime = Math.floor(new Date("2025-05-01T00:00:00Z").getTime() / 1000);
        const endTime = Math.floor(new Date().getTime() / 1000);
        const commonParams = {
          coin: coin,
          timeframe: timeframe,
          startTime: startTime,
          endTime: endTime
        };
        
        console.log(`Memuat data untuk coin: ${coin} dengan timeframe: ${timeframe}`);
        
        // Buat semua permintaan API secara paralel
        const [priceResponse, oiDeltaResponse, volDeltaResponse] = await Promise.all([
          getBidAsk(commonParams),
          getOIDelta({...commonParams, anchor: "1d"}),
          getVolDelta(commonParams)
        ]);
        
        console.log("Price API Response:", priceResponse);
        console.log("OI Delta API Response:", oiDeltaResponse);
        console.log("Volume Delta API Response:", volDeltaResponse);
        
        // Memeriksa error untuk setiap response
        if (priceResponse.error || oiDeltaResponse.error || volDeltaResponse.error) {
          // Jika ada error 401/403, coba refresh token
          if ([priceResponse.status, oiDeltaResponse.status, volDeltaResponse.status].includes(401) || 
              [priceResponse.status, oiDeltaResponse.status, volDeltaResponse.status].includes(403)) {
            console.log('Token tidak valid, mencoba refresh token...');
            await refreshToken();
            setError("Sesi autentikasi diperbarui. Mohon tunggu...");
          } else {
            // Tampilkan error yang paling relevan
            const errorMsg = priceResponse.error || oiDeltaResponse.error || volDeltaResponse.error;
            setError(`Error: ${errorMsg}`);
          }
          setLoading(false);
          return;
        }
        
        // Proses data response
        const processedPriceData = processPriceData(priceResponse.data);
        const processedOIDeltaData = processOIDeltaData(oiDeltaResponse.data);
        const processedVolDeltaData = processVolDeltaData(volDeltaResponse.data);
        
        // Update state dengan data yang berhasil diproses
        if (processedPriceData.length > 0) {
          console.log(`Berhasil memproses ${processedPriceData.length} data price`);
          setPriceData(processedPriceData);
        }
        
        if (processedOIDeltaData.length > 0) {
          console.log(`Berhasil memproses ${processedOIDeltaData.length} data OI Delta`);
          setOiDeltaData(processedOIDeltaData);
        }
        
        if (processedVolDeltaData.length > 0) {
          console.log(`Berhasil memproses ${processedVolDeltaData.length} data Volume Delta`);
          setVolDeltaData(processedVolDeltaData);
        }
        
        // Hanya tampilkan error jika tidak ada data sama sekali
        if (processedPriceData.length === 0 && processedOIDeltaData.length === 0 && processedVolDeltaData.length === 0) {
          setError("Tidak ada data yang valid untuk ditampilkan");
        } else {
          setError(null);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(`Gagal memuat data: ${err.message || "Silakan coba lagi nanti"}`);
        setLoading(false);
      }
    };

    if (token) {
      fetchAllData();
    } else {
      setError("Token tidak tersedia. Silakan refresh halaman.");
      setLoading(false);
    }
  }, [token, tokenLoading, tokenError, refreshToken, processPriceData, processOIDeltaData, processVolDeltaData, coin]);

  // Jika masih loading atau tidak ada window (SSR)
  if (typeof window === "undefined" || loading || tokenLoading) {
    return (
      <div className="w-full h-[500px] bg-[#1E2026] rounded-lg p-4 flex items-center justify-center text-white">
        Loading chart...
      </div>
    );
  }

  // Jika terjadi error
  if (error) {
    return (
      <div className="w-full h-[500px] bg-[#1E2026] rounded-lg p-4 flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  // Jika tidak ada data
  if ((!priceData || priceData.length === 0) && 
      (!oiDeltaData || oiDeltaData.length === 0) && 
      (!volDeltaData || volDeltaData.length === 0)) {
    return (
      <div className="w-full h-[500px] bg-[#1E2026] rounded-lg p-4 flex items-center justify-center text-white">
        Tidak ada data untuk ditampilkan
      </div>
    );
  }

  // Menyiapkan data untuk chart
  const plotData = [];
  
  // Data Price (jika tersedia)
  if (priceData && priceData.length > 0) {
    plotData.push({
      x: priceData.map(item => new Date(item.openDate)),
      y: priceData.map(item => (Number(item.bid) + Number(item.ask)) / 2),
      type: "scatter",
      mode: "lines",
      name: "Price",
      line: { color: "#F0B90B", width: 2 },
      yaxis: "y",
    });
  }
  
  // Data OI Delta (jika tersedia)
  if (oiDeltaData && oiDeltaData.length > 0) {
    plotData.push({
      x: oiDeltaData.map(item => new Date(item.openDate)),
      y: oiDeltaData.map(item => item.cumulativeDelta),
      type: "scatter",
      mode: "lines",
      name: "OI Delta",
      line: { color: "#58B589", width: 2, dash: "solid" },
      yaxis: "y2",
    });
  }
  
  // Data Vol Delta (jika tersedia)
  if (volDeltaData && volDeltaData.length > 0) {
    plotData.push({
      x: volDeltaData.map(item => new Date(item.openDate)),
      y: volDeltaData.map(item => item.volumeDelta),
      type: "scatter",
      mode: "lines",
      name: "Vol Delta",
      line: { color: "#C45A5A", width: 2, dash: "dot" },
      yaxis: "y2",
    });
  }

  return (
    <div className="w-full h-[500px] bg-[#1E2026] rounded-lg p-4 border border-[#2B3139]">
      <Plot
        data={plotData}
        layout={{
          autosize: true,
          height: 450,
          margin: { l: 60, r: 60, t: 40, b: 60 }, // Menambahkan margin lebih besar
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
            title: { text: "Price (USD)", font: { color: "#848E9C" } },
            titlefont: { color: "#F0B90B" },
            tickfont: { color: "#848E9C" },
            side: "left",
            showgrid: true,
            gridcolor: "rgba(43, 49, 57, 0.8)",
            linecolor: "#2B3139",
            autorange: true, // Memastikan skala otomatis
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
            autorange: true, // Memastikan skala otomatis
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
