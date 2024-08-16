<template>
  <section class="container-fluid py-5">
    <div class="row d-flex justify-content-center">
      <div class="col-12 text-center">
        <h1 class="mb-4">Conecta con otros usuarios</h1>
        <button v-if="!showGlobal" class="btn btn-outline-warning w-50 mb-5 d-none" v-on:click="setGlobal()">CHAT DE CONSULTAS</button>
        <button v-if="showGlobal" class="btn btn-warning w-50 mb-5" v-on:click="setGlobal()">VER SOCIAL</button>
      </div>
      <div v-if="!showGlobal" class="col-12">
        <h2 class="mb-4 text-center h3 d-none">Listado de usuarios cercanos</h2>
        <div class="row g-2" >
          <template
            v-for="user in this.users"
            :key="'key_' + user.email"
          >
            <div class="col-3 d-flex-row align-items-center rounded border-secondary text-center border py-3" :style="{ height: '275px', backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.78)), url('${user.photoURLFile}')`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }">
              <div class="wrapper " style="height: 100%;">
                <div>
                  <router-link id="buttonProfile" class="text-white rounded bg-dark p-2" style="border-radius: 10px !important; margin-right: 4px;" :to="`/user/${user.email}`"><i class="fa-solid fa-add"></i></router-link>    
                  <router-link id="buttonProfile" class="text-white rounded bg-dark p-2" style="border-radius: 10px !important; margin-right: 4px;" :to="`/user/${user.email}`"><i class="fa-solid fa-eye"></i></router-link>    
                  <router-link id="buttonChat" class="text-white rounded bg-dark p-2" style="border-radius: 10px !important; margin-right: 4px;" :to="`/user/${user.email}/sociales/chat`"><i class="fa-solid fa-comment-dots"></i></router-link>    
                </div>
                <p id="userName" class="pt-4 h5" > <b> {{ user.displayName ?? user.email }}</b></p>
              </div>  
            </div>
          </template>
        </div>
      </div>
      <div v-else class="col-10">
        <h2 class="mb-4 text-center h3">Chat global(Para consultas)</h2>
        <p class="mb-4 small text-center text-secondary">
          Aquí podrás preguntar sobre cualquier consulta que tengas y quieras
          respuestas al respecto.
        </p>
        
        <div class="row d-flex justify-content-center">
          <section class="col-8 py-3">
            <h2 class="pb-2 h5">Inserte un mensaje:</h2>
            <form action="#" @submit.prevent="send">
              <div class="mb-3">
                <label for="chat-form-message" class="form-label d-none"
                  >Mensaje</label
                >
                <textarea
                  id="chat-form-message"
                  name="message"
                  class="form-control"
                  :disabled="form.isLoading"
                  v-model="form.message"
                ></textarea>
              </div>
              <ButtonSubmitLoader :loading="form.isLoading">
                Enviar
              </ButtonSubmitLoader>
            </form>
          </section>
          <section class="col-8">
            <div id="chat-message-list">
              <Loader v-if="isLoading" class="gray" />
              <template v-else>
                <div
                  v-for="message in messages"
                  class="m-1 bg-light reounded p-3"
                >
                  <b
                    >(<DateFormatted :date="message.timestamp" />)
                    <router-link :to="`/user/${message.user}`">{{
                      message.user
                    }}</router-link>
                    dijo</b
                  >: {{ message.message }}
                </div>
              </template>
            </div>
          </section>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { subscribeToIncomingMessages, saveMessage } from "../chat/chat.js";
import { listenForAuthChanges } from "../auth/auth.js";
import { getAllUsers } from "../users/index.js";
import DateFormatted from "../components/DateFormatted.vue";
import ButtonSubmitLoader from "../components/ButtonSubmitLoader.vue";
import Loader from "../components/Loader.vue";

export default {
  name: "Sociales",
  components: { Loader, ButtonSubmitLoader, DateFormatted },
  props: {},
  data: () => ({
    messages: [],
    users: [],
    userAuth: {},
    showGlobal: false,
    form: {
      user: "",
      message: "",
      isLoading: false,
    },
    isLoading: true,
    chatUnsubscribe: () => {},
    authUnsubscribe: () => {},
  }),
  computed: {},
  methods: {
    async send() {
      this.form.isLoading = true;
      await saveMessage({ ...this.form });
      this.form.isLoading = false;
      this.form.message = "";
    },
    async getUsers() {
      var users = await getAllUsers({ ...this.form });
      var filteredUsers = []
      users.forEach(user => {
        if(user.email != this.userAuth.email)
          filteredUsers.push(user)
      });
      this.users = filteredUsers
    },
    setGlobal() {
      this.showGlobal = !this.showGlobal;
    },
  },
  mounted() {
    this.getUsers()
    this.chatUnsubscribe = subscribeToIncomingMessages((msgs) => {
      this.messages = msgs;
      this.isLoading = false;
    });
    this.authUnsubscribe = listenForAuthChanges((userData) => {
      this.userAuth = userData;
      this.form.user = userData.email;
    });
  },
  unmounted() {
    this.chatUnsubscribe();
    this.authUnsubscribe();
  },
};
</script>

<style>

.wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr 45px ;
  grid-template-rows: 45px 1fr 1fr 1fr 1fr ;
  grid-gap: 10px;
}
#buttonChat {
  grid-column: 3;
  grid-row: 1;
}
#userName {
  grid-column: 1/4;
  grid-row: 5;
}
</style>
