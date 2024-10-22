import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from 'lottie-react';

import api from "../utils/api";
import LoadingAnimation from "../assets/LoadingAnimation.json";

import {
  NavigationBar,
  DashboardCards,
  ViewDiaries,
  Graphs,
} from "../components/dashboard";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("newDiary");
  const [entryText, setEntryText] = useState("");
  const [gptResponse, setGptResponse] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        navigate("/");
    }

    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(false);
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }

    if (gptResponse) {
      const timer = setTimeout(() => {
        setGptResponse("");
      } , 30000);
      return () => clearTimeout(timer);
    }
  } , [success, navigate, error, gptResponse]);

  // Handle diary entry submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setGptResponse("");
    setLoading(true);

    // Prevent submission if the entry text is empty
    if (!entryText.trim()) {
      setError("Cannot submit an empty diary entry");
      setLoading(false);
      return;
    }

    // Check if the entry text is too short or too long
    if (entryText.length < 10 || entryText.length > 500) {
      setError("Diary entry must be between 10 and 500 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/entries", { text_entry: entryText });
      if (response.data.entry.auto_response) {
        setGptResponse(response.data.entry.auto_response);
        setSuccess(true);
        setEntryText("");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error submitting entry");
      //console.error("Error submitting entry:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-100">

      {/* Top Message Banner (Error & Success) */}
      <div 
          className={`fixed top-0 left-0 right-0 py-4 px-6 z-50 
            transition-transform duration-500 ease-in-out transform 
            ${success ? 'bg-green-600' : error ? 'bg-red-600' : 'hidden'} translate-y-0`}
      >
          <div className="container mx-auto flex justify-center items-center">
              {success ? (
                  <p className="text-white font-medium">Entry successfully saved!</p>
              ) : (
                  <p className="text-white font-medium">{error}</p>
              )}
          </div>
      </div>

      <NavigationBar />

      <div className="container mx-auto py-8 px-4">
        <DashboardCards setActiveTab={setActiveTab} />

        {/* Dynamic Content Area */}
        <div className="mt-8">
          {activeTab === "default" && (
            <p className="text-center text-gray-600">Select an option above to get started.</p>
          )}

          {/* View Diaries */}
          {activeTab === "viewDiaries" && <ViewDiaries />}

          {/* Graphs */}
          {activeTab === "graphs" && <Graphs />}

          {/* New Diary Entry Form */}
          {activeTab === "newDiary" && (
            <div className="bg-white p-6 rounded-xl shadow-lg bg-opacity-70 backdrop-blur-md">
              <h2 className="text-xl font-bold mb-4">My Personal Space</h2>
              
              <form onSubmit={handleSubmit}>
                {/* Diary Entry Textarea with Loading animation while submitting form */}
                <div className="relative">
                <textarea
                  className={`w-full p-4 mb-4 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500
                    ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  placeholder="Share your thoughts..."
                  rows={window.innerWidth >= 1024 ? 16 : window.innerWidth >= 768 ? 8 : 4} // Default 16 rows for desktop, 8 for tablet, 4 for mobile
                  value={entryText}
                  onChange={(e) => setEntryText(e.target.value)}
                  disabled={loading} // Disable textarea when loading
                />

                {/* Loading Animation */}
                { loading && (
                  <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-70 backdrop-blur-md">
                    <Lottie animationData={LoadingAnimation} loop={true} className="w-80 h-80"/>
                  </div>
                )}

                {/* Character Count */}
                <p className="text-sm text-gray-600 text-right">{entryText.length}/500</p>
                </div>
                
                <button 
                  type="submit" 
                  className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold p-3 rounded-lg shadow-md hover:shadow-lg 
                    transition-transform transform hover:bg-gradient-to-l ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={loading} // Disable button when loading
                >
                  Save Memory
                </button>
              </form>

              {/* Display GPT-3 Response */}
              {gptResponse && (
                <div className="mt-6 bg-blue-100 p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-bold text-gray-800">Your Friendly AI Assistant:</h3>
                  <p className="text-gray-700 mt-2">{gptResponse}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
