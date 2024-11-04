import React, { useEffect, useState } from "react";
import { FaPenFancy } from "react-icons/fa";

import api from "../../../utils/api";
import UpdateDiaryEntryForm from "./ViewDiaries/UpdateDiaryEntryForm";

/**
 * Diary entry component
 *
 * @param {{
 * diaryEntry: Object,
 * setEdit: React.Dispatch<React.SetStateAction<string>>
 * }} props
 * @returns {JSX.Element} Entry
 */
const Entry = ({ diary, setEdit }) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => setExpanded(!expanded);
  const handleEdit = (event) => {
    event.stopPropagation();
    setEdit(diary.id);
  };

  return (
    <li className="border-b border-gray-300 py-2">
      <div
        className={`hover:bg-gray-100 cursor-pointer p-4 border-l-4 ${
          expanded ? "border-blue-500" : "border-gray-200 hover:border-gray-300"
        } rounded-lg`}
        onClick={toggleExpanded}
      >
        <div className="flex items-center">
          <h3 className="text-lg font-semibold">
            {new Date(diary.createdAt).toLocaleDateString()}
          </h3>
          {expanded ? (
            <FaPenFancy className="ml-2 text-purple-500" onClick={handleEdit} />
          ) : null}
        </div>
        <p
          className={`mt-2 text-gray-600 whitespace-pre-wrap ${
            expanded ? "" : "line-clamp-3"
          }`}
        >
          {diary.text_entry}
        </p>
        {diary.auto_response && (
          <p
            className={`mt-2 text-gray-500 italic max-w-prose ${
              expanded ? "" : "truncate"
            }`}
          >
            {diary.auto_response}
          </p>
        )}
      </div>
    </li>
  );
};

/**
 * Displays a list of diary entries.
 * It can also be used to edit diary entries.
 *
 * @param {{
 *  setError: React.Dispatch<React.SetStateAction<string>>,
 *  setSuccess: React.Dispatch<React.SetStateAction<boolean>
 * }} props
 * @returns {JSX.Element}
 */
const ViewDiaries = ({ setError, setSuccess }) => {
  const [diaries, setDiaries] = useState([]);
  const [edit, setEdit] = useState(null);

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        const response = await api.get("/entries");
        setDiaries(response.data.entries);
      } catch (error) {
        console.error("Error fetching diary entries: ", error);
      }
    };
    fetchDiaries();
  }, []);

  if (edit) {
    return (
      <UpdateDiaryEntryForm
        diaryEntry={diaries.find((diary) => diary.id === edit)}
        setError={setError}
        setSuccess={setSuccess}
        setEdit={setEdit}
      />
    );
  }

  if (diaries.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg bg-opacity-70 backdrop-blur-md">
        <h2 className="text-xl font-bold mb-4">Your Previous Diary Entries</h2>
        <p className="text-gray-600">No diary entries found.</p>
      </div>
    );
  }

  const rows = diaries.map((diary) => (
    <Entry key={diary._id} diary={diary} setEdit={setEdit} />
  ));

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg bg-opacity-70 backdrop-blur-md">
      <h2 className="text-xl font-bold mb-4">Your Previous Diaries</h2>
      <ol>{rows}</ol>
    </div>
  );
};

export default ViewDiaries;
