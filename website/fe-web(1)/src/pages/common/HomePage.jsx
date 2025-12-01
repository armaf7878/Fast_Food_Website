import { useState, useEffect, useRef } from "react"; 
import { Link } from "react-router-dom"; 
import { API_CateShowAll, API_FoodShowAll, API_VoucherShowAll } from "../../app/api";
import MainLayout from "../../layouts/MainLayout";
import FoodDetailModal from "./FoodDetailModal";
import "../../styles/home.css"; 

const calculateTimeLeft = (targetDate) => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
        timeLeft = {
            hours: Math.floor(difference / (1000 * 60 * 60)),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    } else {
        timeLeft = { hours: 0, minutes: 0, seconds: 0, expired: true };
    }
    return timeLeft;
};

const formatTime = (time) => String(time).padStart(2, '0');

export default function HomePage() {
  const [selectedArea, setSelectedArea] = useState("HCM");
  const [activeAboutTab, setActiveAboutTab] = useState("intro");
  

  const TWO_HOURS_IN_MS = 2 * 60 * 60 * 1000;
  const [targetTime] = useState(new Date(Date.now() + TWO_HOURS_IN_MS));
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetTime));
  const [countdownExpired, setCountdownExpired] = useState(false);


    const [showPartnerForm, setShowPartnerForm] = useState(false);
    const [partnerEmail, setPartnerEmail] = useState('');
    const [partnerFormSubmitted, setPartnerFormSubmitted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(targetTime);
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.expired && !countdownExpired) {
        setCountdownExpired(true);
        clearInterval(timer); // Dừng bộ đếm khi hết giờ
      }
    }, 1000);


    return () => clearInterval(timer);
  }, [targetTime, countdownExpired]); 

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const aboutTab = urlParams.get("about");
    if (aboutTab && ["intro", "service", "partner", "contact"].includes(aboutTab)) {
      setActiveAboutTab(aboutTab);
      setTimeout(() => {
        const aboutSection = document.getElementById("about");
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }

    const handleTabChange = (event) => {
      setActiveAboutTab(event.detail);
    };
    window.addEventListener("changeAboutTab", handleTabChange);

    return () => {
      window.removeEventListener("changeAboutTab", handleTabChange);
    };
  }, []);
    const handlePartnerRegisterClick = () => {
        setShowPartnerForm(true);
        setPartnerFormSubmitted(false); 
    };

    const handlePartnerSubmit = (e) => {
        e.preventDefault();
        
        if (!partnerEmail) {
            alert("Vui lòng điền Email để đăng ký hợp tác.");
            return;
        }

        console.log("Đăng ký đối tác với email:", partnerEmail);


        setPartnerFormSubmitted(true); // Hiển thị thông báo thành công
        setPartnerEmail(''); // Reset ô input
        setShowPartnerForm(false); // Ẩn form

        
        setTimeout(() => {
            setPartnerFormSubmitted(false);
        }, 5000);
    };



  const flashDeals = [
    {
      name: "Combo Burger Phô Mai",
      img: "/images/double%20beef%20burger.jpg",
      price: "99.000đ",
      oldPrice: "129.000đ",
    },
    {
      name: "Fried Chicken Bucket",
      img: "/images/fried%20chicken%20bucket.jpg",
      price: "149.000đ",
      oldPrice: "199.000đ",
    },
    {
      name: "Mango Smoothie",
      img: "/images/mango%20smoothie.jpg",
      price: "35.000đ",
      oldPrice: "49.000đ",
    },
  ];

    const [categories, setCategories] = useState([]);
    const [foods, setFoods] = useState([]);
    const [vouchers, setVouchers] = useState([]);
    const [foodsRandom, setFoodsRandom] = useState([]);
    const [selectedFood, setSelectedFood] = useState(null);
    const [relatedFoods, setRelatedFoods] = useState([]);
    const [discountFoods, setDiscountFoods] = useState([]);
    const getRandomFoods = (allFoods) => {
        const count = 6;
        const availableFoods = allFoods;
        if (availableFoods.length <= 6) return availableFoods;
        const shuffled = availableFoods.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    const getRandomRelatedFoods = (allFoods, excludeId, count = 3) => {
        const availableFoods = allFoods.filter(food => food.catalog_id === excludeId);
        if (availableFoods.length <= count) return availableFoods;
        const shuffled = availableFoods.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    const handleSelectRelatedFood = (food) => {
        handleOpenModal(food); 
    };

    const handleOpenModal = (food) => {
        setSelectedFood(food);
        const randomItems = getRandomRelatedFoods(foods, food.catalog_id, 3);
        setRelatedFoods(randomItems);
    };

    const handleCloseModal = () => {
        setSelectedFood(null);
        setRelatedFoods([]);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: 'VND'
        }).format(value)
    }

    const formatPercent = (value) => {
        return new Intl.NumberFormat("vi-VN", {
            style:'percent',
            maximumFractionDigits: 2
        }).format(value);
    }

    const loadAPI = () => {
        API_CateShowAll()
        .then((res) => setCategories(res.data))
        .catch((err) => console.log(err));

        API_FoodShowAll()
        .then((res) =>{
            setFoods(res.data);
            setDiscountFoods((res.data.slice(0,3)));
        })
        .catch((err) => console.log(err));

        API_VoucherShowAll()
        .then((res) => setVouchers(res))
        .catch((err) => console.log(err));
    };

    useEffect(() => {
        loadAPI();
    }, [])
    
  const renderAboutContent = () => {
    switch (activeAboutTab) {
      case "intro":
        return (
          <div className="tab-content-inner">
            <h3> Giới thiệu về FastFood Delivery Club</h3>
            <p>FastFood Delivery Club là nền tảng giao đồ ăn nhanh hàng đầu, cam kết mang đến những bữa ăn nóng hổi, tươi ngon chỉ trong vòng 30 phút. Chúng tôi hợp tác với hàng trăm nhà hàng đối tác để cung cấp đa dạng các lựa chọn từ burger, pizza, gà rán đến đồ uống và món tráng miệng.</p>
            <p>Sứ mệnh của chúng tôi là làm cho việc đặt món trở nên dễ dàng, nhanh chóng và tiết kiệm hơn cho mọi người.</p>
          </div>
        );
      case "service":
        return (
          <div className="tab-content-inner">
            <h3> Dịch vụ của chúng tôi</h3>
            <ul>
              <li>**Giao hàng siêu tốc:** Đảm bảo thời gian giao hàng (ETA) chính xác và nhanh nhất.</li>
              <li>**Flash Deals độc quyền:** Cập nhật liên tục các ưu đãi theo giờ.</li>
              <li>**Theo dõi đơn hàng thời gian thực:** Biết chính xác vị trí tài xế.</li>
              <li>**Hệ thống thanh toán đa dạng:** Hỗ trợ tiền mặt, thẻ, ví điện tử.</li>
            </ul>
          </div>
        );
      case "partner":
        return (
          <div className="tab-content-inner">
            <h3> Hợp tác cùng Nhà hàng</h3>
            <p>Bạn là chủ nhà hàng và muốn mở rộng kênh bán hàng? Hãy tham gia mạng lưới đối tác của FastFood. Chúng tôi cung cấp công nghệ quản lý đơn hàng hiệu quả và tiếp cận hàng ngàn khách hàng tiềm năng.</p>
            
            {/* 1. HIỂN THỊ THÔNG BÁO THÀNH CÔNG */}
            {partnerFormSubmitted && (
                <div className="ff-success-message">
                     Đăng ký thành công! Chúng tôi đã nhận được thông tin hợp tác của bạn và sẽ liên hệ lại trong vòng 24h.
                </div>
            )}

            {/* 2. HIỂN THỊ FORM HOẶC NÚT ĐĂNG KÝ */}
            {showPartnerForm ? (
                // FORM ĐĂNG KÝ
                <form onSubmit={handlePartnerSubmit} className="ff-partner-form">
                    <div className="form-group">
                        <label htmlFor="partner-email">Email Liên Hệ (*)</label>
                        <input 
                            id="partner-email"
                            type="email"
                            placeholder="vd: nhahang@example.com"
                            value={partnerEmail}
                            onChange={(e) => setPartnerEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary">Gửi Đăng Ký</button>
                    {/* Nút hủy để quay lại trạng thái ban đầu */}
                    <button type="button" onClick={() => setShowPartnerForm(false)} className="btn-secondary ml-2">Hủy</button>
                </form>

            ) : (
                // NÚT BAN ĐẦU
                <button onClick={handlePartnerRegisterClick} className="btn-secondary">
                    Đăng ký Đối tác ngay
                </button>
            )}
          </div>
        );
      case "contact":
        return (
          <div className="tab-content-inner">
            <h3> Liên hệ với chúng tôi</h3>
            <p>Mọi thắc mắc, phản hồi hoặc yêu cầu hỗ trợ, vui lòng liên hệ:</p>
            <p>
              **Hotline:** 1900 6868 (Hoạt động 24/7)
              <br/>
              **Email Hỗ trợ:** support@fastfoodclub.vn
              <br/>
              **Văn phòng chính:** 123 Nguyễn Huệ, Quận 1, TP.HCM
            </p>
           </div>
        );
      default:
        return null;
    }
  };


  return (
    <MainLayout>
      <div className="ff-home">
        {/* Hero */}
        <section className="ff-hero shopee-style">
          <div className="ff-hero-main">
            <span className="ff-hero-pill">Mega Food Sale 12.12</span>
            <h1>
              Siêu ưu đãi <span className="accent">FastFood Fest</span>
            </h1>
            <p>
              Bộ sưu tập deal giao ngay theo phong cách Shopee Food: Flash sale mỗi 2h, Freeship toàn
              thành phố và combo gia đình tiết kiệm đến 60%.
            </p>
            
            <div className={`ff-hero-countdown ${countdownExpired ? 'expired' : ''}`}>
                {countdownExpired ? (
                    <span className="expired-text">Đã hết giờ!</span>
                ) : (
                    <>
                        <span>{formatTime(timeLeft.hours)}</span>:
                        <span>{formatTime(timeLeft.minutes)}</span>:
                        <span>{formatTime(timeLeft.seconds)}</span>
                        <label>Giờ • Phút • Giây</label>
                    </>
                )}
            </div>

            <div className="ff-hero-flash-list">
              {discountFoods.map((item) => (
                <Link to="/promotions" key={item.food_id} className="ff-flash-card-link">
                    <div className="ff-flash-card">
                      <img src={item.food_img} alt={item.food_name} />
                      <div className="ff-flash-info">
                        <p>{item.food_name}</p>
                        <div className="ff-price">
                          <strong>{formatCurrency(item.food_price)}</strong>
                          <span>{formatCurrency(item.food_price + (item.food_price* 10/100))}</span>
                        </div>
                        <div className="ff-progress">
                          <div className="bar" />
                          <small>Đã bán 75%</small>
                        </div>
                      </div>
                    </div>
                </Link>
              ))}
            </div>
               
          </div>

          <div className="ff-hero-side">
            {vouchers.map((voucher) => (
              <Link to="/promotions" key={voucher.voucher_id} className="ff-voucher-card-link">
                <div className="ff-voucher-card">
                  <div className="ff-voucher-icon">
                    {voucher.discount_type === "percent"
                                                ?
                                                    "🔖"
                                                :
                                                    "💲"
                    }
                  </div>
                  <div>
                    <p className="voucher-title">{voucher.voucher_name}</p>
                    <p className="voucher-desc">Số lượng còn lại: {voucher.max_uses - voucher.used_count}</p>
                    <span className="font-bold">
                        {voucher.discount_type === "percent"
                            ?
                                <p>{formatPercent(voucher.discount_value/100)}</p>
                            :
                                <p>{formatCurrency(voucher.discount_value)}</p>
                        }
                    </span>
                  </div>
                  <button><Link to='/menu'>Đặt món</Link></button>
                </div>
              </Link>
            ))}
          </div>
        </section>
        
       

        
        <section className="ff-section">
          <h2>Danh mục phổ biến</h2>
          <div className="ff-categories">
            {categories.map(cat => (
              <Link 
                key={cat.catalog_id} 
                to={`/menu/${encodeURIComponent(cat.catalog_id)}`} 
                className="ff-category-link"
              >
                <div className="ff-category">
                  <img src={cat.catalog_img} alt={cat.catalog_name} />
                  <span>{cat.catalog_name}</span>
                </div>
              </Link>
            ))}
            </div>
        </section>

        <section className="ff-section">
            <h2>Món ăn phổ biến</h2>
            <div className="food-list">
                {foods.map((food) => (
                    <div className="food-card" key={food.food_id}>
                        <img src={food.food_img} alt={food.food_name} />
                        <div className="food-info">
                            <h3>{food.food_name}</h3>
                            <p className="food-description">{food.food_description}</p>
                            <div className="food-footer">
                                <span className="price">{(food.food_price*1).toLocaleString("vi-VN")}₫</span>
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
                    {foods.length === 0 && (
                        <p className="no-result">Hiện nhà hàng chưa có món ăn nào.</p>
                    )}
            </div>
            {selectedFood && (
                <FoodDetailModal 
                    food={selectedFood}
                    relatedFoods={relatedFoods}
                    onClose={handleCloseModal} 
                    onSelectRelatedFood={handleSelectRelatedFood} 
                />
            )}
        </section>

        <section className="ff-order-banner">
          <div className="ff-order-left">
            <img src="../../../images/logo1.png" alt="Ứng dụng FastFood" /> 
          </div>
          <div className="ff-order-right">
            <h1>
              Đặt món với <span className="highlight">FastFood</span> <br />
              trở nên <span className="personalised">Cá nhân hóa</span> và Nhanh chóng hơn
            </h1>
            <p>Tải ngay ứng dụng FastFood để đặt món tiện lợi mọi lúc, mọi nơi.</p>
            <div className="ff-app-buttons">
              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="App Store"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Google Play"
              />
            </div>
            </div>
        </section>

        <section className="ff-partner-rider">
          <div className="ff-card partner">
            <div className="ff-card-img">
              <img src="../../../images/hoptac2.avif" alt="Đăng ký làm Nhân viên" /> 
            </div>
            <div className="ff-card-content">
              <span className="ff-badge">Tuyển dụng Nhân viên</span>
              <h3>Đăng ký làm Nhân viên</h3>
              <p>Làm việc tại văn phòng/kho hàng, hưởng lương cố định và phúc lợi hấp dẫn.</p>
              <a href="https://forms.gle/3k1n3Twsi5fkNyPG6" className="btn-primary">Đăng ký ngay</a>
            </div>
          </div>

          <div className="ff-card rider">
            <div className="ff-card-img">
              <img src="../../../images/ship.png" alt="Tài xế giao hàng" /> 
              </div>
            <div className="ff-card-content">
              <span className="ff-badge">Đăng ký làm tài xế</span>
              <h3>Giao hàng cùng chúng tôi</h3>
              <p>Nhận nhiều ưu đãi, thu nhập linh hoạt và cơ hội làm chủ thời gian.</p>
              <a href="https://forms.gle/bE1ptzu5N1prB2738" className="btn-primary">Bắt đầu ngay</a>
            </div>
          </div>
        </section>

        <section className="ff-stats">
          <div className="ff-stat">
            <h3>546+</h3>
            <p>Tài xế đăng ký</p>
          </div>
          <div className="ff-stat">
            <h3>789,900+</h3>
            <p>Đơn hàng đã giao</p>
          </div>
          <div className="ff-stat">
            <h3>690+</h3>
            <p>Nhà hàng đối tác</p>
          </div>
          <div className="ff-stat">
            <h3>17,457+</h3>
            <p>Món ăn được phục vụ</p>
          </div>
        </section>

        <section id="about" className="ff-section about-section">
            <h2>FastFood Delivery Club</h2>
            <div className="about-tabs">
                <div className="tab-nav">
                    <button 
                        onClick={() => setActiveAboutTab("intro")}
                        className={activeAboutTab === "intro" ? "active" : ""}
                    >
                        Giới thiệu
                    </button>
                    <button 
                        onClick={() => setActiveAboutTab("service")}
                        className={activeAboutTab === "service" ? "active" : ""}
                    >
                        Dịch vụ
                    </button>
                    <button 
                        onClick={() => setActiveAboutTab("partner")}
                        className={activeAboutTab === "partner" ? "active" : ""}
                    >
                        Hợp tác
                    </button>
                    <button 
                        onClick={() => setActiveAboutTab("contact")}
                        className={activeAboutTab === "contact" ? "active" : ""}
                    >
                        Liên hệ
                    </button>
                </div>

                <div className="tab-content">
                    {renderAboutContent()}
                </div>
            </div>
        </section>
        
      </div>
    </MainLayout>
  );
}