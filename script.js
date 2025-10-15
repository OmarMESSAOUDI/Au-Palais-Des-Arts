// ===== VARIABLES GLOBALES =====
let panier = JSON.parse(localStorage.getItem('panier')) || [];
let notificationTimeout;
let codePromoActif = null;
let reductionPromo = 0;

// Données des produits
const produits = {
    1: { nom: 'Panier Tressé Rectangulaire', prix: 35 },
    2: { nom: 'Panier Double Compartiment', prix: 55 },
    3: { nom: 'Panier en Feuilles de Palmier', prix: 42 },
    4: { nom: 'Panier Rond en Osier', prix: 38 },
    5: { nom: 'Lot de 4 Paniers en Osier', prix: 120 },
    6: { nom: 'Panier Rectangulaire Jacinthe d\'Eau', prix: 45 },
    7: { nom: 'Panier Rond Jacinthe d\'Eau', prix: 40 }
};

// Codes promo disponibles
const codesPromo = {
    "BIENVENUE10": 10,
    "ARTISANAT15": 15,
    "MAROC20": 20
};

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', function() {
    initialiserApp();
});

function initialiserApp() {
    // Gestion du loading screen
    setTimeout(() => {
        document.getElementById('loadingScreen').style.display = 'none';
    }, 2000);

    // Initialisation des écouteurs d'événements
    initialiserEcouteurs();
    
    // Mise à jour de l'affichage du panier
    mettreAJourPanier();
    
    // Initialiser le bouton retour en haut
    initialiserBackToTop();
    
    // Charger les images
    chargerImagesProduits();
    
    // Analytics - suivre la page vue
    suivrePageVue();
}

// ===== ANALYTICS & TRACKING =====
function suivrePageVue() {
    // Microsoft Clarity
    if (typeof clarity === 'function') {
        clarity('set', 'page_view', {
            page_title: document.title,
            page_url: window.location.href
        });
    }
    
    // Google Analytics (simulé)
    console.log('Page vue:', document.title, window.location.href);
}

function suivreEvenement(categorie, action, etiquette) {
    console.log('Événement:', categorie, action, etiquette);
    
    if (typeof clarity === 'function') {
        clarity('event', action, {
            category: categorie,
            label: etiquette
        });
    }
}

// ===== GESTION DU PANIER AVEC PROMOS =====
function ajouterAuPanier(produitId) {
    const produit = produits[produitId];
    if (!produit) return;

    const produitExistant = panier.find(item => item.id === produitId);
    
    if (produitExistant) {
        produitExistant.quantite++;
    } else {
        panier.push({
            id: produitId,
            nom: produit.nom,
            prix: produit.prix,
            quantite: 1
        });
    }
    
    sauvegarderPanier();
    mettreAJourPanier();
    afficherNotification('✅ Produit ajouté au panier !', 'success');
    
    // Analytics
    suivreEvenement('panier', 'ajouter_produit', produit.nom);
}

function supprimerDuPanier(produitId) {
    panier = panier.filter(item => item.id !== produitId);
    sauvegarderPanier();
    mettreAJourPanier();
    afficherNotification('🗑️ Produit retiré du panier', 'error');
}

function modifierQuantite(produitId, changement) {
    const produit = panier.find(item => item.id === produitId);
    
    if (produit) {
        produit.quantite += changement;
        
        if (produit.quantite <= 0) {
            supprimerDuPanier(produitId);
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
        codePromoActif = null;
        reductionPromo = 0;
        sauvegarderPanier();
        mettreAJourPanier();
        afficherNotification('🗑️ Panier vidé', 'error');
        
        // Analytics
        suivreEvenement('panier', 'vider_panier', 'utilisateur');
    }
}

function calculerSousTotal() {
    return panier.reduce((total, item) => total + (item.prix * item.quantite), 0);
}

function calculerFraisLivraison() {
    const livraisonSelectionnee = document.querySelector('input[name="livraison"]:checked');
    return livraisonSelectionnee ? parseFloat(livraisonSelectionnee.value === 'express' ? '14.90' : '7.90') : 7.90;
}

function calculerTotal() {
    const sousTotal = calculerSousTotal();
    const fraisLivraison = calculerFraisLivraison();
    const montantReduction = (sousTotal * reductionPromo) / 100;
    return (sousTotal - montantReduction) + fraisLivraison;
}

function appliquerCodePromo() {
    const input = document.getElementById('codePromoInput');
    const code = input.value.trim().toUpperCase();
    const messageElement = document.getElementById('promoMessage');
    
    if (!code) {
        messageElement.textContent = '❌ Veuillez entrer un code promo';
        messageElement.className = 'promo-message error';
        return;
    }
    
    if (codesPromo[code]) {
        codePromoActif = code;
        reductionPromo = codesPromo[code];
        messageElement.textContent = `✅ Code promo appliqué ! -${reductionPromo}%`;
        messageElement.className = 'promo-message success';
        input.value = '';
        mettreAJourPanier();
        
        // Analytics
        suivreEvenement('promo', 'code_applique', code);
    } else {
        messageElement.textContent = '❌ Code promo invalide';
        messageElement.className = 'promo-message error';
    }
}

function sauvegarderPanier() {
    const data = {
        panier: panier,
        codePromo: codePromoActif,
        reduction: reductionPromo
    };
    localStorage.setItem('panier', JSON.stringify(data));
}

function chargerPanier() {
    const data = JSON.parse(localStorage.getItem('panier'));
    if (data) {
        panier = data.panier || [];
        codePromoActif = data.codePromo || null;
        reductionPromo = data.reduction || 0;
    }
}

function mettreAJourPanier() {
    const cartCount = document.querySelector('.cart-count');
    const panierItems = document.getElementById('panier-items');
    const sousTotalElement = document.getElementById('sous-total');
    const promoElement = document.getElementById('panier-promo');
    const montantPromoElement = document.getElementById('montant-promo');
    const fraisLivraisonElement = document.getElementById('frais-livraison');
    const totalPanier = document.getElementById('total-panier');
    
    // Mettre à jour le compteur
    const totalItems = panier.reduce((total, item) => total + item.quantite, 0);
    cartCount.textContent = totalItems;
    
    // Mettre à jour l'affichage du panier
    if (panier.length === 0) {
        panierItems.innerHTML = '<p class="panier-vide">Votre panier est vide</p>';
    } else {
        panierItems.innerHTML = panier.map(item => `
            <div class="panier-item">
                <div class="panier-item-info">
                    <h4>${item.nom}</h4>
                    <p>${item.prix}€ × ${item.quantite}</p>
                </div>
                <div class="panier-item-controls">
                    <button class="btn-quantity" onclick="modifierQuantite(${item.id}, -1)">-</button>
                    <span>${item.quantite}</span>
                    <button class="btn-quantity" onclick="modifierQuantite(${item.id}, 1)">+</button>
                    <button class="btn-remove" onclick="supprimerDuPanier(${item.id})">🗑️</button>
                </div>
            </div>
        `).join('');
    }
    
    // Calculer les totaux
    const sousTotal = calculerSousTotal();
    const fraisLivraison = calculerFraisLivraison();
    const montantReduction = (sousTotal * reductionPromo) / 100;
    const total = sousTotal - montantReduction + fraisLivraison;
    
    // Mettre à jour les affichages
    sousTotalElement.textContent = sousTotal.toFixed(2) + '€';
    fraisLivraisonElement.textContent = fraisLivraison.toFixed(2) + '€';
    totalPanier.textContent = total.toFixed(2) + '€';
    
    // Gérer l'affichage de la promotion
    if (reductionPromo > 0) {
        promoElement.style.display = 'flex';
        montantPromoElement.textContent = montantReduction.toFixed(2) + '€';
    } else {
        promoElement.style.display = 'none';
    }
    
    // Mettre à jour le code promo dans l'input si actif
    if (codePromoActif) {
        document.getElementById('codePromoInput').placeholder = `Code appliqué: ${codePromoActif}`;
    }
}

// ===== GESTION DES IMAGES =====
function chargerImagesProduits() {
    const placeholders = document.querySelectorAll('.product-image-placeholder');
    
    placeholders.forEach(placeholder => {
        const imageName = placeholder.getAttribute('data-image');
        if (imageName) {
            // Simuler le chargement d'image
            setTimeout(() => {
                placeholder.classList.remove('skeleton');
                placeholder.textContent = '🖼️ ' + placeholder.textContent.replace('🖼️ ', '');
            }, 1000);
        }
    });
}

// ===== GESTION DE LA COMMANDE =====
function passerCommande() {
    if (panier.length === 0) {
        afficherNotification('🛒 Votre panier est vide', 'error');
        return;
    }

    // Créer les détails de la commande
    const detailsCommande = genererDetailsCommande();
    
    // Afficher le modal de confirmation de commande
    afficherModalCommande(detailsCommande);
    
    // Analytics
    suivreEvenement('commande', 'demarrer_commande', `items:${panier.length}`);
}

function genererDetailsCommande() {
    let details = "DÉTAILS DE LA COMMANDE :\n\n";
    let sousTotal = 0;
    
    panier.forEach((item, index) => {
        const sousTotalItem = item.prix * item.quantite;
        sousTotal += sousTotalItem;
        details += `${index + 1}. ${item.nom}\n`;
        details += `   Quantité: ${item.quantite}\n`;
        details += `   Prix unitaire: ${item.prix}€\n`;
        details += `   Sous-total: ${sousTotalItem}€\n\n`;
    });
    
    const fraisLivraison = calculerFraisLivraison();
    const montantReduction = (sousTotal * reductionPromo) / 100;
    const total = sousTotal - montantReduction + fraisLivraison;
    
    details += `SOUS-TOTAL: ${sousTotal.toFixed(2)}€\n`;
    
    if (reductionPromo > 0) {
        details += `RÉDUCTION: -${montantReduction.toFixed(2)}€ (${reductionPromo}% avec ${codePromoActif})\n`;
    }
    
    details += `LIVRAISON: ${fraisLivraison.toFixed(2)}€\n`;
    details += `TOTAL: ${total.toFixed(2)}€\n\n`;
    details += `Date: ${new Date().toLocaleDateString('fr-FR')}`;
    
    return {
        texte: details,
        sousTotal: sousTotal,
        reduction: montantReduction,
        livraison: fraisLivraison,
        total: total,
        produits: panier
    };
}

function afficherModalCommande(detailsCommande) {
    const modalHTML = `
        <div id="commandeModal" class="commande-modal">
            <div class="commande-modal-content">
                <div class="commande-modal-header">
                    <h2>🚀 Finaliser votre commande</h2>
                    <button class="close-commande" onclick="fermerModalCommande()">&times;</button>
                </div>
                <div class="commande-modal-body">
                    <div class="commande-resume">
                        <h3>Résumé de votre commande</h3>
                        <div class="commande-produits">
                            ${detailsCommande.produits.map((item, index) => `
                                <div class="commande-produit">
                                    <span class="produit-nom">${item.nom}</span>
                                    <span class="produit-quantite">x${item.quantite}</span>
                                    <span class="produit-prix">${(item.prix * item.quantite).toFixed(2)}€</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="commande-totals">
                            <div class="commande-sous-total">
                                Sous-total: <span>${detailsCommande.sousTotal.toFixed(2)}€</span>
                            </div>
                            ${detailsCommande.reduction > 0 ? `
                            <div class="commande-reduction">
                                Réduction: <span>-${detailsCommande.reduction.toFixed(2)}€</span>
                            </div>
                            ` : ''}
                            <div class="commande-livraison">
                                Livraison: <span>${detailsCommande.livraison.toFixed(2)}€</span>
                            </div>
                            <div class="commande-total">
                                <strong>Total: ${detailsCommande.total.toFixed(2)}€</strong>
                            </div>
                        </div>
                    </div>
                    
                    <div class="commande-options">
                        <h3>Options de paiement</h3>
                        <div class="paiement-options">
                            <label class="paiement-option">
                                <input type="radio" name="paiement" value="virement" checked>
                                <span class="checkmark"></span>
                                <span class="paiement-info">
                                    <strong>Virement Bancaire</strong>
                                    <small>IBAN fourni après confirmation</small>
                                </span>
                            </label>
                            
                            <label class="paiement-option">
                                <input type="radio" name="paiement" value="paypal">
                                <span class="checkmark"></span>
                                <span class="paiement-info">
                                    <strong>PayPal</strong>
                                    <small>Paiement sécurisé en ligne</small>
                                </span>
                            </label>
                            
                            <label class="paiement-option">
                                <input type="radio" name="paiement" value="especes">
                                <span class="checkmark"></span>
                                <span class="paiement-info">
                                    <strong>Espèces</strong>
                                    <small>Sur place ou livraison</small>
                                </span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="commande-contact">
                        <h3>Informations de contact</h3>
                        <form id="commandeForm">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="commande-nom">Nom complet *</label>
                                    <input type="text" id="commande-nom" name="nom" required>
                                </div>
                                <div class="form-group">
                                    <label for="commande-email">Email *</label>
                                    <input type="email" id="commande-email" name="email" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="commande-telephone">Téléphone *</label>
                                <input type="tel" id="commande-telephone" name="telephone" required>
                            </div>
                            <div class="form-group">
                                <label for="commande-adresse">Adresse de livraison *</label>
                                <textarea id="commande-adresse" name="adresse" rows="3" required placeholder="Nom, adresse, code postal, ville..."></textarea>
                            </div>
                            <div class="form-group">
                                <label for="commande-message">Message (optionnel)</label>
                                <textarea id="commande-message" name="message" rows="2" placeholder="Instructions spéciales, préférences..."></textarea>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="commande-modal-actions">
                    <button class="btn btn-secondary" onclick="fermerModalCommande()">Annuler</button>
                    <button class="btn btn-success" onclick="confirmerCommande()">
                        ✅ Confirmer la commande
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden';
}

function fermerModalCommande() {
    const modal = document.getElementById('commandeModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

function confirmerCommande() {
    const form = document.getElementById('commandeForm');
    const nom = document.getElementById('commande-nom').value;
    const email = document.getElementById('commande-email').value;
    const telephone = document.getElementById('commande-telephone').value;
    const adresse = document.getElementById('commande-adresse').value;
    
    if (!nom || !email || !telephone || !adresse) {
        afficherNotification('❌ Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }
    
    // Récupérer le mode de paiement sélectionné
    const modePaiement = document.querySelector('input[name="paiement"]:checked').value;
    
    // Générer les détails de commande pour l'email
    const detailsCommande = genererDetailsCommande();
    const messageEmail = genererEmailCommande(detailsCommande, { nom, email, telephone, adresse, modePaiement });
    
    // Ouvrir le client email avec les détails pré-remplis
    ouvrirEmailCommande(messageEmail);
    
    // Réinitialiser le panier
    panier = [];
    codePromoActif = null;
    reductionPromo = 0;
    sauvegarderPanier();
    mettreAJourPanier();
    
    // Fermer les modals
    fermerModalCommande();
    fermerPanier();
    
    afficherNotification('📧 Ouvrez votre email pour finaliser la commande !', 'success');
    
    // Analytics
    suivreEvenement('commande', 'commande_confirmee', `total:${detailsCommande.total}`);
}

function genererEmailCommande(detailsCommande, infosClient) {
    const modesPaiement = {
        'virement': 'Virement Bancaire',
        'paypal': 'PayPal', 
        'especes': 'Espèces'
    };
    
    const sujet = `Commande Au Palais Des Arts - ${infosClient.nom}`;
    
    let corps = `Bonjour,\n\n`;
    corps += `Je souhaite passer la commande suivante :\n\n`;
    corps += `${detailsCommande.texte}\n\n`;
    corps += `--- INFORMATIONS CLIENT ---\n`;
    corps += `Nom: ${infosClient.nom}\n`;
    corps += `Email: ${infosClient.email}\n`;
    corps += `Téléphone: ${infosClient.telephone}\n`;
    corps += `Adresse: ${infosClient.adresse}\n`;
    corps += `Mode de paiement: ${modesPaiement[infosClient.modePaiement]}\n\n`;
    corps += `Cordialement,\n${infosClient.nom}`;
    
    return {
        sujet: encodeURIComponent(sujet),
        corps: encodeURIComponent(corps)
    };
}

function ouvrirEmailCommande(messageEmail) {
    const email = 'contact@aupalaisdesarts.fr';
    const lienEmail = `mailto:${email}?subject=${messageEmail.sujet}&body=${messageEmail.corps}`;
    window.open(lienEmail, '_blank');
}

// ===== GESTION DU MODAL PANIER =====
function ouvrirPanier() {
    document.getElementById('panierModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function fermerPanier() {
    document.getElementById('panierModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// ===== BOUTON RETOUR EN HAUT =====
function initialiserBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== BANNIERE PROMO =====
function fermerPromoBanner() {
    const banner = document.getElementById('promoBanner');
    banner.style.display = 'none';
    localStorage.setItem('promoBannerClosed', 'true');
}

// Vérifier si la bannière a déjà été fermée
if (localStorage.getItem('promoBannerClosed') === 'true') {
    document.addEventListener('DOMContentLoaded', () => {
        const banner = document.getElementById('promoBanner');
        if (banner) banner.style.display = 'none';
    });
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
        
        // Analytics
        suivreEvenement('contact', 'demande_creation', 'formulaire_envoye');
    });
}

// ===== NAVIGATION ET ANIMATIONS =====
function initialiserEcouteurs() {
    // Navigation mobile
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isActive = navMenu.style.display === 'flex';
            navMenu.style.display = isActive ? 'none' : 'flex';
            navToggle.classList.toggle('active', !isActive);
        });
    }
    
    // Boutons ajouter au panier
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.productId);
            ajouterAuPanier(productId);
        });
    });
    
    // Bouton panier
    const cartBtn = document.getElementById('cartBtn');
    const closePanier = document.getElementById('closePanier');
    
    if (cartBtn) {
        cartBtn.addEventListener('click', ouvrirPanier);
    }
    
    if (closePanier) {
        closePanier.addEventListener('click', fermerPanier);
    }
    
    // Bouton vider panier
    const viderPanierBtn = document.getElementById('viderPanierBtn');
    if (viderPanierBtn) {
        viderPanierBtn.addEventListener('click', viderPanier);
    }
    
    // Bouton commander
    const commanderBtn = document.getElementById('commanderBtn');
    if (commanderBtn) {
        commanderBtn.addEventListener('click', passerCommande);
    }
    
    // Options de livraison
    document.querySelectorAll('input[name="livraison"]').forEach(radio => {
        radio.addEventListener('change', mettreAJourPanier);
    });
    
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
            navMenu.style.display = 'none';
            navToggle.classList.remove('active');
        });
    });
    
    // Initialiser le formulaire création
    initialiserFormulaireCreation();
    
    // Entrée pour code promo
    const codePromoInput = document.getElementById('codePromoInput');
    if (codePromoInput) {
        codePromoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                appliquerCodePromo();
            }
        });
    }
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
        document.documentElement.classList.add('save-data');
    }
}

// Charger le panier au démarrage
chargerPanier();

// Animation pour les notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .commande-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        padding: 20px;
    }
    
    .commande-modal-content {
        background: var(--white);
        border-radius: 10px;
        max-width: 600px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }
    
    .commande-totals {
        border-top: 2px solid var(--primary-color);
        padding-top: 10px;
        margin-top: 10px;
    }
    
    .commande-sous-total,
    .commande-reduction,
    .commande-livraison,
    .commande-total {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
    }
    
    .commande-total {
        font-weight: bold;
        font-size: 1.2rem;
        color: var(--primary-color);
        border-top: 1px solid #E8F5E8;
        padding-top: 10px;
        margin-top: 10px;
    }
`;
document.head.appendChild(style);
