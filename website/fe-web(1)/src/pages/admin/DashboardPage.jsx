import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaSave } from "react-icons/fa";
import MainLayout from "../../layouts/MainLayout";
import "../../styles/dashboard.css";

// Hàm lấy thông tin người dùng từ localStorage
const getCurrentUser = () => {
  try {
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    console.error("Lỗi khi đọc currentUser từ localStorage", e);
    return null;
  }
};


export default function DashboardPage() {
  const currentUser = getCurrentUser();
  const username = currentUser?.username || "Admin"; // Fallback nếu currentUser không tồn tại
  const role = currentUser?.role || "admin";
  
  // 🛑 Thêm state để lưu trữ File object tạm thời (Không lưu Base64 vào state món ăn)
  const [imageFile, setImageFile] = useState(null); 

  const defaultFoods = [
    {
      id: 1,
      name: "Royal Cheese Burger",
      category: "Burgers",
      price: 69000,
      image: "/images/royal cheese burger.jpg",
      quantity: 5,
    },
    {
      id: 3,
      name: "Vanilla Ice Cream",
      category: "Desserts",
      price: 29000,
      image: "/images/vanilla ice cream.jpg",
      quantity: 0,
    },
    {
      id: 4,
      name: "Pepperoni Pizza",
      category: "Pizza",
      price: 119000,
      image: "/images/pepperoni pizza.jpg",
      quantity: 7,
    },
    {
      id: 5,
      name: "Fried Chicken Bucket",
      category: "Chicken",
      price: 159000,
      image: "/images/fried chicken bucket.jpg",
      quantity: 8,
    },
    {
      id: 6,
      name: "Spaghetti Bolognese",
      category: "Noodle",
      price: 89000,
      image: "/images/spaghetti bolognese.jpg",
      quantity: 6,
    },
    {
      id: 7,
      name: "Coca-Cola (Ly lớn)",
      category: "Drinks",
      price: 19000,
      image: "/images/ly coca lớn.jpg",
      quantity: 25,
    },
    {
      id: 8,
      name: "Chocolate Donut",
      category: "Desserts",
      price: 39000,
      image: "/images/chocolate donut.jpg",
      quantity: 12,
    },
    {
      id: 9,
      name: "Grilled Chicken Salad",
      category: "Sushi",
      price: 69000,
      image: "/images/grilled chicken salad.jpg",
      quantity: 9,
    },
    {
      id: 10,
      name: "Mango Smoothie",
      category: "Drinks",
      price: 49000,
      image: "/images/mango smoothie.jpg",
      quantity: 15,
    },
    {
      id: 11,
      name: "Double Beef Burger",
      category: "Burgers",
      price: 89000,
      image: "/images/double beef burger.jpg",
      quantity: 4,
    },
  ];

  const [foods, setFoods] = useState(() => {
    const stored = localStorage.getItem("foods");
    // LƯU Ý: Nếu stored chứa Base64 quá lớn, trang web vẫn có thể bị treo ở đây
    return stored ? JSON.parse(stored) : defaultFoods; 
  });

  const [newFood, setNewFood] = useState({
    id: "",
    name: "",
    category: "",
    price: "",
    quantity: "",
    image: "", // Đây chỉ nên chứa URL/Base64 TẠM THỜI cho preview
  });

  const [editFoodId, setEditFoodId] = useState(null);

  useEffect(() => {
    // 🛑 DỪNG LẠI: Việc lưu trữ dữ liệu ảnh Base64 vào localStorage sẽ gây lỗi.
    // Nếu bạn muốn lưu, chỉ lưu các thuộc tính khác (name, price, quantity) 
    // và giữ các URL ảnh là đường dẫn tĩnh (/images/...)
    // Tôi sẽ giữ lại code này, nhưng hãy nhớ đây là điểm yếu chính
    localStorage.setItem("foods", JSON.stringify(foods));
  }, [foods]);

  const handleChange = (e) => {
    setNewFood({ ...newFood, [e.target.name]: e.target.value });
  };

  // 🛠️ HÀM SỬA LỖI (Kiểm tra kích thước file và chỉ tạo preview Base64)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Giới hạn kích thước 2MB
      if (file.size > 2 * 1024 * 1024) { 
        alert("Kích thước file quá lớn (> 2MB). Vui lòng chọn ảnh nhỏ hơn.");
        e.target.value = null; 
        setNewFood({ ...newFood, image: "" });
        setImageFile(null);
        return;
      }

      // Lưu File object tạm thời (Dùng để tạo URL tạm thời trong handleAdd)
      setImageFile(file);

      // Tạo Base64 Data URL CHỈ cho mục đích xem trước (preview)
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewFood({ ...newFood, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = () => {
    if (!newFood.name || !newFood.category || !newFood.price || !newFood.quantity) {
      alert(" Vui lòng nhập đầy đủ thông tin món ăn!");
      return;
    }

    // 🛑 QUAN TRỌNG: Tạo URL tạm thời từ File Object để lưu vào state foods
    // Các URL này chỉ tồn tại trong phiên trình duyệt hiện tại.
    // Nếu bạn muốn lưu ảnh vĩnh viễn, bạn cần server backend để upload file.
    const imageURL = imageFile 
        ? URL.createObjectURL(imageFile) 
        : newFood.image || "/images/default-food.jpg"; 

    const newItem = {
      ...newFood,
      id: Date.now(),
      price: Number(newFood.price),
      quantity: Number(newFood.quantity),
      image: imageURL, // Dùng URL tạm thời/đường dẫn ảnh tĩnh
    };

    setFoods([...foods, newItem]);
    // Dọn dẹp state
    setImageFile(null); 
    setNewFood({ id: "", name: "", category: "", price: "", quantity: "", image: "" });
    alert(" Đã thêm món mới!");
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa món này?")) {
      setFoods(foods.filter((f) => f.id !== id));
    }
  };

  const handleEdit = (food) => {
    setEditFoodId(food.id);
    setNewFood(food);
    // Khi chỉnh sửa, không cần reset imageFile trừ khi người dùng chọn ảnh mới
    setImageFile(null); 
  };

  const handleUpdate = () => {
    
    // Nếu có file mới được chọn, tạo URL mới
    const updatedImageURL = imageFile 
        ? URL.createObjectURL(imageFile) 
        : newFood.image; // Giữ nguyên ảnh cũ

    setFoods(
      foods.map((f) =>
        f.id === editFoodId ? { 
          ...f, 
          ...newFood, 
          price: Number(newFood.price), 
          quantity: Number(newFood.quantity),
          image: updatedImageURL // Cập nhật URL ảnh mới
        } : f
      )
    );
    // Dọn dẹp state
    setImageFile(null); 
    setEditFoodId(null);
    setNewFood({ id: "", name: "", category: "", price: "", quantity: "", image: "" });
    alert(" Cập nhật món ăn thành công!");
  };

  return (
    <MainLayout>
      <div className="dashboard-container">
        <h1> Quản lý món ăn </h1>
        <p>Xin chào <strong>{username}</strong>! (Vai trò: {role})</p>

        {/* Form thêm / sửa món ăn */}
        <div className="food-form">
          <h3>{editFoodId ? " Sửa món ăn" : " Thêm món ăn mới"}</h3>

          <input
            type="text"
            name="name"
            placeholder="Tên món ăn"
            value={newFood.name}
            onChange={handleChange}
          />

          <select
            name="category"
            value={newFood.category}
            onChange={handleChange}
            className="category-select"
          >
            <option value="">-- Chọn danh mục --</option>
            <option value="Burgers">Burgers</option>
            <option value="Rice">Rice</option>
            <option value="Pizza">Pizza</option>
            <option value="Chicken">Chicken</option>
            <option value="Noodle">Noodle</option>
            <option value="Drinks">Drinks</option>
            <option value="Desserts">Desserts</option>
            <option value="Sushi">Sushi</option>
          </select>        

          <input
            type="number"
            name="price"
            placeholder="Giá (VNĐ)"
            value={newFood.price}
            onChange={handleChange}
          />

          <input
            type="number"
            name="quantity"
            placeholder="Tồn kho"
            value={newFood.quantity}
            onChange={handleChange}
          />

          <input type="file" accept="image/*" onChange={handleImageChange} />
          {newFood.image && <img src={newFood.image} alt="Preview" className="preview-img" />}

          {editFoodId ? (
            <button className="update-btn" onClick={handleUpdate}>
              <FaSave /> Lưu thay đổi
            </button>
          ) : (
            <button className="add-food-btn" onClick={handleAdd}>
              <FaPlus /> Thêm món
            </button>
          )}
        </div>

        <table className="food-table">
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Tên món</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th>Tồn kho</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {foods.map((food) => (
              <tr key={food.id}>
                <td>
                  {food.image ? (
                    <img src={food.image} alt={food.name} className="food-img" />
                  ) : (
                    <span className="no-img">Không có ảnh</span>
                  )}
                </td>
                <td>{food.name}</td>
                <td>{food.category}</td>
                <td>{food.price.toLocaleString("vi-VN")} ₫</td>
                <td>{food.quantity}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(food)}>
                    <FaEdit /> Sửa
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(food.id)}>
                    <FaTrash /> Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}