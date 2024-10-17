import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { FaEye, FaChartBar, FaPenFancy } from "react-icons/fa";

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

   // Logout function
   const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

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

      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg p-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 font-serif">📔 My Smart Diary</h1>
        <button className="text-gray-600 hover:text-gray-800" onClick={handleLogout}>🗝️ Logout</button>
      </nav>

      {/* Dashboard Cards */}
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* View Diaries Card */}
          <div
            onClick={() => setActiveTab("viewDiaries")}
            className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl cursor-pointer transition-transform transform hover:scale-105 bg-opacity-70 backdrop-blur-md hover:bg-opacity-90"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center"><FaEye className="mr-2 text-blue-500"/>View Diaries</h2>
            <p className="text-gray-600">Explore your past entries and reflect on your journey.</p>
          </div>

          {/* New Diary Entry Card */}
          <div
            onClick={() => setActiveTab("newDiary")}
            className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl cursor-pointer transition-transform transform hover:scale-105 bg-opacity-70 backdrop-blur-md hover:bg-opacity-90"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center"><FaPenFancy className="mr-2 text-purple-500"/>New Diary Entry</h2>
            <p className="text-gray-600">Pen down your thoughts and experiences today.</p>
          </div>

          {/* Graphs (Emotional Trends) Card */}
          <div
            onClick={() => setActiveTab("graphs")}
            className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl cursor-pointer transition-transform transform hover:scale-105 bg-opacity-70 backdrop-blur-md hover:bg-opacity-90"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center"><FaChartBar className="mr-2 text-green-500"/>Graphs</h2>
            <p className="text-gray-600">Analyze emotional trends and insights with visual graphs.</p>
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="mt-8">
          {activeTab === "default" && (
            <p className="text-center text-gray-600">Select an option above to get started.</p>
          )}

          {/* View Diaries */}
          {activeTab === "viewDiaries" && (
            <div className="bg-white p-6 rounded-xl shadow-lg bg-opacity-70 backdrop-blur-md">
              <h2 className="text-xl font-bold mb-4">Your Previous Diaries</h2>
              <p className="text-gray-600">[Here we will display a list of all diary entries.]</p>
            </div>
          )}

          {/* Graphs */}
          {activeTab === "graphs" && (
            <div className="bg-white p-6 rounded-xl shadow-lg bg-opacity-70 backdrop-blur-md">
              <h2 className="text-xl font-bold mb-4">Emotional Trends</h2>
              <p className="text-gray-600">[Here we will display mood graphs and word clouds.]</p>
            </div>
          )}

          {/* New Diary Entry Form */}
          {activeTab === "newDiary" && (
            <div className="bg-white p-6 rounded-xl shadow-lg bg-opacity-70 backdrop-blur-md">
              <h2 className="text-xl font-bold mb-4">Share your thoughts here...</h2>
              
              <form onSubmit={handleSubmit}>
                <textarea
                  className="w-full p-4 mb-4 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Write your thoughts here..."
                  rows={window.innerWidth >= 1024 ? 16 : window.innerWidth >= 768 ? 8 : 4} // Default 16 rows for desktop, 8 for tablet, 4 for mobile
                  value={entryText}
                  onChange={(e) => setEntryText(e.target.value)}
                />
                <button 
                  type="submit" 
                  className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold p-3 rounded-lg shadow-md hover:shadow-lg 
                    transition-transform transform hover:bg-gradient-to-l ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>
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
