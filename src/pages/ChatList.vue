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
                          :src="chat.user != null ? chat.user.imageUrl : '/assets/imgs/image-avatar.png'"
                          alt="image-avatar"
                          style="width: 45px; height: 45px; border-radius: 35px;"
                        />
                      </div>
                      <div class="col-11">
                        <b class="text-secondary">
                          <a href="#" v-on:click.prevent="handleChatSelected(chat.user)">
                            <span class="text-dark "> {{ chat.user }} </span>
                            (Ver chat)
                          </a>
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
      <ChatDetails :selected-user-email="selectedChatUser" />
    </template>
    </div>
  </section>
</template>
<script>
import { getChatsByEmail } from "../chat/chat.js";
import { listenForAuthChanges } from "../auth/auth.js";
import DateFormatted from "../components/DateFormatted.vue";
import ChatDetails from "../components/ChatDetails.vue";
import ButtonSubmitLoader from "../components/ButtonSubmitLoader.vue";
import Loader from "../components/Loader.vue";

export default {
  name: "ChatList",
  components: { Loader, ButtonSubmitLoader, DateFormatted, ChatDetails },
  props: {
  },
  data: () => ({
    chats: [],
    user: {},
    selectedChatUser: null,
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
    handleChatSelected(userEmail) {
      this.selectedChatUser = userEmail;
      // this.$emit('clearMessages');
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
