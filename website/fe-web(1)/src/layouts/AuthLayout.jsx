import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import "../styles/layout.css";

export default function AuthLayout({ children }) {
  return (
    <div className="auth-layout-with-header">
      <Header />
      {/* form đăng nhập/đăng ký */}
      <div className="auth-content">
        <div className="auth-card">{children}</div>
      </div>
      <Footer />
    </div>
  );
}
