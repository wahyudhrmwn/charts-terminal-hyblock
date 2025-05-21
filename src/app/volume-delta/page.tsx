import VolDeltaExample from "@/components/VolDeltaExample";

export default function VolumeDeltaPage() {
  return (
    <main className="min-h-screen bg-[#121417] p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-[#F0B90B] mb-6">
          Volume Delta - Hyblock API
        </h1>
        
        <div className="mb-6 p-4 bg-[#1E2026] rounded-lg border border-[#2B3139]">
          <h2 className="text-xl text-white mb-3">Format Data</h2>
          <pre className="bg-[#262930] p-4 rounded text-gray-300 overflow-x-auto">
{`{
  "openDate": 1665047820,
  "volumeDelta": 1798220.5481000019
}`}
          </pre>
          <p className="mt-3 text-gray-400">
            <code>openDate</code>: Timestamp Unix dalam detik<br />
            <code>volumeDelta</code>: Selisih volume transaksi buy dan sell
          </p>
        </div>
        
        <div className="mb-6">
          <VolDeltaExample />
        </div>
        
        <div className="p-4 bg-[#1E2026] rounded-lg border border-[#2B3139]">
          <h2 className="text-xl text-white mb-3">Parameter API</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-[#F0B90B] font-semibold">Required Parameters</h3>
              <ul className="list-disc list-inside text-gray-300 ml-4 mt-2">
                <li><code>coin</code>: Nama coin yang valid (contoh: &quot;BTC&quot;)</li>
                <li><code>timeframe</code>: Jangka waktu data (1m, 5m, 15m, 1h, 4h, 1d)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-[#F0B90B] font-semibold">Optional Parameters</h3>
              <ul className="list-disc list-inside text-gray-300 ml-4 mt-2">
                <li><code>exchange</code>: Nama bursa yang valid</li>
                <li><code>marketTypes</code>: Jenis pasar (All, Spot, Perpetuals)</li>
                <li><code>sort</code>: Urutan hasil (asc, desc)</li>
                <li><code>startTime</code>: Waktu mulai (Unix timestamp)</li>
                <li><code>endTime</code>: Waktu akhir (Unix timestamp)</li>
                <li><code>bucket</code>: Filter rentang volume (1=0-100, 2=100-1K, dll)</li>
                <li><code>limit</code>: Jumlah maksimum data</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 