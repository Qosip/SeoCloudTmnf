import { Link, useParams, Outlet } from 'react-router-dom'
import {
    BookOpen, Terminal, Zap, Search, ChevronRight,
    Play, Settings, AlertCircle, Map
} from 'lucide-react'
import JsonLd from '../components/JsonLd'
import SEO from '../components/SEO'

/* ─── Data ──────────────────────────────────────────────────────────────── */
const CATEGORIES = [
    { id: 'getting-started', label: 'Prise en main', icon: Play, desc: 'Lancez votre premier serveur TMNF en quelques clics.' },
    { id: 'configuration', label: 'Configuration', icon: Settings, desc: 'Personnalisez le dedicated_cfg.txt, nom du serveur, mots de passe.' },
    { id: 'rcon-console', label: 'Console RCON', icon: Terminal, desc: 'Maîtrisez les commandes pour gérer votre serveur en temps réel.' },
    { id: 'xaseco-plugins', label: 'XAseco & Plugins', icon: Zap, desc: 'Installez des records locaux, Dedimania, et configurez ManiaLive.' },
    { id: 'maps-management', label: 'Gestion des Maps', icon: Map, desc: 'Uploadez vos circuits, gérez la rotation et les campagnes.' },
    { id: 'troubleshooting', label: 'Résolution de problèmes', icon: AlertCircle, desc: 'Solutions aux erreurs courantes (ports fermés, serveur invisible).' },
]

const ARTICLES = {
    'getting-started': [
        {
            slug: 'create-first-server',
            title: 'Créer votre premier serveur',
            time: '3 min',
            desc: "Découvrez comment lancer un serveur TrackMania Nations Forever et vous y connecter pour la première fois.",
            content: `
# Créer votre premier serveur TMNF

Bienvenue sur TrackHost ! Héberger un serveur TrackMania Nations Forever n'a jamais été aussi simple. Oubliez la location de VPS, les installations Linux fastidieuses et les configurations de pare-feu : nous automatisons tout le processus technique.

## 1. Choisissez votre plan
Rendez-vous sur la page **Tarifs**, et sélectionnez le plan qui correspond à vos besoins.
- Le plan **Starter** est idéal pour jouer en privé avec des amis.
- Le plan **Pro** est recommandé pour une communauté naissante, car il inclut XAseco préconfiguré (indispensable pour les records locaux).

## 2. Configurez le serveur lors de la commande
Lors de la commande, plusieurs paramètres vous seront demandés :
> [!NOTE]
> Ne vous inquiétez pas, vous pourrez modifier ces paramètres à tout moment depuis votre Dashboard.

- **Nom du serveur :** C'est le nom public qui s'affichera dans le navigateur de serveurs du jeu. Gardez-le concis.
- **Mot de passe :** Laissez le champ vide si vous souhaitez un serveur ouvert à tous (public). Pour un serveur privé, entrez un mot de passe ; les joueurs devront le saisir pour se connecter.
- **Région :** Sélectionnez la région la plus proche de vous et de vos joueurs pour obtenir le meilleur ping.

## 3. Déploiement
Une fois le paiement validé, la magie opère. TrackHost va instantanément :
1. Provisionner un conteneur Pterodactyl isolé avec des ressources dédiées.
2. Télécharger les derniers binaires du serveur TrackMania Dedicated.
3. Générer automatiquement votre fichier \`dedicated_cfg.txt\` sécurisé.
4. Ouvrir les ports réseaux nécessaires (2350 TCP/UDP, 3450 TCP/UDP).

> [!TIP]
> Le déploiement prend en moyenne **moins de 45 secondes**. Vous pouvez suivre l'évolution en temps réel sur la page Confirmation.

## 4. Première connexion en jeu
Lancez *TrackMania Nations Forever* sur votre PC. 
- Pour un serveur **public** : Allez dans "Jeu en ligne", sélectionnez le bon pays/région, puis cherchez le nom de votre serveur. Attention, cela peut prendre 1 à 5 minutes pour que Nadeo actualise la liste globale.
- Pour une connexion **directe (rapide)** : Depuis le menu principal, ouvrez la barre d'adresse réseau (en haut) ou utilisez l'option de connexion directe, puis entrez *l'Adresse IP et le Port* affichés sur votre Dashboard TrackHost.

Félicitations, vous êtes en ligne !`
        },
        {
            slug: 'understanding-dashboard',
            title: 'Comprendre le Dashboard',
            time: '5 min',
            desc: "Un tour d'horizon complet des métriques et contrôles disponibles sur votre panneau d'administration.",
            content: `
# Maîtriser le Dashboard TrackHost

Le Dashboard est le centre de commande de votre serveur TMNF. Nous avons conçu une interface épurée pour que vous ayez accès aux informations essentielles en un coup d'œil.

## Statistiques en Temps Réel
En haut du dashboard, vous trouverez 4 indicateurs vitaux actualisés toutes les 2 secondes :
- **Joueurs / Slots :** Le taux de remplissage effectif du serveur.
- **Utilisation CPU :** Exprimée en pourcentage. TMNF est un processus mono-thread par conception. Si cette valeur s'approche constamment des 100%, votre serveur pourrait subir du lag "tickrate".
- **Utilisation RAM :** La mémoire vive consommée. Le jeu de base avec peu de joueurs consomme environ 150-250MB. Si vous utilisez XAseco ou installez beaucoup de plugins lourds, cette valeur montera.
- **Ping moyen :** Une photographie globale de la latence de l'ensemble des joueurs actuellement connectés. 

> [!IMPORTANT]
> Si le ping moyen dépasse régulièrement les 120ms, demandez à vos joueurs leur localisation. Vous pourriez avoir besoin de migrer votre serveur vers une région plus centrale (ex: de Frankfurt vers Paris).

## Graphe d'Historique
Le graphique principal trace l'historique des ressources sur les dernières 20 minutes. C'est l'outil parfait pour mener l'enquête post-crash. Si un pic de RAM coïncide avec un redémarrage impromptu, c'est probablement lié à un plugin de map défectueux qui cause une fuite de mémoire (memory leak).

## Actions Rapides
- **Démarrer / Arrêter / Redémarrer :** Ces boutons contrôlent le processus système brut.
- **Log XAseco :** Si vous avez souscrit au plan Pro ou Elite, ce bouton affiche en direct la console du gestionnaire de records XAseco, séparément de la console du serveur de jeu principal.

## Console Terminal intégrée
Tout en bas du dashboard, un mini-terminal réplique l'onglet "Console RCON". Il vous permet de taper une commande d'urgence (ex: \`/kick <pseudo>\`) sans quitter la page de monitoring.`
        }
    ],
    'configuration': [
        {
            slug: 'dedicated-cfg',
            title: 'Le fichier dedicated_cfg.txt',
            time: '8 min',
            desc: "Tout savoir sur le cœur de la configuration du serveur dédié TrackMania.",
            content: `
# Guide : dedicated_cfg.txt

Le fichier \`dedicated_cfg.txt\` est le fichier de configuration maître de votre serveur. Sur TrackHost, il est initialement généré pour vous automatiquement, mais vous pouvez l'éditer en profondeur.

## Accéder au fichier
Pour modifier ce fichier :
1. Allez sur votre Dashboard.
2. Cliquez sur l'onglet **Paramètres** puis **[Fichiers Bruts]**.
3. Naviguez vers \`GameData/Config/dedicated_cfg.txt\`.

## Paramètres Fondamentaux

### Login et Mot de Passe Serveur
\`\`\`xml
<system_config>
    <connection_uploadrate>512</connection_uploadrate>
    <connection_downloadrate>8192</connection_downloadrate>
    
    <server_login>MON_LOGIN_SERVEUR</server_login>
    <server_password>MON_MOT_DE_PASSE_SERVEUR</server_password>
</system_config>
\`\`\`
> [!WARNING]
> \`server_login\` et \`server_password\` ne sont **pas** les identifiants d'accès pour les joueurs (le mot de passe du serveur). Ce sont les identifiants du compte maître Nadeo qui relient ce serveur dédié à leur MasterServer. Si vous utilisez les comptes fournis par TrackHost par défaut, **ne les touchez jamais**, sinon votre serveur perdra la capacité de se connecter au réseau global.

### Paramètres de Jeu

\`\`\`xml
<server_options>
    <name>Mon Super Serveur</name>
    <comment>Serveur fun, maps -50 sec</comment>
    
    <max_players>16</max_players>
    <password>secret123</password> <!-- Mot de passe pour les joueurs -->
    
    <max_spectators>32</max_spectators>
    <password_spectator></password_spectator>
    
    <!-- Protection contre le spam -->
    <enable_p2p_upload>False</enable_p2p_upload>
    <enable_p2p_download>False</enable_p2p_download>
</server_options>
\`\`\`

### Mode de Jeu et Paramètres par défaut
\`\`\`xml
<match_settings>
  <game_mode>1</game_mode> 
  <!-- Mode : 0=Script, 1=TimeAttack, 2=Rounds, 3=Team, 4=Laps, 5=Cup, 6=Stunts -->
  <time_attack_limit>300000</time_attack_limit> <!-- Durée de la map en MS (300000 = 5 minutes) -->
</match_settings>
\`\`\`

> [!TIP]
> Si vous souhaitez modifier la durée des maps en TimeAttack sans redémarrer le serveur, vous pouvez le faire via la console RCON avec une commande spécifique à XAseco, ou depuis le dashboard TrackHost directement.`
        }
    ],
    'rcon-console': [
        {
            slug: 'rcon-commands',
            title: 'Liste des commandes RCON',
            time: '4 min',
            desc: "Toutes les commandes pour administrer votre serveur depuis l'interface TrackHost.",
            content: `
# Commandes RCON TrackHost

L'onglet **Console RCON** vous donne un accès direct au cœur du Dedicated Server. Voici la liste des commandes natives supportées par l'interface TrackHost.

> [!NOTE]
> Nous avons simplifié la syntaxe classique XML-RPC pour que vous n'ayez qu'à taper des commandes lisibles comme dans une invite de commande normale.

## Gestion des Joueurs
* \`GetPlayerList\` : Affiche la liste complète des joueurs connectés avec leurs slots et pings.
* \`/kick <pseudo>\` : Expulse un joueur immédiatement.
* \`/ban <pseudo>\` : Banni l'IP et le login du joueur.
* \`/unban <pseudo>\` : Retire un joueur de la blacklist.
* \`GetBanList\` : Affiche tous les joueurs bannis.
* \`/forcespec <pseudo>\` : Exclut un joueur de la course et le force en mode spectateur (pratique pour régler les conflits).

## Gestion de la Session Serveur
* \`RestartMap\` : Relance instantanément la map actuelle avec remise à zéro des chronos de session.
* \`NextMap\` : Force le passage à la carte suivante dans la rotation actuelle.
* \`PrevMap\` : Retourne à la carte précédente.
* \`SetMaxPlayers <nombre>\` : Change à la volée la limite maximale de joueurs. Pratique lors d'événements.

## Paramètres du Serveur
* \`SetServerPassword <mot de passe>\` : Définit un mot de passe d'accès au serveur.
* \`SetServerPassword\` ou \`ClearPassword\` : Rend le serveur entièrement public.
* \`GetServerInfo\` : Renvoie l'uptime, les ports, la mémoire consommée, etc.
* \`GetCurrentMapInfo\` : Renvoie les détails de la map actuelle (Auteur, Temps or, Nom).

## Chat et Interaction
* \`/say <message>\` (ou \`chatmessage <message>\`) : Envoie un texte formaté en tant que "Serveur" dans le chat général de la partie.
`
        }
    ],
    'xaseco-plugins': [
        {
            slug: 'installing-xaseco',
            title: 'Guide XAseco & Dedimania',
            time: '12 min',
            desc: "Configuration du gestionnaire de records incontournable pour les serveurs publics TMNF.",
            content: `
# XAseco et Records Locaux

**XAseco** est le système de plugins le plus populaire de TrackMania. C'est ce logiciel qui gère l'affichage en jeu de la fenêtre des records locaux sur le côté de l'écran, le système de Karma (notes +/- sur une map) et le système /donate.

> Si vous êtes sur un plan **Pro** ou **Elite**, XAseco est pré-installé et pré-configuré avec Dedimania.

## Composants de XAseco
XAseco tourne "à côté" du Dedicated Server. Il s'y connecte via le port XML-RPC local.
Il nécessite également une base de données MySQL pour stocker :
- Les profils des joueurs qui se connectent.
- Les chronos réalisés (Local Records).
- Le Karma des maps.

Chez TrackHost, chaque plan incluant XAseco s'accompagne d'une base de données MySQL tierce invisible que nous maintenons pour vous.

## Activer/Désactiver des Plugins
Par défaut chez TrackHost, nous fournissons la distribution \`RASCO\` (version moderne et bug-free de XAseco).
Le fichier de configuration principal est \`plugins.xml\`. 

Vous pouvez l'éditer depuis l'onglet **Paramètres -> Fichiers Bruts**.

\`\`\`xml
<xa_plugins>
    <plugin>plugin.localdatabase.php</plugin>
    <plugin>plugin.muting.php</plugin>
    <plugin>plugin.admin_ops.php</plugin>
    
    <!-- Décommentez pour activer Dedimania -->
    <plugin>plugin.dedimania.php</plugin>
</xa_plugins>
\`\`\`

> [!CAUTION]
> Une erreur de syntaxe XML dans ce fichier empêchera complètement XAseco de démarrer, ce qui causera l'absence totale d'informations en jeu.

## Dedimania
Dedimania est le registre global des records du monde. Il permet à vos joueurs de battre des recors "World" même si c'est la première fois qu'ils rejoignent votre serveur.

Pour que Dedimania fonctionne avec XAseco, vous devez générer un token serveur TrackMania (nous le faisons souvent automatiquement pour les nouveaux clients). Vous ne pouvez pas avoir Dedimania actif si le \`server_login\` (cf chapitre *dedicated_cfg.txt*) n'est pas autorisé auprès des serveurs Nadeo.
`
        }
    ],
    'maps-management': [
        {
            slug: 'upload-maps',
            title: 'Uploader et gérer les maps',
            time: '6 min',
            desc: "Comment ajouter vos circuits personnalisés, gérer la rotation des maps et organiser vos campagnes.",
            content: `
# Gestion des Maps TrackMania

L'onglet **Maps & Plugins** de votre Dashboard TrackHost vous permet d'uploader, organiser et contrôler les circuits de votre serveur sans jamais toucher à un fichier via FTP.

## Upload de maps
1. Depuis votre Dashboard, ouvrez l'onglet **Maps & Plugins**.
2. Cliquez sur **Upload** ou glissez-déposez vos fichiers \`.Map.Gbx\` dans la zone prévue.
3. Les maps sont automatiquement copiées dans \`GameData/Maps/\` sur le serveur.

> [!NOTE]
> Format accepté : \`.Map.Gbx\` (TrackMania Nations Forever). Les maps en \`.Replay.Gbx\` ne sont pas des circuits et ne fonctionneront pas.

## Rotation des maps
La rotation définit l'ordre dans lequel les maps sont jouées. Vous pouvez :
- **Réordonner** : Glissez les maps pour changer l'ordre.
- **Activer/Désactiver** : Désactivez une map pour la retirer temporairement de la rotation sans la supprimer.
- **Mode Campagne** : Groupez des maps en "campagne" pour un enchaînement thématique.

## Dossier GameData
La structure recommandée sur le serveur :
\`\`\`
GameData/
  Maps/           <- Vos circuits (.Map.Gbx)
  Scripts/        <- Scripts de jeu (si mode Custom)
  Config/         <- dedicated_cfg.txt, etc.
\`\`\`

> [!TIP]
> Après un upload ou une modification de rotation, redémarrez le serveur ou utilisez \`RestartMap\` en RCON pour appliquer les changements immédiatement.
            `
        },
        {
            slug: 'map-settings',
            title: 'Paramètres des maps (TimeAttack)',
            time: '4 min',
            desc: "Configurer la durée des maps, le nombre de tours et les options de validation.",
            content: `
# Paramètres des maps en TimeAttack

En mode TimeAttack (le plus courant sur TMNF), plusieurs paramètres influencent le comportement de chaque map.

## Durée de la map
La durée maximale qu'un joueur peut passer sur une map avant d'être éjecté ou forcé en spectateur. Configurable dans \`dedicated_cfg.txt\` :

\`\`\`xml
<time_attack_limit>300000</time_attack_limit>
\`\`\`
Valeur en millisecondes. 300000 = 5 minutes.

## Validation
- **Validation obligatoire** : Le joueur doit finir la map au moins une fois pour ne pas être éjecté.
- **Mode Sandbox** : Tout le monde peut rester sans valider (pratique pour les entraînements).

Ces options se gèrent via le fichier de configuration ou des plugins XAseco selon votre setup.
            `
        }
    ],
    'troubleshooting': [
        {
            slug: 'server-not-visible',
            title: 'Serveur invisible dans la liste du jeu',
            time: '2 min',
            desc: "Que faire si les joueurs ne trouvent pas votre serveur de jeu.",
            content: `
# Mon serveur n'apparaît pas dans le jeu

C'est LE problème le plus fréquent pour les nouveaux administrateurs. Voici la marche à suivre pour le résoudre.

## 1. Patience (Cache Nadeo)
Les MasterServers de Nadeo mettent un certain temps à propager les informations des nouveaux serveurs aux clients de jeu. C'est normal.
- **Délai typique** : 2 à 5 minutes.
- Parfois, si les serveurs Nadeo (Ubisoft) ont des ralentissements, cela peut prendre 10 minutes.

## 2. Vérifiez HideServer
Dans votre \`dedicated_cfg.txt\`, il y a une ligne de configuration :
\`<hide_server>0</hide_server>\`

Assurez-vous qu'elle est à \`0\`. Si elle est à \`1\`, votre serveur refusera de s'enregistrer auprès de Nadeo.

## 3. Filtrage Pays / Zone
Si votre serveur est configuré (via le dashboard TrackHost) pour la zone \`FRA\`, il n'apparaîtra **que** dans le menu "France" du jeu. Et inversement.
Ne cherchez pas votre serveur dans la liste Mondiale Globale, Nadeo limite l'affichage aux serveurs les plus populaires. Cherchez toujours dans le répertoire correspondant à la région spécifique de votre hébergement TrackHost.

## 4. Recommandation : Favoris
Une fois que vous et vos amis avez pu vous connecter au serveur (potentiellement par adresse IP directe via la barre d'adresse en haut du jeu la première fois), **ajoutez-le immédiatement aux Favoris en jeu**.
Vous n'aurez plus jamais à subir les lenteurs du MasterServer de Nadeo.
            `
        },
        {
            slug: 'high-ping-lag',
            title: 'Ping élevé et lag serveur',
            time: '5 min',
            desc: "Diagnostiquer et réduire la latence sur votre serveur TMNF.",
            content: `
# Ping élevé et lag sur le serveur

Un ping élevé ou des saccades peuvent venir de plusieurs sources. Voici comment les identifier et les corriger.

## 1. Vérifier la région du serveur
TrackHost propose plusieurs régions (Paris, Frankfurt, Amsterdam...). Si vos joueurs sont majoritairement en France et que le serveur est à Amsterdam, le ping sera plus élevé. Consultez les options de migration dans votre Dashboard.

## 2. Charge CPU / RAM
Si le CPU ou la RAM sont saturés, le serveur peut "laguer". Vérifiez les graphiques du Dashboard :
- CPU > 90% en continu : risque de tickrate instable
- RAM proche de la limite : risque de crash ou ralentissements

> [!TIP]
> Réduisez le nombre de slots ou désactivez des plugins lourds si les ressources sont limitées.

## 3. Connexion joueur
Le ping affiché dépend aussi de la connexion du joueur. Un joueur en 4G ou sur un réseau congestionné aura un mauvais ping même avec un serveur optimal. Invitez-le à tester depuis une connexion filaire.

## 4. DDoS / Saturation
En cas d'attaque ou de trafic anormal, contactez le support TrackHost. Nous disposons de protections anti-DDoS.
            `
        }
    ]
}

/* ─── Layout ─────────────────────────────────────────────────────────────── */
export function DocsHub() {
    return (
        <div className="docs-hub">
            <SEO 
                title="Documentation Technique" 
                description="Consultez notre documentation complète pour configurer et optimiser votre serveur TrackMania Nations Forever. Guides RCON, XAseco et configuration avancée."
            />
            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": "Documentation TrackHost",
                "description": "Tout ce qu'il faut savoir pour configurer, administrer et comprendre l'écosystème TrackMania Dedicated Server.",
                "mainEntity": {
                    "@type": "ItemList",
                    "itemListElement": CATEGORIES.map((cat, i) => ({
                        "@type": "ListItem",
                        "position": i + 1,
                        "name": cat.label,
                        "description": cat.desc
                    }))
                }
            }} />
            <header className="docs-hub-header">
                <div className="badge badge-cyan" style={{ marginBottom: 16 }}><BookOpen size={10} style={{ marginRight: 4 }} /> Docs & Manuels</div>
                <h1 className="docs-hub-title">Documentation TrackHost</h1>
                <p className="docs-hub-subtitle">
                    Tout ce qu'il faut savoir pour configurer, administrer et comprendre l'écosystème TrackMania Dedicated Server.
                </p>
                <div className="docs-search-wrap" style={{ position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-low)' }} />
                    <input className="input" placeholder="Rechercher 'Dedimania', 'commandes', 'XAseco'…" />
                </div>
            </header>

            <div className="docs-categories-grid">
                {CATEGORIES.map(cat => {
                    const articles = ARTICLES[cat.id as keyof typeof ARTICLES] || []
                    const Icon = cat.icon
                    return (
                        <div key={cat.id} className="docs-category-card">
                            <div className="docs-category-icon"><Icon size={24} style={{ color: 'var(--cyan)' }} /></div>
                            <h2 className="docs-category-title">{cat.label}</h2>
                            <p className="docs-category-desc">{cat.desc}</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {articles.map(art => (
                                    <Link key={art.slug} to={`/docs/${art.slug}`} className="docs-article-link">
                                        <span>{art.title}</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <span className="article-time">{art.time}</span>
                                            <ChevronRight size={16} style={{ color: 'var(--text-low)' }} />
                                        </div>
                                    </Link>
                                ))}
                                {articles.length === 0 && (
                                    <span style={{ fontSize: 13, color: 'var(--text-ghost)' }}>Bientôt disponible</span>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export function ArticleView() {
    const { slug } = useParams()

    // Find article across all categories
    let article = null
    for (const cat of Object.values(ARTICLES)) {
        const found = cat.find(a => a.slug === slug)
        if (found) {
            article = found
            break
        }
    }

    if (!article) return <div style={{ padding: 64, textAlign: 'center', color: 'var(--text-mid)' }}>Article non trouvé.</div>

    return (
        <div style={{ display: 'flex', gap: 48, maxWidth: 1200, margin: '0 auto', padding: '0 24px 48px' }}>
            <SEO 
                title={article.title} 
                description={article.desc}
            />
            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "TechArticle",
                "headline": article.title,
                "description": article.desc,
                "articleBody": article.content,
                "author": {
                    "@type": "Organization",
                    "name": "TrackHost"
                }
            }} />
            <aside className="docs-article-sidebar">
                <Link to="/docs" className="btn btn-ghost sidebar-back" style={{ fontSize: 13 }}>
                    <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} /> Retour
                </Link>
                {CATEGORIES.map(cat => (
                    <div key={cat.id} style={{ marginBottom: 24 }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--text-low)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                            {cat.label}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {ARTICLES[cat.id as keyof typeof ARTICLES]?.map(a => (
                                <Link key={a.slug} to={`/docs/${a.slug}`} style={{ fontSize: 13, textDecoration: 'none', padding: '8px 12px', borderRadius: 8, color: a.slug === slug ? 'var(--cyan)' : 'var(--text-mid)', background: a.slug === slug ? 'var(--cyan-dim)' : 'transparent', transition: 'all 200ms', fontWeight: a.slug === slug ? 600 : 400 }}>
                                    {a.title}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </aside>

            <article className="docs-article-content">
                <div style={{ marginBottom: 32 }}>
                    <div className="badge badge-gray" style={{ marginBottom: 16 }}><BookOpen size={10} style={{ marginRight: 4, color: 'var(--cyan)' }} /> Documentation</div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 700, color: 'var(--text-high)', letterSpacing: '0.01em', marginBottom: 12 }}>{article.title}</h1>
                    <p style={{ fontSize: 15, color: 'var(--text-mid)', lineHeight: 1.6 }}>{article.desc}</p>
                </div>

                <div className="divider" style={{ margin: '32px 0' }} />

                {/* Markdown Simulation */}
                <div style={{
                    fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--text-high)', lineHeight: 1.8
                }}>
                    <style>{`
                        .doc-content h1 { font-family: var(--font-display); font-size: 28px; margin: 40px 0 16px; color: var(--text-high); }
                        .doc-content h2 { font-family: var(--font-display); font-size: 22px; margin: 32px 0 16px; color: var(--text-high); }
                        .doc-content h3 { font-family: var(--font-display); font-size: 18px; margin: 24px 0 12px; color: var(--text-high); }
                        .doc-content p { color: var(--text-mid); margin-bottom: 16px; }
                        .doc-content ul { color: var(--text-mid); margin-bottom: 24px; padding-left: 20px; }
                        .doc-content li { margin-bottom: 8px; }
                        .doc-content code { font-family: var(--font-mono); font-size: 13px; background: var(--bg-void); border: 1px solid var(--border); padding: 2px 6px; border-radius: 4px; color: var(--cyan); }
                        .doc-content pre { background: var(--bg-void); border: 1px solid var(--border); padding: 16px; border-radius: 8px; overflow-x: auto; margin-bottom: 24px; }
                        .doc-content pre code { background: transparent; border: none; padding: 0; color: var(--text-mid); }
                        .doc-content blockquote { border-left: 3px solid var(--primary); background: var(--bg-raised); padding: 16px; border-radius: 0 8px 8px 0; margin-bottom: 24px; }
                        .doc-content blockquote p { margin-bottom: 0; }
                    `}</style>
                    <div className="doc-content" dangerouslySetInnerHTML={{
                        __html: article.content
                            .replace(/# (.*)/g, '<h1>$1</h1>')
                            .replace(/## (.*)/g, '<h2>$1</h2>')
                            .replace(/### (.*)/g, '<h3>$1</h3>')
                            .replace(/> \[\!NOTE\]\n> (.*)/g, '<blockquote><strong style="color:var(--text-high);display:block;margin-bottom:8px">Note:</strong><p>$1</p></blockquote>')
                            .replace(/> \[\!IMPORTANT\]\n> (.*)/g, '<blockquote style="border-left-color:var(--yellow)"><strong style="color:var(--yellow);display:block;margin-bottom:8px">Important:</strong><p>$1</p></blockquote>')
                            .replace(/> \[\!TIP\]\n> (.*)/g, '<blockquote style="border-left-color:var(--cyan)"><strong style="color:var(--cyan);display:block;margin-bottom:8px">Astuce:</strong><p>$1</p></blockquote>')
                            .replace(/> \[\!WARNING\]\n> (.*)/g, '<blockquote style="border-left-color:var(--orange)"><strong style="color:var(--orange);display:block;margin-bottom:8px">Attention:</strong><p>$1</p></blockquote>')
                            .replace(/> \[\!CAUTION\]\n> (.*)/g, '<blockquote style="border-left-color:var(--red)"><strong style="color:var(--red);display:block;margin-bottom:8px">Danger:</strong><p>$1</p></blockquote>')
                            .replace(/\`\`\`xml([\s\S]*?)\`\`\`/g, '<pre><code>$1</code></pre>')
                            .replace(/\`\`\`([\s\S]*?)\`\`\`/g, '<pre><code>$1</code></pre>')
                            .replace(/\n\n/g, '<br/><br/>')
                            .replace(/\* (.*)/g, '<ul><li>$1</li></ul>')
                            .replace(/<\/ul><br\/><br\/><ul>/g, '') // fix list linebreaks
                    }} />
                </div>

                <div className="divider" style={{ margin: '48px 0 24px' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: 'var(--text-low)' }}>Cet article vous a-t-il été utile ?</span>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-ghost" style={{ padding: '6px 12px' }}>Oui</button>
                        <button className="btn btn-ghost" style={{ padding: '6px 12px' }}>Non</button>
                    </div>
                </div>
            </article>
        </div>
    )
}

export default function Docs() {
    return (
        <div className="docs-page">
            <Outlet />
        </div>
    )
}
