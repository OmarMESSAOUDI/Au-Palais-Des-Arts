// Gestion du panier et des favoris
let panier = JSON.parse(localStorage.getItem('panier')) || [];
let favoris = JSON.parse(localStorage.getItem('favoris')) || [];

// Produits disponibles
const produits = {
    1: { id: 1, nom: "Panier Rectangulaire en Jacinthe d'Eau", prix: 29.99, image: "Panier rectangulaire en jacinthe d'eau.jpg" },
    2: { id: 2, nom: "Panier Rond Jacinthe d'Eau H36.5", prix: 24.99, image: "Panier rond jacinthe d'eau H36.5 cm Lian.jpg" },
    3: { id: 3, nom: "Panier Tressé Rectangulaire", prix: 35.00, image: "Panier tressé rectangulaire.jpg" },
    4: { id: 4, nom: "Panier Double Compartiment", prix: 55.00, image: "Panier à linge double compartiment.jpg" },
    5: { id: 5, nom: "Panier en Feuilles de Palmier", prix: 42.00, image: "Panier à linge en feuilles de palmier.jpg" },
    6: { id: 6, nom: "Panier Rond en Osier", prix: 38.00, image: "Panier à linge rond en osier.jpg" },
    7: { id: 7, nom: "Lot de 4 Paniers en Rotin Naturel", prix: 45.00, image: "Lot de 4 Paniers.jpg" }
};

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', function() {
    initialiserNavigation();
    initialiserPanier();
    initialiserFavoris();
    initialiserProduits();
    initialiserFormulaireCreation();
    initialiserRetourHaut();
    masquerEcranChargement();
});

// Navigation mobile
function initialiserNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
        });
    }
}

// Gestion du panier
function initialiserPanier() {
    const cartBtn = document.getElementById('cartBtn');
    const closePanier = document.getElementById('closePanier');
    const panierModal = document.getElementById('panierModal');
    const viderPanierBtn = document.getElementById('viderPanierBtn');
    const commanderBtn = document.getElementById('commanderBtn');

    // Ouvrir/fermer le panier
    if (cartBtn && panierModal) {
        cartBtn.addEventListener('click', () => panierModal.style.display = 'block');
    }
    if (closePanier && panierModal) {
        closePanier.addEventListener('click', () => panierModal.style.display = 'none');
    }

    // Vider le panier
    if (viderPanierBtn) {
        viderPanierBtn.addEventListener('click', viderPanier);
    }

    // Commander
    if (commanderBtn) {
        commanderBtn.addEventListener('click', () => {
            if (panier.length === 0) {
                afficherNotification('Votre panier est vide', 'error');
                return;
            }
            window.location.href = '#paiement';
            panierModal.style.display = 'none';
        });
    }

    // Fermer en cliquant en dehors
    window.addEventListener('click', (e) => {
        if (e.target === panierModal) {
            panierModal.style.display = 'none';
        }
    });

    mettreAJourCompteurPanier();
}

// Gestion des favoris
function initialiserFavoris() {
    const favoritesBtn = document.getElementById('favoritesBtn');
    const closeFavorites = document.getElementById('closeFavorites');
    const favoritesModal = document.getElementById('favoritesModal');
    const closeFavoritesBtn = document.getElementById('closeFavoritesBtn');

    if (favoritesBtn && favoritesModal) {
        favoritesBtn.addEventListener('click', () => {
            afficherFavoris();
            favoritesModal.style.display = 'block';
        });
    }
    if (closeFavorites && favoritesModal) {
        closeFavorites.addEventListener('click', () => favoritesModal.style.display = 'none');
    }
    if (closeFavoritesBtn && favoritesModal) {
        closeFavoritesBtn.addEventListener('click', () => favoritesModal.style.display = 'none');
    }

    window.addEventListener('click', (e) => {
        if (e.target === favoritesModal) {
            favoritesModal.style.display = 'none';
        }
    });

    mettreAJourCompteurFavoris();
}

// Initialisation des produits
function initialiserProduits() {
    // Boutons "Ajouter au panier"
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            ajouterAuPanier(parseInt(productId));
        });
    });

    // Boutons favoris
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            toggleFavori(parseInt(productId));
        });
    });

    // Mettre à jour l'état des boutons favoris
    mettreAJourBoutonsFavoris();
}

// Fonctions panier
function ajouterAuPanier(productId) {
    const produit = produits[productId];
    if (!produit) return;

    const existingItem = panier.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantite += 1;
    } else {
        panier.push({
            id: productId,
            nom: produit.nom,
            prix: produit.prix,
            image: produit.image,
            quantite: 1
        });
    }

    sauvegarderPanier();
    mettreAJourCompteurPanier();
    afficherNotification(`${produit.nom} ajouté au panier`, 'success');
}

function retirerDuPanier(productId) {
    panier = panier.filter(item => item.id !== productId);
    sauvegarderPanier();
    mettreAJourCompteurPanier();
    afficherPanier();
}

function viderPanier() {
    panier = [];
    sauvegarderPanier();
    mettreAJourCompteurPanier();
    afficherPanier();
    afficherNotification('Panier vidé', 'info');
}

function sauvegarderPanier() {
    localStorage.setItem('panier', JSON.stringify(panier));
}

function mettreAJourCompteurPanier() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = panier.reduce((total, item) => total + item.quantite, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

function afficherPanier() {
    const panierItems = document.getElementById('panier-items');
    if (!panierItems) return;

    if (panier.length === 0) {
        panierItems.innerHTML = '<p class="panier-vide">Votre panier est vide</p>';
        return;
    }

    panierItems.innerHTML = panier.map(item => `
        <div class="panier-item">
            <div class="item-image">
                <img src="${item.image}" alt="${item.nom}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg0MFY0MEgyMFYyMFoiIGZpbGw9IiNEREQiLz4KPHBhdGggZD0iTTI2IDI2VjM0SDM0VjI2SDI2WiIgZmlsbD0iIzlBOUE5QSIvPgo8L3N2Zz4K'">
            </div>
            <div class="item-details">
                <h4>${item.nom}</h4>
                <p class="item-price">${item.prix.toFixed(2)}€</p>
            </div>
            <div class="item-quantity">
                <button class="quantity-btn" onclick="modifierQuantite(${item.id}, -1)">-</button>
                <span>${item.quantite}</span>
                <button class="quantity-btn" onclick="modifierQuantite(${item.id}, 1)">+</button>
            </div>
            <button class="item-remove" onclick="retirerDuPanier(${item.id})" aria-label="Retirer du panier">×</button>
        </div>
    `).join('');

    mettreAJourTotauxPanier();
}

function modifierQuantite(productId, changement) {
    const item = panier.find(item => item.id === productId);
    if (!item) return;

    item.quantite += changement;

    if (item.quantite <= 0) {
        retirerDuPanier(productId);
    } else {
        sauvegarderPanier();
        mettreAJourCompteurPanier();
        afficherPanier();
    }
}

function mettreAJourTotauxPanier() {
    const sousTotal = panier.reduce((total, item) => total + (item.prix * item.quantite), 0);
    const fraisLivraison = 14.90;
    const total = sousTotal + fraisLivraison;

    const sousTotalEl = document.getElementById('sous-total');
    const fraisLivraisonEl = document.getElementById('frais-livraison');
    const totalEl = document.getElementById('total-panier');

    if (sousTotalEl) sousTotalEl.textContent = `${sousTotal.toFixed(2)}€`;
    if (fraisLivraisonEl) fraisLivraisonEl.textContent = `${fraisLivraison.toFixed(2)}€`;
    if (totalEl) totalEl.textContent = `${total.toFixed(2)}€`;
}

// Fonctions favoris
function toggleFavori(productId) {
    const index = favoris.indexOf(productId);
    
    if (index === -1) {
        favoris.push(productId);
        afficherNotification('Ajouté aux favoris', 'success');
    } else {
        favoris.splice(index, 1);
        afficherNotification('Retiré des favoris', 'info');
    }

    sauvegarderFavoris();
    mettreAJourCompteurFavoris();
    mettreAJourBoutonsFavoris();

    // Mettre à jour l'affichage des favoris si le modal est ouvert
    const favoritesModal = document.getElementById('favoritesModal');
    if (favoritesModal && favoritesModal.style.display === 'block') {
        afficherFavoris();
    }
}

function sauvegarderFavoris() {
    localStorage.setItem('favoris', JSON.stringify(favoris));
}

function mettreAJourCompteurFavoris() {
    const favoritesCount = document.querySelector('.favorites-count');
    if (favoritesCount) {
        favoritesCount.textContent = favoris.length;
    }
}

function mettreAJourBoutonsFavoris() {
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const productId = parseInt(btn.getAttribute('data-product-id'));
        if (favoris.includes(productId)) {
            btn.textContent = '❤️';
            btn.style.color = '#ff4757';
        } else {
            btn.textContent = '🤍';
            btn.style.color = 'inherit';
        }
    });
}

function afficherFavoris() {
    const favoritesItems = document.getElementById('favorites-items');
    if (!favoritesItems) return;

    if (favoris.length === 0) {
        favoritesItems.innerHTML = '<p class="favorites-vide">Aucun produit dans vos favoris</p>';
        return;
    }

    favoritesItems.innerHTML = favoris.map(productId => {
        const produit = produits[productId];
        if (!produit) return '';
        
        return `
            <div class="favorite-item">
                <div class="favorite-image">
                    <img src="${produit.image}" alt="${produit.nom}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yNi42NjY3IDI2LjY2NjdINTMuMzMzNFY1My4zMzM0SDI2LjY2NjdWMjYuNjY2N1oiIGZpbGw9IiNEREQiLz4KPHBhdGggZD0iTTM1IDM1VjQ1SDQ1VjM1SDM1WiIgZmlsbD0iIzlBOUE5QSIvPgo8L3N2Zz4K'">
                </div>
                <div class="favorite-details">
                    <h4>${produit.nom}</h4>
                    <p class="favorite-price">${produit.prix.toFixed(2)}€</p>
                </div>
                <div class="favorite-actions">
                    <button class="btn btn-primary" onclick="ajouterAuPanier(${productId})">Ajouter au panier</button>
                    <button class="btn btn-danger" onclick="toggleFavori(${productId})">Retirer</button>
                </div>
            </div>
        `;
    }).join('');
}

// Formulaire création sur mesure
function initialiserFormulaireCreation() {
    const form = document.getElementById('creationForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulation d'envoi
            const confirmation = document.getElementById('confirmationMessage');
            if (confirmation) {
                confirmation.style.display = 'block';
                form.reset();
                
                setTimeout(() => {
                    confirmation.style.display = 'none';
                }, 5000);
            }
            
            afficherNotification('Votre demande a été envoyée !', 'success');
        });
    }
}

// Retour en haut
function initialiserRetourHaut() {
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.style.display = 'block';
            } else {
                backToTop.style.display = 'none';
            }
        });
        
        backToTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// Écran de chargement
function masquerEcranChargement() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1000);
    }
}

// Notifications
function afficherNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;

    container.appendChild(notification);

    // Auto-suppression après 5 secondes
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Gestion des erreurs d'images
function handleImageError(img) {
    img.style.display = 'none';
    const fallback = document.createElement('div');
    fallback.className = 'image-fallback';
    fallback.innerHTML = '🧺';
    fallback.style.cssText = `
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f5f5f5;
        font-size: 2rem;
    `;
    img.parentNode.appendChild(fallback);
}

// Code promo
function appliquerCodePromo() {
    const input = document.getElementById('codePromoInput');
    const message = document.getElementById('promoMessage');
    const code = input.value.trim().toUpperCase();

    if (code === 'BIENVENUE10') {
        message.textContent = 'Code appliqué ! -10% sur votre commande.';
        message.className = 'promo-message success';
        // Logique pour appliquer la réduction
    } else if (code) {
        message.textContent = 'Code promo invalide.';
        message.className = 'promo-message error';
    } else {
        message.textContent = 'Veuillez entrer un code promo.';
        message.className = 'promo-message error';
    }
}

// Bannière promo
function fermerPromoBanner() {
    const banner = document.getElementById('promoBanner');
    if (banner) {
        banner.style.display = 'none';
    }
}
