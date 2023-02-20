<template>
  <div :class="{ wrapper: true, bgfitness: isFitness }" v-if="recipe.recipe">
    <div class="top_part">
      <div class="titlesize">
        <h1 class="titre">{{ recipe.recipe.label }}</h1>
      </div>
        <img :src="recipe.recipe.image"/><br />
    </div>
    <div class="recipe">

      <div class="bottom_part">
        <div :class="{ left_part: true, bgpfitness: isFitness }">
          <div :class="{ ingredients: true, bgpfitness: isFitness }">
            <label for="ingredients" :class="{ bgpfitness: isFitness }"><span>Ingredients</span></label>
            <ul
              name="ingredients"
              v-for="ingredient in recipe.recipe.ingredientLines"
              :class="{ bgpfitness: isFitness }"
            >
              <li>{{ ingredient }}</li>
            </ul>
          </div>
          <p :class="{ cookingtime: true, bgpfitness: isFitness }">Cooking time : {{ recipe.recipe.totalTime }} min</p>
        </div>

        <div :class="{ right_part: true, bgfitness: isFitness }">
          <label for="diet_labels"><span>Diet labels</span></label
          ><br />
          <ul
            name="diet_labels"
            v-for="label in recipe.recipe.dietLabels"
            v-if="recipe.recipe.dietLabels"
          >
            <li>{{ label }}</li>
          </ul>
          <div class="nutients">
            <button
              class="registerButton topButton"
              @click="toggleRegisterClientModal(true)"
            >
              Nutrients
            </button>
          </div>

          <label for="meal_type"><span>Convenient for</span></label>
          <ul name="meal_type" v-for="mealType in recipe.recipe.mealType">
            <li>{{ mealType }}</li>
          </ul>
          <label><span>Total calories</span> (for recipe) :</label>
          <ul><li>{{ parseInt(recipe.recipe.calories) }}</li></ul>

          <label for="cuisine_genre"><span>Culture(s)</span></label>
          <ul name="cuisine_genre" v-for="genre in recipe.recipe.cuisineType">
            <li>{{ genre }}</li>
          </ul>
        </div>
      </div>
    </div>
    <div v-if="openClientRegister == true">
      <NutritionalStatsComponentVue
        @close-client-register="toggleRegisterClientModal(false)"
        :recipe="recipe"
      />
    </div>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<script>
import NutritionalStatsComponentVue from "../components/NutritionalStatsComponent.vue";
export default {
  props: ["recipe"],
  components: {
    NutritionalStatsComponentVue,
  },
  data() {
    return {
      state: "",
      openClientRegister: false,
    };
  },
  created() {
    if (localStorage.getItem("scheme") == "fitness") {
      this.isFitness = true;
    } else {
      this.isFitness = false;
    }
  },
  methods: {
    toggleRegisterClientModal(state) {
      this.openClientRegister = state;
    },
  },
};
</script>

<style scoped>

.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background-color: #404040;
  border-radius: 20px;
  margin: 3%;
  min-height: 900px;
}

.titlesize {
  height: 100px;
}
.titre {
  text-align: center;
  font-weight: 300;
  margin-bottom: 40px;
  color: #ffffff;
}


.recipe {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.top_part {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

img {
  height: 300px;
  width: 300px;
  border-radius: 10px;
  margin: 40px auto 20px auto;
  align-items: center;
}

.bottom_part {
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  background-color: #ffffff;
  margin: 3px;
  padding: 20px;
  border-radius: 0 0 20px 20px;
}

.left_part {
  padding: 5px;
  margin: 5px;
  width: 60%;
  font-family: "poppins", sans-serif;
  font-weight: 300;
}

.ingredients {
    height: 400px;
    overflow-y: scroll;
}
.ingredients label, .ingredients ul {
    color: #404040;
}

.cookingtime {
  font-family: "poppins", sans-serif;
  font-weight: 700;
  text-align: center;
  font-style: italic;
  color: #404040;
}
.right_part {
  padding: 5px;
  margin: 5px 5px 0 5px;
  background-color: #404040;
  border-radius: 10px;
  color: #ffffff;
}

span {
  font-weight: 700;
  margin-bottom: 50px;
}

label {
  margin-bottom: 50px;
}
ul {
  margin-bottom: 30px;
}

.nutients {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 30px 0;
}
.topButton {
  background-color: #ffffff;
  border: none;
  box-shadow: none;
  border-radius: 5px;
  color: #404040;
}

.topButton:hover {
    cursor: pointer;
}

.bgfitness {
  background-color: #2f6a87;
}

.bgpfitness label, .bgpfitness ul, .bgpfitness p {
    color: #2f6a87;
}

@media(max-width: 575.98px){
    .top_part img{
        margin-top:60px;
        height: 220px;
        width: 300px;
        border-radius: 10px;
        align-items: center;
    }


    .bottom_part {
        display: flex;
        flex-direction: row;
        background-color: #ffffff;
        margin: 2px;
        padding: 0px;
        border-radius: 0 0 3px 3px;
    }

    .left_part {
        padding: 3px;
        margin: 3px;
        width: 60%;
        font-family: "poppins", sans-serif;
        font-weight: 300;
    }
    .right_part {
        padding: 2px;
        margin: 2px 2px 0 2px;
        background-color: #404040;
        border-radius: 10px;
        color: #ffffff;
    }


    .titlesize{
        font-size: 12px;
    }

    .bgfitness {
        background-color: #2f6a87;
    }

    .bgpfitness label, .bgpfitness ul, .bgpfitness p {
        color: #2f6a87;
    }
}

</style>

