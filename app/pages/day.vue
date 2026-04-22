<template>
  <div class="content">
    <Transition name="fade">
      <div v-if="isLoading" class="loader-wrapper">
        <ui-loader />
      </div>
    </Transition>
    <Transition name="fade">
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
            <div
              class="lesson"
              :class="lessonStyle"
              @click="onClickHandler(lesson.id)"
            >
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
    </Transition>
  </div>
  <Transition name="fade">
    <div
      class="confirm-overlay"
      v-if="isConfirmOpen"
      @click.stop="onCloseHandler()"
    />
  </Transition>
  <Transition name="confirm">
    <div v-if="isConfirmOpen" class="confirm-wrapper">
      <CustomCalendarConfirm
        :text="confirmationText"
        @close="onCloseHandler()"
        @confirm="confirmHandler()"
      />
    </div>
  </Transition>
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

const selectedLesson = ref();
const currentState = ref("");
const isConfirmOpen = ref(false);
const confirmationText = ref("");

const userId = ref();

const lessonStyle = computed(() => ({
  change: currentState.value != "",
}));

onMounted(async () => {
  await getUserId();
  await getUserState();
  await fetchLessons();
});

const getUserId = async () => {
  const data = await bridge.send("VKWebAppGetUserInfo");
  userId.value = data.id;
  // userId.value = 254516106;
};

const getUserState = async () => {
  try {
    const response = await $fetch<{ state: string }>(
      "https://e421059c-bd25-42d6-bdf4-4f0d21f32b75.tunnel4.com/api/miniapp/getUserState",
      {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "1",
        },
        query: {
          userId: userId.value,
        },
      },
    );
    currentState.value = response.state;
    console.log(response);
  } catch (error) {
    console.error("Error fetching user state:", error);
  }
};

const fetchLessons = async () => {
  try {
    const response = await $fetch<Lesson[]>(
      "https://e421059c-bd25-42d6-bdf4-4f0d21f32b75.tunnel4.com/api/miniapp/getLessonsForUser",
      {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "1",
        },
        query: {
          date: selectedDate.value.toISOString(),
          userId: userId.value,
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

const onClickHandler = (lessonId: number) => {
  const state = currentState.value;
  switch (state) {
    case "cancellationLesson":
      confirmationText.value = "Вы уверены, что хотите удалить урок?";
      break;
    case "changeVenue":
      confirmationText.value = "Вы уверены, что хотите поменять помещение?";
      break;
    case "changeInstructor":
      confirmationText.value = "Вы уверены, что хотите поменять инструктора?";
      break;
    case "changeDate":
      confirmationText.value =
        "Вы уверены, что хотите поменять дату провердения занятия?";
      break;
    default:
      return;
  }
  selectedLesson.value = lessonId;
  isConfirmOpen.value = true;
  console.log(confirmationText.value);
};

const onCloseHandler = () => {
  isConfirmOpen.value = false;
  selectedLesson.value = null;
};

const confirmHandler = async () => {
  const state = currentState.value;
  switch (state) {
    case "cancellationLesson":
      deleteLesson();
      break;
    case "changeVenue":
      break;
    case "changeInstructor":
      break;
    case "changeDate":
      break;
    default:
      return;
  }
};

const deleteLesson = () => {
  isLoading.value = true;
  Promise.all([
    new Promise((resolve) => setTimeout(resolve, 500)),
    fetchLessons(), 
  ]);
  $fetch(
    "https://e421059c-bd25-42d6-bdf4-4f0d21f32b75.tunnel4.com/api/miniapp/deleteLesson",
    {
      method: "DELETE",
      headers: {
        "ngrok-skip-browser-warning": "1",
      },
      body: {
        lessonId: selectedLesson.value,
      },
    },
  );

  bridge.send("VKWebAppClose", { status: "success" });
};
</script>

<style scoped>
.content {
  height: 800px;
  display: flex;
  justify-content: center;
  position: relative;
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
  transition: background-color 0.2s ease;
}

.lesson.change:hover {
  background-color: rgb(218, 218, 218);
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
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
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
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.confirm-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  z-index: 2;
  /* border-radius: 25px; */
}

.confirm-wrapper {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  pointer-events: none;
}

.confirm-enter-active,
.confirm-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.confirm-enter-from,
.confirm-leave-to {
  opacity: 0;
  transform: scale(0.85);
}

.confirm-enter-to,
.confirm-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
