// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌿 Au Palais Des Arts - Site chargé avec succès !');
    
    // Initialiser toutes les fonctionnalités
    initialiserAnimations();
    initialiserInteractions();
    initialiserNavigation();
    initialiserFormulaire();
    initialiserEffetsImages();
});

// Animations d'apparition
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

    // Observer les éléments
    document.querySelectorAll('.produit, .valeur, .contact-item').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        observer.observe(element);
    });
}

// Interactions des boutons produits
function initialiserInteractions() {
    document.querySelectorAll('.produit button').forEach(bouton => {
        bouton.addEventListener('click', function(e) {
            e.preventDefault();
            
            const produit = this.closest('.produit');
            const nomProduit = produit.querySelector('h3').textContent;
            const prix = produit.querySelector('.prix').textContent;
            
            // Message personnalisé
            afficherNotification(
                `✨ Intéressé par le "${nomProduit}" ?\n\n` +
                `💶 Prix : ${prix}\n\n` +
                `📞 Contactez-nous pour commander !\n` +
                `📧 contact@aupalaisdesarts.fr\n\n` +
                `💎 Fabrication 100% française\n` +
                `🚚 Livraison sous 48h`
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

// Formulaire de contact
function initialiserFormulaire() {
    const formulaire = document.getElementById('formContact');
    
    formulaire.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Récupération des données
        const formData = new FormData(formulaire);
        const données = Object.fromEntries(formData);
        
        // Validation
        if (!données.nom || !données.email || !données.sujet || !données.message) {
            afficherNotification('❌ Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }
        
        // Simulation d'envoi
        afficherNotification(
            `✅ Message envoyé avec succès !\n\n` +
            `Merci ${données.nom}, nous vous recontacterons très rapidement.\n` +
            `Sujet : ${getSujetText(données.sujet)}\n\n` +
            `📧 ${données.email}` +
            (données.telephone ? `\n📞 ${données.telephone}` : '')
        );
        
        // Réinitialisation du formulaire
        formulaire.reset();
    });
}

// Effets sur les images
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

// Helper pour les textes des sujets
function getSujetText(sujet) {
    const sujets = {
        'commande': 'Commande sur mesure',
        'info': 'Demande d\'information',
        'devis': 'Devis personnalisé',
        'autre': 'Autre demande'
    };
    return sujets[sujet] || sujet;
}

// Système de notifications élégant
function afficherNotification(message, type = 'success') {
    // Couleurs selon le type
    const colors = {
        success: { bg: '#2E7D32', border: '#4CAF50' },
        error: { bg: '#D32F2F', border: '#F44336' },
        info: { bg: '#1976D2', border: '#2196F3' }
    };
    
    const color = colors[type] || colors.success;
    
    // Créer la notification
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
    
    // Animation d'entrée
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Suppression automatique après 8 secondes
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

// Confirmation de chargement
console.log('🚀 Script JavaScript chargé - Prêt pour les interactions !');

// Service Worker pour le cache (optionnel - pour les performances)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
        .then(function(registration) {
            console.log('ServiceWorker registration successful');
        })
        .catch(function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}
