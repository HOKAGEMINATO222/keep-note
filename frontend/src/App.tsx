import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import NoPage from "./pages/NoPage";
import Home from "./pages/Home";
import SearchPage from "./pages/SearchPage";
import Profile from "./pages/Profile";
import AddNote from "./pages/AddNote";
import EditNote from "./pages/EditNote";
import SingleNotePage from "./pages/SingleNotePage";
import Layout from "./components/Layout";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Các route không dùng layout */}
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        {/* Các route dùng layout (Navbar + Footer) */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/addNote" element={<AddNote />} />
          <Route path="/editNote/:id" element={<EditNote />} />
          <Route path="/note/:id" element={<SingleNotePage />} />
          <Route path="/single" element={<SingleNotePage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
