<template>
  <div class="booking_component">
    <div class="list">
      <ul name="booking">
        <li>Coach : {{ booking.coach.name }}</li>
        <li>Date : {{ booking.appointment.date.split("T")[0] }}</li>
      </ul>
    </div>
    <button
      :class="{ btn: true, bgfitness: isFitness }"
      v-on:click="deleteBooking(booking)"
      name="bin"
    >
      <img name="bin" class="bin" src="../../public/bin.svg" />
    </button>
  </div>
</template>

<script>
export default {
  props: ["booking"],
  created() {
    if (localStorage.getItem("scheme") == "fitness") {
      this.isFitness = true;
    } else {
      this.isFitness = false;
    }
  },
  methods: {
    async deleteBooking(booking) {
      const confirmation = confirm(
        "Delete your " +
          booking.appointment.date.split("T")[0] +
          " with " +
          booking.coach.name +
          "?"
      );
      if (confirmation) {
        const options = {
          method: "DELETE",
          body: JSON.stringify({
            _id: booking.appointment._id,
          }),
          headers: { "Content-Type": "Application/json" },
        };
        const secondOptions = {
          method: "PUT",
          body: JSON.stringify({
            booking_date: booking.appointment.date.split("T")[0],
            coach_id: booking.coach._id,
          }),
          headers: { "Content-Type": "Application/json" },
        };
        await fetch("http://localhost:3002/deleteAppointment", options)
          .then((response) => response.json())
          .then(async () => {
            await fetch(
              "http://localhost:3002/freeCoachSchedule",
              secondOptions
            )
              .then((response) => response.json())
              .then((response) => console.log(response))
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));
        this.$toast.info("Booking deleted");
      }
    },
    async freeCoachSlot(booking) {
      const secondOptions = {
        method: "PUT",
        body: JSON.stringify({
          booking_date: booking.date,
          coach_id: booking.coach._id,
        }),
        headers: { "Content-Type": "Application/json" },
      };
      await fetch("http://localhost:3002/freeCoachSchedule", secondOptions)
        .then((response) => response.json())
        .then((response) => console.log(response))
        .catch((err) => console.log(err));
    },
  },
};
</script>

<style scoped>
.booking_component {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border: solid #404040 1px;
  border-radius: 10px;
  width: 90%;
  margin-bottom: 10px;
}

.btn {
  background-color: #404040;
  border: none;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  margin: auto 10px;
}

.bin {
  height: 25px;
  width: 25px;
  cursor: pointer;
}

.list {
  width: 200px;
}

li {
  list-style-type: none;
}

.bgfitness {
  background-color: #2f6a87;
}
</style>
