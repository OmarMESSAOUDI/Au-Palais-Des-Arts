// ===== VARIABLES GLOBALES =====
let panier = JSON.parse(localStorage.getItem('panier')) || [];
let notificationTimeout;

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', function() {
    initialiserApp();
});

function initialiserApp() {
    // Gestion du loading screen
    setTimeout(() => {
        document.getElementById('loadingScreen').classList.add('hidden');
    }, 2000);

    // Initialisation des écouteurs d'événements
    initialiserEcouteurs();
    
    // Mise à jour de l'affichage du panier
    mettreAJourPanier();
    
    // Animation au scroll
    initialiserAnimationsScroll();
}

// ===== GESTION DU PANIER =====
function ajouterAuPanier(nom, prix) {
    const produitExistant = panier.find(item => item.nom === nom);
    
    if (produitExistant) {
        produitExistant.quantite++;
    } else {
        panier.push({
            nom: nom,
            prix: prix,
            quantite: 1
        });
    }
    
    sauvegarderPanier();
    mettreAJourPanier();
    afficherNotification('✅ Produit ajouté au panier !', 'success');
}

function supprimerDuPanier(nom) {
    panier = panier.filter(item => item.nom !== nom);
    sauvegarderPanier();
    mettreAJourPanier();
    afficherNotification('🗑️ Produit retiré du panier', 'error');
}

function modifierQuantite(nom, changement) {
    const produit = panier.find(item => item.nom === nom);
    
    if (produit) {
        produit.quantite += changement;
        
        if (produit.quantite <= 0) {
            supprimerDuPanier(nom);
        } else {
            sauvegarderPanier();
            mettreAJourPanier();
        }
    }
}

function viderPanier() {
    if (panier.length === 0) {
        afficherNotification('🛒 Votre panier est déjà vide', 'error');
        return;
    }
    
    if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
        panier = [];
        sauvegarderPanier();
        mettreAJourPanier();
        afficherNotification('🗑️ Panier vidé', 'error');
    }
}

function calculerTotal() {
    return panier.reduce((total, item) => total + (item.prix * item.quantite), 0);
}

function sauvegarderPanier() {
    localStorage.setItem('panier', JSON.stringify(panier));
}

function mettreAJourPanier() {
    const cartCount = document.querySelector('.cart-count');
    const panierItems = document.getElementById('panier-items');
    const totalPanier = document.getElementById('total-panier');
    
    // Mettre à jour le compteur
    const totalItems = panier.reduce((total, item) => total + item.quantite, 0);
    cartCount.textContent = totalItems;
    
    // Mettre à jour l'affichage du panier
    if (panier.length === 0) {
        panierItems.innerHTML = '<p class="panier-vide">Votre panier est vide</p>';
    } else {
        panierItems.innerHTML = panier.map(item => {
            // Échapper les apostrophes pour éviter les erreurs JavaScript
            const nomEchappe = item.nom.replace(/'/g, "\\'");
            return `
                <div class="panier-item">
                    <div class="panier-item-info">
                        <h4>${item.nom}</h4>
                        <p>${item.prix}€ × ${item.quantite}</p>
                    </div>
                    <div class="panier-item-controls">
                        <button class="btn-quantity" onclick="modifierQuantite('${nomEchappe}', -1)">-</button>
                        <span>${item.quantite}</span>
                        <button class="btn-quantity" onclick="modifierQuantite('${nomEchappe}', 1)">+</button>
                        <button class="btn-remove" onclick="supprimerDuPanier('${nomEchappe}')">🗑️</button>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // Mettre à jour le total
    totalPanier.textContent = calculerTotal().toFixed(2) + '€';
}

// ===== GESTION DU MODAL PANIER =====
function ouvrirPanier() {
    document.getElementById('panierModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function fermerPanier() {
    document.getElementById('panierModal').classList.remove('show');
    document.body.style.overflow = 'auto';
}

// ===== NOTIFICATIONS =====
function afficherNotification(message, type) {
    const container = document.getElementById('notificationContainer');
    
    // Supprimer les notifications existantes
    const existingNotifications = container.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    // Créer la nouvelle notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    container.appendChild(notification);
    
    // Afficher la notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Cacher après 3 secondes
    clearTimeout(notificationTimeout);
    notificationTimeout = setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// ===== FORMULAIRES =====
function initialiserFormulaireCreation() {
    const form = document.getElementById('creationForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validation basique
            const nom = document.getElementById('creation-nom').value;
            const email = document.getElementById('creation-email').value;
            const description = document.getElementById('creation-description').value;
            
            if (!nom || !email || !description) {
                afficherNotification('❌ Veuillez remplir tous les champs obligatoires', 'error');
                return;
            }
            
            // Simulation d'envoi
            afficherNotification('🎨 Votre demande a été envoyée ! Nous vous contacterons rapidement.', 'success');
            form.reset();
        });
    }
}

// ===== COMMANDE =====
function passerCommande() {
    if (panier.length === 0) {
        afficherNotification('🛒 Votre panier est vide', 'error');
        return;
    }
    
    const total = calculerTotal();
    const message = `Merci pour votre commande !\nTotal : ${total.toFixed(2)}€\n\nNous vous contacterons pour finaliser la livraison.`;
    
    afficherNotification('🚀 Commande passée avec succès !', 'success');
    
    // Réinitialiser le panier après commande
    panier = [];
    sauvegarderPanier();
    mettreAJourPanier();
    fermerPanier();
    
    // Simulation d'envoi d'email (dans la réalité, envoi vers un backend)
    console.log('Détails de la commande:', {
        produits: panier,
        total: total,
        date: new Date().toISOString()
    });
}

// ===== NAVIGATION ET ANIMATIONS =====
function initialiserEcouteurs() {
    // Navigation mobile
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Bouton panier
    const cartBtn = document.getElementById('cartBtn');
    const closePanier = document.getElementById('closePanier');
    
    if (cartBtn) {
        cartBtn.addEventListener('click', ouvrirPanier);
    }
    
    if (closePanier) {
        closePanier.addEventListener('click', fermerPanier);
    }
    
    // Fermer le modal en cliquant à l'extérieur
    const panierModal = document.getElementById('panierModal');
    if (panierModal) {
        panierModal.addEventListener('click', (e) => {
            if (e.target === panierModal) {
                fermerPanier();
            }
        });
    }
    
    // Fermer la navigation mobile en cliquant sur un lien
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
        });
    });
    
    // Gestion des boutons "Ajouter au panier" avec data-attributes
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const nom = this.getAttribute('data-nom') || this.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
            const prix = this.getAttribute('data-prix') || this.getAttribute('onclick')?.match(/, (\d+)\)/)?.[1];
            
            if (nom && prix) {
                ajouterAuPanier(nom, parseInt(prix));
            }
        });
    });
    
    // Initialiser le formulaire
    initialiserFormulaireCreation();
}

function initialiserAnimationsScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = `fadeInUp 0.6s ease forwards`;
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observer les éléments à animer
    const elementsToAnimate = document.querySelectorAll('.product-card, .avis-card, .contact-item, .valeur-card');
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// ===== GESTION DES ERREURS =====
window.addEventListener('error', (e) => {
    console.error('Erreur JavaScript:', e.error);
});

// ===== PERFORMANCE =====
// Optimisation pour les appareils mobiles
if ('connection' in navigator) {
    const connection = navigator.connection;
    if (connection.saveData) {
        // Désactiver certaines animations en mode économie de données
        document.documentElement.classList.add('save-data');
    }
}
