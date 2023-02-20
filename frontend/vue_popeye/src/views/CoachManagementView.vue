<script setup>
import ModalUpdateCoach from "../components/ModalUpdateCoach.vue";
import ModalCreateCoach from "../components/ModalCreateCoach.vue";
import MainHeaderComponent from "../components/MainHeaderComponent.vue";
</script>

<script>
export default {
  data() {
    return {
      coaches: [],
      token: localStorage.getItem("token"),
      user_infos: {},
      averageToDisplay: undefined,
      refresh: false,
    };
  },
  created() {
    if (localStorage.getItem("scheme") == "fitness") {
      this.isFitness = true;
    } else {
      this.isFitness = false;
    }
    if (this.token) {
      // request to GET the connected user
      fetch("http://localhost:3002/findUserWithToken/" + this.token)
        .then(function (res) {
          if (res.ok) {
            return res.json();
          }
        })
        .then((data) => {
          this.user_infos = data.user[0].status;
          if (this.user_infos == 0) {
            this.$router.push("/");
          }
        });
    } else {
      this.$router.push("/");
    }
    {
      // request to GET all the coaches
      fetch("http://localhost:3002/findAllCoaches")
        .then(function (res) {
          if (res.ok) {
            return res.json();
          }
        })
        .then((data) => {
          this.coaches = data;
        });
    }
  },
  methods: {
    async refreshCoach(state, updatedCoach) {
      {
        if (state === true) {
          const coachToupdateIndex = this.coaches.findIndex(
            (coach) => coach._id === updatedCoach._id
          );
          this.coaches[coachToupdateIndex] = updatedCoach;
        }
      }
    },
    async deleteCoach(id) {
      let confirm = window.confirm(
        "Are you sure you want to delete this coach?"
      );
      if (confirm === false) {
        return;
      } else {
        await fetch("http://localhost:3002/deleteCoach/" + id, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => {
          console.log(res);
          this.coaches = this.coaches.filter((coach) => coach._id != id);
        });
      }
    },
    returnAverage(coach) {
      let rates = [];
      let count = 0;
      let total = 0;
      let avg = 0;
      for (let i = 0; i < coach.rate.length; i++) {
        rates.push(coach.rate[i].rate);
      }

      for (let i = 0; i < rates.length; i++) {
        total += parseInt(rates[i]);
        count++;
      }
      avg = total / count;
      if (avg) {
        return parseInt(avg);
      } else {
        return "No grade";
      }
    },
  },
};
</script>

<template>
  <main>
    <MainHeaderComponent />
    <h1 class="titre">Coaches Management</h1>
    <ModalCreateCoach />
    <table>
      <thead>
        <tr class="intitules">
          <th>Photo</th>
          <th>Name</th>
          <th>Email</th>
          <th class="description">Description</th>
          <th>Nature</th>
          <th>Rate</th>
          <th>Busy</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="coach in coaches" :key="coach._id">
          <td><img class="profilepic" :src="coach.photo" /></td>
          <td>{{ coach.name }}</td>
          <td>{{ coach.email }}</td>
          <td>{{ coach.description }}</td>
          <td>{{ coach.nature }}</td>
          <td>{{ returnAverage(coach) }}</td>
          <td>
            <div class="busytd">
              <p v-for="(busy, index) in coach.busy" v-bind:key="index">
                {{ busy.date }}
              </p>
            </div>
          </td>
          <td>{{ coach.status }}</td>
          <td>
            <ModalUpdateCoach
              :id="coach._id"
              :coach="coach"
              @close="refreshCoach"
            />
            <button
              :class="{ boutoncolor: true, bgbtfitness: isFitness }"
              v-on:click="deleteCoach(coach._id)"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<style scoped>
main {
  font-family: "poppins", sans-serif;
  min-height: 100vh;
}

.profilepic {
  width: 100px;
}

h1 {
  color: #404040;
}

table {
  border-collapse: collapse;
  width: 95%;
  margin: 50px;
}

th,
td {
  font-family: "poppins", sans-serif;
  font-weight: 300;
  padding: 8px;
  text-align: center;
  border-bottom: 1px solid #ddd;
  height: 40px;
}

.description {
  width: 500px;
  text-align: left;
  padding-right: 5px;
}

.center {
  text-align: center;
}

.intitules {
  height: 100px;
}

tr {
  height: 180px;
}

.busytd {
  height: 100%;
  overflow-y: scroll;
}

tr:nth-child(even) {
  background-color: #dddddd;
}

.boutoncolor {
  background-color: #e73725;
  margin-left: 10px;
  margin-top: 10px;
  height: 30px;
  width: 60px;
  border: none;
  border-radius: 10px;
  color: #ffffff;
}

td .bgbtfitness {
  background-color: #ea6c36;
}

.boutoncolor:hover {
  opacity: 0.7;
  cursor: pointer;
}

.titre {
  font-family: "poppins", sans-serif;
  font-weight: 300;
  text-align: center;
  margin-bottom: 20px;
}
</style>
