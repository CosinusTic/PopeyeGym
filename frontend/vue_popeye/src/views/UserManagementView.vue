<script setup>
// import ProfileUser from "../components/ProfileUser.vue";
import ModalUpdateUser from "../components/ModalUpdateUser.vue";
import ModalCreateUser from "../components/ModalCreateUser.vue";
import MainHeaderComponent from "../components/MainHeaderComponent.vue";
</script>

<script>
export default {
  data() {
    return {
      users: [],
      token: localStorage.getItem("token"),
      user_infos: {},
      refresh: false,
    };
  },
  created() {
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
      // request to GET all the users
      fetch("http://localhost:3002/findAllUsers")
        .then(function (res) {
          if (res.ok) {
            return res.json();
          }
        })
        .then((data) => {
          this.users = data;
        });
    }
    if (localStorage.getItem("scheme") == "fitness") {
      this.isFitness = true;
    } else {
      this.isFitness = false;
    }
  },
  methods: {
    async refreshData(state, updatedUser) {
      if (state === true) {
        const userToupdateIndex = this.users.findIndex(
          (user) => user._id === updatedUser._id
        );
        this.users[userToupdateIndex] = updatedUser;
      }
    },
    async deleteUser(id) {
      let confirm = window.confirm(
        "Are you sure you want to delete this user?"
      );
      if (confirm === false) {
        return;
      } else {
        await fetch("http://localhost:3002/deleteUser/" + id, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => {
          console.log(res);
          this.users = this.users.filter((user) => user._id != id);
        });
      }
    },
  },
};
</script>

<template>
  <main>
    <MainHeaderComponent />
    <h1 class="titre">Users Management</h1>
    <ModalCreateUser />
    <table>
      <tr>
        <th>Name</th>
        <th>Address</th>
        <th>Email</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
      <tr v-for="user in users" :key="user._id">
        <td>{{ user.name }}</td>
        <td>{{ user.address }}</td>
        <td>{{ user.email }}</td>
        <td>{{ user.status }}</td>
        <!-- onclick edit ou delete passer (user._id) en parametre de la function -->
        <td>
          <ModalUpdateUser
            :id="user._id"
            :token="user.token"
            :user="user"
            @close="refreshData"
          />

          <button
            :class="{ boutoncolor: true, bgbtfitness: isFitness }"
            v-on:click="deleteUser(user._id)"
          >
            Delete
          </button>
        </td>
      </tr>
    </table>
  </main>
</template>

<style scoped>
main {
  font-family: "poppins", sans-serif;
  min-height: 100vh;
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
  text-align: left;
  border-bottom: 1px solid #ddd;
  height: 40px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}

.boutoncolor {
  background-color: #e73725;
  margin-left: 10px;
  height: 30px;
  width: 60px;
  border: none;
  border-radius: 10px;
  color: #ffffff;
}

.boutoncolor:hover {
  opacity: 0.7;
  cursor: pointer;
}

td .bgbtfitness {
  background-color: #ea6c36;
}

.titre {
  font-family: "poppins", sans-serif;
  font-weight: 300;
  text-align: center;
  margin-bottom: 20px;
}
</style>
