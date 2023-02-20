<script>
export default {
  props: ["coach"],
  data() {
    return {
      date: undefined,
      open: true,
      error: undefined,
      user: undefined,
      isFitness: false,
    };
  },
  methods: {
    close() {
      this.$emit("close-coach-register");
    },
    async bookAppointment(coach) {
      if (this.date != undefined) {
        const options = {
          method: "POST",
          body: JSON.stringify({
            id_coach: coach._id,
            id_user: this.user._id,
            date: this.date,
          }),
          headers: { "Content-Type": "application/json" },
        };
        console.log("options: ", options);
        await fetch("http://localhost:3002/addAppointment", options)
          .then((response) => response.json())
          .then((response) => {
            if (response.error) {
              this.$toast.error("error :" + response.error);
            } else {
              this.$emit("newAppointment", this.date);
              this.$toast.success("Appointment booked!");
            }
          });
      } else {
        console.log("field must be filled");
        this.error = "Please fill out this field";
      }
      this.$emit("close-coach-register");
    },
    async getUser() {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:3002/findUserWithToken/" + token)
        .then((response) => response.json())
        .then(async (response) => {
          this.user = await response.user[0];
          console.log(response.user[0]);
        });
    },
  },
  created() {
    this.getUser();
    if (localStorage.getItem("scheme") == "crossfit") {
      this.isFitness = false;
    } else {
      this.isFitness = true;
    }
  },
};
</script>

<template>
  <div v-if="this.open == true">
    <div :class="{ modal_crossfit: true, modal_fitness: isFitness }">
      <div class="close">
        <button class="closeButton" @click="close()">X</button>
      </div>
      <div class="inputs">
        <h3>Book an appointment with {{ coach.name }}</h3>
        <div class="field">
          <label for="date">Date</label>
          <input
            name="date"
            class="perso"
            type="date"
            v-model="date"
            required
          />
        </div>
        <div class="card-btn">
          <button
            v-on:click="bookAppointment(coach)"
            :class="{ registerButton: true, button_fitness: isFitness }"
            type="submit"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.modal_crossfit {
  position: fixed;
  z-index: 9999;
  top: 27%;
  right: 35%;
  height: 410px;
  width: 540px;
  display: block;
  background-color: #e73725;
  padding: 20px;
  color: white;
  font-size: 16px;
  font-family: "Poppins", sans-serif;
  font-weight: 300;
  border-radius: 20px;
}

.modal_fitness {
  position: fixed;
  z-index: 9999;
  height: 410px;
  top: 27%;
  right: 35%;
  width: 540px;
  display: block;
  background-color: #ea6c36;
  padding: 20px;
  color: white;
  font-size: 16px;
  font-family: "Poppins", sans-serif;
  font-weight: 300;
  border-radius: 20px;
}

h3 {
  font-family: "Poppins", sans-serif;
  font-weight: 300;
  font-size: 20px;
  margin: 0 auto;
  margin-bottom: 50px;
}

.inputs {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}
.inputs input {
  width: 50%;
  height: 35px;
  margin-bottom: 20px;
  background-color: rgba(255, 255, 255, 0.7);
  border: none;
  box-shadow: none;
  font-family: "Poppins", sans-serif;
  color: #404040;
}

.field {
  display: flex;
  flex-direction: row;
  justify-content: center;
  color: #ffffff;
}

.field label {
  margin-right: 30px;
}
.registerButton {
  background-color: #404040;
  width: 30%;
  border-radius: 10px;
  box-shadow: none;
  border: none;
  margin-top: 100px;
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
  background-color: #2f6a87;
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
  font-size: 20px;
  width: 40px;
  cursor: pointer;
}
.card-btn {
  text-align: center;
}

@media (max-width: 750px) {
  .modal_crossfit {
    position: fixed;
    z-index: 9999;
    top: 10%;
    right: 3%;
    margin-left: 10px;
    margin-right: -2px;
    height: 410px;
    width: auto;
    display: block;
    background-color: #e73725;
    padding: 20px;
    color: white;
    font-size: 16px;
    font-family: "Poppins", sans-serif;
    font-weight: 300;
    border-radius: 20px;
  }

  .modal_fitness {
    position: fixed;
    z-index: 9999;
    height: 410px;
    top: 10%;
    right: 3%;
    margin-left: 10px;
    margin-right: -2px;
    width: auto;
    display: block;
    background-color: #ea6c36;
    padding: 20px;
    color: white;
    font-size: 16px;
    font-family: "Poppins", sans-serif;
    font-weight: 300;
    border-radius: 20px;
  }
}
</style>
