import React from 'react';
import { storageService, WaitlistEntry } from '../services/storage';
import { Search, CheckCircle, Clock, Trash2, ArrowLeft, QrCode, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


interface CheckInDashboardProps {
  onBack: () => void;
}

export const CheckInDashboard: React.FC<CheckInDashboardProps> = ({ onBack }) => {
  const [entries, setEntries] = React.useState<WaitlistEntry[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [isScanning, setIsScanning] = React.useState(false);

  const loadEntries = async () => {
    setIsLoading(true);
    const data = await storageService.getEntries();
    setEntries(data);
    setIsLoading(false);
  };

  React.useEffect(() => {
    loadEntries();
  }, []);

  React.useEffect(() => {
    let html5QrCode: any = null;
    
    if (isScanning) {
      // Delay initialization to allow modal animation to complete
      const timer = setTimeout(async () => {
        try {
          const { Html5Qrcode } = await import('html5-qrcode');
          html5QrCode = new Html5Qrcode("qr-reader");
          
          await html5QrCode.start(
            { facingMode: "environment" },
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
            },
            (decodedText: string) => {
              handleScanSuccess(decodedText);
              // Auto-close on success
              setIsScanning(false);
            },
            () => {
              // Ignore scan errors as they happen constantly during searching
            }
          );
        } catch (err) {
          console.error("Scanner error:", err);
        }
      }, 500);

      return () => {
        clearTimeout(timer);
        if (html5QrCode && html5QrCode.isScanning) {
          html5QrCode.stop().catch((e: any) => console.error("Stop failed", e));
        }
      };
    }
  }, [isScanning]);

  const handleScanSuccess = async (id: string) => {
    const entry = entries.find(e => e.id === id);
    if (!entry) {
      alert("Guest pass not found in the current list.");
      return;
    }

    if (entry.checkedIn) {
      alert(`${entry.firstName} is already checked in.`);
      return;
    }

    const success = await storageService.toggleCheckIn(id, false);
    if (success) {
      alert(`Successfully checked in: ${entry.firstName} ${entry.lastName}`);
      loadEntries();
    }
  };

  const handleToggle = async (id: string) => {
    const entry = entries.find(e => e.id === id);
    if (!entry) return;

    const success = await storageService.toggleCheckIn(id, entry.checkedIn);
    if (success) {
      loadEntries();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this entry?')) {
      const success = await storageService.deleteEntry(id);
      if (success) {
        loadEntries();
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
          <p className="text-secondary/60 font-serif">Connecting to database...</p>
        </div>
      </div>
    );
  }

  const filteredEntries = entries.filter(e => 
    e.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8 font-sans text-secondary">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-accent bg-white px-3 py-1.5 rounded-lg border border-secondary/5 mb-4 hover:bg-accent/5 transition-all text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Invitation
            </button>
            <h1 className="text-3xl font-serif">Guest Management</h1>
            <p className="text-secondary/60">Manage responses for the Child Dedication event.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <button
              onClick={() => setIsScanning(true)}
              className="flex items-center justify-center gap-2 bg-accent text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-accent/90 transition-all w-full sm:w-auto shadow-lg shadow-accent/20"
            >
              <QrCode className="w-4 h-4" /> Scan Pass
            </button>
            
            <div className="flex bg-white rounded-xl shadow-sm border border-secondary/5 px-4 items-center gap-3 w-full sm:w-80">
              <Search className="w-4 h-4 text-secondary/30" />
              <input 
                type="text" 
                placeholder="Search guests..."
                className="bg-transparent border-none outline-none py-3 w-full text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* QR Scanner Overlay */}
        <AnimatePresence>
          {isScanning && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            >
              <div 
                className="absolute inset-0 bg-secondary/80 backdrop-blur-md" 
                onClick={() => setIsScanning(false)}
              />
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="relative bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl overflow-hidden"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-serif">Scan Guest Pass</h3>
                  <button 
                    onClick={() => setIsScanning(false)}
                    className="p-2 hover:bg-secondary/5 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div id="qr-reader" className="w-full overflow-hidden rounded-2xl border-2 border-accent/20" />
                
                <p className="mt-8 text-center text-sm text-secondary/50 italic leading-relaxed">
                  Position the guest's digital pass QR code inside the frame to scan.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-secondary/5">
            <p className="text-xs font-bold text-secondary/40 uppercase tracking-wider mb-1">Total Responses</p>
            <p className="text-3xl font-serif">{entries.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-secondary/5">
            <p className="text-xs font-bold text-secondary/40 uppercase tracking-wider mb-1">Joyfully Accepted</p>
            <p className="text-3xl font-serif text-green-600">{entries.filter(e => e.attendanceStatus === 'Joyfully Accept').length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-secondary/5">
            <p className="text-xs font-bold text-secondary/40 uppercase tracking-wider mb-1">Regretful Declines</p>
            <p className="text-3xl font-serif text-red-400">{entries.filter(e => e.attendanceStatus === 'Regretfully Decline').length}</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-secondary/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-secondary/5 text-secondary/60 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Guest Name</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Check-in</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/5">
                {filteredEntries.map((entry) => (
                  <motion.tr 
                    layout
                    key={entry.id} 
                    className={`group transition-colors ${entry.checkedIn ? 'bg-green-50/30' : 'hover:bg-secondary/5'}`}
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold">{entry.firstName} {entry.lastName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-secondary/50">{entry.email}</p>
                      <p className="text-xs text-secondary/50">{entry.phone || 'No phone'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        entry.attendanceStatus === 'Joyfully Accept' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {entry.attendanceStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleToggle(entry.id)}
                          className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                            entry.checkedIn 
                              ? 'bg-green-500 border-green-500 text-white' 
                              : 'bg-white border-secondary/10 text-secondary/60 hover:border-secondary/20'
                          }`}
                        >
                          {entry.checkedIn ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {entry.checkedIn ? 'Checked In' : 'Pending'}
                        </button>
                        
                        <button 
                          onClick={() => {
                            const message = encodeURIComponent(
                              `*Special Invitation: Dedication of Rion Chisom Raphael Nwosu*\n\n` +
                              `Hello ${entry.firstName},\n\n` +
                              `We are delighted to have you join us for Rion's dedication service and reception.\n\n` +
                              `*Your Guest Pass ID:* ${entry.id}\n` +
                              `*Date:* Sunday, 26th April 2026\n` +
                              `*Dedication:* Gateway International Church (Altar of Mercy Grounds), 10:00 AM\n` +
                              `*Reception:* WhiteJade Event Centre, Eliozu\n\n` +
                              `Please have this ID ready for check-in at the door. See you soon!`
                            );
                            const phone = entry.phone ? entry.phone.replace(/[^0-9]/g, '') : '';
                            window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
                          }}
                          className="p-2 text-[#25D366] hover:bg-green-50 rounded-lg transition-all"
                          title="Send invitation via WhatsApp"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleDelete(entry.id)}
                        className="p-2 text-secondary/20 hover:text-red-500 transition-colors rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
                {filteredEntries.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-2 opacity-30">
                        <Search className="w-10 h-10" />
                        <p>No entries found matching your search.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
