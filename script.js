// ===== VARIABLES GLOBALES =====
let panier = JSON.parse(localStorage.getItem('panier')) || [];
let avis = JSON.parse(localStorage.getItem('avis')) || [];

// Produits
const produits = {
    1: { nom: "Panier Tressé Rectangulaire", prix: 35 },
    2: { nom: "Panier Double Compartiment", prix: 55 },
    3: { nom: "Panier en Feuilles de Palmier", prix: 42 },
    4: { nom: "Panier Rond en Osier", prix: 38 },
    5: { nom: "Lot de 4 Paniers en Osier", prix: 120 },
    6: { nom: "Panier Rectangulaire Jacinthe d'Eau", prix: 45 },
    7: { nom: "Panier Rond Jacinthe d'Eau", prix: 40 }
};

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', function() {
    initialiserApp();
});

function initialiserApp() {
    // Loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) loadingScreen.classList.add('hidden');
    }, 2000);

    // Initialiser les écouteurs
    initialiserEcouteurs();
    
    // Mettre à jour l'affichage
    mettreAJourPanier();
    mettreAJourAvis();
}

// ===== GESTION DU PANIER =====
function ajouterAuPanier(productId) {
    const produit = produits[productId];
    if (!produit) return;

    const produitExistant = panier.find(item => item.id === productId);
    
    if (produitExistant) {
        produitExistant.quantite++;
    } else {
        panier.push({
            id: productId,
            nom: produit.nom,
            prix: produit.prix,
            quantite: 1
        });
    }
    
    sauvegarderPanier();
    mettreAJourPanier();
    afficherNotification('✅ Produit ajouté au panier !');
}

function supprimerDuPanier(productId) {
    panier = panier.filter(item => item.id !== productId);
    sauvegarderPanier();
    mettreAJourPanier();
    afficherNotification('🗑️ Produit retiré du panier');
}

function modifierQuantite(productId, changement) {
    const produit = panier.find(item => item.id === productId);
    
    if (produit) {
        produit.quantite += changement;
        
        if (produit.quantite <= 0) {
            supprimerDuPanier(productId);
        } else {
            sauvegarderPanier();
            mettreAJourPanier();
        }
    }
}

function viderPanier() {
    if (panier.length === 0) {
        afficherNotification('🛒 Votre panier est déjà vide');
        return;
    }
    
    if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
        panier = [];
        sauvegarderPanier();
        mettreAJourPanier();
        afficherNotification('🗑️ Panier vidé');
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
    
    if (cartCount) {
        const totalItems = panier.reduce((total, item) => total + item.quantite, 0);
        cartCount.textContent = totalItems;
    }
    
    if (panierItems) {
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
    }
    
    if (totalPanier) {
        totalPanier.textContent = calculerTotal().toFixed(2) + '€';
    }
}

// ===== GESTION DES AVIS =====
function ajouterAvis(nom, note, commentaire) {
    const nouvelAvis = {
        nom: nom,
        note: parseInt(note),
        commentaire: commentaire,
        date: new Date().toLocaleDateString('fr-FR')
    };
    
    avis.unshift(nouvelAvis);
    sauvegarderAvis();
    mettreAJourAvis();
    afficherNotification('📝 Votre avis a été publié !');
}

function sauvegarderAvis() {
    localStorage.setItem('avis', JSON.stringify(avis));
}

function mettreAJourAvis() {
    const avisContainer = document.getElementById('avis-container');
    if (!avisContainer) return;

    // Avis par défaut si vide
    if (avis.length === 0) {
        avis = [
            {
                nom: "Marie L.",
                note: 5,
                commentaire: "Le panier rectangulaire est absolument magnifique ! La qualité de tissage est exceptionnelle.",
                date: "15/10/2024"
            },
            {
                nom: "Pierre D.",
                note: 5,
                commentaire: "J'ai offert le panier double compartiment à ma femme et elle en est ravie.",
                date: "12/10/2024"
            },
            {
                nom: "Sophie M.",
                note: 4,
                commentaire: "Très beau panier en feuilles de palmier, léger et résistant.",
                date: "08/10/2024"
            }
        ];
        sauvegarderAvis();
    }

    avisContainer.innerHTML = avis.map(avisItem => `
        <div class="avis-card">
            <div class="avis-header">
                <div class="avis-client">
                    <div class="client-avatar">${avisItem.nom.charAt(0)}</div>
                    <div>
                        <h4>${avisItem.nom}</h4>
                        <div class="avis-rating">${'★'.repeat(avisItem.note)}${'☆'.repeat(5 - avisItem.note)}</div>
                    </div>
                </div>
            </div>
            <p class="avis-text">"${avisItem.commentaire}"</p>
            <div class="avis-date">${avisItem.date}</div>
        </div>
    `).join('');
}

// ===== GESTION DU MODAL PANIER =====
function ouvrirPanier() {
    const panierModal = document.getElementById('panierModal');
    if (panierModal) {
        panierModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function fermerPanier() {
    const panierModal = document.getElementById('panierModal');
    if (panierModal) {
        panierModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// ===== NOTIFICATIONS =====
function afficherNotification(message) {
    const container = document.getElementById('notificationContainer');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.textContent = message;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
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
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        afficherNotification('🎨 Votre demande a été envoyée ! Nous vous contacterons rapidement.');
        form.reset();
    });
}

function initialiserFormulaireAvis() {
    const form = document.getElementById('avisForm');
    if (!form) return;

    const etoiles = document.querySelectorAll('.etoile');
    const noteInput = document.getElementById('avis-note');
    const noteText = document.getElementById('note-text');

    etoiles.forEach(etoile => {
        etoile.addEventListener('click', function() {
            const note = this.getAttribute('data-note');
            if (noteInput) noteInput.value = note;
            
            etoiles.forEach((e, index) => {
                if (index < note) {
                    e.textContent = '★';
                    e.style.color = '#d4af37';
                } else {
                    e.textContent = '☆';
                    e.style.color = '#ccc';
                }
            });
            
            const textesNote = ["Mauvais", "Moyen", "Bon", "Très bon", "Excellent"];
            if (noteText) noteText.textContent = textesNote[note - 1] || "Sélectionnez une note";
        });
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nom = document.getElementById('avis-nom')?.value;
        const note = document.getElementById('avis-note')?.value;
        const commentaire = document.getElementById('avis-commentaire')?.value;
        
        if (!nom || !note || !commentaire) {
            afficherNotification('❌ Veuillez remplir tous les champs obligatoires');
            return;
        }
        
        if (commentaire.length < 10) {
            afficherNotification('❌ Le commentaire doit contenir au moins 10 caractères');
            return;
        }
        
        ajouterAvis(nom, note, commentaire);
        form.reset();
        
        // Réinitialiser les étoiles
        etoiles.forEach(etoile => {
            etoile.textContent = '☆';
            etoile.style.color = '#ccc';
        });
        if (noteText) noteText.textContent = 'Sélectionnez une note';
    });
}

// ===== PAIEMENT =====
function passerAuPaiement() {
    if (panier.length === 0) {
        afficherNotification('🛒 Votre panier est vide');
        return;
    }
    
    const total = calculerTotal();
    
    // Sauvegarder la commande pour la page de paiement
    const commande = {
        produits: panier,
        total: total,
        date: new Date().toISOString()
    };
    
    localStorage.setItem('commande', JSON.stringify(commande));
    
    // Redirection vers la page de paiement
    window.location.href = 'paiement.html';
}

// ===== NAVIGATION =====
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
    
    if (cartBtn) cartBtn.addEventListener('click', ouvrirPanier);
    if (closePanier) closePanier.addEventListener('click', fermerPanier);
    
    // Fermer le modal en cliquant à l'extérieur
    const panierModal = document.getElementById('panierModal');
    if (panierModal) {
        panierModal.addEventListener('click', (e) => {
            if (e.target === panierModal) fermerPanier();
        });
    }
    
    // Boutons ajouter au panier
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = e.target.getAttribute('data-product-id');
            if (productId) ajouterAuPanier(parseInt(productId));
        }
    });
    
    // Bouton vider panier
    const viderPanierBtn = document.getElementById('viderPanierBtn');
    if (viderPanierBtn) viderPanierBtn.addEventListener('click', viderPanier);
    
    // Bouton passer au paiement
    const passerPaiementBtn = document.getElementById('passerPaiementBtn');
    if (passerPaiementBtn) passerPaiementBtn.addEventListener('click', passerAuPaiement);
    
    // Formulaires
    initialiserFormulaireCreation();
    initialiserFormulaireAvis();
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
    const email = 'contact@aupalaisdesarts.fr'; // Remplace par ton email
    const lienEmail = `mailto:${email}?subject=${messageEmail.sujet}&body=${messageEmail.corps}`;
    window.open(lienEmail, '_blank');
}
