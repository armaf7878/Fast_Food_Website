import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_Login } from "../../app/api";
import { jwtDecode } from "jwt-decode";
import AuthLayout from "../../layouts/AuthLayout";
import "../../styles/layout.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    API_Login(form.username, form.password)
    .then((res) => {
      if(res.message == 'Đăng nhập thành công'){
          localStorage.setItem("currentUser", res.access);
          alert(`Đăng nhập thành công!`);
          const decode = jwtDecode(localStorage.getItem("currentUser"))
          if(decode.role == "shipper"){
              console.log("hello")
              navigate("/shipper/dashboard");
          }
          else if(decode.role == "staff"){
              navigate("/staff/dashboard");
          }
          else{
            navigate("/");
          }
          
      }

    })
    .catch((err) => alert(`${err.response.data.detail}`));

  };

  return (
    <AuthLayout>
      <h1 className="login-title">Đăng nhập vào FastFood</h1>
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
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Đăng nhập</button>
      </form>
      <p className="auth-link">
        Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
      </p>
    </AuthLayout>
  );
}


