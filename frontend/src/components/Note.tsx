import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import deleteImg from "../Images/delete.png";
import editImg from "../Images/edit.png";

interface NoteProps {
  note: {
    _id: string;
    title: string;
    content: string;
    date?: string;
    isImportant?: boolean;
  };
  index: number;
  onDelete: (id: string) => void;
}

const Note: React.FC<NoteProps> = ({ note, index, onDelete }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/editNote/${note._id}`);
  };

  return (
    <>
      <div
        className={`note relative p-4 bg-white shadow rounded-md border  h-[250px] flex flex-col justify-between transition-transform hover:scale-[1.02] hover:shadow-lg ${
          note.isImportant
            ? "border-orange-300 bg-gradient-to-br from-orange-50 to-white"
            : "border-gray-200"
        }`}
        onClick={() => navigate(`/note/${note._id}`)}
      >
        <div>
          <div className="flex justify-between items-start mb-1">
            <p className="text-gray-500 text-sm">Note #{index + 1}</p>
            {note.isImportant && (
              <div className="flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium border border-orange-200">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Important
              </div>
            )}
          </div>
          <h1 className="text-black text-lg font-semibold line-clamp-1">
            {note.title}
          </h1>
          <div
            className="text-gray-600 text-sm line-clamp-4 mt-2 overflow-hidden"
            dangerouslySetInnerHTML={{ __html: note.content }}
          />
        </div>

        <div className="noteBottom flex justify-between items-center mt-4">
          <p className="text-gray-400 text-sm">
            {note.date ? new Date(note.date).toLocaleDateString() : "No date"}
          </p>

          <div className="flex items-center gap-2">
            <img
              className="w-[30px] h-[30px] cursor-pointer hover:scale-110 transition-transform"
              src={deleteImg}
              alt="Delete"
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteModalOpen(true);
              }}
            />
            <img
              className="w-[35px] h-[35px] cursor-pointer hover:scale-110 transition-transform"
              src={editImg}
              alt="Edit"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit();
              }}
            />
          </div>
        </div>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.2)] flex items-center justify-center z-[100]">
          <div className="bg-white shadow-lg rounded-md p-6 w-[90%] max-w-[400px] relative">
            <h3 className="text-xl font-semibold">
              Delete Note <span className="text-[#578df5]">"{note.title}"</span>
            </h3>
            <p className="text-gray-600 mt-2 mb-4">
              Do you want to delete this note?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  onDelete(note._id);
                  setIsDeleteModalOpen(false);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Note;
