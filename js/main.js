// map options
const options = {
  zoomSnap: 0.1,
  center: [38.027, -84.504], //centered on University of Kentucky campus
  zoom: 14.5,
  minZoom: 12,
  maxZoom: 18,
  maxBounds: L.latLngBounds([38.066, -84.547], [37.996, -84.454]),
};

// create the Leaflet map
const map = L.map('map', options);
map.createPane('poiLayer');
map.getPane('poiLayer').style.zIndex = 500;
map.createPane('parcelLayer');
map.getPane('parcelLayer').style.zIndex = 400;
map.createPane('buildingLayer');
map.getPane('buildingLayer').style.zIndex = 350;
map.createPane('propertyLayer');
map.getPane('propertyLayer').style.zIndex = 300;

// mapbox API access Token
// mapbox API parameters
const accessToken = `pk.eyJ1Ijoiam1mcjIzNiIsImEiOiJja3c0Yzg5MWw4dHdvMzFzMXI2bGw0Z28wIn0.h1s6bozXOvBTStSlxGe0LA`;
const yourName = 'jmfr236';
const yourMap = 'ckw4ellrb0dy714o11r7tg1wt';

// request a mapbox raster tile layer and add to map
L.tileLayer(
  `https://api.mapbox.com/styles/v1/${yourName}/${yourMap}/tiles/256/{z}/{x}/{y}?access_token=${accessToken}`,
  {
    attribution:
      'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
  }
).addTo(map);

// global variables
const currentYear = 2022;

const ukPropertyData = $.getJSON('data/uk_property.geojson');
const ukBuildingData = $.getJSON('data/uk_buildings.geojson');
const ukParcelData = $.getJSON('data/uk_parcel_ownership.geojson');
const ukPoiData = $.getJSON('data/photo_locations.geojson');

$.when(ukPropertyData, ukBuildingData, ukParcelData, ukPoiData).done(function (
  ukProperty,
  ukBuilding,
  ukParcel,
  ukPoi
) {
  console.log(ukProperty);
  console.log(ukBuilding);
  console.log(ukParcel);
  console.log(ukPoi);
  drawMap(ukProperty, ukBuilding, ukParcel, ukPoi);
});

// draw geoJson layers, call createSliderUI() and updateMap() functions
function drawMap(ukProperty, ukBuilding, ukParcel, ukPoi) {
  console.log(ukProperty, ukBuilding, ukParcel, ukPoi);

  // set parcel layer style and add to map
  const parcelLayer = L.geoJson(ukParcel, {
    style: function (feature) {
      return {
        color: '#20282e',
        weight: 1,
        opacity: 0.5,
        fillOpacity: 0.75,
        fillColor: '#1E8AFF',
        pane: 'parcelLayer',
      };
    },
  }).addTo(map);

  // trigger toggle action to add/remove layer
  const hiddenParcelLayer = L.layerGroup();
  let parcelVisible = true;
  $('#customSwitch2').change(function () {
    if (parcelVisible) {
      parcelVisible = false;
      hiddenParcelLayer.addLayer(parcelLayer);
      map.removeLayer(parcelLayer);
    } else {
      parcelVisible = true;
      hiddenParcelLayer.removeLayer(parcelLayer);
      map.addLayer(parcelLayer);
    }
  });

  // set building layer style and add to map
  const buildingLayer = L.geoJson(ukBuilding, {
    style: function (feature) {
      return {
        color: '#778899',
        weight: 0.5,
        fillColor: 'black',
        fillOpacity: 0.4,
        pane: 'buildingLayer',
      };
    },
  }).addTo(map);

    // trigger toggle action to add/remove layer
  const hiddenBuildingLayer = L.layerGroup();
  let buildingVisible = true;
  $('#customSwitch3').change(function () {
    if (buildingVisible) {
      buildingVisible = false;
      hiddenBuildingLayer.addLayer(buildingLayer);
      map.removeLayer(buildingLayer);
    } else {
      buildingVisible = true;
      hiddenBuildingLayer.removeLayer(buildingLayer);
      map.addLayer(buildingLayer);
    }
  });

  // set property layer style and add to map
  const propertyLayer = L.geoJson(ukProperty, {
    style: function (feature) {
      return {
        color: '#778899',
        weight: 0.5,
        fillColor: 'black',
        fillOpacity: 0.1,
        //dashArray: '2',
        pane: 'propertyLayer',
      };
    },
  }).addTo(map);

  // set point of interest layer style and add to map
  const poiLayer = L.geoJson(ukPoi, {
    style: function (feature) {
      return {
        color: '#DA9517',
        opacity: 0.9,
        weight: 2,
        pane: 'poiLayer',
      };
    },
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: 3.5,
        fillColor: '#EEB902',
        fillOpacity: 0.8,
        weight: 1,
      });
    },
    onEachFeature: function (feature, layer) {
      var props = layer.feature.properties;

      // bind tooltip to feature
      layer.bindTooltip(
        "<div style='background:white; padding: 10px 5px 5px 5px'>" +
          `<h2><b>${props['SiteName']}</br><img src ="images/comparison/${props['SiteID']}.1.jpg"/></b></h2>` +
          '</div>',
        {
          direction: 'right',
          permanent: false,
          sticky: true,
          offset: [10, 0],
          align: 'center',
          opacity: 1,
          className: 'leaflet-tooltip-own',
        }
      );

      layer.on('click', function () {
        updateImageSlider(props['SiteID']);
        console.log(props['SiteID']);
        $('#caption').html(`<h2><b>${props['SiteName']}</b></h2>` + 
          `<p>${props['HistoricDescription']}</p>` + 
          `<h3>Image Source: <a href="${props['Link']}"> ${props['Link']}</a></h3` 
          + props['Link']);
      });
    },
  }).addTo(map);

  // https://gitbrent.github.io/bootstrap4-toggle/
  // https://mdbootstrap.com/docs/b4/jquery/forms/switch/

  // trigger toggle action to add/remove layer
  const hiddenPoiLayer = L.layerGroup();
  let poiVisible = true;
  $('#customSwitch1').change(function () {
    if (poiVisible) {
      poiVisible = false;
      hiddenPoiLayer.addLayer(poiLayer);
      map.removeLayer(poiLayer);
    } else {
      poiVisible = true;
      hiddenPoiLayer.removeLayer(poiLayer);
      map.addLayer(poiLayer);
    }
  });

  // call updateMap() function
  updateMap(parcelLayer, currentYear);

  // call updateYear() function when slider changed
  updateYear(parcelLayer, currentYear);
}

function updateMap(parcelLayer, currentYear) {
  // loop through each county layer to update the color
  parcelLayer.eachLayer(function (layer) {
    const props = layer.feature.properties;
    currentYear = Number(currentYear);
    yearBuilt = Number(props['Year_Date']);
    // console.log(currentYear)

    if (yearBuilt <= currentYear) {
      layer.setStyle({
        color: '#20282e',
        weight: 1,
        opacity: 0.5,
        fillOpacity: 0.75,
        fillColor: '#1E8AFF',
      });

      layer.bindTooltip(
        "<div style='background:white; padding: 10px 5px 5px 5px'>" +
          `<h2><b><u>Deed Information</b></u></h2>
        <p><b>Grantor: </b> ${props['Grantor']}<br/>
        <b>Deed Book: </b>${props['DB']}, p. ${props['DB_PG']}<br/>
        <b>Deed Date: </b> ${props['Deed_Date']}<br/>
        <b>Original Deed Address: </b> ${props['Deed_Alternate_Name']}<br/><br/>
        <small>PVA Number: ${props['PVANUM']}<br/>
        PVA Address: ${props['ADDRESS']}</p>` +
          '</div>',
        {
          direction: 'right',
          permanent: false,
          sticky: true,
          offset: [10, 0],
          align: 'center',
          opacity: 1,
          className: 'leaflet-tooltip-own',
        }
      );

      layer.on('mouseover', function () {
        layer.bringToFront();
        layer.setStyle({
          color: 'yellow',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.5,
        });
      });

      layer.on('mouseout', function () {
        layer.bringToBack();
        layer.setStyle({
          color: '#20282e',
          weight: 1,
          opacity: 0.5,
          fillOpacity: 0.75,
          fillColor: '#1E8AFF',
        });
      });
    } else {
      layer.setStyle({
        opacity: 0,
        fillOpacity: 0,
      });

      layer.unbindTooltip();

      layer.on('mouseover', function () {
        layer.setStyle({
          opacity: 0,
          fillOpacity: 0,
        });
      });

      layer.on('mouseout', function () {
        layer.setStyle({
          opacity: 0,
          fillOpacity: 0,
        });
      });
    }
  });
} // end updateMap()

// add legend and year display showing the year selected
function updateYear(parcelLayer, currentYear) {
  // create leaflet control for year and legend display
  var yearControl = L.control({
    position: 'bottomleft',
  });

  //When added to the map
  yearControl.onAdd = function (map) {
    // select an existing DOM element with an id of "year"
    var controls = L.DomUtil.get('year');

    // disable scrolling of map while using controls
    L.DomEvent.disableScrollPropagation(controls);

    // disable click events while using controls
    L.DomEvent.disableClickPropagation(controls);

    // return the legend and year display from the onAdd method
    return controls;
  };

  // add the control to the map
  yearControl.addTo(map);

  // select the form element
  $('.year-slider').on('input change', function () {
    // when user changes
    const currentYear = $(this).val(); // update the year
    $('#year label span').html(currentYear); // update the map with current timestamp
    updateMap(parcelLayer, currentYear); // update timestamp in legend heading
  });
} // end updateYear()

function updateImageSlider(imageId) {
  console.log(imageId);

  $('#myModal').modal('show');

  new SliderBar({
    el: '#image-compare',
    beforeImg: `images/comparison/${imageId}.1.jpg`,
    afterImg: `images/comparison/${imageId}.2.jpg`,
    //width: "90%",
    height: '75%',
    line: false,
  });

  //document.getElementById('modalLabel');
  //div.innerHTML += ;
}
