import { defineStore } from "pinia";
import { getLogin } from "@/api/login";
import { useStorage } from "@vueuse/core";
import router from "@/router";
export const useUserStore = defineStore("user", () => {
  const token = useStorage<string>("token", "");
  async function setLogin(val: object) {
    const res = await getLogin(val);
    console.log(res.data);
    console.log('1111');
    token.value = res.data.data.token;
  }
  function outLogin() {
    token.value = "";
    // resetRouter()
    // location.reload()
    router.replace({ path: "/login" });
  }
  return {
    token,
    setLogin,
    outLogin
  };
});
