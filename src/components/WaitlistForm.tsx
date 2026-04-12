import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Mail, Phone, MessageSquare, CheckCircle2, Heart, XCircle } from 'lucide-react';
import { storageService } from '../services/storage';

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
  onSuccess: () => void;
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
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    storageService.addEntry(data as any);
    reset();
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-secondary/80 flex items-center gap-2">
            <User className="w-4 h-4" /> First Name (Required)
          </label>
          <input
            {...register('firstName')}
            className={`w-full px-4 py-3 rounded-xl border bg-white/50 focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all ${
              errors.firstName ? 'border-red-400' : 'border-secondary/10'
            }`}
            placeholder="John"
          />
          {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-secondary/80 flex items-center gap-2">
            <User className="w-4 h-4" /> Last Name (Required)
          </label>
          <input
            {...register('lastName')}
            className={`w-full px-4 py-3 rounded-xl border bg-white/50 focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all ${
              errors.lastName ? 'border-red-400' : 'border-secondary/10'
            }`}
            placeholder="Doe"
          />
          {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-secondary/80 flex items-center gap-2">
            <Mail className="w-4 h-4" /> Email Address (Required)
          </label>
          <input
            {...register('email')}
            type="email"
            className={`w-full px-4 py-3 rounded-xl border bg-white/50 focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all ${
              errors.email ? 'border-red-400' : 'border-secondary/10'
            }`}
            placeholder="john@example.com"
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-secondary/80 flex items-center gap-2">
            <Phone className="w-4 h-4" /> Phone Number (Optional)
          </label>
          <input
            {...register('phone')}
            type="tel"
            className="w-full px-4 py-3 rounded-xl border border-secondary/10 bg-white/50 focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
            placeholder="+1 (555) 000-0000"
          />
        </div>
      </div>

      {/* Attendance Status */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-secondary/80 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Attendance Status (Required)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className={`relative flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
            attendanceValue === 'Joyfully Accept' 
              ? 'border-accent bg-accent/5 ring-1 ring-accent' 
              : 'border-secondary/10 hover:border-accent/30'
          }`}>
            <input
              {...register('attendanceStatus')}
              type="radio"
              value="Joyfully Accept"
              className="sr-only"
            />
            <Heart className={`w-5 h-5 ${attendanceValue === 'Joyfully Accept' ? 'text-accent fill-accent' : 'text-secondary/30'}`} />
            <span className={`text-sm font-semibold ${attendanceValue === 'Joyfully Accept' ? 'text-secondary' : 'text-secondary/60'}`}>
              Joyfully Accept
            </span>
          </label>

          <label className={`relative flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
            attendanceValue === 'Regretfully Decline' 
              ? 'border-red-400 bg-red-50 ring-1 ring-red-400' 
              : 'border-secondary/10 hover:border-red-400/30'
          }`}>
            <input
              {...register('attendanceStatus')}
              type="radio"
              value="Regretfully Decline"
              className="sr-only"
            />
            <XCircle className={`w-5 h-5 ${attendanceValue === 'Regretfully Decline' ? 'text-red-500' : 'text-secondary/30'}`} />
            <span className={`text-sm font-semibold ${attendanceValue === 'Regretfully Decline' ? 'text-secondary' : 'text-secondary/60'}`}>
              Regretfully Decline
            </span>
          </label>
        </div>
        {errors.attendanceStatus && <p className="text-xs text-red-500">{errors.attendanceStatus.message}</p>}
      </div>

      {/* Well Wishes */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-secondary/80 flex items-center gap-2">
          <MessageSquare className="w-4 h-4" /> Well Wishes for the Child (Optional)
        </label>
        <textarea
          {...register('messageForCouple')}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-secondary/10 bg-white/50 focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all resize-none"
          placeholder="Share your warm thoughts for the little one..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-secondary text-primary rounded-xl font-semibold shadow-lg hover:bg-secondary/90 transition-all flex items-center justify-center gap-2 group"
      >
        {isSubmitting ? (
          <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        ) : (
          <>
            Submit RSVP
            <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
};
