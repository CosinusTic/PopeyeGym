<script>
import Feature from "ol/Feature";
export default {
  name: "InspectComponent",
  props: {
    // props feature de type feature
    featureToDisplay: Feature,
  },
  created() {
    if (localStorage.getItem("scheme") == "fitness") {
      this.isFitness = true;
    } else {
      this.isFitness = false;
    }
  },
};
</script>

<template>
  <div
    v-if="featureToDisplay != undefined"
    :class="{ infos: true, bgfitness: isFitness }"
  >
    <div class="description">
      <h4>{{ featureToDisplay.get("name") }}</h4>
      <h5>address :</h5>
      <p>{{ featureToDisplay.get("address") }}</p>
      <h5>rate :</h5>
      <p>{{ featureToDisplay.get("rate") }}/5</p>
    </div>
  </div>
  <div v-else :class="{ infos: true, bgfitness: isFitness }">
    <div class="choice">
      <h4 class="titledesktop">Hover a fitness club</h4>
      <h4 class="titlephone">Touch a fitness club</h4>
    </div>
  </div>
</template>

<style scoped>
.infos {
  background-color: #404040;
  border-radius: 20px;
  width: 400px;
  height: 300px;
  margin: auto 0;
  padding: 20px;
  color: #ffffff;
  font-family: "Poppins", sans-serif;
  font-weight: 300;
  font-size: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.bgfitness {
  background-color: #2f6a87;
}
.description {
  display: flex;
  flex-direction: column;
}

.description h4 {
  margin: 0;
  margin-bottom: 30px;
  font-family: "Poppins", sans-serif;
  font-weight: 400;
  font-size: 22px;
}

.choice h4 {
  margin: 0;
  font-family: "Poppins", sans-serif;
  font-weight: 400;
  font-size: 22px;
}

.description h5 {
  margin: 0;
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  font-size: 22px;
}

.description p {
  font-family: "Poppins", sans-serif;
  font-weight: 300;
  font-size: 16px;
  color: #ffffff;
}

.titledesktop {
  display: block;
}
.titlephone {
  display: none;
}

/* Media queries phone */
@media (min-width: 320px) and (max-width: 480px) {
  .infos {
    width: 300px;
    height: 200px;
    font-size: 24px;
    display: flex;
    margin-top: 20px;
  }

  .description h4 {
    font-size: 18px;
    margin-bottom: 10px;
  }
  .description h5 {
    font-size: 14px;
    margin-bottom: 5px;
  }
  .titledesktop {
    display: none;
  }
  .titlephone {
    display: block;
  }
}
</style>
