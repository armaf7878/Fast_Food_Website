import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import { useNavigate } from "react-router-dom"; 
import "../../styles/checkout.css";
import { CreditCard, Wallet, AlertTriangle } from 'lucide-react';
import { API_OrderCreate, API_VoucherShowAll  } from "../../app/api";

const formatCurrency = (price) => {
    return price.toLocaleString("vi-VN") + " ₫";
};

export default function CheckoutPage() {
    const navigate = useNavigate(); 

    const [cart, setCart] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);

    const [subTotal, setSubTotal] = useState(0); 
    const [appliedDiscount, setAppliedDiscount] = useState(null); 
    const [discountAmount, setDiscountAmount] = useState(0); 
    const [finalTotal, setFinalTotal] = useState(0); 
    const [voucherList, setVoucherList] = useState([]);
    const [showVoucherPopup, setShowVoucherPopup] = useState(false);
    const [order_lat, setOrder_Lat] = useState(0);
    const [order_long, setOrder_Long] = useState(0);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [form, setForm] = useState({
        name: "",
        address: "",
        phone: "",
        note: "",
    });

    const [paymentMethod, setPaymentMethod] = useState("cod");

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCart(storedCart);

        const storedSelected = JSON.parse(localStorage.getItem("selectedItems") || "[]");
        setSelectedItems(storedSelected);

        const sum = storedSelected.reduce(
            (acc, item) => acc + item.food.food_price * item.quantity,
            0
        );
        setSubTotal(sum);
        setFinalTotal(sum);
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSelectPayment = (method) => {
        setPaymentMethod(method);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedItems.length === 0) {
            alert("Bạn chưa chọn món nào để thanh toán!");
            return;
        }

        const currentUser = localStorage.getItem("currentUser");
        if (!currentUser) {
            alert("Bạn cần đăng nhập để đặt hàng!");
            return;
        }

        const items = selectedItems.map((item) => ({
            food_id: item.food.food_id,
            quantity: item.quantity,
        }));

        // Chuẩn hóa body API
        const orderPayload = {
            voucher_id: appliedDiscount ? appliedDiscount.voucher_id : null,
            order_lat: order_lat || 0,
            order_long:order_long || 0,
            order_address: form.address,
            order_phone: form.phone,
            payment_method: paymentMethod,
            items: items
        };

        console.log("ORDER BODY gửi API:", orderPayload);
        API_OrderCreate(orderPayload)
        .then((res) => {
            alert("Đặt hàng thành công!");
            localStorage.removeItem("selectedItems");
            if (paymentMethod == 'vnpay'){
                window.location.href = res.payment_url
            }
            else(navigate("/order-tracking"))
        })
        .catch((err) =>{
            console.log(err)
        });
        
        
        
    };

    const getUserPosition = () => {
        if (!navigator.geolocation) {
            alert("Trình duyệt không hỗ trợ định vị.");
            return;
        }
        setLoadingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setOrder_Lat(latitude);
                setOrder_Long(longitude);
                setLoadingLocation(false);
                console.log( pos.coords);
            }),
            (err) => {
                console.error("Lỗi định vị:", err);
                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        alert("Bạn đã từ chối quyền truy cập vị trí!");
                        break;
                    case err.POSITION_UNAVAILABLE:
                        alert("Không lấy được vị trí hiện tại.");
                        break;
                    case err.TIMEOUT:
                        alert("Lấy vị trí quá lâu, vui lòng thử lại.");
                        break;
                    default:
                        alert("Không xác định được vị trí.");
                }
            },

            {
                enableHighAccuracy: true,   
                timeout: 10000,             
                maximumAge: 0
            }
    }

    return (
        <MainLayout>
            <div className="checkout-page">
                <h2>Thanh toán đơn hàng</h2>

                <div className="checkout-content">
                    
                    {/* FORM */}
                    <form className="checkout-form" onSubmit={handleSubmit}>
                        <h3>Thông tin giao hàng</h3>

                        <input
                            type="text"
                            name="name"
                            placeholder="Họ và tên người nhận"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="text"
                            name="address"
                            placeholder="Địa chỉ giao hàng"
                            value={form.address}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="tel"
                            name="phone"
                            placeholder="Số điện thoại"
                            value={form.phone}
                            onChange={handleChange}
                            required
                        />

                        <textarea
                            name="note"
                            placeholder="Ghi chú thêm (nếu có)"
                            value={form.note}
                            onChange={handleChange}
                            rows="3"
                        ></textarea>
                        <button 
                            type="button"
                            onClick={() => getUserPosition()}
                            className="btn-location"
                            disabled={loadingLocation}
                        >
                            {loadingLocation ? "Đang lấy vị trí..." : "Lấy vị trí của tôi"}
                        </button>
                        {/* Payment */}
                        <div className="payment-method">
                            <h4>Chọn Phương thức thanh toán</h4>
                            <div className="radio-group">
                                <label
                                    className={`payment-option-card ${paymentMethod === 'cod' ? 'selected' : ''}`}
                                    onClick={() => handleSelectPayment('cod')}
                                >
                                    <Wallet className="payment-icon" />
                                    <span>Tiền mặt (COD)</span>
                                </label>

                                <label
                                    className={`payment-option-card ${paymentMethod === 'vnpay' ? 'selected' : ''}`}
                                    onClick={() => handleSelectPayment('vnpay')}
                                >
                                    <CreditCard className="payment-icon" />
                                    <span>Ví VNPay</span>
                                </label>
                            </div>
                        </div>
                        <button 
                            type="button" 
                            className="btn-voucher" 
                            onClick={async () => {
                                const vouchers = await API_VoucherShowAll();
                                setVoucherList(vouchers);
                                setShowVoucherPopup(true);
                            }}
                        >
                             Chọn mã giảm giá
                        </button>
                        <button type="submit" className="btn-checkout">
                            Đặt hàng ngay - {formatCurrency(finalTotal)}
                        </button>
                    </form>

                    {/* SUMMARY */}
                    <div className="checkout-summary">
                        <h3>Món đã chọn</h3>
                        <ul>
                            {selectedItems.map((item) => (
                                <li key={item.cartItem_id}>
                                    <img src={item.food.food_img} alt={item.food.food_name} />
                                    <div>
                                        <p>{item.food.food_name}</p>
                                        <span>
                                            {item.quantity} × {formatCurrency(item.food.food_price)}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="checkout-total">
                            <strong>Thành tiền:</strong>
                            <strong>{formatCurrency(finalTotal)}</strong>
                        </div>
                    </div>
                </div>
                
                {showVoucherPopup && (
                    <div className="voucher-popup-overlay">
                        <div className="voucher-popup">
                            <h3>Chọn mã giảm giá</h3>

                            {voucherList.length === 0 ? (
                                <p>Không có mã giảm giá nào</p>
                            ) : (
                                voucherList.map((v) => (
                                    <div key={v.voucher_id} className="voucher-card">
                                        <div>
                                            <h4>{v.voucher_name}</h4>
                                            <p>
                                                Giảm: {v.discount_type === "percent"
                                                    ? v.discount_value + "%"
                                                    : formatCurrency(Number(v.discount_value))}
                                            </p>
                                            <p>Đơn tối thiểu: {formatCurrency(Number(v.min_order_value))}</p>
                                        </div>

                                        <button
                                            className="btn-apply-voucher"
                                            onClick={() => {
                                                setAppliedDiscount(v);
                                                setShowVoucherPopup(false);
                                                
                                                // Tính lại tổng tiền nếu cần
                                                if (v.discount_type === "percent") {
                                                    const amount = subTotal * (Number(v.discount_value) / 100);
                                                    setDiscountAmount(amount);
                                                    setFinalTotal(subTotal - amount);
                                                } else {
                                                    const amount = Number(v.discount_value);
                                                    setDiscountAmount(amount);
                                                    setFinalTotal(Math.max(subTotal - amount, 0));
                                                }
                                            }}
                                        >
                                            Áp dụng
                                        </button>
                                    </div>
                                ))
                            )}

                            <button className="btn-close-popup" onClick={() => setShowVoucherPopup(false)}>
                                Đóng
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </MainLayout>
    );
}

