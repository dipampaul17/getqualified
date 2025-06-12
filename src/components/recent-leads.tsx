import { createClient } from '@/lib/supabase-auth';
import Link from 'next/link';

export async function RecentLeads({ accountId }: { accountId: string }) {
  // Check if we're in development mode without Supabase
  const isDevMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');
  
  if (isDevMode) {
    // Mock data for development
    const mockLeads = [
      {
        id: '1',
        visitor_id: 'v_123',
        qualified: true,
        score: 0.85,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        page_url: 'https://example.com/pricing',
        answers: [
          { id: 'use_case', text: 'What specific challenge are you looking to solve?', answer: 'We need to automate our lead qualification process' },
          { id: 'timeline', text: 'When do you need a solution in place?', answer: 'Within the next month' },
          { id: 'decision', text: 'Who else is involved in this decision?', answer: 'I am the decision maker' }
        ]
      },
      {
        id: '2',
        visitor_id: 'v_456',
        qualified: true,
        score: 0.72,
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        page_url: 'https://example.com/features',
        answers: [
          { id: 'use_case', text: 'What specific challenge are you looking to solve?', answer: 'Better lead scoring and conversion' },
          { id: 'timeline', text: 'When do you need a solution in place?', answer: 'Next quarter' },
          { id: 'decision', text: 'Who else is involved in this decision?', answer: 'Need to discuss with team' }
        ]
      },
      {
        id: '3',
        visitor_id: 'v_789',
        qualified: true,
        score: 0.91,
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        page_url: 'https://example.com/demo',
        answers: [
          { id: 'use_case', text: 'What specific challenge are you looking to solve?', answer: 'Scale our sales process efficiently' },
          { id: 'timeline', text: 'When do you need a solution in place?', answer: 'Immediately' },
          { id: 'decision', text: 'Who else is involved in this decision?', answer: 'I have full authority' }
        ]
      }
    ];
    
    return <RecentLeadsContent leads={mockLeads} />;
  }

  const client = await createClient();
  
  // Get recent qualified leads (last 30 days, limit 10)
  const { data: leads } = await client
    .from('responses')
    .select('id, visitor_id, qualified, score, created_at, page_url, answers')
    .eq('account_id', accountId)
    .eq('qualified', true)
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: false })
    .limit(10);
    
  return <RecentLeadsContent leads={leads || []} />;
}

function RecentLeadsContent({ leads }: { 
  leads: Array<{
    id: string;
    visitor_id: string;
    qualified: boolean;
    score: number;
    created_at: string;
    page_url: string;
    answers: Array<{ id: string; text: string; answer: string }>;
  }>
}) {
  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          👥
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No qualified leads yet</h3>
        <p className="text-gray-600 mb-6">
          Once visitors complete your qualification form, qualified leads will appear here.
        </p>
        <div className="text-sm text-gray-500">
          💡 Tip: Share your website with the widget installed to start collecting leads
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lead
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                When
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.map((lead) => (
              <LeadRow key={lead.id} lead={lead} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LeadRow({ lead }: {
  lead: {
    id: string;
    visitor_id: string;
    score: number;
    created_at: string;
    page_url: string;
    answers: Array<{ id: string; text: string; answer: string }>;
  }
}) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else {
      return 'Just now';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-100';
    if (score >= 0.7) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  const primaryAnswer = lead.answers.find(a => 
    a.id === 'use_case' || a.id === 'intent'
  )?.answer || 'No details available';

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">
                {lead.visitor_id.slice(-2).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              Visitor {lead.visitor_id.slice(-4)}
            </div>
            <div className="text-sm text-gray-500 max-w-xs truncate">
              {primaryAnswer}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreColor(lead.score)}`}>
          {Math.round(lead.score * 100)}%
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {getDomain(lead.page_url)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatTime(lead.created_at)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <Link 
          href={`/dashboard/leads/${lead.id}`}
          className="text-blue-600 hover:text-blue-900 transition-colors"
        >
          View details
        </Link>
      </td>
    </tr>
  );
} 