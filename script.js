// ===== VARIABLES GLOBALES =====
let panier = JSON.parse(localStorage.getItem('panier')) || [];

// ===== FONCTIONS PANIER =====

/**
 * Ajoute un produit au panier
 * @param {string} nom - Nom du produit
 * @param {number} prix - Prix du produit
 */
function ajouterAuPanier(nom, prix) {
    console.log(`Ajout au panier: ${nom} - ${prix}€`);
    
    // Vérifier si le produit existe déjà dans le panier
    const produitExistant = panier.find(item => item.nom === nom);
    
    if (produitExistant) {
        // Si le produit existe, augmenter la quantité
        produitExistant.quantite += 1;
        console.log(`Quantité augmentée pour: ${nom}`);
    } else {
        // Sinon, ajouter un nouveau produit
        panier.push({
            nom: nom,
            prix: prix,
            quantite: 1
        });
        console.log(`Nouveau produit ajouté: ${nom}`);
    }
    
    // Sauvegarder et mettre à jour l'affichage
    sauvegarderPanier();
    mettreAJourPanier();
    
    // Afficher un message de confirmation
    afficherNotification(`${nom} ajouté au panier !`, 'success');
}

/**
 * Retire un produit du panier
 * @param {string} nom - Nom du produit à retirer
 */
function retirerDuPanier(nom) {
    console.log(`Retrait du panier: ${nom}`);
    
    panier = panier.filter(item => item.nom !== nom);
    sauvegarderPanier();
    mettreAJourPanier();
    afficherNotification('Article retiré du panier', 'success');
}

/**
 * Modifie la quantité d'un produit dans le panier
 * @param {string} nom - Nom du produit
 * @param {number} changement - Changement de quantité (+1 ou -1)
 */
function modifierQuantite(nom, changement) {
    console.log(`Modification quantité: ${nom} - changement: ${changement}`);
    
    const produit = panier.find(item => item.nom === nom);
    
    if (produit) {
        produit.quantite += changement;
        
        // Si la quantité devient 0 ou moins, retirer le produit
        if (produit.quantite <= 0) {
            retirerDuPanier(nom);
        } else {
            sauvegarderPanier();
            mettreAJourPanier();
        }
    }
}

/**
 * Vide complètement le panier
 */
function viderPanier() {
    console.log('Vidage du panier');
    
    if (panier.length === 0) {
        afficherNotification('Le panier est déjà vide', 'error');
        return;
    }
    
    const nbArticles = panier.reduce((total, item) => total + item.quantite, 0);
    panier = [];
    sauvegarderPanier();
    mettreAJourPanier();
    afficherNotification(`Panier vidé (${nbArticles} article(s) supprimé(s))`, 'success');
}

/**
 * Sauvegarde le panier dans le localStorage
 */
function sauvegarderPanier() {
    localStorage.setItem('panier', JSON.stringify(panier));
    console.log('Panier sauvegardé dans le localStorage');
}

/**
 * Met à jour l'affichage du panier
 */
function mettreAJourPanier() {
    console.log('Mise à jour de l\'affichage du panier');
    
    const panierItems = document.getElementById('panier-items');
    const totalPanier = document.getElementById('total-panier');
    const panierCount = document.getElementById('panier-count');
    const cartCount = document.querySelector('.cart-count');
    
    // Vider l'affichage actuel
    panierItems.innerHTML = '';
    
    // Vérifier si le panier est vide
    if (panier.length === 0) {
        panierItems.innerHTML = '<p class="panier-vide">Votre panier est vide</p>';
        totalPanier.textContent = '0,00€';
        panierCount.textContent = '0 article(s)';
        if (cartCount) cartCount.textContent = '0';
        return;
    }
    
    let total = 0;
    let totalArticles = 0;
    
    // Parcourir tous les articles du panier
    panier.forEach(item => {
        const sousTotal = item.prix * item.quantite;
        total += sousTotal;
        totalArticles += item.quantite;
        
        // Créer l'élément HTML pour cet article
        const itemElement = document.createElement('div');
        itemElement.className = 'panier-item';
        itemElement.innerHTML = `
            <div class="panier-item-info">
                <h4>${item.nom}</h4>
                <p>${item.prix}€ x ${item.quantite}</p>
            </div>
            <div class="panier-item-controls">
                <button class="btn-quantity" onclick="modifierQuantite('${item.nom}', -1)" aria-label="Réduire la quantité">-</button>
                <span style="margin: 0 10px; font-weight: bold; min-width: 20px; text-align: center;">${item.quantite}</span>
                <button class="btn-quantity" onclick="modifierQuantite('${item.nom}', 1)" aria-label="Augmenter la quantité">+</button>
                <button class="btn-remove" onclick="retirerDuPanier('${item.nom}')" aria-label="Supprimer l'article">🗑️</button>
            </div>
            <div style="font-weight: bold; min-width: 80px; text-align: right;">${sousTotal.toFixed(2)}€</div>
        `;
        
        panierItems.appendChild(itemElement);
    });
    
    // Mettre à jour le total et le compteur
    totalPanier.textContent = `${total.toFixed(2)}€`;
    panierCount.textContent = `${totalArticles} article(s)`;
    if (cartCount) cartCount.textContent = totalArticles;
    
    console.log(`Panier mis à jour: ${totalArticles} articles, total: ${total.toFixed(2)}€`);
}

/**
 * Passe la commande (simulation)
 */
function passerCommande() {
    console.log('Tentative de commande');
    
    if (panier.length === 0) {
        afficherNotification('Votre panier est vide', 'error');
        return;
    }
    
    const total = panier.reduce((sum, item) => sum + (item.prix * item.quantite), 0);
    
    // Afficher un message de confirmation
    afficherNotification(`✅ Commande passée avec succès ! Total: ${total.toFixed(2)}€. Merci pour votre confiance !`, 'success');
    
    // Simulation de réinitialisation du panier après commande
    console.log('Commande traitée, réinitialisation du panier dans 3 secondes');
    setTimeout(() => {
        panier = [];
        sauvegarderPanier();
        mettreAJourPanier();
        console.log('Panier réinitialisé après commande');
    }, 3000);
}

// ===== FONCTIONS UTILITAIRES =====

/**
 * Affiche une notification temporaire
 * @param {string} message - Message à afficher
 * @param {string} type - Type de notification ('success' ou 'error')
 */
function afficherNotification(message, type) {
    console.log(`Notification ${type}: ${message}`);
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.getElementById('notificationContainer').appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Suppression automatique après 4 secondes
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

/**
 * Initialise les animations au défilement
 */
function initialiserAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observer les cartes produits
    document.querySelectorAll('.product-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Observer les cartes avis
    document.querySelectorAll('.avis-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

/**
 * Initialise la navigation mobile
 */
function initialiserNavigationMobile() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
}

// ===== INITIALISATION =====

/**
 * Initialise l'application au chargement de la page
 */
function initialiserApplication() {
    console.log('Initialisation de l\'application');
    
    // Cacher l'écran de chargement
    setTimeout(() => {
        document.getElementById('loadingScreen').classList.add('hidden');
    }, 2000);
    
    // Mettre à jour l'affichage du panier
    mettreAJourPanier();
    
    // Initialiser les animations
    initialiserAnimations();
    
    // Initialiser la navigation mobile
    initialiserNavigationMobile();
    
    // Afficher un message de bienvenue
    setTimeout(() => {
        afficherNotification('Bienvenue chez Au Palais Des Arts ! 🎉', 'success');
    }, 2500);
    
    console.log('Application initialisée avec succès');
}

// Démarrer l'application quand la page est chargée
document.addEventListener('DOMContentLoaded', initialiserApplication);
