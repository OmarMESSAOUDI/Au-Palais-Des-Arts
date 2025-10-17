// Service Worker pour Au Palais Des Arts - PWA
const CACHE_NAME = 'au-palais-des-arts-v2.0.0';
const API_CACHE_NAME = 'au-palais-des-arts-api-v1';

// URLs à mettre en cache
const STATIC_URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/config.js',
  '/manifest.json',
  '/offline.html',
  '/mentions-legales.html',
  '/cgv.html',
  '/politique-confidentialite.html',
  
  // Images principales
  '/images/logo.png',
  '/images/icon-192x192.png',
  '/images/icon-512x512.png',
  '/images/og-image.jpg',
  
  // Images des produits (placeholder)
  '/images/panier-rectangulaire-jacinthe.jpg',
  '/images/panier-rond-jacinthe.jpg',
  '/images/panier-tresse-rectangulaire.jpg',
  '/images/panier-double-compartiment.jpg',
  '/images/panier-feuilles-palmier.jpg',
  '/images/panier-rond-osier.jpg',
  '/images/panier-ovale-rotin.jpg'
];

// URLs dynamiques (API) à mettre en cache
const DYNAMIC_URLS_TO_CACHE = [
  '/api/products',
  '/api/categories'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('🛠️ Service Worker: Installation en cours...');
  
  event.waitUntil(
    Promise.all([
      // Cache des ressources statiques
      caches.open(CACHE_NAME)
        .then((cache) => {
          console.log('📦 Cache statique ouvert');
          return cache.addAll(STATIC_URLS_TO_CACHE.map(url => new Request(url, { cache: 'reload' })));
        })
        .then(() => {
          console.log('✅ Toutes les ressources statiques sont en cache');
        })
        .catch((error) => {
          console.error('❌ Erreur lors de la mise en cache statique:', error);
        }),
      
      // Cache des ressources dynamiques
      caches.open(API_CACHE_NAME)
        .then((cache) => {
          console.log('📦 Cache dynamique ouvert');
          return cache.addAll(DYNAMIC_URLS_TO_CACHE);
        })
    ]).then(() => {
      // Activation immédiate du Service Worker
      console.log('🚀 Service Worker installé et activé');
      return self.skipWaiting();
    })
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('🎯 Service Worker: Activation en cours...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Supprimer les caches anciens
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            console.log('🗑️ Suppression de l ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker activé avec succès');
      // Prendre le contrôle de toutes les pages
      return self.clients.claim();
    })
  );
});

// Stratégie de cache: Network First avec fallback sur Cache
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Ignorer les requêtes non-GET et les requêtes cross-origin
  if (request.method !== 'GET' || !url.origin.startsWith(self.location.origin)) {
    return;
  }

  // Pour les pages HTML, priorité au réseau
  if (request.headers.get('Accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Mettre à jour le cache avec la nouvelle réponse
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => cache.put(request, responseClone));
          return response;
        })
        .catch(() => {
          // Fallback sur le cache
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Fallback sur la page offline
              return caches.match('/offline.html');
            });
        })
    );
    return;
  }

  // Pour les CSS, JS et images - Cache First
  if (request.url.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|webp)$/)) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            // Retourner la réponse en cache et mettre à jour en arrière-plan
            fetch(request)
              .then((response) => {
                const responseClone = response.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => cache.put(request, responseClone));
              })
              .catch(() => {
                console.log('⚠️ Impossible de mettre à jour le cache pour:', request.url);
              });
            return cachedResponse;
          }
          
          // Si pas en cache, récupérer du réseau
          return fetch(request)
            .then((response) => {
              // Vérifier si la réponse est valide
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              
              // Mettre en cache la nouvelle ressource
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(request, responseToCache);
                });
              
              return response;
            })
            .catch(() => {
              // Si le réseau échoue et pas en cache, retourner une image placeholder pour les images
              if (request.url.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) {
                return new Response(
                  `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%231E6B4E"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Arial" font-size="18">Image non disponible</text></svg>`,
                  { headers: { 'Content-Type': 'image/svg+xml' } }
                );
              }
              
              // Pour les autres ressources, retourner une réponse d'erreur
              return new Response('Ressource non disponible hors ligne', {
                status: 408,
                headers: { 'Content-Type': 'text/plain' }
              });
            });
        })
    );
    return;
  }

  // Pour les données API - Network First
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Mettre en cache la réponse API
          const responseClone = response.clone();
          caches.open(API_CACHE_NAME)
            .then((cache) => cache.put(request, responseClone));
          return response;
        })
        .catch(() => {
          // Fallback sur le cache API
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              
              // Retourner des données par défaut si pas en cache
              return new Response(JSON.stringify({
                error: 'Données non disponibles hors ligne',
                offline: true
              }), {
                headers: { 'Content-Type': 'application/json' }
              });
            });
        })
    );
    return;
  }

  // Stratégie par défaut: Network First
  event.respondWith(
    fetch(request)
      .catch(() => {
        return caches.match(request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // Rediriger vers la page offline pour les routes inconnues
            if (request.headers.get('Accept')?.includes('text/html')) {
              return caches.match('/offline.html');
            }
            
            return new Response('Ressource non disponible', {
              status: 404,
              statusText: 'Not Found'
            });
          });
      })
  );
});

// Gestion des messages depuis le client
self.addEventListener('message', (event) => {
  console.log('📨 Message reçu du client:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      type: 'VERSION_INFO',
      version: '2.0.0',
      cacheName: CACHE_NAME
    });
  }
});

// Gestion des synchronisations en arrière-plan
self.addEventListener('sync', (event) => {
  console.log('🔄 Synchronisation en arrière-plan:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      doBackgroundSync()
        .then(() => {
          console.log('✅ Synchronisation réussie');
        })
        .catch((error) => {
          console.error('❌ Erreur de synchronisation:', error);
        })
    );
  }
});

// Fonction de synchronisation en arrière-plan
async function doBackgroundSync() {
  // Synchroniser les données avec le serveur
  // (à implémenter selon les besoins)
  
  // Exemple: synchroniser le panier
  const clients = await self.clients.matchAll();
  clients.forEach((client) => {
    client.postMessage({
      type: 'SYNC_COMPLETE',
      message: 'Données synchronisées'
    });
  });
}

// Gestion des notifications push
self.addEventListener('push', (event) => {
  console.log('🔔 Notification push reçue');
  
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body || 'Nouvelle notification de Au Palais Des Arts',
    icon: '/images/icon-192x192.png',
    badge: '/images/icon-192x192.png',
    image: data.image,
    data: data.url,
    actions: [
      {
        action: 'view',
        title: 'Voir'
      },
      {
        action: 'dismiss',
        title: 'Fermer'
      }
    ],
    tag: data.tag || 'general',
    renotify: true,
    requireInteraction: true
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Au Palais Des Arts', options)
  );
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  console.log('👆 Notification cliquée:', event.notification.tag);
  
  event.notification.close();
  
  if (event.action === 'view' && event.notification.data) {
    // Ouvrir l'URL de la notification
    event.waitUntil(
      self.clients.matchAll({ type: 'window' })
        .then((clientList) => {
          // Chercher un client déjà ouvert
          for (const client of clientList) {
            if (client.url === event.notification.data && 'focus' in client) {
              return client.focus();
            }
          }
          
          // Ouvrir une nouvelle fenêtre
          if (self.clients.openWindow) {
            return self.clients.openWindow(event.notification.data);
          }
        })
    );
  } else if (event.action === 'dismiss') {
    // Notification fermée
    console.log('Notification fermée');
  } else {
    // Clic sur le corps de la notification
    event.waitUntil(
      self.clients.matchAll({ type: 'window' })
        .then((clientList) => {
          if (clientList.length > 0) {
            return clientList[0].focus();
          }
          return self.clients.openWindow('/');
        })
    );
  }
});

// Gestion de la fermeture des notifications
self.addEventListener('notificationclose', (event) => {
  console.log('📪 Notification fermée:', event.notification.tag);
});

// Gestion des erreurs du Service Worker
self.addEventListener('error', (error) => {
  console.error('🚨 Erreur du Service Worker:', error);
});

// Fonction utilitaire pour nettoyer le cache
async function cleanupOldCaches() {
  const cacheNames = await caches.keys();
  const currentCaches = [CACHE_NAME, API_CACHE_NAME];
  
  return Promise.all(
    cacheNames.map((cacheName) => {
      if (!currentCaches.includes(cacheName)) {
        console.log('🗑️ Nettoyage du cache obsolète:', cacheName);
        return caches.delete(cacheName);
      }
    })
  );
}

// Exécuter le nettoyage au démarrage
cleanupOldCaches().then(() => {
  console.log('🧹 Nettoyage des caches terminé');
});

// Health check du Service Worker
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'health-check') {
    console.log('❤️ Health check du Service Worker');
    event.waitUntil(
      doHealthCheck()
    );
  }
});

async function doHealthCheck() {
  // Vérifier l'état du cache
  const cache = await caches.open(CACHE_NAME);
  const keys = await cache.keys();
  console.log(`📊 État du cache: ${keys.length} ressources en cache`);
  
  // Envoyer un rapport d'état aux clients
  const clients = await self.clients.matchAll();
  clients.forEach((client) => {
    client.postMessage({
      type: 'HEALTH_REPORT',
      cacheSize: keys.length,
      status: 'healthy'
    });
  });
}

console.log('🎉 Service Worker de Au Palais Des Arts chargé avec succès');
