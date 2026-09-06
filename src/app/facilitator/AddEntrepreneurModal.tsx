'use client';

/**
 * src/app/facilitator/AddEntrepreneurModal.tsx
 *
 * Client Component: Form modal to add and onboard a new entrepreneur
 * and link them to the facilitator.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  facilitatorId?: string;
}

export default function AddEntrepreneurModal({ facilitatorId }: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [sector, setSector] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/facilitator/add-entrepreneur', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          sector: sector.trim(),
          facilitator_id: facilitatorId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to add entrepreneur');
      }

      setSuccess('उद्यमी सफलतापूर्वक जोड़ा गया! (Entrepreneur added)');
      setTimeout(() => {
        setIsOpen(false);
        setName('');
        setPhone('');
        setSector('');
        setSuccess('');
        router.refresh();
      }, 1200);
    } catch (err) {
      setError(String(err instanceof Error ? err.message : err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-emerald-950 font-black text-sm rounded-xl transition-all shadow-lg flex items-center gap-2"
      >
        <span>➕</span>
        <span>नया उद्यमी जोड़ें / Add Entrepreneur</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#02130e]/80 backdrop-blur-md p-4">
          <div className="bg-[#06241b] border-2 border-[#134e3d] w-full max-w-md rounded-3xl p-6 shadow-[0_20px_60px_rgba(2,44,34,0.9)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#0d382b]">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                👤 नया उद्यमी जोड़ें
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-emerald-300/70 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-emerald-200/90 mb-1">
                  उद्यमी का नाम / Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="उदा. रमेश कुमार (Ramesh Kumar)"
                  className="w-full bg-[#02130e] border border-[#134e3d] text-white placeholder-emerald-700/60 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-200/90 mb-1">
                  मोबाइल नंबर / Phone Number *
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 bg-[#02130e] text-emerald-300 text-xs border border-r-0 border-[#134e3d] rounded-l-xl">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    maxLength={10}
                    className="flex-1 bg-[#02130e] border border-[#134e3d] text-white placeholder-emerald-700/60 rounded-r-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-200/90 mb-1">
                  व्यवसाय का प्रकार / Business Sector
                </label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full bg-[#02130e] border border-[#134e3d] text-white rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/40"
                >
                  <option value="">क्षेत्र चुनें (Select Sector)</option>
                  <option value="agriculture">खेती / कृषि (Agriculture)</option>
                  <option value="retail">दुकान / रिटेल (Retail)</option>
                  <option value="food_processing">खाद्य प्रसंस्करण (Food Processing)</option>
                  <option value="manufacturing">निर्माण (Manufacturing)</option>
                  <option value="handicrafts">हस्तशिल्प (Handicrafts)</option>
                  <option value="services">सेवाएं (Services)</option>
                  <option value="street_vending">ठेला / फेरी (Street Vending)</option>
                </select>
              </div>

              {error && (
                <p className="text-xs text-rose-300 bg-rose-950/60 p-2.5 rounded-xl border border-rose-800/80">
                  ❌ {error}
                </p>
              )}

              {success && (
                <p className="text-xs text-emerald-300 bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-800/80">
                  ✅ {success}
                </p>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-[#02130e] hover:bg-[#06241b] text-emerald-200 text-xs font-bold rounded-xl border border-[#134e3d] transition-colors"
                >
                  रद्द करें (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 disabled:opacity-50 text-emerald-950 text-xs font-black rounded-xl transition-all shadow-md"
                >
                  {loading ? 'जोड़ रहे हैं...' : 'सुरक्षित करें (Save)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
