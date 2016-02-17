# STPVideoPlayer
Projet ANGULARJS - TypeScript - MongoDb pour la diffusion depuis un fichier timeline de flux vidéo. dans la version actuelle il supporte uniquement la version HTML 5 et Youtube.
1.	Présentation du Projet
Le projet Serveur de vidéo a pour objectif de permettre la mise en place d’une chaîne de diffusion vidéo contrôlé à travers d’un flux XML.
2.	Définition et terminologie
TimeLine : Un timeline est une programmation d’une vidéo. Tous les timelines sont paramétrés dans un fichier XML appelé MyTvLine.xml
Type de vidéo : Il existe différent type de vidéo
Le type Local qui permet d’afficher via le contrôle HTML 5 / Vidéo une vidéo en local, on peut définir des paramètres d’optimisation et de format différent ainsi qu’un poster fournit par le contrôle HMTL 5 Vidéo
Le type série : Voir série
Le type youtube : voir youtube
Générique
Il peut arriver que le timeline ne trouve aucune vidéo, alors une vidéo par défaut appelée générique est affichée
Série
Une série est un regroupement de vidéos. Les séries sont définies dans le fichier XML MySeries.xml
Chaque vidéo peut être de type local ou youtube
