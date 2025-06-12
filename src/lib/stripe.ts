import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
  typescript: true,
});

export const STRIPE_PRICES = {
  GROWTH: process.env.STRIPE_PRICE_GROWTH!,
  SCALE: process.env.STRIPE_PRICE_SCALE!,
} as const; 