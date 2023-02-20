<template>
  <div :class="{ popeye: true, bgfitness: isFitness }" v-if="user">
    <div class="title">
      <img class="popeye_img" src="../../public/new-popeye-white.svg" />
      <p v-if="windowSize.height > 700 && windowSize.width > 1000">
        Hello {{ user.name }}
      </p>
    </div>
    <div
      class="buttons"
      v-if="windowSize.height > 700 && windowSize.width > 1000"
    >
      <button
        :class="{ bgbtfitness: isFitness }"
        v-if="
          this.$route.name != 'coach_profile' &&
          this.$route.name != 'userProfile'
        "
        v-on:click="redirectProfile()"
      >
        Profile
      </button>
      <button
        :class="{ bgbtfitness: isFitness }"
        v-if="coach_login == false && this.$route.name != 'all_coaches'"
        v-on:click="redirectCoaches()"
      >
        Coaches
      </button>
      <button
        :class="{ bgbtfitness: isFitness }"
        v-if="coach_login == false && this.$route.name != 'clubs_map'"
        v-on:click="redirectLocations()"
      >
        Gyms
      </button>
      <button
        :class="{ bgbtfitness: isFitness }"
        v-if="coach_login == false && this.$route.name != 'recipes'"
        v-on:click="redirectRecipes()"
      >
        Recipes
      </button>
      <button
        :class="{ bgbtfitness: isFitness }"
        v-if="user.status == 1 && this.$route.name != 'admin_dashboard'"
        v-on:click="redirectDashboard()"
      >
        Dashboard
      </button>
      <button
        :class="{ bgbtfitness: isFitness }"
        v-if="coach_login == false"
        v-on:click="redirectSchemes()"
      >
        Programs
      </button>
      <button :class="{ bgbtfitness: isFitness }" v-on:click="logout()">
        Logout
      </button>
    </div>
    <div class="buttonsPhone" v-else>
      <div id="mySidenav" class="sidenav buttons" v-if="openMenu">
        <a class="closeBurger" v-on:click="toggleNavBar()">X</a>
        <div class="burgerButtons">
          <button
            :class="{ burgerButton: true, bgbtfitness: isFitness }"
            v-if="
              this.$route.name != 'coach_profile' &&
              this.$route.name != 'userProfile'
            "
            v-on:click="redirectProfile()"
          >
            Profile
          </button>
          <button
            :class="{ burgerButton: true, bgbtfitness: isFitness }"
            v-if="coach_login == false && this.$route.name != 'all_coaches'"
            v-on:click="redirectCoaches()"
          >
            Coaches
          </button>
          <button
            :class="{ burgerButton: true, bgbtfitness: isFitness }"
            v-if="coach_login == false && this.$route.name != 'clubs_map'"
            v-on:click="redirectLocations()"
          >
            Gyms
          </button>
          <button
            :class="{ burgerButton: true, bgbtfitness: isFitness }"
            v-if="coach_login == false && this.$route.name != 'recipes'"
            v-on:click="redirectRecipes()"
          >
            Recipes
          </button>
          <button
            :class="{ burgerButton: true, bgbtfitness: isFitness }"
            v-if="user.status == 1 && this.$route.name != 'admin_dashboard'"
            v-on:click="redirectDashboard()"
          >
            Dashboard
          </button>
          <button
            :class="{ burgerButton: true, bgbtfitness: isFitness }"
            v-if="coach_login == false"
            v-on:click="redirectSchemes()"
          >
            Programs
          </button>
          <button
            :class="{ burgerButton: true, bgbtfitness: isFitness }"
            v-on:click="logout()"
          >
            Logout
          </button>
        </div>
      </div>

      <a v-if="!openMenu" href="#" id="openBtn" v-on:click="toggleNavBar()">
        <div :class="{ 'burger-icon': true }">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: undefined,
      coach_login: false,
      windowSize: { height: window.innerHeight, width: window.innerWidth },
      openMenu: false,
    };
  },
  methods: {
    async getUser() {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:3002/getUserType/" + token)
        .then((response) => response.json())
        .then(async (response) => {
          if (response.coach) {
            this.user = response.coach;
            this.coach_login = true;
          } else if (response.user) {
            this.user = response.user;
          }
        });
    },
    redirectDashboard() {
      this.$router.push("/admindashboard");
    },
    redirectRecipes() {
      this.$router.push("/recipes");
    },
    redirectProfile() {
      if (this.user.busy != undefined) {
        this.$router.push("/mycoachprofile");
      } else if (this.user.location != undefined) {
        this.$router.push("/userProfile");
      }
    },
    logout() {
      localStorage.clear();
      this.$router.push("/");
      this.$toast.info("See you soon " + this.user.name + "!");
    },
    redirectSchemes() {
      this.$router.push("/schemes");
    },
    redirectCoaches() {
      this.$router.push("/allcoaches");
    },
    redirectLocations() {
      this.$router.push("/clubsmap");
    },
    toggleNavBar() {
      if (this.openMenu == false) {
        this.openMenu = true;
      } else if (this.openMenu == true) {
        this.openMenu = false;
      }
    },
  },
  async created() {
    if (localStorage.getItem("scheme") == "fitness") {
      this.isFitness = true;
    } else {
      this.isFitness = false;
    }
    await this.getUser();
    console.log("current window size: ", this.windowSize);
    this.windowSize.height = window.innerHeight;
    this.windowSize.width = window.innerWidth;
  },
};
</script>

<style scoped>
.sidenav {
  background-color: #ffffff;
  border-radius: 5%;
  border: 1px solid black;
}

.buttonsPhone {
  z-index: 10;
}

.burgerButtons {
  display: flex;
  flex-direction: column;
}

.burgerButtons .burgerButton {
  margin: 10px;
  height: 40px;
  width: 100px;
}

.closeBurger {
  margin-left: 10px;
  margin-top: 10px;
}

/* Icône burger */
.burger-icon span {
  display: flex;
  width: 50px;
  height: 10px;
  background-color: #ffffff;
  margin-right: 20px;
  margin-top: 10px;
}

.burger-icon {
  padding-right: 20px;
  padding-top: 20px;
}
.popeye {
  height: 120px;
  padding: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: #404040;
}
.title {
  display: flex;
  flex-direction: row;
}
.bgfitness {
  background-color: #2f6a87;
}

.popeye_img {
  width: 200px;
}

.popeye p {
  color: #ffffff;
  font-family: "Poppins", sans-serif;
  font-weight: 300;
  font-size: 30px;
  cursor: default;
}

.buttons {
  display: flex;
  flex-direction: row;
}

.buttons button {
  border-width: 0ch;
  height: 50px;
  width: 100px;
  border-radius: 20px;
  background-color: #e73725;
  margin: auto 10px;
  color: #ffffff;
  font-family: "Poppins", sans-serif;
  font-size: 16px;
  cursor: pointer;
}
.buttons .bgbtfitness {
  background-color: #ea6c36;
}

.buttons button:hover {
  opacity: 70%;
}
</style>
