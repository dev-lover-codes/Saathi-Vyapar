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
        className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FF416C] to-[#FF4B2B] text-white font-bold text-xs shadow-md hover:opacity-95 transition-all flex items-center gap-2"
      >
        <span>➕</span>
        <span>नया उद्यमी जोड़ें / Add Entrepreneur</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#151515]/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-[#E5E2E1] w-full max-w-md rounded-[28px] p-6 shadow-2xl space-y-5 text-[#151515]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E2E1]">
              <h3 className="text-base font-bold text-[#151515] flex items-center gap-2">
                👤 नया उद्यमी जोड़ें
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F0EFEB] hover:bg-[#E5E2E1] text-[#8C8880] hover:text-[#151515] text-xs font-bold flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#615E57] mb-1.5">
                  उद्यमी का नाम / Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="उदा. रमेश कुमार (Ramesh Kumar)"
                  className="w-full bg-[#F4F3EF] border border-[#E5E2E1] text-[#151515] placeholder-[#8C8880] rounded-2xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#151515] focus:ring-1 focus:ring-[#151515]/20 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#615E57] mb-1.5">
                  मोबाइल नंबर / Phone Number *
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3.5 bg-[#E5E2E1]/60 text-[#615E57] text-xs font-semibold border border-r-0 border-[#E5E2E1] rounded-l-2xl">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    maxLength={10}
                    className="flex-1 bg-[#F4F3EF] border border-[#E5E2E1] text-[#151515] placeholder-[#8C8880] rounded-r-2xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#151515] focus:ring-1 focus:ring-[#151515]/20 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#615E57] mb-1.5">
                  व्यवसाय का प्रकार / Business Sector
                </label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full bg-[#F4F3EF] border border-[#E5E2E1] text-[#151515] rounded-2xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#151515] focus:ring-1 focus:ring-[#151515]/20 transition-colors"
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
                <p className="text-xs text-[#93000A] bg-[#FFDAD6] p-3 rounded-2xl border border-[#FFDAD6]">
                  ❌ {error}
                </p>
              )}

              {success && (
                <p className="text-xs text-[#065F46] bg-[#D1FAE5] p-3 rounded-2xl border border-[#A7F3D0]">
                  ✅ {success}
                </p>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2.5 bg-[#F0EFEB] hover:bg-[#E5E2E1] text-[#151515] text-xs font-semibold rounded-full transition-colors"
                >
                  रद्द करें (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#FF416C] to-[#FF4B2B] hover:opacity-95 disabled:opacity-50 text-white text-xs font-bold rounded-full transition-all shadow-md"
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
