import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface UserData {
  name: string;
  email: string;
  createdAt: string;
}

interface Note {
  _id: string;
  title: string;
  content: string;
  date: string;
}

const Profile = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [totalNotes, setTotalNotes] = useState<number>(0);
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [activityStats, setActivityStats] = useState({
    thisWeek: 0,
    thisMonth: 0,
    totalWords: 0,
  });
  const navigate = useNavigate();

  const getUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const res = await fetch("http://localhost:5000/getUserDetails", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();
      if (result.success) setUser(result.user);
      else alert("Failed to fetch user");
    } catch (error) {
      console.error("Error:", error);
      alert("Server error");
    }
  };

  const calculateActivityStats = (notes: Note[]) => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    let thisWeek = 0;
    let thisMonth = 0;
    let totalWords = 0;

    notes.forEach((note) => {
      const noteDate = new Date(note.date);

      // Count notes this week
      if (noteDate >= oneWeekAgo) {
        thisWeek++;
      }

      // Count notes this month
      if (noteDate >= oneMonthAgo) {
        thisMonth++;
      }

      // Calculate total words in all notes
      const textContent = note.content.replace(/<[^>]*>/g, "").trim();
      const wordCount = textContent ? textContent.split(/\s+/).length : 0;
      totalWords += wordCount;
    });

    return { thisWeek, thisMonth, totalWords };
  };

  const getUserNotesCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/getNotes", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();

      console.log("Notes count result:", result);
      console.log(result.notes[0]?.date);

      if (result.success) {
        setTotalNotes(result.notes.length);

        // Calculate activity stats
        const stats = calculateActivityStats(result.notes);
        setActivityStats(stats);

        // Get 3 most recent notes
        const sortedNotes = result.notes
          .sort(
            (a: Note, b: Note) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, 3);
        setRecentNotes(sortedNotes);
      }
    } catch (err) {
      console.error("Error fetching notes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserDetails();
    getUserNotesCount();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB");
  };

  const formatDateRelative = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return formatDate(dateStr);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <>
        <div className="w-full max-w-6xl mx-auto px-6 py-10">
          <div className="animate-pulse">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-32 h-32 bg-gray-300 rounded-full"></div>
              <div>
                <div className="h-8 bg-gray-300 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-32"></div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="w-full max-w-6xl mx-auto px-6 py-10">
          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Profile Info */}
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {user?.name ? getInitials(user.name) : "U"}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {user?.name || "User"}
                  </h1>
                  <p className="text-gray-600 mb-1">{user?.email}</p>
                  <p className="text-sm text-gray-500 flex items-center justify-center md:justify-start gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Joined{" "}
                    {user?.createdAt ? formatDate(user.createdAt) : "N/A"}
                  </p>
                </div>
              </div>

              {/* Stats & Actions */}
              <div className="flex flex-col gap-4 w-full lg:w-auto">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-xl text-center">
                  <div className="text-3xl font-bold">{totalNotes}</div>
                  <div className="text-sm opacity-90">Total Notes</div>
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 lg:w-32 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Add Photo
                  </button>
                  <button
                    onClick={() => navigate("/addNote")}
                    className="flex-1 lg:w-32 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Add Note
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Notes */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Recent <span className="text-blue-600">Notes</span>
                  </h2>
                  <button
                    onClick={() => navigate("/")}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View All →
                  </button>
                </div>

                {recentNotes.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path
                          fillRule="evenodd"
                          d="M4 5a2 2 0 012-2v1a2 2 0 002 2h2a2 2 0 002-2V3a2 2 0 012 2v6.5a2.5 2.5 0 01-2.5 2.5h-7A2.5 2.5 0 014 11.5V5zM6 6.5a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm0 3a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-500 mb-2">
                      No notes yet
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Start writing your first note!
                    </p>
                    <button
                      onClick={() => navigate("/addNote")}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create Note
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentNotes.map((note) => (
                      <div
                        key={note._id}
                        className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => navigate(`/note/${note._id}`)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-800 truncate flex-1">
                            {note.title}
                          </h3>
                          <span className="text-xs text-gray-500 ml-4 whitespace-nowrap">
                            {formatDateRelative(note.date)}
                          </span>
                        </div>
                        <div
                          className="text-gray-600 text-sm line-clamp-4 mt-2 overflow-hidden"
                          dangerouslySetInnerHTML={{ __html: note.content }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats & Actions */}
            <div className="space-y-6">
              {/* Activity Stats */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Activity
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">This Week</span>
                    <span className="font-semibold text-green-600">
                      +{activityStats.thisWeek} notes
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">This Month</span>
                    <span className="font-semibold text-blue-600">
                      +{activityStats.thisMonth} notes
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Words</span>
                    <span className="font-semibold text-purple-600">
                      ~{formatNumber(activityStats.totalWords)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/")}
                    className="w-full p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3"
                  >
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Search Notes
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="w-full p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3"
                  >
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
