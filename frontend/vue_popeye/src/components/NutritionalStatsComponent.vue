<template>
  <div :class="{ modale: true, bfitness: isFitness }">
    <div class="close">
      <button class="closeButton" @click="close()">X</button>
    </div>
    <label for="labels">Nutrients</label>
    <ul v-for="nutrient in recipe.recipe.totalNutrients" :key="nutrient">
      <li>
        {{ nutrient.label }} : {{ parseInt(nutrient.quantity) }} {{ nutrient.unit }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ["recipe"],
  data() {
    return {};
  },
  created() {
    if (localStorage.getItem("scheme") == "fitness") {
      this.isFitness = true;
    } else {
      this.isFitness = false;
    }
  },
  methods: {
    close() {
      this.$emit("close-client-register");
    },
  },
};
</script>

<style scoped>
.modale {
  position: fixed;
  z-index: 9999;
  top: 20%;
  height: 40%;
  left: 48%;
  width: 20%;
  margin-left: -150px;
  display: block;
  background-color: #e73725;
  padding: 3%;
  color: white;
  font-size: 16px;
  font-family: "Play", sans-serif;
  overflow-y: scroll;
}
.bfitness {
  background-color: #ea6c36;
}

@media(max-width: 575.98px){
  .modale {
    position: fixed;
    z-index: 9999;
    top: 20%;
    height: 40%;
    left: 56%;
    width: 60%;
    margin-left: -150px;
    display: block;
    background-color: #e73725;
    padding: 3%;
    color: white;
    font-size: 16px;
    font-family: "Play", sans-serif;
    overflow-y: scroll;
  }
  .bfitness {
    background-color: #ea6c36;
  }
}

/****************************************************************************ne fonctionne pas *************/

label {
  font-family: "poppins", sans-serif;
  font-weight: 700;
  text-align: center;
  font-style: italic;
}
.close {
  display: flex;
  flex-direction: row;
  justify-content: end;
}
.closeButton {
  background: none;
  border: none;
  color: #e7e7e7;
  width: 40px;
}

.closeButton:hover {
  cursor: pointer;
}
</style>
