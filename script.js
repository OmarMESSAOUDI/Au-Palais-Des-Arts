// ===== CONFIGURATION =====
const CONFIG = {
    produitsParPage: 6,
    animationOffset: 100,
    api: {
        baseURL: 'https://api.aupalaisdesarts.fr',
        endpoints: {
            produits: '/produits',
            avis: '/avis',
            commandes: '/commandes'
        }
    }
};

// ===== ÉTAT GLOBAL =====
const state = {
    panier: JSON.parse(localStorage.getItem('panier')) || [],
    produits: [],
    produitsFiltres: [],
    pageCourante: 1,
    filtresActifs: {
        categorie: 'tous',
        recherche: '',
        prixMin: 0,
        prixMax: 200,
        dimensions: '',
        livraisonRapide: false
    },
    theme: localStorage.getItem('theme') || 'light',
    chargement: false
};

// ===== INITIALISATION =====
class Application {
    constructor() {
        this.initialiser();
    }

    async initialiser() {
        try {
            this.afficherChargement();
            await this.chargerProduits();
            this.initialiserComposants();
            this.initialiserEvenements();
            this.cacherChargement();
            this.animerElements();
        } catch (error) {
            console.error('Erreur initialisation:', error);
            this.afficherErreur('Erreur de chargement');
        }
    }

    afficherChargement() {
        document.body.classList.add('chargement');
    }

    cacherChargement() {
        setTimeout(() => {
            document.body.classList.remove('chargement');
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
            }
        }, 1000);
    }

    async chargerProduits() {
        // Simulation API - Remplacer par appel réel
        state.produits = [
            {
                id: 1,
                nom: "Panier Royal",
                prix: 45.00,
                categorie: "panier",
                image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
                description: "Panier d'exception en osier naturel, tissage traditionnel français",
                dimensions: "30x40cm",
                livraison: "48h",
                populaire: true,
                stock: 15
            },
            {
                id: 2,
                nom: "Corbeille Champêtre",
                prix: 28.00,
                categorie: "corbeille",
                image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop",
                description: "Corbeille authentique pour votre décoration naturelle et élégante",
                dimensions: "25x35cm",
                livraison: "48h",
                stock: 8
            },
            {
                id: 3,
                nom: "Corbeille Élégante",
                prix: 35.00,
                categorie: "corbeille",
                image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
                description: "Osier travaillé main avec finition premium et détails raffinés",
                dimensions: "20x30cm",
                livraison: "48h",
                stock: 12
            },
            {
                id: 4,
                nom: "Suspension Naturelle",
                prix: 60.00,
                categorie: "suspension",
                image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop",
                description: "Luminaire artistique en osier pour une ambiance chaleureuse",
                dimensions: "Diamètre 45cm",
                livraison: "72h",
                nouveau: true,
                stock: 5
            },
            {
                id: 5,
                nom: "Panier Jardin",
                prix: 38.00,
                categorie: "panier",
                image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
                description: "Idéal pour vos récoltes au jardin, robuste et fonctionnel",
                dimensions: "35x45cm",
                livraison: "48h",
                stock: 20
            },
            {
                id: 6,
                nom: "Corbeille à Fruits",
                prix: 32.00,
                categorie: "corbeille",
                image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop",
                description: "Parfaite pour présenter vos fruits avec élégance",
                dimensions: "28x38cm",
                livraison: "48h",
                stock: 10
            }
        ];
        
        state.produitsFiltres = [...state.produits];
    }

    initialiserComposants() {
        this.gestionnairePanier = new GestionnairePanier();
        this.gestionnaireFiltres = new GestionnaireFiltres();
        this.gestionnaireUI = new GestionnaireUI();
        this.gestionnaireFormulaire = new GestionnaireFormulaire();
        
        this.gestionnaireUI.mettreAJourAffichageProduits();
        this.gestionnairePanier.mettreAJourPanier();
    }

    initialiserEvenements() {
        // Navigation mobile
        this.initialiserNavigationMobile();
        
        // Scroll events
        this.initialiserScrollEvents();
        
        // Observateur d'intersection pour les animations
        this.initialiserObservateurAnimation();
    }

    initialiserNavigationMobile() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }
    }

    initialiserScrollEvents() {
        let lastScrollY = window.scrollY;
        const header = document.getElementById('header');
        const backToTop = document.getElementById('backToTop');

        window.addEventListener('scroll', () => {
            // Header scroll
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Back to top
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }

            // Navigation hide on scroll down
            if (window.scrollY > lastScrollY && window.scrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }

            lastScrollY = window.scrollY;
        });

        // Back to top click
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    initialiserObservateurAnimation() {
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
        document.querySelectorAll('.produit-card, .valeur-card, .avis-card').forEach(el => {
            observer.observe(el);
        });
    }

    animerElements() {
        // Animation d'entrée progressive
        const elements = document.querySelectorAll('[data-animate]');
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('animate-in');
            }, index * 100);
        });
    }

    afficherErreur(message) {
        const notification = new Notification(message, 'error');
        notification.afficher();
    }
}

// ===== GESTIONNAIRE PANIER =====
class GestionnairePanier {
    constructor() {
        this.panierElement = document.getElementById('panier');
        this.iconePanier = document.getElementById('iconePanier');
        this.overlay = document.getElementById('overlay');
        this.initialiserEvenements();
    }

    initialiserEvenements() {
        // Ouvrir/fermer panier
        this.iconePanier.addEventListener('click', () => this.ouvrirPanier());
        document.querySelector('.close-panier').addEventListener('click', () => this.fermerPanier());
        this.overlay.addEventListener('click', () => this.fermerPanier());

        // Commander
        document.getElementById('btnCommander').addEventListener('click', () => this.commander());
    }

    ajouterProduit(produit) {
        const produitExistant = state.panier.find(item => item.id === produit.id);
        
        if (produitExistant) {
            produitExistant.quantite += 1;
        } else {
            state.panier.push({
                ...produit,
                quantite: 1
            });
        }
        
        this.sauvegarderPanier();
        this.mettreAJourPanier();
        this.ouvrirPanier();
        
        new Notification(`${produit.nom} ajouté au panier !`, 'success').afficher();
    }

    retirerProduit(produitId) {
        state.panier = state.panier.filter(item => item.id !== produitId);
        this.sauvegarderPanier();
        this.mettreAJourPanier();
    }

    modifierQuantite(produitId, changement) {
        const produit = state.panier.find(item => item.id === produitId);
        
        if (produit) {
            produit.quantite += changement;
            
            if (produit.quantite <= 0) {
                this.retirerProduit(produitId);
            } else {
                this.sauvegarderPanier();
                this.mettreAJourPanier();
            }
        }
    }

    sauvegarderPanier() {
        localStorage.setItem('panier', JSON.stringify(state.panier));
    }

    mettreAJourPanier() {
        const badgePanier = document.querySelector('.badge-panier');
        const panierCount = document.querySelector('.panier-count');
        const panierItems = document.getElementById('panierItems');
        const totalPanier = document.getElementById('totalPanier');
        
        // Mettre à jour le badge
        const totalItems = state.panier.reduce((total, item) => total + item.quantite, 0);
        badgePanier.textContent = totalItems;
        panierCount.textContent = totalItems;
        
        // Mettre à jour les items
        panierItems.innerHTML = '';
        
        if (state.panier.length === 0) {
            panierItems.innerHTML = '<p class="panier-vide">Votre panier est vide</p>';
            totalPanier.textContent = '0,00€';
            return;
        }
        
        let total = 0;
        
        state.panier.forEach(item => {
            const itemTotal = item.prix * item.quantite;
            total += itemTotal;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'panier-item';
            itemElement.innerHTML = this.genererHTMLItemPanier(item, itemTotal);
            panierItems.appendChild(itemElement);
        });
        
        this.attacherEvenementsItems();
        totalPanier.textContent = `${total.toFixed(2)}€`;
    }

    genererHTMLItemPanier(item, total) {
        return `
            <div class="panier-item-content">
                <img src="${item.image}" alt="${item.nom}" class="panier-item-image">
                <div class="panier-item-details">
                    <h4>${item.nom}</h4>
                    <p class="panier-item-prix">${item.prix.toFixed(2)}€</p>
                </div>
            </div>
            <div class="panier-item-controls">
                <button class="btn-quantity minus" data-id="${item.id}">-</button>
                <span class="quantity">${item.quantite}</span>
                <button class="btn-quantity plus" data-id="${item.id}">+</button>
                <button class="btn-remove" data-id="${item.id}" aria-label="Supprimer">🗑️</button>
            </div>
            <div class="panier-item-total">${total.toFixed(2)}€</div>
        `;
    }

    attacherEvenementsItems() {
        // Boutons quantité
        document.querySelectorAll('.btn-quantity.plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.modifierQuantite(parseInt(e.target.dataset.id), 1);
            });
        });
        
        document.querySelectorAll('.btn-quantity.minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.modifierQuantite(parseInt(e.target.dataset.id), -1);
            });
        });
        
        // Boutons suppression
        document.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.retirerProduit(parseInt(e.target.dataset.id));
            });
        });
    }

    ouvrirPanier() {
        this.panierElement.classList.add('ouvert');
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    fermerPanier() {
        this.panierElement.classList.remove('ouvert');
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    async commander() {
        if (state.panier.length === 0) {
            new Notification('Votre panier est vide', 'error').afficher();
            return;
        }

        try {
            // Simulation de commande
            new Notification('Redirection vers la page de commande...', 'success').afficher();
            
            // Ici, rediriger vers la page de commande
            // window.location.href = '/commande';
            
        } catch (error) {
            new Notification('Erreur lors de la commande', 'error').afficher();
        }
    }
}

// ===== GESTIONNAIRE FILTRES =====
class GestionnaireFiltres {
    constructor() {
        this.initialiserEvenements();
    }

    initialiserEvenements() {
        // Filtres catégories
        document.querySelectorAll('.filtre-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.activerFiltreCategorie(e.target.dataset.categorie);
            });
        });

        // Recherche
        const inputRecherche = document.getElementById('inputRecherche');
        const btnRecherche = document.getElementById('btnRecherche');
        
        inputRecherche.addEventListener('input', (e) => {
            this.appliquerRecherche(e.target.value);
        });
        
        btnRecherche.addEventListener('click', () => {
            this.appliquerRecherche(inputRecherche.value);
        });

        // Tri
        document.getElementById('triProduits').addEventListener('change', (e) => {
            this.appliquerTri(e.target.value);
        });

        // Filtres avancés
        document.getElementById('filtreAvanceBtn').addEventListener('click', () => {
            this.toggleFiltresAvances();
        });
    }

    activerFiltreCategorie(categorie) {
        // Mettre à jour les boutons
        document.querySelectorAll('.filtre-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        
        state.filtresActifs.categorie = categorie;
        this.appliquerFiltres();
    }

    appliquerRecherche(terme) {
        state.filtresActifs.recherche = terme.toLowerCase();
        this.appliquerFiltres();
    }

    appliquerTri(typeTri) {
        let produitsTries = [...state.produitsFiltres];
        
        switch (typeTri) {
            case 'prix-croissant':
                produitsTries.sort((a, b) => a.prix - b.prix);
                break;
            case 'prix-decroissant':
                produitsTries.sort((a, b) => b.prix - a.prix);
                break;
            case 'nom':
                produitsTries.sort((a, b) => a.nom.localeCompare(b.nom));
                break;
            case 'populaire':
                // Simuler la popularité
                produitsTries.sort((a, b) => (b.populaire ? 1 : 0) - (a.populaire ? 1 : 0));
                break;
        }
        
        state.produitsFiltres = produitsTries;
        app.gestionnaireUI.mettreAJourAffichageProduits();
    }

    appliquerFiltres() {
        let produitsFiltres = state.produits.filter(produit => {
            const correspondCategorie = state.filtresActifs.categorie === 'tous' || 
                                      produit.categorie === state.filtresActifs.categorie;
            
            const correspondRecherche = !state.filtresActifs.recherche || 
                                      produit.nom.toLowerCase().includes(state.filtresActifs.recherche) ||
                                      produit.description.toLowerCase().includes(state.filtresActifs.recherche);
            
            const correspondPrix = produit.prix >= state.filtresActifs.prixMin && 
                                 produit.prix <= state.filtresActifs.prixMax;
            
            return correspondCategorie && correspondRecherche && correspondPrix;
        });
        
        state.produitsFiltres = produitsFiltres;
        state.pageCourante = 1; // Reset à la première page
        app.gestionnaireUI.mettreAJourAffichageProduits();
    }

    toggleFiltresAvances() {
        const panel = document.getElementById('filtresAvances');
        panel.classList.toggle('active');
    }
}

// ===== GESTIONNAIRE UI =====
class GestionnaireUI {
    mettreAJourAffichageProduits() {
        const grille = document.getElementById('grilleProduits');
        const pagination = document.getElementById('pagination');
        
        if (!grille) return;
        
        // Calculer les produits à afficher pour la page courante
        const indexDebut = (state.pageCourante - 1) * CONFIG.produitsParPage;
        const indexFin = indexDebut + CONFIG.produitsParPage;
        const produitsPage = state.produitsFiltres.slice(indexDebut, indexFin);
        
        // Afficher les produits
        if (produitsPage.length === 0) {
            grille.innerHTML = '<div class="aucun-resultat"><p>Aucun produit ne correspond à votre recherche</p></div>';
        } else {
            grille.innerHTML = produitsPage.map(produit => this.genererCarteProduit(produit)).join('');
            this.attacherEvenementsProduits();
        }
        
        // Mettre à jour la pagination
        this.mettreAJourPagination();
    }

    genererCarteProduit(produit) {
        const badges = [];
        if (produit.populaire) badges.push('<span class="produit-badge badge-populaire">Populaire</span>');
        if (produit.nouveau) badges.push('<span class="produit-badge badge-nouveau">Nouveau</span>');
        if (produit.stock < 5) badges.push('<span class="produit-badge badge-stock">Stock limité</span>');
        
        return `
            <div class="produit-card" data-id="${produit.id}">
                ${badges.join('')}
                <img src="${produit.image}" alt="${produit.nom}" class="produit-image" loading="lazy">
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
        `;
    }

    attacherEvenementsProduits() {
        document.querySelectorAll('.btn-ajouter-panier').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const produitId = parseInt(e.target.dataset.id);
                const produit = state.produits.find(p => p.id === produitId);
                if (produit) {
                    app.gestionnairePanier.ajouterProduit(produit);
                }
            });
        });
    }

    mettreAJourPagination() {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;
        
        const totalPages = Math.ceil(state.produitsFiltres.length / CONFIG.produitsParPage);
        
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
        
        prevBtn.onclick = () => this.changerPage(state.pageCourante - 1);
        nextBtn.onclick = () => this.changerPage(state.pageCourante + 1);
        
        // Numéros de page
        const pageNumbers = pagination.querySelector('.page-numbers');
        pageNumbers.innerHTML = '';
        
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `page-number ${i === state.pageCourante ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.onclick = () => this.changerPage(i);
            pageNumbers.appendChild(pageBtn);
        }
    }

    changerPage(nouvellePage) {
        state.pageCourante = nouvellePage;
        this.mettreAJourAffichageProduits();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ===== GESTIONNAIRE FORMULAIRE =====
class GestionnaireFormulaire {
    constructor() {
        this.initialiserFormulaires();
    }

    initialiserFormulaires() {
        this.initialiserFormulaireContact();
        this.initialiserFormulaireNewsletter();
        this.initialiserFAQ();
    }

    initialiserFormulaireContact() {
        const formulaire = document.getElementById('formContact');
        if (!formulaire) return;
        
        formulaire.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (this.validerFormulaireContact()) {
                await this.envoyerFormulaireContact();
            }
        });
    }

    validerFormulaireContact() {
        let valide = true;
        const formulaire = document.getElementById('formContact');
        
        // Réinitialiser les erreurs
        formulaire.querySelectorAll('.erreur').forEach(el => el.remove());
        formulaire.querySelectorAll('.input-error').forEach(el => {
            el.classList.remove('input-error');
        });
        
        // Validation des champs
        const champs = ['nom', 'email', 'sujet', 'message'];
        champs.forEach(champ => {
            const element = document.getElementById(champ);
            if (element && element.hasAttribute('required') && !element.value.trim()) {
                this.afficherErreur(element, 'Ce champ est obligatoire');
                valide = false;
            }
        });
        
        // Validation email
        const email = document.getElementById('email');
        if (email && email.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value)) {
                this.afficherErreur(email, 'Format d\'email invalide');
                valide = false;
            }
        }
        
        return valide;
    }

    afficherErreur(element, message) {
        element.classList.add('input-error');
        const erreurElement = document.createElement('div');
        erreurElement.className = 'erreur';
        erreurElement.textContent = message;
        element.parentNode.appendChild(erreurElement);
    }

    async envoyerFormulaireContact() {
        const formulaire = document.getElementById('formContact');
        const btnSubmit = formulaire.querySelector('.btn-submit');
        
        // Simulation envoi
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Envoi en cours...';
        
        try {
            // Simuler délai API
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            new Notification('Votre message a été envoyé avec succès !', 'success').afficher();
            formulaire.reset();
            
        } catch (error) {
            new Notification('Erreur lors de l\'envoi du message', 'error').afficher();
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.textContent = '📨 Envoyer mon message';
        }
    }

    initialiserFormulaireNewsletter() {
        const formulaire = document.getElementById('newsletterForm');
        if (!formulaire) return;
        
        formulaire.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.inscrireNewsletter();
        });
    }

    async inscrireNewsletter() {
        const formulaire = document.getElementById('newsletterForm');
        const email = formulaire.querySelector('input[type="email"]');
        
        try {
            // Simulation inscription
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            new Notification('Merci pour votre inscription à la newsletter !', 'success').afficher();
            formulaire.reset();
            
        } catch (error) {
            new Notification('Erreur lors de l\'inscription', 'error').afficher();
        }
    }

    initialiserFAQ() {
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => {
                const item = question.parentNode;
                const answer = item.querySelector('.faq-answer');
                const icon = question.querySelector('.faq-icon');
                
                // Fermer les autres items
                document.querySelectorAll('.faq-item').forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.faq-answer').style.maxHeight = null;
                        otherItem.querySelector('.faq-icon').textContent = '+';
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
                if (item.classList.contains('active')) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    icon.textContent = '−';
                } else {
                    answer.style.maxHeight = null;
                    icon.textContent = '+';
                }
            });
        });
    }
}

// ===== NOTIFICATION SYSTEM =====
class Notification {
    constructor(message, type = 'success') {
        this.message = message;
        this.type = type;
        this.duration = 3000;
    }

    afficher() {
        const notification = document.createElement('div');
        notification.className = `notification notification-${this.type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${this.message}</span>
                <button class="notification-close" aria-label="Fermer">×</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Animation entrée
        setTimeout(() => notification.classList.add('show'), 100);

        // Fermeture auto
        const timeout = setTimeout(() => {
            this.fermer(notification);
        }, this.duration);

        // Fermeture manuelle
        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(timeout);
            this.fermer(notification);
        });
    }

    fermer(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// ===== THEME MANAGER =====
class GestionnaireTheme {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.boutonTheme = document.getElementById('boutonTheme');
        this.initialiser();
    }

    initialiser() {
        this.appliquerTheme(this.theme);
        this.boutonTheme.addEventListener('click', () => this.toggleTheme());
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.appliquerTheme(this.theme);
        localStorage.setItem('theme', this.theme);
    }

    appliquerTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const icone = this.boutonTheme.querySelector('.theme-icone');
        icone.textContent = theme === 'light' ? '🌙' : '☀️';
    }
}

// ===== CAROUSEL AVIS =====
class CarouselAvis {
    constructor() {
        this.carousel = document.getElementById('avisCarousel');
        this.slides = this.carousel?.querySelectorAll('.avis-slide');
        this.currentSlide = 0;
        
        if (this.slides && this.slides.length > 0) {
            this.initialiser();
        }
    }

    initialiser() {
        this.initialiserControles();
        this.demarrerAutoPlay();
    }

    initialiserControles() {
        const prevBtn = document.getElementById('prevAvis');
        const nextBtn = document.getElementById('nextAvis');
        
        prevBtn?.addEventListener('click', () => this.previous());
        nextBtn?.addEventListener('click', () => this.next());
        
        // Créer les dots
        this.creerDots();
    }

    creerDots() {
        const dotsContainer = document.querySelector('.carousel-dots');
        if (!dotsContainer) return;
        
        dotsContainer.innerHTML = '';
        
        this.slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => this.goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }

    goToSlide(index) {
        this.slides[this.currentSlide].classList.remove('active');
        this.currentSlide = (index + this.slides.length) % this.slides.length;
        this.slides[this.currentSlide].classList.add('active');
        this.mettreAJourDots();
    }

    next() {
        this.goToSlide(this.currentSlide + 1);
    }

    previous() {
        this.goToSlide(this.currentSlide - 1);
    }

    mettreAJourDots() {
        const dots = document.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }

    demarrerAutoPlay() {
        setInterval(() => {
            this.next();
        }, 5000);
    }
}

// ===== INITIALISATION DE L'APPLICATION =====
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new Application();
    new GestionnaireTheme();
    new CarouselAvis();
});

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
