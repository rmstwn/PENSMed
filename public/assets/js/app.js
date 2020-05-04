var map, featureList, boroughSearch = [], hospitalSearch = [];

$(window).resize(function () {
  sizeLayerControl();
});

$(document).on("click", ".feature-row", function (e) {
  $(document).off("mouseout", ".feature-row", clearHighlight);
  sidebarClick(parseInt($(this).attr("id"), 10));
});

if (!("ontouchstart" in window)) {
  $(document).on("mouseover", ".feature-row", function (e) {
    highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
  });
}

$(document).on("mouseout", ".feature-row", clearHighlight);

$("#full-extent-btn").click(function () {
  map.fitBounds(boroughs.getBounds());
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#legend-btn").click(function () {
  $("#legendModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#login-btn").click(function () {
  $("#loginModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#register-donor-btn").click(function () {
  $("#registerHospitalModal").modal("hide");
  $("#registerDonorModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#register-hospital-btn").click(function () {
  $("#registerDonorModal").modal("hide");
  $("#registerHospitalModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#list-btn").click(function () {
  animateSidebar();
  return false;
});

$("#nav-btn").click(function () {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

$("#sidebar-toggle-btn").click(function () {
  animateSidebar();
  return false;
});

$("#sidebar-hide-btn").click(function () {
  animateSidebar();
  return false;
});

function animateSidebar() {
  $("#sidebar").animate({
    width: "toggle"
  }, 350, function () {
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
      $.getJSON(`http://localhost:3000/api/v1/data/hospital/${layer.feature.properties.NAME}`, function (data) {

        var last_update = "<h5 style='text-align: right;'>Last Update : <span style='color: red;'>" + data.data[0].update_time + "</span></h5>"
  
        // Pasien
        var pasien_positif = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px;'><input type='text' id='editvalue1' value='" + data.data[0].pasien.positif + "' style='border:none; outline:none; width: 70px; background-color: #0B668B; text-align: right;' readonly></div>"
        var pasien_pdp = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px;'><input type='text' id='editvalue2' value='" + data.data[0].pasien.pdp + "' style='border:none; outline:none; width: 70px; background-color: #0B668B; text-align: right;' readonly></div>"
  
        var total = data.data[0].pasien.positif + data.data[0].pasien.pdp
        var pasien_total = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px;'>" + total + "</div>"
  
        // Kasur
        var bed_rawatinap_tersedia = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px;'><input type='text' id='editvalue3' value='" + data.data[0].kasur.rawat_inap.tersedia + "' style='border:none; outline:none; width: 70px; background-color: #0B668B; text-align: right;' readonly></div>"
        var bed_rawatinap_terpakai = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px;'><input type='text' id='editvalue4' value='" + data.data[0].kasur.rawat_inap.terpakai + "' style='border:none; outline:none; width: 70px; background-color: #0B668B; text-align: right;' readonly></div>"
  
        var bed_icu_tersedia = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px; padding-right: 5px;'><input type='text' id='editvalue5' value='" + data.data[0].kasur.icu.tersedia + "' style='border:none; outline:none; width: 70px; background-color: #0B668B; text-align: right;' readonly></div>"
        var bed_icu_terpakai = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px; padding-right: 5px;'><input type='text' id='editvalue6' value='" + data.data[0].kasur.icu.terpakai + "' style='border:none; outline:none; width: 70px; background-color: #0B668B; text-align: right;' readonly></div>"
  
        var total_rawatinap = data.data[0].kasur.rawat_inap.tersedia + data.data[0].kasur.rawat_inap.terpakai
        var total_icu = data.data[0].kasur.icu.tersedia + data.data[0].kasur.icu.terpakai
        var bed_total_rawatinap = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px; padding-right: 0px;'>" + total_rawatinap + "</div>"
        var bed_total_icu = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px; padding-right: 5px;'>" + total_icu + "</div>"
  
        // Staff
        var staff_dokter_ada = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px; padding-right: 0px;'><input type='text' id='editvalue7' value='" + data.data[0].staf.dokter.ada + "' style='border:none; outline:none; width: 70px; background-color: #0B668B; text-align: right;' readonly></div>"
        var staff_dokter_pergantianshift = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px; padding-right: 0px;'><input type='text' id='editvalue8' value='" + data.data[0].staf.dokter.pergantian_shift + "' style='border:none; outline:none; width: 70px; background-color: #0B668B; text-align: right;' readonly></div>"
  
        var staff_perawat_ada = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px; padding-right: 0px;'><input type='text' id='editvalue9' value='" + data.data[0].staf.perawat.ada + "' style='border:none; outline:none; width: 70px; background-color: #0B668B; text-align: right;' readonly></div>"
        var staff_perawat_pergantianshift = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px; padding-right: 0px;'><input type='text' id='editvalue10' value='" + data.data[0].staf.perawat.pergantian_shift + "' style='border:none; outline:none; width: 70px; background-color: #0B668B; text-align: right;' readonly></div>"
  
        var total_dokter = data.data[0].staf.dokter.ada + data.data[0].staf.dokter.pergantian_shift
        var total_perawat = data.data[0].staf.perawat.ada + data.data[0].staf.perawat.pergantian_shift
        var staff_total_dokter = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px; padding-right: 0px;'>" + total_dokter + "</div>"
        var staff_total_perawat = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px; padding-right: 0px;'>" + total_perawat + "</div>"
  
        //Sarung Tangan Pemeriksaan
        var sarungtangan_periksa_s = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px;'><input type='text' id='editvalue11' value='" + data.data[0].apd.sarung_tangan_periksa.s + "' style='border:none; outline:none; width: 70px; background-color: #0B668B; text-align: right;' readonly></div>"
        var sarungtangan_periksa_m = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px;'><input type='text' id='editvalue12' value='" + data.data[0].apd.sarung_tangan_periksa.m + "' style='border:none; outline:none; width: 70px; background-color: #0B668B; text-align: right;' readonly></div>"
        var sarungtangan_periksa_l = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px;'><input type='text' id='editvalue13' value='" + data.data[0].apd.sarung_tangan_periksa.l + "' style='border:none; outline:none; width: 70px; background-color: #0B668B; text-align: right;' readonly></div>"
        var sarungtangan_periksa_xl = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px;'><input type='text' id='editvalue14' value='" + data.data[0].apd.sarung_tangan_periksa.xl + "' style='border:none; outline:none; width: 70px; background-color: #0B668B; text-align: right;' readonly></div>"
  
        var total_sarungtangan_periksa = data.data[0].apd.sarung_tangan_periksa.s + data.data[0].apd.sarung_tangan_periksa.m + data.data[0].apd.sarung_tangan_periksa.l + data.data[0].apd.sarung_tangan_periksa.xl
        var sarungtangan_periksa_total = "<div class='col-sm-1' style='text.align: right; color: white; padding: 0px;'>" + total_sarungtangan_periksa + "</div>"

        //Sarung Tangan Bedah
        var sarungtangan_bedah_s = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px;'><input type='text' id='editvalue15' value='" + data.data[0].apd.sarung_tangan_bedah.s + "' style='border:none; outline:none; width: 70px; background-color: #0B668B; text-align: right;' readonly></div>"
        var sarungtangan_bedah_m = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px;'><input type='text' id='editvalue16' value='" + data.data[0].apd.sarung_tangan_bedah.m + "' style='border:none; outline:none; width: 70px; background-color: #0B668B; text-align: right;' readonly></div>"
        var sarungtangan_bedah_l = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px;'><input type='text' id='editvalue17' value='" + data.data[0].apd.sarung_tangan_bedah.l + "' style='border:none; outline:none; width: 70px; background-color: #0B668B; text-align: right;' readonly></div>"
        var sarungtangan_bedah_xl = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px;'><input type='text' id='editvalue18' value='" + data.data[0].apd.sarung_tangan_bedah.xl + "' style='border:none; outline:none; width: 70px; background-color: #0B668B; text-align: right;' readonly></div>"
  
        var total_sarungtangan_bedah = data.data[0].apd.sarung_tangan_bedah.s + data.data[0].apd.sarung_tangan_bedah.m + data.data[0].apd.sarung_tangan_bedah.l + data.data[0].apd.sarung_tangan_bedah.xl
        var sarungtangan_bedah_total = "<div class='col-sm-1' style='te.t-align: right; color: white; padding: 0px;'>" + total_sarungtangan_bedah + "</div>"

        //Masker Bedah
        var maskerbedah_tersedia = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px;'><input type='text' id='editvalue19' value='" + data.data[0].apd.masker_bedah + "' style='border:none; outline:none; width: 70px; background-color: #0B668B; text-align: right;' readonly></div>"
  
        //Respirator N95
        var respiratorn95_tersedia = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px;'><input type='text' id='editvalue20' value='" + data.data[0].apd.respirator_n95 + "' style='border:none; outline:none; width: 70px; background-color: #0B668B; text-align: right;' readonly></div>"
  
        //Penutup Kepala
        var penutupkepala_tersedia = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px;'><input type='text' id='editvalue21' value='" + data.data[0].apd.penutup_kepala + "' style='border:none; outline:none; width: 70px; background-color: #0B668B; text-align: right;' readonly></div>"
  
        //Pelindung Mata
        var pelindungmata_tersedia = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px;'><input type='text' id='editvalue22' value='" + data.data[0].apd.pelindung_mata + "' style='border:none; outline:none; width: 70px; background-color: #0B668B; text-align: right;' readonly></div>"
  
        //Pelindung Wajah
        var pelindungwajah_s = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px;'><input type='text' id='editvalue23' value='" + data.data[0].apd.pelindung_wajah.s + "' style='border:none; outline:none; width: 70px; background-color: #0B668B; text-align: right;' readonly></div>"
        var pelindungwajah_m = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px;'><input type='text' id='editvalue23' value='" + data.data[0].apd.pelindung_wajah.m + "' style='border:none; outline:none; width: 70px; background-color: #0B668B; text-align: right;' readonly></div>"
        var pelindungwajah_l = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px;'><input type='text' id='editvalue23' value='" + data.data[0].apd.pelindung_wajah.l + "' style='border:none; outline:none; width: 70px; background-color: #0B668B; text-align: right;' readonly></div>"
        var pelindungwajah_xl = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px;'><input type='text' id='editvalue23' value='" + data.data[0].apd.pelindung_wajah.xl + "' style='border:none; outline:none; width: 70px; background-color: #0B668B; text-align: right;' readonly></div>"
        var pelindungwajah_total = data.data[0].apd.pelindung_wajah.s + data.data[0].apd.pelindung_wajah.m + data.data[0].apd.pelindung_wajah.l + data.data[0].apd.pelindung_wajah.xl
        pelindungwajah_total = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px;'>" + pelindungwajah_total + "</div>"
        //Gaun Medis
        var gaunmedis_s = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px;'><input type='text' id='editvalue24' value='" + data.data[0].apd.gaun_medis.s + "' style='border:none; outline:none; width: 70px; background-color: #0B668B; text-align: right;' readonly></div>"
        var gaunmedis_m = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px;'><input type='text' id='editvalue25' value='" + data.data[0].apd.gaun_medis.m + "' style='border:none; outline:none; width: 70px; background-color: #0B668B; text-align: right;' readonly></div>"
        var gaunmedis_l = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px;'><input type='text' id='editvalue26' value='" + data.data[0].apd.gaun_medis.l + "' style='border:none; outline:none; width: 70px; background-color: #0B668B; text-align: right;' readonly></div>"
        var gaunmedis_xl = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px;'><input type='text' id='editvalue27' value='" + data.data[0].apd.gaun_medis.xl + "' style='border:none; outline:none; width: 70px; background-color: #0B668B; text-align: right;' readonly></div>"
  
        var total_gaunmedis = data.data[0].apd.gaun_medis.s + data.data[0].apd.gaun_medis.m + data.data[0].apd.gaun_medis.l + data.data[0].apd.gaun_medis.xl
        var gaunmedis_total = "<div class='col-sm-1'.style='text-align: right; color: white; padding: 0px;'>" + total_gaunmedis + "</div>"

        //Coverall Medis
        var coverallmedis_m = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px;'><input type='text' id='editvalue29' value='" + data.data[0].apd.coverall_medis.m + "' style='border:none; outline:none; width: 70px; background-color: #0B668B; text-align: right;' readonly></div>"
        var coverallmedis_l = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px;'><input type='text' id='editvalue30' value='" + data.data[0].apd.coverall_medis.l + "' style='border:none; outline:none; width: 70px; background-color: #0B668B; text-align: right;' readonly></div>"
        var coverallmedis_xl = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px;'><input type='text' id='editvalue31' value='" + data.data[0].apd.coverall_medis.xl + "' style='border:none; outline:none; width: 70px; background-color: #0B668B; text-align: right;' readonly></div>"
        var coverallmedis_xxl = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px;'><input type='text' id='editvalue28' value='" + data.data[0].apd.coverall_medis.xxl + "' style='border:none; outline:none; width: 70px; background-color: #0B668B; text-align: right;' readonly></div>"
  
        var total_coverallmedis = data.data[0].apd.coverall_medis.xxl + data.data[0].apd.coverall_medis.m + data.data[0].apd.coverall_medis.l + data.data[0].apd.coverall_medis.xl
        var coverallmedis_total = "<div class='col-sm-1' sty.e='text-align: right; color: white; padding: 0px;'>" + total_coverallmedis + "</div>"

        //Heavy Duty Apron
        var heavydutyapron_tersedia = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px;'><input type='text' id='editvalue32' value='" + data.data[0].apd.heavy_duty_apron + "' style='border:none; outline:none; width: 70px; background-color: #0B668B; text-align: right;' readonly></div>"
  
        //Sepatu Boot Anti Air
        var sepatuboot_tersedia = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px;'><input type='text' id='editvalue33' value='" + data.data[0].apd.sepatu_boot_anti_air + "' style='border:none; outline:none; width: 70px; background-color: #0B668B; text-align: right;' readonly></div>"
  
        //Penutup Sepatu
        var penutupsepatu_tersedia = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px;'><input type='text' id='editvalue34' value='" + data.data[0].apd.penutup_sepatu + "' style='border:none; outline:none; width: 70px; background-color: #0B668B; text-align: right;' readonly></div>"
  
        //Ventitalors
        var ventilators_tersedia = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px; padding-right: 5px;'><input type='text' id='editvalue35' value='" + data.data[0].apd.ventilator.tersedia + "' style='border:none; outline:none; width: 70px; background-color: #0B668B; text-align: right;' readonly></div>"
        var ventilators_terpakai = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px; padding-right: 5px;'><input type='text' id='editvalue36' value='" + data.data[0].apd.ventilator.terpakai + "' style='border:none; outline:none; width: 70px; background-color: #0B668B; text-align: right;' readonly></div>"
  
        var total_ventilators = data.data[0].apd.ventilator.tersedia + data.data[0].apd.ventilator.terpakai
        var ventilators_total = "<div class='col-sm-1' style='text-align: right; color: white; padding: 0px; padding-right: 5px;'>" + total_ventilators + "</div>"
  
        layer.on({
          click: function (e) {
            $("#feature-title").html(feature.properties.NAME);
            $("#feature-info").html(content);
  
            $("#feature-last_update").html(last_update);
            //Pasien
            $("#feature-info-pasien-positif").html(pasien_positif);
            $("#feature-info-pasien-pdp").html(pasien_pdp);
            $("#feature-info-pasien-total").html(pasien_total);
  
            //Kasur
            $("#feature-info-bed-rawatinap-tersedia").html(bed_rawatinap_tersedia);
            $("#feature-info-bed-rawatinap-terpakai").html(bed_rawatinap_terpakai);
            $("#feature-info-bed-icu-tersedia").html(bed_icu_tersedia);
            $("#feature-info-bed-icu-terpakai").html(bed_icu_terpakai);
            $("#feature-info-bed-total-rawatinap").html(bed_total_rawatinap);
            $("#feature-info-bed-total-icu").html(bed_total_icu);
  
            //Staff
            $("#feature-info-staff-dokter-ada").html(staff_dokter_ada);
            $("#feature-info-staff-dokter-pergantianshift").html(staff_dokter_pergantianshift);
            $("#feature-info-staff-perawat-ada").html(staff_perawat_ada);
            $("#feature-info-staff-perawat-pergantianshift").html(staff_perawat_pergantianshift);
            $("#feature-info-staff-total-dokter").html(staff_total_dokter);
            $("#feature-info-staff-total-perawat").html(staff_total_perawat);
  
            //Sarung tangan Pemeriksaan
            $("#feature-info-sarungtangan-periksa-s").html(sarungtangan_periksa_s);
            $("#feature-info-sarungtangan-periksa-m").html(sarungtangan_periksa_m);
            $("#feature-info-sarungtangan-periksa-l").html(sarungtangan_periksa_l);
            $("#feature-info-sarungtangan-periksa-xl").html(sarungtangan_periksa_xl);
            $("#feature-info-sarungtangan-periksa-total").html(sarungtangan_periksa_total);
  
            //Sarung tangan Bedah
            $("#feature-info-sarungtangan-bedah-s").html(sarungtangan_bedah_s);
            $("#feature-info-sarungtangan-bedah-m").html(sarungtangan_bedah_m);
            $("#feature-info-sarungtangan-bedah-l").html(sarungtangan_bedah_l);
            $("#feature-info-sarungtangan-bedah-xl").html(sarungtangan_bedah_xl);
            $("#feature-info-sarungtangan-bedah-total").html(sarungtangan_bedah_total);
  
            //Masker bedah
            $("#feature-info-maskerbedah-tersedia").html(maskerbedah_tersedia);
  
            //Respirator N95
            $("#feature-info-respiratorn95-tersedia").html(respiratorn95_tersedia);
  
            //Penutup Kepala
            $("#feature-info-penutupkepala-tersedia").html(penutupkepala_tersedia);
  
            //Pelindung Mata
            $("#feature-info-pelindungmata-tersedia").html(pelindungmata_tersedia);
  
            //Pelindung Wajah
            $("#feature-info-pelindungwajah-s").html(pelindungwajah_s);
            $("#feature-info-pelindungwajah-m").html(pelindungwajah_m);
            $("#feature-info-pelindungwajah-l").html(pelindungwajah_l);
            $("#feature-info-pelindungwajah-xl").html(pelindungwajah_xl);
            $("#feature-info-pelindungwajah-total").html(pelindungwajah_total);
  
            //Gaun Medis
            $("#feature-info-gaunmedis-s").html(gaunmedis_s);
            $("#feature-info-gaunmedis-m").html(gaunmedis_m);
            $("#feature-info-gaunmedis-l").html(gaunmedis_l);
            $("#feature-info-gaunmedis-xl").html(gaunmedis_xl);
            $("#feature-info-gaunmedis-total").html(gaunmedis_total);
  
            //Coverall Medis
            $("#feature-info-coverallmedis-xxl").html(coverallmedis_xxl);
            $("#feature-info-coverallmedis-m").html(coverallmedis_m);
            $("#feature-info-coverallmedis-l").html(coverallmedis_l);
            $("#feature-info-coverallmedis-xl").html(coverallmedis_xl);
            $("#feature-info-coverallmedis-total").html(coverallmedis_total);
  
            //Heavy Duty Apron
            $("#feature-info-heavydutyapron-tersedia").html(heavydutyapron_tersedia);
  
            //Sepatu Boot Anti Air
            $("#feature-info-sepatuboot-tersedia").html(sepatuboot_tersedia);
  
            //Penutup Sepatu
            $("#feature-info-penutupsepatu-tersedia").html(penutupsepatu_tersedia);
  
            //Ventilator
            $("#feature-info-ventilators-tersedia").html(ventilators_tersedia);
            $("#feature-info-ventilators-terpakai").html(ventilators_terpakai);
            $("#feature-info-ventilators-total").html(ventilators_total);
  
            $("#featureModal").modal("show");
            highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
          }
        });
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
$.getJSON("http://localhost:3000/api/v1/map/hospital", function (data) {
  hospitals.addData(data);
  map.addLayer(hospitalLayer);
});

map = L.map("map", {
  center: [-6.643, 110.874],
  zoom: 6,
  layers: [cartoLight, boroughs, markerClusters, highlight],
  zoomControl: false,
  attributionControl: false
});

/* Layer control listeners that allow for a single markerClusters layer */
map.on("overlayadd", function (e) {
  if (e.layer === hospitalLayer) {
    markerClusters.addLayer(hospitals);
    syncSidebar();
  }
});

map.on("overlayremove", function (e) {
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
map.on("click", function (e) {
  highlight.clearLayers();
});

/* Attribution control */
function updateAttribution(e) {
  $.each(map._layers, function (index, layer) {
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
  featureList = new List("features", { valueNames: ["feature-name"] });
  featureList.sort("feature-name", { order: "asc" });

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
  source: function (query, process) {
    return $.get('/ajaxpro.php', { query: query }, function (data) {
      console.log(data);
      data = $.parseJSON(data);
      return process(data);
    });
  }
});

// $("#edit-btn").click(function() {
//   document.getElementById("editvalue").readOnly = false;
// });

function editvalue() {
  // console.log('inner text is', document.getElementById("Edit-btn").innerText);

  if (document.getElementById("Edit-btn").innerText == "Edit Nilai") {
    document.getElementById("editvalue1").readOnly = false;
    document.getElementById("editvalue1").style.border = "1px solid yellow";

    document.getElementById("editvalue2").readOnly = false;
    document.getElementById("editvalue2").style.border = "1px solid yellow";

    document.getElementById("editvalue3").readOnly = false;
    document.getElementById("editvalue3").style.border = "1px solid yellow";

    document.getElementById("editvalue4").readOnly = false;
    document.getElementById("editvalue4").style.border = "1px solid yellow";

    document.getElementById("editvalue5").readOnly = false;
    document.getElementById("editvalue5").style.border = "1px solid yellow";

    document.getElementById("editvalue6").readOnly = false;
    document.getElementById("editvalue6").style.border = "1px solid yellow";

    document.getElementById("editvalue7").readOnly = false;
    document.getElementById("editvalue7").style.border = "1px solid yellow";

    document.getElementById("editvalue8").readOnly = false;
    document.getElementById("editvalue8").style.border = "1px solid yellow";

    document.getElementById("editvalue9").readOnly = false;
    document.getElementById("editvalue9").style.border = "1px solid yellow";

    document.getElementById("editvalue10").readOnly = false;
    document.getElementById("editvalue10").style.border = "1px solid yellow";

    document.getElementById("editvalue11").readOnly = false;
    document.getElementById("editvalue11").style.border = "1px solid yellow";

    document.getElementById("editvalue12").readOnly = false;
    document.getElementById("editvalue12").style.border = "1px solid yellow";

    document.getElementById("editvalue13").readOnly = false;
    document.getElementById("editvalue13").style.border = "1px solid yellow";

    document.getElementById("editvalue14").readOnly = false;
    document.getElementById("editvalue14").style.border = "1px solid yellow";

    document.getElementById("editvalue15").readOnly = false;
    document.getElementById("editvalue15").style.border = "1px solid yellow";

    document.getElementById("editvalue16").readOnly = false;
    document.getElementById("editvalue16").style.border = "1px solid yellow";

    document.getElementById("editvalue17").readOnly = false;
    document.getElementById("editvalue17").style.border = "1px solid yellow";

    document.getElementById("editvalue18").readOnly = false;
    document.getElementById("editvalue18").style.border = "1px solid yellow";

    document.getElementById("editvalue19").readOnly = false;
    document.getElementById("editvalue19").style.border = "1px solid yellow";

    document.getElementById("editvalue20").readOnly = false;
    document.getElementById("editvalue20").style.border = "1px solid yellow";

    document.getElementById("editvalue21").readOnly = false;
    document.getElementById("editvalue21").style.border = "1px solid yellow";

    document.getElementById("editvalue22").readOnly = false;
    document.getElementById("editvalue22").style.border = "1px solid yellow";

    document.getElementById("editvalue23").readOnly = false;
    document.getElementById("editvalue23").style.border = "1px solid yellow";

    document.getElementById("editvalue24").readOnly = false;
    document.getElementById("editvalue24").style.border = "1px solid yellow";

    document.getElementById("editvalue25").readOnly = false;
    document.getElementById("editvalue25").style.border = "1px solid yellow";

    document.getElementById("editvalue26").readOnly = false;
    document.getElementById("editvalue26").style.border = "1px solid yellow";

    document.getElementById("editvalue27").readOnly = false;
    document.getElementById("editvalue27").style.border = "1px solid yellow";

    document.getElementById("editvalue28").readOnly = false;
    document.getElementById("editvalue28").style.border = "1px solid yellow";

    document.getElementById("editvalue29").readOnly = false;
    document.getElementById("editvalue29").style.border = "1px solid yellow";

    document.getElementById("editvalue30").readOnly = false;
    document.getElementById("editvalue30").style.border = "1px solid yellow";

    document.getElementById("editvalue31").readOnly = false;
    document.getElementById("editvalue31").style.border = "1px solid yellow";

    document.getElementById("editvalue32").readOnly = false;
    document.getElementById("editvalue32").style.border = "1px solid yellow";

    document.getElementById("editvalue33").readOnly = false;
    document.getElementById("editvalue33").style.border = "1px solid yellow";

    document.getElementById("editvalue34").readOnly = false;
    document.getElementById("editvalue34").style.border = "1px solid yellow";

    document.getElementById("editvalue35").readOnly = false;
    document.getElementById("editvalue35").style.border = "1px solid yellow";

    document.getElementById("editvalue36").readOnly = false;
    document.getElementById("editvalue36").style.border = "1px solid yellow";

    document.getElementById("Edit-btn").innerText = "Simpan Nilai"
  }

  else if (document.getElementById("Edit-btn").innerText == "Simpan Nilai") {
    document.getElementById("editvalue1").readOnly = true;
    document.getElementById("editvalue1").style.border = "none";

    document.getElementById("editvalue2").readOnly = true;
    document.getElementById("editvalue2").style.border = "none";

    document.getElementById("editvalue3").readOnly = true;
    document.getElementById("editvalue3").style.border = "none";

    document.getElementById("editvalue4").readOnly = true;
    document.getElementById("editvalue4").style.border = "none";

    document.getElementById("editvalue5").readOnly = true;
    document.getElementById("editvalue5").style.border = "none";

    document.getElementById("editvalue6").readOnly = true;
    document.getElementById("editvalue6").style.border = "none";

    document.getElementById("editvalue7").readOnly = true;
    document.getElementById("editvalue7").style.border = "none";

    document.getElementById("editvalue8").readOnly = true;
    document.getElementById("editvalue8").style.border = "none";

    document.getElementById("editvalue9").readOnly = true;
    document.getElementById("editvalue9").style.border = "none";

    document.getElementById("editvalue10").readOnly = true;
    document.getElementById("editvalue10").style.border = "none";

    document.getElementById("editvalue11").readOnly = true;
    document.getElementById("editvalue11").style.border = "none";

    document.getElementById("editvalue12").readOnly = true;
    document.getElementById("editvalue12").style.border = "none";

    document.getElementById("editvalue13").readOnly = true;
    document.getElementById("editvalue13").style.border = "none";

    document.getElementById("editvalue14").readOnly = true;
    document.getElementById("editvalue14").style.border = "none";

    document.getElementById("editvalue15").readOnly = true;
    document.getElementById("editvalue15").style.border = "none";

    document.getElementById("editvalue16").readOnly = true;
    document.getElementById("editvalue16").style.border = "none";

    document.getElementById("editvalue17").readOnly = true;
    document.getElementById("editvalue17").style.border = "none";

    document.getElementById("editvalue18").readOnly = true;
    document.getElementById("editvalue18").style.border = "none";

    document.getElementById("editvalue19").readOnly = true;
    document.getElementById("editvalue19").style.border = "none";

    document.getElementById("editvalue20").readOnly = true;
    document.getElementById("editvalue20").style.border = "none";

    document.getElementById("editvalue21").readOnly = true;
    document.getElementById("editvalue21").style.border = "none";

    document.getElementById("editvalue22").readOnly = true;
    document.getElementById("editvalue22").style.border = "none";

    document.getElementById("editvalue23").readOnly = true;
    document.getElementById("editvalue23").style.border = "none";

    document.getElementById("editvalue24").readOnly = true;
    document.getElementById("editvalue24").style.border = "none";

    document.getElementById("editvalue25").readOnly = true;
    document.getElementById("editvalue25").style.border = "none";

    document.getElementById("editvalue26").readOnly = true;
    document.getElementById("editvalue26").style.border = "none";

    document.getElementById("editvalue27").readOnly = true;
    document.getElementById("editvalue27").style.border = "none";

    document.getElementById("editvalue28").readOnly = true;
    document.getElementById("editvalue28").style.border = "none";

    document.getElementById("editvalue29").readOnly = true;
    document.getElementById("editvalue29").style.border = "none";

    document.getElementById("editvalue30").readOnly = true;
    document.getElementById("editvalue30").style.border = "none";

    document.getElementById("editvalue31").readOnly = true;
    document.getElementById("editvalue31").style.border = "none";

    document.getElementById("editvalue32").readOnly = true;
    document.getElementById("editvalue32").style.border = "none";

    document.getElementById("editvalue33").readOnly = true;
    document.getElementById("editvalue33").style.border = "none";

    document.getElementById("editvalue34").readOnly = true;
    document.getElementById("editvalue34").style.border = "none";

    document.getElementById("editvalue35").readOnly = true;
    document.getElementById("editvalue35").style.border = "none";

    document.getElementById("editvalue36").readOnly = true;
    document.getElementById("editvalue36").style.border = "none";

    document.getElementById("Edit-btn").innerText = "Edit Nilai"
  }

}