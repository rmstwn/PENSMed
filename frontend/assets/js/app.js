var map, featureList, boroughSearch = [], hospitalSearch = [];

$(window).resize(function() {
  sizeLayerControl();
});

$(document).on("click", ".feature-row", function(e) {
  $(document).off("mouseout", ".feature-row", clearHighlight);
  sidebarClick(parseInt($(this).attr("id"), 10));
});

if ( !("ontouchstart" in window) ) {
  $(document).on("mouseover", ".feature-row", function(e) {
    highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
  });
}

$(document).on("mouseout", ".feature-row", clearHighlight);

$("#full-extent-btn").click(function() {
  map.fitBounds(boroughs.getBounds());
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#legend-btn").click(function() {
  $("#legendModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#login-btn").click(function() {
  $("#loginModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#register-donor-btn").click(function() {
  $("#registerHospitalModal").modal("hide");
  $("#registerDonorModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#register-hospital-btn").click(function() {
  $("#registerDonorModal").modal("hide");
  $("#registerHospitalModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#list-btn").click(function() {
  animateSidebar();
  return false;
});

$("#nav-btn").click(function() {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

$("#sidebar-toggle-btn").click(function() {
  animateSidebar();
  return false;
});

$("#sidebar-hide-btn").click(function() {
  animateSidebar();
  return false;
});

function animateSidebar() {
  $("#sidebar").animate({
    width: "toggle"
  }, 350, function() {
    map.invalidateSize();
  });
}

function sizeLayerControl() {
  $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}

function clearHighlight() {
  highlight.clearLayers();
}

function sidebarClick(id) {
  var layer = markerClusters.getLayer(id);
  map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
  layer.fire("click");
  /* Hide sidebar and go to the map on small screens */
  if (document.body.clientWidth <= 767) {
    $("#sidebar").hide();
    map.invalidateSize();
  }
}

function syncSidebar() {
  /* Empty sidebar features */
  $("#feature-list tbody").empty();
  /* Loop through hospitals layer and add only features which are in the map bounds */
  hospitals.eachLayer(function (layer) {
    if (map.hasLayer(hospitalLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/hospital.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  /* Update list.js featureList */
  featureList = new List("features", {
    valueNames: ["feature-name"]
  });
  featureList.sort("feature-name", {
    order: "asc"
  });
}

/* Basemap Layers */
var cartoLight = L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
});
var usgsImagery = L.layerGroup([L.tileLayer("http://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}", {
  maxZoom: 15,
}), L.tileLayer.wms("http://raster.nationalmap.gov/arcgis/services/Orthoimagery/USGS_EROS_Ortho_SCALE/ImageServer/WMSServer?", {
  minZoom: 16,
  maxZoom: 19,
  layers: "0",
  format: 'image/jpeg',
  transparent: true,
  attribution: "Aerial Imagery courtesy USGS"
})]);

/* Overlay Layers */
var highlight = L.geoJson(null);
var highlightStyle = {
  stroke: false,
  fillColor: "#00FFFF",
  fillOpacity: 0.7,
  radius: 10
};

var boroughs = L.geoJson(null, {
  style: function (feature) {
    return {
      color: "black",
      fill: false,
      opacity: 1,
      clickable: false
    };
  },
  onEachFeature: function (feature, layer) {
    boroughSearch.push({
      name: layer.feature.properties.BoroName,
      source: "Boroughs",
      id: L.stamp(layer),
      bounds: layer.getBounds()
    });
  }
});
$.getJSON("data/boroughs.geojson", function (data) {
  boroughs.addData(data);
});

/* Single marker cluster layer to hold all clusters */
var markerClusters = new L.MarkerClusterGroup({
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  disableClusteringAtZoom: 16
});


$('#selectHospital').empty();
$('#selectHospital').append('<option selected="true" disabled>Pilih Rumah Sakit:</option>');
$('#selectHospital').prop('selectedIndex', 0);

/* Empty layer placeholder to add to layer control for listening when to add/remove hospitals to markerClusters layer */
var hospitalLayer = L.geoJson(null);
var hospitals = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "assets/img/hospital.png",
        iconSize: [24, 28],
        iconAnchor: [12, 28],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.NAME,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    $('#selectHospital').append($('<option></option>').attr('value', feature.id).text(layer.feature.properties.NAME));
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "</td></tr>" + "<tr><th>No. Telp.</th><td>" + feature.properties.TEL + "</td></tr>" + "<tr><th>Alamat</th><td>" + feature.properties.ADDRESS1 + "</td></tr>" + "<tr><th>Website</th><td><a class='url-break' href='" + feature.properties.URL + "' target='_blank'>" + feature.properties.URL + "</a></td></tr>" + "<table>";
      
      var pasien_positif = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px;'>" + feature.properties.pasien_positif  + "</div>"
      var pasien_pdp = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px;'>" + feature.properties.pasien_pdp + "</div>"
      
      var total = feature.properties.pasien_positif + feature.properties.pasien_pdp
      var pasien_total = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px;'>" + total + "</div>"
      
      var bed_rawatinap_tersedia = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px;'>" +  feature.properties.bed_rawatinap_tersedia + "</div>"
      var bed_rawatinap_terpakai = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px;'>" +  feature.properties.bed_rawatinap_terpakai + "</div>"
      
      var bed_icu_tersedia = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px; padding-right: 5px;'>" +  feature.properties.bed_icu_tersedia + "</div>"
      var bed_icu_terpakai = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px; padding-right: 5px;'>" +  feature.properties.bed_icu_terpakai + "</div>"

      var total_rawatinap = feature.properties.bed_rawatinap_tersedia + feature.properties.bed_rawatinap_terpakai
      var total_icu = feature.properties.bed_icu_tersedia + feature.properties.bed_icu_terpakai
      var bed_total_rawatinap = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px; padding-right: 0px;'>" +  total_rawatinap + "</div>"
      var bed_total_icu = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px; padding-right: 5px;'>" +  total_icu+ "</div>"

      var staff_dokter_ada = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px; padding-right: 0px;'>" +  feature.properties.staff_dokter_ada + "</div>"
      var staff_dokter_pergantianshift = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px; padding-right: 0px;'>" +  feature.properties.staff_dokter_pergantianshift + "</div>"
      
      var staff_perawat_ada = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px; padding-right: 0px;'>" +  feature.properties.staff_perawat_ada + "</div>"
      var staff_perawat_pergantianshift = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px; padding-right: 0px;'>" +  feature.properties.staff_perawat_pergantianshift + "</div>"

      var total_dokter = feature.properties.staff_dokter_ada + feature.properties.staff_dokter_pergantianshift
      var total_perawat = feature.properties.staff_perawat_ada + feature.properties.staff_perawat_pergantianshift
      var staff_total_dokter = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px; padding-right: 0px;'>" +  total_dokter + "</div>"
      var staff_total_perawat = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px; padding-right: 0px;'>" +  total_perawat + "</div>"

      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.NAME);
          $("#feature-info").html(content);
          $("#feature-info-pasien-positif").html(pasien_positif);
          $("#feature-info-pasien-pdp").html(pasien_pdp);
          $("#feature-info-pasien-total").html(pasien_total);
          $("#feature-info-bed-rawatinap-tersedia").html(bed_rawatinap_tersedia);
          $("#feature-info-bed-rawatinap-terpakai").html(bed_rawatinap_terpakai);
          $("#feature-info-bed-icu-tersedia").html(bed_icu_tersedia);
          $("#feature-info-bed-icu-terpakai").html(bed_icu_terpakai);
          $("#feature-info-bed-total-rawatinap").html(bed_total_rawatinap);
          $("#feature-info-bed-total-icu").html(bed_total_icu);
          $("#feature-info-staff-dokter-ada").html(staff_dokter_ada);
          $("#feature-info-staff-dokter-pergantianshift").html(staff_dokter_pergantianshift);
          $("#feature-info-staff-perawat-ada").html(staff_perawat_ada);
          $("#feature-info-staff-perawat-pergantianshift").html(staff_perawat_pergantianshift);
          $("#feature-info-staff-total-dokter").html(staff_total_dokter);
          $("#feature-info-staff-total-perawat").html(staff_total_perawat);
          
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/hospital.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      hospitalSearch.push({
        name: layer.feature.properties.NAME,
        address: layer.feature.properties.ADDRESS1,
        source: "Hospital",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
$.getJSON("data/Rumah sakit COVID-19.geojson", function (data) {
  hospitals.addData(data);
  map.addLayer(hospitalLayer);
});

map = L.map("map", {
  center: [-6.643,110.874],
  zoom: 6,
  layers: [cartoLight, boroughs, markerClusters, highlight],
  zoomControl: false,
  attributionControl: false
});

/* Layer control listeners that allow for a single markerClusters layer */
map.on("overlayadd", function(e) {
  if (e.layer === hospitalLayer) {
    markerClusters.addLayer(hospitals);
    syncSidebar();
  }
});

map.on("overlayremove", function(e) {
  if (e.layer === hospitalLayer) {
    markerClusters.removeLayer(hospitals);
    syncSidebar();
  }
});

/* Filter sidebar feature list to only show features in current map bounds */
map.on("moveend", function (e) {
  syncSidebar();
});

/* Clear feature highlight when map is clicked */
map.on("click", function(e) {
  highlight.clearLayers();
});

/* Attribution control */
function updateAttribution(e) {
  $.each(map._layers, function(index, layer) {
    if (layer.getAttribution) {
      $("#attribution").html((layer.getAttribution()));
    }
  });
}
map.on("layeradd", updateAttribution);
map.on("layerremove", updateAttribution);

var attributionControl = L.control({
  position: "bottomright"
});
attributionControl.onAdd = function (map) {
  var div = L.DomUtil.create("div", "leaflet-control-attribution");
  div.innerHTML = "<span class='hidden-xs'>Developed by <a href='http://pensmed.com'>pensmed.com</a> | </span><a href='#' onclick='$(\"#attributionModal\").modal(\"show\"); return false;'>Attribution</a>";
  return div;
};
map.addControl(attributionControl);

var zoomControl = L.control.zoom({
  position: "bottomright"
}).addTo(map);

/* GPS enabled geolocation control set to follow the user's location */
var locateControl = L.control.locate({
  position: "bottomright",
  drawCircle: true,
  follow: true,
  setView: true,
  keepCurrentZoomLevel: true,
  markerStyle: {
    weight: 1,
    opacity: 0.8,
    fillOpacity: 0.8
  },
  circleStyle: {
    weight: 1,
    clickable: false
  },
  icon: "fa fa-location-arrow",
  metric: false,
  strings: {
    title: "My location",
    popup: "You are within {distance} {unit} from this point",
    outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
  },
  locateOptions: {
    maxZoom: 18,
    watch: true,
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000
  }
}).addTo(map);

/* Larger screens get expanded layer control and visible sidebar */
if (document.body.clientWidth <= 767) {
  var isCollapsed = true;
} else {
  var isCollapsed = false;
}

var baseLayers = {
  "Street Map": cartoLight,
  "Aerial Imagery": usgsImagery
};

var groupedOverlays = {
  "Points of Interest": {
    "<img src='assets/img/hospital.png' width='24' height='28'>&nbsp;Rumah Sakit": hospitalLayer,
  },
  "Reference": {
    "Boroughs": boroughs,
  }
};

var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
  collapsed: isCollapsed
}).addTo(map);

/* Highlight search box text on click */
$("#searchbox").click(function () {
  $(this).select();
});

/* Prevent hitting enter from refreshing the page */
$("#searchbox").keypress(function (e) {
  if (e.which == 13) {
    e.preventDefault();
  }
});

$("#featureModal").on("hidden.bs.modal", function (e) {
  $(document).on("mouseout", ".feature-row", clearHighlight);
});

/* Typeahead search functionality */
$(document).one("ajaxStop", function () {
  $("#loading").hide();
  sizeLayerControl();
  /* Fit map to boroughs bounds */
  map.fitBounds(boroughs.getBounds());
  featureList = new List("features", {valueNames: ["feature-name"]});
  featureList.sort("feature-name", {order:"asc"});

  var boroughsBH = new Bloodhound({
    name: "Boroughs",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: boroughSearch,
    limit: 10
  });

  var hospitalsBH = new Bloodhound({
    name: "Hospital",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: hospitalSearch,
    limit: 10
  });

  var geonamesBH = new Bloodhound({
    name: "GeoNames",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      url: "http://api.geonames.org/searchJSON?username=pensmed&featureClass=P&maxRows=5&countryCode=ID&name_startsWith=%QUERY",
      filter: function (data) {
        return $.map(data.geonames, function (result) {
          return {
            name: result.name + ", " + result.adminCode1,
            lat: result.lat,
            lng: result.lng,
            source: "GeoNames"
          };
        });
      },
      ajax: {
        beforeSend: function (jqXhr, settings) {
          settings.url += "&east=" + map.getBounds().getEast() + "&west=" + map.getBounds().getWest() + "&north=" + map.getBounds().getNorth() + "&south=" + map.getBounds().getSouth();
          $("#searchicon").removeClass("fa-search").addClass("fa-refresh fa-spin");
        },
        complete: function (jqXHR, status) {
          $('#searchicon').removeClass("fa-refresh fa-spin").addClass("fa-search");
        }
      }
    },
    limit: 10
  });
  boroughsBH.initialize();
  hospitalsBH.initialize();
  geonamesBH.initialize();

  /* instantiate the typeahead UI */
  $("#searchbox").typeahead({
    minLength: 1,
    highlight: true,
    hint: false
  }, {
    name: "Boroughs",
    displayKey: "name",
    source: boroughsBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'>Boroughs</h4>"
    }
  }, {
    name: "Hospital",
    displayKey: "name",
    source: hospitalsBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/hospital.png' width='24' height='28'>&nbsp;Hospital</h4>",
      suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{address}}</small>"].join(""))
    }
  }, {
    name: "GeoNames",
    displayKey: "name",
    source: geonamesBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/globe.png' width='25' height='25'>&nbsp;GeoNames</h4>"
    }
  }).on("typeahead:selected", function (obj, datum) {
    if (datum.source === "Boroughs") {
      map.fitBounds(datum.bounds);
    }
    if (datum.source === "Hospital") {
      if (!map.hasLayer(hospitalLayer)) {
        map.addLayer(hospitalLayer);
      }
      map.setView([datum.lat, datum.lng], 17);
      if (map._layers[datum.id]) {
        map._layers[datum.id].fire("click");
      }
    }
    if (datum.source === "GeoNames") {
      map.setView([datum.lat, datum.lng], 14);
    }
    if ($(".navbar-collapse").height() > 50) {
      $(".navbar-collapse").collapse("hide");
    }
  }).on("typeahead:opened", function () {
    $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
    $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
  }).on("typeahead:closed", function () {
    $(".navbar-collapse.in").css("max-height", "");
    $(".navbar-collapse.in").css("height", "");
  });
  $(".twitter-typeahead").css("position", "static");
  $(".twitter-typeahead").css("display", "block");
});

// Leaflet patch to make layer control scrollable on touch browsers
var container = $(".leaflet-control-layers")[0];
if (!L.Browser.touch) {
  L.DomEvent
  .disableClickPropagation(container)
  .disableScrollPropagation(container);
} else {
  L.DomEvent.disableClickPropagation(container);
}

function showPasswordLogin() {
  var x = document.getElementById("passwordLogin");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}

function showPasswordRegister() {
  var x = document.getElementById("passwordRegisterDonor1");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
  var x = document.getElementById("passwordRegisterDonor2");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}

$('input.typeahead').typeahead({
  source:  function (query, process) {
    return $.get('/ajaxpro.php', { query: query }, function (data) {
        console.log(data);
        data = $.parseJSON(data);
          return process(data);
      });
  }
});