<template>
    <div id="map" style="width: 100%; height: 400px;"></div>
</template>
  
<script setup>
  import { onMounted, ref } from 'vue';
  
  const map = ref(null);
  
  const props = defineProps({
        locations: Array,
    });
  const initMap = () => {
    const mapElement = document.getElementById('map');
    map.value = new google.maps.Map(mapElement, {
      center: { lat: -34.5627, lng: -58.45829 },
      zoom: 13
    });
    

//   // Check for geolocation support
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const userLocation = {
//           lat: position.coords.latitude,
//           lng: position.coords.longitude   

//         };
//         map.value   
//         = new google.maps.Map(mapElement, {
//                 center: userLocation,
//                 zoom: 13
//                 });
//                 // ... rest of your map initialization code
//             },
//             (error) => {
//                 console.error('Geolocation error:', error);
//                 // Fallback to default center if geolocation fails
//                 map.value = new google.maps.Map(mapElement, {
//                 center: { lat: -34.5627, lng: -58.45829 },
//                 zoom: 13
//                 });
//             }
//             );
//         } else {
//             // Browser doesn't support geolocation
//             map.value = new google.maps.Map(mapElement, {
//             center: { lat: -34.5627, lng: -58.45829 },
//             zoom: 13
//             });
//         }

    props.locations.forEach(location => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: location.address }, (results, status) => {
      if (status === 'OK') {
        const marker = new google.maps.Marker({
          map: map.value,
          position: results[0].geometry.location,
          title: location.title
        });
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="info-window">
              <h3 class="info-window__title">${location.title || ''}</h3>
              <p class="info-window__detail">${location.detail || ''}</p>
              <p class="info-window__address">${location.address || ''}</p>
              <ul class="info-window__contact">
                <li class="info-window__contact-item">
                  <span class="info-window__contact-label">Phone:</span>
                  <span class="info-window__contact-value">${location.phone || ''}</span>
                </li>
                <li class="info-window__contact-item">
                  <span class="info-window__contact-label">Social Network:</span>
                  <a href="${location.socialNetworkLink || '#'}">${location.socialNetworkLink || ''}</a>
                </li>
              </ul>
            </div>
          `
        });
        marker.addListener('click', () => {
          infoWindow.open(map.value, marker);
        });
      } else {
        console.error('Geocoding failed: ' + status);
      }
    });
  });
  };
  
  onMounted(initMap);
  
</script>
  
<style scoped>
.info-window {
  padding: 10px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
}

.info-window__title {
  margin-bottom: 5px;
  font-weight: bold;
}

.info-window__detail,
.info-window__address {
  margin-bottom: 10px;
}

.info-window__contact {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-window__contact-item {
  margin-bottom: 5px;
}

.info-window__contact-label {
  font-weight: bold;
  margin-right: 5px;
}

.info-window__contact-value,
.info-window__contact-link {
  color: #333;
}

.info-window__contact-link {
  text-decoration: none;
}
</style>