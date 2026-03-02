'use client';

import { useEffect, useState, useCallback } from 'react';

export default function AdminSettingsPage() {
  /* --- Mock data state --- */
  const [mockCount, setMockCount] = useState(0);
  const [realCount, setRealCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [mockLoading, setMockLoading] = useState(false);
  const [mockMsg, setMockMsg] = useState('');

  /* --- Password state --- */
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const fetchMockStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/mock-data', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setMockCount(data.mockCount);
        setRealCount(data.realCount);
        setTotalCount(data.totalCount);
      }
    } catch { /* ignore */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => { fetchMockStats(); }, [fetchMockStats]);

  const handleMockAction = async (action: 'clear' | 'generate') => {
    setMockLoading(true);
    setMockMsg('');
    try {
      const res = await fetch('/api/admin/mock-data', {
        method: 'POST',
        headers,
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (res.ok) {
        setMockMsg(action === 'clear' ? `Cleared ${data.deleted} mock records.` : `Generated ${data.generated} mock records.`);
        fetchMockStats();
      } else {
        setMockMsg(data.error || 'Operation failed.');
      }
    } catch {
      setMockMsg('Network error.');
    }
    setMockLoading(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess('');

    if (newPwd.length < 6) { setPwdError('Password must be at least 6 characters.'); return; }
    if (newPwd !== confirmPwd) { setPwdError('Passwords do not match.'); return; }

    setPwdLoading(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers,
        body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd }),
      });
      const data = await res.json();
      if (res.ok) {
        setPwdSuccess('Password changed successfully!');
        setCurrentPwd('');
        setNewPwd('');
        setConfirmPwd('');
      } else {
        setPwdError(data.error || 'Failed to change password.');
      }
    } catch {
      setPwdError('Network error.');
    }
    setPwdLoading(false);
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* ===== Mock Data Management ===== */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h2 className="text-sm font-semibold text-gray-800">Analytics Mock Data</h2>
          <p className="text-xs text-gray-400 mt-1">Manage demo data for the analytics dashboard. Real visitor data is preserved when clearing mock data.</p>
        </div>
        <div className="px-6 py-5 space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{totalCount.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Total Records</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-orange-600">{mockCount.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Mock Data</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{realCount.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Real Data</p>
            </div>
          </div>

          {/* Info box */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700 flex items-start gap-2">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-medium">How it works</p>
              <p className="mt-0.5">Mock data is tagged separately from real visitor data. Clearing mock data will <strong>only</strong> remove demo records — real traffic data from actual visitors is never affected.</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleMockAction('generate')}
              disabled={mockLoading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {mockLoading ? 'Processing...' : 'Generate Mock Data'}
            </button>
            <button
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete ${mockCount.toLocaleString()} mock records? Real data will not be affected.`)) {
                  handleMockAction('clear');
                }
              }}
              disabled={mockLoading || mockCount === 0}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-red-600 text-sm font-medium rounded-lg border border-red-200 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear Mock Data ({mockCount.toLocaleString()})
            </button>
          </div>

          {mockMsg && (
            <p className={`text-sm font-medium ${mockMsg.includes('error') || mockMsg.includes('failed') ? 'text-red-500' : 'text-green-600'}`}>
              {mockMsg}
            </p>
          )}
        </div>
      </div>

      {/* ===== Change Password ===== */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h2 className="text-sm font-semibold text-gray-800">Change Password</h2>
          <p className="text-xs text-gray-400 mt-1">Keep your account secure by using a strong password.</p>
        </div>
        <div className="px-6 py-5">
          <form onSubmit={handlePasswordChange} className="max-w-sm space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Current Password</label>
              <input
                type="password"
                value={currentPwd}
                onChange={e => setCurrentPwd(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">New Password</label>
              <input
                type="password"
                value={newPwd}
                onChange={e => setNewPwd(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors"
                minLength={6}
                required
              />
              <p className="text-[11px] text-gray-400 mt-1">Minimum 6 characters</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPwd}
                onChange={e => setConfirmPwd(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors"
                minLength={6}
                required
              />
            </div>

            {pwdError && <p className="text-sm text-red-500">{pwdError}</p>}
            {pwdSuccess && <p className="text-sm text-green-600">{pwdSuccess}</p>}

            <button
              type="submit"
              disabled={pwdLoading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              {pwdLoading ? 'Saving...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>

      {/* ===== Security Tips ===== */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h2 className="text-sm font-semibold text-gray-800">Security Notes</h2>
        </div>
        <div className="px-6 py-5 space-y-3 text-sm text-gray-600">
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
            <p>Passwords are hashed with <strong>bcrypt</strong> — never stored in plain text.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
            <p>Login is rate-limited — <strong>5 failed attempts</strong> will lock out for 15 minutes.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
            <p>Sessions expire after <strong>8 hours</strong> automatically.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">!</span>
            <p>For production, set a <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">JWT_SECRET</code> environment variable in your Vercel dashboard.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
