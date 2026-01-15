# 🥗 NutriAI - Assistant Nutritionnel Intelligent

## 📖 Vue d'ensemble

**NutriAI** est une application web fullstack qui fournit des conseils nutritionnels personnalisés et intelligents. L'utilisateur entre son profil (taille, poids, âge, objectif), et l'application :

1. **Calcule** ses besoins caloriques et protéiques avec des formules nutritionnelles reconnues
2. **Propose** des plans de repas personnalisés via un assistant IA
3. **Permet** de rechercher les informations nutritionnelles d'aliments

L'objectif est de démontrer une **stack complète moderne** : frontend React, backend Python, intégration d'IA locale (Ollama), et gestion d'état côté client.

---

## 🎯 Contexte et objectifs

### Pourquoi cette application ?

- **Besoin réel** : Les gens veulent connaître leurs besoins nutritionnels et obtenir des conseils personnalisés
- **IA locale** : Utiliser une IA sans dépendre d'une API cloud (Ollama + LLaMA 3)
- **Stack moderne** : Démontrer la capacité à construire une application web complète
- **Expérience utilisateur** : Interface intuitive et rapide

### Objectifs techniques

✅ Implémenter une **architecture 3-tiers** (frontend, backend, IA)  
✅ **Valider** les données avec Pydantic  
✅ **Persister** l'état côté client avec localStorage  
✅ **Intégrer** une IA locale sans dépendre de services externes  
✅ **Protéger** l'application contre les injections de prompt  
✅ **Documenter** le code et l'architecture  

---

## ✨ Fonctionnalités principales

### 1️⃣ Calcul du profil nutritionnel

L'utilisateur rentre :
- **Taille** (cm), **Poids** (kg), **Âge** (ans), **Sexe** (M/F), **Objectif** (perte/maintien/prise)

**L'app calcule** :
- **BMR** (Basal Metabolic Rate) = calories de base au repos
- **Calories journalières** = BMR adapté à l'objectif  
- **Protéines** = besoins selon le poids

**Formules** :
```
BMR (Mifflin-St Jeor) :
  Homme: 10×poids + 6.25×taille - 5×âge + 5
  Femme: 10×poids + 6.25×taille - 5×âge - 161

Calories:
  Perte: BMR × 0.8 | Maintien: BMR × 1.2 | Prise: BMR × 1.4

Protéines: 1.75 × poids (grammes)
```

### 2️⃣ Chat IA avec MCP + Scraping

**Flux complet** :
1. Utilisateur pose une question (ex: "Propose-moi un plan de repas avec des aliments riches en protéines")
2. **MCP (Model Context Protocol)** intercepte la requête
3. MCP identifie que c'est une demande d'aliments
4. **Scraping automatique** : MCP scrape OpenFoodFacts pour chercher les aliments
5. Les données scrapées sont structurées et enrichies
6. Le contexte complet (profil + aliments scrapés) est envoyé à **Ollama (LLaMA 3)**
7. Ollama génère une réponse personnalisée basée sur les vraies données
8. La réponse final s'affiche et se sauvegarde

**Avantages de cette approche** :
- ✅ Le chatbot utilise des **vraies données** (pas hallucination)
- ✅ Les aliments proposés sont **réels et vérifiés**
- ✅ **MCP = "Tools"** pour Ollama (augmente ses capacités)
- ✅ Pas de dépendance à une API cloud
- ✅ Scraping automatique à chaque demande

### 3️⃣ Scraping OpenFoodFacts

Le système scrape la base de données **OpenFoodFacts** pour récupérer :
- Nom de l'aliment
- Calories
- Protéines
- Glucides
- Lipides
- Fibres

**Caractéristiques** :
- Requêtes paginées (respect du serveur)
- Retry automatique en cas d'erreur
- Cache local pour ne pas re-scraper
- Délai entre requêtes (politesse)

### 4️⃣ Recherche d'aliments

- Base de données nutritionnelles complète (données scrapées)
- Recherche en temps réel
- Informations : calories, protéines, glucides, lipides

### 5️⃣ Interface fluide

- Navigation fluide entre sections
- **État persistant** : en cas de refresh, on retrouve où on était
- Design moderne avec Tailwind CSS

---

## 🏗️ Architecture

```
CLIENT (Navigateur)
     ↓
┌─────────────────────────────────────────┐
│         FRONTEND (React 18 + TypeScript)│
│  - ProfileForm, ChatInterface, Search   │  Port 5173
│  - localStorage (chat + profil)         │
└─────────────────────────────────────────┘
           REST API (JSON)
     ↓ ↓ ↓ CORS enabled
┌─────────────────────────────────────────────────────────────┐
│    BACKEND (FastAPI + Pydantic)                             │
│  - Calculs nutritionnels                                    │  Port 8000
│  - Validation stricte des données                           │
│  - **MCP (Model Context Protocol)**                         │
│    ├─ Tool: search_foods (Scraping OpenFoodFacts)           │
│    ├─ Tool: calculate_bmr                                   │
│    └─ Tool: estimate_macros                                 │
└─────────────────────────────────────────────────────────────┘
     ↓ ↓ (avec contexte tools)
     ↓ ↓ HTTP POST avec prompt + tools
┌─────────────────────────────────────────────────────────────┐
│      OLLAMA (IA Locale + MCP Intégration)                   │
│  - LLaMA 3 (Modèle open-source)         │  Port 11434       │
│  - Utilise les tools du MCP                                 │
│  - Appelle search_foods si besoin                           │
└─────────────────────────────────────────────────────────────┘
     ↑
     └── Scraping OpenFoodFacts (si besoin)
         └── Cache local (foods.json)
```

---

## 🔗 MCP (Model Context Protocol) - Expliqué

### Qu'est-ce que le MCP ?

Le **MCP** est un protocole qui donne au modèle IA accès à des **"outils"** (tools). Au lieu de générer du texte au hasard, Ollama peut :
- Appeler une fonction pour chercher des aliments réels
- Appeler une fonction pour calculer des macros
- Utiliser les données vraies pour répondre

### Flux avec MCP

```
Utilisateur: "Propose-moi un plan riche en protéines"
         ↓
Chat Backend reçoit la requête
         ↓
MCP ajoute les "tools" au prompt:
  - Tool 1: search_foods(query) → cherche aliments réels
  - Tool 2: calculate_bmr(profil) → calcul nutrition
  - Tool 3: estimate_macros(profil) → estimation
         ↓
Prompt complet envoyé à Ollama:
  "Tu es un expert nutrition. Tu as accès à ces tools:
   - search_foods(query): cherche des aliments réels
   - calculate_bmr(...): calcule le métabolisme
   
   Utilise ces tools pour répondre à: 'Propose-moi un plan...'
   Profil: {calories: 2200, poids: 75, objectif: 'prise'}"
         ↓
Ollama analyse la demande et voit qu'il faut chercher des aliments
         ↓
Ollama appelle: search_foods("aliments riches en protéines")
         ↓
MCP intercepte l'appel et exécute le scraping
         ↓
Résultat du scraping retourné à Ollama:
  [
    {"nom": "Poulet", "proteines": 31, "calories": 165},
    {"nom": "Œufs", "proteines": 13, "calories": 155},
    {"nom": "Steak", "proteines": 28, "calories": 250}
  ]
         ↓
Ollama utilise ces vraies données pour générer la réponse
         ↓
Réponse finale: "Voici un plan riche en protéines:
  - Petit-déj: 3 œufs (39g protéines)
  - Déjeuner: 200g poulet (62g protéines)
  - Dîner: 200g steak (56g protéines)"
         ↓
Frontend reçoit et affiche + sauvegarde dans localStorage
```

### Tools implémentés

| Tool | Fichier | Fonction |
|---|---|---|
| `search_foods(query)` | `backend/tools/search_foods.py` | Scrape OpenFoodFacts pour chercher des aliments |
| `calculate_bmr(profil)` | `backend/tools/calculate_bmr.py` | Calcule le métabolisme de base |
| `estimate_macros(profil)` | `backend/tools/estimate_macros.py` | Estime les macronutriments |

### Avantage du MCP vs approche simple

**Sans MCP** :
```
Utilisateur → ChatBot → "Je pense que les œufs ont 5g de protéines"
                        (Peut halluciner les données)
```

**Avec MCP** :
```
Utilisateur → ChatBot + MCP → search_foods("œufs") 
                            → Scrape OpenFoodFacts
                            → Reçoit vraies données (13g)
                            → Répond avec données réelles
```

---

## 🌐 Scraping OpenFoodFacts

### Qu'est-ce qu'on scrape ?

La base de données **OpenFoodFacts** contient des milliers d'aliments avec leurs infos nutritionnelles.

**Exemple de réponse API** :
```json
{
  "products": [
    {
      "id": "3017630051166",
      "product_name": "Poulet fermier",
      "nutriments": {
        "energy_kcal": 165,
        "proteins": 31,
        "carbohydrates": 0,
        "fat": 3.6
      }
    }
  ]
}
```

### Comment ça marche

1. **Backend scrape** (`backend/scraping/openfoodfacts_scraper.py`) :
   - Appels HTTP paginés à l'API OpenFoodFacts
   - Récupère produits + nutriments
   - Gère les erreurs + retry automatique

2. **Normalisation** (`backend/scraping/normalize.py`) :
   - Nettoie les données
   - Formatte les noms d'aliments
   - Standardise les unités

3. **Stockage local** (`backend/data/foods.json`) :
   - Cache local pour pas re-scraper
   - Accessible par le backend quand MCP appelle search_foods
   - Format JSON pour recherche rapide

### Code du scraper

```python
# backend/scraping/openfoodfacts_scraper.py
def fetch_products():
    all_products = []
    
    for page in range(1, MAX_PAGES + 1):
        params = {
            "search_simple": 1,
            "json": 1,
            "page_size": PAGE_SIZE,
            "page": page,
            "fields": "id,product_name,nutriments",
        }
        
        response = requests.get(API_URL, params=params, headers=HEADERS)
        products = response.json().get("products", [])
        all_products.extend(products)
        
        time.sleep(REQUEST_DELAY)  # Respecter le serveur
    
    return all_products
```

### Configuration du scraper

```python
# backend/scraping/config.py
API_URL = "https://world.openfoodfacts.org/api/v0/products"
PAGE_SIZE = 100
MAX_PAGES = 50  # ~ 5000 aliments
REQUEST_DELAY = 1  # 1 sec entre requêtes (politesse)
TIMEOUT = 10
MAX_RETRIES = 3
```

---

## 🛠️ Technologies utilisées

### Frontend : React + TypeScript + Vite

| Tech | Justification |
|---|---|
| React 18 | UI réactive, grande communauté |
| TypeScript | Typage statique = moins d'erreurs |
| Vite | Build ultra-rapide, HMR instantané |
| Tailwind CSS | Interface moderne rapidement |
| localStorage | Persistance client = chat sauvegardé |

### Backend : FastAPI + Python + MCP

| Tech | Justification |
|---|---|
| FastAPI | Framework moderne, très rapide |
| Pydantic | Validation stricte des données |
| Python 3.12 | Langage lisible, parfait pour logique métier |
| Uvicorn | Serveur ASGI haute perf |
| **MCP Tools** | **Permet au chatbot d'utiliser des outils réels** |
| **Scraping** | **OpenFoodFacts = données vraies pour IA** |

### IA : Ollama + LLaMA 3 + MCP

| Tech | Justification |
|---|---|
| Ollama | Serveur d'inférence local, simple |
| LLaMA 3 | Modèle open-source performant |
| **MCP Support** | **Intégration avec tools backend** |
| Pas d'API cloud | Données privées, aucun coût |

### Data : OpenFoodFacts + Cache local

| Tech | Justification |
|---|---|
| OpenFoodFacts | Base de données open-source la plus complète |
| Scraping | Récupération automatique des données |
| Cache local (foods.json) | Rapidité + pas de re-scraping |

---

## 🔄 Flux de l'application

### Scénario 1 : Calcul du profil

```
1. Utilisateur remplit le formulaire
2. Frontend valide (React)
3. POST /nutrition/profile (JSON)
4. Backend valide (Pydantic)
5. Backend calcule BMR, calories, protéines
6. Retour JSON au frontend
7. Frontend affiche résultats
8. État sauvegardé dans localStorage
```

### Scénario 2 : Chat avec IA + MCP + Scraping

```
1. Utilisateur écrit "Propose-moi un plan riche en protéines"
2. Frontend envoie : message + profil
3. POST /chat/message
4. Backend reçoit la requête
5. MCP prépare le contexte complet :
   - Instructions système (rôle du chatbot)
   - Tools disponibles (search_foods, calculate_bmr, estimate_macros)
   - Infos utilisateur (calories, objectif, poids)
   - La question
6. Prompt envoyé à Ollama avec contexte tools
7. Ollama analyse la demande
8. Ollama décide d'utiliser search_foods pour chercher des aliments réels
9. Ollama appelle : search_foods("aliments riches en protéines")
10. MCP intercepte l'appel et :
    a. Accède au cache local (foods.json)
    b. Filtre les aliments riches en protéines
    c. Retourne les données structurées
11. Ollama reçoit vraies données (pas hallucination !)
12. Ollama génère une réponse basée sur les vraies données
13. Réponse retour au frontend
14. Frontend affiche + sauvegarde dans localStorage
```
1. Utilisateur écrit "Propose-moi un plan de repas"
2. Frontend envoie : message + profil
3. POST /chat/message
4. Backend crée prompt context :
   - Instructions système (rôle chatbot)
   - Infos utilisateur (calories, objectif)
   - Question de l'utilisateur
5. Backend envoie à Ollama (HTTP)
6. Ollama (LLaMA 3) génère la réponse
7. Réponse retour au frontend
8. Frontend affiche + sauvegarde dans localStorage
```

### Scénario 3 : Persistance (Refresh)

```
1. Utilisateur charge la page (F5)
2. useEffect charge depuis localStorage
3. État React restauré
4. Utilisateur voit exactement où il était
   (pas besoin de recalculer le profil)
```

---

## 📦 Installation et démarrage

### Prérequis

- **Node.js 18+** & npm
- **Python 3.12+** & pip
- **Ollama** (https://ollama.ai)

### Étapes

1. **Cloner**
```bash
git clone <url>
cd nutri_scraping
```

2. **Ollama**
```bash
ollama pull llama3
ollama list
```

3. **Frontend**
```bash
npm install
```

4. **Backend**
```bash
cd backend
python -m venv venv
venv\Scripts\Activate.ps1  # Windows
pip install -r requirements.txt
```

5. **Démarrer (3 terminaux)**

Terminal 1 - Ollama:
```bash
ollama serve
```

Terminal 2 - Backend:
```bash
cd backend
venv\Scripts\Activate.ps1
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Terminal 3 - Frontend:
```bash
npm run dev
```

### Accès

- App: http://localhost:5173
- API: http://localhost:8000
- Docs API: http://localhost:8000/docs

---

## 📁 Structure du projet

```
nutri_scraping/
│
├── src/ (Frontend React)
│   ├── components/
│   │   ├── ProfileForm.tsx         # Formulaire profil
│   │   ├── NutritionResults.tsx    # Résultats
│   │   ├── ChatInterface.tsx       # Chat + localStorage
│   │   └── FoodSearch.tsx          # Recherche
│   ├── services/
│   │   └── api.ts                  # Client HTTP
│   ├── App.tsx                     # Routeur + persistance état
│   └── main.tsx                    # Point d'entrée
│
├── backend/ (FastAPI)
│   ├── api/
│   │   ├── nutrition.py            # Endpoint calculs
│   │   ├── chat.py                 # Endpoint chat
│   │   └── foods.py                # Endpoint aliments
│   ├── service/
│   │   ├── nutrition_service.py    # BMR, calories
│   │   ├── chat_service.py         # Chat + Ollama
│   │   └── food_service.py         # Recherche
│   ├── schemas/ (Pydantic)
│   │   ├── nutrition.py
│   │   ├── chat.py
│   │   └── food.py
│   ├── config/
│   │   └── ollama.py               # Config Ollama
│   ├── main.py                     # FastAPI app
│   └── requirements.txt
│
└── README.md
```

---

## 💡 Points techniques importants

### 1. Validation des données (Pydantic)

```python
class NutritionProfile(BaseModel):
    taille: int
    poids: int
    age: int
    sexe: Literal["homme", "femme"]
    objectif: Literal["perte", "maintien", "prise"]
```

**Avantage** : FastAPI rejette automatiquement les données invalides.

### 2. État côté client vs serveur

| Données | Lieu | Raison |
|---|---|---|
| Chat | localStorage | Rapide, persistant |
| Profil | React + localStorage | Offline, restore on refresh |
| Vue | React + localStorage | Retrouver où on était |
| Aliments | Backend | Données partagées |

### 3. Communication Frontend-Backend

```typescript
// Frontend
fetch("/nutrition/profile", {
  method: "POST",
  body: JSON.stringify(profile)
}).then(r => r.json())

// Backend
@router.post("/profile")
def calculate(profile: NutritionProfile):
    return {...}
```

### 4. Intégration Ollama

Le backend = relai HTTP sécurisé :

```
Frontend
   ↓ (POST /chat)
Backend
   ↓ (HTTP POST Ollama:11434)
Ollama (LLaMA 3)
   ↓
Backend
   ↓
Frontend
```

### 5. Protection injections prompt

```python
# Vérifier mots-clés suspects
if any(kw in message.lower() for kw in 
       ["ignore", "bypass", "jailbreak"]):
    return {"error": "Injection détectée"}

# Limiter longueur
if len(message) > 500:
    message = message[:500]
```

### 6. Typage fort

**TypeScript frontend** + **Pydantic backend** = erreurs détectées tôt, pas à l'exécution.

### 7. Persistance localStorage

```typescript
// Sauvegarde
useEffect(() => {
  saveAppState(currentView, profile, results);
}, [currentView, profile, results]);

// Restauration
useEffect(() => {
  const saved = loadAppState();
  if (saved) setCurrentView(saved.view);
}, []);
```

---

## 🔍 Commandes utiles

```bash
# Frontend
npm run dev          # Démarrage
npm run build        # Build prod
npm run lint         # Linter

# Backend
uvicorn main:app --reload

# Ollama
ollama serve
ollama list
ollama pull llama3
```

---