<script setup>
import AddressList from "../components/addressList.vue";
</script>

<script>
export default {
  data() {
    return {
      address: "",
      name: "",
      email: "",
      password: "",
      passwordconfirmation: "",
      location: {},
      searchAddress: "",
      foundAddress: [],
      click: false,
    };
  },
  created() {},
  methods: {
    close() {
      this.$emit("close-client-register");
    },
    AddClient() {
      if (this.password == this.passwordconfirmation) {
        if (this.click !== true) {
          this.$toast.error("Missing address");
        } else {
          console.log("location =>", this.location);
          fetch("http://localhost:3002/createUser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: this.name,
              email: this.email,
              password: this.password,
              address: this.address,
              location: this.location,
            }),
          })
            .then((response) => response.json())
            .then((response) => {
              if (response.error) {
                this.$toast.error(response.error);
              } else {
                this.$toast.success("account successfully created!");
                localStorage.setItem("token", response.token);
                this.$router.push("/schemes");
              }
            });
        }
      } else {
        this.$toast.error("Your passwords are differents");
      }
    },
    getAddress(event) {
      this.searchAddress = event.target.value;
      fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${this.searchAddress}&limit=5`
      )
        .then((response) => response.json())
        .then((data) => (this.foundAddress = data.features));
    },
    selectAnAddress(selectedAddress) {
      this.click = true;
      this.address = selectedAddress.properties.label;
      this.location = selectedAddress.geometry;
      this.foundAddress = [];
    },
  },
};
</script>

<template>
  <div class="modal">
    <div class="close">
      <button class="closeButton" @click="close()">X</button>
    </div>
    <form @submit.prevent="AddClient()">
      <div class="inputs">
        <div class="field">
          <label>Name</label>
          <input name="name" type="text" v-model="name" required />
        </div>
        <div class="field">
          <label>Email</label>
          <input name="email2" type="email" v-model="email" required />
        </div>
        <div class="field">
          <label>Password</label>
          <input name="pwd" type="password" v-model="password" required />
        </div>
        <div class="field">
          <label>Password confirmation</label>
          <input
            name="pwdconf"
            type="password"
            v-model="passwordconfirmation"
            required
          />
        </div>
        <div class="field">
          <label>Address</label>
          <input
            type="text"
            v-model="address"
            name="address"
            class="input-address"
            @input="getAddress"
            required
          />
        </div>
        <AddressList :list="foundAddress" @address-selected="selectAnAddress" />
        <div class="card-btn">
          <button class="registerButton" type="submit">Submit</button>
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

.input-address {
  margin-bottom: 0 !important;
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

.registerButton:hover {
  cursor: pointer;
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
  width: 40px;
  font-size: 20px;
}

.closeButton:hover {
  cursor: pointer;
}

.card-btn {
  text-align: center;
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
}
</style>
