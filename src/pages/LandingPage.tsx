import { Zap, Leaf, Clock, Shield, Star, MapPin, ArrowRight, ChevronRight, Battery, Wifi, Navigation } from 'lucide-react';

type Props = {
  onBook: () => void;
  onAuth: (mode?: 'login' | 'register') => void;
  isLoggedIn: boolean;
};

const features = [
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Instant Booking',
    description: 'Book your e-rickshaw in under 30 seconds with our intelligent dispatch system.',
    color: 'emerald',
  },
  {
    icon: <Leaf className="w-5 h-5" />,
    title: '100% Electric',
    description: 'Zero emissions, zero guilt. Every ride contributes to a cleaner planet.',
    color: 'teal',
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: 'Real-Time Tracking',
    description: 'Follow your ride live on the map with accurate ETA updates.',
    color: 'cyan',
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'Safe & Verified',
    description: 'All drivers are background-checked and vehicles are regularly inspected.',
    color: 'emerald',
  },
  {
    icon: <Battery className="w-5 h-5" />,
    title: 'Smart Charging',
    description: 'AI-powered routing ensures your driver always has sufficient battery.',
    color: 'teal',
  },
  {
    icon: <Wifi className="w-5 h-5" />,
    title: 'Connected Fleet',
    description: 'IoT sensors monitor every vehicle for peak performance and safety.',
    color: 'cyan',
  },
];

const steps = [
  { num: '01', title: 'Enter Your Destination', desc: 'Type your pickup and drop location — our system finds the best route.' },
  { num: '02', title: 'Match With Driver', desc: 'Our AI instantly matches you with the nearest available e-rickshaw.' },
  { num: '03', title: 'Track & Ride', desc: 'Watch your driver arrive in real-time and enjoy a smooth, green ride.' },
];

const stats = [
  { value: '50K+', label: 'Happy Riders' },
  { value: '1,200+', label: 'Electric Vehicles' },
  { value: '98%', label: 'On-time Rate' },
  { value: '4.9★', label: 'Average Rating' },
];

const testimonials = [
  {
    name: 'Priya Mehta',
    location: 'New Delhi',
    text: 'EcoRide has completely changed my daily commute. Fast, affordable, and I feel good about reducing my carbon footprint!',
    rating: 5,
    avatar: 'PM',
  },
  {
    name: 'Ankit Sharma',
    location: 'Noida',
    text: 'The real-time tracking is incredibly accurate. I always know exactly when my ride will arrive. 10/10 experience.',
    rating: 5,
    avatar: 'AS',
  },
  {
    name: 'Kavita Rao',
    location: 'Gurgaon',
    text: 'Super clean vehicles, polite drivers, and great pricing. My go-to for short distances around the city.',
    rating: 5,
    avatar: 'KR',
  },
];

export default function LandingPage({ onBook, onAuth, isLoggedIn }: Props) {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(16,185,129,0.15),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(20,184,166,0.12),_transparent_60%)]" />

        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/15 border border-emerald-500/25 rounded-full text-emerald-400 text-sm font-medium mb-6">
                <Zap className="w-3.5 h-3.5" />
                Intelligent E-Rickshaw Platform
              </div>

              <h1 className="text-5xl sm:text-6xl font-bold text-white leading-[1.1] mb-6">
                Smart rides,{' '}
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  greener
                </span>{' '}
                planet
              </h1>

              <p className="text-lg text-gray-400 leading-relaxed mb-8 max-w-lg">
                Book electric rickshaws instantly with AI-powered matching, real-time tracking, and zero-emission travel for your daily commute.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <button
                  onClick={isLoggedIn ? onBook : () => onAuth('register')}
                  className="group flex items-center justify-center gap-2 px-7 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold rounded-xl shadow-lg shadow-emerald-900/30 transition-all duration-200 hover:shadow-emerald-800/40 hover:scale-[1.02]"
                >
                  <MapPin className="w-4 h-4" />
                  Book a Ride
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
                {!isLoggedIn && (
                  <button
                    onClick={() => onAuth('login')}
                    className="flex items-center justify-center gap-2 px-7 py-4 border border-white/15 hover:border-white/30 text-white/80 hover:text-white font-medium rounded-xl transition-all duration-200 hover:bg-white/5"
                  >
                    Sign In <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap gap-6">
                {stats.map(s => (
                  <div key={s.label}>
                    <p className="text-2xl font-bold text-white">{s.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero visual */}
            <div className="hidden lg:block relative">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                {/* Phone mockup card */}
                <div className="absolute inset-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
                  {/* Map area */}
                  <div className="relative h-2/3 bg-gradient-to-br from-slate-700 to-slate-800 overflow-hidden">
                    {/* Simulated map grid */}
                    <div className="absolute inset-0 opacity-20" style={{
                      backgroundImage: 'linear-gradient(rgba(16,185,129,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.4) 1px, transparent 1px)',
                      backgroundSize: '30px 30px'
                    }} />
                    {/* Route line */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 200">
                      <path d="M60 150 Q100 80 150 100 Q200 120 240 60" stroke="#10b981" strokeWidth="2.5" fill="none" strokeDasharray="6,3" opacity="0.8" />
                      <circle cx="60" cy="150" r="6" fill="#10b981" opacity="0.9" />
                      <circle cx="240" cy="60" r="6" fill="#f59e0b" opacity="0.9" />
                      {/* Rickshaw icon */}
                      <circle cx="150" cy="100" r="10" fill="#10b981" opacity="0.95" />
                      <text x="150" y="104" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">E</text>
                    </svg>
                    {/* Map overlay labels */}
                    <div className="absolute top-3 left-3 right-3 bg-white/10 backdrop-blur-sm rounded-xl p-2.5 flex items-center gap-2">
                      <Navigation className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] text-gray-400">Tracking your ride</p>
                        <p className="text-xs text-white font-medium">Arriving in 3 min</p>
                      </div>
                      <div className="ml-auto text-[10px] text-emerald-400 font-semibold bg-emerald-500/20 px-2 py-0.5 rounded-full">LIVE</div>
                    </div>
                  </div>
                  {/* Bottom panel */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">R</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white">Rajan Kumar</p>
                        <p className="text-[10px] text-gray-400">DL-E-1234 · ★ 4.8</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-emerald-400">₹45</p>
                        <p className="text-[10px] text-gray-500">2.4 km</p>
                      </div>
                    </div>
                    <div className="h-px bg-white/5" />
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="text-[10px] text-gray-400">Connaught Place</span>
                      </div>
                      <ArrowRight className="w-3 h-3 text-gray-600" />
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span className="text-[10px] text-gray-400">India Gate</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute top-4 -left-4 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Leaf className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500">CO2 Saved</p>
                    <p className="text-sm font-bold text-gray-900">1.2 kg</p>
                  </div>
                </div>
                <div className="absolute bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <Star className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500">Your Rating</p>
                    <p className="text-sm font-bold text-gray-900">4.9 ★</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L60 72C120 64 240 48 360 44C480 40 600 48 720 56C840 64 960 72 1080 68C1200 64 1320 48 1380 40L1440 32V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full text-emerald-600 text-sm font-medium mb-4">
              Why EcoRide
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Built for the modern commuter</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Combining intelligent technology with sustainable transport to make your daily commute smarter.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl border border-gray-100 hover:border-emerald-100 hover:shadow-lg hover:shadow-emerald-50/50 transition-all duration-300 cursor-default"
              >
                <div className={`w-11 h-11 rounded-xl bg-${f.color}-50 flex items-center justify-center text-${f.color}-500 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50 rounded-full text-teal-600 text-sm font-medium mb-4">
              How It Works
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Ride in three simple steps</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector lines */}
            <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-px bg-gradient-to-r from-emerald-200 via-teal-300 to-emerald-200" />

            {steps.map((step, i) => (
              <div key={i} className="relative text-center">
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-200 relative z-10">
                  <span className="text-2xl font-bold text-white">{i + 1}</span>
                </div>
                <div className="text-xs font-mono text-emerald-500 mb-2">{step.num}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={isLoggedIn ? onBook : () => onAuth('register')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200 transition-all duration-200 hover:scale-[1.02]"
            >
              Start Riding Now <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-full text-amber-600 text-sm font-medium mb-4">
              Testimonials
            </div>
            <h2 className="text-4xl font-bold text-gray-900">Loved by thousands of riders</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-emerald-100 hover:shadow-md transition-all duration-300">
                <div className="flex gap-1 mb-4">
                  {Array(t.rating).fill(0).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.15),_transparent_70%)]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to ride <span className="text-emerald-400">sustainably</span>?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Join over 50,000 commuters already using EcoRide every day. Your first ride is on us.
          </p>
          <button
            onClick={isLoggedIn ? onBook : () => onAuth('register')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold rounded-xl shadow-lg shadow-emerald-900/30 transition-all duration-200 hover:scale-[1.02]"
          >
            <MapPin className="w-4 h-4" />
            Book Your First Ride
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">Eco<span className="text-emerald-400">Ride</span></span>
            </div>
            <p className="text-sm text-gray-600">© 2026 EcoRide. Driving a greener tomorrow.</p>
            <div className="flex gap-4 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-400 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
