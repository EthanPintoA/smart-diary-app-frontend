import React, { useEffect, useState } from "react";

import api from "../../../../utils/api";
import TextArea from "../../DiaryEntryFormTextArea";

/**
 * New Diary Entry Form component
 *
 * @param {{
 *  diaryEntry: Object,
 *  setError: React.Dispatch<React.SetStateAction<string>>,
 *  setSuccess: React.Dispatch<React.SetStateAction<boolean>>,
 *  setEdit: React.Dispatch<React.SetStateAction<boolean>>,
 * }} props
 * @returns {JSX.Element} NewDiaryEntryForm
 */
const UpdateDiaryEntryForm = ({
  diaryEntry,
  setError,
  setSuccess,
  setEdit,
}) => {
  const [entryText, setEntryText] = useState("");
  const [gptResponse, setGptResponse] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => setEntryText(diaryEntry.text_entry), []);

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
      const response = await api.put(`/entries/${diaryEntry.id}`, {
        text_entry: entryText,
      });
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

      {/* Back Button */}
      <button
        onClick={() => setEdit(null)} // Note: setEdit(null) will close the form and go back to the ViewDiaries tab
        className="mt-4 w-full bg-gray-500 text-white font-bold p-3 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:bg-gray-600"
      >
        Back
      </button>

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

export default UpdateDiaryEntryForm;
