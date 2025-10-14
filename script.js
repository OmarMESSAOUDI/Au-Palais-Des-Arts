// ===== VARIABLES GLOBALES =====
let panier = JSON.parse(localStorage.getItem('panier')) || [];
let notificationTimeout;
let produits = [];
let currentTheme = localStorage.getItem('theme') || 'light';

// ===== DONNÉES DES PRODUITS =====
const produitsData = [
    {
        id: 1,
        nom: "Panier Tressé Rectangulaire",
        prix: 35,
        categorie: "populaire",
        description: "Panier élégant au design rectangulaire, parfait pour le rangement et la décoration. Tressage traditionnel marocain pour une durabilité exceptionnelle.",
        caracteristiques: ["📏 40x30x25cm", "🚚 48h"],
        badge: "Populaire"
    },
    {
        id: 2,
        nom: "Panier Double Compartiment",
        prix: 55,
        categorie: "innovant",
        description: "Innovant et pratique, ce panier à double compartiment vous permet de trier votre linge facilement. Idéal pour une organisation optimale.",
        caracteristiques: ["📏 50x40x35cm", "🚚 48h"],
        badge: "Innovant"
    },
    {
        id: 3,
        nom: "Panier en Feuilles de Palmier",
        prix: 42,
        categorie: "ecologique",
        description: "Panier écologique fabriqué à partir de feuilles de palmier naturelles. Léger, résistant et respectueux de l'environnement.",
        caracteristiques: ["📏 45x35x30cm", "🚚 48h"],
        badge: "Écologique"
    },
    {
        id: 4,
        nom: "Panier Rond en Osier",
        prix: 38,
        categorie: "classique",
        description: "Panier rond traditionnel en osier de qualité supérieure. Parfait pour le rangement du linge ou comme élément décoratif chaleureux.",
        caracteristiques: ["📏 Diamètre 45cm", "🚚 48h"],
        badge: "Classique"
    },
    {
        id: 5,
        nom: "Corbeille à Fruits",
        prix: 28,
        categorie: "populaire",
        description: "Corbeille élégante parfaite pour présenter vos fruits. Design aéré qui met en valeur les couleurs des fruits.",
        caracteristiques: ["📏 35x35x15cm", "🚚 48h"],
        badge: "Nouveau"
    },
    {
        id: 6,
        nom: "Panier à Provisions",
        prix: 45,
        categorie: "classique",
        description: "Grand panier robuste idéal pour le marché. Poignée ergonomique pour un transport facile.",
        caracteristiques: ["📏 50x35x25cm", "🚚 48h"],
        badge: "Robuste"
    }
];

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', function() {
    initialiserApp();
});

function initialiserApp() {
    // Appliquer le thème sauvegardé
    appliquerTheme(currentTheme);
    
    // Gestion du loading screen
    setTimeout(() => {
        document.getElementById('loadingScreen').classList.add('hidden');
    }, 2000);

    // Initialiser les données
    produits = produitsData;
    
    // Initialiser les écouteurs d'événements
    initialiserEcouteurs();
    
    // Afficher les produits
    afficherProduits(produits);
    
    // Mise à jour de l'affichage du panier
    mettreAJourPanier();
    
    // Animation au scroll
    initialiserAnimationsScroll();
}

// ===== GESTION DU THÈME =====
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    appliquerTheme(currentTheme);
    localStorage.setItem('theme', currentTheme);
}

function appliquerTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
    }
}

// ===== GESTION DES PRODUITS =====
function afficherProduits(produitsAAfficher) {
    const productsGrid = document.getElementById('productsGrid');
    
    if (produitsAAfficher.length === 0) {
        productsGrid.innerHTML = '<p class="panier-vide">Aucun produit ne correspond à votre recherche</p>';
        return;
    }
    
    productsGrid.innerHTML = produitsAAfficher.map(produit => `
        <div class="product-card" data-categorie="${produit.categorie}">
            ${produit.badge ? `<div class="product-badge">${produit.badge}</div>` : ''}
            <div class="product-image-container">
                <div class="product-image-placeholder">🖼️ ${produit.nom}</div>
            </div>
            <div class="product-content">
                <h3 class="product-title">${produit.nom}</h3>
                <p class="product-description">${produit.description}</p>
                <div class="product-meta">
                    ${produit.caracteristiques.map(carac => `<span>${carac}</span>`).join('')}
                </div>
                <div class="product-origin">🇲🇦 Fait main au Maroc</div>
                <div class="product-price">${produit.prix.toFixed(2)}€</div>
                <button class="btn btn-primary add-to-cart" onclick="ajouterAuPanier('${produit.nom}', ${produit.prix})">
                    ➕ Ajouter au panier
                </button>
            </div>
        </div>
    `).join('');
}

function filtrerProduits(filtre) {
    const produitsFiltres = filtre === 'tous' 
        ? produits 
        : produits.filter(produit => produit.categorie === filtre);
    
    afficherProduits(produitsFiltres);
    
    // Mettre à jour les boutons de filtre
    document.querySelectorAll('.filtre-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filtre === filtre);
    });
}

function rechercherProduits(term) {
    const produitsRecherches = produits.filter(produit => 
        produit.nom.toLowerCase().includes(term.toLowerCase()) ||
        produit.description.toLowerCase().includes(term.toLowerCase())
    );
    
    afficherProduits(produitsRecherches);
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
    
    // Scroll doux vers le panier
    setTimeout(() => {
        document.getElementById('panier').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }, 500);
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
    const panierCount = document.getElementById('panier-count');
    
    // Mettre à jour le compteur
    const totalItems = panier.reduce((total, item) => total + item.quantite, 0);
    cartCount.textContent = totalItems;
    panierCount.textContent = totalItems + ' article(s)';
    
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

// ===== GESTION DE LA NAVIGATION =====
function continuerAchats() {
    document.getElementById('produits').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

function passerCommande() {
    if (panier.length === 0) {
        afficherNotification('🛒 Votre panier est vide', 'error');
        return;
    }
    
    // Masquer le panier et afficher la section paiement
    document.getElementById('panier').style.display = 'none';
    document.getElementById('paiement').style.display = 'block';
    
    // Mettre à jour le récapitulatif de commande
    mettreAJourRecapCommande();
    
    // Scroll vers la section paiement
    setTimeout(() => {
        document.getElementById('paiement').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }, 300);
}

function retourAuPanier() {
    // Masquer le paiement et afficher le panier
    document.getElementById('paiement').style.display = 'none';
    document.getElementById('panier').style.display = 'block';
    
    // Scroll vers le panier
    setTimeout(() => {
        document.getElementById('panier').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }, 300);
}

// ===== GESTION DU PAIEMENT =====
function mettreAJourRecapCommande() {
    const recapPanier = document.getElementById('recap-panier');
    const recapTotal = document.getElementById('recap-total');
    
    if (panier.length === 0) {
        recapPanier.innerHTML = '<p>Aucun article dans le panier</p>';
    } else {
        recapPanier.innerHTML = panier.map(item => `
            <div class="recap-item">
                <span>${item.nom} (x${item.quantite})</span>
                <span>${(item.prix * item.quantite).toFixed(2)}€</span>
            </div>
        `).join('');
    }
    
    recapTotal.textContent = calculerTotal().toFixed(2) + '€';
}

function traiterPaiement(event) {
    event.preventDefault();
    
    // Validation du formulaire
    const form = event.target;
    const formData = new FormData(form);
    
    // Vérification des champs requis
    const requiredFields = ['prenom', 'nom', 'email', 'telephone', 'adresse', 'code-postal', 'ville', 'pays'];
    let isValid = true;
    
    requiredFields.forEach(field => {
        const input = form.querySelector(`[name="${field}"]`);
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#e74c3c';
        } else {
            input.style.borderColor = '#ddd';
        }
    });
    
    if (!isValid) {
        afficherNotification('❌ Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }
    
    // Simulation de traitement de paiement
    afficherNotification('💳 Traitement du paiement en cours...', 'success');
    
    setTimeout(() => {
        // Afficher la confirmation
        afficherConfirmationCommande(formData);
    }, 2000);
}

function afficherConfirmationCommande(formData) {
    // Masquer le paiement et afficher la confirmation
    document.getElementById('paiement').style.display = 'none';
    document.getElementById('confirmation').style.display = 'block';
    
    // Générer un numéro de commande
    const numeroCommande = 'CMD-' + Date.now().toString().slice(-8);
    document.getElementById('numero-commande').textContent = numeroCommande;
    
    // Mettre à jour les détails de la commande
    const detailsCommande = document.getElementById('details-commande');
    detailsCommande.innerHTML = `
        <div class="recap-item">
            <span>Articles commandés</span>
            <span>${panier.reduce((total, item) => total + item.quantite, 0)}</span>
        </div>
        <div class="recap-item">
            <span>Total payé</span>
            <span>${calculerTotal().toFixed(2)}€</span>
        </div>
        <div class="recap-item">
            <span>Livraison à</span>
            <span>${formData.get('adresse')}, ${formData.get('code-postal')} ${formData.get('ville')}</span>
        </div>
    `;
    
    // Vider le panier après confirmation
    panier = [];
    sauvegarderPanier();
    mettreAJourPanier();
    
    // Scroll vers la confirmation
    setTimeout(() => {
        document.getElementById('confirmation').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }, 300);
}

function retourAccueil() {
    // Masquer toutes les sections et afficher les produits
    document.getElementById('confirmation').style.display = 'none';
    document.getElementById('suivi').style.display = 'none';
    document.getElementById('panier').style.display = 'block';
    
    // Scroll vers le haut
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function suivreCommande() {
    document.getElementById('confirmation').style.display = 'none';
    document.getElementById('suivi').style.display = 'block';
    
    setTimeout(() => {
        document.getElementById('suivi').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }, 300);
}

function contacterSupport() {
    afficherNotification('📞 Redirection vers le support...', 'success');
    // Ici, on pourrait ouvrir un formulaire de contact ou rediriger
    setTimeout(() => {
        document.getElementById('contact').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }, 1000);
}

function imprimerConfirmation() {
    window.print();
}

// ===== NAVIGATION RAPIDE =====
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function ouvrirPanierRapide() {
    document.getElementById('panier').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
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
    });
}

function initialiserFormulairePaiement() {
    const form = document.getElementById('formulairePaiement');
    
    form.addEventListener('submit', traiterPaiement);
}

function initialiserFormulaireAvis() {
    const form = document.getElementById('avisForm');
    const etoiles = document.querySelectorAll('.etoile');
    let noteSelectionnee = 0;
    
    // Gestion des étoiles
    etoiles.forEach((etoile, index) => {
        etoile.addEventListener('click', () => {
            noteSelectionnee = index + 1;
            document.getElementById('avis-note').value = noteSelectionnee;
            
            // Mettre à jour l'affichage des étoiles
            etoiles.forEach((e, i) => {
                e.classList.toggle('active', i <= index);
            });
        });
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (noteSelectionnee === 0) {
            afficherNotification('❌ Veuillez donner une note', 'error');
            return;
        }
        
        afficherNotification('📝 Merci pour votre avis ! Il sera publié après modération.', 'success');
        form.reset();
        
        // Réinitialiser les étoiles
        etoiles.forEach(etoile => etoile.classList.remove('active'));
        noteSelectionnee = 0;
    });
}

function initialiserNewsletter() {
    const form = document.getElementById('newsletterForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]').value;
        
        afficherNotification('📧 Merci pour votre inscription à la newsletter !', 'success');
        form.reset();
    });
}

// ===== FAQ =====
function initialiserFAQ() {
    const questions = document.querySelectorAll('.faq-question');
    
    questions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            item.classList.toggle('active');
        });
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
    
    // Fermer la navigation mobile en cliquant sur un lien
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
    
    // Filtres des produits
    const filtresBtns = document.querySelectorAll('.filtre-btn');
    filtresBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filtrerProduits(btn.dataset.filtre);
        });
    });
    
    // Recherche de produits
    const rechercheInput = document.getElementById('rechercheProduits');
    if (rechercheInput) {
        rechercheInput.addEventListener('input', (e) => {
            rechercherProduits(e.target.value);
        });
    }
    
    // Thème toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Initialiser les formulaires
    initialiserFormulaireCreation();
    initialiserFormulairePaiement();
    initialiserFormulaireAvis();
    initialiserNewsletter();
    initialiserFAQ();
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
    const elementsToAnimate = document.querySelectorAll('.product-card, .avis-card, .contact-item, .valeur-card, .faq-item');
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

// ===== SERVICE WORKER (PWA) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
