if (
    listing.geometry &&
    listing.geometry.coordinates &&
    listing.geometry.coordinates.length === 2
) {
    const latitude = listing.geometry.coordinates[1];
    const longitude = listing.geometry.coordinates[0];

    // Create the map
    const map = L.map("map").setView([latitude, longitude], 15);

    // Add Geoapify tile layer
    const light = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
        subdomains: "abcd",
        maxZoom: 20,
        attribution: "&copy; OpenStreetMap contributors &copy; CARTO"
    }
);

const dark = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    {
        subdomains: "abcd",
        maxZoom: 20,
        attribution: "&copy; OpenStreetMap contributors &copy; CARTO"
    }
);

const satellite = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
        maxZoom: 20,
        attribution: "&copy; Esri"
    }
);
// Default map style
light.addTo(map);

// Layer switcher
const baseMaps = {
    "🌞 Light": light,
    "🌙 Dark": dark,
    "🛰️ Satellite": satellite
};

L.control.layers(baseMaps).addTo(map);

    // Add marker
    const marker = L.marker([latitude, longitude]).addTo(map);

    // Custom popup
    marker.bindPopup(`
        <div style="min-width:190px; text-align:center;">
            <strong style="font-size:16px;">${listing.title}</strong>
            <hr style="margin:8px 0;">
            <span style="font-size:14px;">
                📍 Exact location will be provided after booking.
            </span>
        </div>
    `).openPopup();

} else {

    document.getElementById("map").innerHTML = `
        <div style="
            height:100%;
            display:flex;
            justify-content:center;
            align-items:center;
            font-size:18px;
            color:#666;
            background:#f8f9fa;
            border-radius:10px;
        ">
            📍 Location not available for this listing.
        </div>
    `;

}