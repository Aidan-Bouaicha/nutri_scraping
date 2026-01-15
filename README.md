# 🥗 NutriAI - Assistant Nutritionnel Intelligent

NutriAI est une application web fullstack qui combine un frontend React moderne avec un backend FastAPI et une IA locale (Ollama) pour fournir des conseils nutritionnels personnalisés, des calculs de macros et des plans de repas adaptés.

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Technologies utilisées](#-technologies-utilisées)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Démarrage](#-démarrage)
- [Structure du projet](#-structure-du-projet)
- [API Documentation](#-api-documentation)
- [Sécurité](#-sécurité)

## ✨ Fonctionnalités

### 1. **Calcul du profil nutritionnel**
- Calcul du BMR (métabolisme de base) avec la formule Mifflin-St Jeor
- Estimation des besoins caloriques selon l'objectif (perte, maintien, prise de masse)
- Calcul des besoins en protéines personnalisés
- Interface de saisie intuitive avec validation des données

### 2. **Chat IA nutritionnel**
- Assistant conversationnel alimenté par Ollama (LLaMA 3)
- Recommandations personnalisées basées sur votre profil
- Plans de repas adaptés à vos objectifs
- **Sauvegarde automatique** de la conversation dans le localStorage
- **Persistance** : la conversation reste après un refresh ou changement de page
- **Bouton de réinitialisation** pour recommencer une nouvelle conversation
- **Protection contre les injections de prompt** (en développement)

### 3. **Recherche d'aliments**
- Base de données nutritionnelles complète
- Recherche en temps réel
- Informations détaillées sur les macronutriments

### 4. **Interface moderne et responsive**
- Design épuré avec Tailwind CSS
- Navigation fluide entre les sections
- Icônes Lucide React
- Dark mode ready

## 🏗️ Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Frontend      │         │   Backend       │         │   Ollama        │
│   React + Vite  │────────▶│   FastAPI       │────────▶│   LLaMA 3       │
│   Port: 5173    │         │   Port: 8000    │         │   Port: 11434   │
└─────────────────┘         └─────────────────┘         └─────────────────┘
        │                            │
        │                            │
        ▼                            ▼
  localStorage              Base de données
  (chat history)            (foods.json)
```

## 🛠️ Technologies utilisées

### Frontend
- **React 18.3** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Vite** - Build tool rapide
- **Tailwind CSS 3.4** - Styling utilitaire
- **Lucide React** - Icônes modernes
- **LocalStorage API** - Persistance des données côté client

### Backend
- **FastAPI 0.104** - Framework web Python moderne
- **Uvicorn** - Serveur ASGI haute performance
- **Pydantic 2.5** - Validation des données
- **Python 3.12+** - Langage backend

### IA et Data
- **Ollama** - Serveur d'inférence local pour LLMs
- **LLaMA 3** - Modèle de langage pour les recommandations
- **OpenFoodFacts** - Base de données nutritionnelles

## 📦 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js 18+** et npm
- **Python 3.12+**
- **Ollama** ([télécharger ici](https://ollama.ai))
- **Git** (optionnel)

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone <repository-url>
cd nutri_scraping
```

### 2. Installation du Frontend

```bash
npm install
```

### 3. Installation du Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\Activate.ps1

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```

### 4. Installation et configuration d'Ollama

```bash
# Installer Ollama depuis https://ollama.ai

# Télécharger le modèle LLaMA 3
ollama pull llama3

# Vérifier que le modèle est installé
ollama list
```

## ⚙️ Configuration

### Frontend

Créez un fichier `.env` à la racine du projet :

```env
VITE_API_URL=http://localhost:8000
```

### Backend

Le backend est configuré dans `backend/config/ollama.py` :

```python
OLLAMA_BASE_URL = "http://localhost:11434"
OLLAMA_MODEL = "llama3"
```

## 🎯 Démarrage

### Option 1 : Démarrage manuel (3 terminaux)

**Terminal 1 - Ollama :**
```bash
ollama serve
```

**Terminal 2 - Backend FastAPI :**
```bash
cd backend
venv\Scripts\Activate.ps1
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**Terminal 3 - Frontend React :**
```bash
npm run dev
```

### Option 2 : Script de démarrage rapide

Ajoutez ces scripts à votre `package.json` :

```json
{
  "scripts": {
    "dev": "vite",
    "backend": "cd backend && venv\\Scripts\\activate && uvicorn main:app --reload",
    "fullstack": "concurrently \"npm run dev\" \"npm run backend\""
  }
}
```

### Accès à l'application

- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:8000
- **Documentation API** : http://localhost:8000/docs
- **Ollama** : http://localhost:11434

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

## 📁 Structure du projet

```
nutri_scraping/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProfileForm.tsx          # Formulaire de saisie du profil
│   │   │   ├── NutritionResults.tsx     # Affichage des résultats nutritionnels
│   │   │   ├── ChatInterface.tsx        # Interface de chat avec IA
│   │   │   └── FoodSearch.tsx           # Recherche d'aliments
│   │   ├── services/
│   │   │   └── api.ts                   # Client API REST
│   │   ├── App.tsx                      # Composant racine avec routing
│   │   ├── main.tsx                     # Point d'entrée React
│   │   └── index.css                    # Styles globaux + Tailwind
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── api/
│   │   ├── chat.py                      # Endpoint chat IA
│   │   ├── nutrition.py                 # Endpoint calculs nutritionnels
│   │   └── foods.py                     # Endpoint recherche aliments
│   ├── service/
│   │   ├── chat_service.py              # Logique métier chat + Ollama
│   │   ├── nutrition_service.py         # Calculs BMR, calories, protéines
│   │   └── food_service.py              # Gestion base de données aliments
│   ├── schemas/
│   │   ├── chat.py                      # Modèles Pydantic pour chat
│   │   ├── nutrition.py                 # Modèles Pydantic pour nutrition
│   │   └── food.py                      # Modèles Pydantic pour aliments
│   ├── config/
│   │   └── ollama.py                    # Configuration Ollama
│   ├── data/
│   │   └── foods.json                   # Base de données nutritionnelle
│   ├── tools/
│   │   ├── calculate_bmr.py             # Outil calcul métabolisme
│   │   ├── estimate_macros.py           # Outil estimation macros
│   │   ├── search_foods.py              # Outil recherche aliments
│   │   └── build_meal_plan.py           # Outil génération plans repas
│   ├── main.py                          # Point d'entrée FastAPI
│   └── requirements.txt
│
└── README.md
```

## 📡 API Documentation

### 1. Nutrition Profile

**Endpoint:** `POST /nutrition/profile`

Calcule le profil nutritionnel complet d'un utilisateur.

**Request Body:**
```json
{
  "taille": 175,
  "poids": 75,
  "age": 28,
  "sexe": "homme",
  "objectif": "perte"
}
```

**Response:**
```json
{
  "bmr": 1756,
  "calories_journalieres": 1405,
  "besoins_proteiques": 131,
  "profil": {
    "taille": 175,
    "poids": 75,
    "age": 28,
    "sexe": "homme",
    "objectif": "perte",
    "id": "generated-uuid"
  }
}
```

**Formules utilisées:**
- **BMR** : Mifflin-St Jeor
  - Homme: `10 × poids(kg) + 6.25 × taille(cm) - 5 × âge + 5`
  - Femme: `10 × poids(kg) + 6.25 × taille(cm) - 5 × âge - 161`
- **Calories** : BMR × multiplicateur objectif
  - Perte: BMR × 0.8
  - Maintien: BMR × 1.2
  - Prise: BMR × 1.4
- **Protéines** : `1.75 × poids(kg)`

---

### 2. Chat IA

**Endpoint:** `POST /chat/message`

Envoie un message au chatbot nutritionnel alimenté par Ollama.

**Request Body:**
```json
{
  "message": "Propose-moi un plan de repas pour une prise de masse",
  "profile": {
    "taille": 175,
    "poids": 75,
    "age": 28,
    "sexe": "homme",
    "objectif": "prise"
  }
}
```

**Response:**
```json
{
  "profil": { ... },
  "macros": {
    "calories": 2458,
    "proteines": 131
  },
  "explication": "Voici un plan adapté à vos besoins de 2458 kcal...",
  "repas": {}
}
```

**Fonctionnalités du chat:**
- Répond uniquement aux questions nutritionnelles
- Contexte automatique basé sur le profil utilisateur
- Timeout de 60 secondes max
- Limite de 150 tokens pour des réponses rapides

---

### 3. Food Search

**Endpoint:** `GET /foods/search?q={query}`

Recherche des aliments dans la base de données.

**Query Parameters:**
- `q` : Terme de recherche (requis)

**Response:**
```json
[
  {
    "nom": "Poulet grillé",
    "calories": 165,
    "proteines": 31,
    "glucides": 0,
    "lipides": 3.6,
    "fibres": 0,
    "source": "USDA"
  }
]
```

---

### 4. Documentation interactive

FastAPI génère automatiquement une documentation interactive accessible à :
- **Swagger UI** : http://localhost:8000/docs
- **ReDoc** : http://localhost:8000/redoc

## 🔒 Sécurité

### Protection contre les injections de prompt (en développement)

Le système inclut des mécanismes de base pour détecter et bloquer les tentatives d'injection de prompt :

- **Liste de mots-clés interdits** : ignore, oublie, bypass, jailbreak, etc.
- **Validation des patterns** : détection de commandes suspectes
- **Sanitization** : nettoyage des caractères de contrôle
- **Limitation de longueur** : messages limités à 500 caractères

### Bonnes pratiques implémentées

- ✅ Validation des données avec Pydantic
- ✅ CORS configuré pour le développement local
- ✅ Typage strict TypeScript + Python
- ✅ Séparation frontend/backend
- ✅ Pas de stockage de données sensibles
- ✅ LocalStorage uniquement pour historique chat (non-sensible)

## 🐛 Dépannage

### Le chatbot ne répond pas

**Vérifiez qu'Ollama est démarré :**
```bash
ollama serve
```

**Vérifiez que le modèle est téléchargé :**
```bash
ollama list
```

### Erreur CORS

Vérifiez que le backend autorise l'origine du frontend dans [backend/main.py](backend/main.py#L10).

### Port 8000 déjà utilisé

```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8000 | xargs kill -9
```

## 🚀 Déploiement

### Frontend (Vercel/Netlify)

```bash
npm run build
# Le dossier dist/ contient les fichiers statiques
```

### Backend (Docker)

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
COPY backend/ .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Ollama (production)

Pour la production, considérez :
- Utiliser une API cloud (OpenAI, Anthropic)
- Déployer Ollama sur un serveur dédié GPU
- Mettre en cache les réponses fréquentes

## 📝 Développement

### Scripts disponibles

```bash
# Frontend
npm run dev          # Démarrage développement
npm run build        # Build production
npm run preview      # Preview du build
npm run lint         # Linter
npm run typecheck    # Vérification TypeScript

# Backend
uvicorn main:app --reload    # Mode développement avec hot-reload
python -m pytest             # Tests unitaires (à implémenter)
```

## 🤝 Contribution

Les contributions sont bienvenues ! Créez une issue ou une pull request.

## 📄 License

MIT

## 👥 Auteurs

- **Développeur principal** : [Votre nom]
- **IA Assistant** : Claude (Anthropic)

## 🙏 Remerciements

- [Ollama](https://ollama.ai) - Inférence LLM locale
- [OpenFoodFacts](https://world.openfoodfacts.org) - Données nutritionnelles
- [FastAPI](https://fastapi.tiangolo.com) - Framework backend
- [React](https://react.dev) - Bibliothèque UI
- [Tailwind CSS](https://tailwindcss.com) - Framework CSS

---

**Note** : Cette application est à but éducatif. Consultez toujours un professionnel de santé pour des conseils nutritionnels personnalisés.
