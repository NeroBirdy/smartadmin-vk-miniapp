import bridge from "@vkontakte/vk-bridge";

export default defineNuxtPlugin(() => {
  bridge.send("VKWebAppInit");

  bridge.subscribe((event) => {
    console.log("VK Event:", event);
  });

  return {
    provide: {
      vkBridge: bridge,
    },
  };
});