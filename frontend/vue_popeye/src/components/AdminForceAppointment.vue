<script>
// import FilterComponent from "./FilterComponent.vue";
export default {
  // components: {
  //   FilterComponent,
  // },
  data() {
    return {
      date: undefined,
      open: true,
      error: undefined,
      user: undefined,
      isFitness: false,
      users: undefined,
      coaches: undefined,
      usersOptions: [],
      coachOptions: [],
      userInput: undefined,
      coachInput: undefined,
      coachesTool: [],
      usersTool: [],
      finalBody: {},
      appointments: [],
    };
  },
  methods: {
    close() {
      this.$emit("close-force-appointment");
    },
    async getUsers() {
      await fetch("http://localhost:3002/findAllUsers")
        .then((response) => response.json())
        .then((response) => {
          this.users = response;
          console.log("all users: ", response);
          for (let i = 0; i < response.length; i++) {
            this.usersOptions.push({
              name: response[i].name,
              email: response[i].email,
              _id: response[i]._id,
            });
            this.usersTool.push({
              _id: response[i]._id,
              name: response[i].name,
              email: response[i].email,
            });
          }
          console.log(response);
        });
    },
    async getCoaches() {
      await fetch("http://localhost:3002/findAllCoaches")
        .then((response) => response.json())
        .then((response) => {
          this.coaches = response;
          console.log("all coaches: ", response);
          for (let i = 0; i < response.length; i++) {
            this.coachOptions.push({
              name: response[i].name,
              email: response[i].email,
              _id: response[i]._id,
            });
            this.coachesTool.push({
              _id: response[i]._id,
              name: response[i].name,
              email: response[i].email,
            });
          }
        });
    },
    getUsersOptions(event) {
      this.finalBody["user"] = event.target.value;
      console.log(event.target.value);
    },
    getCoachesOptions(event) {
      this.finalBody["coach"] = event.target.value;
      console.log(event.target.value);
    },
    async bookAppointment() {
      // console.log(this.finalBody);
      if (this.date && this.finalBody.coach && this.finalBody.user) {
        const options = {
          method: "POST",
          body: JSON.stringify({
            date: this.date,
            id_coach: this.finalBody.coach,
            id_user: this.finalBody.user,
          }),
          headers: { "Content-Type": "application/json" },
        };
        console.log(options);
        await fetch("http://localhost:3002/addAppointment", options)
          .then((response) => response.json())
          .then((response) => {
            console.log("this is =>", response);
            if (response.error) {
              this.$toast.error(response.error);
            } else {
              const selectedUser = this.usersOptions.find(
                (user) => user._id === this.finalBody.user
              );
              const selectedCoach = this.coachOptions.find(
                (coach) => coach._id === this.finalBody.coach
              );
              const data = {
                _id: response._id,
                user: {
                  name: selectedUser.name,
                  id: this.finalBody.user,
                  email: selectedUser.email,
                },
                coach: {
                  name: selectedCoach.name,
                  id: this.finalBody.coach,
                  email: selectedCoach.email,
                },
                date: this.date,
              };
              this.$emit("force-appointment", data);
              this.$toast.success("Appointment booked on the " + this.date);
            }
          });
      } else {
        this.$toast.error("error");
      }
    },
  },
  async created() {
    if (localStorage.getItem("scheme") == "crossfit") {
      this.isFitness = false;
    } else {
      this.isFitness = true;
    }

    await this.getUsers();
    await this.getCoaches();
  },
};
</script>

<template>
  <div v-if="this.open == true">
    <div :class="{ modal_crossfit: true, modal_fitness: isFitness }">
      <div class="coachInput">
        <label for="userInput">Choose user</label><br />
        <select name="userInput" v-on:change="getUsersOptions">
          <option>Select a user</option>
          <option
            v-for="option in usersOptions"
            :value="option._id"
            :key="option"
          >
            {{ option.name }}, {{ option.email }}
          </option>
        </select>
      </div>
      <div class="coachInput">
        <label for="coachInput">Choose coach</label><br />
        <select name="coachInput" v-on:change="getCoachesOptions">
          <option>Select a coach</option>
          <option
            v-for="option in coachOptions"
            :value="option._id"
            :key="option"
          >
            {{ option.name }}, {{ option.email }}
          </option>
        </select>
      </div>
      <div class="coachInput date">
        <label for="date">Date</label>
        <input name="date" class="perso" type="date" v-model="date" required />
      </div>

      <div class="card-btn">
        <button
          v-on:click="bookAppointment()"
          :class="{ registerButton: true, button_fitness: isFitness }"
          type="submit"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.modal_crossfit {
  height: 410px;
  width: 540px;
  display: block;
  background-color: #404040;
  padding: 20px;
  color: white;
  font-size: 16px;
  font-family: "Poppins", sans-serif;
  font-weight: 300;
  border-radius: 20px;
}

.modal_fitness {
  background-color: #2f6a87;
}

.registerButton {
  background-color: #e73725;
  width: 30%;
  border-radius: 10px;
  box-shadow: none;
  border: none;
  margin-top: 30px;
  height: 40px;
  font-family: "Poppins", sans-serif;
  font-size: 24px;
  font-weight: 300;
  color: #ffffff;
}

.registerButton:hover {
  cursor: pointer;
  opacity: 0.7;
}

.button_fitness {
  background-color: #ea6c36;
}

.card-btn {
  text-align: center;
}

.coachInput label {
  font-size: 20px;
}

.coachInput select {
  font-size: 16px;
  margin-bottom: 30px;
  height: 30px;
  width: 40%;
  background-color: #ffffff;
  opacity: 0.7;
}

.coachInput input {
  font-size: 16px;
  margin-bottom: 30px;
  height: 30px;
  width: 40%;
  background-color: #ffffff;
  opacity: 0.7;
}

.date {
  display: flex;
  flex-direction: column;
}
@media (max-width: 750px) {
  .modal_crossfit {
    height: 410px;
    width: auto;
    display: block;
    background-color: #404040;
    padding: 20px;
    color: white;
    font-size: 16px;
    font-family: "Poppins", sans-serif;
    font-weight: 300;
    border-radius: 20px;
  }

  .modal_fitness {
    background-color: #2f6a87;
  }

  .registerButton {
    background-color: #e73725;
    width: 60%;
    border-radius: 10px;
    box-shadow: none;
    border: none;
    margin-top: 30px;
    height: 40px;
    font-family: "Poppins", sans-serif;
    font-size: 24px;
    font-weight: 300;
    color: #ffffff;
  }

  .registerButton:hover {
    cursor: pointer;
    opacity: 0.7;
  }

  .button_fitness {
    background-color: #ea6c36;
  }

  .card-btn {
    text-align: center;
  }

  .coachInput label {
    font-size: 20px;
  }

  .coachInput select {
    font-size: 16px;
    margin-bottom: 30px;
    height: 30px;
    width: 60%;
    background-color: #ffffff;
    opacity: 0.7;
  }

  .coachInput input {
    font-size: 16px;
    margin-bottom: 30px;
    height: 30px;
    width: 60%;
    background-color: #ffffff;
    opacity: 0.7;
  }

  .date {
    display: flex;
    flex-direction: column;
  }
}
</style>
