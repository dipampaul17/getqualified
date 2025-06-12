'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Mail, Calendar, MapPin, Monitor, Clock, Globe, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface LeadDetail {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  website: string;
  score: number;
  status: 'qualified' | 'not_qualified' | 'pending';
  created_at: string;
  responses: Record<string, any>;
  metadata?: {
    browser?: string;
    device?: string;
    location?: string;
    ip_address?: string;
    user_agent?: string;
    session_duration?: number;
    pages_viewed?: number;
  };
  conversation?: Array<{
    question: string;
    answer: string;
    timestamp: string;
  }>;
}

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [leadId, setLeadId] = useState<string | null>(null);

  useEffect(() => {
    params.then(p => setLeadId(p.id));
  }, [params]);

  useEffect(() => {
    if (leadId) {
      fetchLead();
    }
  }, [leadId]);

  const fetchLead = async () => {
    try {
      const response = await fetch(`/api/leads/${leadId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch lead');
      }
      const data = await response.json();
      setLead(data);
    } catch (error) {
      console.error('Error fetching lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'qualified':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'not_qualified':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'qualified':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'not_qualified':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-zinc-900"></div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-zinc-900 mb-2">Lead not found</h2>
          <Button onClick={() => router.push('/dashboard')} variant="outline">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div className="h-6 w-px bg-zinc-200" />
              <h1 className="text-lg font-semibold text-zinc-900">Lead Details</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Schedule
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Lead Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white rounded-lg border border-zinc-200 p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-zinc-900">{lead.company_name}</h2>
                  <p className="text-zinc-600 mt-1">{lead.contact_name} • {lead.email}</p>
                  {lead.website && (
                    <a 
                      href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1 mt-1"
                    >
                      <Globe className="w-4 h-4" />
                      {lead.website}
                    </a>
                  )}
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(lead.status)}`}>
                  {getStatusIcon(lead.status)}
                  <span className="text-sm font-medium capitalize">
                    {lead.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Score */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-zinc-600">Lead Score</span>
                  <span className="text-2xl font-bold text-zinc-900">{lead.score}</span>
                </div>
                <div className="w-full bg-zinc-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      lead.score >= 80 ? 'bg-green-600' : 
                      lead.score >= 60 ? 'bg-yellow-600' : 
                      'bg-red-600'
                    }`}
                    style={{ width: `${lead.score}%` }}
                  />
                </div>
              </div>

              {/* Key Responses */}
              <div>
                <h3 className="text-sm font-medium text-zinc-900 mb-3">Key Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(lead.responses).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-sm text-zinc-600 capitalize">
                        {key.replace(/_/g, ' ')}
                      </p>
                      <p className="text-sm font-medium text-zinc-900">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Conversation Timeline */}
            {lead.conversation && lead.conversation.length > 0 && (
              <div className="bg-white rounded-lg border border-zinc-200 p-6">
                <h3 className="text-lg font-semibold text-zinc-900 mb-4">Conversation Timeline</h3>
                <div className="space-y-4">
                  {lead.conversation.map((item, index) => (
                    <div key={index} className="border-l-2 border-zinc-200 pl-4 ml-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-zinc-900">{item.question}</p>
                          <p className="text-sm text-zinc-700 mt-1 bg-zinc-50 p-3 rounded-lg">
                            {item.answer}
                          </p>
                        </div>
                        <span className="text-xs text-zinc-500 ml-4">
                          {formatDate(item.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Metadata */}
          <div className="space-y-6">
            {/* Session Info */}
            <div className="bg-white rounded-lg border border-zinc-200 p-6">
              <h3 className="text-sm font-medium text-zinc-900 mb-4">Session Information</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Submitted
                  </span>
                  <span className="text-sm text-zinc-900">
                    {formatDate(lead.created_at)}
                  </span>
                </div>
                
                {lead.metadata?.session_duration && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-600">Duration</span>
                    <span className="text-sm text-zinc-900">
                      {formatDuration(lead.metadata.session_duration)}
                    </span>
                  </div>
                )}
                
                {lead.metadata?.pages_viewed && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-600">Pages Viewed</span>
                    <span className="text-sm text-zinc-900">{lead.metadata.pages_viewed}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Technical Info */}
            <div className="bg-white rounded-lg border border-zinc-200 p-6">
              <h3 className="text-sm font-medium text-zinc-900 mb-4">Technical Details</h3>
              <div className="space-y-3">
                {lead.metadata?.browser && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-600">Browser</span>
                    <span className="text-sm text-zinc-900">{lead.metadata.browser}</span>
                  </div>
                )}
                
                {lead.metadata?.device && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-600 flex items-center gap-2">
                      <Monitor className="w-4 h-4" />
                      Device
                    </span>
                    <span className="text-sm text-zinc-900">{lead.metadata.device}</span>
                  </div>
                )}
                
                {lead.metadata?.location && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-600 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Location
                    </span>
                    <span className="text-sm text-zinc-900">{lead.metadata.location}</span>
                  </div>
                )}
                
                {lead.metadata?.ip_address && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-600">IP Address</span>
                    <span className="text-sm text-zinc-900 font-mono text-xs">
                      {lead.metadata.ip_address}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg border border-zinc-200 p-6">
              <h3 className="text-sm font-medium text-zinc-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Follow-up Email
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Demo
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700" size="sm">
                  Archive Lead
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 