// ===== CONFIGURATION GLOBALE =====
const CONFIG = {
    // Configuration des produits
    produitsParPage: 8,
    delaiAnimation: 100,
    
    // Configuration API
    api: {
        baseURL: 'https://api.aupalaisdesarts.fr/v1',
        endpoints: {
            produits: '/produits',
            avis: '/avis',
            commandes: '/commandes',
            contact: '/contact'
        },
        timeout: 10000
    },
    
    // Configuration du panier
    panier: {
        taxe: 0.20, // 20% de TVA
        fraisLivraison: 4.90,
        livraisonGratuite: 50.00
    },
    
    // Configuration des performances
    lazyLoading: true,
    debounceDelay: 300
};

// ===== ÉTAT GLOBAL AMÉLIORÉ =====
class StateManager {
    constructor() {
        this.state = {
            panier: this.chargerPanier(),
            produits: [],
            produitsFiltres: [],
            pageCourante: 1,
            totalPages: 1,
            chargement: false,
            theme: this.chargerTheme(),
            filtresActifs: {
                categorie: 'tous',
                recherche: '',
                prixMin: 0,
                prixMax: 200,
                dimensions: '',
                livraisonRapide: false,
                enStock: false
            }
        };
    }

    chargerPanier() {
        try {
            return JSON.parse(localStorage.getItem('panier_apa')) || [];
        } catch (error) {
            console.error('Erreur chargement panier:', error);
            return [];
        }
    }

    sauvegarderPanier() {
        try {
            localStorage.setItem('panier_apa', JSON.stringify(this.state.panier));
        } catch (error) {
            console.error('Erreur sauvegarde panier:', error);
        }
    }

    chargerTheme() {
        return localStorage.getItem('theme_apa') || 'light';
    }

    sauvegarderTheme(theme) {
        try {
            localStorage.setItem('theme_apa', theme);
        } catch (error) {
            console.error('Erreur sauvegarde thème:', error);
        }
    }

    // Getters et setters pour un accès contrôlé
    getPanier() {
        return [...this.state.panier];
    }

    ajouterAuPanier(produit) {
        const existingItem = this.state.panier.find(item => item.id === produit.id);
        
        if (existingItem) {
            existingItem.quantite += 1;
        } else {
            this.state.panier.push({
                ...produit,
                quantite: 1,
                dateAjout: new Date().toISOString()
            });
        }
        
        this.sauvegarderPanier();
        this.emit('panierModifie');
    }

    supprimerDuPanier(produitId) {
        this.state.panier = this.state.panier.filter(item => item.id !== produitId);
        this.sauvegarderPanier();
        this.emit('panierModifie');
    }

    // Système d'événements simple
    events = {};
    on(event, callback) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(callback);
    }

    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    }
}

// ===== APPLICATION PRINCIPALE =====
class Application {
    constructor() {
        this.stateManager = new StateManager();
        this.modules = {};
        this.initialiser();
    }

    async initialiser() {
        try {
            this.afficherChargement();
            
            // Initialiser les modules dans l'ordre
            await this.initialiserModules();
            
            // Charger les données
            await this.chargerDonnees();
            
            // Initialiser les événements
            this.initialiserEvenements();
            
            this.cacherChargement();
            
        } catch (error) {
            this.gestionnaireErreurs.gérer(error, 'initialisation');
        }
    }

    async initialiserModules() {
        this.modules = {
            theme: new GestionnaireTheme(this.stateManager),
            panier: new GestionnairePanier(this.stateManager),
            produits: new GestionnaireProduits(this.stateManager),
            ui: new GestionnaireUI(this.stateManager),
            formulaires: new GestionnaireFormulaires(this.stateManager),
            erreurs: new GestionnaireErreurs(),
            analytics: new GestionnaireAnalytics()
        };
    }

    async chargerDonnees() {
        await this.modules.produits.chargerProduits();
        this.modules.ui.mettreAJourAffichageProduits();
    }

    initialiserEvenements() {
        this.initialiserNavigation();
        this.initialiserIntersectionObserver();
        this.initialiserGestesMobile();
    }

    initialiserNavigation() {
        // Gestion du scroll pour le header
        let lastScrollY = window.scrollY;
        const header = document.getElementById('header');

        const gererScroll = () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Cacher le header au scroll vers le bas
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }

            lastScrollY = currentScrollY;
        };

        // Debounce le scroll pour la performance
        window.addEventListener('scroll', this.debounce(gererScroll, 10));
    }

    initialiserIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Lazy loading des images
                    if (entry.target.dataset.src) {
                        entry.target.src = entry.target.dataset.src;
                        entry.target.removeAttribute('data-src');
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        // Observer les éléments
        document.querySelectorAll('[data-observer]').forEach(el => observer.observe(el));
    }

    initialiserGestesMobile() {
        // Swipe pour le carousel
        let startX = 0;
        const carousel = document.querySelector('.avis-carousel');

        if (carousel) {
            carousel.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            });

            carousel.addEventListener('touchend', (e) => {
                const endX = e.changedTouches[0].clientX;
                const diff = startX - endX;

                if (Math.abs(diff) > 50) { // Seuil de swipe
                    if (diff > 0) {
                        this.modules.ui.carousel.next();
                    } else {
                        this.modules.ui.carousel.previous();
                    }
                }
            });
        }
    }

    // Utilitaires
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    afficherChargement() {
        document.body.classList.add('chargement');
        const progress = document.getElementById('loadingProgress');
        if (progress) {
            let width = 0;
            const interval = setInterval(() => {
                if (width >= 100) {
                    clearInterval(interval);
                } else {
                    width += Math.random() * 10;
                    progress.style.width = Math.min(width, 100) + '%';
                }
            }, 200);
        }
    }

    cacherChargement() {
        setTimeout(() => {
            document.body.classList.remove('chargement');
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
            }
        }, 500);
    }
}

// ===== GESTIONNAIRE DE PRODUITS AMÉLIORÉ =====
class GestionnaireProduits {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.cache = new Map();
    }

    async chargerProduits() {
        try {
            this.stateManager.state.chargement = true;
            
            // Essayer le cache d'abord
            const cacheKey = 'produits';
            if (this.cache.has(cacheKey)) {
                this.stateManager.state.produits = this.cache.get(cacheKey);
                return;
            }

            // Simulation d'API - Remplacer par un vrai appel
            const produits = await this.fetchProduits();
            
            this.stateManager.state.produits = produits;
            this.stateManager.state.produitsFiltres = produits;
            
            // Mettre en cache
            this.cache.set(cacheKey, produits);
            
        } catch (error) {
            throw new Error('Erreur chargement produits: ' + error.message);
        } finally {
            this.stateManager.state.chargement = false;
        }
    }

    async fetchProduits() {
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return [
            {
                id: 1,
                nom: "Panier Royal",
                prix: 45.00,
                categorie: "panier",
                image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&auto=format",
                description: "Panier d'exception en osier naturel, tissage traditionnel français. Parfait pour le rangement ou la décoration.",
                dimensions: "30x40cm",
                poids: "800g",
                livraison: "48h",
                materiau: "Osier naturel français",
                entretien: "Chiffon sec",
                populaire: true,
                stock: 15,
                tags: ["populaire", "traditionnel", "fait-main"]
            },
            {
                id: 2,
                nom: "Corbeille Champêtre",
                prix: 28.00,
                categorie: "corbeille",
                image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&auto=format",
                description: "Corbeille authentique pour votre décoration naturelle et élégante. Idéale pour les fruits ou le rangement.",
                dimensions: "25x35cm",
                poids: "600g",
                livraison: "48h",
                materiau: "Osier brut",
                entretien: "Époussetage",
                stock: 8,
                tags: ["rustique", "pratique"]
            },
            // ... autres produits avec des images de paniers réelles
        ];
    }

    filtrerProduits(filtres) {
        let produitsFiltres = this.stateManager.state.produits.filter(produit => {
            // Filtre catégorie
            const matchCategorie = filtres.categorie === 'tous' || 
                                 produit.categorie === filtres.categorie;
            
            // Filtre recherche
            const matchRecherche = !filtres.recherche || 
                                 produit.nom.toLowerCase().includes(filtres.recherche) ||
                                 produit.description.toLowerCase().includes(filtres.recherche) ||
                                 produit.tags.some(tag => tag.includes(filtres.recherche));
            
            // Filtre prix
            const matchPrix = produit.prix >= filtres.prixMin && 
                            produit.prix <= filtres.prixMax;
            
            // Filtre stock
            const matchStock = !filtres.enStock || produit.stock > 0;
            
            return matchCategorie && matchRecherche && matchPrix && matchStock;
        });

        this.stateManager.state.produitsFiltres = produitsFiltres;
        this.stateManager.state.pageCourante = 1;
        
        // Émettre un événement de filtrage
        this.stateManager.emit('produitsFiltres', produitsFiltres);
    }

    trierProduits(typeTri) {
        const produits = [...this.stateManager.state.produitsFiltres];
        
        switch (typeTri) {
            case 'prix-croissant':
                produits.sort((a, b) => a.prix - b.prix);
                break;
            case 'prix-decroissant':
                produits.sort((a, b) => b.prix - a.prix);
                break;
            case 'nom':
                produits.sort((a, b) => a.nom.localeCompare(b.nom));
                break;
            case 'populaire':
                produits.sort((a, b) => (b.populaire ? 1 : 0) - (a.populaire ? 1 : 0));
                break;
        }
        
        this.stateManager.state.produitsFiltres = produits;
    }
}

// ===== GESTIONNAIRE D'INTERFACE AMÉLIORÉ =====
class GestionnaireUI {
    constructor(stateManager) {
        this.stateManager = stateManager;
        this.carousel = new CarouselAvis();
        this.initialiserComposants();
    }

    initialiserComposants() {
        this.initialiserFiltres();
        this.initialiserPagination();
        this.initialiserModalProduit();
    }

    mettreAJourAffichageProduits() {
        const grille = document.getElementById('grilleProduits');
        const etatChargement = document.getElementById('etatChargement');
        const aucunResultat = document.getElementById('aucunResultat');
        
        if (!grille) return;

        const produits = this.stateManager.state.produitsFiltres;
        const pageCourante = this.stateManager.state.pageCourante;
        const produitsPage = this.getProduitsPage(pageCourante);

        // Gérer les états
        if (this.stateManager.state.chargement) {
            etatChargement.hidden = false;
            grille.hidden = true;
            aucunResultat.hidden = true;
            return;
        }

        etatChargement.hidden = true;
        grille.hidden = false;

        if (produitsPage.length === 0) {
            aucunResultat.hidden = false;
            grille.innerHTML = '';
        } else {
            aucunResultat.hidden = true;
            grille.innerHTML = produitsPage.map(produit => 
                this.genererCarteProduit(produit)
            ).join('');
            
            this.attacherEvenementsProduits();
        }

        this.mettreAJourPagination();
    }

    genererCarteProduit(produit) {
        const badges = this.genererBadges(produit);
        const stockInfo = this.genererInfoStock(produit);
        
        return `
            <article class="produit-card" data-id="${produit.id}" role="listitem">
                <div class="produit-image-container">
                    <img 
                        src="${produit.image}" 
                        alt="${produit.nom} - ${produit.description}"
                        class="produit-image"
                        loading="lazy"
                        data-observer
                    >
                    ${badges}
                </div>
                
                <div class="produit-content">
                    <h3 class="produit-title">${produit.nom}</h3>
                    <p class="produit-description">${produit.description}</p>
                    
                    <div class="produit-meta">
                        <span class="produit-dimensions">📏 ${produit.dimensions}</span>
                        <span class="produit-livraison">🚚 ${produit.livraison}</span>
                    </div>
                    
                    ${stockInfo}
                    
                    <div class="produit-footer">
                        <div class="produit-price">${produit.prix.toFixed(2)}€</div>
                        <button 
                            class="btn btn-primary btn-ajouter-panier" 
                            data-id="${produit.id}"
                            ${produit.stock === 0 ? 'disabled' : ''}
                        >
                            ${produit.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
                        </button>
                    </div>
                </div>
            </article>
        `;
    }

    genererBadges(produit) {
        const badges = [];
        if (produit.populaire) badges.push('<span class="produit-badge badge-populaire">Populaire</span>');
        if (produit.stock < 5 && produit.stock > 0) badges.push('<span class="produit-badge badge-stock">Stock limité</span>');
        if (produit.livraison === '48h') badges.push('<span class="produit-badge badge-livraison">Livraison rapide</span>');
        return badges.join('');
    }

    genererInfoStock(produit) {
        if (produit.stock === 0) {
            return '<div class="produit-stock rupture">Rupture de stock</div>';
        } else if (produit.stock < 5) {
            return `<div class="produit-stock limite">Plus que ${produit.stock} en stock</div>`;
        } else {
            return '<div class="produit-stock disponible">En stock</div>';
        }
    }

    getProduitsPage(page) {
        const start = (page - 1) * CONFIG.produitsParPage;
        const end = start + CONFIG.produitsParPage;
        return this.stateManager.state.produitsFiltres.slice(start, end);
    }

    // ... autres méthodes améliorées
}

// ===== GESTIONNAIRE D'ERREURS =====
class GestionnaireErreurs {
    gérer(erreur, contexte) {
        console.error(`[${contexte}]`, erreur);
        
        // Envoyer à un service de tracking
        this.trackErreur(erreur, contexte);
        
        // Afficher une notification utilisateur
        this.afficherErreurUtilisateur(erreur, contexte);
    }

    trackErreur(erreur, contexte) {
        // Intégration avec un service comme Sentry, Google Analytics, etc.
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                description: `${contexte}: ${erreur.message}`,
                fatal: false
            });
        }
    }

    afficherErreurUtilisateur(erreur, contexte) {
        let message = 'Une erreur est survenue';
        
        if (contexte === 'chargement') {
            message = 'Impossible de charger les produits. Veuillez réessayer.';
        } else if (contexte === 'panier') {
            message = 'Erreur lors de l\'ajout au panier.';
        }
        
        new Notification(message, 'error').afficher();
    }
}

// ===== GESTIONNAIRE D'ANALYTIQUES =====
class GestionnaireAnalytics {
    track(event, data) {
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', event, data);
        }
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', event, data);
        }
        
        // Console en développement
        if (process.env.NODE_ENV === 'development') {
            console.log(`[Analytics] ${event}:`, data);
        }
    }

    trackPageView(page) {
        this.track('page_view', { page_title: page });
    }

    trackProductView(produit) {
        this.track('view_item', {
            currency: 'EUR',
            value: produit.prix,
            items: [{
                item_id: produit.id,
                item_name: produit.nom,
                price: produit.prix,
                item_category: produit.categorie
            }]
        });
    }

    trackAddToCart(produit) {
        this.track('add_to_cart', {
            currency: 'EUR',
            value: produit.prix,
            items: [{
                item_id: produit.id,
                item_name: produit.nom,
                price: produit.prix,
                quantity: 1
            }]
        });
    }
}

// ===== NOTIFICATION SYSTEM AMÉLIORÉ =====
class Notification {
    constructor(message, type = 'info', options = {}) {
        this.message = message;
        this.type = type;
        this.duration = options.duration || 5000;
        this.position = options.position || 'top-right';
        this.id = Date.now() + Math.random();
    }

    afficher() {
        // Créer l'élément de notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${this.type} notification-${this.position}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        notification.innerHTML = this.genererHTML();

        // Ajouter au DOM
        const container = this.getContainer();
        container.appendChild(notification);

        // Animation d'entrée
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Auto-dismiss
        if (this.duration > 0) {
            this.autoDismiss(notification);
        }

        // Gestionnaire de fermeture
        this.attacherFermeture(notification);
    }

    genererHTML() {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        return `
            <div class="notification-content">
                <span class="notification-icon">${icons[this.type] || icons.info}</span>
                <span class="notification-message">${this.message}</span>
                <button class="notification-close" aria-label="Fermer la notification">
                    <span aria-hidden="true">×</span>
                </button>
            </div>
        `;
    }

    getContainer() {
        let container = document.getElementById('notifications-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notifications-container';
            container.className = 'notifications-container';
            document.body.appendChild(container);
        }
        return container;
    }

    autoDismiss(notification) {
        setTimeout(() => {
            this.fermer(notification);
        }, this.duration);
    }

    attacherFermeture(notification) {
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.fermer(notification);
        });
    }

    fermer(notification) {
        notification.classList.remove('show');
        notification.classList.add('hide');
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// ===== INITIALISATION =====
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new Application();
});

// Service Worker pour PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Gestion des erreurs globales
window.addEventListener('error', (event) => {
    if (app && app.modules.erreurs) {
        app.modules.erreurs.gérer(event.error, 'global');
    }
});

window.addEventListener('unhandledrejection', (event) => {
    if (app && app.modules.erreurs) {
        app.modules.erreurs.gérer(event.reason, 'promise');
    }
});
