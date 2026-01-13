"use client";

import { useState, useEffect } from "react";

export default function SurveyPage() {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [participantId, setParticipantId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch("/api/survey/questions");
      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      setError("Failed to load survey questions");
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = (questionId, value, type) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: {
        type,
        value,
      },
    }));
  };

  const handleMultipleChoice = (questionId, option) => {
    const current = responses[questionId]?.value || [];
    const newValue = current.includes(option)
      ? current.filter((o) => o !== option)
      : [...current, option];

    setResponses((prev) => ({
      ...prev,
      [questionId]: {
        type: "multiple",
        value: newValue,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const formattedResponses = Object.entries(responses).map(
        ([questionId, data]) => ({
          participant_id: participantId || null,
          question_id: parseInt(questionId),
          response_text: data.type === "text" ? data.value : null,
          response_options:
            data.type === "multiple"
              ? data.value
              : data.type === "single"
                ? [data.value]
                : null,
        }),
      );

      const response = await fetch("/api/survey/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses: formattedResponses }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit survey");
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to submit survey. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading survey...</p>
        </div>
      </div>
    );
  }

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
            Pre-Event Survey
          </h1>
          <p className="text-gray-600">
            Help us personalize your NextGen Summit 2026 experience
          </p>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl mb-6">
            ✅ Survey submitted successfully! Redirecting to home...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl mb-6">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <label className="block text-gray-700 font-semibold mb-2">
              Participant ID (Optional)
            </label>
            <input
              type="number"
              value={participantId}
              onChange={(e) => setParticipantId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Your registration ID"
            />
            <p className="text-sm text-gray-500 mt-1">
              Found in your registration confirmation
            </p>
          </div>

          {questions.map((question, index) => (
            <div
              key={question.id}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <div className="mb-4">
                <span className="text-orange-600 font-bold">
                  Question {index + 1}
                </span>
                <h3 className="text-xl font-semibold text-gray-900 mt-2">
                  {question.question_text}
                </h3>
              </div>

              {question.question_type === "text" && (
                <textarea
                  value={responses[question.id]?.value || ""}
                  onChange={(e) =>
                    handleResponse(question.id, e.target.value, "text")
                  }
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Your answer..."
                ></textarea>
              )}

              {question.question_type === "single_choice" &&
                question.options && (
                  <div className="space-y-3">
                    {question.options.map((option, idx) => (
                      <label
                        key={idx}
                        className="flex items-center cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name={`question_${question.id}`}
                          value={option}
                          checked={responses[question.id]?.value === option}
                          onChange={(e) =>
                            handleResponse(
                              question.id,
                              e.target.value,
                              "single",
                            )
                          }
                          className="w-5 h-5 text-orange-600 border-gray-300 focus:ring-orange-500"
                        />
                        <span className="ml-3 text-gray-700 group-hover:text-orange-600 transition">
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

              {question.question_type === "multiple_choice" &&
                question.options && (
                  <div className="space-y-3">
                    {question.options.map((option, idx) => (
                      <label
                        key={idx}
                        className="flex items-center cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={(
                            responses[question.id]?.value || []
                          ).includes(option)}
                          onChange={() =>
                            handleMultipleChoice(question.id, option)
                          }
                          className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="ml-3 text-gray-700 group-hover:text-orange-600 transition">
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
            </div>
          ))}

          <button
            type="submit"
            disabled={submitting || questions.length === 0}
            className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-4 rounded-lg font-bold text-lg hover:from-orange-700 hover:to-orange-600 transition transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit Survey"}
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
