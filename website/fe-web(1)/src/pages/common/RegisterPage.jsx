import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import "../../styles/layout.css";


export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
    role: "user",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirm) {
      alert("Mật khẩu xác nhận không trùng khớp!");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const exists = users.some((u) => u.username === form.username);

    if (exists) {
      alert("Tên người dùng đã tồn tại!");
      return;
    }

    const newUser = {
      username: form.username,
      email: form.email,
      password: form.password,
      role: form.role,
      name: form.username,
      phone: "",
      gender: "",
      dob: "",
      avatar: "",
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Đăng ký thành công! Hãy đăng nhập.");
    navigate("/login");
  };

  return (
    <AuthLayout>
      <h1 className="login-title">Tạo tài khoản FastFood</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          name="username"
          placeholder="Tên người dùng"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirm"
          placeholder="Xác nhận mật khẩu"
          value={form.confirm}
          onChange={handleChange}
          required
        />
        <label>Chọn vai trò:</label>
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="user">Khách hàng</option>
          <option value="staff">Nhân viên</option>
          <option value="shipper">Shipper</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Đăng ký</button>
      </form>
      <p className="auth-link">
        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
      </p>
    </AuthLayout>
  );
}
