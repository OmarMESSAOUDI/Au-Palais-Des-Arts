// ===== CONFIGURATION GLOBALE =====
const CONFIG = {
    produitsParPage: 8,          // Nombre de produits affichés par page
    delaiChargement: 1000,       // Délai simulé du chargement
    apiBaseURL: 'https://api.aupalaisdesarts.fr' // URL de l'API (simulée)
};

// ===== ÉTAT DE L'APPLICATION =====
const state = {
    panier: [],                  // Tableau des articles dans le panier
    produits: [],                // Liste complète des produits
    produitsFiltres: [],         // Produits filtrés actuellement affichés
    pageCourante: 1,             // Page actuelle de la pagination
    theme: 'light'               // Thème actuel (light/dark)
};

// ===== INITIALISATION DE L'APPLICATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation de l application Au Palais Des Arts');
    
    // Initialisation des différents modules
    initialiserApplication();
    initialiserEvenements();
    chargerProduits();
});

/**
 * Initialise l'application principale
 */
function initialiserApplication() {
    console.log('📱 Initialisation des composants');
    
    // Charger le panier depuis le localStorage
    chargerPanier();
    
    // Initialiser le thème
    initialiserTheme();
    
    // Afficher l'écran de chargement
    afficherChargement();
}

/**
 * Initialise tous les écouteurs d'événements
 */
function initialiserEvenements() {
    console.log('🎯 Initialisation des événements');
    
    // Navigation mobile
    initialiserNavigationMobile();
    
    // Filtres produits
    initialiserFiltres();
    
    // Panier
    initialiserPanier();
    
    // Formulaire de contact
    initialiserFormulaireContact();
    
    // Scroll et autres interactions
    initialiserInteractions();
}

// ===== GESTION DU CHARGEMENT =====

/**
 * Affiche l'écran de chargement
 */
function afficherChargement() {
    const loadingScreen = document.getElementById('loadingScreen');
    const progressBar = document.getElementById('loadingProgress');
    
    // Animation de la barre de progression
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Masquer l'écran de chargement après délai
            setTimeout(cacherChargement, 500);
        }
        progressBar.style.width = progress + '%';
    }, 200);
}

/**
 * Cache l'écran de chargement
 */
function cacherChargement() {
    const loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.classList.add('hidden');
    
    // Retirer complètement l'élément après l'animation
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 500);
    
    console.log('✅ Chargement terminé');
}

// ===== GESTION DE LA NAVIGATION MOBILE =====

/**
 * Initialise le menu de navigation mobile
 */
function initialiserNavigationMobile() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            // Basculer l'état du menu
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Mettre à jour l'accessibilité
            const isExpanded = navMenu.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isExpanded);
        });
    }
    
    // Fermer le menu en cliquant sur un lien
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

// ===== GESTION DES PRODUITS =====

/**
 * Charge les produits (simulation d'appel API)
 */
function chargerProduits() {
    console.log('📦 Chargement des produits...');
    
    // Simulation d'un appel API avec setTimeout
    setTimeout(() => {
        // Données des produits avec de vraies images d'osier
        state.produits = [
            {
                id: 1,
                nom: "Panier Royal en Osier",
                prix: 45.00,
                categorie: "panier",
                image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&auto=format",
                description: "Panier d'exception en osier naturel, tissage traditionnel français. Parfait pour le rangement ou la décoration.",
                dimensions: "30x40cm",
                livraison: "48h",
                stock: 15
            },
            {
                id: 2,
                nom: "Corbeille Champêtre",
                prix: 28.00,
                categorie: "corbeille",
                image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&auto=format",
                description: "Corbeille authentique pour votre décoration naturelle. Idéale pour les fruits ou le rangement.",
                dimensions: "25x35cm",
                livraison: "48h",
                stock: 8
            },
            {
                id: 3,
                nom: "Panier Jardin Rustique",
                prix: 38.00,
                categorie: "panier",
                image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&auto=format",
                description: "Panier robuste idéal pour le jardin, les courses ou la décoration campagne.",
                dimensions: "35x45cm",
                livraison: "48h",
                stock: 12
            },
            {
                id: 4,
                nom: "Corbeille à Fruits Élégante",
                prix: 32.00,
                categorie: "corbeille",
                image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&auto=format",
                description: "Corbeille raffinée pour présenter vos fruits avec élégance et style naturel.",
                dimensions: "28x38cm",
                livraison: "48h",
                stock: 10
            },
            {
                id: 5,
                nom: "Suspension Naturelle",
                prix: 65.00,
                categorie: "decoration",
                image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&auto=format",
                description: "Luminaire artistique en osier pour une ambiance chaleureuse et naturelle.",
                dimensions: "Diamètre 45cm",
                livraison: "72h",
                stock: 5
            },
            {
                id: 6,
                nom: "Panier Pique-nique",
                prix: 55.00,
                categorie: "panier",
                image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&auto=format",
                description: "Panier spacieux avec anses renforcées, parfait pour vos pique-niques.",
                dimensions: "40x50cm",
                livraison: "48h",
                stock: 7
            }
        ];
        
        // Initialiser les produits filtrés
        state.produitsFiltres = [...state.produits];
        
        // Afficher les produits
        afficherProduits();
        
        console.log('✅ Produits chargés:', state.produits.length);
        
    }, CONFIG.delaiChargement);
}

/**
 * Affiche les produits dans la grille
 */
function afficherProduits() {
    const grilleProduits = document.getElementById('grilleProduits');
    
    if (!grilleProduits) {
        console.error('❌ Élément grilleProduits non trouvé');
        return;
    }
    
    // Calculer les produits à afficher pour la page courante
    const indexDebut = (state.pageCourante - 1) * CONFIG.produitsParPage;
    const indexFin = indexDebut + CONFIG.produitsParPage;
    const produitsAAfficher = state.produitsFiltres.slice(indexDebut, indexFin);
    
    // Vérifier s'il y a des produits à afficher
    if (produitsAAfficher.length === 0) {
        grilleProduits.innerHTML = `
            <div class="aucun-resultat">
                <p>Aucun produit ne correspond à votre recherche</p>
                <button class="btn btn-secondary" onclick="reinitialiserFiltres()">
                    Réinitialiser les filtres
                </button>
            </div>
        `;
    } else {
        // Générer le HTML pour chaque produit
        grilleProduits.innerHTML = produitsAAfficher.map(produit => `
            <div class="produit-card" data-id="${produit.id}">
                <img src="${produit.image}" alt="${produit.nom}" class="produit-image">
                <div class="produit-content">
                    <h3 class="produit-title">${produit.nom}</h3>
                    <p class="produit-description">${produit.description}</p>
                    <div class="produit-meta">
                        <span class="produit-dimensions">📏 ${produit.dimensions}</span>
                        <span class="produit-livraison">🚚 ${produit.livraison}</span>
                    </div>
                    <div class="produit-price">${produit.prix.toFixed(2)}€</div>
                    <button class="btn btn-primary btn-ajouter-panier" data-id="${produit.id}">
                        Ajouter au panier
                    </button>
                </div>
            </div>
        `).join('');
        
        // Attacher les événements aux boutons "Ajouter au panier"
        attacherEvenementsAjoutPanier();
    }
    
    // Mettre à jour la pagination
    mettreAJourPagination();
}

/**
 * Attache les événements aux boutons d'ajout au panier
 */
function attacherEvenementsAjoutPanier() {
    document.querySelectorAll('.btn-ajouter-panier').forEach(bouton => {
        bouton.addEventListener('click', function(e) {
            const produitId = parseInt(this.getAttribute('data-id'));
            ajouterAuPanier(produitId);
        });
    });
}

// ===== GESTION DES FILTRES =====

/**
 * Initialise le système de filtres
 */
function initialiserFiltres() {
    // Filtres par catégorie
    document.querySelectorAll('.filtre-btn').forEach(bouton => {
        bouton.addEventListener('click', function() {
            // Retirer la classe active de tous les boutons
            document.querySelectorAll('.filtre-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Activer le bouton cliqué
            this.classList.add('active');
            
            // Appliquer le filtre
            const categorie = this.getAttribute('data-categorie');
            filtrerProduits(categorie);
        });
    });
    
    // Barre de recherche
    const inputRecherche = document.getElementById('inputRecherche');
    const btnRecherche = document.getElementById('btnRecherche');
    
    if (inputRecherche && btnRecherche) {
        // Recherche au clic sur le bouton
        btnRecherche.addEventListener('click', () => {
            appliquerRecherche(inputRecherche.value);
        });
        
        // Recherche à la saisie (avec debounce)
        let timeoutRecherche;
        inputRecherche.addEventListener('input', (e) => {
            clearTimeout(timeoutRecherche);
            timeoutRecherche = setTimeout(() => {
                appliquerRecherche(e.target.value);
            }, 300);
        });
    }
}

/**
 * Filtre les produits par catégorie
 */
function filtrerProduits(categorie) {
    if (categorie === 'tous') {
        state.produitsFiltres = [...state.produits];
    } else {
        state.produitsFiltres = state.produits.filter(produit => 
            produit.categorie === categorie
        );
    }
    
    // Réinitialiser à la première page
    state.pageCourante = 1;
    
    // Réafficher les produits
    afficherProduits();
    
    console.log(`🔍 Filtre appliqué: ${categorie}, ${state.produitsFiltres.length} produits`);
}

/**
 * Applique la recherche sur les produits
 */
function appliquerRecherche(terme) {
    if (!terme.trim()) {
        // Si la recherche est vide, réinitialiser les filtres
        const boutonTous = document.querySelector('[data-categorie="tous"]');
        if (boutonTous) {
            boutonTous.click();
        }
        return;
    }
    
    terme = terme.toLowerCase();
    
    state.produitsFiltres = state.produits.filter(produit =>
        produit.nom.toLowerCase().includes(terme) ||
        produit.description.toLowerCase().includes(terme)
    );
    
    state.pageCourante = 1;
    afficherProduits();
    
    console.log(`🔍 Recherche: "${terme}", ${state.produitsFiltres.length} résultats`);
}

/**
 * Réinitialise tous les filtres
 */
function reinitialiserFiltres() {
    // Réinitialiser la recherche
    const inputRecherche = document.getElementById('inputRecherche');
    if (inputRecherche) {
        inputRecherche.value = '';
    }
    
    // Activer le filtre "tous"
    const boutonTous = document.querySelector('[data-categorie="tous"]');
    if (boutonTous) {
        boutonTous.click();
    }
}

// ===== GESTION DE LA PAGINATION =====

/**
 * Met à jour l'affichage de la pagination
 */
function mettreAJourPagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    const totalPages = Math.ceil(state.produitsFiltres.length / CONFIG.produitsParPage);
    
    // Masquer la pagination s'il n'y a qu'une page
    if (totalPages <= 1) {
        pagination.style.display = 'none';
        return;
    }
    
    pagination.style.display = 'flex';
    
    // Boutons précédent/suivant
    const prevBtn = pagination.querySelector('.prev');
    const nextBtn = pagination.querySelector('.next');
    
    prevBtn.disabled = state.pageCourante === 1;
    nextBtn.disabled = state.pageCourante === totalPages;
    
    // Gestionnaires d'événements
    prevBtn.onclick = () => changerPage(state.pageCourante - 1);
    nextBtn.onclick = () => changerPage(state.pageCourante + 1);
    
    // Numéros de page
    const pageNumbers = pagination.querySelector('.page-numbers');
    pageNumbers.innerHTML = '';
    
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-number ${i === state.pageCourante ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.onclick = () => changerPage(i);
        pageNumbers.appendChild(pageBtn);
    }
}

/**
 * Change la page courante
 */
function changerPage(nouvellePage) {
    state.pageCourante = nouvellePage;
    afficherProduits();
    
    // Scroll vers le haut de la section produits
    const sectionProduits = document.getElementById('produits');
    if (sectionProduits) {
        sectionProduits.scrollIntoView({ behavior: 'smooth' });
    }
}

// ===== GESTION DU PANIER =====

/**
 * Initialise le système de panier
 */
function initialiserPanier() {
    const iconePanier = document.getElementById('iconePanier');
    const panier = document.getElementById('panier');
    const overlay = document.getElementById('overlay');
    const closePanier = document.querySelector('.close-panier');
    
    if (iconePanier && panier && overlay) {
        // Ouvrir le panier
        iconePanier.addEventListener('click', () => {
            panier.classList.add('ouvert');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Bloquer le scroll
        });
        
        // Fermer le panier
        if (closePanier) {
            closePanier.addEventListener('click', fermerPanier);
        }
        
        overlay.addEventListener('click', fermerPanier);
    }
    
    // Bouton commander
    const btnCommander = document.getElementById('btnCommander');
    if (btnCommander) {
        btnCommander.addEventListener('click', passerCommande);
    }
}

/**
 * Charge le panier depuis le localStorage
 */
function chargerPanier() {
    const panierSauvegarde = localStorage.getItem('panier_apa');
    if (panierSauvegarde) {
        try {
            state.panier = JSON.parse(panierSauvegarde);
            mettreAJourBadgePanier();
        } catch (error) {
            console.error('❌ Erreur lors du chargement du panier:', error);
            state.panier = [];
        }
    }
}

/**
 * Sauvegarde le panier dans le localStorage
 */
function sauvegarderPanier() {
    try {
        localStorage.setItem('panier_apa', JSON.stringify(state.panier));
    } catch (error) {
        console.error('❌ Erreur lors de la sauvegarde du panier:', error);
    }
}

/**
 * Ajoute un produit au panier
 */
function ajouterAuPanier(produitId) {
    const produit = state.produits.find(p => p.id === produitId);
    
    if (!produit) {
        console.error('❌ Produit non trouvé:', produitId);
        return;
    }
    
    // Vérifier si le produit est déjà dans le panier
    const articleExistant = state.panier.find(item => item.id === produitId);
    
    if (articleExistant) {
        articleExistant.quantite += 1;
    } else {
        state.panier.push({
            ...produit,
            quantite: 1
        });
    }
    
    // Sauvegarder et mettre à jour l'interface
    sauvegarderPanier();
    mettreAJourBadgePanier();
    afficherNotification(`${produit.nom} ajouté au panier !`, 'success');
    
    console.log('🛒 Produit ajouté au panier:', produit.nom);
}

/**
 * Met à jour le badge du panier
 */
function mettreAJourBadgePanier() {
    const badge = document.querySelector('.badge-panier');
    if (badge) {
        const totalArticles = state.panier.reduce((total, item) => total + item.quantite, 0);
        badge.textContent = totalArticles;
    }
}

/**
 * Ferme le panier
 */
function fermerPanier() {
    const panier = document.getElementById('panier');
    const overlay = document.getElementById('overlay');
    
    if (panier && overlay) {
        panier.classList.remove('ouvert');
        overlay.classList.remove('active');
        document.body.style.overflow = ''; // Rétablir le scroll
    }
}

/**
 * Passe la commande (simulation)
 */
function passerCommande() {
    if (state.panier.length === 0) {
        afficherNotification('Votre panier est vide', 'error');
        return;
    }
    
    afficherNotification('Commande passée avec succès !', 'success');
    
    // Vider le panier
    state.panier = [];
    sauvegarderPanier();
    mettreAJourBadgePanier();
    fermerPanier();
    
    console.log('✅ Commande passée');
}

// ===== GESTION DU THÈME =====

/**
 * Initialise le système de thème
 */
function initialiserTheme() {
    const boutonTheme = document.getElementById('boutonTheme');
    const themeSauvegarde = localStorage.getItem('theme_apa');
    
    // Appliquer le thème sauvegardé
    if (themeSauvegarde) {
        state.theme = themeSauvegarde;
        appliquerTheme(state.theme);
    }
    
    if (boutonTheme) {
        boutonTheme.addEventListener('click', toggleTheme);
    }
}

/**
 * Bascule entre les thèmes light et dark
 */
function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    appliquerTheme(state.theme);
    localStorage.setItem('theme_apa', state.theme);
}

/**
 * Applique le thème spécifié
 */
function appliquerTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    const iconeTheme = document.querySelector('.theme-icone');
    if (iconeTheme) {
        iconeTheme.textContent = theme === 'light' ? '🌙' : '☀️';
    }
}

// ===== GESTION DU FORMULAIRE DE CONTACT =====

/**
 * Initialise le formulaire de contact
 */
function initialiserFormulaireContact() {
    const formulaire = document.getElementById('formContact');
    
    if (formulaire) {
        formulaire.addEventListener('submit', function(e) {
            e.preventDefault();
            envoyerFormulaireContact();
        });
    }
}

/**
 * Envoie le formulaire de contact (simulation)
 */
function envoyerFormulaireContact() {
    const formulaire = document.getElementById('formContact');
    const boutonSubmit = formulaire.querySelector('button[type="submit"]');
    
    // Désactiver le bouton pendant l'envoi
    boutonSubmit.disabled = true;
    boutonSubmit.textContent = 'Envoi en cours...';
    
    // Simulation d'envoi
    setTimeout(() => {
        afficherNotification('Message envoyé avec succès !', 'success');
        formulaire.reset();
        
        // Réactiver le bouton
        boutonSubmit.disabled = false;
        boutonSubmit.textContent = 'Envoyer mon message';
    }, 2000);
}

// ===== INTERACTIONS ET ANIMATIONS =====

/**
 * Initialise les interactions globales
 */
function initialiserInteractions() {
    // Gestion du scroll pour le header
    let dernierePositionScroll = window.scrollY;
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        const positionActuelle = window.scrollY;
        
        // Ajouter/supprimer la classe scrolled selon la position
        if (positionActuelle > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Cacher le header au scroll vers le bas
        if (positionActuelle > dernierePositionScroll && positionActuelle > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        dernierePositionScroll = positionActuelle;
    });
    
    // Back to top (simplifié)
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ===== SYSTÈME DE NOTIFICATIONS =====

/**
 * Affiche une notification à l'utilisateur
 */
function afficherNotification(message, type = 'info') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">×</button>
        </div>
    `;
    
    // Styles basiques pour la notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Ajouter au DOM
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Bouton de fermeture
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        fermerNotification(notification);
    });
    
    // Fermeture automatique après 5 secondes
    setTimeout(() => {
        fermerNotification(notification);
    }, 5000);
}

/**
 * Ferme une notification
 */
function fermerNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// ===== EXPORT DES FONCTIONS GLOBALES =====
// Ces fonctions doivent être accessibles depuis l'HTML
window.reinitialiserFiltres = reinitialiserFiltres;

console.log('🎨 Au Palais Des Arts - Script initialisé');
