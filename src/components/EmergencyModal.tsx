import React from 'react';
import { X, PhoneCall, AlertTriangle, HeartPulse } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const HELPLINES = [
    { title: 'National Emergency / Police', number: '112', desc: 'Instant police and road incident emergency' },
    { title: 'Ambulance / Medical Emergency', number: '108', desc: 'Free emergency medical service across India' },
    { title: 'Women Safety Helpline', number: '1091', desc: '24x7 support for female gig partners & cab riders' },
    { title: 'All India Gig Workers Union', number: '1800-120-7799', desc: 'Legal aid, accident rights & platform escalation' }
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-modal-title"
      className="fixed inset-0 z-50 bg-red-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
    >
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border-2 border-red-500 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-red-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-red-700 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h2 id="emergency-modal-title" className="font-bold text-lg text-white">
                Emergency SOS &amp; Road Helpline
              </h2>
              <p className="text-xs text-red-100">
                Durghatna / Accident &amp; Safety First Aid
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close emergency modal"
            className="text-white hover:bg-red-700 p-1 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Steps Checklist */}
        <div className="p-4 space-y-3">
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-900 text-xs space-y-1.5">
            <div className="font-bold text-red-800 flex items-center space-x-1.5">
              <HeartPulse className="w-4 h-4 text-red-600" />
              <span>Agar accident hua hai to turant ye karein:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-700 text-[11px]">
              <li><strong>Safe jagah rukein:</strong> Gaadi ko sadak ke kinare karein.</li>
              <li><strong>Ambulance (108) call karein:</strong> Chot lagi ho to pehle ilaaj karwayein.</li>
              <li><strong>e-Shram card bima:</strong> Registered workers ko ₹2,00,000 tak ka accidental hospital cover milta hai.</li>
              <li><strong>App support SOS:</strong> Zomato/Swiggy/Uber partner app me SOS button dabayein taaki trip pause ho sake aur penalty na lage.</li>
            </ol>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              1-Click Call Helplines
            </div>

            {HELPLINES.map((h, i) => (
              <a
                key={i}
                href={`tel:${h.number.replace(/-/g, '')}`}
                className="bg-slate-50 hover:bg-red-50/60 p-3 rounded-xl border border-slate-200 hover:border-red-300 flex items-center justify-between transition-colors group"
              >
                <div>
                  <div className="font-bold text-slate-900 text-xs group-hover:text-red-700">
                    {h.title}
                  </div>
                  <div className="text-[10px] text-slate-500">{h.desc}</div>
                </div>
                <div className="bg-red-600 group-hover:bg-red-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1 shadow">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{h.number}</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-900 transition-colors"
          >
            Wapas Chat Me Jayein
          </button>
        </div>
      </div>
    </div>
  );
};
