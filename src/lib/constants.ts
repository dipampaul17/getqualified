// App Configuration
export const APP_CONFIG = {
  NAME: 'Qualified',
  DESCRIPTION: 'AI-powered lead qualification widget',
  VERSION: '1.0.0',
  WIDGET_SIZE_LIMIT: 4096, // 4KB in bytes
  LOAD_TIME_TARGET: 100, // 100ms
} as const;

// Plans and Limits
export const PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    leads: 100,
    features: ['Basic qualification', 'Email support'],
  },
  GROWTH: {
    name: 'Growth',
    price: 99,
    leads: 1000,
    features: ['Advanced qualification', 'A/B testing', 'Priority support'],
  },
  SCALE: {
    name: 'Scale',
    price: 299,
    leads: 10000,
    features: ['Custom questions', 'API access', 'Dedicated support'],
  },
} as const;

// Default Questions for Lead Qualification
export const DEFAULT_QUESTIONS = [
  {
    id: 'company-size',
    text: 'How many employees does your company have?',
    type: 'select',
    options: ['1-10', '11-50', '51-200', '201-1000', '1000+'],
    weight: 0.3,
  },
  {
    id: 'budget',
    text: 'What is your monthly budget for this solution?',
    type: 'select',
    options: ['< $1K', '$1K-$5K', '$5K-$10K', '$10K-$25K', '$25K+'],
    weight: 0.4,
  },
  {
    id: 'timeline',
    text: 'When are you looking to implement a solution?',
    type: 'select',
    options: ['Immediately', 'Within 1 month', 'Within 3 months', 'Within 6 months', 'Just exploring'],
    weight: 0.3,
  },
] as const;

// Scoring Thresholds
export const SCORING = {
  QUALIFIED_THRESHOLD: 0.7,
  HOT_LEAD_THRESHOLD: 0.85,
} as const;

// Industries
export const INDUSTRIES = {
  saas: 'SaaS / Software',
  ecommerce: 'E-commerce',
  agency: 'Agency / Services',
  consulting: 'Consulting',
  healthcare: 'Healthcare',
  fintech: 'Fintech',
  education: 'Education',
  retail: 'Retail',
  manufacturing: 'Manufacturing',
  other: 'Other',
} as const; 