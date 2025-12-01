import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom'; 
import { API_OrderClientShowAll, API_OrderCanceled} from "../../app/api";
import { Package, AlertTriangle, XCircle, ShoppingBag } from 'lucide-react'; 
import MainLayout from "../../layouts/MainLayout";
import TrackingPopup from "./TrackingPopup";
import "../../styles/orderTracking.css"; 


const formatCurrency = (price) => {
    return (Number(price) || 0).toLocaleString("vi-VN") + " ₫";
};


const OrderCard = ({ order, onCancel }) => {
 
    const getStatusClass = (status) => {
        switch (status) {
            case "cooking":
                return "status-processing";
            case "delivering":
                return "status-shipping";
            case "finish":
                return "status-delivered";
            case "canceled":
                return "status-cancelled";
            default:
                return "status-processing";
        }
    };

    const canCancel = order.status === "pending" && order.payment_status === 'pending';
    const locationShipper = order.status === "delivering";

    const [showTracking, setShowTracking] = useState(false);

    const shipperPos = { lat: 10.7895, lon: 106.7012 };
    const customerPos = { lat: 10.8001, lon: 106.7123 };

    return (
        <div className="order-card">
            <div className="order-header">
                <div className="order-id">
                    <Package size={18} /> Đơn hàng **#{order.order_id}**
                </div>
                <div className={`order-status ${getStatusClass(order.status)}`}>
                    <span className="status-dot"></span>
                    {order.status}
                </div>
            </div>
            
            <div className="order-meta">
                <p><strong>Ngày đặt:</strong> {order.order_date}</p>
                <p><strong>Thanh toán:</strong> {order.payment_method === 'cod' ? 'Tiền mặt (COD)' : 'Ví VNPAY'}</p>
                <p><strong>Trạng Thái Thanh toán:</strong> {order.payment_status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}</p>
            </div>

            <div className="order-items-list">
                <h4>Chi tiết món ăn:</h4>
                {order.order_items_read.map((item, index) => (
                    <div key={item.orderItem_id || index} className="order-item">
                        <img src={`http://localhost:8000/media/${item.food_img}`|| 'https://via.placeholder.com/50'} alt={item.food_name} />
                        <span className="item-name">{item.food_name}</span>
                        <span className="item-qty">x {item.quantity}</span>
                        <span className="item-price">{formatCurrency(item.food_price * item.quantity)}</span>
                    </div>
                ))}
            </div>
            
            <div className="order-summary-footer">
{/*                 {order.discount && (
                    <p className="summary-row">
                        <span>Giảm giá ({order.discount.code}):</span>
                        <strong>- {formatCurrency(order.discount.amount)}</strong>
                    </p>
                )} */}
                <p className="summary-row total-row">
                    <span>Tổng cộng:</span>
                    <strong>{formatCurrency(order.total)}</strong>
                </p>

                {canCancel && (
                    <div className="order-actions">
                        <button 
                            className="btn-cancel"
                            onClick={() => onCancel(order.orderItem_id)}
                        >
                            <XCircle size={18} /> Hủy Đơn Hàng
                        </button>
                    </div>
                )}
                {locationShipper && (
                    <div className="order-actions">
                        <button 
                            className="btn-location"
                            onClick={() => setShowTracking(true)}
                        >
                            Xem vị trí món
                        </button>

                        <TrackingPopup 
                            visible={showTracking}
                            onClose={() => setShowTracking(false)}
                            shipperPos={shipperPos}
                            order={order}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};


export default function OrderTrackingPage() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate(); 


    const loadAPI = () => {
        API_OrderClientShowAll()
        .then((res) => {
            setOrders(res);
            setIsLoading(false)
         }
        )
        .catch((err) => console.log(err))
    };



    useEffect(() => {
        loadAPI();
    }, []);
    
    const handleCancelOrder = (orderId) => {
        if (window.confirm(`Bạn có chắc chắn muốn hủy đơn hàng #${orderId} không? Hành động này không thể hoàn tác.`)) {
            API_OrderCanceled(orderId)
            .then((res) => {
                alert(res.message);
                window.location.reload();
            })
            .catch((err) => alert(err.response.data.detail))
            
        }
    };

    return (
        <MainLayout>
            <div className="order-tracking-page">
                <h2>Lịch sử Đơn hàng và Theo dõi</h2>
                
                {isLoading ? (
                    <p>Đang tải đơn hàng...</p>
                ) : (
                    <div className="order-list">
                        {orders.length > 0 ? (
                            [...orders].reverse().map(order => (
                                <OrderCard 
                                    key={order.order_id} 
                                    order={order} 
                                    onCancel={() => handleCancelOrder(order.order_id)} 
                                />
                            ))
                        ) : (
                            <div className="no-orders">
                                <AlertTriangle />
                                <p>Bạn chưa có đơn hàng nào. Hãy đặt món ngay!</p>
                                <button
                                    className="btn-primary" 
                                    onClick={() => navigate('/menu')}
                                >
                                    <ShoppingBag size={20} /> Đặt Món Ngay
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}