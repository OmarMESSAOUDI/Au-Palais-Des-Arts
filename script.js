// ===== VARIABLES GLOBALES =====
let panier = JSON.parse(localStorage.getItem('panier')) || [];
let avis = JSON.parse(localStorage.getItem('avis')) || [];
let notificationTimeout;

// Définition des produits
const produits = {
    1: { nom: "Panier Tressé Rectangulaire", prix: 35 },
    2: { nom: "Panier Double Compartiment", prix: 55 },
    3: { nom: "Panier en Feuilles de Palmier", prix: 42 },
    4: { nom: "Panier Rond en Osier", prix: 38 },
    5: { nom: "Lot de 4 Paniers en Osier", prix: 120 },
    6: { nom: "Panier Rectangulaire Jacinthe d'Eau", prix: 45 },
    7: { nom: "Panier Rond Jacinthe d'Eau", prix: 40 }
};

// Avis par défaut
const avisParDefaut = [
    {
        nom: "Marie L.",
        note: 5,
        commentaire: "Le panier rectangulaire est absolument magnifique ! La qualité de tissage est exceptionnelle. Savoir qu'il est fait main au Maroc ajoute une valeur sentimentale. Livraison rapide et emballage soigné.",
        date: "15/10/2024"
    },
    {
        nom: "Pierre D.",
        note: 5,
        commentaire: "J'ai offert le panier double compartiment à ma femme et elle en est ravie. Pratique et élégant, il trône maintenant dans notre chambre. La qualité artisanale marocaine est remarquable !",
        date: "12/10/2024"
    },
    {
        nom: "Sophie M.",
        note: 4,
        commentaire: "Très beau panier en feuilles de palmier, léger et résistant. Le côté écologique et l'origine marocaine sont appréciables. Petit bémol : une légère odeur au début, mais qui part rapidement.",
        date: "08/10/2024"
    }
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
    
    // Initialiser les avis
    if (avis.length === 0) {
        avis = [...avisParDefaut];
        sauvegarderAvis();
    }
    
    // Mise à jour de l'affichage du panier
    mettreAJourPanier();
    
    // Mise à jour de l'affichage des avis
    mettreAJourAvis();
    
    // Animation au scroll
    initialiserAnimationsScroll();
}

// ===== GESTION DU PANIER =====
function ajouterAuPanier(productId) {
    const produit = produits[productId];
    
    if (!produit) {
        console.error('Produit non trouvé:', productId);
        return;
    }
    
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
    afficherNotification('✅ Produit ajouté au panier !', 'success');
}

function supprimerDuPanier(productId) {
    panier = panier.filter(item => item.id !== productId);
    sauvegarderPanier();
    mettreAJourPanier();
    afficherNotification('🗑️ Produit retiré du panier', 'error');
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
                    <button class="btn-quantity" data-product-id="${item.id}" data-action="decrease">-</button>
                    <span>${item.quantite}</span>
                    <button class="btn-quantity" data-product-id="${item.id}" data-action="increase">+</button>
                    <button class="btn-remove" data-product-id="${item.id}">🗑️</button>
                </div>
            </div>
        `).join('');
    }
    
    // Mettre à jour le total
    totalPanier.textContent = calculerTotal().toFixed(2) + '€';
}

// ===== GESTION DES AVIS =====
function ajouterAvis(nom, note, commentaire) {
    const nouvelAvis = {
        nom: nom,
        note: parseInt(note),
        commentaire: commentaire,
        date: new Date().toLocaleDateString('fr-FR')
    };
    
    avis.unshift(nouvelAvis); // Ajouter au début pour que les nouveaux avis apparaissent en premier
    sauvegarderAvis();
    mettreAJourAvis();
    afficherNotification('📝 Votre avis a été publié !', 'success');
}

function sauvegarderAvis() {
    localStorage.setItem('avis', JSON.stringify(avis));
}

function mettreAJourAvis() {
    const avisContainer = document.getElementById('avis-container');
    
    if (avis.length === 0) {
        avisContainer.innerHTML = '<p class="aucun-avis">Aucun avis pour le moment.</p>';
        return;
    }
    
    avisContainer.innerHTML = avis.map(avisItem => `
        <div class="avis-card">
            <div class="avis-header">
                <div class="avis-client">
                    <div class="client-avatar">${avisItem.nom.charAt(0)}</div>
                    <div>
                        <h4>${avisItem.nom}</h4>
                        <div class="avis-rating">${genererEtoiles(avisItem.note)}</div>
                    </div>
                </div>
            </div>
            <p class="avis-text">"${avisItem.commentaire}"</p>
            <div class="avis-date">${avisItem.date}</div>
        </div>
    `).join('');
}

function genererEtoiles(note) {
    let etoiles = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= note) {
            etoiles += '★';
        } else {
            etoiles += '☆';
        }
    }
    return etoiles;
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

function initialiserFormulaireAvis() {
    const form = document.getElementById('avisForm');
    const etoiles = document.querySelectorAll('.etoile');
    const noteInput = document.getElementById('avis-note');
    const noteText = document.getElementById('note-text');
    
    // Gestion des étoiles
    etoiles.forEach(etoile => {
        etoile.addEventListener('click', function() {
            const note = this.getAttribute('data-note');
            noteInput.value = note;
            
            // Mettre à jour l'affichage des étoiles
            etoiles.forEach((e, index) => {
                if (index < note) {
                    e.textContent = '★';
                    e.style.color = '#d4af37';
                } else {
                    e.textContent = '☆';
                    e.style.color = '#ccc';
                }
            });
            
            // Mettre à jour le texte
            const textesNote = {
                1: "Mauvais",
                2: "Moyen",
                3: "Bon",
                4: "Très bon",
                5: "Excellent"
            };
            noteText.textContent = textesNote[note];
        });
        
        etoile.addEventListener('mouseover', function() {
            const note = this.getAttribute('data-note');
            etoiles.forEach((e, index) => {
                if (index < note) {
                    e.style.color = '#d4af37';
                } else {
                    e.style.color = '#ccc';
                }
            });
        });
    });
    
    // Réinitialiser les étoiles quand on quitte la zone
    document.getElementById('etoiles').addEventListener('mouseleave', function() {
        const note = noteInput.value;
        etoiles.forEach((e, index) => {
            if (index < note) {
                e.style.color = '#d4af37';
            } else {
                e.style.color = '#ccc';
            }
        });
    });
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validation
            const nom = document.getElementById('avis-nom').value;
            const note = document.getElementById('avis-note').value;
            const commentaire = document.getElementById('avis-commentaire').value;
            
            if (!nom || !note || !commentaire) {
                afficherNotification('❌ Veuillez remplir tous les champs obligatoires', 'error');
                return;
            }
            
            if (commentaire.length < 10) {
                afficherNotification('❌ Le commentaire doit contenir au moins 10 caractères', 'error');
                return;
            }
            
            // Ajouter l'avis
            ajouterAvis(nom, note, commentaire);
            form.reset();
            
            // Réinitialiser les étoiles
            etoiles.forEach(etoile => {
                etoile.textContent = '☆';
                etoile.style.color = '#ccc';
            });
            noteText.textContent = 'Sélectionnez une note';
        });
    }
}

// ===== PAIEMENT =====
function passerCommande() {
    if (panier.length === 0) {
        afficherNotification('🛒 Votre panier est vide', 'error');
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
    
    // Gestion des boutons "Ajouter au panier"
    document.addEventListener('click', function(e) {
        // Boutons "Ajouter au panier"
        if (e.target.classList.contains('add-to-cart')) {
            const productId = e.target.getAttribute('data-product-id');
            if (productId) {
                ajouterAuPanier(parseInt(productId));
            }
        }
        
        // Boutons de quantité dans le panier
        if (e.target.classList.contains('btn-quantity')) {
            const productId = parseInt(e.target.getAttribute('data-product-id'));
            const action = e.target.getAttribute('data-action');
            
            if (productId && action) {
                if (action === 'increase') {
                    modifierQuantite(productId, 1);
                } else if (action === 'decrease') {
                    modifierQuantite(productId, -1);
                }
            }
        }
        
        // Boutons de suppression dans le panier
        if (e.target.classList.contains('btn-remove')) {
            const productId = parseInt(e.target.getAttribute('data-product-id'));
            if (productId) {
                supprimerDuPanier(productId);
            }
        }
    });
    
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
    
    // Initialiser les formulaires
    initialiserFormulaireCreation();
    initialiserFormulaireAvis();
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
