# Scraping OpenFoodFacts — NutriAI

## Source
Les données proviennent de l'API officielle OpenFoodFacts :
https://world.openfoodfacts.org/data

## Méthode
- Utilisation exclusive de l'API publique
- Pas de scraping HTML
- User-Agent explicite
- Fréquence limitée (1 requête / seconde)
- Données publiques uniquement

## Utilisation
Le scraping est effectué via des scripts ponctuels.
Il ne doit PAS être exécuté en production.

Commande :
python run_scraping.py

## Licence
Les données OpenFoodFacts sont sous licence ODbL.
Toute réutilisation doit mentionner la source.
