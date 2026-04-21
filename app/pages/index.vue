<template>
  <div class="schedule-page">
    <h2 class="header">Расписание</h2>

    <div class="status">{{ status }}</div>

    <div class="calendar-grid">
      <div
        v-for="(week, wIndex) in weeks"
        :key="wIndex"
      >
        <div
          v-for="(cell, cIndex) in week"
          :key="`${wIndex}-${cIndex}`"
          class="day-cell"
          :class="{
            'day-cell--today': cell.isToday,
            'day-cell--not-current-month': !cell.isCurrentMonth,
          }"
          @click="handleDayClick(cell.date)"
        >
          <div class="day-cell__date">
            {{ cell.date.getDate() }}
          </div>

          <div
            v-for="lesson in cell.lessons.slice(0, 3)"
            :key="lesson.id"
            class="lesson-chip"
            :style="{ backgroundColor: lesson.color }"
          >
            <span>{{ lesson.startTime }}–{{ lesson.endTime }}</span><br />
            <span>{{ lesson.group.name }}</span>
          </div>

          <div
            v-if="cell.lessons.length > 3"
            class="lesson-more"
          >
            + ещё {{ cell.lessons.length - 3 }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  addDays,
  format,
} from 'date-fns';
import type { Lesson, LessonsMap, ApiResponse } from '../../types/schedule';
import { useScheduleStore } from '../../composables/useScheduleStore';

type CalendarCell = {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  lessons: Lesson[];
};

const status = ref('Загружаем расписание...');
const currentDate = ref(new Date());
const type = ref<'week' | 'month'>('month');

const { lessonsMap, selectedDateKey } = useScheduleStore();

onMounted(async () => {
  await fetchSchedule();
});

async function fetchSchedule() {
  try {
    status.value = 'Отправляем запрос...';

    const url = new URL('https://smartadminvk.loca.lt/api/schedule/getSchedule');
    url.searchParams.set('orgId', '1');
    url.searchParams.set('dateFrom', '2026-04-20');
    url.searchParams.set('dateTo', '2026-04-26');
    url.searchParams.set('groupExceptions', '');
    url.searchParams.set('venueExceptions', '');

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = (await res.json()) as ApiResponse;

    lessonsMap.value = data.lessons || {};
    status.value = 'Готово';
  } catch (e) {
    console.error(e);
    status.value = 'Ошибка загрузки';
  }
}

function getLessonsForCell(date: Date): Lesson[] {
  const key = format(date, 'yyyy-MM-dd');
  return lessonsMap.value[key] || [];
}

function getWeekDays() {
  const weekStartsOn = 1;
  const start = startOfWeek(currentDate.value, { weekStartsOn });
  return eachDayOfInterval({
    start,
    end: endOfWeek(currentDate.value, { weekStartsOn }),
  });
}

function getMonthDays() {
  const start = startOfWeek(
    new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1),
    { weekStartsOn: 1 },
  );
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
}

const weeks = computed<CalendarCell[][]>(() => {
  const days = type.value === 'week' ? getWeekDays() : getMonthDays();

  const cells: CalendarCell[] = days.map((date) => ({
    date,
    isCurrentMonth: isSameMonth(date, currentDate.value),
    isToday: isToday(date),
    lessons: getLessonsForCell(date),
  }));

  if (type.value === 'week') {
    return [cells];
  }

  return Array.from({ length: 6 }, (_, i) => cells.slice(i * 7, i * 7 + 7));
});

async function handleDayClick(date: Date) {
  const key = format(date, 'yyyy-MM-dd');
  selectedDateKey.value = key;
  await navigateTo({ name: 'day-date', params: { date: key } });
}
</script>

<style scoped>
.schedule-page {
  padding: 8px 12px 16px;
}
.header {
  margin: 0 0 8px;
  font-size: 18px;
}
.status {
  margin-bottom: 8px;
  font-size: 14px;
}
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}
.day-cell {
  border-radius: 6px;
  padding: 4px;
  min-height: 70px;
  font-size: 11px;
  box-sizing: border-box;
  cursor: pointer;
  background-color: #f5f5f5;
  color: #000;
}
.day-cell--today {
  background-color: #2688eb;
  color: #fff;
}
.day-cell--not-current-month {
  color: #999;
}
.day-cell__date {
  font-weight: 600;
  margin-bottom: 2px;
}
.lesson-chip {
  margin-top: 2px;
  border-radius: 4px;
  padding: 1px 2px;
  color: #fff;
}
.lesson-more {
  margin-top: 2px;
}
</style>