'use client';

import { useEffect, useState, useCallback } from 'react';

export default function AdminSettingsPage() {
  /* --- Mock data state --- */
  const [pvMock, setPvMock] = useState(0);
  const [pvReal, setPvReal] = useState(0);
  const [inqMock, setInqMock] = useState(0);
  const [inqReal, setInqReal] = useState(0);
  const [mockLoading, setMockLoading] = useState(false);
  const [mockMsg, setMockMsg] = useState('');

  /* --- Password state --- */
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);

  /* --- Country blocking state --- */
  const [blockedCountries, setBlockedCountries] = useState<string[]>([]);
  const [countryInput, setCountryInput] = useState('');
  const [blockMsg, setBlockMsg] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const fetchMockStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/mock-data', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setPvMock(data.pageViews.mock);
        setPvReal(data.pageViews.real);
        setInqMock(data.inquiries.mock);
        setInqReal(data.inquiries.real);
      }
    } catch { /* ignore */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => { fetchMockStats(); }, [fetchMockStats]);

  // Fetch blocked countries
  const fetchBlockedCountries = useCallback(async () => {
    try {
      const res = await fetch('/api/settings', { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.blocked_countries) {
          setBlockedCountries(JSON.parse(data.blocked_countries));
        }
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetchBlockedCountries(); }, [fetchBlockedCountries]);

  const handleAddCountry = async () => {
    const country = countryInput.trim();
    if (!country || blockedCountries.includes(country)) return;
    const updated = [...blockedCountries, country];
    setBlockedCountries(updated);
    setCountryInput('');
    try {
      await fetch('/api/settings', {
        method: 'POST', headers,
        body: JSON.stringify({ key: 'blocked_countries', value: JSON.stringify(updated) }),
      });
      setBlockMsg(`Added "${country}" to blocked list.`);
    } catch { setBlockMsg('Failed to update.'); }
    setTimeout(() => setBlockMsg(''), 3000);
  };

  const handleRemoveCountry = async (country: string) => {
    const updated = blockedCountries.filter(c => c !== country);
    setBlockedCountries(updated);
    try {
      await fetch('/api/settings', {
        method: 'POST', headers,
        body: JSON.stringify({ key: 'blocked_countries', value: JSON.stringify(updated) }),
      });
      setBlockMsg(`Removed "${country}" from blocked list.`);
    } catch { setBlockMsg('Failed to update.'); }
    setTimeout(() => setBlockMsg(''), 3000);
  };

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
        if (action === 'clear') {
          setMockMsg(`Cleared ${data.deleted.pageViews} page views + ${data.deleted.inquiries} inquiries.`);
        } else {
          setMockMsg(`Generated ${data.generated.pageViews.toLocaleString()} page views + ${data.generated.inquiries} inquiries.`);
        }
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{(pvMock + pvReal).toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Page Views Total</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-orange-600">{pvMock.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Page Views Mock</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{(inqMock + inqReal).toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Inquiries Total</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-orange-600">{inqMock.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Inquiries Mock</p>
            </div>
          </div>
          <p className="text-xs text-gray-400">Real data: {pvReal.toLocaleString()} page views, {inqReal.toLocaleString()} inquiries — these are <strong>never</strong> deleted.</p>

          {/* Info box */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700 flex items-start gap-2">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-medium">How it works</p>
              <p className="mt-0.5">Mock data is tagged separately from real data. Clearing mock data will <strong>only</strong> remove demo records — real traffic and inquiries from actual visitors are never affected. Generates ~9,000 page views + 35 inquiries.</p>
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
                if (window.confirm(`Are you sure you want to delete ${pvMock.toLocaleString()} mock page views and ${inqMock.toLocaleString()} mock inquiries? Real data will not be affected.`)) {
                  handleMockAction('clear');
                }
              }}
              disabled={mockLoading || (pvMock === 0 && inqMock === 0)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-red-600 text-sm font-medium rounded-lg border border-red-200 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear Mock Data ({(pvMock + inqMock).toLocaleString()})
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

      {/* ===== Country Blocking ===== */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-800">Country Blocking</h2>
          {blockMsg && <span className="text-xs text-green-600 font-medium">{blockMsg}</span>}
        </div>
        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-gray-500">
            Block visitors from specific countries. Uses the <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">x-vercel-ip-country</code> header for detection.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={countryInput}
              onChange={(e) => setCountryInput(e.target.value.toUpperCase())}
              placeholder="Country code (e.g. CN, RU, IN)"
              maxLength={2}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleAddCountry()}
            />
            <button
              onClick={handleAddCountry}
              disabled={!countryInput.trim()}
              className="px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Block
            </button>
          </div>
          {blockedCountries.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {blockedCountries.map((code) => (
                <span key={code} className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-red-100">
                  <img src={`https://flagcdn.com/16x12/${code.toLowerCase()}.png`} alt={code} className="w-4 h-3" />
                  {code}
                  <button onClick={() => handleRemoveCountry(code)} className="ml-1 text-red-400 hover:text-red-600" title="Unblock">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">No countries blocked.</p>
          )}
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
