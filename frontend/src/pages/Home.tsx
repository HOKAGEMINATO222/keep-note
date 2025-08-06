import React, { useEffect, useState, useMemo } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import Note from "../components/Note";
import Oops from "../components/Oops";
import oops2Img from "../Images/oops2.png";
import { useNavigate } from "react-router-dom";

interface NoteData {
  _id: string;
  title: string;
  content: string;
  createdAt?: string;
}

interface UserData {
  name: string;
  email: string;
}

const Home: React.FC = () => {
  const [data, setData] = useState<NoteData[] | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [query, setQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [notesPerPage, setNotesPerPage] = useState<number>(6);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchResults, setSearchResults] = useState<NoteData[] | null>(null);

  const navigate = useNavigate();

  const getNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      setIsLoading(true);

      const res = await fetch("http://localhost:5000/getNotes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (result.success) {
        setData(result.notes);
        setUserData(result.user);
      } else {
        alert("Error fetching notes.");
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      alert("Server Error. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Unauthorized");

      const res = await fetch(`http://localhost:5000/notes/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      if (result.success) {
        setData((prev) => prev?.filter((note) => note._id !== id) || []);
        if (searchResults) {
          setSearchResults(
            (prev) => prev?.filter((note) => note._id !== id) || []
          );
        }
      } else {
        alert(result.message || "Error deleting note");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Server error");
    }
  };

  useEffect(() => {
    getNotes();
  }, []);

  // Sử dụng useMemo để lọc ghi chú dựa trên truy vấn tìm kiếm
  const filteredNotes = useMemo(() => {
    if (!query.trim() || !data) {
      return data || [];
    }

    const searchTerm = query.toLowerCase().trim();

    return data.filter((note) => {
      return (
        note.title.toLowerCase().includes(searchTerm) ||
        note.content.toLowerCase().includes(searchTerm)
      );
    });
  }, [query, data]);

  // Cập nhật handleSearchKey để search real-time
  const handleSearchKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setCurrentPage(1);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    // Reset về trang đầu khi người dùng gõ
    setCurrentPage(1);
  };

  // Hiển thị ghi chú dựa trên truy vấn tìm kiếm hoặc dữ liệu gốc
  const displayNotes = query.trim() ? filteredNotes : data || [];

  // Tính toán phân trang với dữ liệu đã filter
  const totalNotes = displayNotes.length;
  const totalPages = Math.ceil(totalNotes / notesPerPage);
  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = displayNotes.slice(indexOfFirstNote, indexOfLastNote);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNotesPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setNotesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1">
        {/* Header Section - Responsive */}
        <div className="mt-4 sm:mt-6 lg:mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Mobile Layout (stacked) */}
            <div className="block lg:hidden space-y-4">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Hi, {userData ? userData.name : ""}
              </h1>

              {/* Search và Notes per page - Mobile */}
              <div className="space-y-3">
                <div className="inputBox w-full">
                  <input
                    onKeyUp={handleSearchKey}
                    onChange={handleInputChange}
                    value={query}
                    type="text"
                    placeholder="Search Notes"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      Notes/page:
                    </label>
                    <select
                      value={notesPerPage}
                      onChange={handleNotesPerPageChange}
                      className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={3}>3</option>
                      <option value={6}>6</option>
                      <option value={9}>9</option>
                      <option value={12}>12</option>
                      <option value={15}>15</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Layout (horizontal) */}
            <div className="hidden lg:flex lg:items-center lg:justify-between">
              <h1 className="text-2xl xl:text-3xl font-semibold text-gray-900">
                Hi, {userData ? userData.name : ""}
              </h1>

              <div className="flex items-center gap-4">
                <div className="inputBox">
                  <input
                    onKeyUp={handleSearchKey}
                    onChange={handleInputChange}
                    value={query}
                    type="text"
                    placeholder="Search Notes"
                    className="w-80 xl:w-96 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    Notes/page:
                  </label>
                  <select
                    value={notesPerPage}
                    onChange={handleNotesPerPageChange}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={3}>3</option>
                    <option value={6}>6</option>
                    <option value={9}>9</option>
                    <option value={12}>12</option>
                    <option value={15}>15</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Thêm thông tin search results nếu đang search */}
        {query.trim() && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
            <p className="text-sm text-gray-600">
              Found <strong>{displayNotes.length}</strong> result
              {displayNotes.length !== 1 ? "s" : ""} for "
              <strong>{query}</strong>"
              {displayNotes.length > 0 && (
                <button
                  onClick={() => {
                    setQuery("");
                    setCurrentPage(1);
                  }}
                  className="ml-2 text-blue-500 hover:text-blue-700 text-sm"
                >
                  Clear search
                </button>
              )}
            </p>
          </div>
        )}

        {/* Pagination Info - Responsive */}
        {displayNotes.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
            <p className="text-sm text-gray-600">
              Showing {indexOfFirstNote + 1}-
              {Math.min(indexOfLastNote, totalNotes)} of {totalNotes}{" "}
              {query.trim() ? "search results" : "notes"}
            </p>
          </div>
        )}

        {/* Notes Grid - Responsive */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-4 sm:gap-6">
            {isLoading ? (
              // Loading placeholder
              <div className="col-span-full flex justify-center items-center py-10">
                <p className="text-gray-500 animate-pulse">Loading notes...</p>
              </div>
            ) : currentNotes.length > 0 ? (
              currentNotes.map((note, index) => (
                <Note
                  key={note._id || index}
                  note={note}
                  index={indexOfFirstNote + index}
                  onDelete={handleDeleteNote}
                />
              ))
            ) : query.trim() ? (
              // Không tìm thấy kết quả search
              <div className="col-span-full flex flex-col items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-gray-500 text-lg mb-2">
                    No notes found for "{query}"
                  </p>
                  <p className="text-gray-400 text-sm mb-4">
                    Try searching with different keywords
                  </p>
                  <button
                    onClick={() => {
                      setQuery("");
                      setCurrentPage(1);
                    }}
                    className="text-blue-500 hover:text-blue-700 font-medium"
                  >
                    Clear search and show all notes
                  </button>
                </div>
              </div>
            ) : data && data.length > 0 ? (
              <div className="col-span-full flex justify-center mt-10">
                <p className="text-gray-500">
                  No notes found for current page.
                </p>
              </div>
            ) : (
              <div className="col-span-full flex justify-center mt-10">
                <Oops
                  title="No Note Found, Create One Now!"
                  image={oops2Img}
                  buttonTitle="Add Note"
                  buttonLink="/addNote"
                />
              </div>
            )}
          </div>
        </div>

        {/* Pagination - Responsive */}
        {totalPages > 1 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
            <div className="flex justify-center">
              {/* Mobile Pagination (Simple) */}
              <div className="block sm:hidden">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Prev
                  </button>

                  <span className="px-3 py-2 text-sm font-medium text-gray-700">
                    {currentPage} / {totalPages}
                  </span>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>

              {/* Desktop Pagination (Full) */}
              <div className="hidden sm:flex items-center gap-1 md:gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNumber) => {
                      // Show pagination logic
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 2 &&
                          pageNumber <= currentPage + 2)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                              currentPage === pageNumber
                                ? "text-blue-600 bg-blue-50 border border-blue-300"
                                : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      } else if (
                        pageNumber === currentPage - 3 ||
                        pageNumber === currentPage + 3
                      ) {
                        return (
                          <span
                            key={pageNumber}
                            className="px-2 py-2 text-gray-500"
                          >
                            ...
                          </span>
                        );
                      }
                      return null;
                    }
                  )}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
