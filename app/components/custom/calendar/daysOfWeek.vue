<template>
  <div class="days-of-week">
    <div
      class="day-of-week text-calendar"
      v-for="value in daysOfWeek"
      :key="value"
    >
      {{ value }}
    </div>
  </div>
</template>

<script lang="ts" setup>
const daysOfWeek = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];
</script>

<style scoped>
.days-of-week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding-bottom: 5px;
}

.day-of-week {
  width: 90px;
  padding: 0 17.5px;
  text-align: center;
  color: #2c71e4;
  text-transform: uppercase;
}
</style>
