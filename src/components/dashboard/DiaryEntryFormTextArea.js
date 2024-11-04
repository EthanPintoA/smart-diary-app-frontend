import React from "react";
import Lottie from "lottie-react";

import LoadingAnimation from "../../assets/LoadingAnimation.json";

/**
 * Diary Entry Textarea with Loading animation while submitting form
 *
 * @param {{
 *  entryText: string,
 *  setEntryText: React.Dispatch<React.SetStateAction<string>>,
 *  loading: boolean
 * }} props
 * @returns { JSX.Element }
 */
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

export default TextArea;
