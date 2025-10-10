<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nos Créations - Vannerie</title>
    <style>
        /* === STYLES GÉNÉRAUX === */
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #2d5016; /* Vert foncé pour le texte */
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fbf3; /* Vert très clair pour le fond */
        }

        /* === TITRE PRINCIPAL === */
        h1 {
            text-align: center;
            color: #5d8c2a; /* Vert moyen */
            margin-bottom: 2rem;
            font-size: 2.5rem;
            font-weight: 300;
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        /* === CONTENEUR DES PRODUITS === */
        .produits-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            padding: 1rem;
        }

        /* === CARTE PRODUIT INDIVIDUELLE === */
        .produit {
            background: white;
            border-radius: 10px;
            padding: 1.5rem;
            box-shadow: 0 5px 15px rgba(93, 140, 42, 0.1); /* Ombre verte subtile */
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            position: relative;
            overflow: hidden;
            border: 1px solid #e8f5e0; /* Bordure verte très claire */
        }

        .produit:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(93, 140, 42, 0.2); /* Ombre verte plus prononcée */
        }

        /* === EN-TÊTE DU PRODUIT === */
        .produit-header {
            border-bottom: 1px solid #e8f5e0; /* Ligne de séparation verte claire */
            padding-bottom: 1rem;
            margin-bottom: 1rem;
        }

        .produit h2 {
            color: #4a7020; /* Vert foncé pour les titres */
            margin: 0 0 0.5rem 0;
            font-size: 1.4rem;
            font-weight: 500;
        }

        /* === DESCRIPTION DU PRODUIT === */
        .produit p {
            color: #6b8c4a; /* Vert-gris pour la description */
            margin: 0.5rem 0;
            font-size: 0.95rem;
        }

        /* === PRIX === */
        .prix {
            display: block;
            font-size: 1.5rem;
            color: #b8860b; /* Doré pour les prix */
            font-weight: bold;
            margin: 1rem 0;
            text-align: right;
        }

        /* === BADGE DÉCOUVRIR === */
        .badge-decouvrir {
            display: inline-block;
            background: #5d8c2a; /* Vert naturel pour le badge */
            color: white;
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
            font-size: 0.8rem;
            margin-bottom: 0.5rem;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        /* === ANIMATION SUBTILE === */
        .produit::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 3px;
            background: #b8860b; /* Ligne dorée pour l'animation */
            transition: left 0.3s ease;
        }

        .produit:hover::before {
            left: 0;
        }

        /* === EFFET SPÉCIAL SUR LES PRIX === */
        .prix {
            position: relative;
            display: inline-block;
        }

        .prix::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 100%;
            height: 1px;
            background: linear-gradient(90deg, transparent, #b8860b, transparent);
        }

        /* === STYLES RESPONSIVE === */
        @media (max-width: 768px) {
            .produits-container {
                grid-template-columns: 1fr;
                gap: 1.5rem;
            }
            
            body {
                padding: 10px;
            }
            
            h1 {
                font-size: 2rem;
            }
        }
    </style>
</head>
<body>
    <h1>NOS CRÉATIONS</h1>
    
    <div class="produits-container">
        <!-- Produit 1 -->
        <div class="produit">
            <div class="produit-header">
                <h2>Pariser Royal</h2>
            </div>
            <p>Création exclusive en osier naturel</p>
            <span class="prix">45,00€</span>
        </div>
        
        <!-- Produit 2 -->
        <div class="produit">
            <span class="badge-decouvrir">DÉCOUVRIR</span>
            <div class="produit-header">
                <h2>Corbeille Champêtre</h2>
            </div>
            <p>Corbeille traditionnelle en osier naturel, parfaite pour la décoration</p>
            <span class="prix">28,00€</span>
        </div>
        
        <!-- Produit 3 -->
        <div class="produit">
            <span class="badge-decouvrir">DÉCOUVRIR</span>
            <div class="produit-header">
                <h2>Corbeille Élégante</h2>
            </div>
            <p>Osier travaillé main avec finition premium</p>
            <span class="prix">35,00€</span>
        </div>
        
        <!-- Produit 4 -->
        <div class="produit">
            <div class="produit-header">
                <h2>Suspension Naturelle</h2>
            </div>
            <p>Lumière en osier pour décoration intérieure</p>
            <span class="prix">60,00€</span>
        </div>
    </div>
</body>
