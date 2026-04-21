export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const response = await $fetch(
    "https://fatima-pastural-maryanna.ngrok-free.dev/api/miniapp/getLessonsForUser",
    {
      query: {
        date: query.date,
        userId: query.userId,
      },
    },
  );

  return response;
});
