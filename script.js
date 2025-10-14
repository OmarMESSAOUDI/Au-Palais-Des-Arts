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
function passerCommande() {
    if (panier.length === 0) {
        afficherNotification('🛒 Votre panier est vide');
        return;
    }
    
    const commande = {
        produits: panier,
        total: calculerTotal(),
        date: new Date().toISOString()
    };
    
    localStorage.setItem('commande', JSON.stringify(commande));
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
    
    // Bouton commander
    const commanderBtn = document.getElementById('commanderBtn');
    if (commanderBtn) commanderBtn.addEventListener('click', passerCommande);
    
    // Formulaires
    initialiserFormulaireCreation();
    initialiserFormulaireAvis();
}
