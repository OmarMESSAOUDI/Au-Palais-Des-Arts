const CACHE_NAME = 'au-palais-des-arts-v1.2.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/Au_Palais_Des_Arts.png',
  '/images/panier-rectangulaire-jacinthe.jpg',
  '/images/panier-rond-jacinthe.jpg',
  '/images/panier-tresse-rectangulaire.jpg',
  '/images/panier-double-compartiment.jpg',
  '/images/panier-feuilles-palmier.jpg',
  '/images/panier-rond-osier.jpg',
  '/images/panier-ovale-rotin.jpg',
  'https://via.placeholder.com/400x300/1E6B4E/FFFFFF'
];

// Installation du Service Worker
self.addEventListener('install', function(event) {
  console.log('Service Worker: Installation en cours...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Service Worker: Mise en cache des ressources');
        return cache.addAll(urlsToCache);
      })
      .catch(function(error) {
        console.error('Service Worker: Erreur de mise en cache', error);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', function(event) {
  console.log('Service Worker: Activation en cours...');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Suppression de l\'ancien cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interception des requêtes
self.addEventListener('fetch', function(event) {
  // Ignorer les requêtes non-GET et les requêtes vers l'API
  if (event.request.method !== 'GET' || event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Retourne la réponse en cache ou fetch depuis le réseau
        return response || fetch(event.request)
          .then(function(fetchResponse) {
            // Mise en cache des nouvelles ressources
            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
              return fetchResponse;
            }

            var responseToCache = fetchResponse.clone();
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return fetchResponse;
          })
          .catch(function() {
            // Fallback pour les images
            if (event.request.destination === 'image') {
              return caches.match('/images/fallback.jpg');
            }
            // Fallback pour la page
            if (event.request.destination === 'document') {
              return caches.match('/offline.html');
            }
          });
      })
  );
});

// Gestion des messages depuis le client
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
