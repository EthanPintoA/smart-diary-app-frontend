import { FaEye, FaPenFancy, FaChartBar } from "react-icons/fa";

const Card = ({ title, icon, description, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl cursor-pointer transition-transform transform hover:scale-105 bg-opacity-70 backdrop-blur-md hover:bg-opacity-90"
    >
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <span className="mr-2">{icon}</span>
        {title}
      </h2>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

/**
 * DashboardCards component
 *
 * @param {{ setActiveTab: React.Dispatch<React.SetStateAction<string>> }} props
 * @returns { JSX.Element }
 */
const DashboardCards = ({ setActiveTab }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <Card
        title="View Diary Entries"
        icon={<FaEye className="text-blue-500" />}
        description="Explore your past entries and reflect on your journey."
        onClick={() => setActiveTab("viewDiaries")}
      />
      <Card
        title="New Diary Entry"
        icon={<FaPenFancy className="text-purple-500" />}
        description="Pen down your thoughts and experiences today."
        onClick={() => setActiveTab("newDiary")}
      />
      <Card
        title="Graphs"
        icon={<FaChartBar className="text-green-500" />}
        description="Analyze emotional trends and insights with visual graphs."
        onClick={() => setActiveTab("graphs")}
      />
    </div>
  );
};

export default DashboardCards;
