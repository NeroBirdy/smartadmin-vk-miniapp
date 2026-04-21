// composables/useScheduleStore.ts
import { ref } from 'vue';
import type { LessonsMap } from '../types/schedule';

const lessonsMap = ref<LessonsMap>({});
const selectedDateKey = ref<string | null>(null);

export function useScheduleStore() {
  return {
    lessonsMap,
    selectedDateKey,
  };
}