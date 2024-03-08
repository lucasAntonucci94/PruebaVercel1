<template>
  <section class="container-fluid pt-5">
    <h1 class="mb-4 px-1 sr-only">Listado de chats</h1>

  
    <div class="row d-flex justify-content-center align-items-center">
      <template v-if="!hasChats">
        <p class="p-5 text-center h4">
          NO TIENE CHATS DISPONIBLES
        </p>
      </template>
      <template v-else>
            <section class="col-4"  style="height:  100%;">
        <div id="chat-message-list">
          <Loader v-if="isLoading.value" class="gray" />
          <template v-else>
            <div class="bg-light px-5 py-2 rounded border shadow">
              <div
                v-for="chat in chats"
                style="text-decoration: none; background-color: #f3f3f3"
                class="m-1 text-center rounded border border-secondary p-3"
              >
                <div class="row d-flex justify-content-center align-items-center">
                    <div class="col-1">
                           <img
                            src="imgs/image-avatar.png"
                            alt="image-avatar"
                            style="width: 45px; height: 45px;border-radius: 35px;"
                        />
                    </div>
                    <div class="col-10">

                        <b class="text-secondary">
                            <router-link
                            style="text-decoration: none"
                            :to="`/user/${chat.user}/chatList/chat`"
                        >
                            <span class="text-dark"> {{ chat.user }} </span>
                            (Ver chat)
                        </router-link>
                        <br>
                        (<DateFormatted :date="chat.timestamp" />)
                        </b>
                    </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </section>
      <section class="col-8 bg-light d-flex justify-content-center align-items-center " style="height:  100%;">
        <div class="col-12 py-2">
          <h1 class="mb-4 h4 sr-only">Chat con : Usuario</h1>
          <!-- <h1 class="mb-4 h4">Chat con {{ otherUser.email }}</h1> -->

          <div class="p-3 mb-3 border rounded" style="min-height: 400px">
            <div v-for="message in messages" class="mb-2">
              <b>
                (<DateFormatted :date="message.created_at" />)
                <router-link :to="`/user/${message.user}`">{{
                  message.user
                }}</router-link>
                dijo</b
              >: {{ message.message }}
            </div>
          </div>

          <form action="#" @submit.prevent="sendMessage">
            <div class="d-flex justify-content-start">
              <label for="message" class="visually-hidden">Mensaje</label>
              <input
                type="text"
                id="message"
                class="form-control me-3"
                v-model="formMessage"
              />
              <button type="submit" class="btn btn-primary">ENVIAR</button>
            </div>
          </form>
        </div>
      </section>
      </template>
      


    </div>
  </section>
</template>
<script>
import { getChatsByEmail } from "../chat/chat.js";
import { listenForAuthChanges } from "../auth/auth.js";
import DateFormatted from "../components/DateFormatted.vue";
import ButtonSubmitLoader from "../components/ButtonSubmitLoader.vue";
import Loader from "../components/Loader.vue";

export default {
  name: "ChatList",
  components: { Loader, ButtonSubmitLoader, DateFormatted },
  props: {},
  data: () => ({
    chats: [],
    user: {},

    isLoading: true,
    authUnsubscribe: () => {},
    chatUnsubscribe: () => {},
  }),
  computed: {
    hasChats(){
      if(this.chats.length > 0)
        return true
      else 
        return false
    }
  },
  methods: {
    async getChatsByUserEmail(email) {
      this.isLoading = true;
      const chats = await getChatsByEmail(email);
      

      var chatsToShow = [];
      chats.forEach((chat) => {
        Object.keys(chat.user).forEach((element) => {
          if (element != this.user.email) {
            chatsToShow.push({
              id: chat.idDoc,
              user: element,
              timestamp: chat.created_at,
            });
          }
        });
      });
      return chatsToShow;
    },
  },
  mounted() {
    this.authUnsubscribe = listenForAuthChanges((userData) => {
      this.user = userData;
      this.getChatsByUserEmail(userData.email).then((data) => {
        this.chats = data;
      });
      this.isLoading = false;
    });
  },
  unmounted() {
    this.authUnsubscribe();
    this.chatUnsubscribe();
  },
};
</script>

<style></style>
