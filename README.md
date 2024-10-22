<p align="center">
  <img src="/docs/rendu/logo.png">
</p>

# ProjetWeb_AP5 (TOPPICS)
Projet WEB réalisé pour la dernière période de l'ISEN en AP5.  <br/>
Réalisé par l'équipe suivante : <br/>
CANTA Carmelo - DEHONDT Léo - REYES Adam

## Description du projet
Notre projet démarre d’une constatation simple : de nos jours, il est difficile de se faire sa place sur les réseaux sociaux lorsque l’on souhaite partager du contenu qualitatif. La concurrence étant rude, notre travail n’apparaît malheureusement pas au grand public sauf si nous arrivons à nous faire tirer vers le haut par les plus connus.

Nous avons donc décidé de casser ce code, en mettant en place un réseau social de partage d’images dont le but principal serait de voter pour les meilleures images de la semaine précédente, réparties par catégorie, à travers un jeu affichant des images aléatoirement tirées. Ainsi si votre travail est de qualité, les utilisateurs voteront pour vous sans même vous connaître !

Le nom “Toppics” est l’association de “Top” et “Pics”, en soit “meilleures photos”, ce qui reprend les grandes lignes de notre concept.

## Partie technique
### FRONT
Rendez-vous dans le dossier front et lancez les commandes suivantes : 

* Installation des dépendances -> `npm install`
* Création du build de PRODUCTION -> `npm run build`
* Lancement du projet -> `npm install -g serve ; serve -s build`

Le front se lancera à l'adresse suivante :  <br/>
* ` localhost:5000`

Pour vous connecter à un compte administrateur veuillez utiliser les identifiants présents dans le mail reçu le 14/03 avec comme objet : <br/>
"Rendu PROJET WEB Equipe TOPPICS - CANTA - DEHONDT - REYES"

### BACK
Rendez-vous dans le dossier back et lancez les commandes suivantes : 

* Installation des dépendances -> `npm install`
* Lancement du projet -> `npm run start`

Le serveur se lancera à l'adresse suivante :  <br/>

* ` localhost:4242`  <br/>
Un swagger est également disponible à l'adresse suivante :  <br/>
* ` localhost:4242/swagger`
 
#### Lancement en mode DEV :
Lancement du projet en mode développeur -> `npm run start:dev`

### BDD

Notre base de données est une base de données NoSQL hébergée sur MongoDB Atlas. <br/>
Si vous souhaitez vous connecter à notre base vous retrouverez les informations dans le mail reçu le 14/03 avec comme objet : <br/>
"Rendu PROJET WEB Equipe TOPPICS - CANTA - DEHONDT - REYES"

### Librairies utilisées :

Voici les différentes librairies que nous avons décidé de rajouter pour nous simplifier la vie :
* Librairie exif nous permettant de récupérer les exifs d'une image. -> https://www.npmjs.com/package/exif
* Eslint nous permettant d'avoir un code de meilleur qualité -> https://eslint.org/
* Axios nous permettant de faire des requêtes HTTP -> https://www.npmjs.com/package/axios

## Partie organisation

Nous avons décidé d'utiliser Trello pour créer un Kanban partagé. <br/>
Voici le lien -> https://trello.com/b/HsFH5YQC/toppics

Vous trouverez les différents rendues contenant les informations sur notre application dans le dossier docs.
