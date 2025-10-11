// ===== CONFIGURATION =====
const CONFIG = {
  produitsParPage: 8,
  delaiChargement: 1000
};

// ===== ÉTAT GLOBAL =====
const state = {
  produits: [],
  produitsFiltres: [],
  panier: [],
  pageCourante: 1,
  theme: 'light'
};

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Au Palais des Arts lancé');
  initialiserTheme();
  chargerPanier();
  initialiserEvenements();
  afficherChargement();
  chargerProduits();
});

// ===== CHARGEMENT =====
function afficherChargement() {
  const loadingScreen = document.getElementById('loadingScreen');
  const progressBar = document.getElementById('loadingProgress');
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 20;
    progressBar.style.width = `${Math.min(progress, 100)}%`;
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => loadingScreen.remove(), 400);
      }, 300);
    }
  }, 150);
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
  }, CONFIG.delaiChargement);
}

function afficherProduits() {
  const grille = document.getElementById('grilleProduits');
  const indexDebut = (state.pageCourante - 1) * CONFIG.produitsParPage;
  const produitsAAfficher = state.produitsFiltres.slice(indexDebut, indexDebut + CONFIG.produitsParPage);

  if (!produitsAAfficher.length) {
    grille.innerHTML = `<div class="aucun-resultat"><p>Aucun produit trouvé.</p><button class="btn-ajouter-panier" onclick="reinitialiserFiltres()">Réinitialiser</button></div>`;
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
    btn.addEventListener('click', () => ajouterAuPanier(parseInt(btn.dataset.id)));
  });

  mettreAJourPagination();
}

// ===== PAGINATION =====
function mettreAJourPagination() {
  const paginationContainer = document.querySelector('.page-numbers');
  if (!paginationContainer) return;

  const nbPages = Math.ceil(state.produitsFiltres.length / CONFIG.produitsParPage);
  paginationContainer.innerHTML = '';

  for (let i = 1; i <= nbPages; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.textContent = i;
    pageBtn.classList.add('page-number');
    if (i === state.pageCourante) pageBtn.classList.add('active');
    pageBtn.addEventListener('click', () => {
      state.pageCourante = i;
      afficherProduits();
    });
    paginationContainer.appendChild(pageBtn);
  }
}

// ===== FILTRES =====
function initialiserEvenements() {
  document.querySelectorAll('.filtre-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      document.querySelectorAll('.filtre-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const categorie = e.target.dataset.categorie;
      if (categorie === 'tous') state.produitsFiltres = [...state.produits];
      else state.produitsFiltres = state.produits.filter(p => p.categorie === categorie);
      state.pageCourante = 1;
      afficherProduits();
    });
  });

  document.getElementById('btnRecherche').addEventListener('click', () => {
    const terme = document.getElementById('inputRecherche').value.toLowerCase();
    state.produitsFiltres = state.produits.filter(p =>
      p.nom.toLowerCase().includes(terme) || p.description.toLowerCase().includes(terme)
    );
    state.pageCourante = 1;
    afficherProduits();
  });

  document.getElementById('iconePanier').addEventListener('click', togglePanier);
  document.querySelector('.close-panier').addEventListener('click', togglePanier);
  document.getElementById('boutonTheme').addEventListener('click', basculerTheme);
}

// ===== PANIER =====
function ajouterAuPanier(id) {
  const produit = state.produits.find(p => p.id === id);
  if (!produit) return;
  state.panier.push(produit);
  sauvegarderPanier();
  afficherPanier();
}

function afficherPanier() {
  const panierEl = document.querySelector('.panier-content');
  panierEl.innerHTML = '';

  if (state.panier.length === 0) {
    panierEl.innerHTML = '<p>Votre panier est vide.</p>';
    document.querySelector('.badge-panier').textContent = 0;
    return;
  }

  state.panier.forEach((p, i) => {
    const item = document.createElement('div');
    item.className = 'panier-item';
    item.innerHTML = `
      <p>${p.nom} - <strong>${p.prix.toFixed(2)}€</strong></p>
      <button class="btn-supprimer" data-index="${i}">❌</button>
    `;
    panierEl.appendChild(item);
  });

  document.querySelectorAll('.btn-supprimer').forEach(btn =>
    btn.addEventListener('click', e => {
      const index = parseInt(e.target.dataset.index);
      state.panier.splice(index, 1);
      sauvegarderPanier();
      afficherPanier();
    })
  );

  document.querySelector('.badge-panier').textContent = state.panier.length;
}

function togglePanier() {
  document.getElementById('panier').classList.toggle('ouvert');
  document.getElementById('overlay').classList.toggle('active');
}

function sauvegarderPanier() {
  localStorage.setItem('panier', JSON.stringify(state.panier));
}
function chargerPanier() {
  const data = localStorage.getItem('panier');
  if (data) state.panier = JSON.parse(data);
  afficherPanier();
}

// ===== THÈME =====
function initialiserTheme() {
  const theme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', theme);
  state.theme = theme;
}
function basculerTheme() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', state.theme);
  localStorage.setItem('theme', state.theme);
}
