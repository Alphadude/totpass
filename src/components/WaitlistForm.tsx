import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Baby, User, Mail, Phone, Users, MessageSquare, CheckCircle2 } from 'lucide-react';
import { storageService } from '../services/storage';

const formSchema = z.object({
  parentName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
  babyName: z.string().min(2, 'Please enter the baby\'s name'),
  expectedGuests: z.number().min(1, 'At least 1 guest required').max(20, 'Maximum 20 guests'),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface WaitlistFormProps {
  onSuccess: () => void;
}

export const WaitlistForm: React.FC<WaitlistFormProps> = ({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      expectedGuests: 1,
    },
  });

  const onSubmit = async (data: FormData) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    storageService.addEntry(data);
    reset();
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Parent Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-secondary/80 flex items-center gap-2">
            <User className="w-4 h-4" /> Parent/Guardian Name
          </label>
          <input
            {...register('parentName')}
            className={`w-full px-4 py-3 rounded-xl border bg-white/50 focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all ${
              errors.parentName ? 'border-red-400' : 'border-secondary/10'
            }`}
            placeholder="John Doe"
          />
          {errors.parentName && <p className="text-xs text-red-500">{errors.parentName.message}</p>}
        </div>

        {/* Baby's Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-secondary/80 flex items-center gap-2">
            <Baby className="w-4 h-4" /> Baby's Name
          </label>
          <input
            {...register('babyName')}
            className={`w-full px-4 py-3 rounded-xl border bg-white/50 focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all ${
              errors.babyName ? 'border-red-400' : 'border-secondary/10'
            }`}
            placeholder="Little One's Name"
          />
          {errors.babyName && <p className="text-xs text-red-500">{errors.babyName.message}</p>}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-secondary/80 flex items-center gap-2">
            <Mail className="w-4 h-4" /> Email Address
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
            <Phone className="w-4 h-4" /> Phone Number
          </label>
          <input
            {...register('phone')}
            type="tel"
            className={`w-full px-4 py-3 rounded-xl border bg-white/50 focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all ${
              errors.phone ? 'border-red-400' : 'border-secondary/10'
            }`}
            placeholder="+1 (555) 000-0000"
          />
          {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
        </div>

        {/* Expected Guests */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-secondary/80 flex items-center gap-2">
            <Users className="w-4 h-4" /> Number of Guests
          </label>
          <input
            {...register('expectedGuests', { valueAsNumber: true })}
            type="number"
            className={`w-full px-4 py-3 rounded-xl border bg-white/50 focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all ${
              errors.expectedGuests ? 'border-red-400' : 'border-secondary/10'
            }`}
            min="1"
          />
          {errors.expectedGuests && <p className="text-xs text-red-500">{errors.expectedGuests.message}</p>}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-secondary/80 flex items-center gap-2">
          <MessageSquare className="w-4 h-4" /> Special Notes / Prayer Requests
        </label>
        <textarea
          {...register('notes')}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-secondary/10 bg-white/50 focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all resize-none"
          placeholder="Anything you'd like us to know..."
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
            Join Waitlist
            <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
};
