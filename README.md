# NutriAI - Frontend React

Frontend React pour l'application NutriAI, un assistant nutritionnel intelligent qui communique avec un backend FastAPI.

## Fonctionnalités

- **Calcul du profil nutritionnel** : Formulaire pour calculer BMR, besoins caloriques et protéiques
- **Chat IA** : Interface de discussion avec un assistant IA local (Ollama) pour obtenir des plans de repas personnalisés
- **Recherche d'aliments** : Exploration de la base de données nutritionnelles
- **Design moderne** : Interface utilisateur épurée avec Tailwind CSS

## Prérequis

- Node.js 18+ et npm
- Backend FastAPI démarré sur `http://localhost:8000`

## Installation

```bash
npm install
```

## Configuration

Créez un fichier `.env` à la racine du projet (voir `.env.example`) :

```
VITE_API_URL=http://localhost:8000
```

## Démarrage

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## API Backend attendue

Le frontend communique avec les endpoints suivants :

### POST /nutrition/profile

Calcule le profil nutritionnel.

**Request:**
```json
{
  "taille": 170,
  "poids": 70,
  "age": 30,
  "sexe": "homme",
  "objectif": "maintien"
}
```

**Response:**
```json
{
  "bmr": 1650,
  "calories_journalieres": 2200,
  "besoins_proteiques": 120,
  "profil": { ... }
}
```

### POST /chat/message

Envoie un message au chatbot IA.

**Request:**
```json
{
  "message": "Propose-moi un plan de repas",
  "profil": {
    "taille": 170,
    "poids": 70,
    "age": 30,
    "sexe": "homme",
    "objectif": "maintien"
  }
}
```

**Response:**
```json
{
  "response": "Voici un plan de repas adapté...",
  "plan_repas": ["Petit-déjeuner: ...", "Déjeuner: ...", "Dîner: ..."]
}
```

### GET /foods/search?q=pomme

Recherche des aliments.

**Response:**
```json
[
  {
    "nom": "Pomme",
    "calories": 52,
    "proteines": 0.3,
    "glucides": 14,
    "lipides": 0.2,
    "source": "OpenFoodFacts"
  }
]
```

## Stack technique

- React 18
- TypeScript
- Tailwind CSS
- Vite
- Lucide React (icônes)

## Structure du projet

```
src/
├── components/          # Composants React
│   ├── ProfileForm.tsx      # Formulaire de profil
│   ├── NutritionResults.tsx # Affichage des résultats
│   ├── ChatInterface.tsx    # Interface de chat
│   └── FoodSearch.tsx       # Recherche d'aliments
├── services/           # Services API
│   └── api.ts              # Client API REST
├── App.tsx            # Composant principal
└── main.tsx           # Point d'entrée
```

## Développement

```bash
npm run dev      # Démarrer le serveur de développement
npm run build    # Construire pour la production
npm run preview  # Prévisualiser la version de production
npm run lint     # Linter le code
```

## Notes

- Assurez-vous que votre backend FastAPI est démarré avant d'utiliser l'application
- L'application ne stocke aucune donnée personnelle
- Le chatbot nécessite Ollama installé et configuré côté backend
