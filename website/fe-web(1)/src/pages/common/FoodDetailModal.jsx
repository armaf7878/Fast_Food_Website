import React, { useState } from 'react';
import { Minus, Plus, ShoppingCart, X } from 'lucide-react'; 
import {API_CartAdd} from '../../app/api'
// Hàm helper addToCart (giữ nguyên)
const addToCart = (food, quantity) => {
    API_CartAdd(food.food_id, quantity)
    .then((res) => alert(res.message))
    .catch((err) => console.log(err))
};

// Component RelatedFoodCard (giữ nguyên)
const RelatedFoodCard = ({ food, onSelect }) => (
    <div 
        className="related-food-card" 
        onClick={() => onSelect(food)}
        style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
    >
        <img 
            src={food.food_img || 'https://placehold.co/100x100/CCCCCC/333333?text=Food'} 
            alt={food.food_name} 
            style={{ width: '100%', height: '80px', objectFit: 'cover' }}
        />
        <div style={{ padding: '8px', textAlign: 'center' }}>
            <h4>{food.food_name}</h4>
            <p>{(food.food_price || food.food_price).toLocaleString("vi-VN")} ₫</p>
        </div>
    </div>
);


export default function FoodDetailModal({ food, relatedFoods, onClose, onSelectRelatedFood }) {
    const [quantity, setQuantity] = useState(1);
    
    const maxQuantity = food.maxQuantity || food.quantity_available || 999; 
    
    React.useEffect(() => {
        if (quantity > maxQuantity) {
            setQuantity(maxQuantity);
        }
    }, [maxQuantity, quantity]);


    const handleAddToCart = () => {
        if (quantity <= 0 || quantity > maxQuantity) return;
        addToCart(food, quantity);
        onClose(); 
    };
    
    const currentPrice = food.newPrice || food.food_price;
    const isPromotion = !!food.newPrice;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="food-detail-modal" onClick={e => e.stopPropagation()}>
                
                {/* Phần Overview chính */}
                <div className="main-overview">
                    <button className="close-btn" onClick={onClose}><X size={24} /></button>
                    
                    <div className="image-section">
                        <img 
                            src={food.food_img || 'https://placehold.co/300x200/CCCCCC/333333?text=Food'} 
                            alt={food.food_name} 
                            className="food-image"
                        />
                    </div>

                    <div className="info-section">
                        <h2 className="food-name">{food.food_name}</h2>
                        <p className="food-category">Danh mục: <strong>{food.catalog_id}</strong></p>
                        
                        {/* Hiển thị giá (ĐÃ SỬ DỤNG CLASS PURE CSS) */}
                        {isPromotion ? (
                            <div className="promotion-price-display">
                                <span className="old-price">{food.food_price.toLocaleString("vi-VN")} ₫</span>
                                <span className="new-price-modal">{currentPrice.toLocaleString("vi-VN")} ₫</span>
                            </div>
                        ) : (
                             <p className="food-price">{currentPrice.toLocaleString("vi-VN")} ₫</p>
                        )}
                        
                        <p className="stock-info">
                            Tồn kho: 
                            <strong className={maxQuantity < 10 ? 'text-red-500' : 'text-green-600'}>
                                {maxQuantity === 999 ? 'Không giới hạn' : maxQuantity}
                            </strong>
                            {maxQuantity < 5 && maxQuantity !== 999 && <span className='text-red-500 ml-2'> (Sắp hết!)</span>}
                        </p>
                        
                        {/* VÙNG ACTION ROW */}
                        <div className="modal-action-row">
                            <div className="quantity-controls">
                                <button 
                                    className="control-btn minus" 
                                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                    disabled={quantity <= 1}
                                >
                                    <Minus />
                                </button>
                                <span className="quantity-display">{quantity}</span>
                                <button 
                                    className="control-btn plus" 
                                    onClick={() => setQuantity(prev => Math.min(prev + 1, maxQuantity))}
                                    disabled={quantity >= maxQuantity}
                                >
                                    <Plus />
                                </button>
                            </div>
                            
                            <button className="add-to-cart-btn" onClick={() => addToCart(food, quantity)}>
                                <ShoppingCart /> Đặt ngay ({ (currentPrice * quantity).toLocaleString("vi-VN")} ₫)
                            </button>
                        </div>
                    </div>
                </div>

                {/* Phần Món ăn gợi ý */}
                {relatedFoods.length > 0 && (
                    <div className="related-section">
                        <h3>Món ăn gợi ý</h3>
                        <div className="related-foods-list">
                            {relatedFoods.map(relFood => (
                                <RelatedFoodCard 
                                    key={relFood.food_id} 
                                    food={relFood} 
                                    onSelect={onSelectRelatedFood} 
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}