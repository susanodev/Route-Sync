import { useState } from 'react';
import { User, Phone, Mail, CreditCard as Edit2, Check, X, LogOut, Star, Navigation, Leaf } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function Profile({ onSignOut }: { onSignOut: () => void }) {
  const { user, profile, refreshProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSaveError('');
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, phone })
      .eq('id', user.id);
    if (error) { setSaveError(error.message); }
    else { await refreshProfile(); setEditing(false); }
    setSaving(false);
  };

  const stats = [
    { label: 'Total Rides', value: profile?.total_rides ?? 0, icon: <Navigation className="w-5 h-5" />, color: 'emerald' },
    { label: 'CO2 Saved', value: `${((profile?.total_rides ?? 0) * 1.2).toFixed(1)} kg`, icon: <Leaf className="w-5 h-5" />, color: 'teal' },
    { label: 'Avg Rating', value: '4.9', icon: <Star className="w-5 h-5" />, color: 'amber' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-500 mt-1">Manage your account and preferences</p>
        </div>

        {/* Profile card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          {/* Top banner */}
          <div className="h-24 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(16,185,129,0.2),_transparent_60%)]" />
          </div>

          {/* Avatar */}
          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-8 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg border-4 border-white">
                {profile?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <button
                onClick={() => editing ? (setEditing(false)) : setEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                    />
                  </div>
                </div>

                {saveError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl text-sm text-red-600">
                    <X className="w-4 h-4" /> {saveError}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setEditing(false)}
                    className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
                  >
                    {saving ? 'Saving...' : <><Check className="w-4 h-4" /> Save Changes</>}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{profile?.full_name || 'No name set'}</h2>
                  <p className="text-sm text-gray-500 mt-0.5">EcoRide Member</p>
                </div>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2.5 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {user?.email}
                  </div>
                  {profile?.phone && (
                    <div className="flex items-center gap-2.5 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {profile.phone}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {stats.map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
              <div className={`w-10 h-10 mx-auto mb-3 rounded-xl bg-${s.color}-50 flex items-center justify-center text-${s.color}-500`}>
                {s.icon}
              </div>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Member since */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Account Details</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
              <span className="text-sm text-gray-500">Member Since</span>
              <span className="text-sm font-medium text-gray-800">
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '—'}
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
              <span className="text-sm text-gray-500">Account Status</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">Active</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-sm text-gray-500">Plan</span>
              <span className="text-sm font-medium text-gray-800">Standard</span>
            </div>
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={onSignOut}
          className="w-full flex items-center justify-center gap-2 py-3.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
