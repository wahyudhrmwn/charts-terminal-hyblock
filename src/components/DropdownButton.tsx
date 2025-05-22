'use client';

import React, { useState, useEffect, useRef } from "react";

interface DropdownButtonProps {
  onCoinChange: (coin: string) => void;
  initialCoin?: string;
}

const DropdownButton: React.FC<DropdownButtonProps> = ({ 
  onCoinChange, 
  initialCoin = "BTC" 
}) => {
  const [selectedCoin, setSelectedCoin] = useState(initialCoin);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleCoinSelect = (coin: string) => {
    setSelectedCoin(coin);
    onCoinChange(coin);
    setIsOpen(false);
  };

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const coins = [
    { id: "BTC", name: "BTC" },
    { id: "ETH", name: "ETH" },
    { id: "SOL", name: "SOL" },
    { id: "BNB", name: "BNB" },
    { id: "XRP", name: "XRP" },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 rounded-md bg-[#F0B90B] hover:bg-[#F8D12F] text-black font-medium transition-colors duration-200 min-w-[80px] h-[40px] flex items-center justify-center"
      >
        {selectedCoin}
      </button>
      
      {isOpen && (
        <ul className="absolute mt-1 bg-[#1E2026] text-white rounded-md z-[100] w-52 p-2 shadow-lg border border-[#2B3139]">
          {coins.map((coin) => (
            <li key={coin.id} className="my-1">
              <button 
                className={`w-full text-left px-4 py-2 hover:bg-[#2B3139] rounded-md transition-colors ${selectedCoin === coin.id ? "bg-[#2B3139] text-[#F0B90B]" : ""}`}
                onClick={() => handleCoinSelect(coin.id)}
              >
                {coin.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownButton;
