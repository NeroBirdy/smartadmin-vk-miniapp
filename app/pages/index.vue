<template>
  <div class="content">
    <p class="text-calendar header-text">Выберите дату занятия</p>
    <div class="nav-header">
      <component class="arrow-left" :is="arrow" @click="previousPeriod" />
      <h1 class="text-calendar">{{ CalendarPeriodText }}</h1>
      <component class="arrow-right" :is="arrow" @click="nextPeriod" />
    </div>
    <div class="calendar">
      <CustomCalendarDaysOfWeek />
      <div class="inside-calendar">
        <template v-for="(week, wIndex) in weeks" :key="wIndex">
          <CustomCalendarMonthDay
            v-for="(cell, cIndex) in week"
            :key="cIndex"
            :date="cell.date"
            :isCurrentMonth="cell.isCurrentMonth"
            :isToday="cell.isToday"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import arrow from "~/assets/icons/arrow_left.svg";
import {
  startOfWeek,
  isSameMonth,
  isToday,
  addDays,
  format,
  addMonths,
  subMonths,
} from "date-fns";
import { ru } from "date-fns/locale";

type CalendarCell = {
  isCurrentMonth: boolean;
  isToday: boolean;
  date: Date;
};

const CalendarPeriodText = computed(() => {
  const str = format(currentDate.value, "LLLL", { locale: ru });
  return str.charAt(0).toUpperCase() + str.slice(1);
});

function nextPeriod() {
  currentDate.value = addMonths(currentDate.value, 1);
}

function previousPeriod() {
  currentDate.value = subMonths(currentDate.value, 1);
}

const currentDate = ref(new Date());

const weeks = ref<CalendarCell[][]>([]);

const getMonthDays = () => {
  const current = currentDate.value;
  const start = startOfWeek(
    new Date(current.getFullYear(), current.getMonth(), 1),
    { weekStartsOn: 1 },
  );
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
};

function buildCalendarGrid() {
  const current = currentDate.value;
  const days = getMonthDays();

  const cells = days.map((date) => ({
    date,
    isCurrentMonth: isSameMonth(date, current),
    isToday: isToday(date),
  }));

  weeks.value = Array.from({ length: 6 }, (_, i) =>
    cells.slice(i * 7, i * 7 + 7),
  );
}

buildCalendarGrid();

watch(currentDate, buildCalendarGrid);
</script>

<style scoped>
.calendar {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.inside-calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  align-items: center;
}

.text-calendar {
  font-size: 32px;
  color: #324260;
  margin: 0;
}

.header-text {
   font-size: 20px;
   padding-left: 10px;
}

.nav-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 286px;
  margin: 21px 0;
}

.arrow-left {
  transform: rotate(180deg);
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
