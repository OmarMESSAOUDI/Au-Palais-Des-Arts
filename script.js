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
    initSmoothScrolling();
    initBackToTop();
    initAnimations();
    initFormValidation();
    
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
function initImageFallbacks() {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            console.log('Image non trouvée:', this.src);
            if (this.classList.contains('product-img')) {
                this.src = 'https://via.placeholder.com/400x300/1E6B4E/FFFFFF?text=Image+Produit';
            } else if (this.classList.contains('logo-img')) {
                this.style.display = 'none';
                const fallback = this.nextElementSibling;
                if (fallback && fallback.classList.contains('logo-fallback')) {
                    fallback.style.display = 'block';
                }
            }
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
            navMenu.classList.remove('active');
        });
    });
}

// Gestion du panier
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

    // Produits disponibles
    const products = {
        1: { id: 1, name: "Panier Rectangulaire en Jacinthe d'Eau", price: 29.99, image: "images/panier-rectangulaire-jacinthe.jpg" },
        2: { id: 2, name: "Panier Rond Jacinthe d'Eau H36.5", price: 24.99, image: "images/panier-rond-jacinthe.jpg" },
        3: { id: 3, name: "Panier Tressé Rectangulaire", price: 35.00, image: "images/panier-tresse-rectangulaire.jpg" },
        4: { id: 4, name: "Panier Double Compartiment", price: 55.00, image: "images/panier-double-compartiment.jpg" },
        5: { id: 5, name: "Panier en Feuilles de Palmier", price: 42.00, image: "images/panier-feuilles-palmier.jpg" },
        6: { id: 6, name: "Panier Rond en Osier", price: 38.00, image: "images/panier-rond-osier.jpg" },
        7: { id: 7, name: "Panier Ovale en Rotin Naturel", price: 45.00, image: "images/panier-ovale-rotin.jpg" }
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
        cartBtn.addEventListener('click', openCart);
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
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        cartModal.classList.remove('active');
        document.body.style.overflow = '';
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

    // Passer commande
    if (commanderBtn) {
        commanderBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                showNotification('Votre panier est vide', 'error');
                return;
            }
            
            // Simuler un processus de commande
            showNotification('Redirection vers le paiement...', 'success');
            setTimeout(() => {
                // Redirection vers la page de paiement
                window.location.href = 'paiement.html';
            }, 1000);
        });
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
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/60x60/1E6B4E/FFFFFF?text=P'">
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

    if (!isValid) {
        showNotification('Veuillez remplir tous les champs obligatoires', 'error');
    }

    return isValid;
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
    console.log('=== FIN DEBUG ===');
}
