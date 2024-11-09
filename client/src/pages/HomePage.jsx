import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#0A0A2E] text-white">
      {/* Animated Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[url('/nebula.jpg')] opacity-30 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-cyan-900/50" />
      </div>

      {/* Navbar */}
      <nav className="relative backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-24">
            <div className="text-3xl font-black tracking-tighter">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
                Digital Vault
              </span>
            </div>
            <div className="flex gap-4">
              <Link to="/login" className="px-8 py-3 rounded-full text-white/90 hover:text-white border border-white/20 hover:border-white/40 transition-all duration-300">
                Login
              </Link>
              <Link to="/signup" className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 transition-all duration-300">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
          <div className="text-center space-y-8">
            <h1 className="text-7xl sm:text-8xl font-black tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
                Secure Your Digital Legacy
              </span>
            </h1>
            <p className="text-2xl sm:text-3xl text-white/80 font-light max-w-3xl mx-auto">
              Next-generation encryption meets elegant simplicity
            </p>
            <div className="pt-8">
              <button className="px-12 py-5 text-xl font-semibold rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/25">
                Experience The Future
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-32">
            {[
              {
                icon: "🛡️",
                title: "Quantum Security",
                desc: "Military-grade encryption protecting your data",
                gradient: "from-cyan-400 to-cyan-600"
              },
              {
                icon: "⚡",
                title: "Lightning Fast",
                desc: "Instant access across all your devices",
                gradient: "from-purple-400 to-purple-600"
              },
              {
                icon: "🔐",
                title: "Zero Knowledge",
                desc: "Your data remains yours, always",
                gradient: "from-pink-400 to-pink-600"
              }
            ].map((feature, i) => (
              <div key={i} className="group p-8 rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="text-5xl mb-6">{feature.icon}</div>
                <h3 className={`text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r ${feature.gradient}`}>
                  {feature.title}
                </h3>
                <p className="text-white/70">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-12 mt-32 text-center">
            {[
              { value: "99.99%", label: "Uptime", color: "text-cyan-400" },
              { value: "10M+", label: "Users", color: "text-purple-400" },
              { value: "24/7", label: "Support", color: "text-pink-400" }
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className={`text-5xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
