import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_CartShowAll, API_FoodShowAll, API_CartItemRemove, API_CartItemUpdate} from "../../app/api";
import "../../styles/cart.css";
import MainLayout from "../../layouts/MainLayout";

export default function CartPage() {

    const [cart, setCart] = useState([]);
    const [foods, setFoods] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const filterFood = [];
    let totalPrice = 0;
    const loadAPI = () => {
        API_CartShowAll()
        .then((res) => setCart(res))
        .catch((err) => console.log(err));

        API_FoodShowAll()
        .then((res) => setFoods(res.data))
        .catch((err) => console.log(err));
    };


    useEffect(() => {
        loadAPI();
    }, []);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("selectedItems") || "[]");
        setSelectedItems(stored);
    }, []);

    const toggleSelect = (item, food) => {
        const key = item.cartItem_id; 

        let updated = [...selectedItems];

        const exists = updated.find(i => i.cartItem_id === key);

        if (exists) {
            updated = updated.filter(i => i.cartItem_id !== key);
        } else {
            updated.push({
                ...item,
                food: {
                    food_id: food.food_id,
                    food_name: food.food_name,
                    food_price: food.food_price,
                    food_img: food.food_img
                }
            });
        }

        setSelectedItems(updated);
        localStorage.setItem("selectedItems", JSON.stringify(updated));
    };




    const increaseQty = (id, quantity) => {

        API_CartItemUpdate(id, quantity)
        .then((res) => console.log(res))
        .catch((err) => console.log(err))
        setCart(
            cart.map((item) =>
                item.cartItem_id === id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    // Hàm giảm số lượng món
    const decreaseQty = (id, quantity) => {
        API_CartItemUpdate(id, quantity)
        .then((res) => console.log(res))
        .catch((err) => console.log(err))
        setCart(
            cart.map((item) =>
                item.cartItem_id === id && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    };

    // Xóa món khỏi giỏ
    const removeItem = (id, quantity) => {
        if (window.confirm("Bạn có chắc muốn xóa món này khỏi giỏ hàng?")) {
            API_CartItemRemove(id)
            .then((res) => alert(res.message))
            .catch((err) => console.log(err));
            window.location.reload()
        }
    };

    console.log(cart)

    return (
        <MainLayout>
            <div className="cart-container">
                <h1> Giỏ hàng của bạn</h1>
                {cart.message === "Giỏ hàng đang trống" ? (
                    <div className="empty-cart">
                        <p>Giỏ hàng đang trống.</p>
                        <Link to="/menu" className="go-menu">
                            ← Tiếp tục chọn món
                        </Link>
                    </div>
                ) : (
                    <>
                        <table className="cart-table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Món ăn</th>
                                    <th>Giá</th>
                                    <th>Số lượng</th>
                                    <th>Tổng</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item) => {
                                    const food = foods.find(f => f.food_id == item.food);
                                    if (!food) return null;
                                    totalPrice += food.food_price * item.quantity;
                                    const isChecked = selectedItems.some(i => i.cartItem_id === item.cartItem_id);

                                    return (
                                        <tr key={item.cartItem_id}>
                                            <td>
                                                <input 
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() => toggleSelect(item, food)}
                                                />
                                            </td>
                                            <td className="food-info">
                                                <img src={food.food_img} alt={food.food_name} />
                                                <span>{food.food_name}</span>
                                            </td>

                                            <td>
                                                {(food.food_price*1).toLocaleString("vi-VN", {
                                                    style: "currency",
                                                    currency: "VND",
                                                })}
                                            </td>

                                            <td>
                                                <div className="quantity-controls">
                                                    <button onClick={() => decreaseQty(item.cartItem_id, item.quantity-1)}>-</button>
                                                    <span>{item.quantity}</span>
                                                    <button onClick={() => increaseQty(item.cartItem_id, item.quantity+1)}>+</button>
                                                </div>
                                            </td>

                                            <td>
                                                {(food.food_price * item.quantity).toLocaleString("vi-VN", {
                                                    style: "currency",
                                                    currency: "VND",
                                                })}
                                            </td>

                                            <td>
                                                <button
                                                    className="remove-btn text-black"
                                                    onClick={() => removeItem(item.cartItem_id)}
                                                >
                                                    HỦY
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <div className="cart-actions">
                            <Link to="/menu" className="go-menu">
                                ← Tiếp tục chọn món
                            </Link>
                        </div>
                        {/* Tóm tắt đơn hàng */}
                        <div className="cart-summary">
                            <h3>
                                Tổng cộng: <span>{`${totalPrice.toLocaleString("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                })}`}</span>
                            </h3>
                            <Link to="/checkout" className="checkout-btn">
                                Thanh toán
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </MainLayout>
    );
}