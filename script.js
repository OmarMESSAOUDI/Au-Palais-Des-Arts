// ===== CONFIGURATION =====
const CONFIG = {
    produitsParPage: 6,
    delaiChargement: 1000
};

// ===== ÉTAT GLOBAL =====
let state = {
    panier: [],
    produits: [],
    produitsFiltres: [],
    pageCourante: 1,
    theme: 'light',
    currentReview: 0
};

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation du site Au Palais Des Arts');
    
    initialiserApplication();
    chargerProduits();
    initialiserEvenements();
});

function initialiserApplication() {
    // Charger le panier depuis le localStorage
    const panierSauvegarde = localStorage.getItem('panier_apa');
    if (panierSauvegarde) {
        state.panier = JSON.parse(panierSauvegarde);
        mettreAJourPanier();
    }
    
    // Charger le thème
    const themeSauvegarde = localStorage.getItem('theme_apa');
    if (themeSauvegarde) {
        state.theme = themeSauvegarde;
        document.documentElement.setAttribute('data-theme', state.theme);
        mettreAJourBoutonTheme();
    }
}

function initialiserEvenements() {
    // Navigation mobile
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Panier
    initialiserPanier();
    
    // Thème
    const themeBtn = document.getElementById('themeBtn');
    if (themeBtn) {
        themeBtn.addEventListener('click', changerTheme);
    }
    
    // Filtres produits
    initialiserFiltres();
    
    // Formulaire contact
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            envoyerFormulaireContact();
        });
    }
    
    // Scroll events
    initialiserScrollEvents();
}

// ===== PRODUITS =====
function chargerProduits() {
    console.log('📦 Chargement des produits...');
    
    // Simuler un chargement asynchrone
    setTimeout(() => {
        // Données des produits avec de VRAIES images d'osier qui fonctionnent
        state.produits = [
            {
                id: 1,
                nom: "Panier Royal en Osier",
                prix: 45.00,
                categorie: "panier",
                image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
                description: "Panier d'exception en osier naturel, tissage traditionnel français. Parfait pour le rangement ou la décoration.",
                dimensions: "30x40cm",
                livraison: "48h",
                stock: 15,
                populaire: true
            },
            {
                id: 2,
                nom: "Corbeille Champêtre",
                prix: 28.00,
                categorie: "corbeille",
                image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
                description: "Corbeille authentique pour votre décoration naturelle. Idéale pour les fruits ou le rangement.",
                dimensions: "25x35cm",
                livraison: "48h",
                stock: 8
            },
            {
                id: 3,
                nom: "Panier Jardin Rustique",
                prix: 38.00,
                categorie: "panier",
                image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
                description: "Panier robuste idéal pour le jardin, les courses ou la décoration campagne.",
                dimensions: "35x45cm",
                livraison: "48h",
                stock: 12
            },
            {
                id: 4,
                nom: "Corbeille à Fruits Élégante",
                prix: 32.00,
                categorie: "corbeille",
                image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
                description: "Corbeille raffinée pour présenter vos fruits avec élégance et style naturel.",
                dimensions: "28x38cm",
                livraison: "48h",
                stock: 10
            },
            {
                id: 5,
                nom: "Suspension Naturelle",
                prix: 65.00,
                categorie: "decoration",
                image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
                description: "Luminaire artistique en osier pour une ambiance chaleureuse et naturelle.",
                dimensions: "Diamètre 45cm",
                livraison: "72h",
                stock: 5
            },
            {
                id: 6,
                nom: "Panier Pique-nique",
                prix: 55.00,
                categorie: "panier",
                image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
                description: "Panier spacieux avec anses renforcées, parfait pour vos pique-niques.",
                dimensions: "40x50cm",
                livraison: "48h",
                stock: 7
            }
        ];
        
        state.produitsFiltres = [...state.produits];
        afficherProduits();
        cacherChargement();
        
        console.log('✅ Produits chargés:', state.produits.length);
        
    }, CONFIG.delaiChargement);
}

function afficherProduits() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    const startIndex = (state.pageCourante - 1) * CONFIG.produitsParPage;
    const endIndex = startIndex + CONFIG.produitsParPage;
    const produitsAAfficher = state.produitsFiltres.slice(startIndex, endIndex);
    
    if (produitsAAfficher.length === 0) {
        grid.innerHTML = `
            <div class="no-products" style="grid-column: 1/-1; text-align: center; padding: var(--space-xl);">
                <p style="font-size: 1.2rem; color: var(--text-light); margin-bottom: var(--space-md);">
                    Aucun produit ne correspond à votre recherche
                </p>
                <button class="btn btn-secondary" onclick="reinitialiserFiltres()">
                    Réinitialiser les filtres
                </button>
            </div>
        `;
    } else {
        grid.innerHTML = produitsAAfficher.map(produit => `
            <div class="product-card" data-id="${produit.id}">
                ${produit.populaire ? '<span class="product-badge" style="position: absolute; top: 10px; right: 10px; background: var(--gold); color: var(--primary-green); padding: 5px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: bold;">Populaire</span>' : ''}
                <img src="${produit.image}" alt="${produit.nom}" class="product-image">
                <div class="product-content">
                    <h3 class="product-title">${produit.nom}</h3>
                    <p class="product-description">${produit.description}</p>
                    <div class="product-meta">
                        <span>📏 ${produit.dimensions}</span>
                        <span>🚚 ${produit.livraison}</span>
                    </div>
                    <div class="product-price">${produit.prix.toFixed(2)}€</div>
                    <button class="add-to-cart" onclick="ajouterAuPanier(${produit.id})">
                        Ajouter au panier
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    mettreAJourPagination();
}

function initialiserFiltres() {
    // Filtres par catégorie
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filtrerProduits(filter);
        });
    });
    
    // Recherche
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', () => {
            rechercherProduits(searchInput.value);
        });
        
        searchInput.addEventListener('input', (e) => {
            if (e.target.value === '') {
                rechercherProduits('');
            }
        });
    }
}

function filtrerProduits(categorie) {
    if (categorie === 'all') {
        state.produitsFiltres = [...state.produits];
    } else {
        state.produitsFiltres = state.produits.filter(p => p.categorie === categorie);
    }
    
    state.pageCourante = 1;
    afficherProduits();
}

function rechercherProduits(terme) {
    if (!terme.trim()) {
        state.produitsFiltres = [...state.produits];
    } else {
        const searchTerm = terme.toLowerCase();
        state.produitsFiltres = state.produits.filter(p =>
            p.nom.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm)
        );
    }
    
    state.pageCourante = 1;
    afficherProduits();
}

function mettreAJourPagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    const totalPages = Math.ceil(state.produitsFiltres.length / CONFIG.produitsParPage);
    
    if (totalPages <= 1) {
        pagination.style.display = 'none';
        return;
    }
    
    pagination.style.display = 'flex';
    
    // Boutons précédent/suivant
    const prevBtn = pagination.querySelector('.prev');
    const nextBtn = pagination.querySelector('.next');
    
    prevBtn.disabled = state.pageCourante === 1;
    nextBtn.disabled = state.pageCourante === totalPages;
    
    prevBtn.onclick = () => changerPage(state.pageCourante - 1);
    nextBtn.onclick = () => changerPage(state.pageCourante + 1);
    
    // Numéros de page
    const pageNumbers = pagination.querySelector('.page-numbers');
    pageNumbers.innerHTML = '';
    
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-number ${i === state.pageCourante ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.onclick = () => changerPage(i);
        pageNumbers.appendChild(pageBtn);
    }
}

function changerPage(nouvellePage) {
    state.pageCourante = nouvellePage;
    afficherProduits();
    
    // Scroll vers le haut de la section produits
    const sectionProduits = document.getElementById('produits');
    if (sectionProduits) {
        sectionProduits.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ===== PANIER =====
function initialiserPanier() {
    const cartBtn = document.getElementById('cartBtn');
    const closeCart = document.getElementById('closeCart');
    const overlay = document.getElementById('overlay');
    const cartSidebar = document.getElementById('cartSidebar');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (cartBtn && cartSidebar) {
        cartBtn.addEventListener('click', ouvrirPanier);
    }
    
    if (closeCart && overlay) {
        closeCart.addEventListener('click', fermerPanier);
        overlay.addEventListener('click', fermerPanier);
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', passerCommande);
    }
}

function ajouterAuPanier(produitId) {
    const produit = state.produits.find(p => p.id === produitId);
    if (!produit) return;
    
    const existingItem = state.panier.find(item => item.id === produitId);
    
    if (existingItem) {
        existingItem.quantite += 1;
    } else {
        state.panier.push({
            ...produit,
            quantite: 1
        });
    }
    
    sauvegarderPanier();
    mettreAJourPanier();
    afficherNotification(`${produit.nom} ajouté au panier !`, 'success');
    
    // Ouvrir le panier automatiquement
    ouvrirPanier();
}

function mettreAJourPanier() {
    // Badge
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = state.panier.reduce((sum, item) => sum + item.quantite, 0);
        cartCount.textContent = totalItems;
    }
    
    // Sidebar
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cartItems && cartTotal) {
        if (state.panier.length === 0) {
            cartItems.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: var(--space-xl);">Votre panier est vide</p>';
            cartTotal.textContent = '0,00€';
        } else {
            cartItems.innerHTML = state.panier.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.nom}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h4>${item.nom}</h4>
                        <p>${item.prix.toFixed(2)}€ x ${item.quantite}</p>
                        <div class="cart-item-controls">
                            <button onclick="modifierQuantite(${item.id}, -1)">-</button>
                            <span>${item.quantite}</span>
                            <button onclick="modifierQuantite(${item.id}, 1)">+</button>
                        </div>
                    </div>
                    <button class="remove-item" onclick="supprimerDuPanier(${item.id})">🗑️</button>
                </div>
            `).join('');
            
            const total = state.panier.reduce((sum, item) => sum + (item.prix * item.quantite), 0);
            cartTotal.textContent = `${total.toFixed(2)}€`;
        }
    }
}

function modifierQuantite(produitId, changement) {
    const item = state.panier.find(item => item.id === produitId);
    if (!item) return;
    
    item.quantite += changement;
    
    if (item.quantite <= 0) {
        supprimerDuPanier(produitId);
    } else {
        sauvegarderPanier();
        mettreAJourPanier();
    }
}

function supprimerDuPanier(produitId) {
    state.panier = state.panier.filter(item => item.id !== produitId);
    sauvegarderPanier();
    mettreAJourPanier();
    afficherNotification('Produit retiré du panier', 'info');
}

function ouvrirPanier() {
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    
    if (cartSidebar && overlay) {
        cartSidebar.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function fermerPanier() {
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    
    if (cartSidebar && overlay) {
        cartSidebar.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function passerCommande() {
    if (state.panier.length === 0) {
        afficherNotification('Votre panier est vide', 'error');
        return;
    }
    
    afficherNotification('Commande passée avec succès ! Redirection...', 'success');
    
    // Simulation de commande
    setTimeout(() => {
        state.panier = [];
        sauvegarderPanier();
        mettreAJourPanier();
        fermerPanier();
    }, 2000);
}

function sauvegarderPanier() {
    localStorage.setItem('panier_apa', JSON.stringify(state.panier));
}

// ===== THÈME =====
function changerTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', state.theme);
    localStorage.setItem('theme_apa', state.theme);
    mettreAJourBoutonTheme();
}

function mettreAJourBoutonTheme() {
    const themeBtn = document.getElementById('themeBtn');
    if (themeBtn) {
        themeBtn.textContent = state.theme === 'light' ? '🌙' : '☀️';
    }
}

// ===== FORMULAIRES =====
function envoyerFormulaireContact() {
    const form = document.getElementById('contactForm');
    const button = form.querySelector('button[type="submit"]');
    
    button.disabled = true;
    button.textContent = 'Envoi en cours...';
    
    // Simulation d'envoi
    setTimeout(() => {
        afficherNotification('Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.', 'success');
        form.reset();
        button.disabled = false;
        button.textContent = 'Envoyer mon message';
    }, 2000);
}

// ===== SCROLL EVENTS =====
function initialiserScrollEvents() {
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        // Header scroll
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ===== NOTIFICATIONS =====
function afficherNotification(message, type = 'info') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">×</button>
        </div>
    `;
    
    // Styles pour la notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Bouton de fermeture
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        fermerNotification(notification);
    });
    
    // Fermeture automatique après 5 secondes
    setTimeout(() => {
        fermerNotification(notification);
    }, 5000);
}

function fermerNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// ===== CHARGEMENT =====
function cacherChargement() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// ===== FONCTIONS GLOBALES =====
function reinitialiserFiltres() {
    const searchInput = document.getElementById('searchInput');
    const allFilter = document.querySelector('[data-filter="all"]');
    
    if (searchInput) searchInput.value = '';
    if (allFilter) allFilter.click();
}

// Exposer les fonctions globales
window.ajouterAuPanier = ajouterAuPanier;
window.supprimerDuPanier = supprimerDuPanier;
window.modifierQuantite = modifierQuantite;
window.reinitialiserFiltres = reinitialiserFiltres;

console.log('🎨 Au Palais Des Arts - Script complètement initialisé');
