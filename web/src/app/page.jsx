"use client";

import { useState, useEffect } from "react";

export default function HomePage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/dashboard-stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Background Image */}
      <div className="relative min-h-screen overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://ucarecdn.com/18beba43-bba7-4eee-8cf4-b0ad6737a9ff/-/format/auto/)",
            filter: "brightness(0.4)",
          }}
        ></div>

        {/* Orange Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/80 via-orange-800/70 to-amber-900/80"></div>

        <nav className="relative z-10 container mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img
              src="https://ucarecdn.com/5944ac84-70ce-4865-82bc-bb93f5345c5e/-/format/auto/"
              alt="The Tribe Africa"
              className="h-16 w-auto"
            />
            <div>
              <h1 className="text-white font-bold text-xl">
                NextGen Summit 2026
              </h1>
              <p className="text-orange-200 text-xs">
                Powered by The Tribe Africa
              </p>
            </div>
          </div>

          <div className="hidden md:flex space-x-8 text-white">
            <a
              href="#about"
              className="hover:text-orange-300 transition font-semibold"
            >
              About
            </a>
            <a
              href="#schedule"
              className="hover:text-orange-300 transition font-semibold"
            >
              Schedule
            </a>
            <a
              href="#speakers"
              className="hover:text-orange-300 transition font-semibold"
            >
              Speakers
            </a>
            <a
              href="#partners"
              className="hover:text-orange-300 transition font-semibold"
            >
              Partners
            </a>
          </div>
        </nav>

        <div className="relative z-10 container mx-auto px-6 pt-24 pb-32 text-center">
          <div className="inline-block bg-orange-500 text-white px-6 py-2 rounded-full font-bold mb-6 text-sm">
            📅 June 15-17, 2026 • 📍 Abuja, FCT Nigeria
          </div>

          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Empowering Africa's
            <br />
            Next Generation Leaders
          </h2>
          <p className="text-xl md:text-2xl text-orange-100 mb-4 max-w-4xl mx-auto leading-relaxed">
            Join industry leaders, innovators, and change-makers at Nigeria's
            premier youth empowerment summit
          </p>
          <p className="text-lg text-orange-200 mb-12 max-w-3xl mx-auto">
            Closing the gaps in youth unemployment through strategic programs,
            partnerships, and hands-on initiatives
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => (window.location.href = "/register")}
              className="bg-orange-500 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-orange-600 transition transform hover:scale-105 shadow-2xl"
            >
              Register Now - Free Entry
            </button>
            <button
              onClick={() => (window.location.href = "/partner")}
              className="bg-white/20 backdrop-blur text-white border-2 border-white px-10 py-5 rounded-full font-bold text-lg hover:bg-white/30 transition transform hover:scale-105"
            >
              Become a Partner
            </button>
          </div>

          {!loading && stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/30">
                <div className="text-5xl font-bold text-white">
                  {stats.participants || 0}
                </div>
                <div className="text-orange-200 mt-2 font-semibold">
                  Registered Participants
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/30">
                <div className="text-5xl font-bold text-white">
                  {stats.partners || 0}
                </div>
                <div className="text-orange-200 mt-2 font-semibold">
                  Partners & Sponsors
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/30">
                <div className="text-5xl font-bold text-white">50+</div>
                <div className="text-orange-200 mt-2 font-semibold">
                  Expert Speakers
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What NextGen Summit is All About
            </h3>
            <p className="text-xl text-gray-600 leading-relaxed">
              The Tribe Africa was founded in 2020 to address the challenge of
              unemployment across Africa. NextGen Summit 2026 is our flagship
              event bringing together young professionals, entrepreneurs, and
              leaders to create opportunities and drive sustainable development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-8 rounded-2xl bg-orange-50 hover:shadow-xl transition">
              <div className="text-5xl mb-4">💼</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                Business & Career School
              </h4>
              <p className="text-gray-600">
                Equipping Africa's youth with essential skills, knowledge, and
                opportunities to thrive in today's dynamic business landscape
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-orange-50 hover:shadow-xl transition">
              <div className="text-5xl mb-4">📊</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                Job Creation Tracker
              </h4>
              <p className="text-gray-600">
                Monitor and showcase real-time job creation efforts across
                Africa through our innovative tracking initiative
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-orange-50 hover:shadow-xl transition">
              <div className="text-5xl mb-4">🤝</div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                Africa-In-Focus
              </h4>
              <p className="text-gray-600">
                High-impact stakeholder engagement connecting leaders,
                policymakers, and communities for sustainable development
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section - Previous Events */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <h3 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Highlights from Previous Tribe Africa Events
          </h3>
          <p className="text-center text-gray-600 mb-12 text-lg">
            See the impact we've made empowering thousands of young Africans
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative overflow-hidden rounded-2xl shadow-lg group h-80">
              <img
                src="https://ucarecdn.com/b18a52e0-2f85-404c-8511-5e0ed8c02c28/-/format/auto/"
                alt="Tribe Event"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <p className="text-white font-semibold p-6">
                  Business Training Workshop
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl shadow-lg group h-80">
              <img
                src="https://ucarecdn.com/21cc4fe8-9ec9-4714-8325-1aac8c209fab/-/format/auto/"
                alt="Tribe Event"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <p className="text-white font-semibold p-6">
                  Youth Leadership Summit
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl shadow-lg group h-80">
              <img
                src="https://ucarecdn.com/91db4cc5-2e28-4750-9693-15a5c51c40a5/-/format/auto/"
                alt="Tribe Event"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <p className="text-white font-semibold p-6">
                  Entrepreneurship Bootcamp
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl shadow-lg group h-80">
              <img
                src="https://ucarecdn.com/ed26b324-0196-4d05-be17-59e6f6b2b382/-/format/auto/"
                alt="Tribe Event"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <p className="text-white font-semibold p-6">
                  Career Acceleration Program
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl shadow-lg group h-80">
              <img
                src="https://ucarecdn.com/7524d730-6e3d-4c3c-aed1-e93c9ebbffb5/-/format/auto/"
                alt="Tribe Event"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <p className="text-white font-semibold p-6">
                  Skills Development Session
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl shadow-lg group h-80">
              <img
                src="https://ucarecdn.com/18beba43-bba7-4eee-8cf4-b0ad6737a9ff/-/format/auto/"
                alt="Tribe Event"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <p className="text-white font-semibold p-6">
                  Networking & Collaboration
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What You'll Gain Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-6">
          <h3 className="text-4xl font-bold text-center text-gray-900 mb-16">
            What You'll Gain at NextGen Summit 2026
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="p-6 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition">
              <div className="text-3xl mb-3">🎯</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                Skill Development
              </h4>
              <p className="text-gray-600">
                Tailored training on in-demand technical, digital, and soft
                skills needed in today's job market
              </p>
            </div>

            <div className="p-6 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition">
              <div className="text-3xl mb-3">🚀</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                Entrepreneurship Support
              </h4>
              <p className="text-gray-600">
                Turn your ideas into successful businesses with planning
                guidance, incubation, and mentorship
              </p>
            </div>

            <div className="p-6 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition">
              <div className="text-3xl mb-3">🌟</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                Leadership Training
              </h4>
              <p className="text-gray-600">
                Develop leadership qualities and innovative thinking to become
                an effective change-maker
              </p>
            </div>

            <div className="p-6 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition">
              <div className="text-3xl mb-3">🤝</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                Networking Opportunities
              </h4>
              <p className="text-gray-600">
                Connect with industry leaders, investors, and like-minded
                professionals across Africa
              </p>
            </div>

            <div className="p-6 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition">
              <div className="text-3xl mb-3">💡</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                Creative Innovation
              </h4>
              <p className="text-gray-600">
                Fuel your creativity with inspiring resources and collaborative
                spaces for breakthrough ideas
              </p>
            </div>

            <div className="p-6 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition">
              <div className="text-3xl mb-3">📚</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                Continuous Learning
              </h4>
              <p className="text-gray-600">
                Access to resources and ongoing support to keep your skills
                sharp and stay competitive
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 py-20">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Future?
          </h3>
          <p className="text-xl text-orange-100 mb-4 max-w-2xl mx-auto">
            Join thousands of young Africans who are building sustainable
            careers and businesses
          </p>
          <p className="text-lg text-orange-200 mb-10">
            Limited seats available. Register now and be part of the movement!
          </p>
          <button
            onClick={() => (window.location.href = "/register")}
            className="bg-white text-orange-600 px-12 py-5 rounded-full font-bold text-xl hover:bg-orange-50 transition transform hover:scale-105 shadow-2xl"
          >
            Secure Your Free Spot Now
          </button>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="bg-white p-10 rounded-2xl shadow-lg">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Our Vision
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                A future where every young African has access to meaningful
                employment, driven by innovation, collaboration, and job
                creation.
              </p>
            </div>

            <div className="bg-white p-10 rounded-2xl shadow-lg">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Our Mission
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                To close the youth employment gaps in Africa through strategic
                initiatives that equip young people with the skills and
                opportunities they need to succeed.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="mb-6 md:mb-0">
              <img
                src="https://ucarecdn.com/5944ac84-70ce-4865-82bc-bb93f5345c5e/-/format/auto/"
                alt="The Tribe Africa"
                className="h-12 w-auto mb-2"
              />
              <p className="text-gray-400">
                Empowering Africa's Youth Since 2020
              </p>
            </div>

            <div className="flex space-x-8 text-gray-400">
              <a href="/admin" className="hover:text-orange-400 transition">
                Admin Dashboard
              </a>
              <a href="/feedback" className="hover:text-orange-400 transition">
                Feedback
              </a>
              <a href="/survey" className="hover:text-orange-400 transition">
                Survey
              </a>
              <a
                href="https://thetribe.com.ng"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-400 transition"
              >
                Visit TheTribe.com.ng
              </a>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 text-center">
            <p className="text-gray-500">
              © 2026 The Tribe Africa. All rights reserved.
            </p>
            <p className="text-gray-600 text-sm mt-2">
              Founded by Hamilton Gabriel • Board Chair: Dr. Dayo
              Benjaims-Laniyi
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
