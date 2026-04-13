import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Mail, Phone, MessageSquare, CheckCircle2, Heart, XCircle } from 'lucide-react';
import { storageService, WaitlistEntry } from '../services/storage';

const formSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  attendanceStatus: z.enum(['Joyfully Accept', 'Regretfully Decline']),
  messageForCouple: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface RSVPFormProps {
  onSuccess: (entry: WaitlistEntry) => void;
}

export const WaitlistForm: React.FC<RSVPFormProps> = ({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const attendanceValue = watch('attendanceStatus');

  const onSubmit = async (data: FormData) => {
    try {
      const result = await storageService.addEntry(data);
      if (result) {
        onSuccess(result);
        reset();
      } else {
        alert('Failed to submit RSVP. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('An error occurred. Please check your connection and try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-secondary/60 flex items-center gap-2">
            <User className="w-3.5 h-3.5" /> First Name
          </label>
          <input
            {...register('firstName')}
            className={`w-full px-4 py-3 rounded-lg border bg-white/50 focus:ring-1 focus:ring-accent/40 focus:border-accent outline-none transition-all placeholder:text-secondary/30 ${
              errors.firstName ? 'border-red-400' : 'border-muted'
            }`}
            placeholder="John"
          />
          {errors.firstName && <p className="text-[10px] font-bold uppercase tracking-tight text-red-500">{errors.firstName.message}</p>}
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-secondary/60 flex items-center gap-2">
            <User className="w-3.5 h-3.5" /> Last Name
          </label>
          <input
            {...register('lastName')}
            className={`w-full px-4 py-3 rounded-lg border bg-white/50 focus:ring-1 focus:ring-accent/40 focus:border-accent outline-none transition-all placeholder:text-secondary/30 ${
              errors.lastName ? 'border-red-400' : 'border-muted'
            }`}
            placeholder="Doe"
          />
          {errors.lastName && <p className="text-[10px] font-bold uppercase tracking-tight text-red-500">{errors.lastName.message}</p>}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-secondary/60 flex items-center gap-2">
            <Mail className="w-3.5 h-3.5" /> Email
          </label>
          <input
            {...register('email')}
            type="email"
            className={`w-full px-4 py-3 rounded-lg border bg-white/50 focus:ring-1 focus:ring-accent/40 focus:border-accent outline-none transition-all placeholder:text-secondary/30 ${
              errors.email ? 'border-red-400' : 'border-muted'
            }`}
            placeholder="john@example.com"
          />
          {errors.email && <p className="text-[10px] font-bold uppercase tracking-tight text-red-500">{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-secondary/60 flex items-center gap-2">
            <Phone className="w-3.5 h-3.5" /> Phone
          </label>
          <input
            {...register('phone')}
            type="tel"
            className="w-full px-4 py-3 rounded-lg border border-muted bg-white/50 focus:ring-1 focus:ring-accent/40 focus:border-accent outline-none transition-all placeholder:text-secondary/30"
            placeholder="+1 (555) 000-0000"
          />
        </div>
      </div>

      {/* Attendance Status */}
      <div className="space-y-4">
        <label className="text-xs font-bold uppercase tracking-widest text-secondary/60 flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5" /> Attendance
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className={`relative flex flex-col items-center justify-center gap-4 py-12 px-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
            attendanceValue === 'Joyfully Accept' 
              ? 'border-accent bg-accent/5' 
              : 'border-muted/20 hover:border-accent/40'
          }`}>
            <input
              {...register('attendanceStatus')}
              type="radio"
              value="Joyfully Accept"
              className="sr-only"
            />
            <Heart className={`w-8 h-8 transition-all duration-500 ${attendanceValue === 'Joyfully Accept' ? 'text-accent fill-accent scale-125' : 'text-muted/40'}`} />
            <span className={`text-sm font-bold tracking-[0.1em] uppercase ${attendanceValue === 'Joyfully Accept' ? 'text-secondary' : 'text-secondary/50'}`}>
              Joyfully Accept
            </span>
          </label>

          <label className={`relative flex flex-col items-center justify-center gap-4 py-12 px-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
            attendanceValue === 'Regretfully Decline' 
              ? 'border-secondary bg-secondary/5' 
              : 'border-muted/20 hover:border-secondary/30'
          }`}>
            <input
              {...register('attendanceStatus')}
              type="radio"
              value="Regretfully Decline"
              className="sr-only"
            />
            <XCircle className={`w-8 h-8 transition-all duration-500 ${attendanceValue === 'Regretfully Decline' ? 'text-secondary scale-125' : 'text-muted/40'}`} />
            <span className={`text-sm font-bold tracking-[0.1em] uppercase ${attendanceValue === 'Regretfully Decline' ? 'text-secondary' : 'text-secondary/50'}`}>
              Regretfully Decline
            </span>
          </label>
        </div>
        {errors.attendanceStatus && <p className="text-[10px] font-bold uppercase tracking-tight text-red-500">{errors.attendanceStatus.message}</p>}
      </div>

      {/* Well Wishes */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-secondary/60 flex items-center gap-2">
          <MessageSquare className="w-3.5 h-3.5" /> Well Wishes
        </label>
        <textarea
          {...register('messageForCouple')}
          rows={3}
          className="w-full px-4 py-3 rounded-lg border border-muted bg-white/50 focus:ring-1 focus:ring-accent/40 focus:border-accent outline-none transition-all resize-none placeholder:text-secondary/30"
          placeholder="Share your warm thoughts..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-secondary text-white rounded-lg font-bold text-sm uppercase tracking-[0.2em] shadow-lg hover:bg-secondary/95 hover:shadow-accent/10 transition-all flex items-center justify-center gap-2 group overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        {isSubmitting ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <span className="relative z-10 flex items-center gap-2">
            Submit RSVP
            <Heart className="w-4 h-4 group-hover:scale-125 transition-transform duration-500" />
          </span>
        )}
      </button>
    </form>
  );
};
