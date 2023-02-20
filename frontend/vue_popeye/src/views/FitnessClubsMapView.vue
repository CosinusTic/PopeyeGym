<script setup>
import MainHeaderComponent from "../components/MainHeaderComponent.vue";
import MapContainer from "../components/MapContainer.vue";
import InspectComponent from "../components/InspectComponent.vue";
</script>

<script>
export default {
  data() {
    return {
      selected: undefined,
      clubs: [],
      user_location: [0, 0],
    };
  },
  methods: {
    checkUserType() {
      const userType = localStorage.getItem("userType");
      const token = localStorage.getItem('token');

      if (userType == "customer") {
        return
      }
      else if (userType == "coach") {
        this.$router.push('/');
        this.$toast.error('Access forbidden');
      }
      else if (!token) {
        this.$router.push('/');
        this.$toast.error('User not logged in');
      }
    }
  },
  created() {
    // requête de récupération des données de l'utilisateur connecté
    fetch(
      `http://localhost:3002/findUserWithToken/${localStorage.getItem("token")}`
    )
      .then((response) => response.json())
      .then((data) => {
        this.user_location = data.user[0].location.coordinates;
        // requête de récupération des données des salles de sport
        fetch(
          `http://localhost:3002/findNearestFitnessClubs/${this.user_location[1]}/${this.user_location[0]}`
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            this.clubs = data;
          });
      });
      this.checkUserType();
  },
};
</script>

<template>
  <main class="main">
    <MainHeaderComponent />
    <div class="containers">
      <div class="map">
        <InspectComponent :featureToDisplay="selected" />
        <MapContainer
          @select="selected = $event"
          :clubs="clubs"
          :user_location="user_location"
        />
      </div>
    </div>
    <!-- <Footer /> -->
  </main>
</template>

<style scoped>
.map {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin: 50px 0;
}

/* Media queries phone *******************************************************************A FINIR****************************************************/
@media (min-width: 320px) and (max-width: 480px) {
  .main {
  }
  .map {
    display: flex;
    flex-direction: column-reverse;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
  }
}
</style>
