import React, { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom'; 
import { Utensils, Zap, Clock, MapPin } from 'lucide-react';
import MainLayout from "../../layouts/MainLayout";
import "../../styles/restaurants.css";
// 🚀 IMPORT COMPONENT MODAL MỚI
import FoodDetailModal from "../common/FoodDetailModal"; 

// Dữ liệu giả lập cho các nhà hàng (Đã thêm ID cho món ăn)
const restaurantsData = [
    {
        id: 'mc',
        name: "McDonald's",
        tagline: "I'm Lovin' It! - Tốc độ và chất lượng chuẩn mực.",
        image: "../../../images/mcdo.jpg",
        eta: "20 phút",
        foods: [
            { id: 'mc-bigmac', name: "Big Mac", price: 79000, img: "../../../images/big.jpg" },
            { id: 'mc-nuggets', name: "McNuggets 6 miếng", price: 65000, img: "../../../images/nuggets.jpg" },
            { id: 'mc-fries', name: "French Fries (L)", price: 45000, img: "../../../images/chips.jpg" },
        ]
    },
    {
        id: 'kfc',
        name: "KFC",
        tagline: "Vị ngon trên từng ngón tay - Gà rán Colonel Sanders trứ danh.",
        image: "../../../images/kfc.png",
        eta: "25 phút",
        foods: [
            { id: 'kfc-orig', name: "Gà rán Original", price: 49000, img: "../../../images/gatruyenthong.jpg" },
            { id: 'kfc-zinger', name: "Burger Zinger", price: 55000, img: "../../../images/zinger.jpg" },
            { id: 'kfc-mash', name: "Khoai tây nghiền", price: 35000, img: "../../../images/khoaitay.webp" },
        ]
    },
    {
        id: 'papa',
        name: "Papa John's",
        tagline: "Better Ingredients. Better Pizza. - Pizza tươi ngon, giao tận nơi.",
        image: "../../../images/papa.png",
        eta: "35 phút",
        foods: [
            { id: 'papa-pep', name: "Pepperoni Pizza (L)", price: 199000, img: "../../../images/peppe.jpg" },
            { id: 'papa-bbq', name: "Gà nướng BBQ", price: 89000, img: "../../../images/bbq.png" },
            { id: 'papa-stick', name: "Cheese Sticks", price: 59000, img: "../../../images/cheesestick.jpg" },
        ]
    },
    {
        id: 'bk',
        name: "Burger King",
        tagline: "Have It Your Way - Bánh burger nướng lửa độc đáo.",
        image: "../../../images/burgerking.png",
        eta: "22 phút",
        foods: [
            { id: 'bk-whop', name: "Whopper", price: 85000, img: "../../../images/whop.jpg" },
            { id: 'bk-chifri', name: "Chicken Fries", price: 59000, img: "../../../images/fried chicken bucket.jpg" },
            { id: 'bk-onion', name: "Onion Rings", price: 39000, img: "../../../images/onion.avif" },
        ]
    },
    {
        id: 'lotte',
        name: "Lotteria",
        tagline: "Thực đơn đa dạng, phong cách Hàn Quốc trẻ trung.",
        image: "../../../images/lotte.jpg",
        eta: "28 phút",
        foods: [
            { id: 'lotte-bull', name: "Burger Bò Bulgogi", price: 69000, img: "../../../images/Bulgogi.jpg" },
            { id: 'lotte-shaking', name: "Khoai tây lắc", price: 45000, img: "../../../images/khoailac.jpg" },
            { id: 'lotte-soy', name: "Gà sốt đậu nành", price: 59000, img: "../../../images/gasotdaunanh.webp" },
        ]
    },
];

// Component Thẻ món ăn (Food Card)
// 🚀 THAY ĐỔI: Thêm prop onOpenModal, thay Link bằng div/onClick cho vùng ảnh/tên
const FoodCard = ({ food, restaurantName, onOrderClick, onOpenModal }) => (
    <div className="food-card">
        {/* Vùng click mở modal */}
        <div 
            className="food-click-area"
            onClick={() => onOpenModal(food, restaurantName)}
        >
            <img 
                src={food.img} 
                alt={food.name} 
                className="food-img" 
            />
            <h4>{food.name}</h4>
        </div>
        <span className="price">{food.price.toLocaleString('vi-VN')}₫</span>
        <button 
            className="order-btn"
            onClick={() => onOrderClick({ ...food, restaurant: restaurantName, quantity: 1 })}
        >
            Đặt
        </button>
    </div>
);

// Component Thẻ Nhà Hàng (Restaurant Card)
// 🚀 THAY ĐỔI: Thêm prop onOpenModal
const RestaurantCard = ({ restaurant, onOrderClick, onOpenModal }) => (
    <div className="restaurant-card-container">
        <div className="restaurant-header">
            <img 
                src={restaurant.image} 
                alt={restaurant.name} 
                className="restaurant-logo"
            />
            <div className="restaurant-info">
                <h3>{restaurant.name}</h3>
                <p className="tagline">{restaurant.tagline}</p>
                <div className="restaurant-details">
                    <span className="flex items-center"><MapPin /> Vị trí gần nhất</span>
                    <span className="flex items-center"><Clock /> ETA: {restaurant.eta}</span>
                </div>
            </div>
        </div>

        <h4 className="featured-foods-title">
            <Zap />
            3 Món Nổi Bật Nhất
        </h4>
        
        <div className="foods-grid">
            {restaurant.foods.map((food) => (
                <FoodCard 
                    key={food.id} 
                    food={food} 
                    restaurantName={restaurant.name} 
                    onOrderClick={onOrderClick}
                    onOpenModal={onOpenModal} // 🚀 TRUYỀN onOpenModal XUỐNG FoodCard
                />
            ))}
        </div>
        
        <Link 
            to={`/menu?rest=${encodeURIComponent(restaurant.name)}`} 
            className="view-all-menu-cta"
        >
            Xem toàn bộ Menu ({restaurant.name}) →
        </Link>
    </div>
);


export default function PopularRestaurantsPage() {
    const [searchParams] = useSearchParams();
    const [notification, setNotification] = useState(null); 
    const [selectedFood, setSelectedFood] = useState(null); // 🚀 STATE CHO MODAL
    const restaurantNameFromUrl = searchParams.get('name'); 
    const restaurantRefs = useRef({});

    // ----------------------------------------------------------------------
    // 🚀 HÀM XỬ LÝ MODAL
    // ----------------------------------------------------------------------

    // Hàm đóng Modal
    const handleCloseModal = () => {
        setSelectedFood(null);
    };

    // Hàm mở Modal và chuẩn bị dữ liệu
    const handleOpenModal = (food, restaurant) => {
        // Tạo dữ liệu chi tiết cho modal, bao gồm món liên quan
        const currentRestaurant = restaurantsData.find(r => r.name === restaurant);
        
        const detailedFood = {
            ...food,
            restaurantName: restaurant,
            description: `Món ${food.name} trứ danh từ ${restaurant}. Đây là món ăn được yêu thích nhất trong menu của chúng tôi. Nguyên liệu tươi ngon, chế biến theo công thức độc quyền.`,
        };

        const relatedFoods = currentRestaurant?.foods
            .filter(f => f.id !== food.id)
            .slice(0, 3) || []; // Lấy 3 món liên quan

        setSelectedFood({ ...detailedFood, relatedFoods });
    };

    // Hàm đặt món TỪ MODAL (sau đó đóng modal)
    const handleOrderFromModal = (foodItem) => {
        handleAddToCart(foodItem);
        handleCloseModal(); // Đóng modal sau khi đặt món
    };

    // ----------------------------------------------------------------------
    // HÀM XỬ LÝ ĐẶT MÓN (Giữ nguyên)
    // ----------------------------------------------------------------------
    const handleAddToCart = (foodItem) => {
        let success = false;
        try {
            const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
            
            const existingItemIndex = currentCart.findIndex(item => item.id === foodItem.id);

            if (existingItemIndex > -1) {
                currentCart[existingItemIndex].quantity += 1;
            } else {
                currentCart.push(foodItem);
            }

            localStorage.setItem('cart', JSON.stringify(currentCart));
            success = true;
        } catch (error) {
            console.error("Lỗi khi thêm vào giỏ hàng:", error);
        }

        if (success) {
            setNotification({
                message: `Đã thêm 1 x ${foodItem.name} (${foodItem.restaurant}) vào Giỏ hàng!`,
                type: 'success'
            });

            setTimeout(() => {
                setNotification(null);
            }, 3000);
        }
    };
    // ----------------------------------------------------------------------

    // Logic cuộn: (Giữ nguyên)
    useEffect(() => {
        if (restaurantNameFromUrl) {
            const decodedName = decodeURIComponent(restaurantNameFromUrl);
            const targetRef = restaurantRefs.current[decodedName];
            
            if (targetRef) {
                targetRef.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                }); 
            }
        }
    }, [restaurantNameFromUrl]); 

    const highlightName = restaurantNameFromUrl ? decodeURIComponent(restaurantNameFromUrl) : null;
    
    return (
        <MainLayout>
            <div className="restaurants-page-container">
                <h1 className="flex items-center">
                    <Utensils className="w-10 h-10 mr-2" />
                    Các Nhà Hàng Phổ Biến Nhất
                </h1>
                
                {highlightName && (
                    <p className="highlight-notification">
                        Bạn đã chọn: <strong>{highlightName}</strong>. Đang ưu tiên hiển thị và cuộn đến vị trí!
                    </p>
                )}

                <p className="subtitle">
                    Khám phá Menu và Ưu đãi Flash từ các thương hiệu hàng đầu.
                </p>

                <section className="restaurants-list">
                    {restaurantsData.map(restaurant => (
                        <div 
                            key={restaurant.id}
                            ref={el => restaurantRefs.current[restaurant.name] = el}
                            className={`restaurant-item-wrapper ${restaurant.name === highlightName ? 'highlighted' : ''}`}
                        >
                            <RestaurantCard 
                                restaurant={restaurant} 
                                onOrderClick={handleAddToCart}
                                onOpenModal={handleOpenModal} // 🚀 TRUYỀN HÀM MỞ MODAL
                            />
                        </div>
                    ))}
                </section>
                
                {/* 🚀 RENDER MODAL CHI TIẾT MÓN ĂN */}
                {selectedFood && (
                    <FoodDetailModal 
                        food={selectedFood}
                        // Giả định FoodDetailModal có thể tự xử lý món liên quan
                        relatedFoods={selectedFood.relatedFoods}
                        onClose={handleCloseModal}
                        onAddToCart={handleOrderFromModal} // Sử dụng hàm đặt món từ modal
                        customCtaText="Thêm vào Giỏ hàng"
                    />
                )}
                {/* ---------------------------------------------------- */}

                {/* THÔNG BÁO (TOAST) KHI THÊM VÀO GIỎ HÀNG THÀNH CÔNG (Giữ nguyên) */}
                {notification && (
                    <div className={`toast-notification ${notification.type}`}>
                        {notification.type === 'success' ? '✅' : '❌'} {notification.message}
                        <Link to="/cart" className="view-cart-link">
                            Xem Giỏ Hàng
                        </Link>
                    </div>
                )}
                {/* ---------------------------------------------------- */}


                {/* CTA */}
                <div className="explore-cta">
                    <h3>Bạn muốn khám phá thêm?</h3>
                    <Link 
                        to="/menu" 
                        className="menu-btn"
                    >
                        Xem Menu Toàn Bộ Ứng Dụng
                    </Link>
                </div>

            </div>
        </MainLayout>
    );
}