<template>
  <div class="content">
    <Transition name="fade">
      <div v-if="isLoading" class="loader-wrapper">
        <ui-loader />
      </div>
    </Transition>
    <transition name="fade">
      <div v-if="!isLoading" class="lessons-content">
        <div class="header">
          <div class="backBtn">
            <component
              class="back-icon"
              :is="backIcon"
              @click="navigateTo('/')"
            />
            <ui-button class="btn" @click="navigateTo('/')"
              ><p class="text-calendar btn-text">Назад</p></ui-button
            >
          </div>
          <p class="text-calendar title">Выберите занятие</p>
        </div>
        <div class="list" v-if="lessons.length">
          <template v-for="lesson in lessons" :key="lesson.id">
            <div class="lesson">
              <div class="time">
                <p class="text-calendar text-time">
                  {{ getTime(lesson.startTime) }}
                </p>
              </div>
              <div class="info">
                <p class="text-calendar text-info">{{ lesson.group.name }}</p>
                <p class="text-calendar text-info">{{ lesson.venue.name }}</p>
              </div>
            </div>
          </template>
        </div>
        <p class="text-calendar title" v-else>Уроков нет</p>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import backIcon from "~/assets/icons/circle-arrow-left.svg";
import bridge from "@vkontakte/vk-bridge";

type Lesson = {
  id: number;
  startTime: string;
  endTime: string;
  group: {
    id: number;
    name: string;
  };
  venue: {
    id: number;
    name: string;
  };
};

const isLoading = ref(true);
const lessons = ref<Lesson[]>([]);
const { selectedDate } = useSelectedDate();

onMounted(async () => {
  await fetchLessons();
});

const fetchLessons = async () => {
  try {
    const { id: userId } = await bridge.send("VKWebAppGetUserInfo");

    const response = await $fetch<Lesson[]>(
      "https://e421059c-bd25-42d6-bdf4-4f0d21f32b75.tunnel4.com/api/miniapp/getLessonsForUser",
      {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "1",
        },
        query: {
          date: selectedDate.value.toISOString(),
          userId,
        },
      },
    );
    lessons.value = response;
  } catch (error) {
    console.error("Error fetching lessons:", error);
  } finally {
    isLoading.value = false;
  }
};

const getTime = (date: string) => {
  const newDate = toZonedTime(new Date(date), "UTC");
  return format(newDate, "HH:mm");
};
</script>

<style scoped>
.content {
  height: 800px;
  display: flex;
  justify-content: center;
  position: relative; /* Добавлено */
}

.lessons-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.list {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.lesson {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 12px;
  background-color: white;
  width: 95%;
  height: 85px;
  margin-bottom: 13.25px;
  box-shadow: 0 6px 32px 2px rgba(0, 0, 0, 0.08);
}

.back-icon {
  display: none;
}

@media (max-width: 600px) {
  .back-icon {
    display: block;
  }
  .btn {
    display: none;
  }

  .lesson {
    height: 51px;
    box-shadow: 0px 4px 4px 0px #00000040 !important;
  }

  .time {
    padding-left: 12px !important;
  }

  .info {
    padding-right: 12px !important;
  }

  .text-time {
    font-size: 18px !important;
  }

  .text-info {
    font-size: 14px !important;
  }

  .title {
    font-size: 16px !important;
  }
}

.loader-wrapper {
  position: absolute; /* Изменено с relative */
  top: 50%; /* Добавлено */
  left: 50%; /* Добавлено */
  transform: translate(-50%, -50%); /* Добавлено */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10; /* Добавлено */
}

.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 95%;
  padding-top: 15px;
  padding-bottom: 30px;
}

.time {
  padding-left: 48px;
}

.info {
  padding-right: 48px;
}

.text-time {
  font-size: 32px;
  color: #324260;
}

.text-info {
  font-size: 20px;
  color: #6a758b;
  text-align: end;
}

.title {
  font-size: 20px;
  color: #324260;
}

.btn-text {
  font-size: 16px;
  color: white !important;
}

.btn {
  min-width: 89px;
}

p {
  margin: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease; /* Увеличено время с 0.3s до 0.5s */
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
