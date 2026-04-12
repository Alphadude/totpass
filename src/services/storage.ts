export interface WaitlistEntry {
  id: string;
  parentName: string;
  email: string;
  phone: string;
  babyName: string;
  expectedGuests: number;
  notes?: string;
  timestamp: string;
  checkedIn: boolean;
}

const STORAGE_KEY = 'baby_dedication_waitlist';

export const storageService = {
  getEntries: (): WaitlistEntry[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  addEntry: (entry: Omit<WaitlistEntry, 'id' | 'timestamp' | 'checkedIn'>): WaitlistEntry => {
    const entries = storageService.getEntries();
    const newEntry: WaitlistEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      checkedIn: false,
    };
    entries.push(newEntry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return newEntry;
  },

  toggleCheckIn: (id: string): void => {
    const entries = storageService.getEntries();
    const index = entries.findIndex((e) => e.id === id);
    if (index !== -1) {
      entries[index].checkedIn = !entries[index].checkedIn;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }
  },

  deleteEntry: (id: string): void => {
    const entries = storageService.getEntries();
    const filtered = entries.filter((e) => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },
};
