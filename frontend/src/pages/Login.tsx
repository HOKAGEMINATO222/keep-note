import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Định nghĩa interface cho phản hồi API
interface LoginResponse {
  success: boolean;
  token: string;
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  // Hàm kiểm tra định dạng email cơ bản
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Xóa lỗi trước đó
    setIsLoading(true); // Bật trạng thái loading

    // Kiểm tra dữ liệu đầu vào
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
      const res = await fetch("http://localhost:5000/login", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      // Kiểm tra trạng thái HTTP
      if (!res.ok) {
        const errorData: { message: string } = await res.json();
        setError(errorData.message || "Đã có lỗi xảy ra");
        setIsLoading(false);
        return;
      }

      const data: LoginResponse = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userID", data.user.id);
        navigate("/");
      } else {
        setError(data.message || "Đăng nhập thất bại");
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
        <h3 className="text-center text-[26px] mb-5 mt-3 font-bold">
          Đăng nhập
        </h3>

        {/* Hiển thị thông báo lỗi nếu có */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

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
          {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        <p className="text-center mb-3 mt-2">
          Chưa có tài khoản?{" "}
          <Link className="text-[#578DF5] hover:underline" to="/signUp">
            Đăng ký
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
