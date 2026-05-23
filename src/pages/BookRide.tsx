import { useState, useEffect } from 'react';
import { MapPin, Navigation, Zap, Star, Clock, IndianRupee, ArrowRight, CheckCircle, X, User, Phone } from 'lucide-react';
import { supabase, Driver, Ride } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

type Step = 'form' | 'searching' | 'found' | 'confirmed';

const POPULAR_LOCATIONS = [
  'Connaught Place, New Delhi',
  'India Gate, New Delhi',
  'Lajpat Nagar Market',
  'Saket Metro Station',
  'Karol Bagh',
  'Dwarka Sector 21',
];

function calcFare(km: number) {
  return Math.round(25 + km * 10);
}

function calcDuration(km: number) {
  return Math.round(km * 4 + 3);
}

export default function BookRide({ onAuthRequired }: { onAuthRequired: () => void }) {
  const { user, profile, refreshProfile } = useAuth();
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [step, setStep] = useState<Step>('form');
  const [driver, setDriver] = useState<Driver | null>(null);
  const [currentRide, setCurrentRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedInput, setFocusedInput] = useState<'pickup' | 'dropoff' | null>(null);

  const estimatedKm = 2.4 + Math.random() * 3;
  const fare = calcFare(estimatedKm);
  const duration = calcDuration(estimatedKm);

  useEffect(() => {
    if (step === 'searching') {
      const timer = setTimeout(() => {
        loadDriver();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const loadDriver = async () => {
    const { data } = await supabase
      .from('drivers')
      .select('*')
      .eq('is_available', true)
      .limit(5);

    if (data && data.length > 0) {
      const picked = data[Math.floor(Math.random() * data.length)];
      setDriver(picked);
      setStep('found');
    } else {
      setError('No drivers available right now. Please try again.');
      setStep('form');
    }
  };

  const handleSearch = () => {
    if (!user) { onAuthRequired(); return; }
    if (!pickup.trim() || !dropoff.trim()) {
      setError('Please enter both pickup and dropoff locations.');
      return;
    }
    setError('');
    setStep('searching');
  };

  const handleConfirm = async () => {
    if (!user || !driver) return;
    setLoading(true);
    try {
      const { data, error: rideError } = await supabase
        .from('rides')
        .insert({
          user_id: user.id,
          driver_id: driver.id,
          pickup_address: pickup,
          dropoff_address: dropoff,
          status: 'accepted',
          fare,
          distance_km: parseFloat(estimatedKm.toFixed(2)),
          duration_min: duration,
        })
        .select()
        .maybeSingle();

      if (rideError) throw rideError;
      setCurrentRide(data);
      setStep('confirmed');
      refreshProfile();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to confirm ride');
    }
    setLoading(false);
  };

  const handleNewRide = () => {
    setPickup('');
    setDropoff('');
    setDriver(null);
    setCurrentRide(null);
    setStep('form');
    setError('');
  };

  const filteredLocations = (input: string) =>
    POPULAR_LOCATIONS.filter(l => l.toLowerCase().includes(input.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Book a Ride</h1>
          <p className="text-gray-500 mt-1">
            {profile ? `Welcome, ${profile.full_name}` : 'Enter your route and find an e-rickshaw instantly'}
          </p>
        </div>

        {/* Step: Form */}
        {step === 'form' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 space-y-4">
              {/* Pickup */}
              <div className="relative">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Pickup Location</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <input
                    type="text"
                    value={pickup}
                    onChange={e => setPickup(e.target.value)}
                    onFocus={() => setFocusedInput('pickup')}
                    onBlur={() => setTimeout(() => setFocusedInput(null), 150)}
                    placeholder="Enter pickup location"
                    className="w-full pl-8 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                  />
                </div>
                {focusedInput === 'pickup' && pickup && filteredLocations(pickup).length > 0 && (
                  <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-lg z-10 overflow-hidden">
                    {filteredLocations(pickup).map(loc => (
                      <button key={loc} onMouseDown={() => setPickup(loc)} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 text-left">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" /> {loc}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="relative flex items-center gap-3 pl-[11px]">
                <div className="flex flex-col gap-1">
                  <div className="w-0.5 h-3 bg-gray-200 mx-auto" />
                  <div className="w-0.5 h-3 bg-gray-200 mx-auto" />
                </div>
              </div>

              {/* Dropoff */}
              <div className="relative">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Drop Location</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <input
                    type="text"
                    value={dropoff}
                    onChange={e => setDropoff(e.target.value)}
                    onFocus={() => setFocusedInput('dropoff')}
                    onBlur={() => setTimeout(() => setFocusedInput(null), 150)}
                    placeholder="Enter drop location"
                    className="w-full pl-8 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                  />
                </div>
                {focusedInput === 'dropoff' && dropoff && filteredLocations(dropoff).length > 0 && (
                  <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-lg z-10 overflow-hidden">
                    {filteredLocations(dropoff).map(loc => (
                      <button key={loc} onMouseDown={() => setDropoff(loc)} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 text-left">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" /> {loc}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Fare estimate */}
            {pickup && dropoff && (
              <div className="mx-6 mb-4 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-emerald-700">
                    <Zap className="w-4 h-4" />
                    <span className="font-medium">Estimated Fare</span>
                  </div>
                  <div className="flex items-center gap-1 font-bold text-emerald-700">
                    <IndianRupee className="w-4 h-4" />
                    <span>{fare}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-xs text-emerald-600">
                    <Navigation className="w-3 h-3" />
                    {estimatedKm.toFixed(1)} km
                  </div>
                  <div className="flex items-center gap-1 text-xs text-emerald-600">
                    <Clock className="w-3 h-3" />
                    ~{duration} min
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mx-6 mb-4 flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                <X className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="p-6 pt-0">
              <button
                onClick={handleSearch}
                disabled={!pickup || !dropoff}
                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-gray-300 disabled:to-gray-300 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200 disabled:shadow-none transition-all duration-200 disabled:cursor-not-allowed"
              >
                Find Available Rides
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick locations */}
            <div className="px-6 pb-6">
              <p className="text-xs font-medium text-gray-400 mb-3">Popular Locations</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_LOCATIONS.slice(0, 4).map(loc => (
                  <button
                    key={loc}
                    onClick={() => pickup ? setDropoff(loc) : setPickup(loc)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 hover:border-emerald-300 hover:text-emerald-600 transition-colors"
                  >
                    <MapPin className="w-3 h-3" />
                    {loc.split(',')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step: Searching */}
        {step === 'searching' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-100 animate-ping" />
              <div className="absolute inset-2 rounded-full border-4 border-emerald-200 animate-ping" style={{ animationDelay: '0.2s' }} />
              <div className="relative w-full h-full rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
                <Navigation className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Finding your ride...</h2>
            <p className="text-gray-500 text-sm">Matching you with the nearest e-rickshaw driver</p>
            <div className="flex justify-center gap-1.5 mt-6">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}

        {/* Step: Driver Found */}
        {step === 'found' && driver && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Driver Found!</span>
              </div>
              <p className="text-emerald-100 text-sm">Your e-rickshaw is on its way</p>
            </div>

            <div className="p-6">
              {/* Driver info */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  {driver.name[0]}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{driver.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-sm text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-current" /> {driver.rating}
                    </span>
                    <span className="text-gray-300">·</span>
                    <span className="text-sm text-gray-500">{driver.total_trips} trips</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Vehicle</p>
                  <p className="text-sm font-semibold text-gray-800">{driver.vehicle_number}</p>
                </div>
              </div>

              {/* Route summary */}
              <div className="p-4 bg-gray-50 rounded-xl mb-5 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Pickup</p>
                    <p className="text-sm font-medium text-gray-800">{pickup}</p>
                  </div>
                </div>
                <div className="ml-1.5 w-0.5 h-4 bg-gray-200" />
                <div className="flex items-start gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Drop</p>
                    <p className="text-sm font-medium text-gray-800">{dropoff}</p>
                  </div>
                </div>
              </div>

              {/* Fare details */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { icon: <IndianRupee className="w-4 h-4" />, label: 'Fare', value: `₹${fare}` },
                  { icon: <Navigation className="w-4 h-4" />, label: 'Distance', value: `${estimatedKm.toFixed(1)} km` },
                  { icon: <Clock className="w-4 h-4" />, label: 'ETA', value: `${Math.round(duration / 2)} min` },
                ].map(item => (
                  <div key={item.label} className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="flex justify-center text-emerald-500 mb-1">{item.icon}</div>
                    <p className="text-xs text-gray-400">{item.label}</p>
                    <p className="text-sm font-bold text-gray-900">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('form')}
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="flex-[2] py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200 transition-all duration-200 disabled:opacity-60"
                >
                  {loading ? 'Confirming...' : 'Confirm Ride'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step: Confirmed */}
        {step === 'confirmed' && currentRide && driver && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-br from-gray-900 to-slate-800 p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white mb-1">Ride Confirmed!</h2>
              <p className="text-gray-400 text-sm">Your driver is on the way</p>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold">
                    {driver.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{driver.name}</p>
                    <p className="text-xs text-gray-500">{driver.vehicle_number}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                    <Phone className="w-3.5 h-3.5 text-gray-600" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-gray-600" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { label: 'Ride ID', value: `#${currentRide.id.slice(0, 8).toUpperCase()}` },
                  { label: 'Total Fare', value: `₹${fare}` },
                  { label: 'Status', value: 'Driver en route', highlight: true },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-gray-500">{row.label}</span>
                    <span className={`text-sm font-semibold ${row.highlight ? 'text-emerald-600' : 'text-gray-900'}`}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleNewRide}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200 transition-all duration-200"
              >
                Book Another Ride
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
