// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌿 Site Au Palais Des Arts chargé !');
    
    // Animation d'apparition des produits
    animerProduits();
    
    // Gestion des clics sur les boutons
    gererClicsBoutons();
    
    // Navigation fluide
    gererNavigation();
});

// Animation des produits
function animerProduits() {
    const produits = document.querySelectorAll('.produit');
    
    produits.forEach((produit, index) => {
        // État initial
        produit.style.opacity = '0';
        produit.style.transform = 'translateY(30px)';
        
        // Animation avec délai
        setTimeout(() => {
            produit.style.transition = 'all 0.6s ease';
            produit.style.opacity = '1';
            produit.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// Gestion des clics sur les boutons
function gererClicsBoutons() {
    const boutons = document.querySelectorAll('button');
    
    boutons.forEach(bouton => {
        bouton.addEventListener('click', function(e) {
            e.preventDefault();
            
            const produit = this.closest('.produit');
            const nomProduit = produit.querySelector('h3').textContent;
            const prix = produit.querySelector('.prix').textContent;
            
            // Message personnalisé
            afficherMessage(`✨ Intéressé par ${nomProduit} ?\nPrix : ${prix}\nContactez-nous pour commander !`);
            
            // Effet visuel sur le bouton
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Navigation fluide
function gererNavigation() {
    const liens = document.querySelectorAll('nav a');
    
    liens.forEach(lien => {
        lien.addEventListener('click', function(e) {
            e.preventDefault();
            
            const cibleId = this.getAttribute('href');
            const cible = document.querySelector(cibleId);
            
            if (cible) {
                window.scrollTo({
                    top: cible.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Fonction pour afficher des messages
function afficherMessage(texte) {
    // Créer un élément de message
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2c5530;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1000;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    message.textContent = texte;
    
    document.body.appendChild(message);
    
    // Supprimer après 4 secondes
    setTimeout(() => {
        message.style.opacity = '0';
        message.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            if (message.parentNode) {
                document.body.removeChild(message);
            }
        }, 500);
    }, 4000);
}
