/**
 * Zod validation schemas for the giveaways system
 */

import { z } from 'zod';

const phoneRegex = /^[\d\s\-\(\)+]+$/;
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const giveawayEntrySchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  email: z.string().email('Please enter a valid email address').max(255),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(20)
    .regex(phoneRegex, 'Please enter a valid phone number'),
  address_line1: z.string().min(1, 'Street address is required').max(200),
  address_line2: z.string().max(200).optional().or(z.literal('')),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(2, 'State is required').max(50),
  zip: z.string().min(3, 'ZIP/postal code is required').max(20),
  has_used_service: z.boolean(),
  has_app: z.boolean().nullable().optional(),
  knows_apple_music: z.boolean(),
  knows_spotify: z.boolean(),
});

export type GiveawayEntryData = z.infer<typeof giveawayEntrySchema>;

export const giveawayUpsertSchema = z.object({
  slug: z.string()
    .min(1, 'Slug is required')
    .max(100)
    .regex(slugRegex, 'Slug must be lowercase letters, numbers, and dashes only'),
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).optional().or(z.literal('')),
  prize_description: z.string().max(2000).optional().or(z.literal('')),
  social_post_url: z.string().url('Must be a valid URL').max(500).optional().or(z.literal('')),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  active: z.boolean(),
}).refine(
  (data) => new Date(data.end_date).getTime() > new Date(data.start_date).getTime(),
  { message: 'End date must be after start date', path: ['end_date'] }
);

export type GiveawayUpsertData = z.infer<typeof giveawayUpsertSchema>;
