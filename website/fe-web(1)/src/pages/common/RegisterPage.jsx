import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { API_Register } from "../../app/api";
import AuthLayout from "../../layouts/AuthLayout";
import "../../styles/layout.css";


export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
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

    if (exists) {
      alert("Tên người dùng đã tồn tại!");
      return;
    }

    const newUser = {
      full_name: form.full_name,
      email: form.email,
      password: form.password,
      phone: form.phone,
      gender: form.gender,
    };

    API_Register(newUser)
    .then((res) => {
      alert(res.message, "Hãy đăng nhập"),
      navigate("/login");
    })
    .catch((err) => {
      console.log(err);
      alert("Tạo tài khoản thất bại")
    })

    
  };

  return (
    <AuthLayout>
      <h1 className="login-title">Tạo tài khoản FastFood</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          name="full_name"
          placeholder="Tên người dùng"
          value={form.full_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Số điện thoại"
          value={form.phone}
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
        <label>Chọn giới tính:</label>
        <select name="role" value={form.gender} onChange={handleChange}>
          <option value="male">Nam</option>
          <option value="female">Nữ</option>
        </select>
        <button type="submit">Đăng ký</button>
      </form>
      <p className="auth-link">
        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
      </p>
    </AuthLayout>
  );
}
