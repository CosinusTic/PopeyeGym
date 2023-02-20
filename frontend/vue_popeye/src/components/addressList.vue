<script setup></script>

<script>
export default {
  data() {
    return {};
  },
  props: {
    list: Array,
  },
  created() {
    if (this.$route.name == "userProfile") {
      this.inUserProfile = true;
    } else if (this.$route.name == "user_management") {
      this.inManagementUserProfile = true;
    } else {
      this.inUserProfile = false;
    }
  },
  methods: {
    addressSelected(address) {
      this.$emit("address-selected", address);
    },
  },
};
</script>

<template>
  <div
    :class="{
      addresslist: true,
      userProfile: inUserProfile,
      managementUserProfile: inManagementUserProfile,
    }"
  >
    <p v-for="address in list" :key="address" @click="addressSelected(address)">
      {{ address.properties.label }}
    </p>
  </div>
</template>

<style>
p {
  font-size: 13px;
  font-family: "Poppins", sans-serif;
  color: #404040;
}

p:hover {
  cursor: pointer;
}

.addresslist {
  margin-left: 266px;
  width: 50%;
  background-color: rgba(255, 255, 255, 0.7);
  padding-left: 5px;
}

.userProfile {
  margin-left: 0;
  margin-top: -42px;
  width: 52%;
}

.managementUserProfile {
  margin-left: 0px;
  margin-top: -78px;
  width: 52%;
}

/* Media queries phone */
@media (min-width: 320px) and (max-width: 480px) {
  .address-list {
    margin-left: 120px;
  }
  p {
    font-size: 10px;
  }
}
</style>
