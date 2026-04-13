import { supabase } from '../lib/supabase';

export interface WaitlistEntry {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  attendanceStatus: 'Joyfully Accept' | 'Regretfully Decline';
  messageForCouple?: string;
  timestamp: string;
  checkedIn: boolean;
}

export const storageService = {
  getEntries: async (): Promise<WaitlistEntry[]> => {
    const { data, error } = await supabase
      .from('rsvps')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching entries:', error);
      return [];
    }

    return (data || []).map((row) => ({
      id: row.id,
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      phone: row.phone,
      attendanceStatus: row.attendance_status as any,
      messageForCouple: row.message_for_family,
      timestamp: row.created_at,
      checkedIn: row.checked_in,
    }));
  },

  addEntry: async (entry: Omit<WaitlistEntry, 'id' | 'timestamp' | 'checkedIn'>): Promise<WaitlistEntry | null> => {
    const { data, error } = await supabase
      .from('rsvps')
      .insert([
        {
          first_name: entry.firstName,
          last_name: entry.lastName,
          email: entry.email,
          phone: entry.phone,
          attendance_status: entry.attendanceStatus,
          message_for_family: entry.messageForCouple,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding entry:', error);
      return null;
    }

    return {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      phone: data.phone,
      attendanceStatus: data.attendance_status as any,
      messageForCouple: data.message_for_family,
      timestamp: data.created_at,
      checkedIn: data.checked_in,
    };
  },

  toggleCheckIn: async (id: string, currentStatus: boolean): Promise<boolean> => {
    const { error } = await supabase
      .from('rsvps')
      .update({ checked_in: !currentStatus })
      .eq('id', id);

    if (error) {
      console.error('Error toggling check-in:', error);
      return false;
    }
    return true;
  },

  deleteEntry: async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('rsvps')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting entry:', error);
      return false;
    }
    return true;
  },
};
