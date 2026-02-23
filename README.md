# SYNAPSEAR — Guide de déploiement complet

Site statique premium déployable sur GitHub Pages avec collecte de waitlist via Google Forms → Google Sheets. **Zéro backend. Zéro coût. Zéro maintenance.**

---

## Structure du projet

```
synapsear/
├── index.html    ← Page principale
├── styles.css    ← Styles (design Apple/Neuralink)
├── script.js     ← Interactions + configuration URLs
└── README.md     ← Ce fichier
```

---

## Étape 1 — Créer votre Google Form (5 minutes)

### 1.1 Créer le formulaire

1. Rendez-vous sur **[forms.google.com](https://forms.google.com)**
2. Cliquez sur **"+"** pour créer un nouveau formulaire
3. Donnez-lui un titre : `SYNAPSEAR — Liste prioritaire`
4. Ajoutez les champs suivants :
   - **Prénom** → type *Réponse courte* → Obligatoire
   - **Adresse e-mail** → type *Réponse courte* → Obligatoire → activez la validation "E-mail"
   - **Votre profil** → type *Liste déroulante* → options : `Audiophile`, `Musicien`, `Professionnel du son`, `Particulier`, `Autre`
   - **Comment avez-vous entendu parler de SYNAPSEAR ?** → type *Réponse courte* → Facultatif

5. Dans l'onglet **Paramètres** (icône engrenage) :
   - Désactivez "Collecter les adresses e-mail" (vous le faites manuellement)
   - Activez "Limiter à 1 réponse" si vous voulez éviter les doublons (nécessite connexion Google)

### 1.2 Récupérer l'URL du bouton (Mode B)

1. Cliquez sur **Envoyer** (bouton en haut à droite)
2. Cliquez sur l'icône **🔗 Lien**
3. Cochez **"Raccourcir l'URL"** pour une URL courte (ex: `https://forms.gle/AbCdEf12345`)
4. Copiez cette URL — c'est votre **FORM_URL**

### 1.3 Récupérer l'URL embed (Mode A — iframe)

1. Cliquez sur **Envoyer** → icône **< >** (Intégrer)
2. Copiez le code HTML — extrayez uniquement la valeur de l'attribut `src`, qui ressemble à :
   ```
   https://docs.google.com/forms/d/e/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/viewform?embedded=true
   ```
3. C'est votre **FORM_EMBED_URL**

---

## Étape 2 — Connecter Google Forms à Google Sheets

Les réponses se synchronisent automatiquement :

1. Dans votre formulaire, cliquez sur l'onglet **Réponses**
2. Cliquez sur l'icône **Google Sheets** (tableau vert)
3. Choisissez **"Créer une nouvelle feuille de calcul"**
4. Nommez-la `SYNAPSEAR Waitlist` → Cliquer **Créer**

✅ Désormais, chaque nouvelle inscription apparaît instantanément dans Google Sheets, avec date/heure.

---

## Étape 3 — Configurer le site

Ouvrez `script.js` et remplacez les deux valeurs dans `CONFIG` :

```javascript
const CONFIG = {
  // Mode B : bouton qui ouvre Google Forms dans un nouvel onglet
  FORM_URL: "https://forms.gle/VOTRE_URL_ICI",

  // Mode A : iframe intégrée dans la page
  FORM_EMBED_URL: "https://docs.google.com/forms/d/e/XXXXXXXXXXXXX/viewform?embedded=true",
};
```

> **Note :** Si vous n'avez pas encore créé le formulaire, laissez les valeurs par défaut. Le site fonctionnera parfaitement — seuls les liens/iframe du formulaire seront inactifs.

---

## Étape 4 — Déployer sur GitHub Pages

### 4.1 Créer le dépôt GitHub

1. Créez un compte sur **[github.com](https://github.com)** si vous n'en avez pas
2. Cliquez sur **"New repository"** (bouton vert)
3. Nom du dépôt : `synapsear` (ou `synapsear-waitlist`, peu importe)
4. Visibilité : **Public** (obligatoire pour GitHub Pages gratuit)
5. Cliquez **"Create repository"**

### 4.2 Uploader les fichiers

**Option A — Interface web (plus simple) :**

1. Dans votre nouveau dépôt, cliquez sur **"uploading an existing file"**
2. Glissez-déposez les 4 fichiers : `index.html`, `styles.css`, `script.js`, `README.md`
3. En bas de page, cliquez **"Commit changes"**

**Option B — Git en ligne de commande :**

```bash
git init
git add .
git commit -m "Initial commit — SYNAPSEAR landing page"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/synapsear.git
git push -u origin main
```

### 4.3 Activer GitHub Pages

1. Dans votre dépôt, allez dans **Settings** (onglet en haut)
2. Dans le menu gauche, cliquez **Pages**
3. Sous **"Source"**, sélectionnez : **Deploy from a branch**
4. Branch : **main** | Folder : **/ (root)**
5. Cliquez **Save**

⏳ Attendez 1-3 minutes. Votre site sera accessible à :

```
https://VOTRE_USERNAME.github.io/synapsear/
```

> GitHub vous notifie par email et affiche l'URL dans l'onglet Pages quand le déploiement est terminé.

### 4.4 (Optionnel) Domaine personnalisé

Si vous avez un domaine (ex: `synapsear.com`) :

1. Dans **Settings → Pages → Custom domain**, entrez votre domaine
2. Chez votre registrar DNS, ajoutez un enregistrement CNAME :
   - Nom : `www`
   - Valeur : `VOTRE_USERNAME.github.io`
3. Pour le domaine racine, ajoutez 4 enregistrements A pointant vers :
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
4. Activez **"Enforce HTTPS"** dans GitHub Pages

---

## Étape 5 — Mises à jour futures

Pour modifier le site après déploiement :

**Via l'interface web GitHub :**
1. Ouvrez le fichier à modifier (ex: `index.html`)
2. Cliquez l'icône crayon ✏️
3. Faites vos modifications
4. Cliquez **"Commit changes"**
5. Le site se met à jour automatiquement en 1-2 minutes

**Via Git :**
```bash
git add .
git commit -m "Mise à jour du contenu"
git push
```

---

## Personnalisation rapide

### Modifier les textes

Ouvrez `index.html` et cherchez les sections marquées :
- `<!-- HERO -->` — titre principal et accroche
- `<!-- PROBLÈME -->` — les 3 cartes
- `<!-- SOLUTION -->` — description produit
- `<!-- BÉNÉFICES -->` — les 4 statistiques
- `<!-- PRIX -->` — les 3 offres
- `<!-- FAQ -->` — les questions/réponses

### Modifier les couleurs

Ouvrez `styles.css`, toutes les couleurs sont dans `:root` en début de fichier :

```css
:root {
  --c-blue:   #60a5fa;    /* Bleu principal */
  --c-violet: #a78bfa;    /* Violet accent */
  /* ... */
}
```

### Modifier le compteur de la liste d'attente

Dans `index.html`, cherchez `hero__stats` et modifiez les chiffres :

```html
<span class="stat__num">2 400</span>
```

---

## Architecture technique

| Composant | Technologie | Coût |
|-----------|-------------|------|
| Hébergement | GitHub Pages | Gratuit |
| Collecte emails | Google Forms | Gratuit |
| Stockage données | Google Sheets | Gratuit |
| Polices | Google Fonts (Syne + DM Sans) | Gratuit |
| Domaine | Votre registrar (Namecheap, OVH…) | ~10€/an (optionnel) |

**Capacités :**
- Google Forms : illimité (réponses illimitées)
- GitHub Pages : 1 Go de stockage, 100 Go/mois de bande passante
- Google Sheets : 5 millions de cellules par feuille

---

## Résoudre les problèmes courants

**Le site ne s'affiche pas après déploiement**
→ Attendez 3-5 minutes. Vérifiez que le fichier s'appelle bien `index.html` (minuscule).

**L'iframe Google Forms affiche une erreur**
→ Vérifiez que vous avez utilisé l'URL embed (avec `embedded=true`) et non l'URL du bouton.

**Les polices ne se chargent pas**
→ Normal en local (double-clic). Les fallbacks CSS s'activent. Sur GitHub Pages, les polices Google Fonts se chargent normalement.

**La hauteur de l'iframe est trop petite**
→ Dans `styles.css`, modifiez `.waitlist__iframe { min-height: 620px; }` — augmentez la valeur selon la taille de votre formulaire.

---

## Accessibilité & performance

- ✅ HTML sémantique avec rôles ARIA
- ✅ Navigation clavier complète
- ✅ `prefers-reduced-motion` respecté (animations désactivées)
- ✅ Contrastes WCAG AA
- ✅ Images SVG inline avec `aria-hidden`
- ✅ Zéro dépendance JavaScript externe obligatoire
- ✅ Fonctionne sans JavaScript (contenu lisible)
- ✅ Meta viewport et responsive 320px → 1440px+

---

*SYNAPSEAR — Produit en développement. Toutes les performances mentionnées sont des objectifs à valider expérimentalement. SYNAPSEAR n'est pas un dispositif médical.*
