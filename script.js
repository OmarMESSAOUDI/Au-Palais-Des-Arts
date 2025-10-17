// Données des produits
const PRODUCTS_DATA = [
    {
        id: 1,
        name: "Panier Rectangulaire en Jacinthe d'Eau",
        description: "Panier élégant en jacinthe d'eau naturelle, tissé à la main par nos artisans marocains. Parfait pour le rangement et la décoration.",
        price: 29.99,
        originalPrice: 29.99,
        image: "images/panier-rectangulaire-jacinthe.jpg",
        badge: "Populaire",
        stock: 3,
        dimensions: "40x30x25cm",
        delivery: "48h",
        features: ["100% naturel", "Tissé main", "Résistant"]
    },
    {
        id: 2,
        name: "Panier Rond Jacinthe d'Eau H36.5",
        description: "Panier rond de 36.5cm de hauteur en jacinthe d'eau, idéal pour la décoration intérieure. Tressage traditionnel marocain.",
        price: 24.99,
        originalPrice: 24.99,
        image: "images/panier-rond-jacinthe.jpg",
        badge: "Nouveau",
        stock: 5,
        dimensions: "Ø35cm x H36.5cm",
        delivery: "48h",
        features: ["Hauteur 36.5cm", "Forme ronde", "Déco intérieure"]
    },
    {
        id: 3,
        name: "Panier Tressé Rectangulaire",
        description: "Panier élégant au design rectangulaire, parfait pour le rangement et la décoration. Tressage traditionnel marocain pour une durabilité exceptionnelle.",
        price: 35.00,
        originalPrice: 35.00,
        image: "images/panier-tresse-rectangulaire.jpg",
        badge: "Best-seller",
        stock: 2,
        dimensions: "40x30x25cm",
        delivery: "48h",
        features: ["Design rectangulaire", "Très résistant", "Polyvalent"]
    },
    {
        id: 4,
        name: "Panier Double Compartiment",
        description: "Innovant et pratique, ce panier à double compartiment vous permet de trier votre linge facilement. Idéal pour une organisation optimale.",
        price: 55.00,
        originalPrice: 55.00,
        image: "images/panier-double-compartiment.jpg",
        badge: "Innovant",
        stock: 8,
        dimensions: "50x40x35cm",
        delivery: "48h",
        features: ["Double compartiment", "Pratique", "Grand format"]
    },
    {
        id: 5,
        name: "Panier en Feuilles de Palmier",
        description: "Panier écologique fabriqué à partir de feuilles de palmier naturelles. Léger, résistant et respectueux de l'environnement.",
        price: 42.00,
        originalPrice: 42.00,
        image: "images/panier-feuilles-palmier.jpg",
        badge: "Écologique",
        stock: 6,
        dimensions: "45x35x30cm",
        delivery: "48h",
        features: ["Écologique", "Léger", "Naturel"]
    },
    {
        id: 6,
        name: "Panier Rond en Osier",
        description: "Panier rond traditionnel en osier de qualité supérieure. Parfait pour le rangement du linge ou comme élément décoratif chaleureux.",
        price: 38.00,
        originalPrice: 38.00,
        image: "images/panier-rond-osier.jpg",
        badge: "Classique",
        stock: 4,
        dimensions: "Diamètre 45cm",
        delivery: "48h",
        features: ["Traditionnel", "Osier naturel", "Déco chaleureuse"]
    },
    {
        id: 7,
        name: "Panier Ovale en Rotin Naturel",
        description: "Élégant panier ovale en rotin naturel, design raffiné pour une touche d'élégance dans votre décoration. Fait main par nos artisans.",
        price: 45.00,
        originalPrice: 45.00,
        image: "images/panier-ovale-rotin.jpg",
        badge: "Exclusivité",
        stock: 7,
        dimensions: "50x30x20cm",
        delivery: "48h",
        features: ["Design ovale", "Rotin naturel", "Élégant"]
    }
];

// Données des avis clients
const AVIS_DATA = [
    {
        id: 1,
        client: "Marie L.",
        initial: "M",
        rating: 5,
        text: "Le panier rectangulaire est absolument magnifique ! La qualité de tissage est exceptionnelle. Savoir qu'il est fait main au Maroc ajoute une valeur sentimentale. Livraison rapide et emballage soigné.",
        date: "15/10/2024"
    },
    {
        id: 2,
        client: "Pierre D.",
        initial: "P",
        rating: 5,
        text: "J'ai offert le panier double compartiment à ma femme et elle en est ravie. Pratique et élégant, il trône maintenant dans notre chambre. La qualité artisanale marocaine est remarquable !",
        date: "12/10/2024"
    },
    {
        id: 3,
        client: "Sophie M.",
        initial: "S",
        rating: 4,
        text: "Très beau panier en feuilles de palmier, léger et résistant. Le côté écologique et l'origine marocaine sont appréciables. Petit bémol : une légère odeur au début, mais qui part rapidement.",
        date: "08/10/2024"
    },
    {
        id: 4,
        client: "Thomas R.",
        initial: "T",
        rating: 5,
        text: "Commande sur mesure réalisée à la perfection ! Les artisans ont parfaitement compris mes attentes. Le résultat dépasse mes espérances. Je recommande vivement pour des projets personnalisés.",
        date: "05/10/2024"
    }
];

// État global de l'application
const APP_STATE = {
    cart: [],
    favorites: [],
    recentlyViewed: [],
    currentPromoCode: null,
    promoApplied: false
};

// Gestion du chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation de Au Palais Des Arts');
    initializeApp();
});

function initializeApp() {
    console.log('📦 Chargement des données...');
    
    // Cache IMMÉDIATEMENT l'écran de chargement
    hideLoadingScreen();
    
    // Initialise toutes les fonctionnalités
    initAppState();
    renderProducts();
    renderAvis();
    initImageFallbacks();
    initNavigation();
    initCart();
    initFavorites();
    initRecentlyViewed();
    initSmoothScrolling();
    initBackToTop();
    initAnimations();
    initFormValidation();
    initProductTracking();
    initPerformanceMonitoring();
    
    console.log('✅ Application initialisée avec succès');
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        console.log('🎬 Masquage de l écran de chargement');
        loadingScreen.style.transition = 'opacity 0.5s ease';
        loadingScreen.style.opacity = '0';
        
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            console.log('✅ Écran de chargement masqué');
        }, 500);
    }
}

// Gestion de l'état de l'application
function initAppState() {
    // Charger depuis le localStorage
    APP_STATE.cart = JSON.parse(localStorage.getItem('cart')) || [];
    APP_STATE.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    APP_STATE.recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    APP_STATE.currentPromoCode = localStorage.getItem('currentPromoCode');
    APP_STATE.promoApplied = localStorage.getItem('promoApplied') === 'true';
    
    console.log('📊 État de l app chargé:', APP_STATE);
}

function saveAppState() {
    localStorage.setItem('cart', JSON.stringify(APP_STATE.cart));
    localStorage.setItem('favorites', JSON.stringify(APP_STATE.favorites));
    localStorage.setItem('recentlyViewed', JSON.stringify(APP_STATE.recentlyViewed));
    localStorage.setItem('currentPromoCode', APP_STATE.currentPromoCode);
    localStorage.setItem('promoApplied', APP_STATE.promoApplied.toString());
}

// Rendu des produits
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = PRODUCTS_DATA.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            <button class="favorite-btn" data-product-id="${product.id}" aria-label="Ajouter aux favoris">
                ${APP_STATE.favorites.includes(product.id.toString()) ? '❤️' : '🤍'}
            </button>
            <div class="product-image-container">
                <div class="product-image">
                    <img src="${product.image}" 
                         alt="${product.name}" 
                         class="product-img" 
                         loading="lazy"
                         width="400"
                         height="300"
                         onerror="handleImageError(this)">
                </div>
            </div>
            <div class="product-content">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-meta">
                    <span>📏 ${product.dimensions}</span>
                    <span>🚚 ${product.delivery}</span>
                </div>
                <div class="product-stock">
                    <span class="stock-indicator ${product.stock > 3 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock'}">
                        ${product.stock > 3 ? '✓ En stock' : product.stock > 0 ? '⚠️ Stock limité' : '✗ Rupture'}
                    </span>
                    ${product.stock > 0 ? `<span class="stock-quantity">(Plus que ${product.stock} disponible${product.stock > 1 ? 's' : ''})</span>` : ''}
                </div>
                <div class="product-origin">🇲🇦 Fait main au Maroc</div>
                <div class="product-price">
                    ${product.originalPrice !== product.price ? 
                        `<span class="price-promo">${product.originalPrice.toFixed(2)}€</span>` : ''}
                    <span class="price-original">${product.price.toFixed(2)}€</span>
                </div>
                <button class="btn btn-primary add-to-cart btn-full" 
                        data-product-id="${product.id}"
                        ${product.stock === 0 ? 'disabled' : ''}>
                    ${product.stock === 0 ? '❌ Rupture de stock' : '➕ Ajouter au panier'}
                </button>
            </div>
        </div>
    `).join('');
    
    console.log('🛍️ Produits affichés:', PRODUCTS_DATA.length);
}

// Rendu des avis
function renderAvis() {
    const avisGrid = document.getElementById('avisGrid');
    if (!avisGrid) return;
    
    avisGrid.innerHTML = AVIS_DATA.map(avis => `
        <div class="avis-card">
            <div class="avis-header">
                <div class="avis-client">
                    <div class="client-avatar">${avis.initial}</div>
                    <div>
                        <h4>${avis.client}</h4>
                        <div class="avis-rating">${'★'.repeat(avis.rating)}${'☆'.repeat(5 - avis.rating)}</div>
                    </div>
                </div>
            </div>
            <p class="avis-text">"${avis.text}"</p>
            <div class="avis-date">${avis.date}</div>
        </div>
    `).join('');
    
    console.log('⭐ Avis affichés:', AVIS_DATA.length);
}

// Gestion des images manquantes
function handleImageError(img) {
    console.log('🖼️ Image non trouvée:', img.src);
    const productName = img.alt || 'Produit';
    const placeholderColor = '1E6B4E';
    img.src = `https://placehold.co/400x300/${placeholderColor}/FFFFFF/png?text=${encodeURIComponent(productName)}`;
    img.style.objectFit = 'cover';
}

function initImageFallbacks() {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            handleImageError(this);
        });
        
        // Optimisation du chargement
        if (img.complete) {
            img.style.opacity = '1';
        } else {
            img.addEventListener('load', function() {
                this.style.opacity = '1';
            });
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
        }
    });
}

// Gestion de la navigation
function initNavigation() {
    console.log('🧭 Initialisation de la navigation');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const header = document.getElementById('header');

    if (!navToggle || !navMenu) {
        console.error('❌ Éléments de navigation non trouvés');
        return;
    }

    // Navigation mobile
    navToggle.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        console.log('📱 Menu mobile ' + (navMenu.classList.contains('active') ? 'ouvert' : 'fermé'));
    });

    // Header scroll effect
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
        
        // Cache le header au scroll down, montre au scroll up
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });

    // Fermer le menu mobile en cliquant sur un lien
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
        });
    });
}

// Gestion des favoris
function initFavorites() {
    console.log('❤️ Initialisation des favoris');
    const favoritesBtn = document.getElementById('favoritesBtn');
    const favoritesModal = document.getElementById('favoritesModal');
    const closeFavorites = document.getElementById('closeFavorites');
    const closeFavoritesBtn = document.getElementById('closeFavoritesBtn');

    // Mettre à jour le compteur des favoris
    function updateFavoritesCount() {
        const favoritesCount = document.querySelector('.favorites-count');
        if (favoritesCount) {
            favoritesCount.textContent = APP_STATE.favorites.length;
        }
    }

    // Initialiser les boutons favoris
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const productId = btn.dataset.productId;
        if (APP_STATE.favorites.includes(productId)) {
            btn.textContent = '❤️';
            btn.classList.add('active');
        }

        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleFavorite(productId, this);
        });
    });

    function toggleFavorite(productId, element) {
        const index = APP_STATE.favorites.indexOf(productId);
        if (index > -1) {
            // Retirer des favoris
            APP_STATE.favorites.splice(index, 1);
            element.textContent = '🤍';
            element.classList.remove('active');
            showNotification('Produit retiré des favoris', 'success');
        } else {
            // Ajouter aux favoris
            APP_STATE.favorites.push(productId);
            element.textContent = '❤️';
            element.classList.add('active');
            showNotification('Produit ajouté aux favoris', 'success');
        }
        
        saveAppState();
        updateFavoritesCount();
        
        // Si la modal des favoris est ouverte, la mettre à jour
        if (favoritesModal.classList.contains('active')) {
            updateFavoritesDisplay();
        }
    }

    // Ouvrir/fermer la modal des favoris
    if (favoritesBtn && favoritesModal) {
        favoritesBtn.addEventListener('click', function() {
            updateFavoritesDisplay();
            favoritesModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeFavorites) {
        closeFavorites.addEventListener('click', closeFavoritesModal);
    }

    if (closeFavoritesBtn) {
        closeFavoritesBtn.addEventListener('click', closeFavoritesModal);
    }

    // Fermer la modal en cliquant à l'extérieur
    favoritesModal.addEventListener('click', function(e) {
        if (e.target === favoritesModal) {
            closeFavoritesModal();
        }
    });

    function closeFavoritesModal() {
        favoritesModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Mettre à jour l'affichage des favoris
    function updateFavoritesDisplay() {
        const favoritesItems = document.getElementById('favorites-items');
        
        if (!favoritesItems) return;

        if (APP_STATE.favorites.length === 0) {
            favoritesItems.innerHTML = '<p class="favorites-vide">Aucun produit dans vos favoris</p>';
            return;
        }

        // Afficher les articles
        favoritesItems.innerHTML = '';
        APP_STATE.favorites.forEach(productId => {
            const product = PRODUCTS_DATA.find(p => p.id.toString() === productId);
            if (product) {
                const itemElement = document.createElement('div');
                itemElement.className = 'favorite-item';
                itemElement.innerHTML = `
                    <div class="favorite-item-image">
                        <img src="${product.image}" alt="${product.name}" onerror="handleImageError(this)">
                    </div>
                    <div class="favorite-item-details">
                        <div class="favorite-item-title">${product.name}</div>
                        <div class="favorite-item-price">${product.price.toFixed(2)}€</div>
                    </div>
                    <div class="favorite-actions">
                        <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">
                            ➕ Panier
                        </button>
                        <button class="remove-favorite" data-product-id="${product.id}">🗑️</button>
                    </div>
                `;
                favoritesItems.appendChild(itemElement);
            }
        });

        // Gestion des boutons d'ajout au panier
        document.querySelectorAll('.favorite-item .add-to-cart').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.dataset.productId);
                const product = PRODUCTS_DATA.find(p => p.id === productId);
                if (product) {
                    addToCart(product);
                    showNotification(`${product.name} ajouté au panier !`, 'success');
                }
            });
        });

        // Gestion des boutons de suppression
        document.querySelectorAll('.remove-favorite').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.dataset.productId;
                const favoriteBtn = document.querySelector(`.favorite-btn[data-product-id="${productId}"]`);
                if (favoriteBtn) {
                    toggleFavorite(productId, favoriteBtn);
                }
            });
        });
    }

    // Initialiser le compteur des favoris
    updateFavoritesCount();
}

// Produits récemment consultés
function initRecentlyViewed() {
    const section = document.getElementById('recently-viewed-section');
    const grid = document.getElementById('recently-viewed-grid');

    function addToRecentlyViewed(productId) {
        APP_STATE.recentlyViewed = APP_STATE.recentlyViewed.filter(id => id !== productId);
        APP_STATE.recentlyViewed.unshift(productId);
        APP_STATE.recentlyViewed = APP_STATE.recentlyViewed.slice(0, CONFIG.PRODUCTS.MAX_RECENTLY_VIEWED);
        saveAppState();
        updateRecentlyViewedDisplay();
    }

    function updateRecentlyViewedDisplay() {
        if (APP_STATE.recentlyViewed.length === 0) {
            if (section) section.style.display = 'none';
            return;
        }

        if (section && grid) {
            section.style.display = 'block';
            
            grid.innerHTML = '';
            APP_STATE.recentlyViewed.forEach(productId => {
                const product = PRODUCTS_DATA.find(p => p.id.toString() === productId);
                if (product) {
                    const productCard = document.createElement('div');
                    productCard.className = 'product-card';
                    productCard.innerHTML = `
                        <div class="product-badge">${product.badge}</div>
                        <button class="favorite-btn" data-product-id="${product.id}" aria-label="Ajouter aux favoris">
                            ${APP_STATE.favorites.includes(product.id.toString()) ? '❤️' : '🤍'}
                        </button>
                        <div class="product-image-container">
                            <div class="product-image">
                                <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy" onerror="handleImageError(this)">
                            </div>
                        </div>
                        <div class="product-content">
                            <h3 class="product-title">${product.name}</h3>
                            <div class="product-origin">🇲🇦 Fait main au Maroc</div>
                            <div class="product-price">
                                <span class="price-original">${product.price.toFixed(2)}€</span>
                            </div>
                            <button class="btn btn-primary add-to-cart btn-full" data-product-id="${product.id}">
                                ➕ Ajouter au panier
                            </button>
                        </div>
                    `;
                    grid.appendChild(productCard);
                }
            });

            // Réinitialiser les événements
            initFavorites();
            document.querySelectorAll('#recently-viewed-grid .add-to-cart').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = parseInt(this.dataset.productId);
                    const product = PRODUCTS_DATA.find(p => p.id === productId);
                    if (product) {
                        addToCart(product);
                        showNotification(`${product.name} ajouté au panier !`, 'success');
                    }
                });
            });
        }
    }

    // Initialiser l'affichage
    updateRecentlyViewedDisplay();
}

// Gestion du panier avec processus de paiement intégré
function initCart() {
    console.log('🛒 Initialisation du panier');
    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('panierModal');
    
    if (!cartModal) {
        console.error('❌ Modal panier non trouvé');
        return;
    }

    const closePanier = document.getElementById('closePanier');
    const viderPanierBtn = document.getElementById('viderPanierBtn');
    const commanderBtn = document.getElementById('commanderBtn');
    const retourPanierBtn = document.getElementById('retourPanierBtn');
    const paiementBtn = document.getElementById('paiementBtn');
    const panierModalTitle = document.getElementById('panierModalTitle');

    // Éléments des étapes
    const panierStep1 = document.getElementById('panier-step-1');
    const panierStep2 = document.getElementById('panier-step-2');
    const actionsStep1 = document.getElementById('actions-step-1');
    const actionsStep2 = document.getElementById('actions-step-2');

    // Mettre à jour le compteur du panier
    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        const totalItems = APP_STATE.cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCount) {
            cartCount.textContent = totalItems;
        }
    }

    // Ajouter au panier
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.productId);
            const product = PRODUCTS_DATA.find(p => p.id === productId);
            
            if (product) {
                addToCart(product);
                showNotification(`${product.name} ajouté au panier !`, 'success');
                
                // Tracking Google Analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'add_to_cart', {
                        currency: 'EUR',
                        value: product.price,
                        items: [{
                            item_id: product.id,
                            item_name: product.name,
                            price: product.price,
                            quantity: 1
                        }]
                    });
                }
            }
        });
    });

    function addToCart(product) {
        const existingItem = APP_STATE.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            APP_STATE.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        saveAppState();
        updateCartCount();
        
        // Si le panier est ouvert, le mettre à jour
        if (cartModal.classList.contains('active')) {
            updateCartDisplay();
        }
    }

    // Ouvrir/fermer le panier
    if (cartBtn && cartModal) {
        cartBtn.addEventListener('click', function() {
            resetToStep1();
            openCart();
        });
    }

    if (closePanier) {
        closePanier.addEventListener('click', closeCart);
    }

    // Fermer le panier en cliquant à l'extérieur
    cartModal.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            closeCart();
        }
    });

    function openCart() {
        updateCartDisplay();
        cartModal.classList.add('active');
        cartBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        cartModal.classList.remove('active');
        cartBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        resetToStep1();
    }

    // Réinitialiser à l'étape 1
    function resetToStep1() {
        panierStep1.style.display = 'block';
        panierStep2.style.display = 'none';
        actionsStep1.style.display = 'flex';
        actionsStep2.style.display = 'none';
        panierModalTitle.textContent = '🛒 Votre Panier';
    }

    // Aller à l'étape de paiement
    function goToPaymentStep() {
        panierStep1.style.display = 'none';
        panierStep2.style.display = 'block';
        actionsStep1.style.display = 'none';
        actionsStep2.style.display = 'flex';
        panierModalTitle.textContent = '💳 Paiement';
    }

    // Retour au panier
    if (retourPanierBtn) {
        retourPanierBtn.addEventListener('click', resetToStep1);
    }

    // Vider le panier
    if (viderPanierBtn) {
        viderPanierBtn.addEventListener('click', function() {
            if (APP_STATE.cart.length > 0) {
                if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
                    APP_STATE.cart = [];
                    saveAppState();
                    updateCartCount();
                    updateCartDisplay();
                    showNotification('Panier vidé', 'success');
                }
            }
        });
    }

    // Passer à l'étape de commande
    if (commanderBtn) {
        commanderBtn.addEventListener('click', function() {
            if (APP_STATE.cart.length === 0) {
                showNotification('Votre panier est vide', 'error');
                return;
            }
            goToPaymentStep();
        });
    }

    // Traitement du paiement
    if (paiementBtn) {
        paiementBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Validation du formulaire de paiement
            if (validatePaymentForm()) {
                // Simulation de traitement de paiement
                showNotification('Traitement de votre paiement en cours...', 'success');
                
                setTimeout(() => {
                    // Simulation de paiement réussi
                    const total = calculateTotal();
                    trackPurchase(total, APP_STATE.cart);
                    
                    showNotification('✅ Paiement réussi ! Merci pour votre commande.', 'success');
                    
                    // Vider le panier
                    APP_STATE.cart = [];
                    saveAppState();
                    updateCartCount();
                    
                    // Fermer la modal
                    closeCart();
                    
                    // Réinitialiser le formulaire
                    document.getElementById('paiementForm').reset();
                    
                }, 2000);
            }
        });
    }

    // Calculer le total
    function calculateTotal() {
        let subtotal = APP_STATE.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Appliquer les réductions
        let discount = 0;
        if (APP_STATE.currentPromoCode && CONFIG.ECOMMERCE.PROMO_CODES[APP_STATE.currentPromoCode]) {
            discount = subtotal * CONFIG.ECOMMERCE.PROMO_CODES[APP_STATE.currentPromoCode];
        }

        // Frais de livraison
        const livraisonOption = document.querySelector('input[name="livraison"]:checked');
        let livraison = CONFIG.ECOMMERCE.SHIPPING.STANDARD;
        if (livraisonOption && livraisonOption.value === 'express') {
            livraison = CONFIG.ECOMMERCE.SHIPPING.EXPRESS;
        }

        // Livraison gratuite au-dessus du seuil
        if (subtotal >= CONFIG.ECOMMERCE.SHIPPING.FREE_THRESHOLD) {
            livraison = 0;
        }

        return subtotal - discount + livraison;
    }

    // Tracking des achats
    function trackPurchase(total, cartItems) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'purchase', {
                transaction_id: 'T' + Date.now(),
                value: total,
                currency: 'EUR',
                items: cartItems.map(item => ({
                    item_id: item.id,
                    item_name: item.name,
                    price: item.price,
                    quantity: item.quantity
                }))
            });
        }
    }

    // Validation du formulaire de paiement
    function validatePaymentForm() {
        const requiredFields = document.querySelectorAll('#paiementForm [required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = '#FF6B6B';
            } else {
                field.style.borderColor = '#1E6B4E';
            }
        });

        if (!isValid) {
            showNotification('Veuillez remplir tous les champs obligatoires', 'error');
            return false;
        }

        // Validation de l'email
        const email = document.getElementById('email').value;
        if (!validateEmail(email)) {
            showNotification('Adresse email invalide', 'error');
            document.getElementById('email').style.borderColor = '#FF6B6B';
            return false;
        }

        // Validation du téléphone
        const telephone = document.getElementById('telephone').value;
        if (!validatePhone(telephone)) {
            showNotification('Numéro de téléphone invalide', 'error');
            document.getElementById('telephone').style.borderColor = '#FF6B6B';
            return false;
        }

        // Validation basique du numéro de carte (simulation)
        const cardNumber = document.getElementById('carte-num').value.replace(/\s/g, '');
        if (cardNumber.length !== 16 || isNaN(cardNumber)) {
            showNotification('Numéro de carte invalide', 'error');
            document.getElementById('carte-num').style.borderColor = '#FF6B6B';
            return false;
        }

        // Validation de la date d'expiration
        const expDate = document.getElementById('carte-exp').value;
        if (!/^\d{2}\/\d{2}$/.test(expDate)) {
            showNotification('Format de date invalide (MM/AA requis)', 'error');
            document.getElementById('carte-exp').style.borderColor = '#FF6B6B';
            return false;
        }

        // Validation du CVV
        const cvv = document.getElementById('carte-cvv').value;
        if (cvv.length < 3 || isNaN(cvv)) {
            showNotification('CVV invalide', 'error');
            document.getElementById('carte-cvv').style.borderColor = '#FF6B6B';
            return false;
        }

        return true;
    }

    // Validation email
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Validation téléphone
    function validatePhone(phone) {
        const re = /^[0-9+\-\s()]{10,}$/;
        return re.test(phone.replace(/\s/g, ''));
    }

    // Mettre à jour l'affichage du panier
    function updateCartDisplay() {
        const panierItems = document.getElementById('panier-items');
        const sousTotal = document.getElementById('sous-total');
        const totalPanier = document.getElementById('total-panier');
        const fraisLivraison = document.getElementById('frais-livraison');
        const panierPromo = document.getElementById('panier-promo');
        const montantPromo = document.getElementById('montant-promo');

        if (!panierItems) return;

        if (APP_STATE.cart.length === 0) {
            panierItems.innerHTML = '<p class="panier-vide">Votre panier est vide</p>';
            if (sousTotal) sousTotal.textContent = '0,00€';
            if (totalPanier) totalPanier.textContent = '0,00€';
            if (panierPromo) panierPromo.style.display = 'none';
            return;
        }

        // Calculer le sous-total
        let subtotal = APP_STATE.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Appliquer les réductions
        let discount = 0;
        if (APP_STATE.currentPromoCode && CONFIG.ECOMMERCE.PROMO_CODES[APP_STATE.currentPromoCode]) {
            discount = subtotal * CONFIG.ECOMMERCE.PROMO_CODES[APP_STATE.currentPromoCode];
        }

        // Frais de livraison
        const livraisonOption = document.querySelector('input[name="livraison"]:checked');
        let livraison = CONFIG.ECOMMERCE.SHIPPING.STANDARD;
        if (livraisonOption && livraisonOption.value === 'express') {
            livraison = CONFIG.ECOMMERCE.SHIPPING.EXPRESS;
        }

        // Livraison gratuite au-dessus du seuil
        if (subtotal >= CONFIG.ECOMMERCE.SHIPPING.FREE_THRESHOLD) {
            livraison = 0;
        }

        const total = subtotal - discount + livraison;

        // Mettre à jour les totaux
        if (sousTotal) sousTotal.textContent = subtotal.toFixed(2) + '€';
        if (totalPanier) totalPanier.textContent = total.toFixed(2) + '€';
        if (fraisLivraison) fraisLivraison.textContent = livraison.toFixed(2) + '€';

        if (discount > 0 && montantPromo && panierPromo) {
            montantPromo.textContent = '-' + discount.toFixed(2) + '€';
            panierPromo.style.display = 'flex';
        } else if (panierPromo) {
            panierPromo.style.display = 'none';
        }

        // Afficher les articles
        panierItems.innerHTML = '';
        APP_STATE.cart.forEach(item => {
            const product = PRODUCTS_DATA.find(p => p.id === item.id);
            const itemElement = document.createElement('div');
            itemElement.className = 'panier-item';
            itemElement.innerHTML = `
                <div class="panier-item-image">
                    <img src="${item.image}" alt="${item.name}" onerror="handleImageError(this)">
                </div>
                <div class="panier-item-details">
                    <div class="panier-item-title">${item.name}</div>
                    <div class="panier-item-price">${item.price.toFixed(2)}€</div>
                </div>
                <div class="panier-item-quantity">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
                <button class="remove-item" data-id="${item.id}">🗑️</button>
            `;
            panierItems.appendChild(itemElement);
        });

        // Gestion des boutons de quantité
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                updateQuantity(id, -1);
            });
        });

        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                updateQuantity(id, 1);
            });
        });

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                removeFromCart(id);
            });
        });

        // Gestion des options de livraison
        document.querySelectorAll('input[name="livraison"]').forEach(radio => {
            radio.addEventListener('change', updateCartDisplay);
        });
    }

    function updateQuantity(productId, change) {
        const item = APP_STATE.cart.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            
            if (item.quantity <= 0) {
                removeFromCart(productId);
            } else {
                saveAppState();
                updateCartCount();
                updateCartDisplay();
            }
        }
    }

    function removeFromCart(productId) {
        APP_STATE.cart = APP_STATE.cart.filter(item => item.id !== productId);
        saveAppState();
        updateCartCount();
        updateCartDisplay();
        showNotification('Article retiré du panier', 'success');
    }

    // Initialiser le compteur du panier
    updateCartCount();
}

// Code promo
function appliquerCodePromo() {
    const input = document.getElementById('codePromoInput');
    const message = document.getElementById('promoMessage');
    const code = input.value.trim().toUpperCase();

    if (CONFIG.ECOMMERCE.PROMO_CODES[code]) {
        APP_STATE.currentPromoCode = code;
        APP_STATE.promoApplied = true;
        saveAppState();
        
        if (message) {
            message.textContent = `Code promo appliqué : -${CONFIG.ECOMMERCE.PROMO_CODES[code] * 100}% sur votre commande !`;
            message.className = 'promo-message success';
        }
        updateCartDisplay();
    } else if (code === '') {
        if (message) {
            message.textContent = 'Veuillez entrer un code promo';
            message.className = 'promo-message error';
        }
    } else {
        if (message) {
            message.textContent = 'Code promo invalide';
            message.className = 'promo-message error';
        }
    }
}

// Navigation fluide
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Bouton retour en haut
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Animations au scroll
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observer les éléments à animer
    document.querySelectorAll('.product-card, .valeur-card, .avis-card, .contact-item').forEach(el => {
        observer.observe(el);
    });
}

// Validation des formulaires
function initFormValidation() {
    const creationForm = document.getElementById('creationForm');
    
    if (creationForm) {
        creationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateCreationForm()) {
                // Simuler l'envoi du formulaire
                showNotification('Votre demande de création sur mesure a été envoyée ! Nous vous contacterons rapidement.', 'success');
                this.reset();
                
                // Tracking Google Analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'generate_lead', {
                        currency: 'EUR',
                        value: 0
                    });
                }
            }
        });
    }
}

function validateCreationForm() {
    const requiredFields = document.querySelectorAll('#creationForm [required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#FF6B6B';
        } else {
            field.style.borderColor = '#1E6B4E';
        }
    });

    // Validation email
    const email = document.getElementById('creation-email').value;
    if (email && !validateEmail(email)) {
        isValid = false;
        document.getElementById('creation-email').style.borderColor = '#FF6B6B';
        showNotification('Adresse email invalide', 'error');
    }

    if (!isValid) {
        showNotification('Veuillez remplir tous les champs obligatoires', 'error');
    }

    return isValid;
}

// Tracking des produits vus
function initProductTracking() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const productId = entry.target.dataset.productId;
                if (productId) {
                    // Tracking de vue de produit
                    if (typeof gtag !== 'undefined') {
                        const product = PRODUCTS_DATA.find(p => p.id.toString() === productId);
                        if (product) {
                            gtag('event', 'view_item', {
                                items: [{
                                    item_id: productId,
                                    item_name: product.name,
                                    category: 'Artisanat'
                                }]
                            });
                        }
                    }
                    
                    // Ajouter aux récemment consultés
                    addToRecentlyViewed(productId);
                }
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.product-card').forEach(card => {
        observer.observe(card);
    });
}

// Monitoring des performances
function initPerformanceMonitoring() {
    // Mesurer le temps de chargement
    window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`⏱️ Temps de chargement: ${loadTime}ms`);
        
        if (loadTime > 3000) {
            console.warn('⚠️ Temps de chargement élevé');
        }
    });

    // Surveiller la mémoire
    if (performance.memory) {
        setInterval(() => {
            const usedMB = (performance.memory.usedJSHeapSize / 1048576).toFixed(2);
            const totalMB = (performance.memory.totalJSHeapSize / 1048576).toFixed(2);
            if (usedMB > 50) {
                console.warn(`⚠️ Utilisation mémoire élevée: ${usedMB}MB / ${totalMB}MB`);
            }
        }, 30000);
    }
}

// Notifications
function showNotification(message, type = 'success') {
    let container = document.getElementById('notificationContainer');
    if (!container) {
        container = createNotificationContainer();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${type === 'success' ? '✅' : '❌'}</span>
            <span>${message}</span>
        </div>
    `;

    container.appendChild(notification);

    // Afficher la notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Cacher et supprimer après 5 secondes
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

function createNotificationContainer() {
    const container = document.createElement('div');
    container.id = 'notificationContainer';
    document.body.appendChild(container);
    return container;
}

// Fermer la bannière promo
function fermerPromoBanner() {
    const banner = document.getElementById('promoBanner');
    if (banner) {
        banner.style.display = 'none';
        localStorage.setItem('promoBannerClosed', 'true');
    }
}

// Vérifier si la bannière promo a déjà été fermée
if (localStorage.getItem('promoBannerClosed') === 'true') {
    const banner = document.getElementById('promoBanner');
    if (banner) {
        banner.style.display = 'none';
    }
}

// Service Worker pour PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('✅ ServiceWorker enregistré avec succès');
            })
            .catch(function(err) {
                console.log('❌ Échec enregistrement ServiceWorker: ', err);
            });
    });
}

// Gestion des erreurs globales
window.addEventListener('error', (e) => {
    console.error('🚨 Erreur globale:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('🚨 Promise rejetée:', e.reason);
    e.preventDefault();
});

// Debug
function debugApp() {
    console.log('=== DEBUG ===');
    console.log('Cart:', APP_STATE.cart);
    console.log('Favorites:', APP_STATE.favorites);
    console.log('Recently Viewed:', APP_STATE.recentlyViewed);
    console.log('Promo Code:', APP_STATE.currentPromoCode);
    console.log('=== FIN DEBUG ===');
}

// Exposer certaines fonctions globalement pour les événements HTML
window.handleImageError = handleImageError;
window.appliquerCodePromo = appliquerCodePromo;
window.fermerPromoBanner = fermerPromoBanner;
window.debugApp = debugApp;
