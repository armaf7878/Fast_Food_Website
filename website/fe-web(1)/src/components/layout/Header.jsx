import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/header.css";
import { FaShoppingCart } from "react-icons/fa";
import { FiHome, FiGrid, FiGift, FiTruck } from "react-icons/fi";
import { API_CartShowAll } from "../../app/api";

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const currentUser = localStorage.getItem("currentUser");
  const location = useLocation();
  const navigate = useNavigate()
  const navItems = [
    { to: "/", label: "Trang chủ", icon: <FiHome /> },
    { to: "/menu", label: "Thực đơn", icon: <FiGrid /> },
    { to: "/promotions", label: "Ưu đãi", icon: <FiGift /> }, 
    { to: "/order-tracking", label: "Theo dõi đơn", icon: <FiTruck /> },
  ];

  const handleAboutClick = (e, tab = "intro") => {
    e.preventDefault();
    if (location.pathname !== "/") {
      window.location.href = `/?about=${tab}`;
    } else {
      const aboutSection = document.getElementById("about");
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: "smooth", block: "start" });
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("changeAboutTab", { detail: tab }));
        }, 300);
      }
    }
  };
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser){
        loadAPI()
    }
    
  }, []);

    //DANH CODING
    const loadAPI = () => {
        API_CartShowAll()
        .then((res) => setCartCount(res.length))
        .catch((err) => console.log(err));
    };
  return (
    <header>
      {/* Thanh khuyến mãi */}
      <div className="promo-bar">
        <span>
           Giảm 5% cho đơn đầu tiên — Mã: <strong>FASTFOOD5</strong>
        </span>
        <div className="promo-right">
          <span className="promo-location"> 123 Nguyễn Huệ, Quận 1, TP.HCM</span>
        </div>
      </div>

      {/* Header chính */}
      <div className="header-main">
        <Link to="/" className="logo" aria-label="FastFood - Trang chủ">
          <div className="logo-emblem logo-shope">
            <div className="logo-handle" aria-hidden="true" />
            <div className="logo-bag">
              <span className="logo-letter">N</span>
              <span className="logo-number">9</span>
            </div>
          </div>
          <div className="logo-text">
            <strong>FastFood</strong>
            <small>Delivery Club</small>
          </div>
        </Link>

        <nav className="nav-links">
          {navItems.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={`nav-link ${location.pathname === to ? "active" : ""}`}
            >
              <span className="nav-icon">{icon}</span>
              {label}
            </Link>
          ))}
          <button
            className="nav-link"
            onClick={(e) => handleAboutClick(e, "intro")}
          >
            <span className="nav-icon"></span>
            Giới thiệu
          </button>
          <button
            className="nav-link"
            onClick={(e) => handleAboutClick(e, "contact")}
          >
            <span className="nav-icon"></span>
            Liên hệ
          </button>
        </nav>

        {/* Góc phải header */}
        <div className="header-right">
          <Link to="/cart" className="cart-box">
            <FaShoppingCart className="cart-icon" />
            <span className="cart-text">{cartCount} món</span>
          </Link>

          {currentUser ? (
            <div className="account-dropdown">
                <button className="auth-btn">
                    {currentUser?.fullname || "Tài khoản"}
                </button>
              <div className="dropdown-content">
                <Link to="/account">Tài khoản của tôi</Link>
                <Link to="/cart">Đơn hàng</Link> 

{/*                 chỉ admin mới thấy */}
                {currentUser?.role === "admin" && (
                  <Link to="/admin/dashboard">Quản lý món ăn</Link>
                )}
                {/* chỉ staff mới thấy */}
                {currentUser?.role === "staff" && (
                  <Link to="/staff/dashboard">Quản lý đơn hàng</Link>
                )}
                {/* chỉ shipper mới thấy */}
                {currentUser?.role === "shipper" && (
                  <Link to="/shipper/dashboard">Giao hàng</Link>
                )}
                <button
                  onClick={() => {
                    localStorage.removeItem("currentUser");
                    navigate('/')
                  }}
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login">
              <button className="auth-btn">Đăng nhập / Đăng ký</button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
