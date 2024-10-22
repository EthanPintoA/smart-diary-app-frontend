import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  NavigationBar,
  DashboardCards,
  ViewDiaries,
  NewDiaryEntryForm,
  Graphs,
} from "../components/dashboard";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("newDiary");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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
  }, [navigate, success, error]);

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
            <NewDiaryEntryForm setError={setError} setSuccess={setSuccess} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
