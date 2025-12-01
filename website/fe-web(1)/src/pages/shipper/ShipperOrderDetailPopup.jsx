// src/pages/shipper/ShipperOrderDetailPopup.jsx
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import { API_OrderFinish } from "../../app/api";
import L from "leaflet";
import "../../styles/shipper-popup.css";

const shipperIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [34, 34],
});

const customerIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3177/3177361.png",
  iconSize: [34, 34],
});

export default function ShipperOrderDetailPopup({ visible, onClose, order }) {
  if (!visible || !order) return null;

  const customerPos = {
    lat: order.order_lat,
    lon: order.order_long,
  };

  const [shipperPos, setShipperPos] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);

  useEffect(() => {
    if (!visible) return;
    const token = localStorage.getItem('currentUser');
    const ws = new WebSocket(`wss://fast-food-website.onrender.com/ws/orders/${order.order_id}/track/?token=${token}`);

    const geoWatch = navigator.geolocation.watchPosition(
      (pos) => {
        const newPos = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        };
        console.log(newPos)

        setShipmerPosSafely(newPos);
        ws.send(
          JSON.stringify({
            lat: newPos.lat,
            lng: newPos.lon,
          })
        );
      },
      (err) => console.error("GPS Error:", err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    function setShipmerPosSafely(newPos) {
      setShipperPos((prev) => {
        if (!prev) return newPos;
        if (prev.lat === newPos.lat && prev.lon === newPos.lon) return prev;
        return newPos;
      });
    }

    return () => {
      navigator.geolocation.clearWatch(geoWatch);
      ws.close();
    };
  }, [visible, order?.order_id]);

  const getRoute = async (start, end) => {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${end.lon},${end.lat}?overview=full&geometries=geojson`;

      const response = await fetch(url);
      const json = await response.json();

      if (json.routes && json.routes.length > 0) {
        const coords = json.routes[0].geometry.coordinates.map((p) => [
          p[1],
          p[0],
        ]);
        setRouteCoords(coords);
      }
    } catch (err) {
      console.error("OSRM error:", err);
    }
  };

  useEffect(() => {
    if (shipperPos && customerPos.lat && customerPos.lon) {
      getRoute(shipperPos, customerPos);
    }
  }, [shipperPos, customerPos.lat, customerPos.lon]);

  const formatCurrency = (v) =>
    (Number(v) || 0).toLocaleString("vi-VN") + " ₫";

  const statusTextMap = {
    pending: "Chờ duyệt",
    cooking: "Đang chuẩn bị",
    delivering: "Đang giao",
    finish: "Hoàn tất",
  };

  const handleCompleteOrder = (order) => {
    if (!window.confirm("Xác nhận đơn hàng đã giao thành công?")) return;
    API_OrderFinish(order.order_id)
    .then((res) =>{
      alert("Đã giao hàng thành công");
      onClose();
      window.location.reload();
    })
    .catch((err) => console.log(err))
  }

  return (
    <div className="shipper-modal-overlay">
      <div className="shipper-modal">

        <div className="shipper-modal-header">
          <div>
            <h3>Đơn hàng #{order.order_id}</h3>
            <p className="shipper-modal-sub">
              Ngày đặt:{" "}
              {order.order_date
                ? new Date(order.order_date).toLocaleString("vi-VN")
                : "---"}
            </p>
          </div>
          <div className="shipper-header-right">
            <span
              className={`shipper-status-pill status-${order.status || "pending"}`}
            >
              {statusTextMap[order.status] || order.status}
            </span>
            <button className="shipper-close-btn" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        <div className="shipper-modal-content">
          <div className="shipper-col shipper-col-info">
            <section className="shipper-card">
              <h4>Thông tin khách hàng</h4>
              <div className="shipper-info-grid">
                <div>
                  <span className="label">Khách hàng</span>
                  <p>{order.user_name || order.user || "N/A"}</p>
                </div>
                <div>
                  <span className="label">Số điện thoại</span>
                  <p>{order.order_phone}</p>
                </div>
                <div className="full-row">
                  <span className="label">Địa chỉ</span>
                  <p>{order.order_address}</p>
                </div>
                <div>
                  <span className="label">Tổng tiền</span>
                  <p className="price">{formatCurrency(order.total)}</p>
                </div>
                <div>
                  <span className="label">Trạng thái thanh toán</span>
                  <p className="price">{order.payment_status == 'pending'? 'Chưa thanh toán': 'Đã thanh toán'}</p>
                </div>
                {order.voucher_code && (
                  <div>
                    <span className="label">Mã giảm giá</span>
                    <p>{order.voucher_code}</p>
                  </div>
                )}
              </div>
            </section>

            <section className="shipper-card shipper-items-card">
              <h4>Món đã đặt</h4>
              <div className="shipper-items-list">
                {(order.order_items_read || []).map((item) => (
                  <div
                    key={item.orderItem_id}
                    className="shipper-item-row"
                  >
                    <div className="shipper-item-main">
                      <img
                        src={
                          item.food_img
                            ? `https://fast-food-website.onrender.com/media/${item.food_img}`
                            : "https://via.placeholder.com/48"
                        }
                        alt={item.food_name}
                      />
                      <div>
                        <p className="item-name">{item.food_name}</p>
                        <p className="item-sub">
                          x{item.quantity} · {formatCurrency(item.food_price)}
                        </p>
                      </div>
                    </div>
                    <div className="shipper-item-total">
                      {formatCurrency(item.food_price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="shipper-col shipper-col-map">
            <section className="shipper-card">
              <h4>Lộ trình giao hàng</h4>
              <p className="shipper-map-note">
                Vị trí của bạn sẽ được cập nhật liên tục và gửi cho khách hàng.
              </p>
              <div className="shipper-map-wrapper">
                {shipperPos ? (
                  <MapContainer
                    center={[shipperPos.lat, shipperPos.lon]}
                    zoom={15}
                    style={{ width: "100%", height: "100%" }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    <Marker
                      position={[shipperPos.lat, shipperPos.lon]}
                      icon={shipperIcon}
                    >
                      <Popup>Bạn (Shipper)</Popup>
                    </Marker>

                    <Marker
                      position={[customerPos.lat, customerPos.lon]}
                      icon={customerIcon}
                    >
                      <Popup>Khách hàng</Popup>
                    </Marker>

                    {routeCoords.length > 0 && (
                      <Polyline
                        positions={routeCoords}
                        color="blue"
                        weight={5}
                      />
                    )}
                  </MapContainer>
                ) : (
                  <div className="shipper-map-placeholder">
                    <p>Đang lấy vị trí GPS của bạn...</p>
                    <p style={{ fontSize: "0.85rem", color: "#777" }}>
                      Hãy bật quyền truy cập vị trí cho trình duyệt.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        <div className="shipper-footer">
          <button
            className="shipper-complete-btn"
            onClick={() =>handleCompleteOrder(order)}
            disabled={order.status !== "delivering"}
          >
            Xác nhận giao hàng thành công
          </button>
        </div>
      </div>
    </div>
  );
}
