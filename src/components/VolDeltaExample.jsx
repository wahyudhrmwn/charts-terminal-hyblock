"use client";

import React, { useState, useEffect } from "react";
import { getVolDelta } from "../services/api/hyblock";

const VolDeltaExample = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Ambil data volume delta untuk BTC dengan timeframe 1h
        const response = await getVolDelta({
          coin: "BTC",
          timeframe: "1h"
        });
        
        if (response && response.data) {
          setData(response.data);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching volume delta data:", err);
        setError("Gagal memuat data. Silakan coba lagi nanti.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fungsi untuk memformat timestamp menjadi tanggal dan waktu yang mudah dibaca
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Fungsi untuk memformat angka dengan pemisah ribuan
  const formatNumber = (number) => {
    return new Intl.NumberFormat("id-ID").format(number);
  };

  if (loading) {
    return (
      <div className="bg-[#1E2026] p-6 rounded-lg">
        <p className="text-white">Memuat data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#1E2026] p-6 rounded-lg">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1E2026] p-6 rounded-lg">
      <h2 className="text-xl font-semibold text-[#F0B90B] mb-4">
        Data Volume Delta (BTC)
      </h2>
      
      {data.length === 0 ? (
        <p className="text-white">Tidak ada data yang tersedia.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-[#2B3139]">
                <th className="py-2 px-4 text-left text-white">Waktu</th>
                <th className="py-2 px-4 text-right text-white">Volume Delta</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-[#1E2026]" : "bg-[#262930]"}
                >
                  <td className="py-2 px-4 text-left text-gray-300">
                    {formatTimestamp(item.openDate)}
                  </td>
                  <td 
                    className={`py-2 px-4 text-right ${
                      item.volumeDelta >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {item.volumeDelta >= 0 ? "+" : ""}{formatNumber(item.volumeDelta)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Contoh data individu */}
      {data.length > 0 && (
        <div className="mt-6 p-4 bg-[#262930] rounded-md">
          <h3 className="text-white text-lg mb-2">Contoh Format Data:</h3>
          <pre className="bg-[#1E2026] p-3 rounded text-gray-300 overflow-x-auto">
            {JSON.stringify({
              openDate: data[0].openDate,
              volumeDelta: data[0].volumeDelta
            }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default VolDeltaExample; 