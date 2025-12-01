import React, { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import '../../styles/application.css'; // 👈 THÊM STYLES Ở BƯỚC 2

export default function ApplicationForm() {
    // 1. Khai báo state để lưu trữ dữ liệu form
    const [formData, setFormData] = useState({
        name: '',
        gender: '',
        dob: '', // Date of Birth
        phone: '',
        email: '',
        position: 'shipper', // Mặc định là shipper
    });

    // 2. Hàm xử lý thay đổi input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 3. Hàm xử lý khi nhấn nút Đăng ký/Nộp
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Kiểm tra đơn giản
        if (!formData.name || !formData.phone || !formData.position) {
            alert("Vui lòng điền đầy đủ các trường bắt buộc.");
            return;
        }

        console.log("Dữ liệu hồ sơ đã nộp:", formData);
        
        // 💥 Tại đây, bạn sẽ gọi API để gửi dữ liệu hồ sơ lên server
        alert(`Cảm ơn ${formData.name}. Hồ sơ ứng tuyển vị trí ${formData.position === 'shipper' ? 'Shipper' : 'Nhân viên'} đã được gửi thành công!`);
        
        // Reset form sau khi nộp
        setFormData({
            name: '',
            gender: '',
            dob: '',
            phone: '',
            email: '',
            position: 'shipper',
        });
    };

    return (
        <MainLayout>
            <div className="application-page">
                <div className="application-container">
                    <h2>Đăng Ký Ứng Tuyển</h2>
                    <p className="subtitle">Vui lòng điền thông tin cá nhân và chọn vị trí bạn muốn ứng tuyển.</p>

                    <form onSubmit={handleSubmit} className="application-form">
                        {/* INPUT: Tên */}
                        <div className="form-group">
                            <label htmlFor="name">Họ và Tên (*)</label>
                            <input 
                                type="text" 
                                id="name" 
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* INPUT: Giới tính */}
                        <div className="form-group">
                            <label htmlFor="gender">Giới tính</label>
                            <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                <option value="">-- Chọn --</option>
                                <option value="male">Nam</option>
                                <option value="female">Nữ</option>
                                <option value="other">Khác</option>
                            </select>
                        </div>

                        {/* INPUT: Ngày sinh */}
                        <div className="form-group">
                            <label htmlFor="dob">Ngày tháng năm sinh</label>
                            <input 
                                type="date" 
                                id="dob" 
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                            />
                        </div>

                        {/* INPUT: SĐT */}
                        <div className="form-group">
                            <label htmlFor="phone">Số điện thoại (*)</label>
                            <input 
                                type="tel" 
                                id="phone" 
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* INPUT: Email */}
                        <div className="form-group">
                            <label htmlFor="email">Địa chỉ Email</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <hr />

                        {/* RADIO/SELECT: Vị trí ứng tuyển */}
                        <div className="form-group position-select">
                            <label>Vị trí ứng tuyển (*)</label>
                            <div className="radio-group">
                                <label className="radio-label">
                                    <input 
                                        type="radio" 
                                        name="position"
                                        value="shipper"
                                        checked={formData.position === 'shipper'}
                                        onChange={handleChange}
                                    />
                                    Shipper
                                </label>
                                <label className="radio-label">
                                    <input 
                                        type="radio" 
                                        name="position"
                                        value="staff"
                                        checked={formData.position === 'staff'}
                                        onChange={handleChange}
                                    />
                                    Nhân viên
                                </label>
                            </div>
                        </div>

                        <button type="submit" className="submit-btn">
                            Nộp Hồ Sơ
                        </button>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}