// ===== VARIABLES GLOBALES =====
let panier = JSON.parse(localStorage.getItem('panier')) || [];
let produits = [];

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', function() {
    initialiserApp();
});

function initialiserApp() {
    initialiserProduits();
    initialiserPanier();
    initialiserRecherche();
    initialiserFiltres();
    initialiserTheme();
    initialiserFormulaire();
    initialiserAvis();
    initialiserNavigation();
}

// ===== GESTION DES PRODUITS =====
function initialiserProduits() {
    produits = [
        {
            id: 1,
            nom: "Panier Royal",
            prix: 45.00,
            categorie: "panier",
            image: "https://via.placeholder.com/300x200/4CAF50/white?text=Panier+Royal",
            description: "Panier d'exception en osier naturel, tissage traditionnel français",
            dimensions: "30x40cm",
            livraison: "48h"
        },
        {
            id: 2,
            nom: "Corbeille Champêtre",
            prix: 28.00,
            categorie: "corbeille",
            image: "https://via.placeholder.com/300x200/4CAF50/white?text=Corbeille+Champêtre",
            description: "Corbeille authentique pour votre décoration naturelle et élégante",
            dimensions: "25x35cm",
            livraison: "48h"
        },
        {
            id: 3,
            nom: "Corbeille Élégante",
            prix: 35.00,
            categorie: "corbeille",
            image: "https://via.placeholder.com/300x200/4CAF50/white?text=Corbeille+Élégante",
            description: "Osier travaillé main avec finition premium et détails raffinés",
            dimensions: "20x30cm",
            livraison: "48h"
        },
        {
            id: 4,
            nom: "Suspension Naturelle",
            prix: 60.00,
            categorie: "suspension",
            image: "https://via.placeholder.com/300x200/4CAF50/white?text=Suspension+Naturelle",
            description: "Luminaire artistique en osier pour une ambiance chaleureuse",
            dimensions: "Diamètre 45cm",
            livraison: "72h"
        }
    ];
}

// ===== GESTION DU PANIER =====
function initialiserPanier() {
    const iconePanier = document.getElementById('iconePanier');
    const panierElement = document.getElementById('panier');
    const closePanier = document.querySelector('.close-panier');
    
    iconePanier.addEventListener('click', togglePanier);
    closePanier.addEventListener('click', fermerPanier);
    
    // Ajouter les événements aux boutons "Ajouter au panier"
    document.querySelectorAll('.btn-ajouter-panier').forEach((bouton, index) => {
        bouton.addEventListener('click', () => {
            ajouterAuPanier(produits[index]);
            afficherNotification(`${produits[index].nom} ajouté au panier !`);
        });
    });
    
    mettreAJourPanier();
}

function ajouterAuPanier(produit) {
    const produitExistant = panier.find(item => item.id === produit.id);
    
    if (produitExistant) {
        produitExistant.quantite += 1;
    } else {
        panier.push({
            ...produit,
            quantite: 1
        });
    }
    
    sauvegarderPanier();
    mettreAJourPanier();
    ouvrirPanier();
}

function retirerDuPanier(produitId) {
    panier = panier.filter(item => item.id !== produitId);
    sauvegarderPanier();
    mettreAJourPanier();
}

function modifierQuantite(produitId, changement) {
    const produit = panier.find(item => item.id === produitId);
    
    if (produit) {
        produit.quantite += changement;
        
        if (produit.quantite <= 0) {
            retirerDuPanier(produitId);
        } else {
            sauvegarderPanier();
            mettreAJourPanier();
        }
    }
}

function sauvegarderPanier() {
    localStorage.setItem('panier', JSON.stringify(panier));
}

function mettreAJourPanier() {
    const badgePanier = document.querySelector('.badge-panier');
    const panierCount = document.querySelector('.panier-count');
    const panierItems = document.getElementById('panierItems');
    const totalPanier = document.getElementById('totalPanier');
    
    // Mettre à jour le badge
    const totalItems = panier.reduce((total, item) => total + item.quantite, 0);
    badgePanier.textContent = totalItems;
    panierCount.textContent = totalItems;
    
    // Mettre à jour les items du panier
    panierItems.innerHTML = '';
    
    if (panier.length === 0) {
        panierItems.innerHTML = '<p class="panier-vide">Votre panier est vide</p>';
        totalPanier.textContent = '0,00€';
        return;
    }
    
    let total = 0;
    
    panier.forEach(item => {
        const itemTotal = item.prix * item.quantite;
        total += itemTotal;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'panier-item';
        itemElement.innerHTML = `
            <div class="panier-item-info">
                <h4>${item.nom}</h4>
                <p>${item.prix.toFixed(2)}€ × ${item.quantite}</p>
            </div>
            <div class="panier-item-controls">
                <button class="btn-moins" data-id="${item.id}">-</button>
                <span>${item.quantite}</span>
                <button class="btn-plus" data-id="${item.id}">+</button>
                <button class="btn-supprimer" data-id="${item.id}">🗑️</button>
            </div>
            <div class="panier-item-total">${itemTotal.toFixed(2)}€</div>
        `;
        
        panierItems.appendChild(itemElement);
    });
    
    // Ajouter les événements aux boutons
    panierItems.querySelectorAll('.btn-plus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            modifierQuantite(parseInt(e.target.dataset.id), 1);
        });
    });
    
    panierItems.querySelectorAll('.btn-moins').forEach(btn => {
        btn.addEventListener('click', (e) => {
            modifierQuantite(parseInt(e.target.dataset.id), -1);
        });
    });
    
    panierItems.querySelectorAll('.btn-supprimer').forEach(btn => {
        btn.addEventListener('click', (e) => {
            retirerDuPanier(parseInt(e.target.dataset.id));
        });
    });
    
    totalPanier.textContent = `${total.toFixed(2)}€`;
}

function togglePanier() {
    const panierElement = document.getElementById('panier');
    panierElement.classList.toggle('ouvert');
}

function ouvrirPanier() {
    const panierElement = document.getElementById('panier');
    panierElement.classList.add('ouvert');
}

function fermerPanier() {
    const panierElement = document.getElementById('panier');
    panierElement.classList.remove('ouvert');
}

// ===== RECHERCHE ET FILTRES =====
function initialiserRecherche() {
    const inputRecherche = document.getElementById('inputRecherche');
    const btnRecherche = document.getElementById('btnRecherche');
    
    inputRecherche.addEventListener('input', filtrerProduits);
    btnRecherche.addEventListener('click', filtrerProduits);
}

function initialiserFiltres() {
    const filtresBtns = document.querySelectorAll('.filtre-btn');
    const triSelect = document.getElementById('triProduits');
    
    filtresBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Retirer la classe active de tous les boutons
            filtresBtns.forEach(b => b.classList.remove('active'));
            // Ajouter la classe active au bouton cliqué
            btn.classList.add('active');
            
            filtrerProduits();
        });
    });
    
    triSelect.addEventListener('change', trierProduits);
}

function filtrerProduits() {
    const termeRecherche = document.getElementById('inputRecherche').value.toLowerCase();
    const categorieActive = document.querySelector('.filtre-btn.active').dataset.categorie;
    
    const produitsFiltres = produits.filter(produit => {
        const correspondRecherche = produit.nom.toLowerCase().includes(termeRecherche) ||
                                  produit.description.toLowerCase().includes(termeRecherche);
        const correspondCategorie = categorieActive === 'tous' || produit.categorie === categorieActive;
        
        return correspondRecherche && correspondCategorie;
    });
    
    afficherProduitsFiltres(produitsFiltres);
}

function trierProduits() {
    const triSelect = document.getElementById('triProduits');
    const valeurTri = triSelect.value;
    
    let produitsTries = [...produits];
    
    switch (valeurTri) {
        case 'prix-croissant':
            produitsTries.sort((a, b) => a.prix - b.prix);
            break;
        case 'prix-decroissant':
            produitsTries.sort((a, b) => b.prix - a.prix);
            break;
        case 'nom':
            produitsTries.sort((a, b) => a.nom.localeCompare(b.nom));
            break;
        default:
            // Tri par défaut (par ID)
            produitsTries.sort((a, b) => a.id - b.id);
    }
    
    afficherProduitsFiltres(produitsTries);
}

function afficherProduitsFiltres(produitsFiltres) {
    const grilleProduits = document.querySelector('.grille-produits');
    
    if (produitsFiltres.length === 0) {
        grilleProduits.innerHTML = '<p class="aucun-resultat">Aucun produit ne correspond à votre recherche.</p>';
        return;
    }
    
    grilleProduits.innerHTML = '';
    
    produitsFiltres.forEach(produit => {
        const produitElement = document.createElement('div');
        produitElement.className = 'produit';
        produitElement.dataset.categorie = produit.categorie;
        produitElement.innerHTML = `
            <div class="image-container">
                <img src="${produit.image}" 
                     alt="${produit.nom} - Au Palais Des Arts" 
                     class="produit-image">
                <div class="image-overlay">👁️ Voir</div>
            </div>
            <h3>${produit.nom}</h3>
            <p>${produit.description}</p>
            <div class="details">
                <span class="matiere">📏 ${produit.dimensions}</span>
                <span class="livraison">🚚 ${produit.livraison}</span>
            </div>
            <p class="prix">${produit.prix.toFixed(2)}€</p>
            <button class="btn-ajouter-panier">Ajouter au panier</button>
        `;
        
        grilleProduits.appendChild(produitElement);
        
        // Réattacher l'événement au bouton
        produitElement.querySelector('.btn-ajouter-panier').addEventListener('click', () => {
            ajouterAuPanier(produit);
            afficherNotification(`${produit.nom} ajouté au panier !`);
        });
    });
}

// ===== GESTION DU THÈME =====
function initialiserTheme() {
    const boutonTheme = document.getElementById('boutonTheme');
    const iconeTheme = boutonTheme.querySelector('.theme-icone');
    
    // Vérifier le thème sauvegardé
    const theme = localStorage.getItem('theme') || 'light';
    appliquerTheme(theme, iconeTheme);
    
    boutonTheme.addEventListener('click', () => {
        const themeActuel = document.body.classList.contains('theme-sombre') ? 'sombre' : 'light';
        const nouveauTheme = themeActuel === 'light' ? 'sombre' : 'light';
        
        appliquerTheme(nouveauTheme, iconeTheme);
        localStorage.setItem('theme', nouveauTheme);
    });
}

function appliquerTheme(theme, iconeTheme) {
    if (theme === 'sombre') {
        document.body.classList.add('theme-sombre');
        iconeTheme.textContent = '☀️';
    } else {
        document.body.classList.remove('theme-sombre');
        iconeTheme.textContent = '🌙';
    }
}

// ===== FORMULAIRE DE CONTACT =====
function initialiserFormulaire() {
    const formulaire = document.getElementById('formContact');
    
    formulaire.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validerFormulaire()) {
            envoyerFormulaire();
        }
    });
}

function validerFormulaire() {
    const nom = document.getElementById('nom');
    const email = document.getElementById('email');
    const sujet = document.getElementById('sujet');
    const message = document.getElementById('message');
    let valide = true;
    
    // Réinitialiser les erreurs
    document.querySelectorAll('.erreur').forEach(el => el.remove());
    
    // Validation du nom
    if (!nom.value.trim()) {
        afficherErreur(nom, 'Le nom est obligatoire');
        valide = false;
    }
    
    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        afficherErreur(email, 'L\'email est obligatoire');
        valide = false;
    } else if (!emailRegex.test(email.value)) {
        afficherErreur(email, 'Format d\'email invalide');
        valide = false;
    }
    
    // Validation du sujet
    if (!sujet.value) {
        afficherErreur(sujet, 'Veuillez sélectionner un sujet');
        valide = false;
    }
    
    // Validation du message
    if (!message.value.trim()) {
        afficherErreur(message, 'Le message est obligatoire');
        valide = false;
    }
    
    return valide;
}

function afficherErreur(champ, message) {
    const erreurElement = document.createElement('div');
    erreurElement.className = 'erreur';
    erreurElement.textContent = message;
    
    champ.parentNode.appendChild(erreurElement);
    champ.style.borderColor = '#e74c3c';
    
    // Réinitialiser la bordure après correction
    champ.addEventListener('input', function() {
        if (this.value.trim()) {
            this.style.borderColor = '';
            const erreur = this.parentNode.querySelector('.erreur');
            if (erreur) erreur.remove();
        }
    });
}

function envoyerFormulaire() {
    const formulaire = document.getElementById('formContact');
    const btnSubmit = formulaire.querySelector('.btn-submit');
    
    // Simulation d'envoi
    btnSubmit.textContent = 'Envoi en cours...';
    btnSubmit.disabled = true;
    
    setTimeout(() => {
        afficherNotification('Votre message a été envoyé avec succès !');
        formulaire.reset();
        btnSubmit.textContent = '📨 Envoyer mon message';
        btnSubmit.disabled = false;
    }, 2000);
}

// ===== GESTION DES AVIS CLIENTS =====
function initialiserAvis() {
    const btnVoirPlus = document.querySelector('.btn-voir-plus-avis');
    
    if (btnVoirPlus) {
        btnVoirPlus.addEventListener('click', chargerPlusAvis);
    }
}

function chargerPlusAvis() {
    const listeAvis = document.querySelector('.liste-avis');
    
    // Simulation de chargement d'avis supplémentaires
    const avisSupplementaires = [
        {
            nom: "Jean P.",
            date: "5 mars 2025",
            note: "★★★★★",
            commentaire: "Commande sur mesure parfaite ! L'équipe a su comprendre exactement ce que je voulais. Le résultat est encore mieux que ce que j'imaginais.",
            produit: "Commande sur mesure"
        },
        {
            nom: "Élise T.",
            date: "28 février 2025",
            note: "★★★★★",
            commentaire: "La suspension naturelle crée une ambiance incroyable dans mon salon. La qualité est au rendez-vous et l'installation était simple.",
            produit: "Suspension Naturelle"
        }
    ];
    
    avisSupplementaires.forEach(avis => {
        const nouvelAvis = document.createElement('div');
        nouvelAvis.className = 'avis';
        nouvelAvis.innerHTML = `
            <div class="en-tete-avis">
                <div class="info-client">
                    <strong>${avis.nom}</strong>
                    <div class="date-avis">${avis.date}</div>
                </div>
                <div class="note-avis">${avis.note}</div>
            </div>
            <p>"${avis.commentaire}"</p>
            <div class="produit-avis">Acheté : ${avis.produit}</div>
        `;
        
        listeAvis.appendChild(nouvelAvis);
    });
    
    // Animation d'apparition des nouveaux avis
    const nouveauxAvis = listeAvis.querySelectorAll('.avis');
    nouveauxAvis.forEach((avis, index) => {
        if (index >= listeAvis.children.length - avisSupplementaires.length) {
            avis.style.opacity = '0';
            avis.style.transform = '
