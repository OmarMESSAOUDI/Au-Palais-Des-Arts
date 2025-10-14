<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Paiement - Au Palais Des Arts</title>
    <link rel="stylesheet" href="style.css">
    <style>
        .paiement-container {
            max-width: 800px;
            margin: 100px auto 50px;
            padding: var(--space-xl);
            background: var(--white);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
        }

        .recap-commande {
            background: var(--cream);
            padding: var(--space-lg);
            border-radius: var(--radius);
            margin-bottom: var(--space-lg);
            border: 2px solid var(--light-gold);
        }

        .recap-item {
            display: flex;
            justify-content: space-between;
            padding: var(--space-sm) 0;
            border-bottom: 1px solid var(--light-gray);
        }

        .recap-item:last-child {
            border-bottom: none;
        }

        .recap-total {
            font-size: 1.5rem;
            font-weight: bold;
            color: var(--primary-green);
            text-align: right;
            margin-top: var(--space-md);
            padding-top: var(--space-md);
            border-top: 3px solid var(--primary-green);
        }

        .form-paiement {
            display: grid;
            gap: var(--space-md);
        }

        .form-section {
            background: var(--cream);
            padding: var(--space-lg);
            border-radius: var(--radius);
            border: 2px solid var(--light-gold);
        }

        .form-section h3 {
            color: var(--primary-green);
            margin-bottom: var(--space-md);
        }

        .paiement-actions {
            display: flex;
            gap: var(--space-md);
            justify-content: space-between;
            margin-top: var(--space-lg);
        }

        .btn-retour {
            background: var(--text-light);
            color: white;
        }

        .btn-retour:hover {
            background: var(--text-dark);
        }

        .confirmation {
            text-align: center;
            padding: var(--space-xl);
        }

        .confirmation h2 {
            color: var(--primary-green);
            margin-bottom: var(--space-md);
        }

        .confirmation p {
            color: var(--text-light);
            margin-bottom: var(--space-lg);
        }

        .loading-paiement {
            display: none;
            text-align: center;
            padding: var(--space-xl);
        }

        .loading-paiement .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid var(--light-gray);
            border-top: 4px solid var(--gold);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto var(--space-md);
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
            .paiement-container {
                margin: 80px auto 30px;
                padding: var(--space-md);
            }

            .paiement-actions {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header id="header">
        <div class="container">
            <div class="header-content">
                <div class="logo">
                    <img src="Au_Palais_Des_Arts.png" alt="Au Palais Des Arts" class="logo-icon">
                    <div class="logo-text">
                        <h1>Au Palais Des Arts</h1>
                        <p>Artisanat marocain d'exception</p>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- Contenu principal -->
    <main class="container">
        <div class="paiement-container">
            <div class="section-header">
                <h2>Finaliser votre commande</h2>
                <p>Remplissez vos informations pour finaliser votre achat</p>
            </div>

            <!-- Récapitulatif de la commande -->
            <div class="recap-commande">
                <h3>Récapitulatif de votre commande</h3>
                <div id="recap-items">
                    <!-- Les articles seront ajoutés dynamiquement -->
                </div>
                <div class="recap-total" id="recap-total">Total : 0,00€</div>
            </div>

            <!-- Formulaire de paiement -->
            <form class="form-paiement" id="formPaiement">
                <!-- Informations personnelles -->
                <div class="form-section">
                    <h3>Informations personnelles</h3>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="prenom">Prénom *</label>
                            <input type="text" id="prenom" name="prenom" required>
                        </div>
                        <div class="form-group">
                            <label for="nom">Nom *</label>
                            <input type="text" id="nom" name="nom" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="email">Email *</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="telephone">Téléphone *</label>
                        <input type="tel" id="telephone" name="telephone" required>
                    </div>
                </div>

                <!-- Adresse de livraison -->
                <div class="form-section">
                    <h3>Adresse de livraison</h3>
                    <div class="form-group">
                        <label for="adresse">Adresse *</label>
                        <input type="text" id="adresse" name="adresse" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="code-postal">Code postal *</label>
                            <input type="text" id="code-postal" name="code-postal" required>
                        </div>
                        <div class="form-group">
                            <label for="ville">Ville *</label>
                            <input type="text" id="ville" name="ville" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="pays">Pays *</label>
                        <select id="pays" name="pays" required>
                            <option value="">Sélectionnez votre pays</option>
                            <option value="france">France</option>
                            <option value="belgique">Belgique</option>
                            <option value="suisse">Suisse</option>
                            <option value="luxembourg">Luxembourg</option>
                        </select>
                    </div>
                </div>

                <!-- Informations de paiement -->
                <div class="form-section">
                    <h3>Informations de paiement</h3>
                    <div class="form-group">
                        <label for="carte-numero">Numéro de carte *</label>
                        <input type="text" id="carte-numero" name="carte-numero" placeholder="1234 5678 9012 3456" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="carte-expiration">Date d'expiration *</label>
                            <input type="text" id="carte-expiration" name="carte-expiration" placeholder="MM/AA" required>
                        </div>
                        <div class="form-group">
                            <label for="carte-cvv">CVV *</label>
                            <input type="text" id="carte-cvv" name="carte-cvv" placeholder="123" required>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="paiement-actions">
                    <a href="index.html" class="btn btn-retour">← Retour au panier</a>
                    <button type="submit" class="btn btn-success">💳 Payer maintenant</button>
                </div>
            </form>

            <!-- Confirmation (cachée par défaut) -->
            <div class="confirmation" id="confirmation" style="display: none;">
                <h2>🎉 Commande confirmée !</h2>
                <p>Merci pour votre commande. Vous recevrez un email de confirmation dans quelques instants.</p>
                <p>Votre numéro de commande est : <strong id="numero-commande"></strong></p>
                <a href="index.html" class="btn btn-primary">Retour à l'accueil</a>
            </div>

            <!-- Loading (caché par défaut) -->
            <div class="loading-paiement" id="loadingPaiement" style="display: none;">
                <div class="spinner"></div>
                <p>Traitement de votre paiement...</p>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-bottom">
                <p>&copy; 2024 Au Palais Des Arts. Artisanat marocain - Tous droits réservés.</p>
            </div>
        </div>
    </footer>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Récupérer la commande depuis le localStorage
            const commande = JSON.parse(localStorage.getItem('commande'));
            const recapItems = document.getElementById('recap-items');
            const recapTotal = document.getElementById('recap-total');
            const formPaiement = document.getElementById('formPaiement');
            const confirmation = document.getElementById('confirmation');
            const loadingPaiement = document.getElementById('loadingPaiement');

            if (!commande || !commande.produits || commande.produits.length === 0) {
                recapItems.innerHTML = '<p>Aucun article dans votre commande.</p>';
                recapTotal.textContent = 'Total : 0,00€';
                return;
            }

            // Afficher le récapitulatif
            recapItems.innerHTML = commande.produits.map(item => `
                <div class="recap-item">
                    <span>${item.nom} × ${item.quantite}</span>
                    <span>${(item.prix * item.quantite).toFixed(2)}€</span>
                </div>
            `).join('');

            recapTotal.textContent = `Total : ${commande.total.toFixed(2)}€`;

            // Gérer la soumission du formulaire
            formPaiement.addEventListener('submit', function(e) {
                e.preventDefault();

                // Afficher le loading
                formPaiement.style.display = 'none';
                loadingPaiement.style.display = 'block';

                // Simuler le traitement du paiement
                setTimeout(() => {
                    loadingPaiement.style.display = 'none';
                    
                    // Générer un numéro de commande aléatoire
                    const numeroCommande = 'CMD-' + Date.now().toString().slice(-8);
                    document.getElementById('numero-commande').textContent = numeroCommande;
                    
                    // Afficher la confirmation
                    confirmation.style.display = 'block';

                    // Vider le panier
                    localStorage.removeItem('panier');
                    localStorage.removeItem('commande');
                }, 3000);
            });
        });
    </script>
</body>
</html>
