// ===== CONFIGURATION GLOBALE =====
const CONFIG = {
    produitsParPage: 8,
    delaiChargement: 1000,
    apiBaseURL: 'https://api.aupalaisdesarts.fr'
};

// ===== ÉTAT DE L'APPLICATION =====
const state = {
    panier: [],
    produits: [],
    produitsFiltres: [],
    pageCourante: 1,
    theme: 'light'
};

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Application Au Palais Des Arts initialisée');
    initialiserApplication();
    initialiserEvenements();
    chargerProduits();
});

// ===== INITIALISATION GÉNÉRALE =====
function initialiserApplication() {
    chargerPanier();
    initialiserTheme();
    afficherChargement();
}

// ===== ÉVÉNEMENTS =====
function initialiserEvenements() {
    initialiserNavigationMobile();
    initialiserFiltres();
    initialiserPanier();
    initialiserFormulaireContact();
    initialiserInteractions();
}

// ===== CHARGEMENT =====
function afficherChargement() {
    const loadingScreen = document.getElementById('loadingScreen');
    const progressBar = document.getElementById('loadingProgress');

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        progressBar.style.width = `${Math.min(progress, 100)}%`;

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(cacherChargement, 500);
        }
    }, 200);
}

function cacherChargement() {
    const loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.classList.add('hidden');
    setTimeout(() => loadingScreen.remove(), 500);
    console.log('✅ Chargement terminé');
}

// ===== NAVIGATION MOBILE =====
function initialiserNavigationMobile() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', navMenu.classList.contains('active'));
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

// ===== PRODUITS =====
function chargerProduits() {
    console.log('📦 Chargement des produits...');
    setTimeout(() => {
        state.produits = [
            { id: 1, nom: "Panier Royal en Osier", prix: 45.00, categorie: "panier", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400", description: "Panier d'exception en osier naturel.", dimensions: "30x40cm", livraison: "48h", stock: 15 },
            { id: 2, nom: "Corbeille Champêtre", prix: 28.00, categorie: "corbeille", image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400", description: "Corbeille authentique pour décoration naturelle.", dimensions: "25x35cm", livraison: "48h", stock: 8 },
            { id: 3, nom: "Panier Jardin Rustique", prix: 38.00, categorie: "panier", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400", description: "Panier robuste idéal pour le jardin.", dimensions: "35x45cm", livraison: "48h", stock: 12 },
            { id: 4, nom: "Corbeille à Fruits Élégante", prix: 32.00, categorie: "corbeille", image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400", description: "Corbeille raffinée pour vos fruits.", dimensions: "28x38cm", livraison: "48h", stock: 10 },
            { id: 5, nom: "Suspension Naturelle", prix: 65.00, categorie: "decoration", image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400", description: "Luminaire en osier pour une ambiance chaleureuse.", dimensions: "45cm", livraison: "72h", stock: 5 },
            { id: 6, nom: "Panier Pique-nique", prix: 55.00, categorie: "panier", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400", description: "Panier spacieux pour vos pique-niques.", dimensions: "40x50cm", livraison: "48h", stock: 7 }
        ];
        state.produitsFiltres = [...state.produits];
        afficherProduits();
        console.log('✅ Produits chargés');
    }, CONFIG.delaiChargement);
}

function afficherProduits() {
    const grille = document.getElementById('grilleProduits');
    if (!grille) return;

    const indexDebut = (state.pageCourante - 1) * CONFIG.produitsParPage;
    const produitsAAfficher = state.produitsFiltres.slice(indexDebut, indexDebut + CONFIG.produitsParPage);

    if (!produitsAAfficher.length) {
        grille.innerHTML = `<div class="aucun-resultat"><p>Aucun produit trouvé</p><button class="btn" onclick="reinitialiserFiltres()">Réinitialiser</button></div>`;
        return;
    }

    grille.innerHTML = produitsAAfficher.map(p => `
        <div class="produit-card" data-id="${p.id}">
            <img src="${p.image}" alt="${p.nom}">
            <h3>${p.nom}</h3>
            <p>${p.description}</p>
            <div class="produit-meta">
                <span>📏 ${p.dimensions}</span>
                <span>🚚 ${p.livraison}</span>
            </div>
            <div class="produit-price">${p.prix.toFixed(2)}€</div>
            <button class="btn-ajouter-panier" data-id="${p.id}">Ajouter au panier</button>
        </div>
    `).join('');

    document.querySelectorAll('.btn-ajouter-panier').forEach(btn => {
        btn.onclick = () => ajouterAuPanier(parseInt(btn.dataset.id));
    });

    mettreAJourPagination();
}

// (Les fonctions de filtre, pagination, panier, thème, contact et notifications restent identiques)
