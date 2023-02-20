<template>
  <div class="filterelement">
    {{ placeholder }}
    <select
      class="dropdown2"
      v-on:change="
        (event) => {
          this.$emit('chosen_filter', event.target.value);
        }
      "
    >
      <option value="" selected disabled hidden></option>
      <option v-for="filter in filters" :value="filter" :key="filter">
        {{ filter }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  props: ["filters", "placeholder"],
};
</script>

<style scoped>

.filterelement {
  margin-right: 50px;
}
.dropdown2 {
  opacity: 0.7;
  border: none;
  width: 100px;
}

select {
  margin-left: 10px;
}

</style>
