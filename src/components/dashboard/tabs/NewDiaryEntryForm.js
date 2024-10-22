import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";

import api from "../../../utils/api";
import LoadingAnimation from "../../../assets/LoadingAnimation.json";

/** Diary Entry Textarea with Loading animation while submitting form */
const TextArea = ({ entryText, setEntryText, loading }) => {
  /** Default 16 rows for desktop, 8 for tablet, 4 for mobile */
  const diaryRowCount =
    window.innerWidth >= 1024 ? 16 : window.innerWidth >= 768 ? 8 : 4;

  return (
    <div className="relative">
      <textarea
        className={`w-full p-4 mb-4 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500
        ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        placeholder="Share your thoughts..."
        rows={diaryRowCount}
        value={entryText}
        onChange={(e) => setEntryText(e.target.value)}
        disabled={loading} // Disable textarea when loading
      />

      {/* Loading Animation */}
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-70 backdrop-blur-md">
          <Lottie
            animationData={LoadingAnimation}
            loop={true}
            className="w-80 h-80"
          />
        </div>
      )}

      {/* Character Count */}
      <p className="text-sm text-gray-600 text-right">{entryText.length}/500</p>
    </div>
  );
};

/**
 * New Diary Entry Form component
 *
 * @param {{
 *  setError: React.Dispatch<React.SetStateAction<string>>,
 *  setSuccess: React.Dispatch<React.SetStateAction<boolean>
 * }} props
 * @returns {JSX.Element} NewDiaryEntryForm
 */
const NewDiaryEntryForm = ({ setError, setSuccess }) => {
  const [entryText, setEntryText] = useState("");
  const [gptResponse, setGptResponse] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (gptResponse) {
      const timer = setTimeout(() => {
        setGptResponse("");
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [gptResponse]);

  /**
   * Handles the form submission for creating a new diary entry
   *
   * @param {Event} event
   * @returns
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
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
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg bg-opacity-70 backdrop-blur-md">
      <h2 className="text-xl font-bold mb-4">My Personal Space</h2>

      <form onSubmit={handleSubmit}>
        <TextArea
          entryText={entryText}
          setEntryText={setEntryText}
          loading={loading}
        />

        <button
          type="submit"
          className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold p-3 rounded-lg shadow-md hover:shadow-lg 
            transition-transform transform hover:bg-gradient-to-l ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          disabled={loading} // Disable button when loading
        >
          Save Memory
        </button>
      </form>

      {/* Display GPT-3 Response */}
      {gptResponse && (
        <div className="mt-6 bg-blue-100 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-gray-800">
            Your Friendly AI Assistant:
          </h3>
          <p className="text-gray-700 mt-2">{gptResponse}</p>
        </div>
      )}
    </div>
  );
};

export default NewDiaryEntryForm;
