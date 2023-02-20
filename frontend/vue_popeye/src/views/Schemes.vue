<template>
  <div class="container">
    <div class="scheme-crossfit">
      <button v-on:click="redirectHardWork" class="redirect-button crossfit">
        Crossfit
      </button>
    </div>
    <div class="scheme-fitness">
      <button v-on:click="redirectFitness" class="redirect-button">
        Fitness
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    redirectFitness() {
      const scheme = "fitness";
      localStorage.setItem("scheme", scheme);
      this.$router.push("/userProfile");
    },
    redirectHardWork() {
      const scheme = "crossfit";
      localStorage.setItem("scheme", scheme);
      this.$router.push("/userProfile");
    },
    async getUserType() {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch("http://localhost:3002/getUserType/" + token)
          .then((response) => response.json())
          .then(async (response) => {
            localStorage.setItem("userType", await response.type);
          });
      } else {
        await fetch("http://localhost:3002/getUserType/" + this.token)
          .then((response) => response.json())
          .then(async (response) => {
            localStorage.setItem("userType", await response.type);
          });
      }
    },
    checkUserType() {
      const userType = localStorage.getItem("userType");
      if (userType == "customer") {
        return;
      } else if (userType == "coach") {
        this.$router.push("/");
        this.$toast.error("Access forbidden");
      }
    },
  },
  async mounted() {
    await this.getUserType();
    this.checkUserType();
  },
};
</script>

<style>


.scheme-fitness:hover {
  opacity: 1;
}

.scheme-crossfit:hover {
  opacity: 1;
}

.redirect-button {
  background-color: rgba(234, 108, 54, 0.7);
  border-radius: 20px;
  border: none;
  box-shadow: none;
  width: 30%;
  height: 60px;
  font-family: "Poppins", sans-serif;
  font-weight: 300;
  font-size: 24px;
  color: #ffffff;
  margin: auto;
}

.redirect-button:hover {
  background-color: rgba(234, 108, 54, 1);
  cursor: pointer;
}

.crossfit {
  background-color: rgba(231, 55, 37, 0.7);
}

.crossfit:hover {
  background-color: rgba(231, 55, 37, 1);
  cursor: pointer;
}

@media (min-width: 751px) {
  .container {
    display: flex;
    flex-direction: row;
  }

  .scheme-fitness {
    min-height: 100vh;
    width: 50vw;
    background-image: url("../../public/fitness.png");
    opacity: 0.7;
    background-repeat: no-repeat;
    object-fit: contain;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .scheme-crossfit {
    min-height: 100vh;
    width: 50vw;
    background-image: url("../../public/work_hard.png");
    opacity: 0.7;
    background-repeat: no-repeat;
    object-fit: contain;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
}

@media (max-width: 750px) {
  .container {
    display: flex;
    flex-direction: column;
  }
  .scheme-fitness {
    min-height: 50vh;
    width: auto;
    background-color: #2f6a87;
    opacity: 1;
    object-fit: contain;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .scheme-crossfit {
    min-height: 50vh;
    width: auto;
    background-color: #404040;
    opacity: 1;
    object-fit: contain;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .redirect-button {
  background-color: rgba(234, 108, 54, 1);
}
.crossfit {
  background-color: rgba(231, 55, 37, 1);
}
}

</style>
