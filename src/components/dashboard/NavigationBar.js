import { useNavigate } from "react-router-dom";

/**
 * NavigationBar component
 *
 * @returns { JSX.Element }
 */
const NavigationBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-lg p-4 flex justify-between items-center">
      <h1 className="text-3xl font-bold text-gray-800 font-serif">
        📔 My Smart Diary
      </h1>
      <button
        className="text-gray-600 hover:text-gray-800"
        onClick={handleLogout}
      >
        🗝️ Logout
      </button>
    </nav>
  );
};

export default NavigationBar;
