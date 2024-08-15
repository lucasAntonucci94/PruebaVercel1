import { getFirestore, addDoc, doc, getDocs, updateDoc, deleteDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where, limit } from "firebase/firestore";
import {newGuid} from '../helpers/newGuid.js'
const db = getFirestore();
const locationRef = collection(db, 'locations');

/**
 * Graba un Lugar de Interes en la base de datos.
 *
 * @param {{title: string, detail: string, address: string, socialNetworkLink: string}} data
 * @returns {Promise<void>}
 */
export async function createLocation({title, detail, address, phone, socialNetworkLink}) {
    
    const data = {
        id: newGuid(),
        title,
        detail,
        address,
        phone,
        socialNetworkLink,
        timestamp: serverTimestamp(),
    };

    try {
        return await addDoc(locationRef, data);
    } catch(err) {
        console.error('Error al grabar el lugar de interes. ', err);
    }
}

/**
 * Escucha los mensajes que llegan.
 *
 * @param {function} callback - Callback que se ejecuta cuando haya nuevos mensajes. Automáticamente va a recibir como argumento un array con los mensajes.
 * @returns {function} - Función para cancelar la suscripción.
 */
 export function subscribeToIncomingLocations(callback) {
    const q = query(locationRef, orderBy('timestamp', "desc"));

    return onSnapshot(q, snapshot => {

        const locations = snapshot.docs.map(doc => {
            let location =  doc.data()

            return {
                    idDoc : doc.id,
                    id: newGuid(),
                    title:location.title,
                    detail:location.detail,
                    address:location.address,
                    phone:location.phone,
                    socialNetworkLink:location.socialNetworkLink,
                    timestamp: serverTimestamp(),
                }
            });
        callback(locations);
    });
}


/**
 * Retorna un Location de la base de datos a partir de un ID.
 *
 * @param {{id: string}} id
 * @returns {{post: {id:string, user:string, title:string, body:string, image:string, timestamp:Date}}}
 */
 export const getLocationById = async (id) => {
 
    const queryPost = query(locationRef, where('id', '==', id), limit(1));
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
 export const updateLocation = async (id, data) => {
   const docRef = doc(db, 'locations', id);
   await updateDoc(docRef, {
       title:data.title,
       detail:data.detail,
       address:data.address,
       phone:data.phone,
       socialNetworkLink:data.socialNetworkLink,
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
 export const deleteLocation = async (id) => {
   const docRef = doc(db, 'locations', id);
   await deleteDoc(docRef);
}

