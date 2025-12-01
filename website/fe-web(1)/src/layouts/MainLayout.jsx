import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import "../styles/layout.css";

export default function MainLayout({ children }) {
  return (
    <div className="main-layout">
      <Header />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
}
