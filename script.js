// ===== VARIABLES GLOBALES =====
let panier = JSON.parse(localStorage.getItem('panier')) || [];
let notificationTimeout;

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

// Avis initiaux
const avisInitiaux = [
    { nom: 'Marie L.', note: 5, commentaire: 'Le panier rectangulaire est absolument magnifique ! La qualité de tissage est exceptionnelle. Savoir qu\'il est fait main au Maroc ajoute une valeur sentimentale. Livraison rapide et emballage soigné.', date: '15/10/2024' },
    { nom: 'Pierre D.', note: 5, commentaire: 'J\'ai offert le panier double compartiment à ma femme et elle en est ravie. Pratique et élégant, il trône maintenant dans notre chambre. La qualité artisanale marocaine est remarquable !', date: '12/10/2024' },
    { nom: 'Sophie M.', note: 4, commentaire: 'Très beau panier en feuilles de palmier, léger et résistant. Le côté écologique et l\'origine marocaine sont appréciables. Petit bémol : une légère odeur au début, mais qui part rapidement.', date: '08/10/2024' }
];

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
    
    // Initialisation des avis
    initialiserAvis();
    
    // Mise à jour de l'affichage du panier
    mettreAJourPanier();
    
    // Animation au scroll
    initialiserAnimationsScroll();
}

// ===== GESTION DU PANIER =====
function ajouterAuPanier(produitId) {
    const produit = produits[produitId];
    if (!produit) return;

    const produitExistant = panier.find(item => item.nom === produit.nom);
    
    if (produitExistant) {
        produitExistant.quantite++;
    } else {
        panier.push({
            nom: produit.nom,
            prix: produit.prix,
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
        panierItems.innerHTML = panier.map(item => `
            <div class="panier-item">
                <div class="panier-item-info">
                    <h4>${item.nom}</h4>
                    <p>${item.prix}€ × ${item.quantite}</p>
                </div>
                <div class="panier-item-controls">
                    <button class="btn-quantity" onclick="modifierQuantite('${item.nom}', -1)">-</button>
                    <span>${item.quantite}</span>
                    <button class="btn-quantity" onclick="modifierQuantite('${item.nom}', 1)">+</button>
                    <button class="btn-remove" onclick="supprimerDuPanier('${item.nom}')">🗑️</button>
                </div>
            </div>
        `).join('');
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
}

function genererDetailsCommande() {
    let details = "DÉTAILS DE LA COMMANDE :\n\n";
    let total = 0;
    
    panier.forEach((item, index) => {
        const sousTotal = item.prix * item.quantite;
        total += sousTotal;
        details += `${index + 1}. ${item.nom}\n`;
        details += `   Quantité: ${item.quantite}\n`;
        details += `   Prix unitaire: ${item.prix}€\n`;
        details += `   Sous-total: ${sousTotal}€\n\n`;
    });
    
    details += `TOTAL: ${total.toFixed(2)}€\n\n`;
    details += `Date: ${new Date().toLocaleDateString('fr-FR')}`;
    
    return {
        texte: details,
        total: total,
        produits: panier
    };
}

function afficherModalCommande(detailsCommande) {
    // Créer le modal de commande
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
                        <div class="commande-total">
                            <strong>Total: ${detailsCommande.total.toFixed(2)}€</strong>
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
    
    // Ajouter le modal à la page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Empêcher le défilement de la page
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
    sauvegarderPanier();
    mettreAJourPanier();
    
    // Fermer les modals
    fermerModalCommande();
    fermerPanier();
    
    afficherNotification('📧 Ouvrez votre email pour finaliser la commande !', 'success');
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

// ===== GESTION DES AVIS =====
function initialiserAvis() {
    afficherAvis(avisInitiaux);
    initialiserFormulaireAvis();
}

function afficherAvis(avis) {
    const container = document.getElementById('avis-container');
    
    container.innerHTML = avis.map(avis => `
        <div class="avis-card">
            <div class="avis-header">
                <div class="avis-client">
                    <div class="client-avatar">${avis.nom.charAt(0)}</div>
                    <div>
                        <h4>${avis.nom}</h4>
                        <div class="avis-rating">${'★'.repeat(avis.note)}${'☆'.repeat(5 - avis.note)}</div>
                    </div>
                </div>
            </div>
            <p class="avis-text">${avis.commentaire}</p>
            <div class="avis-date">${avis.date}</div>
        </div>
    `).join('');
}

function initialiserFormulaireAvis() {
    const form = document.getElementById('avisForm');
    const etoiles = document.querySelectorAll('.etoile');
    const noteInput = document.getElementById('avis-note');
    const noteText = document.getElementById('note-text');
    
    let noteSelectionnee = 0;
    
    // Gestion des étoiles
    etoiles.forEach(etoile => {
        etoile.addEventListener('click', function() {
            noteSelectionnee = parseInt(this.dataset.note);
            noteInput.value = noteSelectionnee;
            
            // Mettre à jour l'affichage des étoiles
            etoiles.forEach((e, index) => {
                if (index < noteSelectionnee) {
                    e.textContent = '★';
                    e.classList.add('active');
                } else {
                    e.textContent = '☆';
                    e.classList.remove('active');
                }
            });
            
            // Mettre à jour le texte
            const textesNote = ['Très mauvais', 'Mauvais', 'Moyen', 'Bon', 'Excellent'];
            noteText.textContent = textesNote[noteSelectionnee - 1] || 'Sélectionnez une note';
        });
        
        etoile.addEventListener('mouseover', function() {
            const noteSurvol = parseInt(this.dataset.note);
            etoiles.forEach((e, index) => {
                if (index < noteSurvol) {
                    e.textContent = '★';
                } else {
                    e.textContent = '☆';
                }
            });
        });
        
        etoile.addEventListener('mouseout', function() {
            etoiles.forEach((e, index) => {
                if (index < noteSelectionnee) {
                    e.textContent = '★';
                } else {
                    e.textContent = '☆';
                }
            });
        });
    });
    
    // Soumission du formulaire
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nom = document.getElementById('avis-nom').value;
        const note = noteInput.value;
        const commentaire = document.getElementById('avis-commentaire').value;
        
        if (!nom || !note || !commentaire) {
            afficherNotification('❌ Veuillez remplir tous les champs', 'error');
            return;
        }
        
        // Ajouter le nouvel avis
        const nouvelAvis = {
            nom: nom,
            note: parseInt(note),
            commentaire: commentaire,
            date: new Date().toLocaleDateString('fr-FR')
        };
        
        avisInitiaux.unshift(nouvelAvis);
        afficherAvis(avisInitiaux);
        
        // Réinitialiser le formulaire
        form.reset();
        etoiles.forEach(e => {
            e.textContent = '☆';
            e.classList.remove('active');
        });
        noteText.textContent = 'Sélectionnez une note';
        noteSelectionnee = 0;
        
        afficherNotification('📝 Merci pour votre avis !', 'success');
    });
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
    
    // Boutons ajouter au panier
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.productId;
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
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
    
    // Initialiser le formulaire création
    initialiserFormulaireCreation();
}

function initialiserAnimationsScroll() {
    // Polyfill simple pour IntersectionObserver
    if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('.product-card, .avis-card, .contact-item, .valeur-card').forEach(el => {
            el.style.opacity = '1';
        });
        return;
    }
    
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
        document.documentElement.classList.add('save-data');
    }
}
