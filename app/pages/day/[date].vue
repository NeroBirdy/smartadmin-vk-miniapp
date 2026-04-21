<template>
  <div class="day-page">
    <h2 class="header">
      Занятия на {{ dateParam || 'неизвестную дату' }}
    </h2>

    <div v-if="!lessons.length" class="empty">
      На эту дату занятий нет.
    </div>

    <div
      v-for="lesson in lessons"
      :key="lesson.id"
      class="lesson-card"
      :style="{ backgroundColor: lesson.color }"
    >
      <div class="lesson-card__time">
        {{ lesson.startTime }}–{{ lesson.endTime }}
      </div>
      <div class="lesson-card__group">
        {{ lesson.group.name }}
      </div>
      <div class="lesson-card__venue">
        {{ lesson.venue.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useScheduleStore } from '../../../composables/useScheduleStore';

const route = useRoute();
const { lessonsMap, selectedDateKey } = useScheduleStore();

const dateParam = computed(() => route.params.date as string | undefined);

const dateKey = computed(() => dateParam.value || selectedDateKey.value);

const lessons = computed(() => {
  if (!dateKey.value) return [];
  return lessonsMap.value[dateKey.value] || [];
});
</script>

<style scoped>
.day-page {
  padding: 8px 12px 16px;
}
.header {
  margin: 0 0 12px;
  font-size: 18px;
}
.empty {
  font-size: 14px;
  color: #666;
}
.lesson-card {
  margin-bottom: 8px;
  padding: 8px;
  border-radius: 8px;
  color: #fff;
  font-size: 13px;
}
.lesson-card__time {
  font-weight: 600;
}
.lesson-card__group {
  margin-top: 2px;
}
.lesson-card__venue {
  margin-top: 2px;
  font-size: 12px;
  opacity: 0.9;
}
</style>