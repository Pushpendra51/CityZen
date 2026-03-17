import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Component to handle map clicks for location picking
function LocationPicker({ onLocationSelect, position }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });

  return position ? <Marker position={position} /> : null;
}

// Component to auto-center map when position changes
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

const MapComponent = ({ 
  complaints = [], 
  onLocationSelect = null, 
  selectedPosition = null,
  height = "400px",
  center = [29.9640, 77.5460], // Default center Saharanpur, India
  zoom = 13
}) => {
  return (
    <div style={{ height, width: "100%", borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: "100%", width: "100%" }}
      >
        {/* Layer Groups for Map Styles */}
        <TileLayer
          attribution='&copy; ESRI World Imagery'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
          attribution='&copy; CARTO'
        />
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          opacity={0.15} // Reduced opacity for subtle roads, labels are now handled by CARTO
        />

        {/* Location Picker Mode */}
        {onLocationSelect && (
          <LocationPicker onLocationSelect={onLocationSelect} position={selectedPosition} />
        )}

        {/* View Mode: Show existing complaints */}
        {!onLocationSelect && complaints.map((complaint) => (
          complaint.latitude && complaint.longitude && (
            <Marker key={complaint._id} position={[complaint.latitude, complaint.longitude]}>
              <Popup>
                <div style={{ fontFamily: "inherit" }}>
                  <strong style={{ display: "block", marginBottom: "4px" }}>{complaint.type}</strong>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#666" }}>{complaint.description}</p>
                  <div style={{ marginTop: "8px", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ 
                      padding: "2px 6px", 
                      borderRadius: "4px", 
                      background: complaint.status === "Resolved" ? "#dcfce7" : "#fee2e2",
                      color: complaint.status === "Resolved" ? "#166534" : "#991b1b"
                    }}>
                      {complaint.status}
                    </span>
                    <span style={{ color: "#666", fontWeight: "600" }}>
                      🤝 {complaint.supporters?.length || 0} supporters
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        ))}

        <ChangeView center={selectedPosition || center} />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
