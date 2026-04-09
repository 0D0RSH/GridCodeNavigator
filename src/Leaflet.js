// Initialize the map (assuming you already set up Leaflet)
var map = L.map('map').setView([0, 0], 15);

// Add a beacon marker for "Me" (Your position)
var meBeacon = L.marker([0, 0], {
    icon: L.icon({
        iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Map_marker.svg', // Change to a custom arrow icon if needed
        iconSize: [30, 30]
    })
}).addTo(map);

// Function to update "Me" marker position
function updateMyPosition(lat, lon) {
    meBeacon.setLatLng([lat, lon]);
    map.setView([lat, lon], 15); // Keep map centered on your position
}

// Example: Simulating movement (replace this with real sensor data)
setTimeout(() => {
    updateMyPosition(12.9716, 77.5946); // Example: Bangalore coords
}, 3000);