<script>
export default {
  data() {
    return {};
  },
  methods: {
    close() {
      this.$emit("close-coach-register");
    },
    AddCoach() {
      if (this.password == this.passwordconfirmation) {
        console.log(this.nature)
        fetch("http://localhost:3002/createCoach", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: this.name,
            email: this.email,
            password: this.password,
            nature: this.nature,
          }),
        })
          .then((response) => response.json())
          .then((response) => {
            if (response.error) {
              this.$toast.error(response.error);
            } else {
              this.$toast.success("account successfully created!");
              localStorage.setItem("token", response.token);
              localStorage.setItem("scheme", this.nature);
              this.$router.push("/mycoachprofile");
            }
          });
      } else {
        this.$toast.error("Your passwords are differents");
      }
    },
  },
};
</script>

<template>
  <div class="modal">
    <div class="close">
      <button class="closeButton" @click="close()">X</button>
    </div>
    <form @submit.prevent="AddCoach()">
      <div class="inputs">
        <div class="field">
          <label>Name</label>
          <input
            name="name3"
            class="perso"
            type="text"
            v-model="name"
            required
          />
        </div>
        <div class="field">
          <label>Email</label>
          <input
            name="email3"
            class="perso"
            type="email"
            v-model="email"
            required
          />
        </div>
        <div class="field">
          <label>Password</label>
          <input
            name="pwd2"
            class="perso"
            type="password"
            v-model="password"
            required
          />
        </div>
        <div class="field">
          <label>Password confirmation</label>
          <input
            name="pwdconf2"
            class="perso"
            type="password"
            v-model="passwordconfirmation"
            required
          />
        </div>
        <div class="field">
          <label>Coaching style</label>
          <div class="radios">
            <input
              type="radio"
              class="radio"
              id="fitness"
              value="fitness"
              name="nature"
              v-model="nature"
            />
            <label for="fitness">Fitness</label>
            <input
              type="radio"
              class="radio"
              id="muscu"
              value="crossfit"
              name="nature"
              v-model="nature"
            />
            <label for="muscu">Crossfit</label>
          </div>
        </div>
        <div class="card-btn">
          <button name="Submit" class="registerButton" type="submit">
            Submit
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
<style scoped>
.modal {
  position: fixed;
  z-index: 9999;
  top: 28.5%;
  height: 410px;
  right: 7%;
  width: 620px;
  margin-left: -150px;
  display: block;
  background-color: #404040;
  padding: 20px;
  color: white;
  font-size: 16px;
  font-family: "Poppins", sans-serif;
  font-weight: 300;
  border-radius: 20px;
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
  justify-content: space-between;
}
.registerButton {
  background-color: rgba(255, 255, 255, 0.7);
  width: 30%;
  border-radius: 10px;
  box-shadow: none;
  border: none;
  margin-top: 30px;
  height: 40px;
  font-family: "Poppins", sans-serif;
  font-size: 24px;
  font-weight: 300;
  color: #404040;
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
}

.registerButton:hover {
  cursor: pointer;
}

.closeButton:hover {
  cursor: pointer;
}
.card-btn {
  text-align: center;
}

.radios {
  display: flex;
  flex-direction: row;
  width: 55%;
}

.radios label {
  margin: 10px 0;
}
.radio {
  width: 60px;
  height: 25px;
  margin-bottom: 10px;
  accent-color: #404040;
}

/* Media queries phone */
@media (min-width: 320px) and (max-width: 480px) {
  .modal {
    top: 42%;
    height: 350px;
    width: 250px;
  }
  .inputs input {
    width: 50%;
    height: 25px;
  }
  .registerButton {
    width: 40%;
    font-size: 18px;
  }
  .radios {
    display: flex;
    flex-direction: row;
  }
  .radios label {
    margin: 0;
    margin-top: 3px;
  }
  .radio {
    width: 20px;
    height: 20px;
    margin-bottom: 0;
    accent-color: #404040;
  }
}
</style>
