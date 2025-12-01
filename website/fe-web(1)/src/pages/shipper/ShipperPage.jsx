import { useState, useEffect } from "react";
import { API_DeliveringShowAll, API_DeliveringOnline, API_DeliveringOffline } from "../../app/api";
import "../../styles/shipper.css";
import MainLayout from "../../layouts/MainLayout";
import ShipperOrderDetailPopup from "./ShipperOrderDetailPopup";
export default function ShipperPage() {
  console.log('come here');
  const [orders, setOrders] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState("offline");
  const loadAPI = () => {
    API_DeliveringShowAll()
    .then((res) => setOrders(res))
    .catch((err) => console.log(err));
  };

  useEffect(() => {
    loadAPI()
  }, []);

  const detailOrder = (id) => {
    const updated = orders.map((o) =>
      o.id === id ? { ...o, status: "Đang giao hàng" } : o
    );
    setOrders(updated);
  };

  const handleDelivered = (id) => {
    const updated = orders.map((o) =>
      o.id === id ? { ...o, status: "Đã giao hàng" } : o
    );
    setOrders(updated);
  };

  const onlineHandle = () => {
    API_DeliveringOnline()
    .then((res) => {
      alert(res.message);
      setOnlineStatus("online");
    })
    .catch((err) => console.log(err));
  }

  const offlineHandle = () => {
    API_DeliveringOffline()
    .then((res) => {
      alert(res.message);
      setOnlineStatus("offline");
    })
    .catch((err) => console.log(err));
  }

  //  Lọc các đơn mà shipper quan tâm
  const relevantOrders = orders.filter((o) =>
    ["finish", "delivering"].includes(o.status)
  );

  return (
    <MainLayout>
    <div className="shipper-container">
      <h1> Đơn hàng đang được gán </h1>
      <div className="flex w-full justify-end gap-4 items-center">
        <p>Trạng thái: {onlineStatus}</p>
        <button
          className= {onlineStatus === "online" ? 'hidden' :''}
          onClick={() => onlineHandle()}
        >Online ngay</button>

        <button
          className= {onlineStatus === "offline" ? 'hidden' :''}
          onClick={() => offlineHandle()}
        >Tạm ngừng nhận đơn
        </button>
      </div>
      {relevantOrders.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888" }}>
          Hiện chưa có đơn hàng nào cần giao.
        </p>
      ) : (
        <table className="shipper-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Địa chỉ giao</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {relevantOrders.map((order) => (
              <tr key={order.order_id}>
                <td>#{order.order_id}</td>
                <td>{order.user}</td>
                <td>{order.order_address || "Chưa có địa chỉ"}</td>
                <td>
                  {(order.total*1).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </td>
                <td>
                  <span
                    className={`status ${
                      order.status === "delivering"
                        ? "delivering"
                        : order.status === "finish"
                        ? "done"
                        : ""
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="action-buttons">
                    <button onClick={() => {setShowPopup(true); }}>
                        Xem chi tiết đơn hàng
                    </button>
                    <ShipperOrderDetailPopup
                        visible={showPopup}
                        onClose={() => setShowPopup(false)}
                        order={order}
                    />    
                    
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </MainLayout>
  );
}
