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

        // ENVOI RÉEL VERS FORMSPREE
        const formData = new FormData();
        formData.append('nom', nom);
        formData.append('email', email);
        formData.append('telephone', document.getElementById('creation-telephone').value);
        formData.append('type', document.getElementById('creation-type').value);
        formData.append('dimensions', document.getElementById('creation-dimensions').value);
        formData.append('description', description);
        formData.append('budget', document.getElementById('creation-budget').value);
        formData.append('_subject', 'Nouvelle demande de création sur mesure - Au Palais Des Arts');

        fetch('https://formspree.io/f/YOUR_FORMSPREE_ID', { // Remplacez par votre ID Formspree
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                afficherNotification('🎨 Votre demande a été envoyée ! Nous vous contacterons rapidement.', 'success');
                form.reset();
            } else {
                throw new Error('Erreur lors de l\'envoi');
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            afficherNotification('❌ Une erreur est survenue lors de l\'envoi. Veuillez réessayer.', 'error');
        });
    });
}

// ===== GESTION DU FORMULAIRE D'AVIS AMÉLIORÉ =====
function initialiserFormulaireAvis() {
    const form = document.getElementById('formulaireAvis');
    const stars = document.querySelectorAll('#ratingStars .star');
    const ratingInput = document.getElementById('rating');
    const ratingText = document.getElementById('ratingText');
    const avisTextarea = document.getElementById('avis-texte');
    const charCount = document.getElementById('avis-char-count');

    // Système de notation par étoiles
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            ratingInput.value = value;
            
            // Mettre à jour l'affichage des étoiles
            stars.forEach(s => {
                if (s.getAttribute('data-value') <= value) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
            
            // Mettre à jour le texte de la note
            const ratings = {
                1: "Mauvais",
                2: "Moyen",
                3: "Bien", 
                4: "Très bien",
                5: "Excellent"
            };
            
            ratingText.textContent = `Vous avez donné une note de ${value}/5 - ${ratings[value]}`;
        });
        
        // Effet de survol
        star.addEventListener('mouseover', function() {
            const value = this.getAttribute('data-value');
            
            stars.forEach(s => {
                if (s.getAttribute('data-value') <= value) {
                    s.style.color = 'var(--gold)';
                } else {
                    s.style.color = '#ddd';
                }
            });
        });
        
        star.addEventListener('mouseout', function() {
            const currentRating = ratingInput.value;
            
            stars.forEach(s => {
                if (currentRating && s.getAttribute('data-value') <= currentRating) {
                    s.style.color = 'var(--gold)';
                } else {
                    s.style.color = '#ddd';
                }
            });
        });
    });

    // Compteur de caractères
    avisTextarea.addEventListener('input', function() {
        const count = this.value.length;
        charCount.textContent = count;
        
        if (count > 500) {
            charCount.classList.add('warning');
        } else {
            charCount.classList.remove('warning');
        }
    });

    // Gestion de la soumission du formulaire
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validation
        if (!ratingInput.value) {
            afficherNotification('❌ Veuillez donner une note en cliquant sur les étoiles', 'error');
            return;
        }
        
        if (avisTextarea.value.length > 500) {
            afficherNotification('❌ Votre avis ne doit pas dépasser 500 caractères', 'error');
            return;
        }

        // ENVOI RÉEL VERS FORMSPREE
        const formData = new FormData();
        formData.append('nom', document.getElementById('avis-nom').value);
        formData.append('email', document.getElementById('avis-email').value);
        formData.append('note', ratingInput.value);
        formData.append('produit', document.getElementById('avis-produit').value);
        formData.append('titre', document.getElementById('avis-titre').value);
        formData.append('avis', avisTextarea.value);
        formData.append('_subject', 'Nouvel avis client - Au Palais Des Arts');

        fetch('https://formspree.io/f/YOUR_FORMSPREE_ID', { // Remplacez par votre ID Formspree
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                afficherNotification('✅ Merci pour votre avis ! Il a été envoyé avec succès.', 'success');
                form.reset();
                stars.forEach(s => s.classList.remove('active'));
                ratingText.textContent = 'Cliquez sur les étoiles pour noter';
                charCount.textContent = '0';
                charCount.classList.remove('warning');
            } else {
                throw new Error('Erreur lors de l\'envoi');
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            afficherNotification('❌ Une erreur est survenue lors de l\'envoi. Veuillez réessayer.', 'error');
        });
    });
}

// ===== COMMANDE =====
function passerCommande() {
    if (panier.length === 0) {
        afficherNotification('🛒 Votre panier est vide', 'error');
        return;
    }
    
    const total = calculerTotal();
    const produits = panier.map(item => `${item.nom} (${item.quantite}x)`).join(', ');
    
    // ENVOI RÉEL DE COMMANDE VERS FORMSPREE
    const formData = new FormData();
    formData.append('produits', produits);
    formData.append('total', total.toFixed(2) + '€');
    formData.append('_subject', 'Nouvelle commande - Au Palais Des Arts');

    fetch('https://formspree.io/f/YOUR_FORMSPREE_ID', { // Remplacez par votre ID Formspree
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            afficherNotification('🚀 Commande passée avec succès ! Nous vous contacterons pour finaliser la livraison.', 'success');
            
            // Réinitialiser le panier après commande
            panier = [];
            sauvegarderPanier();
            mettreAJourPanier();
            fermerPanier();
        } else {
            throw new Error('Erreur lors de l\'envoi');
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        afficherNotification('❌ Une erreur est survenue lors de l\'envoi de la commande. Veuillez réessayer.', 'error');
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
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
    
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
