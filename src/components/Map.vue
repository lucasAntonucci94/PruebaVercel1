<template>
    <div id="map" style="width: 100%; height: 450px;"></div>
</template>
  
<script setup>
  import { onMounted, ref, watch } from 'vue';
  import { onBeforeUnmount } from 'vue';
  
  const map = ref(null);
  
  const props = defineProps({
        locations: Array,
        selectedLocation: Object,
    });
  const initMap = () => {
    const mapElement = document.getElementById('map');
    map.value = new google.maps.Map(mapElement, {
      center: { lat: -34.5627, lng: -58.45829 },
      zoom: 13
    });
    
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
    // // si hay un lugar de interese seleccionado, lo centro
    // if (props.selectedLocation) {
    //   focusMarker(props.selectedLocation);
    // }
  });
  };
  const focusMarker = (location) => {
    if (!map.value) return; // Ensure map is initialized

    const selectedMarker = map.value.markers.find(
      marker => marker.title === location.title
    );

    if (selectedMarker) {
      // Center the map on the selected marker
      map.value.setCenter(selectedMarker.getPosition());

      // Optional: Apply animation
      selectedMarker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(() => selectedMarker.setAnimation(null), 700);
    } else {
      console.error(`No se encontró un marcador con el título: ${location.title}`);
    }
  };

  onMounted(initMap);
  watch(
  () => props.selectedLocation,
  (newLocation) => {
    console.log("WATCHER MAP")
    console.log(newLocation)
    // focusMarker(newLocation);
  }
);
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