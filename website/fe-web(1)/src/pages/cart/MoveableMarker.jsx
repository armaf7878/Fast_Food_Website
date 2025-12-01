import { Marker } from "react-leaflet";
import L from "leaflet";

const shipperIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [38, 38],
});

const customerIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/3177/3177361.png",
    iconSize: [38, 38],
});

export default function MoveableMarker({ position, iconType }) {

    const icon = iconType === "shipper" ? shipperIcon : customerIcon;

    return (
        <Marker position={[position.lat, position.lon]} icon={icon} />
    );
}
