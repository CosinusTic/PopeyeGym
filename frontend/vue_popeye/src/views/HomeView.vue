<script setup>
import headerComponent from "../components/headerComponent.vue";
import registerAsCoach from "../components/registerAsCoach.vue";
import registerAsClient from "../components/registerAsClient.vue";
</script>

<script>
export default {
  data() {
    return {
      state: "",
      openClientRegister: false,
      openCoachRegister: false,
      token: undefined,
    };
  },

  created() {
    localStorage.clear();
  },
  methods: {
    toggleRegisterClientModal(state) {
      this.openClientRegister = state;
    },
    toggleRegisterCoachModal(state) {
      this.openCoachRegister = state;
    },
    async login() {
      await fetch(`http://localhost:3002/findUserByEmail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: this.email,
          password: this.password,
        }),
      })
        .then((response) => {
          if (response.status == 402) {
            this.$toast.error("the password is wrong");
          } else {
            return (response.json());
          }
        })
        .then((data) => {
          console.log(data);
          if (data.nature == undefined) {
            console.log("login 3");
            if (data.name != undefined) {
              localStorage.setItem("token", data.token);
              this.token = data.token;
              this.$router.push("/schemes");
            } else {
              this.$toast.error("You have to create a profile");
              this.$router.push("/");
            }
          } else {
            localStorage.setItem("token", data.token);
            this.token = data.token;
            localStorage.setItem("scheme", data.nature);
            this.$router.push("/mycoachprofile");
          }
        });
    },
  },
};
</script>

<template>
  <main class="main">
    <headerComponent />
    <div class="containers">
      <div class="register">
        <div class="registerButtons">
          <button
            class="registerButton topButton"
            @click="
              toggleRegisterClientModal(true), toggleRegisterCoachModal(false)
            "
          >
            Register as a client
          </button>
          <button
            class="registerButton bottomButton"
            @click="
              toggleRegisterCoachModal(true), toggleRegisterClientModal(false)
            "
          >
            Register as a coach
          </button>
        </div>
      </div>
      <div class="login">
        <form>
          <div class="inputs">
            <label class="labels" for="email">Email</label>
            <input type="email" id="email" name="email" v-model="email" />
            <label class="labels" for="password">Password</label>
            <input
              type="password"
              id="pwd"
              name="password"
              v-model="password"
            />
          </div>
        </form>
        <button class="registerButton loginButton" @click="login()">
          Login
        </button>
      </div>
    </div>
    <div v-if="openClientRegister == true">
      <registerAsClient
        @close-client-register="toggleRegisterClientModal(false)"
      />
    </div>
    <div v-if="openCoachRegister == true">
      <registerAsCoach
        @close-coach-register="toggleRegisterCoachModal(false)"
      />
    </div>

    <!-- <Footer /> -->
  </main>
</template>

<style scoped>
.main {
  min-height: 100vh;
  background-image: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    ),
    url("../../public/sportif.png");
  background-repeat: no-repeat;
  background-size: 100%;
}
.containers {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  padding-top: 30px;
}
.register {
  text-align: center;
  width: 35%;
}
.login {
  width: 35%;
  height: 450px;
  margin-top: 70px;
  text-align: center;
  background-color: rgba(64, 64, 64, 0.5);
  border-radius: 20px;
  border: none;
  box-shadow: none;
}

.registerButtons {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.registerButton {
  background-color: rgba(64, 64, 64, 0.5);
  border-radius: 20px;
  border: none;
  box-shadow: none;
  width: 100%;
  height: 60px;
  font-family: "Poppins", sans-serif;
  font-weight: 300;
  font-size: 24px;
  color: #ffffff;
  cursor: pointer;
}

.bottomButton {
  margin-top: 70px;
}

.loginButton {
  background-color: rgba(255, 255, 255, 0.6);
  width: 30%;
  margin-top: 30px;
  color: #404040;
}

.inputs {
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  color: #ffffff;
  font-family: "Poppins", sans-serif;
  font-weight: 300;
  font-size: 24px;
}

.inputs input {
  width: 60%;
  height: 50px;
  margin: 0 auto 50px auto;
  background-color: rgba(255, 255, 255, 0.6);
  border: none;
  box-shadow: none;
}

.labels {
  font-family: "Poppins", sans-serif;
}

/* Media queries phone */
@media (min-width: 320px) and (max-width: 480px) {
  .main {
    background-image: linear-gradient(
        rgba(255, 255, 255, 0.5),
        rgba(255, 255, 255, 0.5)
      ),
      url("../../public/sportif.png");
    background-repeat: no-repeat;
    background-position: 20% 100%;
    background-size: auto;
  }
  .containers {
    align-items: center;
    margin-right: 0;
  }
  .register {
    width: 70%;
  }
  .login {
    width: 70%;
    height: 300px;
    margin-top: 30px;
  }
  .inputs {
    margin-top: 20px;
  }

  .inputs input {
    height: 40px;
    margin-bottom: 5px;
  }

  .loginButton {
    width: 50%;
    margin-top: 20px;
  }
  .bottomButton {
    margin-top: 30px;
  }
}
</style>
