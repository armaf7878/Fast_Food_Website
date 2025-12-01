import { FaFacebookF, FaInstagram, FaTiktok, FaSnapchatGhost, FaApple, FaGooglePlay } from "react-icons/fa";
import "../../styles/footer.css";

export default function Footer() {
  return (
    <footer>
      <section className="footer-main">
        <div className="footer-left">
          <h2> FastFood</h2>
          <p>Tải ứng dụng của chúng tôi</p>
          <div className="app-buttons">
            <a
              href="https://www.apple.com/app-store/"
              target="_blank"
              rel="noopener noreferrer"
              className="app-btn"
            >
              <FaApple /> App Store
            </a>
            <a
              href="https://play.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="app-btn"
            >
              <FaGooglePlay /> Google Play
            </a>
          </div>
        </div>

        <div className="footer-center">
          <p><strong>Nhận ưu đãi qua email</strong></p>
          <div className="subscribe">
            <input type="email" placeholder="Nhập email của bạn" />
            <button>Đăng ký</button>
          </div>
          <div className="social-icons">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social facebook"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social tiktok"
            >
              <FaTiktok />
            </a>
            <a
              href="https://snapchat.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social snapchat"
            >
              <FaSnapchatGhost />
            </a>
          </div>
        </div>

        <div className="footer-links">
          <h4>Liên kết hữu ích</h4>
          <a href="#">Trợ giúp</a>
          <a href="#">Thêm nhà hàng</a>
          <a href="#">Đăng ký làm shipper</a>
          <a href="#">Tạo tài khoản doanh nghiệp</a>
        </div>

          <div className="footer-legal">
          <h4>Trang Pháp lý</h4>
          <a href="#">Điều khoản và điều kiện</a>
          <a href="#">Chính sách bảo mật</a>
          <a href="#">Cookies</a>
        </div>
      </section>

      <div className="footer-bottom">
        <p>© 2025 FastFood. All rights reserved.</p>
        <div className="footer-terms">
          <a href="#">Chính sách bảo mật</a>
          <a href="#">Điều khoản</a>
          <a href="#">Bảng giá</a>
        </div>
      </div>
    </footer>
  );
}
