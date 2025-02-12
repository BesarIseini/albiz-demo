// script.js

// Initialize the map
const map = L.map('map').setView([41.6086, 21.7453], 7); // Centered on North Macedonia

// Add a base tile layer (e.g., OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Define regions and subregions (for demo purposes, these are approximate)
const regions = {
  "Skopje": {
    latlng: [41.9965, 21.4314],
    subregions: {
      "Centar": [
        [41.9965, 21.4314],
        [41.9965, 21.4414],
        [41.9865, 21.4414],
        [41.9865, 21.4314]
      ],
      "Karpos": [
        [41.9965, 21.4214],
        [41.9965, 21.4314],
        [41.9865, 21.4314],
        [41.9865, 21.4214]
      ],
      "Aerodrom": [
        [41.9965, 21.4114],
        [41.9965, 21.4214],
        [41.9865, 21.4214],
        [41.9865, 21.4114]
      ]
    }
  },
  "Bitola": {
    latlng: [41.0314, 21.3347],
    subregions: {
      "Old Bazaar": [
        [41.0314, 21.3347],
        [41.0314, 21.3447],
        [41.0214, 21.3447],
        [41.0214, 21.3347]
      ],
      "Pelagonia": [
        [41.0314, 21.3247],
        [41.0314, 21.3347],
        [41.0214, 21.3347],
        [41.0214, 21.3247]
      ]
    }
  },
  "Ohrid": {
    latlng: [41.1231, 20.8016],
    subregions: {
      "Old Town": [
        [41.1231, 20.8016],
        [41.1231, 20.8116],
        [41.1131, 20.8116],
        [41.1131, 20.8016]
      ],
      "Lake Ohrid": [
        [41.1231, 20.7916],
        [41.1231, 20.8016],
        [41.1131, 20.8016],
        [41.1131, 20.7916]
      ]
    }
  }
};

// Add region polygons (simplified for demo)
Object.keys(regions).forEach(region => {
  const polygon = L.polygon([
    [regions[region].latlng[0] - 0.1, regions[region].latlng[1] - 0.1],
    [regions[region].latlng[0] - 0.1, regions[region].latlng[1] + 0.1],
    [regions[region].latlng[0] + 0.1, regions[region].latlng[1] + 0.1],
    [regions[region].latlng[0] + 0.1, regions[region].latlng[1] - 0.1]
  ], { color: 'blue' }).addTo(map);

  // Add click event to zoom into the region and show subregions
  polygon.on('click', () => {
    map.setView(regions[region].latlng, 10); // Zoom into the region
    showSubregions(region);
    document.getElementById('back-button').style.display = 'block'; // Show the back button
  });
});

// Function to display subregions as polygons
function showSubregions(region) {
  // Clear existing subregions
  map.eachLayer(layer => {
    if (layer instanceof L.Polygon && layer !== map) {
      map.removeLayer(layer);
    }
  });

  // Add subregions as polygons
  Object.keys(regions[region].subregions).forEach(subregion => {
    const subregionPolygon = L.polygon(regions[region].subregions[subregion], {
      color: 'green',
      fillOpacity: 0.5
    }).addTo(map);

    // Add click event to show information about the subregion
    subregionPolygon.bindPopup(`<b>${subregion}</b><br>Information about ${subregion}`).on('click', () => {
      subregionPolygon.openPopup();
    });
  });
}

// Back button functionality
document.getElementById('back-button').addEventListener('click', () => {
  map.setView([41.6086, 21.7453], 7); // Reset to the original view
  document.getElementById('back-button').style.display = 'none'; // Hide the back button
  // Clear subregions
  map.eachLayer(layer => {
    if (layer instanceof L.Polygon && layer !== map) {
      map.removeLayer(layer);
    }
  });
});