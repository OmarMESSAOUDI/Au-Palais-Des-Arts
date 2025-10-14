/* ===== SECTION AJOUT D'AVIS ===== */
.ajout-avis {
    background: var(--white);
}

.ajout-avis-content {
    max-width: 600px;
    margin: 0 auto;
}

.avis-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
}

.note-selection {
    margin-top: var(--space-xs);
}

.etoiles {
    display: flex;
    gap: var(--space-xs);
    margin-bottom: var(--space-xs);
}

.etoile {
    font-size: 2rem;
    cursor: pointer;
    color: #ccc;
    transition: color 0.3s ease, transform 0.2s ease;
}

.etoile:hover {
    transform: scale(1.2);
}

.note-text {
    font-size: 0.9rem;
    color: var(--text-light);
    font-style: italic;
}

.aucun-avis {
    text-align: center;
    color: var(--text-light);
    font-style: italic;
    padding: var(--space-xl);
    grid-column: 1 / -1;
}

/* Styles pour les étoiles pleines */
.etoile.active {
    color: var(--gold);
}

/* Responsive pour la section avis */
@media (max-width: 768px) {
    .etoile {
        font-size: 1.5rem;
    }
    
    .avis-form {
        padding: 0 var(--space-sm);
    }
}
