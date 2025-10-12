
## 🚀 Installation et Déploiement

### Option 1 : Déploiement Local
1. Téléchargez tous les fichiers dans un dossier
2. Créez un dossier `images` et placez-y vos photos
3. Ouvrez `index.html` dans votre navigateur

### Option 2 : Déploiement sur GitHub Pages
1. Créez un nouveau dépôt GitHub
2. Uploader tous les fichiers dans le dépôt
3. Activez GitHub Pages dans les paramètres
4. Votre site sera accessible à : `https://votrenom.github.io/nom-du-depot`

### Option 3 : Déploiement sur Serveur Web
1. Uploader tous les fichiers sur votre serveur via FTP
2. Assurez-vous que le dossier `images` est accessible
3. Vérifiez que les chemins des images sont corrects

## 🛠️ Fonctionnalités

### 🛒 Système de Panier
- ✅ Ajout/suppression d'articles
- ✅ Modification des quantités
- ✅ Calcul automatique du total
- ✅ Sauvegarde dans le localStorage
- ✅ Commande simulée

### 🎨 Design
- ✅ Couleurs doré et vert (marque)
- ✅ Design responsive (mobile-friendly)
- ✅ Animations fluides
- ✅ Interface intuitive

### 📱 Sections du Site
- **Header** : Navigation et logo
- **Hero** : Présentation principale
- **Histoire** : Notre savoir-faire artisanal
- **Produits** : 4 paniers avec vos images
- **Avis** : Témoignages clients
- **Footer** : Informations de contact

## 🖼️ Gestion des Images

### Images Requises
Placez ces 4 images dans le dossier `images/` :
1. `Panier tressé rectangulaire.jpg`
2. `Panier à linge double compartiment.jpg`
3. `Panier à linge en feuilles de palmier.jpg`
4. `Panier à linge rond en osier.jpg`

### Formats Recommandés
- Format : JPG ou PNG
- Taille : 400x300 pixels minimum
- Poids : < 500KB par image
- Orientation : Paysage recommandé

## 🔧 Personnalisation

### Modifier les Produits
Éditez la section produits dans `index.html` :
```html
<div class="produit-card">
    <img src="images/nom-image.jpg" alt="Description">
    <h3>Nom du Produit</h3>
    <p>Description du produit</p>
    <div class="produit-price">Prix,00€</div>
    <button onclick="ajouterAuPanier('Nom', Prix)">Ajouter</button>
</div>
