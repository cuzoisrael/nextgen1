"use client";

import { useState, useCallback } from "react";
import { debounce } from "lodash";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    organization: "",
    role: "",
    location: "",
    country: "",
    registration_type: "attendee",
    interests: [],
  });
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const interestOptions = [
    "Artificial Intelligence",
    "Blockchain",
    "Cloud Computing",
    "Cybersecurity",
    "Data Science",
    "FinTech",
    "IoT",
    "Mobile Development",
    "Web3",
    "Entrepreneurship",
  ];

  const fetchLocationSuggestions = useCallback(
    debounce(async (input) => {
      if (input.length < 3) {
        setLocationSuggestions([]);
        return;
      }

      try {
        const response = await fetch(
          `/integrations/google-place-autocomplete/autocomplete/json?input=${encodeURIComponent(input)}&radius=500`,
        );
        const data = await response.json();
        if (data.predictions) {
          setLocationSuggestions(data.predictions);
        }
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
      }
    }, 500),
    [],
  );

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, location: value }));
    fetchLocationSuggestions(value);
  };

  const selectLocation = (place) => {
    setFormData((prev) => ({ ...prev, location: place.description }));
    setLocationSuggestions([]);
  };

  const toggleInterest = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/participants/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();
      setSuccess(true);

      // Redirect to success page with QR code
      setTimeout(() => {
        window.location.href = `/registration-success?id=${data.id}`;
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <img
            src="https://ucarecdn.com/5944ac84-70ce-4865-82bc-bb93f5345c5e/-/format/auto/"
            alt="The Tribe Africa"
            className="h-16 w-auto mx-auto mb-4"
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Register for NextGen Summit 2026
          </h1>
          <p className="text-gray-600">
            Join us in Abuja, FCT to shape the future of Africa
          </p>
          <p className="text-orange-600 font-semibold mt-2">
            📍 June 15-17, 2026 • Abuja, Nigeria
          </p>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl mb-6">
            ✅ Registration successful! Redirecting to your QR code...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl mb-6">
            ❌ {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 space-y-6"
        >
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, full_name: e.target.value }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
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
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="+234 XXX XXX XXXX"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Organization
              </label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    organization: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Your company or institution"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Role/Title
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, role: e.target.value }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., Software Engineer"
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-gray-700 font-semibold mb-2">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={handleLocationChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Start typing your city..."
            />
            {locationSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {locationSuggestions.map((place, index) => (
                  <div
                    key={index}
                    onClick={() => selectLocation(place)}
                    className="px-4 py-3 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    {place.description}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Country
            </label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, country: e.target.value }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Your country"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Registration Type *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["attendee", "speaker", "volunteer"].map((type) => (
                <label
                  key={type}
                  className="relative flex items-center cursor-pointer"
                >
                  <input
                    type="radio"
                    name="registration_type"
                    value={type}
                    checked={formData.registration_type === type}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        registration_type: e.target.value,
                      }))
                    }
                    className="sr-only"
                  />
                  <div
                    className={`w-full px-4 py-3 border-2 rounded-lg text-center font-semibold capitalize transition ${
                      formData.registration_type === type
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-gray-300 text-gray-600 hover:border-orange-300"
                    }`}
                  >
                    {type}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-3">
              Areas of Interest
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {interestOptions.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    formData.interests.includes(interest)
                      ? "bg-orange-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-4 rounded-lg font-bold text-lg hover:from-orange-700 hover:to-orange-600 transition transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Registering..." : "Complete Registration - Free Entry"}
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
