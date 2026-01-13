"use client";

import { useState, useEffect, Suspense } from "react";

function SuccessContent() {
  const [participantId, setParticipantId] = useState(null);
  const [participant, setParticipant] = useState(null);
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");
      setParticipantId(id);
    }
  }, []);

  useEffect(() => {
    async function fetchParticipant() {
      if (!participantId) {
        window.location.href = "/";
        return;
      }

      try {
        const response = await fetch(
          `/api/participants/get?id=${participantId}`,
        );
        if (response.ok) {
          const data = await response.json();
          setParticipant(data);
          setQrCode(data.qr_code_url || "");
        }
      } catch (error) {
        console.error("Error fetching participant:", error);
      } finally {
        setLoading(false);
      }
    }

    if (participantId) {
      fetchParticipant();
    }
  }, [participantId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your registration...</p>
        </div>
      </div>
    );
  }

  if (!participant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Registration not found</p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 px-8 py-12 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Registration Successful!
            </h1>
            <p className="text-orange-100">
              Welcome to NextGen Summit 2026 - Abuja
            </p>
          </div>

          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Your Details
              </h2>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <span className="ml-2 font-semibold text-gray-800">
                    {participant.full_name}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <span className="ml-2 font-semibold text-gray-800">
                    {participant.email}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Type:</span>
                  <span className="ml-2 font-semibold text-gray-800 capitalize">
                    {participant.registration_type}
                  </span>
                </div>
                {participant.organization && (
                  <div>
                    <span className="text-gray-600">Organization:</span>
                    <span className="ml-2 font-semibold text-gray-800">
                      {participant.organization}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {qrCode && (
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Your QR Code
                </h3>
                <div className="inline-block bg-white p-6 rounded-xl shadow-lg border-4 border-orange-200">
                  <img
                    src={qrCode}
                    alt="Registration QR Code"
                    className="w-64 h-64 mx-auto"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Save this QR code for event check-in at the venue in Abuja
                </p>
              </div>
            )}

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-orange-900 mb-3">
                📧 What's Next?
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Check your email for confirmation and event details</li>
                <li>✓ Download your QR code for event check-in</li>
                <li>
                  ✓ Complete the pre-event survey to help us personalize your
                  experience
                </li>
                <li>✓ Follow The Tribe Africa on social media for updates</li>
                <li>✓ Mark your calendar: June 15-17, 2026 in Abuja, FCT</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => (window.location.href = "/survey")}
                className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 text-white py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-600 transition"
              >
                Take Pre-Event Survey
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegistrationSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
