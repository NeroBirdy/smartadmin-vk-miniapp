<template>
  <div class="frame">
    <div class="inside-frame">
      <p class="text-calendar header-text">{{ text }}</p>
      <div class="btns">
        <ui-button class="delete" @click="onClickHandler"
          ><p class="btn-text text-calendar btn-text">Да</p></ui-button
        >
        <ui-button class="back" @click="emit('close')"
          ><p class="btn-text text-calendar">нет</p></ui-button
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{ text: string }>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "confirm"): void;
}>();

function onClickHandler() {
  emit("confirm");
  emit("close");
}
</script>

<style scoped>
.frame {
  /* width: 315px;
  height: 115px; */
  pointer-events: all;
  z-index: 3;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 6px 32px 2px rgba(0, 0, 0, 0.08);
}

.inside-frame {
  margin: 18px 22px;
  text-align: end;
}

.btns {
  padding-top: 20px;
  display: flex;
  justify-content: end;
}

.header-text, .btn-text {
  font-size: 15px;
}

.back {
  background-color: #d33046;
  min-width: 70px;
  margin-left: 13px;
  margin-right: 28px;
}

.delete {
  min-width: 124px;
}

p {
  margin: 0;
}
</style>
