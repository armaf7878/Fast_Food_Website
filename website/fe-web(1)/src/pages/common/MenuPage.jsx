import { useState, useEffect } from "react";
import { API_FoodShowAll, API_CateShowAll } from "../../app/api";
import MainLayout from "../../layouts/MainLayout";
import "../../styles/menu.css";

import FoodDetailModal from "./FoodDetailModal"; 
import { useParams } from "react-router-dom";


const getRandomFoods = (allFoods, excludeId, count = 3) => {
    const availableFoods = allFoods.filter(food => food.catalog_id === excludeId);
    if (availableFoods.length <= count) return availableFoods;
    const shuffled = availableFoods.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};


export default function MenuPage({cate_id}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFood, setSelectedFood] = useState(null);
    const [relatedFoods, setRelatedFoods] = useState([]);


    // ------------------DANH'S CODE LINK API---------------------

    const [foods, setFoods] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filterCategory, setFilterCategory] = useState("Tất cả");
    const {cateId} = useParams();
    const loadAPI = () => {
        API_FoodShowAll().
        then((res) => setFoods(res.data))
        .catch((err) => console.log(err));

        API_CateShowAll()
        .then((res) => setCategories(res.data))
        .catch((err) => console.log(err));

        if(cateId){
            setFilterCategory(cateId)
        }

    };

    useEffect(() => {
        loadAPI();
    },[])

    const cateClicked = (cate) =>{
        categories.filter(
            (category) =>{
                    if(cate === "Tất cả" || cate.catalog_name === category.catalog_name){
      
                        setFilterCategory(cate)
                    }
                }           
        );
    } 
    console.log(filterCategory)
    const filteredFoods = foods.filter(
        (food) =>
            ((filterCategory === "Tất cả" && food.is_active === true) || (food.catalog_id === filterCategory.catalog_id && food.is_active === true) || (food.catalog_id === +filterCategory&& food.is_active === true))
    );

    const handleOpenModal = (food) => {
        setSelectedFood(food);
        const randomItems = getRandomFoods(foods, food.catalog_id, 3);
        setRelatedFoods(randomItems);
    };

    const handleSelectRelatedFood = (food) => {
        handleOpenModal(food); 
    };

    const handleCloseModal = () => {
        setSelectedFood(null);
        setRelatedFoods([]);
    };
    

    return (
        <MainLayout>
            <div className="menu-page">
                <header className="menu-header">
                    <h2>Danh sách món ăn đang hoạt động</h2>
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Tìm món ăn..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button>🔍</button>
                    </div>
                </header>

                <div className="category-bar">
                    <button
                        className={filterCategory === "Tất cả" ? "active" : ""}
                        onClick={() => cateClicked("Tất cả")}>
                        Tất cả
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.catalog_id}
                            className={filterCategory != "Tất cả" ? (filterCategory.catalog_name === cat.catalog_name ? "active" : ""):""}
                            onClick={() => cateClicked(cat)}
                        >
                            {cat.catalog_name}
                        </button>
                    ))}

                    
                </div>

                <div className="food-list">
                    {filteredFoods.map((food) => (
                        <div className="food-card" key={food.food_id}>
                            <img src={food.food_img} alt={food.food_name} />
                            <div className="food-info">
                                <h3>{food.food_name}</h3>
                                <p className="food-description">{food.food_description}</p>
                                <div className="food-footer">
                                    <span className="price">{food.food_price.toLocaleString("vi-VN")}₫</span>
                                    
                                    {/* NÚT ĐẶT HÀNG GỌI HÀM MỞ MODAL */}
                                    <button 
                                        className="order-cta-btn" 
                                        onClick={() => handleOpenModal(food)} 
                                        title="Xem chi tiết và đặt hàng"
                                    >
                                        Đặt hàng
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredFoods.length === 0 && (
                        <p className="no-result">Không tìm thấy món ăn nào trong danh mục này.</p>
                    )}
                </div>
            </div>

            {selectedFood && (
                <FoodDetailModal 
                    food={selectedFood}
                    relatedFoods={relatedFoods}
                    onClose={handleCloseModal} 
                    onSelectRelatedFood={handleSelectRelatedFood} 
                />  
            )}
        </MainLayout>
    );
}