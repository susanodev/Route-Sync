import { useState, useEffect } from 'react';
import { Clock, MapPin, Star, IndianRupee, Navigation, CheckCircle, XCircle, Loader } from 'lucide-react';
import { supabase, Ride } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const statusConfig = {
  pending: { label: 'Pending', color: 'text-amber-600', bg: 'bg-amber-50', icon: <Clock className="w-3.5 h-3.5" /> },
  accepted: { label: 'Accepted', color: 'text-blue-600', bg: 'bg-blue-50', icon: <Navigation className="w-3.5 h-3.5" /> },
  in_progress: { label: 'In Progress', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: <Loader className="w-3.5 h-3.5" /> },
  completed: { label: 'Completed', color: 'text-emerald-700', bg: 'bg-emerald-50', icon: <CheckCircle className="w-3.5 h-3.5" /> },
  cancelled: { label: 'Cancelled', color: 'text-red-600', bg: 'bg-red-50', icon: <XCircle className="w-3.5 h-3.5" /> },
};

export default function RideHistory({ onBook }: { onBook: () => void }) {
  const { user } = useAuth();
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingRide, setRatingRide] = useState<string | null>(null);

  useEffect(() => {
    if (user) fetchRides();
  }, [user]);

  const fetchRides = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('rides')
      .select('*, driver:drivers(*)')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });
    setRides((data as Ride[]) || []);
    setLoading(false);
  };

  const submitRating = async (rideId: string, rating: number) => {
    await supabase.from('rides').update({ rating }).eq('id', rideId);
    setRatingRide(null);
    fetchRides();
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Rides</h1>
          <p className="text-gray-500 mt-1">Track all your e-rickshaw journeys</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 rounded-full border-4 border-emerald-100 border-t-emerald-500 animate-spin mb-4" />
            <p className="text-gray-500 text-sm">Loading rides...</p>
          </div>
        ) : rides.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gray-100 flex items-center justify-center">
              <Navigation className="w-9 h-9 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No rides yet</h3>
            <p className="text-gray-500 text-sm mb-6">Book your first e-rickshaw ride and explore the city sustainably</p>
            <button
              onClick={onBook}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200 hover:from-emerald-600 hover:to-teal-600 transition-all"
            >
              Book a Ride
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {rides.map(ride => {
              const sc = statusConfig[ride.status];
              return (
                <div key={ride.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">{formatDate(ride.created_at)}</p>
                        <p className="text-xs font-mono text-gray-400">#{ride.id.slice(0, 8).toUpperCase()}</p>
                      </div>
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${sc.color} ${sc.bg}`}>
                        {sc.icon}
                        {sc.label}
                      </div>
                    </div>

                    {/* Route */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-400">From</p>
                          <p className="text-sm font-medium text-gray-800 leading-snug">{ride.pickup_address}</p>
                        </div>
                      </div>
                      <div className="ml-1 w-0.5 h-4 bg-gray-100 ml-[5px]" />
                      <div className="flex items-start gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-400">To</p>
                          <p className="text-sm font-medium text-gray-800 leading-snug">{ride.dropoff_address}</p>
                        </div>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
                      {ride.fare && (
                        <div className="flex items-center gap-1 text-sm font-bold text-gray-900">
                          <IndianRupee className="w-3.5 h-3.5 text-emerald-500" />
                          {ride.fare}
                        </div>
                      )}
                      {ride.distance_km && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin className="w-3 h-3" />
                          {ride.distance_km} km
                        </div>
                      )}
                      {ride.duration_min && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {ride.duration_min} min
                        </div>
                      )}
                      {ride.driver && (
                        <div className="ml-auto flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-[10px] font-bold">
                            {(ride.driver as unknown as {name: string}).name[0]}
                          </div>
                          <span className="text-xs text-gray-600">{(ride.driver as unknown as {name: string}).name.split(' ')[0]}</span>
                        </div>
                      )}
                    </div>

                    {/* Rating */}
                    {ride.status === 'completed' && (
                      <div className="mt-3 pt-3 border-t border-gray-50">
                        {ride.rating ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-gray-400">Your rating:</span>
                            <div className="flex gap-0.5">
                              {Array(5).fill(0).map((_, i) => (
                                <Star key={i} className={`w-3.5 h-3.5 ${i < ride.rating! ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                              ))}
                            </div>
                          </div>
                        ) : ratingRide === ride.id ? (
                          <div>
                            <p className="text-xs text-gray-500 mb-2">Rate your ride</p>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map(n => (
                                <button
                                  key={n}
                                  onClick={() => submitRating(ride.id, n)}
                                  className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-amber-50 border border-gray-200 hover:border-amber-300 flex items-center justify-center transition-colors"
                                >
                                  <Star className="w-4 h-4 text-amber-400" />
                                  <span className="sr-only">{n}</span>
                                </button>
                              ))}
                              {[1, 2, 3, 4, 5].map(n => (
                                <button key={`lbl-${n}`} onClick={() => submitRating(ride.id, n)} className="hidden">{n}</button>
                              ))}
                            </div>
                            <div className="flex gap-1 mt-1">
                              {[1, 2, 3, 4, 5].map(n => (
                                <button
                                  key={`r-${n}`}
                                  onClick={() => submitRating(ride.id, n)}
                                  className="w-8 text-center text-xs text-gray-400"
                                >{n}</button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setRatingRide(ride.id)}
                            className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                          >
                            <Star className="w-3.5 h-3.5" /> Rate this ride
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
