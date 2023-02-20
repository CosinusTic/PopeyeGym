<script setup>
defineProps({
  clubs: {
    type: Array,
    required: true,
  },
  user_location: {
    type: Array,
    required: true,
  },
});
</script>

<script>
//Tuto : https://dev.to/camptocamp-geo/integrating-an-openlayers-map-in-vue-js-a-step-by-step-guide-2n1p

import View from "ol/View";
import Map from "ol/Map";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { transform } from "ol/proj";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";

// (pour css des boutons)
import "ol/ol.css";

// // points à placer sur la carte
// const clubs = {
//   type: "Feature",
//   //informations du point à afficher
//   properties: {
//     name: "salle de sport super",
//   },
//   geometry: {
//     type: "Point",
//     //coordonnées du point
//     coordinates: [-27.0703125, 43.58039085560784],
//   },
// };

//récupération de la data en provenance du fetch de la vue (clubs)
function transformClubsIntoFeatures(clubs) {
  let features = [];
  for (const club of clubs) {
    const feature = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [club.geometry.location.lng, club.geometry.location.lat],
      },
      properties: {name: club.name, rate: club.rating, address: club.vicinity},
    };
    features.push(feature);
  }
  console.log("features =>", features);
  return {
    type: "FeatureCollection",
    features: features,
  };
}

//récupération de la data en provenance du fetch de la vue (user)
function transformUserIntoFeatures(user_location) {
  let features = [];
  const feature = {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: user_location,
    },
    properties: {},
  };
  features.push(feature);
  return {
    type: "FeatureCollection",
    features: features,
  };
}

export default {
  //watch est réactif aux changements de valeurs de clubs, joue les lignes 63 à 71 en cas de changements
  watch: {
    clubs: function () {
      // feature = objet à placer(properties + geometry)
      const features = new GeoJSON().readFeatures(
        transformClubsIntoFeatures(this.clubs),
        {
          featureProjection: "EPSG:3857",
        }
      );
      console.log("features l95 =>", features);
      this.vectorLayer.getSource().clear();
      this.vectorLayer.getSource().addFeatures(features);
    },
    user_location: function () {
      const map_center = transform(
        this.user_location,
        "EPSG:4326",
        "EPSG:3857"
      );
      this.olMap.getView().setCenter(map_center);

      // feature = objet à placer(properties + geometry)
      const features = new GeoJSON().readFeatures(
        transformUserIntoFeatures(this.user_location),
        {
          featureProjection: "EPSG:3857",
        }
      );
      this.user_vectorLayer.getSource().addFeatures(features);
    },
  },

  mounted() {
    // nouveaux fonds de carte monochrome différents suivants les parcours fitness ou crossfit
    let id = "cldf05hma001f01o94haikgtd";
    if (localStorage.getItem("scheme") == "fitness") {
      id = "cldf033fp001e01o9ymftsm1q";
    }
    const mapbox = new TileLayer({
      source: new XYZ({
        tileSize: [256, 256],
        url:
          "https://api.mapbox.com/styles/v1/adrienvh/" +
          id +
          "/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWRyaWVudmgiLCJhIjoiU2lDV0N5cyJ9.2pFJAwvwZ9eBKKPiOrNWEw",
      }),
      name: "mapbox",
    });

    // layer = calque (ici, celui contenant les points)
    const features = new GeoJSON().readFeatures(
      transformClubsIntoFeatures(this.clubs),
      {
        featureProjection: "EPSG:3857",
      }
    );
    this.vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: features,
      }),
      style: new Style({
        image: new Icon({
          src:
            localStorage.getItem("scheme") == "fitness"
              ? "../../public/pin-light.svg"
              : "../../public/pin-dark.svg",
          width: 20,
        }),
      }),
    });

    // layer = calque contenant la localisation du user
    const user_features = new GeoJSON().readFeatures(
      transformUserIntoFeatures(this.user_location),
      {
        featureProjection: "EPSG:3857",
      }
    );
    this.user_vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: user_features,
      }),
      style: new Style({
        image: new Icon({
          src:
            localStorage.getItem("scheme") == "fitness"
              ? "../../public/pin-user-light.svg"
              : "../../public/pin-user-dark.svg",
          width: 20,
        }),
      }),
    });

    // création de la carte
    this.olMap = new Map({
      // référence de la div contenant la carte
      target: this.$refs["map-root"],
      layers: [
        // calque de fond (continent + océans)
        mapbox,
        // calque contenant la localisation du user
        this.user_vectorLayer,
        // calque contenant les points (l.41)
        this.vectorLayer,
      ],
      // initialisation de la vue de la carte
      view: new View({
        zoom: 14,
        center: transform(this.user_location, "EPSG:4326", "EPSG:3857"),
        constrainResolution: true,
      }),
    });

    // fonction au survol du point
    this.olMap.on("pointermove", (event) => {
      // récupère les informations du point
      const hovered = this.olMap.forEachFeatureAtPixel(
        event.pixel,
        (feature) => feature
      );
      // emet un événement "select"
      if (hovered && hovered.get("name") != undefined) {
        this.$emit("select", hovered);
      } else {
        this.$emit("select", null);
      }
    });

    this.olMap.on("singleclick", (event) => {
      // récupère les informations du point
      const hovered = this.olMap.forEachFeatureAtPixel(
        event.pixel,
        (feature) => feature
      );
      // emet un événement "select"
      if (hovered && hovered.get("name") != undefined) {
        this.$emit("select", hovered);
      } else {
        this.$emit("select", null);
      }
    });
  },
};
</script>

<template>
  <div ref="map-root" id="map-root"></div>
</template>

<style scoped>
#map-root {
  width: 700px;
  height: 700px;

}
/* Media queries phone *******************************************************************A FINIR****************************************************/
@media (min-width: 320px) and (max-width: 480px) {
  #map-root {
    width: 350px;
    height: 350px;
  }
}

</style>