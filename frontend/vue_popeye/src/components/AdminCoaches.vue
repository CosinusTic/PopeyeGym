<script setup>
defineProps({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  nature: {
    type: Number,
    required: true,
  },
  busy: {
    type: Array,
    required: true,
  },
  rate: {
    type: Array,
    required: true,
  },
  photo: {
    type: String,
  },
  status: {
        type: Number,
        default: 0,
    },
});
</script>

<template>
  <div class="displayusercomponent">
    <div>{{ id }}</div>
    <div><img :src="photo" /></div>
    <div>{{ name }}</div>
    <div>{{ email }}</div>
    <div>{{ description }}</div>
    <div>{{ nature }}</div>
    <div>{{ rate }}</div>
    <div>{{ busy }}</div>
    <div>{{ status }}</div>
  </div>
</template>

<style scoped>
.displayusercomponent {
    display: flex;
}
</style>