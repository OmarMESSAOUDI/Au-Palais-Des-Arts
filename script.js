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
    afficherMessage(`${nom} ajouté au panier !`, 'success');
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
    afficherMessage('Article retiré du panier', 'success');
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
        afficherMessage('Le panier est déjà vide', 'error');
        return;
    }
    
    const nbArticles = panier.reduce((total, item) => total + item.quantite, 0);
    panier = [];
    sauvegarderPanier();
    mettreAJourPanier();
    afficherMessage(`Panier vidé (${nbArticles} article(s) supprimé(s))`, 'success');
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
    
    // Vider l'affichage actuel
    panierItems.innerHTML = '';
    
    // Vérifier si le panier est vide
    if (panier.length === 0) {
        panierItems.innerHTML = '<p class="panier-vide">Votre panier est vide</p>';
        totalPanier.textContent = '0,00€';
        panierCount.textContent = '0 article(s)';
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
    
    console.log(`Panier mis à jour: ${totalArticles} articles, total: ${total.toFixed(2)}€`);
}

/**
 * Passe la commande (simulation)
 */
function passerCommande() {
    console.log('Tentative de commande');
    
    if (panier.length === 0) {
        afficherMessage('Votre panier est vide', 'error');
        return;
    }
    
    const total = panier.reduce((sum, item) => sum + (item.prix * item.quantite), 0);
    
    // Afficher un message de confirmation
    afficherMessage(`✅ Commande passée avec succès ! Total: ${total.toFixed(2)}€. Merci pour votre confiance !`, 'success');
    
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
 * Affiche un message temporaire à l'utilisateur
 * @param {string} message - Message à afficher
 * @param {string} type - Type de message ('success' ou 'error')
 */
function afficherMessage(message, type) {
    console.log(`Message ${type}: ${message}`);
    
    // Supprimer les messages existants
    document.querySelectorAll('.message').forEach(msg => {
        msg.classList.remove('show');
        setTimeout(() => {
            if (msg.parentNode) {
                msg.remove();
            }
        }, 300);
    });
    
    // Créer le nouvel élément message
    const messageElement = document.createElement('div');
    messageElement.className = `message message-${type}`;
    messageElement.textContent = message;
    
    // Ajouter au DOM
    document.body.appendChild(messageElement);
    
    // Animation d'entrée
    setTimeout(() => messageElement.classList.add('show'), 100);
    
    // Suppression automatique après 4 secondes
    setTimeout(() => {
        messageElement.classList.remove('show');
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 300);
    }, 4000);
}

// ===== OBSERVATEUR D'INTERSECTION POUR LES ANIMATIONS =====

/**
 * Initialise l'observateur d'intersection pour les animations
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
    document.querySelectorAll('.produit-card').forEach(card => {
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

// ===== INITIALISATION =====

/**
 * Initialise l'application au chargement de la page
 */
function initialiserApplication() {
    console.log('Initialisation de l\'application');
    
    // Mettre à jour l'affichage du panier
    mettreAJourPanier();
    
    // Initialiser les animations
    initialiserAnimations();
    
    // Afficher un message de bienvenue
    setTimeout(() => {
        afficherMessage('Bienvenue chez Au Palais Des Arts ! 🎉', 'success');
    }, 1000);
    
    console.log('Application initialisée avec succès');
}

// Démarrer l'application quand la page est chargée
document.addEventListener('DOMContentLoaded', initialiserApplication);

// ===== FONCTIONS DE DÉBOGAGE =====

/**
 * Affiche l'état actuel du panier dans la console (pour débogage)
 */
function debugPanier() {
    console.log('=== DÉBOGAGE PANIER ===');
    console.log('Articles:', panier);
    console.log('Total articles:', panier.reduce((sum, item) => sum + item.quantite, 0));
    console.log('Total prix:', panier.reduce((sum, item) => sum + (item.prix * item.quantite), 0));
    console.log('LocalStorage:', localStorage.getItem('panier'));
    console.log('=====================');
}

// Exposer la fonction de débogage globalement (optionnel)
window.debugPanier = debugPanier;
