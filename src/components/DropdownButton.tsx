'use client';

import React, { useState } from "react";

interface DropdownButtonProps {
  onCoinChange: (coin: string) => void;
  initialCoin?: string;
}

const DropdownButton: React.FC<DropdownButtonProps> = ({ 
  onCoinChange, 
  initialCoin = "BTC" 
}) => {
  const [selectedCoin, setSelectedCoin] = useState(initialCoin);

  const handleCoinSelect = (coin: string) => {
    setSelectedCoin(coin);
    onCoinChange(coin);
  };

  return (
    <div className="dropdown">
      <div 
        tabIndex={0} 
        role="button" 
        className="btn bg-[#F0B90B] hover:bg-[#F8D12F] text-black border-none font-medium"
      >
        {selectedCoin}
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-[#1E2026] text-white rounded-md z-[100] w-52 p-2 shadow-lg border border-[#2B3139]"
      >
        <li>
          <a 
            className={`hover:bg-[#2B3139] ${selectedCoin === "BTC" ? "bg-[#2B3139] text-[#F0B90B]" : ""}`}
            onClick={() => handleCoinSelect("BTC")}
          >
            BTC
          </a>
        </li>
        <li>
          <a 
            className={`hover:bg-[#2B3139] ${selectedCoin === "ETH" ? "bg-[#2B3139] text-[#F0B90B]" : ""}`}
            onClick={() => handleCoinSelect("ETH")}
          >
            ETH
          </a>
        </li>
        <li>
          <a 
            className={`hover:bg-[#2B3139] ${selectedCoin === "SOL" ? "bg-[#2B3139] text-[#F0B90B]" : ""}`}
            onClick={() => handleCoinSelect("SOL")}
          >
            SOL
          </a>
        </li>
        <li>
          <a 
            className={`hover:bg-[#2B3139] ${selectedCoin === "BNB" ? "bg-[#2B3139] text-[#F0B90B]" : ""}`}
            onClick={() => handleCoinSelect("BNB")}
          >
            BNB
          </a>
        </li>
        <li>
          <a 
            className={`hover:bg-[#2B3139] ${selectedCoin === "XRP" ? "bg-[#2B3139] text-[#F0B90B]" : ""}`}
            onClick={() => handleCoinSelect("XRP")}
          >
            XRP
          </a>
        </li>
      </ul>
    </div>
  );
};

export default DropdownButton;
