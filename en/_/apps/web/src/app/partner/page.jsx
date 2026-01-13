"use client";

import { useState } from "react";

export default function PartnerPage() {
  const [formData, setFormData] = useState({
    company_name: "",
    contact_person: "",
    email: "",
    phone: "",
    partnership_tier: "bronze",
    website: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const tiers = {
    platinum: {
      name: "Platinum Partner",
      amount: 5000000,
      benefits: [
        "Prime booth location at the venue",
        "Speaking slot at main stage",
        "Logo on all marketing materials",
        "10 complimentary tickets",
        "VIP dinner with organizers",
        "Social media spotlight",
      ],
    },
    gold: {
      name: "Gold Partner",
      amount: 3000000,
      benefits: [
        "Premium booth location",
        "Panel discussion opportunity",
        "Logo on event website",
        "6 complimentary tickets",
        "Networking session access",
        "Event highlights video feature",
      ],
    },
    silver: {
      name: "Silver Partner",
      amount: 1500000,
      benefits: [
        "Standard booth space",
        "Logo on event materials",
        "4 complimentary tickets",
        "Access to all sessions",
        "Post-event report",
      ],
    },
    bronze: {
      name: "Bronze Partner",
      amount: 750000,
      benefits: [
        "Small booth space",
        "Logo on website",
        "2 complimentary tickets",
        "Event access",
      ],
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const tierAmount = tiers[formData.partnership_tier].amount;

      const response = await fetch("/api/vendors/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount_pledged: tierAmount,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to register partnership");
      }

      const data = await response.json();

      // Redirect to Stripe payment
      if (data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        setSuccess(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to register partnership. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <img
            src="https://ucarecdn.com/5944ac84-70ce-4865-82bc-bb93f5345c5e/-/format/auto/"
            alt="The Tribe Africa"
            className="h-16 w-auto mx-auto mb-4"
          />
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Become a Partner
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join us in empowering Africa's next generation of leaders and
            innovators
          </p>
        </div>

        {/* Partnership Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {Object.entries(tiers).map(([key, tier]) => (
            <div
              key={key}
              onClick={() =>
                setFormData((prev) => ({ ...prev, partnership_tier: key }))
              }
              className={`bg-white rounded-2xl p-6 cursor-pointer transition transform hover:scale-105 ${
                formData.partnership_tier === key
                  ? "ring-4 ring-orange-500 shadow-2xl"
                  : "shadow-lg hover:shadow-xl"
              }`}
            >
              <div className="text-center mb-4">
                <div
                  className={`text-4xl mb-2 ${
                    key === "platinum"
                      ? "💎"
                      : key === "gold"
                        ? "🥇"
                        : key === "silver"
                          ? "🥈"
                          : "🥉"
                  }`}
                >
                  {key === "platinum"
                    ? "💎"
                    : key === "gold"
                      ? "🥇"
                      : key === "silver"
                        ? "🥈"
                        : "🥉"}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {tier.name}
                </h3>
                <div className="text-3xl font-bold text-orange-600">
                  ₦{(tier.amount / 1000000).toFixed(1)}M
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                {tier.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl mb-6">
            ❌ {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl mb-6">
            ✅ Partnership registered successfully! Redirecting to payment...
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Partnership Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={formData.company_name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    company_name: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Your company name"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Contact Person *
              </label>
              <input
                type="text"
                required
                value={formData.contact_person}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    contact_person: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Full name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="company@email.com"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Phone *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="+234 XXX XXX XXXX"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Company Website
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, website: e.target.value }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="https://yourcompany.com"
            />
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <h3 className="font-bold text-orange-900 mb-2">Selected Tier:</h3>
            <p className="text-2xl font-bold text-orange-600 mb-1">
              {tiers[formData.partnership_tier].name}
            </p>
            <p className="text-3xl font-bold text-gray-900">
              ₦{(tiers[formData.partnership_tier].amount / 1000000).toFixed(1)}M
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-4 rounded-lg font-bold text-lg hover:from-orange-700 hover:to-orange-600 transition transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Proceed to Payment"}
          </button>
        </form>

        <div className="text-center mt-8">
          <button
            onClick={() => (window.location.href = "/")}
            className="text-orange-600 hover:text-orange-800 font-semibold"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
