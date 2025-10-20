
// Gestion du chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM chargé - Initialisation de l app');
    initializeApp();
});

function initializeApp() {
    console.log('Initialisation de l application');
    
    // Cache IMMÉDIATEMENT l'écran de chargement
    hideLoadingScreen();
    
    // Initialise toutes les fonctionnalités
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
    
    console.log('Application initialisée avec succès');
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        console.log('Masquage de l écran de chargement');
        // Animation de fondu
        loadingScreen.style.transition = 'opacity 0.5s ease';
        loadingScreen.style.opacity = '0';
        
        // Masquer après l'animation
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            console.log('Écran de chargement masqué');
        }, 500);
    } else {
        console.log('Écran de chargement non trouvé');
    }
}

// Gestion des images manquantes
function handleImageError(img) {
    console.log('Image non trouvée:', img.src);
    const productName = img.alt || 'Produit';
    // Créer une image de placeholder plus jolie
    img.src = `data:image/svg+xml;base64,${btoa(`
        <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#1E6B4E"/>
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
                  font-family="Arial, sans-serif" font-size="18" fill="white">
                ${productName}
            </text>
            <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" 
                  font-family="Arial, sans-serif" font-size="14" fill="rgba(255,255,255,0.8)">
                Image non disponible
            </text>
        </svg>
    `)}`;
    img.alt = `Placeholder pour ${productName}`;
}

function initImageFallbacks() {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            handleImageError(this);
        });
    });
}

// Préchargement des images
function preloadImages() {
    const imageUrls = [
        "Panier rectangulaire en jacinthe d'eau.jpg",
        "Panier rond jacinthe d'eau H36.5 cm Lian.jpg",
        "Panier tressé rectangulaire.jpg",
        "Panier à linge double compartiment.jpg",
        "Panier à linge en feuilles de palmier.jpg",
        "Panier à linge rond en osier.jpg",
        "Lot de 4 Paniers.jpg"
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Appeler cette fonction après le chargement de la page
window.addEventListener('load', preloadImages);

// Tracking des produits vus
function initProductTracking() {
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function() {
            const productId = this.dataset.productId;
            addToRecentlyViewed(productId);
        });
    });
}

// Gestion de la navigation
function initNavigation() {
    console.log('Initialisation de la navigation');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const header = document.getElementById('header');

    if (!navToggle || !navMenu) {
        console.error('Éléments de navigation non trouvés');
        return;
    }

    // Navigation mobile
    navToggle.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        console.log('Menu mobile ' + (navMenu.classList.contains('active') ? 'ouvert' : 'fermé'));
    });

    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
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
    console.log('Initialisation des favoris');
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoritesBtn = document.getElementById('favoritesBtn');
    const favoritesModal = document.getElementById('favoritesModal');
    const closeFavorites = document.getElementById('closeFavorites');
    const closeFavoritesBtn = document.getElementById('closeFavoritesBtn');

    // Mettre à jour le compteur des favoris
    function updateFavoritesCount() {
        const favoritesCount = document.querySelector('.favorites-count');
        if (favoritesCount) {
            favoritesCount.textContent = favorites.length;
        }
    }

    // Initialiser les boutons favoris
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const productId = btn.dataset.productId;
        if (favorites.includes(productId)) {
            btn.textContent = '❤️';
            btn.classList.add('active');
        }

        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleFavorite(productId, this);
        });
    });

    function toggleFavorite(productId, element) {
        const index = favorites.indexOf(productId);
        if (index > -1) {
            // Retirer des favoris
            favorites.splice(index, 1);
            element.textContent = '🤍';
            element.classList.remove('active');
            showNotification('Produit retiré des favoris', 'success');
        } else {
            // Ajouter aux favoris
            favorites.push(productId);
            element.textContent = '❤️';
            element.classList.add('active');
            showNotification('Produit ajouté aux favoris', 'success');
        }
        
        saveFavorites();
        updateFavoritesCount();
        
        // Si la modal des favoris est ouverte, la mettre à jour
        if (favoritesModal.classList.contains('active')) {
            updateFavoritesDisplay();
        }
    }

    function saveFavorites() {
        localStorage.setItem('favorites', JSON.stringify(favorites));
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

        if (favorites.length === 0) {
            favoritesItems.innerHTML = '<p class="favorites-vide">Aucun produit dans vos favoris</p>';
            return;
        }

        // Produits disponibles
        const products = {
            1: { id: 1, name: "Panier Rectangulaire en Jacinthe d'Eau", price: 29.99, image: "Panier rectangulaire en jacinthe d'eau.jpg" },
            2: { id: 2, name: "Panier Rond Jacinthe d'Eau H36.5", price: 24.99, image: "Panier rond jacinthe d'eau H36.5 cm Lian.jpg" },
            3: { id: 3, name: "Panier Tressé Rectangulaire", price: 35.00, image: "Panier tressé rectangulaire.jpg" },
            4: { id: 4, name: "Panier Double Compartiment", price: 55.00, image: "Panier à linge double compartiment.jpg" },
            5: { id: 5, name: "Panier en Feuilles de Palmier", price: 42.00, image: "Panier à linge en feuilles de palmier.jpg" },
            6: { id: 6, name: "Panier Rond en Osier", price: 38.00, image: "Panier à linge rond en osier.jpg" },
            7: { id: 7, name: "Lot de 4 Paniers en Rotin Naturel", price: 45.00, image: "Lot de 4 Paniers.jpg" }
        };

        // Afficher les articles
        favoritesItems.innerHTML = '';
        favorites.forEach(productId => {
            const product = products[productId];
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
                const product = products[productId];
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
    let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    const section = document.getElementById('recently-viewed-section');
    const grid = document.getElementById('recently-viewed-grid');

    function addToRecentlyViewed(productId) {
        recentlyViewed = recentlyViewed.filter(id => id !== productId);
        recentlyViewed.unshift(productId);
        recentlyViewed = recentlyViewed.slice(0, 4); // Garder seulement 4 produits
        localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
        updateRecentlyViewedDisplay();
    }

    function updateRecentlyViewedDisplay() {
        if (recentlyViewed.length === 0) {
            if (section) section.style.display = 'none';
            return;
        }

        if (section && grid) {
            section.style.display = 'block';
            
            // Produits disponibles
            const products = {
                1: { id: 1, name: "Panier Rectangulaire en Jacinthe d'Eau", price: 29.99, image: "Panier rectangulaire en jacinthe d'eau.jpg", badge: "Populaire" },
                2: { id: 2, name: "Panier Rond Jacinthe d'Eau H36.5", price: 24.99, image: "Panier rond jacinthe d'eau H36.5 cm Lian.jpg", badge: "Nouveau" },
                3: { id: 3, name: "Panier Tressé Rectangulaire", price: 35.00, image: "Panier tressé rectangulaire.jpg", badge: "Best-seller" },
                4: { id: 4, name: "Panier Double Compartiment", price: 55.00, image: "Panier à linge double compartiment.jpg", badge: "Innovant" },
                5: { id: 5, name: "Panier en Feuilles de Palmier", price: 42.00, image: "Panier à linge en feuilles de palmier.jpg", badge: "Écologique" },
                6: { id: 6, name: "Panier Rond en Osier", price: 38.00, image: "Panier à linge rond en osier.jpg", badge: "Classique" },
                7: { id: 7, name: "Lot de 4 Paniers en Rotin Naturel", price: 45.00, image: "Lot de 4 Paniers.jpg", badge: "Exclusivité" }
            };

            grid.innerHTML = '';
            recentlyViewed.forEach(productId => {
                const product = products[productId];
                if (product) {
                    const productCard = document.createElement('div');
                    productCard.className = 'product-card';
                    productCard.innerHTML = `
                        <div class="product-badge">${product.badge}</div>
                        <button class="favorite-btn" data-product-id="${product.id}" aria-label="Ajouter aux favoris">🤍</button>
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
                    const product = products[productId];
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
    console.log('Initialisation du panier');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('panierModal');
    
    if (!cartModal) {
        console.error('Modal panier non trouvé');
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

    // Produits disponibles
    const products = {
        1: { id: 1, name: "Panier Rectangulaire en Jacinthe d'Eau", price: 29.99, image: "Panier rectangulaire en jacinthe d'eau.jpg" },
        2: { id: 2, name: "Panier Rond Jacinthe d'Eau H36.5", price: 24.99, image: "Panier rond jacinthe d'eau H36.5 cm Lian.jpg" },
        3: { id: 3, name: "Panier Tressé Rectangulaire", price: 35.00, image: "Panier tressé rectangulaire.jpg" },
        4: { id: 4, name: "Panier Double Compartiment", price: 55.00, image: "Panier à linge double compartiment.jpg" },
        5: { id: 5, name: "Panier en Feuilles de Palmier", price: 42.00, image: "Panier à linge en feuilles de palmier.jpg" },
        6: { id: 6, name: "Panier Rond en Osier", price: 38.00, image: "Panier à linge rond en osier.jpg" },
        7: { id: 7, name: "Lot de 4 Paniers en Rotin Naturel", price: 45.00, image: "Lot de 4 Paniers.jpg" }
    };

    // Mettre à jour le compteur du panier
    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCount) {
            cartCount.textContent = totalItems;
        }
    }

    // Ajouter au panier
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.productId);
            const product = products[productId];
            
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
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        saveCart();
        updateCartCount();
        
        // Si le panier est ouvert, le mettre à jour
        if (cartModal.classList.contains('active')) {
            updateCartDisplay();
        }
    }

    // Sauvegarder le panier dans le localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
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
            if (cart.length > 0) {
                if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
                    cart = [];
                    saveCart();
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
            if (cart.length === 0) {
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
                    trackPurchase(total, cart);
                    
                    showNotification('✅ Paiement réussi ! Merci pour votre commande.', 'success');
                    
                    // Vider le panier
                    cart = [];
                    saveCart();
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
        let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Appliquer les réductions
        let discount = 0;
        const promoCode = document.getElementById('codePromoInput')?.value;
        if (promoCode === 'BIENVENUE10') {
            discount = subtotal * 0.1;
        }

        // Frais de livraison
        const livraisonOption = document.querySelector('input[name="livraison"]:checked');
        let livraison = 7.90;
        if (livraisonOption && livraisonOption.value === 'express') {
            livraison = 14.90;
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

        if (cart.length === 0) {
            panierItems.innerHTML = '<p class="panier-vide">Votre panier est vide</p>';
            if (sousTotal) sousTotal.textContent = '0,00€';
            if (totalPanier) totalPanier.textContent = '0,00€';
            if (panierPromo) panierPromo.style.display = 'none';
            return;
        }

        // Calculer le sous-total
        let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Appliquer les réductions
        let discount = 0;
        const promoCode = document.getElementById('codePromoInput')?.value;
        if (promoCode === 'BIENVENUE10') {
            discount = subtotal * 0.1;
        }

        // Frais de livraison
        const livraisonOption = document.querySelector('input[name="livraison"]:checked');
        let livraison = 7.90;
        if (livraisonOption && livraisonOption.value === 'express') {
            livraison = 14.90;
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
        cart.forEach(item => {
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
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            
            if (item.quantity <= 0) {
                removeFromCart(productId);
            } else {
                saveCart();
                updateCartCount();
                updateCartDisplay();
            }
        }
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
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

    if (code === 'BIENVENUE10') {
        if (message) {
            message.textContent = 'Code promo appliqué : -10% sur votre commande !';
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

// Validation des formulaires - CORRECTION POUR LA CONFIRMATION
function initFormValidation() {
    const creationForm = document.getElementById('creationForm');
    const confirmationMessage = document.getElementById('confirmationMessage');
    
    if (creationForm) {
        creationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Formulaire de création soumis');
            
            if (validateCreationForm()) {
                console.log('Formulaire validé, affichage de la confirmation');
                
                // Afficher le message de confirmation
                if (confirmationMessage) {
                    confirmationMessage.style.display = 'block';
                    
                    // Masquer après 10 secondes
                    setTimeout(() => {
                        confirmationMessage.style.display = 'none';
                    }, 10000);
                }
                
                // Afficher aussi une notification
                showNotification('Votre demande de création sur mesure a été envoyée ! Nous vous contacterons rapidement.', 'success');
                
                // Réinitialiser le formulaire
                this.reset();
                
                // Tracking Google Analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'generate_lead', {
                        currency: 'EUR',
                        value: 0
                    });
                }
            } else {
                console.log('Formulaire invalide');
            }
        });
    }
}

function validateCreationForm() {
    const requiredFields = document.querySelectorAll('#creationForm [required]');
    let isValid = true;
    let errorMessage = '';

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#FF6B6B';
            const fieldName = field.getAttribute('name');
            let displayName = fieldName;
            if (displayName) {
                displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
            } else {
                displayName = 'Ce champ';
            }
            errorMessage += `${displayName} est obligatoire. `;
        } else {
            field.style.borderColor = '#1E6B4E';
        }
    });

    // Validation email (seulement si l'email n'est pas vide)
    const email = document.getElementById('creation-email').value;
    if (email && !validateEmail(email)) {
        isValid = false;
        document.getElementById('creation-email').style.borderColor = '#FF6B6B';
        errorMessage += 'Adresse email invalide. ';
    }

    if (!isValid) {
        showNotification(errorMessage, 'error');
    }

    console.log('Validation du formulaire création:', isValid);
    return isValid;
}

// Notifications - CORRECTION POUR LA DURÉE
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

    // Cacher et supprimer après un délai (10s pour erreurs, 5s pour succès)
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, type === 'error' ? 10000 : 5000);
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
    }
}

// Service Worker pour PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// Debug
function debugApp() {
    console.log('=== DEBUG ===');
    console.log('Écran chargement:', document.getElementById('loadingScreen'));
    console.log('Modal panier:', document.getElementById('panierModal'));
    console.log('Bouton panier:', document.getElementById('cartBtn'));
    console.log('Notifications:', document.getElementById('notificationContainer'));
    console.log('Cart local storage:', localStorage.getItem('cart'));
    console.log('Favorites local storage:', localStorage.getItem('favorites'));
    console.log('Recently viewed:', localStorage.getItem('recentlyViewed'));
    console.log('=== FIN DEBUG ===');
}

