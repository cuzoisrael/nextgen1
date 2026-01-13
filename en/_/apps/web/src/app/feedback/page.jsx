"use client";

import { useState } from "react";

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    participant_id: "",
    feedback_type: "general",
    session_name: "",
    rating: 5,
    comments: "",
    suggestions: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/feedback/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      setSuccess(true);
      setFormData({
        participant_id: "",
        feedback_type: "general",
        session_name: "",
        rating: 5,
        comments: "",
        suggestions: "",
      });

      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to submit feedback. Please try again.");
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
            Share Your Feedback
          </h1>
          <p className="text-gray-600">
            Help us improve NextGen Summit for future events
          </p>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl mb-6">
            ✅ Thank you! Your feedback has been submitted successfully.
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
              Participant ID (Optional)
            </label>
            <input
              type="number"
              value={formData.participant_id}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  participant_id: e.target.value,
                }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Your registration ID"
            />
            <p className="text-sm text-gray-500 mt-1">
              Found in your registration confirmation email
            </p>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Feedback Type *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["general", "session", "logistics"].map((type) => (
                <label
                  key={type}
                  className="relative flex items-center cursor-pointer"
                >
                  <input
                    type="radio"
                    name="feedback_type"
                    value={type}
                    checked={formData.feedback_type === type}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        feedback_type: e.target.value,
                      }))
                    }
                    className="sr-only"
                  />
                  <div
                    className={`w-full px-4 py-3 border-2 rounded-lg text-center font-semibold capitalize transition ${
                      formData.feedback_type === type
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

          {formData.feedback_type === "session" && (
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Session Name
              </label>
              <input
                type="text"
                value={formData.session_name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    session_name: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Which session are you providing feedback for?"
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Overall Rating * ({formData.rating}/5)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    rating: parseInt(e.target.value),
                  }))
                }
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="text-3xl">
                {formData.rating === 5
                  ? "🤩"
                  : formData.rating === 4
                    ? "😊"
                    : formData.rating === 3
                      ? "😐"
                      : formData.rating === 2
                        ? "😕"
                        : "😞"}
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Poor</span>
              <span>Excellent</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Your Comments *
            </label>
            <textarea
              required
              value={formData.comments}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, comments: e.target.value }))
              }
              rows="5"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Share your experience with us..."
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Suggestions for Improvement
            </label>
            <textarea
              value={formData.suggestions}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  suggestions: e.target.value,
                }))
              }
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="How can we make NextGen Summit even better?"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-4 rounded-lg font-bold text-lg hover:from-orange-700 hover:to-orange-600 transition transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
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
