import { useState } from "react";
import "../../styles/account.css";

export default function AccountPage() {
  const savedUser = JSON.parse(localStorage.getItem("currentUser")) || {
    username: "guest123",
    name: "Khách Vãng Lai",
    email: "guest@example.com",
    phone: "",
    gender: "",
    dob: "",
    avatar: "",
    password: "",
  };

  const [user, setUser] = useState(savedUser);
  const [activeTab, setActiveTab] = useState("profile");
  const [passwords, setPasswords] = useState({
    oldPass: "",
    newPass: "",
    confirmPass: "",
  });
  const [newEmail, setNewEmail] = useState(user.email);
  const [newPhone, setNewPhone] = useState(user.phone);

  // Cập nhật vào cả users và currentUser
  const updateUserStorage = (updatedUser) => {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    users = users.map((u) =>
      u.username === updatedUser.username ? updatedUser : u
    );
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
  };

  // Lưu hồ sơ 
  const handleSave = () => {
    updateUserStorage(user);
    alert("Cập nhật hồ sơ thành công!");
  };

  // Avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const updatedUser = { ...user, avatar: event.target.result };
        setUser(updatedUser);
        updateUserStorage(updatedUser);
      };
      reader.readAsDataURL(file);
    }
  };

  // Đổi mật khẩu 
  const handlePasswordChange = () => {
    if (passwords.newPass !== passwords.confirmPass) {
      alert("Mật khẩu mới không khớp!");
      return;
    }
    if (passwords.oldPass !== user.password) {
      alert("Mật khẩu cũ không đúng!");
      return;
    }
    const updatedUser = { ...user, password: passwords.newPass };
    setUser(updatedUser);
    updateUserStorage(updatedUser);
    alert("Đổi mật khẩu thành công!");
    setPasswords({ oldPass: "", newPass: "", confirmPass: "" });
  };

  // Cập nhật email 
  const handleEmailChange = () => {
    const updatedUser = { ...user, email: newEmail };
    setUser(updatedUser);
    updateUserStorage(updatedUser);
    alert("Email đã được cập nhật!");
  };

  //  Cập nhật SĐT 
  const handlePhoneChange = () => {
    const updatedUser = { ...user, phone: newPhone };
    setUser(updatedUser);
    updateUserStorage(updatedUser);
    alert("Số điện thoại đã được cập nhật!");
  };

  //  Thay đổi form 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="account-container">
      {/* Sidebar */}
      <aside className="account-sidebar">
        <div className="profile-mini">
          <img
            src={user.avatar || "https://via.placeholder.com/80"}
            alt="avatar"
          />
          <p>{user.username}</p>
        </div>
        <ul>
          <li
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => setActiveTab("profile")}
          >
            Hồ sơ
          </li>
          <li
            className={activeTab === "password" ? "active" : ""}
            onClick={() => setActiveTab("password")}
          >
            Đổi mật khẩu
          </li>
          <li
            className={activeTab === "email" ? "active" : ""}
            onClick={() => setActiveTab("email")}
          >
            Cập nhật Email
          </li>
          <li
            className={activeTab === "phone" ? "active" : ""}
            onClick={() => setActiveTab("phone")}
          >
            Cập nhật SĐT
          </li>
        </ul>
      </aside>

      {/* Main content */}
      <main className="account-main">
        {/* Hồ sơ */}
        {activeTab === "profile" && (
          <>
            <h2>Hồ Sơ Của Tôi</h2>
            <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
            <div className="account-form">
              <div className="form-left">
                <label>
                  Tên đăng nhập
                  <input type="text" value={user.username} disabled />
                </label>
                <label>
                  Tên
                  <input
                    type="text"
                    name="name"
                    value={user.name}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Email
                  <input type="email" value={user.email} disabled />
                </label>
                <label>
                  Số điện thoại
                  <input
                    type="text"
                    name="phone"
                    value={user.phone}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại"
                  />
                </label>
                <div className="gender-row">
                  <span>Giới tính:</span>
                  {["Nam", "Nữ", "Khác"].map((g) => (
                    <label key={g}>
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={user.gender === g}
                        onChange={handleChange}
                      />
                      {g}
                    </label>
                  ))}
                </div>
                <label>
                  Ngày sinh
                  <input
                    type="date"
                    name="dob"
                    value={user.dob}
                    onChange={handleChange}
                  />
                </label>
                <button className="save-btn" onClick={handleSave}>
                  Lưu thay đổi
                </button>
              </div>

              <div className="form-right">
                <img
                  src={user.avatar || "https://via.placeholder.com/100"}
                  alt="avatar"
                  className="profile-img"
                />
                <label className="upload-btn">
                  Chọn Ảnh
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    hidden
                  />
                </label>
                <p>Dung lượng file tối đa 1MB. Định dạng: .JPEG, .PNG</p>
              </div>
            </div>
          </>
        )}

        {/* Đổi mật khẩu */}
        {activeTab === "password" && (
          <>
            <h2>Đổi Mật Khẩu</h2>
            <div className="account-form single-col">
              <label>
                Mật khẩu cũ
                <input
                  type="password"
                  value={passwords.oldPass}
                  onChange={(e) =>
                    setPasswords({ ...passwords, oldPass: e.target.value })
                  }
                />
              </label>
              <label>
                Mật khẩu mới
                <input
                  type="password"
                  value={passwords.newPass}
                  onChange={(e) =>
                    setPasswords({ ...passwords, newPass: e.target.value })
                  }
                />
              </label>
              <label>
                Nhập lại mật khẩu mới
                <input
                  type="password"
                  value={passwords.confirmPass}
                  onChange={(e) =>
                    setPasswords({ ...passwords, confirmPass: e.target.value })
                  }
                />
              </label>
              <button className="save-btn" onClick={handlePasswordChange}>
                Đổi mật khẩu
              </button>
            </div>
          </>
        )}

        {/* Cập nhật Email */}
        {activeTab === "email" && (
          <>
            <h2>Cập Nhật Email</h2>
            <div className="account-form single-col">
              <label>
                Email hiện tại
                <input type="email" value={user.email} disabled />
              </label>
              <label>
                Email mới
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </label>
              <button className="save-btn" onClick={handleEmailChange}>
                Lưu Email mới
              </button>
            </div>
          </>
        )}

        {/* Cập nhật SĐT */}
        {activeTab === "phone" && (
          <>
            <h2>Cập Nhật Số Điện Thoại</h2>
            <div className="account-form single-col">
              <label>
                Số hiện tại
                <input type="text" value={user.phone} disabled />
              </label>
              <label>
                Số mới
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                />
              </label>
              <button className="save-btn" onClick={handlePhoneChange}>
                Lưu SĐT mới
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

