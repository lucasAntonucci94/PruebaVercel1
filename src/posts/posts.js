import { getFirestore, addDoc, deleteDoc, doc, getDocs, updateDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where, limit } from "firebase/firestore";
import {newGuid} from '../helpers/newGuid.js'
const db = getFirestore();
const postRef = collection(db, 'posts');

/**
 * Graba un Post en la base de datos.
 *
 * @param {{id: string, user: Object, title: string, body: string}} data
 * @returns {Promise<void>}
 */
export async function savePost({user, title, body, categories}) {
    user.isAdmin = false;
    const data = {
        id: newGuid(),
        user,
        title,
        body,
        categories,
        timestamp: serverTimestamp(),
    };

    try {
        return await addDoc(postRef, data);
    } catch(err) {
        console.error('Error al grabar el Post. ', err);
    }
}

/**
 * Escucha los mensajes que llegan.
 *
 * @param {function} callback - Callback que se ejecuta cuando haya nuevos mensajes. Automáticamente va a recibir como argumento un array con los mensajes.
 * @returns {function} - Función para cancelar la suscripción.
 */
 export function subscribeToIncomingPosts(callback) {
    const q = query(postRef, orderBy('timestamp', "desc"));

    return onSnapshot(q, snapshot => {
        const posts = snapshot.docs.map(doc => {
            let post =  doc.data()
            return {
                    idDoc : doc.id,
                    id : post.id,
                    title: post.title,
                    body: post.body,
                    image: post.image,
                    user: post.user,
                    categories: post.categories,
                    timestamp: post.timestamp
                }
            });
        callback(posts);
    });
}

/**
 * Retorna un listado de publicaciones a partir de los filtros establecidos
 *
 * @param {Array} filters - Este parametro de tipo array contiene todos los filtros seleccionados.
 * @returns {function} - Función para cancelar la suscripción.
 */
export async function find(filters) {
    const posts = []
    
    const q = query(postRef, where('categories', 'array-contains-any', filters ?? []), orderBy("timestamp"))

    const querySnapshot = await getDocs(q)
    
    querySnapshot.forEach((doc) => {
        let post =  doc.data()
        posts.push( {
            idDoc : doc.id,
            id : post.id,
            title: post.title,
            body: post.body,
            image: post.image,
            user: post.user,
            categories: post.categories,
            timestamp: post.timestamp
        })
    });

    return posts
}

/**
 * Retorna un Post de la base de datos a partir de un ID.
 *
 * @param {{id: string}} id
 * @returns {{post: {id:string, user:string, title:string, body:string, image:string, timestamp:Date}}}
 */
 export const getPostById = async (id) => {
 
    const queryPost = query(postRef, where('id', '==', id), limit(1));
    const snapshot = await getDocs(queryPost);
     
    const post = snapshot.docs[0].data();

    return {
        id: post.id,
        title: post.title,
        body: post.body,
        image: post.image,
        timestamp: post.timestamp
    };
}

/**
 * 
 * Actualiza los datos de un POST
 * 
 * @param {string} id
 * @param {{title: string, body: string, image: string}} data
 */
 export const updatePost = async (id, data) => {
    
   const docRef = doc(db, 'posts', id);
   await updateDoc(docRef, {
       title: data.title,
       body: data.body,
       // image: data.image
     });
}

/**
 * 
 * Actualiza los datos de un POST
 * 
 * @param {string} id
 * @param {{title: string, body: string, image: string}} data
 */
 export const deletePost = async (id) => {
    debugger
    const docRef = doc(db, 'posts', id);
    await deleteDoc(docRef);
 }
 

/**
 * 
 * Actualiza el usuario de un POST a partir del ID del Usuario.
 * 
 * @param {string} id
 * @param {id: string, email: string, displayName: string|null} data
 */
 export const updateUserFromPost = async ({id, data}) => {
    // 1- GET POSTS WITH USER ID
    const q = query(postRef, where("user.id", "==", id));
    const postQuerySnapshot = await getDocs(q);
    let postIds = []
    postQuerySnapshot.forEach((doc) => {
        postIds.push(doc.id);
    });
    
    var aux = {
        id,
        ...data
    }
    // 2- Update User From POSTS
    postIds.forEach(idPost => {
        updateDoc(doc(db, 'posts', idPost), {
            user: {
                id,
                ...data
            },
        });
    })
}

/**
 * Escucha los comentarios que llegan para un post especifico.
 *
 * @param {function} callback - Callback que se ejecuta cuando haya nuevos mensajes. Automáticamente va a recibir como argumento un array con los mensajes.
 * @returns {function} - Función para cancelar la suscripción.
 */
 export async function subscribeToIncomingProfilePosts(idUser, callback) {
    
    const q = query(postRef, where('user.id', '==', idUser), orderBy("timestamp"))

    return onSnapshot(q, snapshot => {
        const posts = snapshot.docs.map(doc => {
            let post =  doc.data()
            return {
                idDoc: doc.id,
                id: post.id,
                user: post.user,
                title: post.title,
                body: post.body,
                image: post.image,
                timestamp: post.timestamp
            };
        });
        callback(posts);
    });
}
