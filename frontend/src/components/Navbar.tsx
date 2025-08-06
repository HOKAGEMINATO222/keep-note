import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Avatar from "react-avatar";

// Kiểu dữ liệu trả về từ server cho user
interface UserData {
  userName: string;
  name: string;
  email: string;
}

interface ApiResponse {
  success: boolean;
  user: UserData;
}

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showLogoutDialog, setShowLogoutDialog] = useState<boolean>(false);

  // Gọi API để lấy thông tin user hiện tại
  const getUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const res = await fetch("http://localhost:5000/getUserDetails", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data: ApiResponse = await res.json();

      if (!data.success || !data.user) {
        navigate("/login");
      } else {
        setUserData(data.user);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setShowLogoutDialog(true);
    setShowUserMenu(false);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const cancelLogout = () => {
    setShowLogoutDialog(false);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  // Đóng menu khi click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".user-menu-container")) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    getUserDetails();
  }, []);

  // Kiểm tra xem có đang ở trang Add Note không
  const isAddNotePage = location.pathname === "/addNote";

  return (
    <nav className="navbar w-full h-[80px] bg-white shadow-sm border-b border-gray-200 px-4 md:px-8 lg:px-12 xl:px-16 flex items-center justify-between sticky top-0 z-40">
      {/* Logo Section */}
      <div className="logo-section flex items-center">
        <button
          onClick={() => navigate("/")}
          className="logo text-xl md:text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-200 cursor-pointer border-none bg-transparent"
        >
          📝 Keep Notes
        </button>
      </div>

      {/* Navigation Links - Hidden on mobile */}
      <div className="nav-links hidden md:flex items-center gap-6">
        <button
          onClick={() => navigate("/")}
          className={`nav-link px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            location.pathname === "/"
              ? "text-blue-600 bg-blue-50 shadow-sm"
              : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
          }`}
        >
          My Notes
        </button>
      </div>

      {/* Right Section */}
      <div className="right-section flex items-center gap-3 md:gap-4">
        {/* Add Note Button */}
        {!isAddNotePage && (
          <button
            className="add-note-btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 md:px-6 md:py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 flex items-center gap-2"
            onClick={() => navigate("/addNote")}
          >
            <span className="text-lg">+</span>
            <span className="hidden sm:inline">Add Note</span>
          </button>
        )}

        {/* User Menu */}
        <div className="user-menu-container relative">
          {isLoading ? (
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-200 animate-pulse"></div>
          ) : (
            <>
              <div
                onClick={toggleUserMenu}
                className="user-avatar-container flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors duration-200"
              >
                <Avatar
                  name={userData?.userName || userData?.name || "User"}
                  size="40"
                  round="50%"
                  className="shadow-sm border-2 border-white"
                  colors={[
                    "#3B82F6",
                    "#10B981",
                    "#F59E0B",
                    "#EF4444",
                    "#8B5CF6",
                  ]}
                />
                <div className="user-info hidden lg:block text-left">
                  <div className="text-sm font-medium text-gray-700">
                    {userData?.name || userData?.userName || "User"}
                  </div>
                  <div className="text-xs text-gray-500">{userData?.email}</div>
                </div>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 hidden md:block ${
                    showUserMenu ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="user-dropdown absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="text-sm font-medium text-gray-900">
                      {userData?.name || userData?.userName}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {userData?.email}
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Profile Settings
                    </button>

                    <button
                      onClick={() => {
                        navigate("/");
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 md:hidden"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      My Notes
                    </button>
                  </div>

                  <div className="border-t border-gray-100 pt-1">
                    <button
                      onClick={() => {
                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.2)] flex items-center justify-center z-[100]">
          <div className="bg-white shadow-lg rounded-md p-6 w-[90%] max-w-[400px] relative">
            <h3 className="text-xl font-semibold">Sign Out</h3>
            <p className="text-gray-600 mt-2 mb-4">
              Are you sure you want to sign out of your account?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Sign Out
              </button>
              <button
                onClick={cancelLogout}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
