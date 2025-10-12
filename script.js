// ============================================= //
// VARIABLES GLOBALES - Données partagées       //
// ============================================= //

// Tableau pour stocker tous les articles du panier
let panier = [];

// ============================================= //
// FONCTIONS DU PANIER - Gestion des articles   //
// ============================================= //

/**
 * Fonction pour ajouter un produit au panier
 * @param {string} nom - Le nom du produit
 * @param {number} prix - Le prix du produit
 */
function ajouterAuPanier(nom, prix) {
    console.log(`Tentative d'ajout: ${nom} à ${prix}€`);
    
    // Vérifier si l'article est déjà dans le panier
    const articleExist = panier.find(item => item.nom === nom);
    
    if (articleExist) {
        // Si l'article existe déjà, augmenter la quantité
        articleExist.quantite++;
        console.log(`Quantité augmentée pour: ${nom}`);
    } else {
        // Sinon, ajouter un nouvel article au panier
        panier.push({
            nom: nom,
            prix: prix,
            quantite: 1
        });
        console.log(`Nouvel article ajouté: ${nom}`);
    }
    
    // Mettre à jour l'affichage du panier
    mettreAJourPanier();
    
    // Afficher une notification de confirmation
    afficherMessage(`${nom} ajouté au panier !`, 'success');
}

/**
 * Fonction pour mettre à jour l'affichage du panier
 * Cette fonction est appelée à chaque modification du panier
 */
function mettreAJourPanier() {
    console.log("Mise à jour de l'affichage du panier");
    
    // Récupérer les éléments HTML
    const panierItems = document.getElementById('panier-items');
    const totalPanier = document.getElementById('total-panier');
    const panierVide = document.getElementById('panier-vide');
    
    // Vider l'affichage actuel du panier
    panierItems.innerHTML = '';
    
    // Vérifier si le panier est vide
    if (panier.length === 0) {
        // Afficher le message "panier vide"
        panierItems.innerHTML = '<p id="panier-vide">Votre panier est vide</p>';
        totalPanier.textContent = '0.00';
        console.log("Panier vide affiché");
        return;
    }
    
    // Initialiser le total à 0
    let total = 0;
    
    // Parcourir tous les articles du panier
    panier.forEach((article, index) => {
        // Calculer le sous-total pour cet article
        const sousTotal = article.prix * article.quantite;
        // Ajouter au total général
        total += sousTotal;
        
        // Créer un élément HTML pour cet article
        const articleElement = document.createElement('div');
        articleElement.className = 'panier-item';
        articleElement.innerHTML = `
            <div>
                <strong>${article.nom}</strong><br>
                <small>${article.prix}€ x ${article.quantite}</small>
            </div>
            <div>
                <strong>${sousTotal.toFixed(2)}€</strong>
                <button onclick="supprimerArticle(${index})">❌</button>
            </div>
        `;
        
        // Ajouter l'article au panier affiché
        panierItems.appendChild(articleElement);
    });
    
    // Mettre à jour l'affichage du total
    totalPanier.textContent = total.toFixed(2);
    console.log(`Total mis à jour: ${total.toFixed(2)}€`);
}

/**
 * Fonction pour supprimer un article du panier
 * @param {number} index - L'index de l'article à supprimer
 */
function supprimerArticle(index) {
    console.log(`Suppression de l'article à l'index: ${index}`);
    
    // Vérifier que l'index est valide
    if (index >= 0 && index < panier.length) {
        const nomArticle = panier[index].nom;
        // Supprimer l'article du panier
        panier.splice(index, 1);
        // Mettre à jour l'affichage
        mettreAJourPanier();
        // Afficher une notification
        afficherMessage(`${nomArticle} supprimé du panier`, 'success');
    } else {
        console.error("Index invalide pour la suppression");
    }
}

/**
 * Fonction pour vider complètement le panier
 */
function viderPanier() {
    console.log("Tentative de vidage du panier");
    
    // Vérifier si le panier est déjà vide
    if (panier.length === 0) {
        afficherMessage('Le panier est déjà vide', 'error');
        return;
    }
    
    // Sauvegarder le nombre d'articles pour le message
    const nbArticles = panier.length;
    
    // Vider le tableau panier
    panier = [];
    
    // Mettre à jour l'affichage
    mettreAJourPanier();
    
    // Afficher une notification
    afficherMessage(`Panier vidé (${nbArticles} article(s) supprimé(s))`, 'success');
}

// ============================================= //
// FONCTION COMMANDE - Traitement des commandes //
// ============================================= //

/**
 * Fonction pour simuler le passage d'une commande
 */
function passerCommande() {
    console.log("Tentative de passage de commande");
    
    // Vérifier si le panier est vide
    if (panier.length === 0) {
        afficherMessage('Votre panier est vide', 'error');
        return;
    }
    
    // Calculer le total de la commande
    const total = panier.reduce((sum, article) => sum + (article.prix * article.quantite), 0);
    
    // Afficher un message de confirmation
    afficherMessage(`✅ Commande passée avec succès ! Total: ${total.toFixed(2)}€`, 'success');
    
    // Réinitialiser le panier après la commande
    panier = [];
    mettreAJourPanier();
    
    console.log("Commande traitée avec succès");
    
    // Ici, vous pourriez ajouter:
    // - Redirection vers une page de paiement
    // - Envoi des données à un serveur
    // - Sauvegarde dans le localStorage
    // window.location.href = 'paiement.html';
}

// ============================================= //
// FONCTIONS UTILITAIRES - Outils divers        //
// ============================================= //

/**
 * Fonction pour afficher des messages temporaires
 * @param {string} message - Le message à afficher
 * @param {string} type - Le type de message ('success' ou 'error')
 */
function afficherMessage(message, type) {
    console.log(`Message ${type}: ${message}`);
    
    // Créer un élément de message
    const messageElement = document.createElement('div');
    messageElement.className = `message message-${type}`;
    messageElement.textContent = message;
    
    // Ajouter le message au début du body
    document.body.insertBefore(messageElement, document.body.firstChild);
    
    // Supprimer le message après 3 secondes
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.remove();
            console.log("Message supprimé");
        }
    }, 3000);
}

// ============================================= //
// INITIALISATION - Code exécuté au démarrage  //
// ============================================= //

/**
 * Fonction d'initialisation exécutée au chargement de la page
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log("Page chargée - Initialisation");
    
    // Mettre à jour l'affichage du panier au chargement
    mettreAJourPanier();
    
    // Ajouter un message de bienvenue
    afficherMessage('Bienvenue dans notre boutique !', 'success');
    
    // Ici vous pourriez aussi:
    // - Charger le panier depuis le localStorage
    // - Vérifier l'authentification utilisateur
    // - Charger des données depuis une API
});

// ============================================= //
// FONCTIONNALITÉS AVANCÉES - Pour plus tard   //
// ============================================= //

/**
 * Fonction pour sauvegarder le panier dans le localStorage
 * (À implémenter si besoin de persistance)
 */
function sauvegarderPanier() {
    localStorage.setItem('panier', JSON.stringify(panier));
    console.log("Panier sauvegardé");
}

/**
 * Fonction pour charger le panier depuis le localStorage
 * (À implémenter si besoin de persistance)
 */
function chargerPanier() {
    const panierSauvegarde = localStorage.getItem('panier');
    if (panierSauvegarde) {
        panier = JSON.parse(panierSauvegarde);
        mettreAJourPanier();
        console.log("Panier chargé depuis le localStorage");
    }
}
