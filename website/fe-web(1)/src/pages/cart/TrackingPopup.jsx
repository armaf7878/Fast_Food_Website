import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import MoveableMarker from "./MoveableMarker";
import "../../styles/tracking-popup.css";


export default function TrackingPopup({ visible, onClose, shipperPos, order }) {

    if (!visible) return null;

    const [currentShipper, setCurrentShipper] = useState({
        ...shipperPos,
        timestamp: Date.now()
    });

    const [routeCoords, setRouteCoords] = useState([]);
    const customerPos = { lat: order.order_lat, lon: order.order_long };


    // -----------------------------------------------------
    // 🛰 WebSocket lắng nghe vị trí shipper realtime
    // -----------------------------------------------------
    useEffect(() => {
        if (!visible) return;

        const token = localStorage.getItem("currentUser");
        const socket = new WebSocket(
            `ws://127.0.0.1:8000/ws/orders/${order.order_id}/track/?token=${token}`
        );

        socket.onmessage = (e) => {
            try {
                const data = JSON.parse(e.data);
                if (data.lat && data.lng) {
                    setCurrentShipper({
                        lat: data.lat,
                        lon: data.lng,
                        timestamp: Date.now() // ép re-render
                    });
                }
            } catch (err) {
                console.error("WS error:", err);
            }
        };

        return () => socket.close();
    }, [visible, order.order_id]);


    // -----------------------------------------------------
    // 🛣 Hàm gọi OSRM để vẽ route shipper → khách
    // -----------------------------------------------------
    const getRouteFromOSRM = async (start, end) => {
        try {
            const url = `https://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${end.lon},${end.lat}?overview=full&geometries=geojson`;

            const res = await fetch(url);
            const json = await res.json();

            if (!json.routes || json.routes.length === 0) return;

            const coords = json.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
            setRouteCoords(coords);
        } catch (err) {
            console.error("OSRM ERROR:", err);
        }
    };


    // -----------------------------------------------------
    // 🔄 Update route mỗi khi shipper di chuyển
    // -----------------------------------------------------
    useEffect(() => {
        getRouteFromOSRM(currentShipper, customerPos);
    }, [currentShipper]);


    // -----------------------------------------------------
    // RENDER
    // -----------------------------------------------------
    return (
        <div className="tracking-overlay">
            <div className="tracking-card">

                <div className="tracking-header">
                    <h3>Vị trí giao hàng</h3>
                    <button className="close-btn" onClick={onClose}>✖</button>
                </div>

                <MapContainer
                    center={[customerPos.lat, customerPos.lon]}
                    zoom={15}
                    style={{ width: "100%", height: "100%" }}
                >

                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    {/* Marker shipper */}
                    <MoveableMarker
                        key={currentShipper.timestamp}
                        position={currentShipper}
                        iconType="shipper"
                    />

                    {/* Marker khách */}
                    <MoveableMarker
                        position={customerPos}
                        iconType="customer"
                    />

                    {/* Route OSRM */}
                    {routeCoords.length > 0 && (
                        <Polyline 
                            positions={routeCoords} 
                            color="blue" 
                            weight={5} 
                        />
                    )}
                </MapContainer>
            </div>
        </div>
    );
}
