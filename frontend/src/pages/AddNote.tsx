import React, { useState, useRef } from "react";
import JoditEditor from "jodit-react";
import CheckBox from "../tools/CheckBox";
import { useNavigate } from "react-router-dom";

// CSS cho animation
const modalStyles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .modal-fade-in {
    animation: fadeIn 0.2s ease-out;
  }
`;

interface ApiResponse {
  success: boolean;
  message?: string;
}

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "warning";
}

const AddNote: React.FC = () => {
  const editorRef = useRef(null);

  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDesc] = useState<string>("");
  const [isImportant, setIsImportant] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);

  const navigate = useNavigate();

  // Toast functions
  const addToast = (message: string, type: "success" | "error" | "warning") => {
    const newToast: Toast = {
      id: Date.now(),
      message,
      type,
    };
    setToasts((prev) => [...prev, newToast]);

    // Auto remove toast after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== newToast.id));
    }, 4000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = "Please enter a note title";
    }

    if (!description.trim()) {
      newErrors.description = "Please enter a note description";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        addToast("Authentication required. Please login again.", "error");
        navigate("/login");
        return;
      }

      const res = await fetch("http://localhost:5000/addNote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          content,
          isImportant,
        }),
      });

      const data: ApiResponse = await res.json();

      if (res.ok && data.success) {
        addToast("Note added successfully!", "success");
        setTimeout(() => navigate("/"), 1500);
      } else {
        addToast(data.message || "Error adding note!", "error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      addToast(
        "Network error. Please check your connection and try again.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowCancelDialog(true);
  };

  const confirmCancel = () => {
    navigate("/");
  };

  const cancelDialog = () => {
    setShowCancelDialog(false);
  };

  const handleReset = () => {
    setShowResetDialog(true);
  };

  const confirmReset = () => {
    setTitle("");
    setDesc("");
    setContent("");
    setIsImportant(false);
    setErrors({});
    setShowResetDialog(false);
    addToast("Form reset successfully!", "success");
  };

  const cancelResetDialog = () => {
    setShowResetDialog(false);
  };

  return (
    <>
      {/* Inject CSS styles */}
      <style>{modalStyles}</style>

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`max-w-sm rounded-lg shadow-lg p-4 text-white transform transition-all duration-300 ease-in-out ${
              toast.type === "success"
                ? "bg-green-500"
                : toast.type === "error"
                ? "bg-red-500"
                : "bg-yellow-500"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="mr-2">
                  {toast.type === "success" && "✓"}
                  {toast.type === "error" && "✕"}
                  {toast.type === "warning" && "⚠"}
                </span>
                <p className="text-sm font-medium">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-2 text-white hover:text-gray-200"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.2)] flex items-center justify-center z-[100]">
          <div className="bg-white shadow-lg rounded-md p-6 w-[90%] max-w-[400px] relative modal-fade-in">
            <h3 className="text-xl font-semibold">Discard Changes?</h3>
            <p className="text-gray-600 mt-2 mb-4">
              Are you sure you want to cancel? All unsaved changes will be lost.
            </p>

            <div className="flex justify-end gap-5">
              <button
                onClick={confirmCancel}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Yes, Discard
              </button>
              <button
                onClick={cancelDialog}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Keep Editing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      {showResetDialog && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.2)] flex items-center justify-center z-[100]">
          <div className="bg-white shadow-lg rounded-md p-6 w-[90%] max-w-[400px] relative modal-fade-in">
            <h3 className="text-xl font-semibold">Reset Form?</h3>
            <p className="text-gray-600 mt-2 mb-4">
              Are you sure you want to reset the form? All data will be lost.
            </p>

            <div className="flex justify-end gap-5">
              <button
                onClick={confirmReset}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
              >
                Yes, Reset
              </button>
              <button
                onClick={cancelResetDialog}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="addNoteCon min-h-screen px-[50px]">
        <form onSubmit={submitForm} className="my-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="m-0 p-0 text-2xl">Create A New Note</h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-orange-700 bg-orange-100 rounded-md hover:bg-orange-200 transition-colors"
                disabled={isSubmitting}
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </div>

          <div className="inputBox !block !bg-transparent">
            <label htmlFor="title" className="my-2 block font-medium">
              Enter A Note Title *
            </label>
            <input
              type="text"
              placeholder="Note Title"
              className={`w-full p-2 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? "border-red-500 focus:ring-red-500" : ""
              }`}
              style={{
                border: errors.title ? "2px solid #ef4444" : "2px solid #555",
              }}
              name="title"
              id="title"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setTitle(e.target.value);
                if (errors.title) {
                  setErrors((prev) => ({ ...prev, title: "" }));
                }
              }}
              value={title}
              required
              disabled={isSubmitting}
              maxLength={100}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
            <small className="text-gray-500 text-xs mt-1 block">
              {title.length}/100 characters
            </small>
          </div>

          <div className="inputBox !block !bg-transparent">
            <label htmlFor="description" className="my-2 block font-medium">
              Enter A Note Description *
            </label>
            <textarea
              placeholder="Note Description"
              className={`w-full p-2 rounded-md mt-1 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical ${
                errors.description ? "border-red-500 focus:ring-red-500" : ""
              }`}
              style={{
                border: errors.description
                  ? "2px solid #ef4444"
                  : "2px solid #555",
              }}
              name="description"
              id="description"
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setDesc(e.target.value);
                if (errors.description) {
                  setErrors((prev) => ({ ...prev, description: "" }));
                }
              }}
              value={description}
              required
              disabled={isSubmitting}
              maxLength={500}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
            <small className="text-gray-500 text-xs mt-1 block">
              {description.length}/500 characters
            </small>
          </div>

          <div className="my-4">
            <CheckBox
              title="Mark as Important"
              check={isImportant}
              setCheck={setIsImportant}
            />
          </div>

          <div className="my-4">
            <label className="block font-medium mb-2">Note Content</label>
            <JoditEditor
              ref={editorRef}
              value={content}
              tabIndex={1}
              onChange={(newContent: string) => setContent(newContent)}
            />
          </div>

          <div className="flex gap-3 my-6">
            <button
              className="btnNormal !min-w-[200px] bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Adding Note...
                </span>
              ) : (
                "Add Note"
              )}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="btnNormal !min-w-[200px] bg-gray-500 hover:bg-gray-600 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="btnNormal !min-w-[200px] bg-orange-500 hover:bg-orange-600 transition-colors"
              disabled={isSubmitting}
            >
              Reset Form
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddNote;
