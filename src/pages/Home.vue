<template>
 <template v-if="isLoading">
   
    <div class="row">
        <div
            class="col-12 d-flex justify-content-center align-items-center text-white"
            style="
              height: 350px;
              background-image: url('./imgs/bg/bg-profile.jpg');
              background-repeat: no-repeat;
              background-size: cover;
              background-position: center;
            "
          ></div>
            <p class="p-5 text-center h3">
              <strong>
                Debe iniciar sesión para ver el contenido de esta página.
              </strong>
            </p>
    </div>
   </template>       
  <section class="container pt-5">
    
  
  <h1 class="d-none">Home / Feeds generales</h1>
   
   <Alert v-if="message.text !== null" :type="message.type">
          {{ message.text }}
    </Alert>

    <template v-if="!isLoading">
  
    <div class="row d-flex justify-content-center">
      <section class="col-8 greenRoundedContainer">
        <h2 class="sr-only">Crea una publicación</h2>
        <form action="#" @submit.prevent="send">
          <div class="mb-3">
            <label for="post-form-title" class="form-label h5">
              <b> ¿Querés comentar algo? </b>
            </label>
            <input
              type="text"
              name="title"
              id="post-form-title"
              class="form-control"
              placeholder="ingresa un título"
              :disabled="form.isLoading"
              v-model="form.title"
              style="margin-bottom: 5px"
            />
            <label for="post-form-body" class="form-label d-none"
              >Descripción</label
            >
            <textarea
              id="post-form-body"
              name="body"
              class="form-control"
              placeholder="ingresa una descripción"
              :disabled="form.isLoading"
              v-model="form.body"
              style="margin-bottom: 5px"
            ></textarea>
            <!-- <label for="post-form-image" class="d-none">Upload file:</label>
            <input
              type="file"
              id="post-form-image"
              name="image"
              class="form-control"
              :disabled="form.isLoading"
              @input="form.image = $event.target.files[0]"
            /> -->
            <div class="col-6">
              <label for="photoURL" class="form-label my-2">Imagen</label>
              <input
                type="file"
                id="photoURL"
                class="form-control"
                :disabled="form.isLoading"
                @change="loadImage"
              />
              <!-- <div class="p-5" v-if="photoURL !== null">
                <p>Previsualización de la imagen</p>
                <img 
                  :src="photoURL"
                  alt=""
                  ref="previewImage"
                  class=".img-fluid"    
                  style="width: 100%;"
                />
              </div> -->
            </div>
            <div v-if="categories" class=" mt-2 rounded" >
            
               <button class="btn mb-1 border border-light" style="background-color:#22223442" v-on:click.prevent="showCategories(1)"> <label class="text-white text-white">
                   <span v-if="!toShow"> OCULTAR </span><span v-else> MOSTRAR </span>CATEGORÍAS <i class="fa-solid fa-caret-down"></i>
                </label
                ></button><br />
              <template   v-if="!toShow"  v-for="category in this.categories" :key="category.id">
                <div class="d-inline-flex p-2">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :id="category.id"
                    :value="category"
                    v-model="this.form.categories"
                    style="margin-right: 5px"
                  />
                  <label class="form-check-label" :for="category.id"> <b> {{
                    category.name
                  }}</b></label>
                </div>
              </template>
            </div>
          </div>
          <ButtonSubmitLoader :loading="form.isLoading">
           <b> ENVIAR </b>
          </ButtonSubmitLoader>
        </form>
      </section>
      <section class="col-8 border py-2 mt-1 mb-4 text-white greenRoundedContainer" >
        <div  >
            <button class="btn mb-1 border border-light" style="background-color:#22223442" v-on:click.prevent="showCategories(2)"> <label class="text-white text-white">
                <span v-if="!toShow2" >MOSTRAR </span>
                  <span v-else > OCULTAR</span>
                  FILTROS POR CATEGORÍAS <i class="fa-solid fa-caret-down"></i>
              </label
            ></button>
        </div>
        <form
          class="text-white mt-3"
          action="#"
          @submit.prevent="filter"
           v-if="toShow2" 
          
        >
          <template
            v-for="category in this.categories"
            :key="'filter_' + category.id"
          >
            <div class="d-inline-flex px-3 py-2">
              <input
                class="form-check-input"
                type="checkbox"
                :id="'filter_' + category.id"
                :value="category"
                v-model="this.filters"
                style="margin-right: 5px"
              />
              <label class="form-check-label" :for="'filter_' + category.id">{{
                category.name
              }}</label>
            </div>  
          </template>
              <div class="text-center my-4">
                <button type="submit" class="btn btn-outline-warning w-100">
                  <b>
                    ACEPTAR
                  </b>
                </button>
            </div>
        </form>
      </section>
      <section class="col-8" style="padding-right:0px !important; padding-left:0px !important; ">
        <h2 class="sr-only">Listado de Publicaciones</h2>
        <div id="chat-message-list">
          <template v-if="isLoading">
            <Loader class="gray resizeBig" />
            <h3>Debe iniciar sesión para ver el contenido de esta página.</h3>
          </template>
          <template v-else>
            <div v-for="post in posts" :key="'post_' + post.id" class="mb-1">
              <PostComponent
                :post="post"
                :backurl="'home'"
                class="shadow py-3"
              ></PostComponent>
            </div>
          </template>
        </div>
      </section>
    </div>
    </template> 
  </section>
</template>

<script>
import { subscribeToIncomingPosts, savePost, find } from "../posts/posts.js";
import { listenForAuthChanges } from "../auth/auth.js";
import DateFormatted from "../components/DateFormatted.vue";
import ButtonSubmitLoader from "../components/ButtonSubmitLoader.vue";
import Loader from "../components/Loader.vue";
import PostComponent from "../components/Post.vue";
import { getCategories } from "../categories/index.js";
import Alert from "../components/Alert.vue";
export default {
  name: "Post",
  components: {
    Alert,
    Loader,
    ButtonSubmitLoader,
    DateFormatted,
    PostComponent,
  },
  props: {},
  data: () => ({
    posts: [],
    categories: [],
    message: {
        text: null,
        type: "danger",
    },
    checkedCategories: [],
    filters: [],
    toShow: false,
    toShow2: false,
    form: {
      user: "",
      title: "",
      body: "",
      imageBase64: null,
      categories: [],
      isLoading: false,
    },
    isLoading: true,
    postUnsubscribe: () => {},
    authUnsubscribe: () => {},
    imageBase64 : null,
  }),
  computed: {},
  methods: {
    async send() {
        if(this.form.title == "" || this.form.body == ""  )
            this.message = {  
                text: 'Verifique los campos del formulario',
                type: "danger",
            }
        else if(this.form.categories.length == 0)
            this.message = {  
                text: 'Debe seleccionar al menos 1 categoría',
                type: "danger",
            }
        else{
            this.form.isLoading = true;
  

            await savePost({ ...this.form });
            this.form.isLoading = false;
            this.form.title = "";
            this.form.body = "";
            this.message.text = null;
        }
    },
    async filter() {
      var posts = await find(
        this.filters.length > 0 ? this.filters : this.categories
      );
      this.posts = posts;
    },
    showCategories(param) {
      if(param == 1)
      this.toShow = !this.toShow
      if(param == 2)
      this.toShow2 = !this.toShow2
    },
    closeAlert () {
        this.message.text = null;
    },
    // funciones de carga de imagen
    loadImage(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          this.imageBase64 = reader.result;
          this.form.imageBase64 = reader.result
          // Aquí puedes procesar o almacenar la imagen base64
          console.log(this.imageBase64);
        };
      }
    }
  },
  mounted() {
    getCategories().then((data) => {
      this.categories = data;
    });
    this.postUnsubscribe = subscribeToIncomingPosts((posts) => {
      this.posts = posts;
      this.isLoading = false;
    });
    this.authUnsubscribe = listenForAuthChanges((userData) => {
      this.form.user = userData;
    });
  },
  unmounted() {
    this.postUnsubscribe();
    this.authUnsubscribe();
  },
};
</script>

<style>
.greenRoundedContainer{
  background-color: #02bcae;
  /* background-color: #ffbd29; */
  color: white;
  padding-top: 2em;
  padding-bottom: 2em;
  border-radius: 15px;
  border: #02bcae 1px solid;
}
.btn-green{
   background-color: #1b2625;
   display: none;
}
</style>
