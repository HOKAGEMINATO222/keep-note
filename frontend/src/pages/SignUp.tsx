import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// Định nghĩa interface cho phản hồi API
interface SignUpResponse {
  success: boolean;
  message: string;
}

const SignUp: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userName, setUsername] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const navigate = useNavigate();

  // Hàm kiểm tra định dạng email cơ bản
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    if (showDialog) {
      const timer = setTimeout(() => {
        setShowDialog(false);
        navigate("/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showDialog, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Xóa lỗi trước đó
    setIsLoading(true); // Bật trạng thái loading

    // Kiểm tra dữ liệu đầu vào
    if (!userName || userName.length < 3) {
      setError("Tên người dùng phải có ít nhất 3 ký tự");
      setIsLoading(false);
      return;
    }

    if (!name || name.length < 2) {
      setError("Tên phải có ít nhất 2 ký tự");
      setIsLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      setError("Vui lòng nhập email hợp lệ");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/signUp", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName,
          name,
          email,
          password,
        }),
      });

      if (!res.ok) {
        const errorData: { message: string } = await res.json();
        setError(errorData.message || "Đã có lỗi xảy ra");
        setIsLoading(false);
        return;
      }

      const data: SignUpResponse = await res.json();

      if (data.success) {
        setShowDialog(true);
      } else {
        setError(data.message || "Đăng ký thất bại");
      }
    } catch (err: unknown) {
      console.error("Lỗi khi gửi form:", err);
      setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container bg-[#F4F4F4] w-full max-w-none flex items-center flex-col justify-center min-h-[100vh]">
      <form
        onSubmit={handleSubmit}
        className="form w-full max-w-md p-6 bg-white rounded-lg shadow-md"
      >
        <h3 className="text-center text-[26px] mb-5 mt-3 font-bold">Đăng ký</h3>

        {/* Hiển thị thông báo lỗi nếu có */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="inputBox mb-4">
          <input
            onChange={(e) => setUsername(e.target.value)}
            value={userName}
            type="text"
            placeholder="Tên người dùng"
            name="username"
            id="username"
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#578DF5]"
          />
        </div>

        <div className="inputBox mb-4">
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Họ và tên"
            name="name"
            id="name"
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#578DF5]"
          />
        </div>

        <div className="inputBox mb-4">
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Email"
            name="email"
            id="email"
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#578DF5]"
          />
        </div>

        <div className="inputBox mb-4">
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="Mật khẩu"
            name="password"
            id="password"
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#578DF5]"
          />
        </div>

        <button
          type="submit"
          className="btnBig w-full mt-3 mb-3 p-2 bg-[#578DF5] text-white rounded hover:bg-[#4678D4] disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? "Đang đăng ký..." : "Đăng ký"}
        </button>

        <p className="text-center mb-3 mt-2">
          Đã có tài khoản?{" "}
          <Link className="text-[#578DF5] hover:underline" to="/login">
            Đăng nhập
          </Link>
        </p>
      </form>
      {/* Hiển thị dialog thông báo đăng ký thành công */}
      {showDialog && (
        <div className="fixed top-4 right-4 p-6 bg-white rounded-lg shadow-lg max-w-sm w-full z-50">
          <h3 className="text-lg font-bold mb-4">Đăng ký thành công!</h3>
          <p className="mb-4">
            Tài khoản của bạn đã được tạo. Đang chuyển hướng...
          </p>
        </div>
      )}
    </div>
  );
};

export default SignUp;
