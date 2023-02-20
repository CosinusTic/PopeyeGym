<script>
export default {
  data() {
    return {};
  },
  methods: {},
};
</script>

<template>
  <div class="popeye">
    <h1>POPEYE'S GYM</h1>
  </div>
</template>

<style scoped>
.popeye {
  height: 120px;
  padding: 30px;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

h1 {
  font-family: "Poppins", sans-serif;
  font-size: 50px;
  font-weight: 400;
  color: #404040;
  margin-top: 0;
}

/* Media queries phone */
@media (min-width: 320px) and (max-width: 480px) {
  .popeye {
    width: 100%;
    padding: 30px 0;
  }

  h1 {
    font-size: 30px;
  }
}
</style>
