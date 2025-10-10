// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌿 Au Palais Des Arts - Site chargé avec succès !');
    
    // Initialiser toutes les fonctionnalités
    initialiserAnimations();
    initialiserInteractions();
    initialiserNavigation();
});

// Animations d'apparition
function initialiserAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    // Observer les produits
    document.querySelectorAll('.produit').forEach(produit => {
        produit.style.opacity = '0';
        produit.style.transform = 'translateY(30px)';
        produit.style.transition = 'all 0.6s ease';
        observer.observe(produit);
    });
}

// Interactions des boutons
function initialiserInteractions() {
    document.querySelectorAll('button').forEach(bouton => {
        bouton.addEventListener('click', function(e) {
            e.preventDefault();
            
            const produit = this.closest('.produit');
            const nomProduit = produit.querySelector('h3').textContent;
            const prix = produit.querySelector('.prix').textContent;
            
            // Message élégant
            afficherNotification(
                `✨ Intéressé par le "${nomProduit}" ?\n\n` +
                `💶 Prix : ${prix}\n\n` +
                `📞 Contactez-nous pour commander !\n` +
                `📧 contact@aupalaisdesarts.fr`
            );
            
            // Animation du bouton
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Navigation fluide
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

// Système de notifications élégant
function afficherNotification(message) {
    // Créer la notification
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            color: #5D4037;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 350px;
            border-left: 4px solid #8D6E63;
            font-family: Arial, sans-serif;
            line-height: 1.5;
            white-space: pre-line;
        ">
            <div style="font-weight: bold; margin-bottom: 10px; color: #6D4C41;">
                🎨 Au Palais Des Arts
            </div>
            <div>${message}</div>
            <button onclick="this.parentElement.parentElement.remove()" style="
                margin-top: 15px;
                background: #8D6E63;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 0.9em;
            ">Fermer</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Suppression automatique après 8 secondes
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
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

// Confirmation de chargement
console.log('🚀 Script JavaScript chargé - Prêt pour les interactions !');
