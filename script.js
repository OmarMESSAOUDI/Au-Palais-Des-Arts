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
            avis.style.transform = 'translateY(20px)';
            avis.style.transition = 'all 0.6s ease';
            
            setTimeout(() => {
                avis.style.opacity = '1';
                avis.style.transform = 'translateY(0)';
            }, 100 * (index - (listeAvis.children.length - avisSupplementaires.length)));
        }
    });
    
    // Désactiver le bouton après clic
    const btnVoirPlus = document.querySelector('.btn-voir-plus-avis');
    btnVoirPlus.textContent = 'Tous les avis chargés';
    btnVoirPlus.disabled = true;
    btnVoirPlus.style.opacity = '0.6';
    
    afficherNotification('Avis supplémentaires chargés !');
}

// Ajoutez cet appel dans la fonction initialiserApp()
function initialiserApp() {
    initialiserProduits();
    initialiserPanier();
    initialiserRecherche();
    initialiserFiltres();
    initialiserTheme();
    initialiserFormulaire();
    initialiserAvis(); // ← Ajoutez cette ligne
}
