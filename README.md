# Carnation

Voir un vêtement sur la couleur de peau de son choix. Carnation recolore uniquement la peau du mannequin sur une photo de site marchand ; les pixels du vêtement restent identiques à la photo d'origine.

- Tout le traitement se fait sur le téléphone : aucune photo n'est envoyée à un serveur.
- Application web installable (PWA). Sur Android, une fois installée depuis Chrome, Carnation apparaît dans le menu **Partager** des images.
- Couleur cible : échelle Monk (10 tons) ou votre propre couleur de peau, prise sur une de vos photos.

## Fonctionnement

1. **Segmentation** : le modèle *MediaPipe Selfie Multiclass* classe chaque pixel (fond, cheveux, peau du corps, peau du visage, vêtements, autres).
2. **Couleur de référence** : moyenne de la peau bien éclairée (entre les 50e et 90e centiles de luminance).
3. **Recoloration** : en lumière linéaire, chaque pixel de peau est multiplié par le rapport couleur cible / couleur de référence, ce qui conserve ombres et reliefs.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | L'application (HTML, CSS et JavaScript) |
| `sw.js` | Service worker : fonctionnement hors ligne et réception des images partagées |
| `manifest.webmanifest` | Installation et déclaration dans le menu Partager |
| `lib/` | MediaPipe Tasks Vision 1.0.1 |
| `models/` | Modèle de segmentation, en deux parties encodées en base64 |

## Crédits et licences

- MediaPipe Tasks Vision et modèle Selfie Multiclass : Google, licence Apache 2.0.
- Échelle Monk (Monk Skin Tone Scale) : Ellis Monk et Google, CC BY 4.0.
- Photo d'exemple : « Model in green dress », Sherry Zhang, CC BY 2.0 ([Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Model_in_green_dress.jpg)).
