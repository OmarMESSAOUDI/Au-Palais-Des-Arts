// ===== SYSTÈME DE PANIER =====
class Panier {
    constructor() {
        this.items = this.chargerPanier();
        this.mettreAJourAffichage();
    }

    ajouterProduit(produit) {
        const existingItem = this.items.find(item => item.id === produit.id);
        
        if (existingItem) {
            existingItem.quantite++;
        } else {
            this.items.push({ ...produit, quantite: 1 });
        }
        
        this.sauvegarderPanier();
        this.mettreAJourAffichage();
        this.afficherConfirmationAjout(produit.nom);
    }

    supprimerProduit(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.sauvegarderPanier();
        this.mettreAJourAffichage();
    }

    modifierQuantite(id, changement) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.quantite += changement;
            if (item.quantite <= 0) {
                this.supprimerProduit(id);
            } else {
                this.sauvegarderPanier();
                this.mettreAJourAffichage();
            }
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.prix * item.quantite), 0);
    }

    getNombreItems() {
        return this.items.reduce((total, item) => total + item.quantite, 0);
    }

    viderPanier() {
        this.items = [];
        this.sauvegarderPanier();
        this.mettreAJourAffichage();
    }

    sauvegarderPanier() {
        localStorage.setItem('panierAuPalaisDesArts', JSON.stringify(this.items));
    }

    chargerPanier() {
        const panier = localStorage.getItem('panierAuPalaisDesArts');
        return panier ? JSON.parse(panier) : [];
    }

    mettreAJourAffichage() {
        // Mettre à jour le badge
        const badge = document.querySelector('.badge-panier');
        const count = this.getNombreItems();
        badge.textContent = count;
        badge.style.display = count > 0 ? 'block' : 'none';

        // Mettre à jour les items du panier
        this.afficherItemsPanier();
        
        // Mettre à jour le total
        document.getElementById('totalPanier').textContent = this.getTotal().toFixed(2) + '€';
    }

    afficherItemsPanier() {
        const container = document.getElementById('panierItems');
        container.innerHTML = '';

        if (this.items.length === 0) {
            container.innerHTML = `
                <div class="panier-vide">
                    <p>🛒 Votre panier est vide</p>
                    <p>Ajoutez des créations pour commencer !</p>
                </div>
            `;
            return;
        }

        this.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'panier-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.nom}">
                <div class="panier-item-info">
                    <div class="panier-item-nom">${item.nom}</div>
                    <div class="panier-item-prix">${item.prix.toFixed(2)}€</div>
                    <div class="panier-item-quantite">
                        <button class="quantite-btn" onclick="panier.modifierQuantite('${item.id}', -1)">-</button>
                        <span>${item.quantite}</span>
                        <button class="quantite-btn" onclick="panier.modifierQuantite('${item.id}', 1)">+</button>
                    </div>
                </div>
                <button class="supprimer-item" onclick="panier.supprimerProduit('${item.id}')">×</button>
            `;
            container.appendChild(itemElement);
        });
    }

    afficherConfirmationAjout(nomProduit) {
        afficherNotification(`✅ "${nomProduit}" ajouté au panier !`);
    }
}

// ===== DONNÉES DES PRODUITS =====
const produits = [
    {
        id: 'panier-royal',
        nom: 'Panier Royal',
        prix: 45.00,
        image: 'https://via.placeholder.com/300x200/4CAF50/white?text=Panier+Royal',
        description: 'Panier d\'exception en osier naturel'
    },
    {
        id: 'corbeille-champetre',
        nom: 'Corbeille Champêtre',
        prix: 28.00,
        image: 'https://via.placeholder.com/300x200/4CAF50/white?text=Corbeille+Champêtre',
        description: 'Corbeille authentique pour décoration naturelle'
    },
    {
        id: 'corbeille-elegante',
        nom: 'Corbeille Élégante',
        prix: 35.00,
        image: 'https://via.placeholder.com/300x200/4CAF50/white?text=Corbeille+Élégante',
        description: 'Osier travaillé main avec finition premium'
    },
    {
        id: 'suspension-naturelle',
        nom: 'Suspension Naturelle',
        prix: 60.00,
        image: 'https://via.placeholder.com/300x200/4CAF50/white?text=Suspension+Naturelle',
        description: 'Luminaire artistique en osier'
    }
];

// ===== INITIALISATION =====
let panier;

document.addEventListener('DOMContentLoaded', function() {
    console.log('🌿 Au Palais Des Arts - Site chargé avec succès !');
    
    // Initialiser le panier
    panier = new Panier();
    
    // Initialiser toutes les fonctionnalités
    initialiserAnimations();
    initialiserInteractions();
    initialiserNavigation();
    initialiserFormulaire();
    initialiserEffetsImages();
    initialiserPanierUI();
});

// ===== GESTION DE L'INTERFACE PANIER =====
function initialiserPanierUI() {
    const iconePanier = document.getElementById('iconePanier');
    const panierElement = document.getElementById('panier');
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    // Ouvrir/fermer le panier
    iconePanier.addEventListener('click', () => {
        panierElement.classList.add('open');
        overlay.classList.add('active');
    });

    document.querySelector('.close-panier').addEventListener('click', fermerPanier);
    overlay.addEventListener('click', fermerPanier);

    // Bouton commander
    document.getElementById('btnCommander').addEventListener('click', () => {
        if (panier.getNombreItems() === 0) {
            afficherNotification('🛒 Votre panier est vide !', 'error');
            return;
        }
        
        afficherNotification(
            `🎉 Commande initiée !\n\n` +
            `Total : ${panier.getTotal().toFixed(2)}€\n` +
            `Articles : ${panier.getNombreItems()}\n\n` +
            `📞 Nous vous contacterons pour finaliser la commande.\n` +
            `📧 contact@aupalaisdesarts.fr`
        );
        
        fermerPanier();
    });

    function fermerPanier() {
        panierElement.classList.remove('open');
        overlay.classList.remove('active');
    }
}

// ===== INTERACTIONS DES BOUTONS PRODUITS =====
function initialiserInteractions() {
    document.querySelectorAll('.produit button').forEach((bouton, index) => {
        bouton.addEventListener('click', function(e) {
            e.preventDefault();
            
            const produit = produits[index];
            panier.ajouterProduit(produit);
            
            // Animation du bouton
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// ===== FONCTIONS EXISTANTES (conservées) =====
function initialiserAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.transition = 'all 0.6s ease';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.produit, .valeur, .contact-item').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        observer.observe(element);
    });
}

function initialiserNavigation() {
    document.querySelectorAll('nav a').forEach(lien => {
        lien.addEventListener('click', function(e) {
            e.preventDefault();
            const cible = document.querySelector(this.getAttribute('href'));
            if (cible) {
                window.scrollTo({
                    top: cible.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initialiserFormulaire() {
    const formulaire = document.getElementById('formContact');
    
    formulaire.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(formulaire);
        const données = Object.fromEntries(formData);
        
        if (!données.nom || !données.email || !données.sujet || !données.message) {
            afficherNotification('❌ Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }
        
        afficherNotification(
            `✅ Message envoyé avec succès !\n\n` +
            `Merci ${données.nom}, nous vous recontacterons très rapidement.\n` +
            `Sujet : ${getSujetText(données.sujet)}\n\n` +
            `📧 ${données.email}` +
            (données.telephone ? `\n📞 ${données.telephone}` : '')
        );
        
        formulaire.reset();
    });
}

function initialiserEffetsImages() {
    document.querySelectorAll('.image-container').forEach(container => {
        container.addEventListener('click', function() {
            const image = this.querySelector('.produit-image');
            const altText = image.getAttribute('alt');
            
            afficherNotification(
                `🖼️ ${altText}\n\n` +
                `📸 Bientôt de vraies photos de nos créations !\n` +
                `📧 Demandez-nous des photos personnalisées.`
            );
        });
    });
}

function getSujetText(sujet) {
    const sujets = {
        'commande': 'Commande sur mesure',
        'info': 'Demande d\'information',
        'devis': 'Devis personnalisé',
        'autre': 'Autre demande'
    };
    return sujets[sujet] || sujet;
}

// ===== SYSTÈME DE NOTIFICATIONS =====
function afficherNotification(message, type = 'success') {
    const colors = {
        success: { bg: '#2E7D32', border: '#4CAF50' },
        error: { bg: '#D32F2F', border: '#F44336' },
        info: { bg: '#1976D2', border: '#2196F3' }
    };
    
    const color = colors[type] || colors.success;
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        color: #333;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 400px;
        border-left: 6px solid ${color.border};
        font-family: Arial, sans-serif;
        line-height: 1.5;
        white-space: pre-line;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    notification.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 10px; color: ${color.border};">
            ${type === 'success' ? '🎨 Au Palais Des Arts' : '⚠️ Attention'}
        </div>
        <div>${message}</div>
        <button onclick="this.parentElement.parentElement.remove()" style="
            margin-top: 15px;
            background: ${color.bg};
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 0.9em;
        ">Fermer</button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 8000);
}

// Effets de survol améliorés
document.querySelectorAll('.produit').forEach(produit => {
    produit.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 12px 25px rgba(0,0,0,0.2)';
    });
    
    produit.addEventListener('mouseleave', function() {
        this.style.boxShadow = '0 6px 16px rgba(0,0,0,0.1)';
    });
});

console.log('🚀 Script JavaScript avancé chargé - Panier fonctionnel !');

/* Section Recherche et Filtres */
.recherche-filtres {
    background: white;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    margin-bottom: 40px;
}

.recherche-filtres h2 {
    text-align: center;
    margin-bottom: 30px;
    color: #1B5E20;
}

.controle-recherche {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
    align-items: center;
}

.barre-recherche {
    display: flex;
    flex: 1;
    min-width: 300px;
    max-width: 500px;
}

.barre-recherche input {
    flex: 1;
    padding: 12px 15px;
    border: 2px solid #C8E6C9;
    border-radius: 8px 0 0 8px;
    font-size: 1em;
    transition: border-color 0.3s ease;
}

.barre-recherche input:focus {
    outline: none;
    border-color: #D4AF37;
}

.barre-recherche button {
    background: linear-gradient(135deg, #D4AF37, #B8860B);
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 0 8px 8px 0;
    cursor: pointer;
    font-size: 1.1em;
    transition: all 0.3s ease;
}

.barre-recherche button:hover {
    background: linear-gradient(135deg, #B8860B, #DAA520);
}

.filtres {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
}

.filtres select {
    padding: 12px 15px;
    border: 2px solid #C8E6C9;
    border-radius: 8px;
    font-size: 1em;
    background: white;
    color: #333;
    cursor: pointer;
    transition: border-color 0.3s ease;
}

.filtres select:focus {
    outline: none;
    border-color: #D4AF37;
}

/* Ajustement responsive */
@media (max-width: 768px) {
    .controle-recherche {
        flex-direction: column;
    }
    
    .barre-recherche {
        min-width: 100%;
    }
    
    .filtres {
        width: 100%;
        justify-content: center;
    }
    
    .filtres select {
        flex: 1;
        min-width: 150px;
    }
}

javascript
// ===== SYSTÈME DE RECHERCHE ET FILTRES =====

function initialiserRechercheFiltres() {
    const inputRecherche = document.getElementById('inputRecherche');
    const btnRecherche = document.getElementById('btnRecherche');
    const filtreCategorie = document.getElementById('filtreCategorie');
    const filtrePrix = document.getElementById('filtrePrix');

    // Écouter les événements de recherche et filtres
    inputRecherche.addEventListener('input', filtrerProduits);
    btnRecherche.addEventListener('click', filtrerProduits);
    filtreCategorie.addEventListener('change', filtrerProduits);
    filtrePrix.addEventListener('change', filtrerProduits);
}

function filtrerProduits() {
    const termeRecherche = document.getElementById('inputRecherche').value.toLowerCase();
    const categorie = document.getElementById('filtreCategorie').value;
    const plagePrix = document.getElementById('filtrePrix').value;

    const produitsElements = document.querySelectorAll('.produit');

    produitsElements.forEach(produitElement => {
        const nom = produitElement.querySelector('h3').textContent.toLowerCase();
        const description = produitElement.querySelector('p').textContent.toLowerCase();
        const prixText = produitElement.querySelector('.prix').textContent;
        const prix = parseFloat(prixText.replace('€', '').replace(',', '.'));

        // Vérifier la correspondance de la recherche
        const correspondRecherche = nom.includes(termeRecherche) || description.includes(termeRecherche);

        // Vérifier la catégorie
        let correspondCategorie = true;
        if (categorie) {
            // Déterminer la catégorie en fonction du nom
            if (categorie === 'panier') {
                correspondCategorie = nom.includes('panier');
            } else if (categorie === 'corbeille') {
                correspondCategorie = nom.includes('corbeille');
            } else if (categorie === 'suspension') {
                correspondCategorie = nom.includes('suspension');
            }
        }

        // Vérifier la plage de prix
        let correspondPrix = true;
        if (plagePrix) {
            const [min, max] = plagePrix.split('-').map(Number);
            if (max) {
                correspondPrix = prix >= min && prix <= max;
            } else {
                correspondPrix = prix >= min;
            }
        }

        // Afficher ou masquer le produit
        if (correspondRecherche && correspondCategorie && correspondPrix) {
            produitElement.style.display = 'block';
        } else {
            produitElement.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // ... autres initialisations
    initialiserRechercheFiltres();
});

// ===== GESTION DU THÈME SOMBRE/CLAIR =====

function initialiserTheme() {
    const boutonTheme = document.getElementById('boutonTheme');
    const theme = localStorage.getItem('theme') || 'clair';

    // Appliquer le thème sauvegardé
    document.documentElement.setAttribute('data-theme', theme);
    mettreAJourBoutonTheme(theme);

    // Basculer le thème au clic
    boutonTheme.addEventListener('click', () => {
        const themeActuel = document.documentElement.getAttribute('data-theme');
        const nouveauTheme = themeActuel === 'clair' ? 'sombre' : 'clair';
        
        document.documentElement.setAttribute('data-theme', nouveauTheme);
        localStorage.setItem('theme', nouveauTheme);
        mettreAJourBoutonTheme(nouveauTheme);
    });
}

function mettreAJourBoutonTheme(theme) {
    const bouton = document.getElementById('boutonTheme');
    bouton.textContent = theme === 'clair' ? '🌙' : '☀️';
}

// ===== SYSTÈME DE RECHERCHE INTELLIGENT =====

function initialiserRecherche() {
    const inputRecherche = document.getElementById('inputRecherche');
    const btnRecherche = document.getElementById('btnRecherche');
    const suggestions = document.getElementById('suggestions');
    const filtresBtns = document.querySelectorAll('.filtre-btn');
    const selectTri = document.getElementById('triProduits');

    // Recherche en temps réel
    inputRecherche.addEventListener('input', function() {
        const terme = this.value.toLowerCase();
        afficherSuggestions(terme);
        if (terme.length > 0) {
            suggestions.style.display = 'block';
        } else {
            suggestions.style.display = 'none';
        }
    });

    // Recherche au clic
    btnRecherche.addEventListener('click', function() {
        effectuerRecherche();
    });

    // Recherche avec Enter
    inputRecherche.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            effectuerRecherche();
        }
    });

    // Filtres par catégorie
    filtresBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filtresBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filtrerParCategorie(this.dataset.categorie);
        });
    });

    // Tri des produits
    selectTri.addEventListener('change', function() {
        trierProduits(this.value);
    });

    // Fermer les suggestions en cliquant ailleurs
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.barre-recherche-container')) {
            suggestions.style.display = 'none';
        }
    });
}

function afficherSuggestions(terme) {
    const suggestions = document.getElementById('suggestions');
    suggestions.innerHTML = '';

    if (terme.length < 2) return;

    const suggestionsTrouvees = [];
    
    // Recherche dans les produits
    produits.forEach(produit => {
        if (produit.nom.toLowerCase().includes(terme) || 
            produit.description.toLowerCase().includes(terme)) {
            suggestionsTrouvees.push(produit);
        }
    });

    // Recherche dans les catégories
    const categories = ['panier', 'corbeille', 'suspension', 'decoration'];
    categories.forEach(categorie => {
        if (categorie.includes(terme)) {
            suggestionsTrouvees.push({
                nom: `Catégorie: ${categorie}`,
                type: 'categorie',
                categorie: categorie
            });
        }
    });

    // Afficher les suggestions
    suggestionsTrouvees.slice(0, 5).forEach(item => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.textContent = item.type === 'categorie' ? item.nom : `${item.nom} - ${item.prix}€`;
        div.addEventListener('click', function() {
            if (item.type === 'categorie') {
                document.querySelector(`[data-categorie="${item.categorie}"]`).click();
            } else {
                document.getElementById('inputRecherche').value = item.nom;
                effectuerRecherche();
            }
            suggestions.style.display = 'none';
        });
        suggestions.appendChild(div);
    });
}

function effectuerRecherche() {
    const terme = document.getElementById('inputRecherche').value.toLowerCase();
    const produitsElements = document.querySelectorAll('.produit');
    let resultatsTrouves = 0;

    produitsElements.forEach((element, index) => {
        const produit = produits[index];
        const correspond = 
            produit.nom.toLowerCase().includes(terme) ||
            produit.description.toLowerCase().includes(terme);

        if (correspond && terme.length > 0) {
            element.classList.remove('cache');
            resultatsTrouves++;
        } else if (terme.length === 0) {
            element.classList.remove('cache');
            resultatsTrouves++;
        } else {
            element.classList.add('cache');
        }
    });

    // Afficher message si aucun résultat
    afficherMessageResultats(resultatsTrouves, terme);
}

function filtrerParCategorie(categorie) {
    const produitsElements = document.querySelectorAll('.produit');
    let resultatsTrouves = 0;

    produitsElements.forEach((element, index) => {
        const produit = produits[index];
        const correspond = 
            categorie === 'tous' || 
            produit.nom.toLowerCase().includes(categorie) ||
            produit.description.toLowerCase().includes(categorie);

        if (correspond) {
            element.classList.remove('cache');
            resultatsTrouves++;
        } else {
            element.classList.add('cache');
        }
    });

    afficherMessageResultats(resultatsTrouves, categorie);
}

function trierProduits(methode) {
    const container = document.querySelector('.produits');
    const produitsElements = Array.from(document.querySelectorAll('.produit:not(.cache)'));

    produitsElements.sort((a, b) => {
        const indexA = Array.from(a.parentNode.children).indexOf(a);
        const indexB = Array.from(b.parentNode.children).indexOf(b);
        const produitA = produits[indexA];
        const produitB = produits[indexB];

        switch(methode) {
            case 'prix-croissant':
                return produitA.prix - produitB.prix;
            case 'prix-decroissant':
                return produitB.prix - produitA.prix;
            case 'nom':
                return produitA.nom.localeCompare(produitB.nom);
            case 'populaire':
                return (produitB.popularite || 0) - (produitA.popularite || 0);
            default:
                return indexA - indexB;
        }
    });

    // Réorganiser les éléments
    produitsElements.forEach(element => {
        container.appendChild(element);
    });
}

function afficherMessageResultats(nombre, terme) {
    let messageExistante = document.querySelector('.aucun-resultat');
    
    if (nombre === 0 && terme !== 'tous') {
        if (!messageExistante) {
            messageExistante = document.createElement('div');
            messageExistante.className = 'aucun-resultat';
            messageExistante.innerHTML = `
                <h3>🔍 Aucun résultat trouvé</h3>
                <p>Aucun produit ne correspond à "${terme}"</p>
                <p>Essayez avec d'autres termes ou parcourez toutes nos créations.</p>
                <button onclick="reinitialiserRecherche()" style="margin-top: 15px; padding: 10px 20px; background: #2E7D32; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Voir tous les produits
                </button>
            `;
            document.querySelector('.produits').appendChild(messageExistante);
        }
    } else if (messageExistante) {
        messageExistante.remove();
    }
}

function reinitialiserRecherche() {
    document.getElementById('inputRecherche').value = '';
    document.querySelectorAll('.filtre-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-categorie="tous"]').classList.add('active');
    document.getElementById('triProduits').value = 'defaut';
    
    document.querySelectorAll('.produit').forEach(el => el.classList.remove('cache'));
    document.querySelectorAll('.aucun-resultat').forEach(el => el.remove());
    document.getElementById('suggestions').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    // ... autres initialisations
    initialiserRecherche();
});
const produits = [
    {
        id: 'panier-royal',
        nom: 'Panier Royal',
        prix: 45.00,
        image: 'https://via.placeholder.com/300x200/4CAF50/white?text=Panier+Royal',
        description: 'Panier d\'exception en osier naturel, tissage traditionnel français',
        popularite: 95
    },
    // ... autres produits avec popularité
];
// ===== SYSTÈME DE THÈME SOMBRE/CLAIR =====

function initialiserTheme() {
    const boutonTheme = document.getElementById('boutonTheme');
    const theme = localStorage.getItem('theme') || 'clair';

    // Appliquer le thème sauvegardé
    document.documentElement.setAttribute('data-theme', theme);
    mettreAJourBoutonTheme(theme);

    // Basculer le thème
    boutonTheme.addEventListener('click', () => {
        const themeActuel = document.documentElement.getAttribute('data-theme');
        const nouveauTheme = themeActuel === 'clair' ? 'sombre' : 'clair';
        
        document.documentElement.setAttribute('data-theme', nouveauTheme);
        localStorage.setItem('theme', nouveauTheme);
        mettreAJourBoutonTheme(nouveauTheme);
        
        // Animation de transition
        document.body.style.transition = 'all 0.3s ease';
    });
}

function mettreAJourBoutonTheme(theme) {
    const bouton = document.getElementById('boutonTheme');
    const icone = bouton.querySelector('.theme-icone');
    icone.textContent = theme === 'clair' ? '🌙' : '☀️';
    bouton.title = theme === 'clair' ? 'Activer le mode sombre' : 'Activer le mode clair';
}
document.addEventListener('DOMContentLoaded', function() {
    // ... autres initialisations
    initialiserTheme();
});
