import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function UserLayout({ children }) {
  return (
    <>
      <Header />
      <main style={{ minHeight: "80vh", background: "#fff" }}>{children}</main>
      <Footer />
    </>
  );
}
