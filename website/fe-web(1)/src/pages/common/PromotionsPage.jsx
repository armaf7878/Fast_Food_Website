import React, { useState, useEffect } from 'react';
import { FaFire } from 'react-icons/fa'; 
import { ShoppingCart, CheckCircle, XCircle } from 'lucide-react'; 
import { API_VoucherShowAll } from '../../app/api';
import "../../styles/promotions.css";
import MainLayout from "../../layouts/MainLayout";
import FoodDetailModal from "../common/FoodDetailModal"; 


const VoucherCard = ({ voucher }) => {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(value);
    };

    const formatPercent = (value) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "percent",
            maximumFractionDigits: 2
        }).format(value);
    };
    return (
        <div className={`voucher-card`}>
            <div className="voucher-left">
                <div className="voucher-icon-emoji">
                    {voucher.discount_type === "percent"
                            ?
                                "🔖"
                            :
                                "💲"
                    }
                </div> 
                <div className="voucher-details">
                    <p className="voucher-code">{voucher.voucher_name}</p> 
                    
                    <p className="voucher-desc">Đơn hàng tối thiểu: {formatCurrency(voucher.min_order_value)}</p> 
                </div>
            </div>
            <div className="voucher-right">
                <p 
                        className="apply-btn" 
                    >
                        {voucher.discount_type === "percent"
                            ?
                                <p>{formatPercent(voucher.discount_value/100)}</p>
                            :
                                <p>{formatCurrency(voucher.discount_value)}</p>
                        }
                </p>
     
                <small style={{ color: '#28a745'}}>
                    Hạn: {voucher.end_date}
                </small>
                <small style={{fontSize: '0.7rem', marginTop: '3px', color: '#999'}}>Số lượng còn lại: {voucher.max_uses - voucher.used_count}</small>
            </div>
        </div>
    );
};


export default function PromotionsPage() {
    const [vouchers, setVouchers] = useState([]);

    const loadAPI = () => {
        API_VoucherShowAll()
        .then((res) => {
            const filterVoucher = res.filter((voucher) => voucher.used_count != voucher.max_uses && (new Date(voucher.end_date) >= new Date()));
            setVouchers(filterVoucher);
        })
        .catch((err) => console.log(err));
    };

    useEffect(() => {
        loadAPI()
    }, []);


    
    return (
        <MainLayout>
                <section className="vouchers-section">
                    <h2 className="section-title">Đã có voucher, không lo về giá !</h2>
                    <div className="vouchers-list">
                        {vouchers.map(v => (
                            <VoucherCard 
                                key={v.voucher_id} 
                                voucher={v} 
                            />
                        ))}
                    </div>
                </section>
        </MainLayout>
    );
}