import { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { WaitlistEntry } from '../services/storage';

interface InvitationComposerProps {
  entry: WaitlistEntry;
  settings?: { qrPosX: number, qrPosY: number, qrScale: number };
}

export const InvitationComposer = forwardRef<HTMLDivElement, InvitationComposerProps>(
  ({ entry, settings }, ref) => {
    const qrX = settings?.qrPosX ?? 8;
    const qrY = settings?.qrPosY ?? 50;
    const qrScale = settings?.qrScale ?? 100;

    return (
      <div 
        ref={ref}
        className="relative w-[1024px] h-[724px] bg-slate-50 overflow-hidden shadow-2xl shrink-0"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        {/* Background Image - Assumes the user uploaded 'invitation-bg.png' or 'invitation-bg.jpg' to public/ */}
        <img 
          src="/invitation-bg.png" 
          alt="Invitation Background" 
          className="absolute inset-0 w-full h-full object-cover"
          crossOrigin="anonymous"
          onError={(e) => { e.currentTarget.src = "/invitation-bg.jpg"; }}
        />
        
        {/* QR Code Overlay - Positioned securely and dynamically based on database settings */}
        <div 
          className="absolute flex flex-col items-center bg-white/95 p-8 rounded-3xl shadow-2xl backdrop-blur-md border border-[#c9a961]/30"
          style={{
            top: `${qrY}%`,
            left: `${qrX}%`,
            transform: `translate(-50%, -50%) scale(${qrScale / 100})`,
            transformOrigin: 'center center'
          }}
        >
           <div className="mb-4 text-center">
             <p className="text-[12px] font-bold uppercase tracking-[0.3em] text-[#c9a961] mb-1">Guest Pass</p>
             <div className="w-8 h-px bg-[#c9a961]/40 mx-auto" />
           </div>
           
           <div className="bg-white p-2 rounded-xl mb-4">
             <QRCodeSVG 
                value={entry.id} 
                size={200}
                level="H"
                includeMargin={false}
             />
           </div>
           
           <div className="text-center space-y-1">
             <p className="text-xl font-bold text-slate-800 line-clamp-1 max-w-[200px]">
               {entry.firstName} {entry.lastName}
             </p>
             <p className="text-sm font-mono text-slate-500 bg-slate-100/50 px-3 py-1 rounded-full inline-block mt-2">
               ID: {entry.id}
             </p>
           </div>
        </div>
      </div>
    );
  }
);
