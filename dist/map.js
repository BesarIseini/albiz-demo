var map = L.map('map').setView([41.62, 21.772], 9);
// const mkMunicipalityData = getMKData()
let highestPercentages
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
setTimeout(() => {
    getHighestPercentage()
}, 100);

// L.setMaxBounds([
//     [41.62, 21.772],
//     [50.62, 30.772]
// ])


function getHighestPercentage() {
    let tempData = data
    let percentages = []
    tempData.forEach(element => {
        let currYear = element.vitet[yearID]
        percentages.push((currYear.pa_pun / currYear.populsi) * 100)
    });
    highestPercentages = Math.floor(Math.max(...percentages)) - 2
}



function getColor(d) {
    return d > highestPercentages ? '#800026' :
    d > highestPercentages / 6 * 6  ? '#BD0026' :
    d > highestPercentages / 6 * 5  ? '#E31A1C' :
    d > highestPercentages / 6 * 4  ? '#FC4E2A' :
    d > highestPercentages / 6 * 3   ? '#FD8D3C' :
    d > highestPercentages / 6 * 2   ? '#FEB24C' :
    d > highestPercentages / 6 * 1   ? '#FED976' :
    '#FFEDA0';
}

function style(feature) {
    let percentage    
    data.forEach(element => {
        if(feature.id === element.id) {
            const selectedYear = element.vitet[yearID]
            percentage = selectedYear.pa_pun / selectedYear.populsi * 100
        }
    })
    if(!percentage) percentage = 0
    return {
        fillColor: getColor(percentage),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    layer.bringToFront();
    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}


var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
        '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
        : 'Hover over a state');
    };
    
    info.addTo(map);
    
    // L.geoJson(mkData, {style: style}).addTo(map);
window.onload = () => {
    geojson = L.geoJson(mkData, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);
    onLoad()
}