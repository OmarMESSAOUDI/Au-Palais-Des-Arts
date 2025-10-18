// Configuration et données
const produits = [
    {
        id: 1,
        nom: "Panier Rectangulaire en Jacinthe d'Eau",
        description: "Panier élégant en jacinthe d'eau naturelle, parfait pour le rangement ou comme élément de décoration. Tressage serré pour une durabilité optimale.",
        prix: 45.00,
        prixPromo: 38.25,
        image: "images/panier-rectangulaire-jacinthe.jpg",
        stock: 12,
        origine: "🇲🇦 Fait main au Maroc",
        materiau: "Jacinthe d'eau naturelle",
        dimensions: "35x25x15cm"
    },
    {
        id: 2,
        nom: "Panier Rond Jacinthe d'Eau H36.5",
        description: "Magnifique panier rond en jacinthe d'eau, idéal pour la décoration ou le rangement. Forme classique et design intemporel.",
        prix: 52.00,
        image: "images/panier-rond-jacinthe.jpg",
        stock: 8,
        origine: "🇲🇦 Fait main au Maroc",
        materiau: "Jacinthe d'eau naturelle",
        dimensions: "Ø36.5 x H25cm"
    },
    {
        id: 3,
        nom: "Panier Tressé Rectangulaire",
        description: "Panier rectangulaire au tressage traditionnel marocain. Solide et spacieux, parfait pour le rangement du linge ou des courses.",
        prix: 38.00,
        prixPromo: 32.30,
        image: "images/panier-tresse-rectangulaire.jpg",
        stock: 15,
        origine: "🇲🇦 Fait main au Maroc",
        materiau: "Osier naturel",
        dimensions: "40x30x20cm"
    },
    {
        id: 4,
        nom: "Panier Double Compartiment",
        description: "Panier pratique avec séparateur intégré. Idéal pour organiser vos affaires ou pour un pique-nique élégant.",
        prix: 58.00,
        image: "images/panier-double-compartiment.jpg",
        stock: 6,
        origine: "🇲🇦 Fait main au Maroc",
        materiau: "Osier et rotin",
        dimensions: "45x35x18cm"
    },
    {
        id: 5,
        nom: "Panier en Feuilles de Palmier",
        description: "Création écologique en feuilles de palmier naturel. Légère et résistante, parfaite pour le marché ou la plage.",
        prix: 42.00,
        image: "images/panier-feuilles-palmier.jpg",
        stock: 20,
        origine: "🇲🇦 Fait main au Maroc",
        materiau: "Feuilles de palmier",
        dimensions: "40x30x25cm"
    },
    {
        id: 6,
        nom: "Panier Rond en Osier",
        description: "Panier rond classique en osier de qualité supérieure. Polyvalent et esthétique, s'adapte à tous les intérieurs.",
        prix: 35.00,
        prixPromo: 29.75,
        image: "images/panier-rond-osier.jpg",
        stock: 18,
        origine: "🇲🇦 Fait main au Maroc",
        materiau: "Osier naturel",
        dimensions: "Ø35 x H20cm"
    },
    {
        id: 7,
        nom: "Panier Ovale en Rotin Naturel",
        description: "Élégant panier ovale en rotin naturel. Forme ergonomique et design raffiné pour une touche d'élégance.",
        prix: 48.00,
        image: "images/panier-ovale-rotin.jpg",
        stock: 10,
        origine: "🇲🇦 Fait main au Maroc",
        materiau: "Rotin naturel",
        dimensions: "50x30x18cm"
    }
];

const avisClients = [
    {
        nom: "Marie L.",
        note: 5,
        texte: "Le panier en jacinthe d'eau est magnifique ! La qualité de fabrication est exceptionnelle. Je recommande vivement !",
        date: "2024-09-15"
    },
    {
        nom: "Pierre D.",
        note: 5,
        texte: "Commande sur mesure parfaite. Les artisans ont suivi mes instructions à la lettre. Un savoir-faire remarquable.",
        date: "2024-09-10"
    },
    {
        nom: "Sophie M.",
        note: 4,
        texte: "Très belle qualité, livraison rapide. Le panier est encore plus beau en vrai que sur les photos.",
        date: "2024-09-05"
    },
    {
        nom: "Thomas R.",
        note: 5,
        texte: "Service client au top et produits d'une qualité rare. Je reviendrai pour d'autres créations.",
        date: "2024-08-28"
    }
];

// Variables globales
let panier = JSON.parse(localStorage.getItem('panier')) || [];
let favoris = JSON.parse(localStorage.getItem('favoris')) || [];
let produitsRecents = JSON.parse(localStorage.getItem('produitsRecents')) || [];
let codePromoActif = null;

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', function() {
    initialiserApp();
    chargerProduits();
    chargerAvis();
    initialiserEvenements();
    verifierPromoBanner();
});

function initialiserApp() {
    // Cacher l'écran de chargement
    setTimeout(() => {
        document.getElementById('loadingScreen').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loadingScreen').style.display = 'none';
        }, 500);
    }, 2000);

    // Mettre à jour les compteurs
    mettreAJourCompteurs();
}

function chargerProduits() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';

    produits.forEach((produit, index) => {
        const productCard = creerCarteProduit(produit, index);
        grid.appendChild(productCard);
    });

    // Animation d'apparition
    setTimeout(() => {
        document.querySelectorAll('.product-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate-in');
            }, index * 100);
        });
    }, 100);
}

function creerCarteProduit(produit, index) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = `${index * 0.1}s`;

    const estEnPromo = produit.prixPromo && produit.prixPromo < produit.prix;
    const estFavori = favoris.includes(produit.id);
    const stockClass = produit.stock > 10 ? 'in-stock' : produit.stock > 0 ? 'low-stock' : 'out-of-stock';
    const stockText = produit.stock > 10 ? 'En stock' : produit.stock > 0 ? 'Stock faible' : 'Rupture';

    card.innerHTML = `
        ${estEnPromo ? '<div class="product-badge">-15%</div>' : ''}
        <button class="favorite-btn ${estFavori ? 'active' : ''}" onclick="toggleFavori(${produit.id})">
            ${estFavori ? '❤️' : '🤍'}
        </button>
        
        <div class="product-image-container">
            <div class="product-image">
                <img src="${produit.image}" alt="${produit.nom}" class="product-img" 
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9IiNlMmU4ZjAiPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM3MTgwOTYiPkltYWdlIG5vbiBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg=='">
            </div>
        </div>
        
        <div class="product-content">
            <h3 class="product-title">${produit.nom}</h3>
            <p class="product-description">${produit.description}</p>
            
            <div class="product-meta">
                <span>📏 ${produit.dimensions}</span>
                <span>🌿 ${produit.materiau}</span>
            </div>
            
            <div class="product-stock">
                <span class="stock-indicator ${stockClass}">${stockText}</span>
                ${produit.stock > 0 ? `<span class="stock-quantity">(${produit.stock} restants)</span>` : ''}
            </div>
            
            <div class="product-origin">${produit.origine}</div>
            
            <div class="product-price">
                ${estEnPromo ? `
                    <span class="price-promo">${produit.prix}€</span>
                    <span class="price-original">${produit.prixPromo}€</span>
                ` : `
                    <span class="price-original">${produit.prix}€</span>
                `}
            </div>
            
            <button class="btn btn-primary btn-full" onclick="ajouterAuPanier(${produit.id})" 
                    ${produit.stock === 0 ? 'disabled' : ''}>
                ${produit.stock === 0 ? 'Rupture de stock' : '🛒 Ajouter au panier'}
            </button>
        </div>
    `;

    // Ajouter l'événement de clic pour suivre les produits consultés
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.favorite-btn') && !e.target.closest('.btn')) {
            ajouterProduitRecent(produit.id);
        }
    });

    return card;
}

function chargerAvis() {
    const grid = document.getElementById('avisGrid');
    grid.innerHTML = '';

    avisClients.forEach((avis, index) => {
        const avisCard = document.createElement('div');
        avisCard.className = 'avis-card';
        avisCard.style.animationDelay = `${index * 0.1}s`;

        const etoiles = '★'.repeat(avis.note) + '☆'.repeat(5 - avis.note);
        const dateFormatee = new Date(avis.date).toLocaleDateString('fr-FR');

        avisCard.innerHTML = `
            <div class="avis-header">
                <div class="avis-client">
                    <div class="client-avatar">${avis.nom.charAt(0)}</div>
                    <div>
                        <h4>${avis.nom}</h4>
                        <div class="avis-rating">${etoiles}</div>
                    </div>
                </div>
            </div>
            <p class="avis-text">"${avis.texte}"</p>
            <div class="avis-date">${dateFormatee}</div>
        `;

        grid.appendChild(avisCard);
    });

    // Animation d'apparition
    setTimeout(() => {
        document.querySelectorAll('.avis-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate-in');
            }, index * 100);
        });
    }, 100);
}

function initialiserEvenements() {
    // Navigation mobile
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', () => {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Fermer le menu mobile en cliquant sur un lien
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        if (window.scrollY > 100) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }

        // Bouton retour en haut
        const backToTop = document.getElementById('backToTop');
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    // Bouton retour en haut
    document.getElementById('backToTop').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Modals
    initialiserModals();

    // Formulaires
    initialiserFormulaires();

    // Animations au scroll
    initialiserAnimationsScroll();
}

function initialiserModals() {
    // Modal panier
    const cartBtn = document.getElementById('cartBtn');
    const panierModal = document.getElementById('panierModal');
    const closePanier = document.getElementById('closePanier');

    cartBtn.addEventListener('click', () => {
        ouvrirPanier();
    });

    closePanier.addEventListener('click', () => {
        fermerPanier();
    });

    // Modal favoris
    const favoritesBtn = document.getElementById('favoritesBtn');
    const favoritesModal = document.getElementById('favoritesModal');
    const closeFavorites = document.getElementById('closeFavorites');
    const closeFavoritesBtn = document.getElementById('closeFavoritesBtn');

    favoritesBtn.addEventListener('click', () => {
        ouvrirFavoris();
    });

    closeFavorites.addEventListener('click', fermerFavoris);
    closeFavoritesBtn.addEventListener('click', fermerFavoris);

    // Fermer les modals en cliquant à l'extérieur
    [panierModal, favoritesModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                if (modal === panierModal) fermerPanier();
                if (modal === favoritesModal) fermerFavoris();
            }
        });
    });

    // Processus de commande
    document.getElementById('commanderBtn').addEventListener('click', () => {
        if (panier.length === 0) {
            afficherNotification('Votre panier est vide', 'error');
            return;
        }
        passerEtapeSuivante();
    });

    document.getElementById('retourPanierBtn').addEventListener('click', () => {
        retournerAuPanier();
    });

    document.getElementById('paiementBtn').addEventListener('click', () => {
        traiterPaiement();
    });

    document.getElementById('viderPanierBtn').addEventListener('click', () => {
        viderPanier();
    });
}

function initialiserFormulaires() {
    // Formulaire création sur mesure
    const creationForm = document.getElementById('creationForm');
    creationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        soumettreFormulaireCreation();
    });

    // Formulaire de paiement
    const paiementForm = document.getElementById('paiementForm');
    paiementForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Le paiement est géré par le bouton dédié
    });
}

function initialiserAnimationsScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observer les éléments à animer
    document.querySelectorAll('.valeur-card, .contact-item').forEach(el => {
        observer.observe(el);
    });
}

// Fonctions panier
function ajouterAuPanier(produitId) {
    const produit = produits.find(p => p.id === produitId);
    
    if (!produit) return;

    const articleExistant = panier.find(item => item.id === produitId);
    
    if (articleExistant) {
        if (articleExistant.quantite >= produit.stock) {
            afficherNotification('Stock insuffisant pour ce produit', 'error');
            return;
        }
        articleExistant.quantite++;
    } else {
        panier.push({
            id: produit.id,
            nom: produit.nom,
            prix: produit.prixPromo || produit.prix,
            image: produit.image,
            quantite: 1
        });
    }

    sauvegarderPanier();
    mettreAJourCompteurs();
    
    if (panierModal.classList.contains('active')) {
        afficherPanier();
    }
    
    afficherNotification(`${produit.nom} ajouté au panier`, 'success');
}

function supprimerDuPanier(produitId) {
    panier = panier.filter(item => item.id !== produitId);
    sauvegarderPanier();
    mettreAJourCompteurs();
    afficherPanier();
    afficherNotification('Produit retiré du panier', 'success');
}

function modifierQuantite(produitId, changement) {
    const article = panier.find(item => item.id === produitId);
    if (!article) return;

    const produit = produits.find(p => p.id === produitId);
    const nouvelleQuantite = article.quantite + changement;

    if (nouvelleQuantite < 1) {
        supprimerDuPanier(produitId);
        return;
    }

    if (nouvelleQuantite > produit.stock) {
        afficherNotification(`Stock insuffisant. Maximum disponible : ${produit.stock}`, 'error');
        return;
    }

    article.quantite = nouvelleQuantite;
    sauvegarderPanier();
    mettreAJourCompteurs();
    afficherPanier();
}

function viderPanier() {
    if (panier.length === 0) {
        afficherNotification('Le panier est déjà vide', 'error');
        return;
    }

    if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
        panier = [];
        sauvegarderPanier();
        mettreAJourCompteurs();
        afficherPanier();
        afficherNotification('Panier vidé', 'success');
    }
}

function sauvegarderPanier() {
    localStorage.setItem('panier', JSON.stringify(panier));
}

function mettreAJourCompteurs() {
    const totalArticles = panier.reduce((total, item) => total + item.quantite, 0);
    document.querySelector('.cart-count').textContent = totalArticles;
    document.querySelector('.favorites-count').textContent = favoris.length;
}

// Fonctions favoris
function toggleFavori(produitId) {
    const index = favoris.indexOf(produitId);
    
    if (index > -1) {
        favoris.splice(index, 1);
        afficherNotification('Produit retiré des favoris', 'success');
    } else {
        favoris.push(produitId);
        afficherNotification('Produit ajouté aux favoris', 'success');
    }
    
    localStorage.setItem('favoris', JSON.stringify(favoris));
    mettreAJourCompteurs();
    
    // Recharger les produits pour mettre à jour les boutons favoris
    chargerProduits();
    
    if (document.getElementById('favoritesModal').classList.contains('active')) {
        afficherFavoris();
    }
}

// Fonctions produits récents
function ajouterProduitRecent(produitId) {
    produitsRecents = produitsRecents.filter(id => id !== produitId);
    produitsRecents.unshift(produitId);
    produitsRecents = produitsRecents.slice(0, 4); // Garder seulement les 4 derniers
    localStorage.setItem('produitsRecents', JSON.stringify(produitsRecents));
    afficherProduitsRecents();
}

function afficherProduitsRecents() {
    const section = document.getElementById('recently-viewed-section');
    const grid = document.getElementById('recently-viewed-grid');
    
    if (produitsRecents.length === 0) {
        section.style.display = 'none';
        return;
    }
    
    section.style.display = 'block';
    grid.innerHTML = '';
    
    produitsRecents.forEach(produitId => {
        const produit = produits.find(p => p.id === produitId);
        if (produit) {
            const productCard = creerCarteProduit(produit);
            grid.appendChild(productCard);
        }
    });
}

// Fonctions modals
function ouvrirPanier() {
    const modal = document.getElementById('panierModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    afficherPanier();
}

function fermerPanier() {
    const modal = document.getElementById('panierModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    retournerAuPanier(); // Revenir à l'étape 1
}

function ouvrirFavoris() {
    const modal = document.getElementById('favoritesModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    afficherFavoris();
}

function fermerFavoris() {
    const modal = document.getElementById('favoritesModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function afficherPanier() {
    const container = document.getElementById('panier-items');
    
    if (panier.length === 0) {
        container.innerHTML = '<div class="panier-vide">Votre panier est vide</div>';
        mettreAJourTotaux();
        return;
    }

    container.innerHTML = panier.map(item => {
        const produit = produits.find(p => p.id === item.id);
        return `
            <div class="panier-item">
                <div class="panier-item-image">
                    <img src="${item.image}" alt="${item.nom}" 
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiNlMmU4ZjAiPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM3MTgwOTYiPk5vbiBkaXNwbzwvdGV4dD48L3N2Zz4='">
                </div>
                <div class="panier-item-details">
                    <div class="panier-item-title">${item.nom}</div>
                    <div class="panier-item-price">${item.prix}€</div>
                    <div class="panier-item-quantity">
                        <button class="quantity-btn" onclick="modifierQuantite(${item.id}, -1)">-</button>
                        <span>${item.quantite}</span>
                        <button class="quantity-btn" onclick="modifierQuantite(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="supprimerDuPanier(${item.id})" aria-label="Supprimer">
                    🗑️
                </button>
            </div>
        `;
    }).join('');

    mettreAJourTotaux();
}

function afficherFavoris() {
    const container = document.getElementById('favorites-items');
    
    if (favoris.length === 0) {
        container.innerHTML = '<div class="favorites-vide">Aucun produit en favoris</div>';
        return;
    }

    container.innerHTML = favoris.map(produitId => {
        const produit = produits.find(p => p.id === produitId);
        if (!produit) return '';
        
        return `
            <div class="favorite-item">
                <div class="favorite-item-image">
                    <img src="${produit.image}" alt="${produit.nom}">
                </div>
                <div class="favorite-item-details">
                    <div class="favorite-item-title">${produit.nom}</div>
                    <div class="favorite-item-price">${produit.prixPromo || produit.prix}€</div>
                </div>
                <div class="favorite-actions">
                    <button class="btn btn-primary" onclick="ajouterAuPanier(${produit.id})">🛒</button>
                    <button class="remove-favorite" onclick="toggleFavori(${produit.id})" aria-label="Retirer des favoris">
                        ❌
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Fonctions processus de commande
function passerEtapeSuivante() {
    document.getElementById('panier-step-1').style.display = 'none';
    document.getElementById('panier-step-2').style.display = 'block';
    document.getElementById('actions-step-1').style.display = 'none';
    document.getElementById('actions-step-2').style.display = 'flex';
    document.getElementById('panierModalTitle').textContent = '💳 Finaliser la commande';
}

function retournerAuPanier() {
    document.getElementById('panier-step-1').style.display = 'block';
    document.getElementById('panier-step-2').style.display = 'none';
    document.getElementById('actions-step-1').style.display = 'flex';
    document.getElementById('actions-step-2').style.display = 'none';
    document.getElementById('panierModalTitle').textContent = '🛒 Votre Panier';
}

function traiterPaiement() {
    const form = document.getElementById('paiementForm');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Simulation de traitement de paiement
    afficherNotification('Traitement de votre paiement...', 'success');
    
    setTimeout(() => {
        // Réinitialiser le panier
        panier = [];
        sauvegarderPanier();
        mettreAJourCompteurs();
        
        // Fermer le modal
        fermerPanier();
        
        // Afficher confirmation
        afficherNotification('Commande confirmée ! Merci pour votre achat.', 'success');
        
        // Réinitialiser le formulaire
        form.reset();
    }, 2000);
}

// Fonctions calculs
function mettreAJourTotaux() {
    const sousTotal = panier.reduce((total, item) => total + (item.prix * item.quantite), 0);
    
    // Calcul des frais de livraison
    const livraisonSelectionnee = document.querySelector('input[name="livraison"]:checked');
    const fraisLivraison = livraisonSelectionnee ? parseFloat(livraisonSelectionnee.value === 'standard' ? 7.90 : 14.90) : 0;
    
    // Application du code promo
    let reduction = 0;
    if (codePromoActif === 'BIENVENUE10') {
        reduction = sousTotal * 0.1; // 10% de réduction
    }
    
    const total = sousTotal - reduction + fraisLivraison;

    // Mettre à jour l'affichage
    document.getElementById('sous-total').textContent = sousTotal.toFixed(2) + '€';
    document.getElementById('frais-livraison').textContent = fraisLivraison.toFixed(2) + '€';
    document.getElementById('total-panier').textContent = total.toFixed(2) + '€';

    // Afficher/masquer la ligne de réduction
    const promoLine = document.getElementById('panier-promo');
    if (reduction > 0) {
        promoLine.style.display = 'flex';
        document.getElementById('montant-promo').textContent = '-' + reduction.toFixed(2) + '€';
    } else {
        promoLine.style.display = 'none';
    }

    // Mettre à jour les boutons de livraison
    document.querySelectorAll('.livraison-option input').forEach(radio => {
        radio.addEventListener('change', mettreAJourTotaux);
    });
}

// Fonctions codes promo
function appliquerCodePromo() {
    const input = document.getElementById('codePromoInput');
    const code = input.value.trim().toUpperCase();
    const message = document.getElementById('promoMessage');

    const codesValides = {
        'BIENVENUE10': 10,
        'ARTISANAT15': 15,
        'MAROC20': 20
    };

    if (codesValides[code]) {
        codePromoActif = code;
        message.textContent = `Code promo appliqué ! -${codesValides[code]}% de réduction`;
        message.className = 'promo-message success';
        input.disabled = true;
        mettreAJourTotaux();
        afficherNotification(`Code promo ${code} appliqué !`, 'success');
    } else {
        message.textContent = 'Code promo invalide';
        message.className = 'promo-message error';
    }
}

// Fonctions formulaires
function soumettreFormulaireCreation() {
    const form = document.getElementById('creationForm');
    const formData = new FormData(form);
    
    // Simulation d'envoi
    afficherNotification('Votre demande de création a été envoyée !', 'success');
    form.reset();
    
    // Redirection douce vers la section contact
    setTimeout(() => {
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    }, 1000);
}

// Fonctions utilitaires
function afficherNotification(message, type = 'success') {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${type === 'success' ? '✅' : '❌'}</span>
            <span>${message}</span>
        </div>
    `;

    container.appendChild(notification);

    // Animation d'entrée
    setTimeout(() => notification.classList.add('show'), 100);

    // Suppression automatique
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

function fermerPromoBanner() {
    const banner = document.getElementById('promoBanner');
    banner.style.transform = 'translateY(-100%)';
    banner.style.opacity = '0';
    setTimeout(() => {
        banner.style.display = 'none';
    }, 500);
    
    // Sauvegarder la préférence
    localStorage.setItem('promoBannerFerme', 'true');
}

function verifierPromoBanner() {
    const dejaFerme = localStorage.getItem('promoBannerFerme');
    if (!dejaFerme) {
        const banner = document.getElementById('promoBanner');
        setTimeout(() => {
            banner.style.display = 'block';
        }, 3000);
    }
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Gestion du mode hors ligne
window.addEventListener('online', () => {
    afficherNotification('Connexion rétablie', 'success');
});

window.addEventListener('offline', () => {
    afficherNotification('Vous êtes hors ligne', 'error');
});
