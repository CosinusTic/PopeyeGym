<template>
    <MainHeader />
  <h1 class="titre">RECIPES</h1>
  <select
    name="toggleDisplay"
    :class="{ filterchoice: true, bfitness: isFitness }"
    v-on:change="toggleFiltersDisplay"
  >
    <option value="">Choose your filter</option>
    <option value="searchbar">Searchbar</option>
    <option value="filters">Filters</option>
  </select>
  <div :class="{ filters: true, bgfitness: isFitness }" v-if="toggleFilters == true">
    <div class="calories ranges">
      <label for="min">Min cal: {{ minCaloriesInput }}</label>
      <input
        type="range"
        name="min"
        min="50"
        max="1200"
        v-model="minCaloriesInput"
        class="range"
        :placeholder="placeholders.minCalories"
      />
      <label for="max">Max cal: {{ maxCaloriesInput }}</label>
      <input
        type="range"
        name="min"
        min="50"
        max="1200"
        class="range"
        v-model="maxCaloriesInput"
        :placeholder="placeholders.maxCalories"
      />
    </div>
    <div class="cooking time ranges">
      <label for="minDuration">Min cooking time : {{ minDurationInput }}</label>
      <input
        type="range"
        name="min"
        min="50"
        max="1200"
        v-model="minDurationInput"
        :placeholder="placeholders.minCalories"
      />
      <label for="maxDuration">Max cooking time : {{ maxDurationInput }}</label>
      <input
        type="range"
        name="min"
        min="50"
        max="1200"
        v-model="maxDurationInput"
        :placeholder="placeholders.maxCalories"
      />
    </div>

    <FilterComponent
      @chosen_filter="getMealTypeFilter"
      :filters="mealTypes"
      :placeholder="placeholders.mealType"
    />
    <FilterComponent
      @chosen_filter="getCuisineTypes"
      :filters="cuisineTypes"
      :placeholder="placeholders.cuisineType"
    />

    <!-- Diet filters -->
    <FilterComponent
      v-if="this.scheme == 'fitness'"
      @chosen_filter="getFitnessFilter"
      :filters="dietFilters"
      :placeholder="placeholders.dietFilter"
    />

    <!-- Body building filters -->
    <FilterComponent
      v-if="this.scheme == 'crossfit'"
      @chosen_filter="getDietFilter"
      :filters="fitnessFilters"
      :placeholder="placeholders.fitnessFilter"
    />

    <button
      :class="{ submitbutton: true, submitbtfit: isFitness }"
      v-on:click="
        gatherFilters();
        filterRecipes();
      "
    >
      Apply filters
    </button>
  </div>

  <div :class="{ searchbar: true, bgfitness: isFitness }" v-if="toggleSearchBar == true">
    <input type="search" v-model="searchInput" />
    <button :class="{ submitbt: true, submitbtfit: isFitness }" v-on:click="searchRecipes()">Search</button>
  </div>
  <div v-if="this.recipes" class="components">
    <div v-for="recipe in this.recipes" :key="recipe" class="singleRecipe">
      <RecipeComponent :recipe="recipe" />
    </div>
  </div>
  <div>
    <p>loading...</p>
  </div>
</template>

<script>
import RecipeComponent from "../components/RecipeComponent.vue";
import MainHeader from "../components/MainHeaderComponent.vue";
import FilterComponent from "../components/FilterComponent.vue";

export default {
  components: {
    MainHeader,
    RecipeComponent,
    FilterComponent,
  },
  data() {
    return {
      recipes: [],
      searchInput: undefined,
      filters: {},
      fitnessFilters: ["balanced", "high-fiber", "high-protein"],
      dietFilters: ["balanced", "low-carb", "low-sodium", "low-fat"],
      minCalories: ["100", "300", "500", "700", "900", "1100"],
      placeholders: {
        minCalories: "minimum calories",
        maxCalories: "max calories",
        mealType: "meal type",
        dietFilter: "diet",
        fitnessFilter: "diet",
        cuisineType: "cuisine type",
      },
      maxCalories: ["300", "500", "700", "900", "1100", "1300", "1500"],
      mealTypes: ["breakfast", "brunch", "lunch/dinner", "snack", "teatime"],
      cuisineTypes: [
        "american",
        "asian",
        "british",
        "caribbean",
        "central europe",
        "chinese",
        "eastern europe",
        "french",
        "greek",
        "indian",
        "italian",
        "japanese",
        "corean",
        "kosher",
        "mediterranean",
        "mexican",
        "middle eastern",
        "nordic",
        "south american",
        "south east asian",
        "world",
      ],
      scheme: undefined,
      filtersToDisplay: [],
      filtersAmt: 0,
      minCaloriesInput: "500",
      maxCaloriesInput: "1000",
      minDurationInput: "0",
      maxDurationInput: "1000",
      toggleFilters: false,
      toggleSearchBar: false,
    };
  },
  methods: {
    async getDefaultRecipes() {
      await fetch("http://localhost:3001/recipes/default")
        .then((response) => response.json())
        .then((response) => (this.recipes = response.hits));
    },
    async searchRecipes() {
      console.log(this.searchInput);
      await fetch("http://localhost:3001/recipes/search/" + this.searchInput)
        .then((response) => response.json())
        .then(async (response) => {
          this.recipes = response.hits;
          this.recipes = this.recipes.slice(0, 3);
        });
    },
    async filterRecipes() {
      let body = {};
      if (this.filters.calories) {
        body = { ...body, calories: this.filters.calories };
      }
      if (this.filters.time) {
        body = { ...body, time: this.filters.time };
      }
      if (this.filters.mealType) {
        body = { ...body, mealType: this.filters.mealType };
      }
      if (this.filters.cuisineType) {
        body = { ...body, cuisineType: this.filters.cuisineType };
      }
      if (this.filters.diet) {
        body = { ...body, diet: this.filters.diet };
      }
      const requestOptions = {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      };
      await fetch("http://localhost:3001/recipes/filters", requestOptions)
        .then((response) => response.json())
        .then(async (response) => {
          console.log({ response: response, response_url: response.url });
          this.recipes = await response.response.hits;
          this.recipes = this.recipes.slice(0, 3);
        });
    },
    getScheme() {
      this.scheme = localStorage.getItem("scheme");
    },
    gatherFilters() {
      if (
        parseInt(this.minCaloriesInput) >= parseInt(this.maxCaloriesInput) ||
        parseInt(this.minDurationInput) >= parseInt(this.maxDurationInput)
      ) {
        alert("please choose acceptable ranges (min < max)");
      } else {
        let calories = this.minCaloriesInput + "-" + this.maxCaloriesInput;
        this.filters["calories"] = calories;

        let durations = this.minDurationInput + "-" + this.maxDurationInput;
        this.filters["time"] = durations;
        console.log("filters: ", this.filters);
      }
    },
    getFitnessFilter(event) {
      // console.log(event)
      this.filters["fitness"] = event;
    },
    getDietFilter(event) {
      // console.log(event);
      this.filters["diet"] = event;
    },
    getMealTypeFilter(event) {
      // console.log(event);
      this.filters["mealType"] = event;
    },
    getCuisineTypes(event) {
      // console.log(event);
      this.filters["cuisineType"] = event;
    },
    toggleFiltersDisplay(event) {
      if (event.target.value == "filters") {
        this.toggleFilters = true;
        this.toggleSearchBar = false;
      } else if (event.target.value == "searchbar") {
        this.toggleFilters = false;
        this.toggleSearchBar = true;
      }
    },
    checkUserType(){
      const userType = localStorage.getItem("userType");

      if(userType == "customer"){
        return
      }
      else if(userType == "coach"){
        this.$router.push('/');
        this.$toast.error('Access forbidden');
      }
    }
    
  },
  created() {
    this.getDefaultRecipes();
    if (localStorage.getItem("scheme") == "fitness") {
      this.isFitness = true;
    } else {
      this.isFitness = false;
    }
  },
  mounted() {
    this.getScheme();
    this.checkUserType();
    if (this.scheme == "fitness") {
      console.log("scheme is fitness");
    } else if (this.scheme == "hard_work") {
      console.log("scheme is work hard");
    }
  },
};
</script>

<style scoped>
* {
  font-family: "poppins", sans-serif;
}


.filterchoice {
  background-color: #e73725;
  margin-left: 50px;
  height: 30px;
  border: none;
  color: #ffffff;
}

.bfitness {
  background-color: #ea6c36;
}

.searchbar {
  height: 120px;
  width: 96%;
  margin: 50px auto;
  background-color: #404040;
  padding-left: 40px;
  border-radius: 20px;
  padding-top: 60px;
}

.submitbt {
  margin-left: 20px;
  background-color: #e73725;
  border: none;
  color: #ffffff;
  height: 40px;
  border-radius: 10px;
}

.submitbt:hover {
  cursor: pointer;
}

.filters {
  height: 120px;
  width: 96%;
  margin: 50px auto;
  background-color: #404040;
  padding-left: 40px;
  border-radius: 20px;
  padding-top: 60px;
  color: #ffffff;
  display: flex;
  flex-direction: row;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-start;
}

.components {
  display: grid;
  grid-template-columns: repeat(3, 33%);
}

.ranges {
  display: flex;
  flex-direction: column;
  margin-right: 50px;
}

input[type="range"] {
  -webkit-appearance: none;
}

input[type="range"]::-webkit-slider-runnable-track {
  width: 300px;
  height: 5px;
  background: rgba(255, 255, 255, 1);
  border: none;
  border-radius: 3px;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  border: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 1);
  margin-top: -4px;
}

input[type="range"]:focus {
  outline: none;
}

input[type="range"]:focus::-webkit-slider-runnable-track {
  background: rgba(255, 255, 255, 1);
}

.titre {
  text-align: center;
  margin-bottom: 50px;
  font-weight: 300;
  color: #404040;
  font-size: 26px;
}

.submitbutton {
  border: none;
  background-color: #e73725;
  color: #ffffff;
  width: 90px;
  height: 40px;
  border-radius: 10px;
}

.submitbutton:hover {
  cursor: pointer;
}

.bgfitness {
  background-color: #2f6a87;
}

.submitbtfit {
  background-color: #ea6c36;
}

@media(max-width: 575.98px){
  .components {
    display: grid;
    grid-template-columns: repeat(1, 90%);
  }

  .filters {
    height: 400px;
    width: 50%;
    margin: 50px auto;
    background-color: #404040;
    padding-left: 40px;
    border-radius: 20px;
    padding-top: 60px;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: flex-start;
  }

  .searchbar {
    height: 100px;
    width: 50%;
    margin: 50px auto;
    background-color: #404040;
    padding-left: 40px;
    border-radius: 20px;
    padding-top: 60px;
  }

  .filterchoice {
  background-color: #e73725;
  margin-left: 15px;
  margin-bottom: 15px;
  height: 30px;
  border: none;
  color: #ffffff;
  border-radius: 5%;
  }

  .singleRecipe{
    margin-left: 20px;
  }

  .submitbt {
    margin-left: 0px;
    margin-top:5px;
    margin-left:5px;

    background-color: #e73725;
    border: none;
    color: #ffffff;
    height: 40px;
    border-radius: 10px;
  }

  .searchbar input{
    width: 100px;
  }
  .bfitness {
    background-color: #ea6c36;
  }

  .bgfitness {
    background-color: #2f6a87;
  }

  .submitbtfit {
    background-color: #ea6c36;
  }
  
}
</style>
