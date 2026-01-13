"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  Users,
  Briefcase,
  MessageSquare,
  TrendingUp,
} from "lucide-react";

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, participantsRes, vendorsRes, feedbackRes, insightsRes] =
        await Promise.all([
          fetch("/api/dashboard-stats"),
          fetch("/api/participants/list"),
          fetch("/api/vendors/list"),
          fetch("/api/feedback/list"),
          fetch("/api/analytics/dashboard"),
        ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (participantsRes.ok) setParticipants(await participantsRes.json());
      if (vendorsRes.ok) setVendors(await vendorsRes.json());
      if (feedbackRes.ok) setFeedback(await feedbackRes.json());
      if (insightsRes.ok) setInsights(await insightsRes.json());
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = async () => {
    try {
      const response = await fetch("/api/analytics/generate-insights", {
        method: "POST",
      });
      if (response.ok) {
        const data = await response.json();
        setInsights(data);
      }
    } catch (error) {
      console.error("Error generating insights:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src="https://ucarecdn.com/5944ac84-70ce-4865-82bc-bb93f5345c5e/-/format/auto/"
                alt="The Tribe Africa"
                className="h-12 w-auto"
              />
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            <button
              onClick={() => (window.location.href = "/")}
              className="text-orange-600 hover:text-orange-800 font-semibold"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Participants</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.participants || 0}
                </p>
              </div>
              <Users className="text-orange-500" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Partners</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.partners || 0}
                </p>
              </div>
              <Briefcase className="text-orange-500" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Feedback</p>
                <p className="text-3xl font-bold text-gray-900">
                  {feedback.length}
                </p>
              </div>
              <MessageSquare className="text-orange-500" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₦{((stats?.totalRevenue || 0) / 1000000).toFixed(1)}M
                </p>
              </div>
              <TrendingUp className="text-green-500" size={40} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-8">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              {[
                { id: "overview", label: "Overview", icon: BarChart3 },
                { id: "participants", label: "Participants", icon: Users },
                { id: "partners", label: "Partners", icon: Briefcase },
                { id: "feedback", label: "Feedback", icon: MessageSquare },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition ${
                    activeTab === tab.id
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <tab.icon size={20} />
                  <span className="font-semibold">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">AI-Generated Insights</h3>
                    <button
                      onClick={generateInsights}
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                    >
                      Generate New Insights
                    </button>
                  </div>
                  {insights && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                      <p className="text-gray-800 whitespace-pre-wrap">
                        {insights.summary || "No insights available yet."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "participants" && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Type</th>
                      <th className="text-left py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.slice(0, 10).map((p) => (
                      <tr key={p.id} className="border-b border-gray-100">
                        <td className="py-3 px-4">{p.full_name}</td>
                        <td className="py-3 px-4">{p.email}</td>
                        <td className="py-3 px-4 capitalize">
                          {p.registration_type}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              p.checked_in
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {p.checked_in ? "Checked In" : "Registered"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "partners" && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4">Company</th>
                      <th className="text-left py-3 px-4">Contact</th>
                      <th className="text-left py-3 px-4">Tier</th>
                      <th className="text-left py-3 px-4">Amount</th>
                      <th className="text-left py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendors.map((v) => (
                      <tr key={v.id} className="border-b border-gray-100">
                        <td className="py-3 px-4">{v.company_name}</td>
                        <td className="py-3 px-4">{v.email}</td>
                        <td className="py-3 px-4 capitalize">
                          {v.partnership_tier}
                        </td>
                        <td className="py-3 px-4">
                          ₦{(v.amount_pledged / 1000000).toFixed(1)}M
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm capitalize ${
                              v.payment_status === "completed"
                                ? "bg-green-100 text-green-800"
                                : v.payment_status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {v.payment_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "feedback" && (
              <div className="space-y-4">
                {feedback.slice(0, 10).map((f) => (
                  <div
                    key={f.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500 capitalize">
                        {f.feedback_type}
                      </span>
                      <span className="text-2xl">
                        {f.rating === 5
                          ? "🤩"
                          : f.rating === 4
                            ? "😊"
                            : f.rating === 3
                              ? "😐"
                              : f.rating === 2
                                ? "😕"
                                : "😞"}
                      </span>
                    </div>
                    <p className="text-gray-800 mb-2">{f.comments}</p>
                    {f.suggestions && (
                      <p className="text-sm text-gray-600 italic">
                        💡 {f.suggestions}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
