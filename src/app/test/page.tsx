'use client';

import { useState, useEffect } from 'react';

export default function TestPage() {
  const [mounted, setMounted] = useState(false);
  const [count, setCount] = useState(0);
  const [clientInfo, setClientInfo] = useState({
    userAgent: '',
    viewport: '',
  });

  useEffect(() => {
    setMounted(true);
    // Set client-side only values after mounting
    setClientInfo({
      userAgent: window.navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
    });
    console.log('React hydrated successfully!');
  }, []);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          React Hydration Test
        </h1>
        
        <div className="space-y-6">
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">
              Hydration Status
            </h2>
            <p className="text-blue-800">
              React is {mounted ? '✅ WORKING' : '❌ NOT HYDRATED'}
            </p>
            {mounted && (
              <p className="text-green-600 mt-2">
                JavaScript is executing properly!
              </p>
            )}
          </div>

          <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
            <h2 className="text-xl font-semibold text-green-900 mb-4">
              Interactive Test
            </h2>
            <p className="text-green-800 mb-4">
              Click count: {count}
            </p>
            <button 
              onClick={() => setCount(c => c + 1)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Click me to test interactivity
            </button>
          </div>

          <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h2 className="text-xl font-semibold text-yellow-900 mb-4">
              Styling Test
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-lg">
                <p>If you see this styled properly with gradients and colors, Tailwind CSS is working!</p>
              </div>
              <div className="p-4 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-700">This should be a dashed border with gray background</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
            <h2 className="text-xl font-semibold text-red-900 mb-4">
              Troubleshooting
            </h2>
            <div className="space-y-2 text-red-800">
              <p>• Open browser console (F12) and check for JavaScript errors</p>
              <p>• Ensure JavaScript is enabled in your browser</p>
              <p>• Try refreshing the page (Cmd+R or Ctrl+R)</p>
              <p>• Try a different browser (Chrome, Firefox, Safari)</p>
              <p>• Check if ad blockers are interfering</p>
            </div>
          </div>

          <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Technical Details
            </h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p>User Agent: <span className="font-mono">{mounted ? clientInfo.userAgent : 'Loading...'}</span></p>
              <p>Viewport: <span className="font-mono">{mounted ? clientInfo.viewport : 'Loading...'}</span></p>
              <p>React Env: <span className="font-mono">{process.env.NODE_ENV}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 