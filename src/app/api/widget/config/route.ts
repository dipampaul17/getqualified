import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-auth';
import { cookies } from 'next/headers';
import { kv } from '@vercel/kv';

interface WidgetConfig {
  theme: {
    primaryColor: string;
    position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    buttonText: string;
    welcomeMessage: string;
  };
  questions: Array<{
    id: string;
    text: string;
    type: 'text' | 'select' | 'email' | 'phone';
    options?: string[];
    required: boolean;
    order: number;
  }>;
  behavior: {
    showAfterSeconds: number;
    showOnExitIntent: boolean;
    hideOnMobile: boolean;
    collectEmail: boolean;
    requireEmail: boolean;
  };
  notifications: {
    emailAlerts: boolean;
    alertEmails: string[];
    slackWebhook?: string;
    webhookUrl?: string;
  };
}

// Default configuration for new accounts
const DEFAULT_CONFIG: WidgetConfig = {
  theme: {
    primaryColor: '#000000',
    position: 'bottom-right',
    buttonText: 'Chat with us',
    welcomeMessage: 'Hi! Let us help you find the perfect solution.',
  },
  questions: [
    {
      id: 'use_case',
      text: 'What brings you here today?',
      type: 'text',
      required: true,
      order: 1,
    },
    {
      id: 'company_size',
      text: 'How large is your company?',
      type: 'select',
      options: ['1-10', '11-50', '51-200', '201-1000', '1000+'],
      required: true,
      order: 2,
    },
    {
      id: 'timeline',
      text: 'When are you looking to implement a solution?',
      type: 'select',
      options: ['Immediately', 'This month', 'This quarter', 'This year', 'Just researching'],
      required: true,
      order: 3,
    },
    {
      id: 'email',
      text: 'What\'s your email?',
      type: 'email',
      required: true,
      order: 4,
    },
  ],
  behavior: {
    showAfterSeconds: 30,
    showOnExitIntent: true,
    hideOnMobile: false,
    collectEmail: true,
    requireEmail: true,
  },
  notifications: {
    emailAlerts: true,
    alertEmails: [],
    slackWebhook: undefined,
    webhookUrl: undefined,
  },
};

export async function GET(request: NextRequest) {
  try {
    // Check for API key in header (for widget requests)
    const apiKey = request.headers.get('x-api-key');
    
    if (apiKey) {
      // Widget is requesting config
      const cachedConfig = await kv.get(`widget:config:${apiKey}`);
      if (cachedConfig) {
        return NextResponse.json(cachedConfig);
      }
      
      // If not in cache, return default (in production would fetch from DB)
      await kv.set(`widget:config:${apiKey}`, DEFAULT_CONFIG, { ex: 300 }); // Cache for 5 minutes
      return NextResponse.json(DEFAULT_CONFIG);
    }
    
    // Dashboard request - get session
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const session = JSON.parse(sessionCookie.value);
    const accountId = session.accountId;
    
    // Get config from cache or database
    const config = await kv.get(`widget:config:account:${accountId}`);
    if (config) {
      return NextResponse.json(config);
    }
    
    // Return default config with user's email
    const defaultWithEmail = {
      ...DEFAULT_CONFIG,
      notifications: {
        ...DEFAULT_CONFIG.notifications,
        alertEmails: [session.user.email],
      },
    };
    
    return NextResponse.json(defaultWithEmail);
  } catch (error) {
    console.error('Widget config error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get session from cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const session = JSON.parse(sessionCookie.value);
    const accountId = session.accountId;
    
    // Get updated config from request
    const updatedConfig: Partial<WidgetConfig> = await request.json();
    
    // Validate config structure
    if (updatedConfig.theme) {
      if (updatedConfig.theme.primaryColor && !/^#[0-9A-F]{6}$/i.test(updatedConfig.theme.primaryColor)) {
        return NextResponse.json({ error: 'Invalid color format' }, { status: 400 });
      }
    }
    
    // Get current config
    const currentConfig = await kv.get(`widget:config:account:${accountId}`) || DEFAULT_CONFIG;
    
    // Merge configs
    const newConfig = {
      ...currentConfig as WidgetConfig,
      ...updatedConfig,
      theme: {
        ...(currentConfig as WidgetConfig).theme,
        ...updatedConfig.theme,
      },
      behavior: {
        ...(currentConfig as WidgetConfig).behavior,
        ...updatedConfig.behavior,
      },
      notifications: {
        ...(currentConfig as WidgetConfig).notifications,
        ...updatedConfig.notifications,
      },
    };
    
    // Save to cache
    await kv.set(`widget:config:account:${accountId}`, newConfig);
    
    // Also update the API key cache
    if (process.env.NODE_ENV !== 'development') {
      const supabase = await createClient();
      const { data: account } = await supabase
        .from('accounts')
        .select('api_key')
        .eq('id', accountId)
        .single();
      
      if (account?.api_key) {
        await kv.set(`widget:config:${account.api_key}`, newConfig, { ex: 300 });
      }
    }
    
    return NextResponse.json({
      success: true,
      config: newConfig,
    });
  } catch (error) {
    console.error('Widget config update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 