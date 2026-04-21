<template>
  <div class="calendar-month-day" :class="dayStyle" @click="console.log(fetchRR)">
    <div class="inside-calendar-month-day">
      <div class="header">
        <h1 class="text-calendar" :class="textStyle">
          {{ dateText }}
        </h1>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { format } from "date-fns";
import bridge from '@vkontakte/vk-bridge';

const userId = ref<number | null>(null);

onMounted(async () => {
  // 1. Инициализируем бридж
  bridge.send('VKWebAppInit');

  // 2. Запрашиваем информацию о пользователе
  try {
    const result = await bridge.send('VKWebAppGetUserInfo');
    userId.value = result.id; // result.id - это и есть userId
  } catch (error) {
    console.error('Ошибка получения UserID:', error);
  }
});

const fetchRR = async () => {
  if (!userId.value) {
    console.warn('UserId еще не получен');
    return;
  }

  return await $fetch("/api/miniapp/getLessonForUser", {
    query: { 
      date: date, 
      userId: userId.value 
    },
  });
};

const { date, isToday, isCurrentMonth } = defineProps<{
  date: Date;
  isToday: boolean;
  isCurrentMonth: boolean;
}>();

const dayStyle = computed(() => ({
  today: isToday,
}));

const textStyle = computed(() => ({
  today: isToday,
  currentMonth: !isCurrentMonth,
}));

const dateText = computed(() => {
  return format(date, "d");
});
</script>

<style scoped>
.calendar-month-day {
  height: 90px;
  width: 90px;
  margin-right: 17.5px;
  margin-left: 17.5px;
  margin-bottom: 15px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 32px 2px rgba(0, 0, 0, 0.08);
}

.calendar-month-day.today {
  background-color: #2c71e4;
}

.calendar-month-day.today:hover {
  background-color: #2661c7;
}

.calendar-month-day:hover {
  background-color: #cdced3;
}

.inside-calendar-month-day {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.text-calendar {
  color: #324260;
}

.text-calendar.today {
  color: white;
}

.text-calendar.currentMonth {
  color: #6a758b;
}

.header {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 13px;
  padding-top: 10px;
  transition: padding-bottom 0.3s ease;
}

.header h1,
p {
  margin: 0;
  padding: 0;
}
</style>
