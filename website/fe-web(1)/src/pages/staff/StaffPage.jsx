import { useState, useEffect } from "react";
import { API_OrderPendingShowAll, API_OrderStaffAssgin, API_OrderCookingShowAll, API_OrderReady, API_OrderCanceled} from "../../app/api";
import MainLayout from "../../layouts/MainLayout";
import "../../styles/staff.css";

export default function StaffPage() {

  const [pendingOrders, setPendingOrders] = useState([]);
  const [cookingOrders, setCookingOrders] = useState([]);
  const [reload, setReload] = useState("");
  const loadAPI = () => {
    API_OrderPendingShowAll()
    .then((res) => setPendingOrders(res))
    .catch((err) => console.log(err));

    API_OrderCookingShowAll()
    .then((res) => setCookingOrders(res))
    .catch((err) => console.log(err));
  };

  useEffect(() => {
    loadAPI();
  },[reload]);

  const handleConfirm = (id) => {
    API_OrderStaffAssgin(id)
    .then((res) => {
      alert(res.message);
      window.location.reload();
    })
    .catch((err) => alert(err.response.data.detail));

    setReload("Reload");
  };

  const handleComplete = (id) => {
    API_OrderReady(id)
    .then((res) => {
      alert(res.message);
      window.location.reload();
    })
    .catch((err) =>  alert(err.response.data.detail));
    
  };

  const handleCancel = (id) => {
      API_OrderCanceled(id)
      .then((res) => {
        alert(res.message);
        window.location.reload();
      })
      .catch((err) => alert(err.response.data.detail))
  }

  return (
    <MainLayout>
    <div className="staff-container">
      <h1>Đơn hàng chờ duyệt</h1>

      {pendingOrders.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888" }}>
          Hiện chưa có đơn hàng nào.
        </p>
      ) : (
        <table className="order-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Món đặt</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {pendingOrders.map((order) => (
              <tr key={order.order_id}>
                <td>#{order.order_id}</td>
                <td>{order.user}</td>
                <td>
                  {order.order_items_read.map((i, idx) => (
                    <div key={idx}>
                      {i.food_name} × {i.quantity}
                    </div>
                  ))}
                </td>
                <td>
                  {(order.total*1).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </td>
                <td>
                  <span
                    className={`status ${
                      order.status === "Hoàn thành"
                        ? "done"
                        : order.status === "Đang chuẩn bị"
                        ? "preparing"
                        : "pending"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="action-buttons">
                  {order.status === "pending" && (
                    <div>
                      
                      <button
                        className="canceled-btn"
                        onClick={() => handleCancel(order.order_id)}
                      >
                        Báo hủy đơn
                      </button>

                      <button
                        className="confirm-btn"
                        onClick={() => handleConfirm(order.order_id)}
                      >
                        Xác nhận
                      </button>
                    </div>
                    
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>


    <div className="staff-container">
      <h1>Đơn hàng chờ bếp hoàn thành và kiểm đơn</h1>

      {cookingOrders.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888" }}>
          Hiện chưa có đơn hàng nào.
        </p>
      ) : (
        <table className="order-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Món đặt</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {cookingOrders.map((order) => (
              <tr key={order.order_id}>
                <td>#{order.order_id}</td>
                <td>{order.user}</td>
                <td>
                  {order.order_items_read.map((i, idx) => (
                    <div key={idx}>
                      {i.food_name} × {i.quantity}
                    </div>
                  ))}
                </td>
                <td>
                  {(order.total*1).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </td>
                <td>
                  <span
                    className={`status ${
                      order.status === "Hoàn thành"
                        ? "done"
                        : order.status === "Đang chuẩn bị"
                        ? "preparing"
                        : "pending"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="action-buttons">
                  {order.status === "cooking" && (
                    <button
                      className="complete-btn"
                      onClick={() => handleComplete(order.order_id)}
                    >
                      Bếp đã nấu xong
                    </button>
                  )}
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
