import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Clock, ChevronRight, BookOpen } from 'lucide-react'
import { GUIDES } from './Guides'
import JsonLd from '../components/JsonLd'
import SEO from '../components/SEO'

/* ─── Guide HTML Content ─────────────────────────────────────────────────── */
const GUIDE_HTML: Record<string, string> = {
    'trackmania-nations-forever-guide-debutant': `
<h1>Guide Débutant : TrackMania Nations Forever</h1>
<p>TrackMania Nations Forever (TMNF) est un jeu de course arcade sorti en 2008 par Nadeo et distribué <strong>gratuitement</strong>. Malgré son ancienneté, il reste l'un des jeux de course les plus joués sur PC, grâce à sa physique unique, son éditeur de circuits et sa communauté toujours active.</p>

<h2>Télécharger TMNF gratuitement</h2>
<p>TMNF est disponible gratuitement sur plusieurs plateformes :</p>
<ul>
<li><strong>Steam</strong> : Recherchez "TrackMania Nations Forever" — il est totalement gratuit.</li>
<li><strong>ManiaPlanet</strong> : Via le launcher officiel de Nadeo/Ubisoft Nadeo.</li>
</ul>
<p>Une fois installé, le jeu pèse environ 700 Mo. Aucun abonnement ni achats intégrés ne vous seront jamais demandés.</p>

<h2>Premier lancement</h2>
<p>Au démarrage, le jeu vous propose directement la <strong>Campagne Solo</strong> — une progression en 5 séries de 25 circuits (Bronze, Argent, Or, Nadeo) dans l'environnement Stadium.</p>
<blockquote class="tip"><strong>Astuce :</strong> Commencez impérativement par la campagne solo. Les 25 premiers circuits sont conçus pour vous apprendre progressivement toutes les mécaniques du jeu (sauts, boucles, virages sur graviers, glisse sur l'eau).</blockquote>

<h2>La physique du jeu</h2>
<p>La physique de TMNF est ce qui le rend unique. Votre voiture suit des règles précises :</p>
<ul>
<li><strong>Pas de collision entre joueurs</strong> : En mode multijoueur, les voitures se traversent. Aucun crash volontaire possible.</li>
<li><strong>Physique déterministe</strong> : Le même chemin, au même moment, donne exactement le même résultat. C'est la base du chrono parfait.</li>
<li><strong>Frottements variables</strong> : Chaque surface (bitume, terre, herbe, eau) a un coefficient d'adhérence différent.</li>
</ul>

<h2>Les modes de jeu principaux</h2>
<h3>Time Attack (TA)</h3>
<p>Le mode roi. Chaque joueur tourne en boucle sur la map, essayant d'améliorer son meilleur chrono. Pas d'interaction entre joueurs. C'est le mode le plus répandu sur les serveurs publics.</p>

<h3>Rounds</h3>
<p>Les joueurs s'affrontent en temps réel. Le premier à passer la ligne gagne des points. Plus compétitif et nerveux que le TA.</p>

<h3>Stunts</h3>
<p>Des figures acrobatiques remplacent le chrono. Rarement joué mais visuellement spectaculaire.</p>

<h2>Conseils pour débuter</h2>
<ul>
<li><strong>Finissez d'abord la campagne</strong> avant d'aller en ligne. Les circuits de la campagne sont parfaitement équilibrés pour apprendre.</li>
<li><strong>Regardez votre ghost</strong> : TMNF enregistre votre meilleur run sous forme de fantôme visible. Courserez-le pour identifier où vous perdez du temps.</li>
<li><strong>Rejoignez un serveur "Starter"</strong> : Des serveurs publics sont dédiés aux débutants avec des maps simples (moins de 45 secondes).</li>
<li><strong>Téléchargez des maps sur TMX</strong> : Le site TrackMania Exchange regorge de circuits communautaires classés par difficulté.</li>
</ul>
<blockquote class="note"><strong>Note :</strong> Rejoindre un serveur TrackHost vous donne accès à des rotations de maps soigneusement choisies — idéal pour trouver le niveau qui vous correspond.</blockquote>
`,

    'techniques-conduite-trackmania': `
<h1>Techniques de Conduite Avancées sur TrackMania</h1>
<p>Aller vite sur TrackMania n'est pas qu'une question de réflexes. C'est une discipline qui combine connaissance de la physique, lecture du circuit et exécution précise.</p>

<h2>Le freinage</h2>
<p>TMNF utilise un système de freinage purement arcade. Les points clés :</p>
<ul>
<li><strong>Ne freinez presque jamais</strong> : Sur un circuit bien construit pour le Time Attack, un bon pilote ne touche quasiment jamais la pédale de frein. Si vous freinez souvent, c'est que vous prenez les virages trop vite ou trop tardivement.</li>
<li><strong>Frein à main vs Frein normal</strong> : Le frein normal bloque les 4 roues et fait pivoter la voiture. Il est utile dans les épingles serrées sur bitume. Sur terre (Rally), le freinage dosé est clé.</li>
</ul>

<h2>Accélération et traction</h2>
<ul>
<li><strong>Plein gaz dès que possible</strong> : L'objectif est de passer le moins de temps possible sans être à fond. En sortie de virage, accélérez dès que la voiture est dans l'axe.</li>
<li><strong>La coupure de gaz</strong> : Dans les virages très serrés à grande vitesse, couper brièvement l'accélérateur (sans freiner) permet à l'avant de virer plus facilement. C'est subtil mais décisif sur les circuits Tech.</li>
</ul>

<h2>Les virages : la trajectoire parfaite</h2>
<p>Comme en Formule 1, la trajectoire optimale passe par le <strong>point de corde</strong> — le point le plus intérieur du virage.</p>
<h3>Méthode</h3>
<ul>
<li>Freinage (si nécessaire) avant le virage, en ligne droite.</li>
<li>Approche par l'extérieur de la piste.</li>
<li>Point de corde à l'apex du virage.</li>
<li>Sortie vers l'extérieur en accélérant.</li>
</ul>
<blockquote class="important"><strong>Important :</strong> Sur les circuits Tech (nombreux virages enchaînés), les trajectoires se chevauchent. Parfois il vaut mieux sacrifier un virage pour mieux préparer le suivant. Analysez toujours 2-3 virages à l'avance.</blockquote>

<h2>La gestion des sauts (Stadium)</h2>
<p>Le Stadium est l'environnement le plus riche en sauts et figures. Points clés :</p>
<ul>
<li><strong>L'atterrissage à plat</strong> : Orientez votre voiture parallèle au sol avant l'impact. Atterrir nose-down fait perdre de la vitesse.</li>
<li><strong>Bug-slide</strong> (avancé) : Atterrir sur l'avant gauche ou droit peut déclencher un micro-slide qui oriente la voiture sans perdre de vitesse. Une technique maîtrisée par les top pilotes.</li>
<li><strong>Le nosebug</strong> : En freinant juste avant l'impact d'un saut, on peut faire pivoter la voiture rapidement.</li>
</ul>

<h2>Les surfaces et leurs spécificités</h2>
<table>
<tr><td><strong>Surface</strong></td><td><strong>Adhérence</strong></td><td><strong>Technique clé</strong></td></tr>
<tr><td>Bitume (Stadium)</td><td>Très haute</td><td>Trajectoires précises, peu de frein</td></tr>
<tr><td>Terre (Rally)</td><td>Faible</td><td>Dosage du frein, dérapage contrôlé</td></tr>
<tr><td>Sable (Desert)</td><td>Moyenne</td><td>Conservation de la vitesse</td></tr>
<tr><td>Glace / Eau</td><td>Très faible</td><td>Anticipation maximale</td></tr>
</table>

<h2>Entraînement recommandé</h2>
<p>Le moyen le plus efficace de progresser est de télécharger des <strong>maps Tech</strong> sur TMX, de les jouer en Time Attack, et de comparer votre ghost contre le record local. L'objectif : identifier visuellement où est le décalage.</p>
<blockquote class="tip"><strong>Astuce :</strong> Sur un serveur TrackHost avec XAseco activé, vous verrez les local records en temps réel en jeu — parfait pour vous donner un objectif à chaque run.</blockquote>
`,

    'environnements-trackmania-nations': `
<h1>Les Environnements de TrackMania Nations Forever</h1>
<p>TMNF inclut 5 environnements distincts. Chaque environnement possède sa propre voiture, sa propre physique et son propre style de circuit. Les connaître est indispensable pour savoir quel type de jeu vous attend.</p>

<h2>Stadium — L'environnement de référence</h2>
<p>Le <strong>Stadium</strong> est DE LOIN le plus joué. Quand on parle de TMNF dans la communauté, on parle presque toujours de Stadium.</p>
<h3>La voiture</h3>
<p>Une voiture de course légère et très maniable. Vitesse maximale élevée, adhérence excellente sur bitume.</p>
<h3>Les familles de circuits Stadium</h3>
<ul>
<li><strong>Fullspeed (FS)</strong> : Circuits rapides avec peu de virages. L'objectif est de maintenir le plein gaz le plus longtemps possible.</li>
<li><strong>Tech</strong> : Nombreux virages enchaînés, vitesse moyenne plus basse. Récompense la précision des trajectoires.</li>
<li><strong>LOL / Mixed</strong> : Mélange des deux styles, souvent avec des éléments créatifs (water bridges, wallrides...).</li>
</ul>
<blockquote class="tip"><strong>Astuce :</strong> Si vous jouez pour la première fois en ligne, cherchez un serveur "Stadium - Starter" ou "Stadium - Easy". Ces serveurs ont des maps spécialement choisies pour les débutants.</blockquote>

<h2>Desert — La conduite dans les dunes</h2>
<p>L'environnement Desert met en scène une <strong>buggy rapide</strong> dans des paysages désertiques.</p>
<ul>
<li>Vitesse maximale très élevée (plus rapide que le Stadium en ligne droite).</li>
<li>Le terrain est variable : sable (faible adhérence), rock (haute adhérence), herbe (glissante).</li>
<li>Les circuits Desert sont souvent spectaculaires avec de grandes rampes et des survols paysagistiques.</li>
</ul>

<h2>Rally — La boue et la précision</h2>
<p>L'environnement Rally met en scène une <strong>voiture de rallye</strong> sur des chemins de terre et forêts.</p>
<ul>
<li>Surface principale : terre, avec zones de boue et d'herbe.</li>
<li>Adhérence faible : le dérapage (oversteer) est courant et parfois souhaitable dans les épingles.</li>
<li>Les circuits Rally ressemblent à de vrais stages de rallye : étroits, techniques, avec des transitions rapides entre surfaces.</li>
</ul>
<blockquote class="important"><strong>Important :</strong> Le Rally est l'environnement le plus exigeant pour les débutants à cause de la faible adhérence. Habituez-vous au Stadium avant d'y venir.</blockquote>

<h2>Bay — L'urbain et le saut de haies</h2>
<p>L'environnement Bay est l'un des moins joués en ligne, mais offre une expérience unique. La voiture ressemble à un SUV urbain. Circuits souvent inspirés de l'environnement urbain (parkings, ports).</p>

<h2>Coast — La côte méditerranéenne</h2>
<p>L'environnement Coast se déroule sur des routes côtières. Voiture sportive de route, circuits sur routes étroites avec bords de mer. Les sauts sont rares — Coast récompense avant tout la fluidité de trajectoire.</p>

<h2>Par où commencer ?</h2>
<table>
<tr><td><strong>Environnement</strong></td><td><strong>Difficulté</strong></td><td><strong>Points forts</strong></td></tr>
<tr><td>Stadium</td><td>⭐⭐⭐</td><td>Communauté, variété, compétition</td></tr>
<tr><td>Desert</td><td>⭐⭐</td><td>Vitesse pure, spectaculaire</td></tr>
<tr><td>Rally</td><td>⭐⭐⭐⭐</td><td>Technique, réaliste</td></tr>
<tr><td>Bay</td><td>⭐⭐⭐</td><td>Original, urbain</td></tr>
<tr><td>Coast</td><td>⭐⭐</td><td>Relaxant, flow</td></tr>
</table>
<p>Commencez par <strong>Stadium</strong> — vous y trouverez 90% des serveurs actifs et la plus grande sélection de maps.</p>
`,

    'trouver-telecharger-maps-tmnf': `
<h1>Où Trouver et Télécharger des Maps TMNF ?</h1>
<p>L'une des grandes forces de TrackMania Nations Forever est sa communauté de <strong>mappeurs</strong> (créateurs de circuits). Des milliers de circuits ont été créés et partagés depuis 2008. Voici comment y accéder.</p>

<h2>TrackMania Exchange (TMX) — Le site de référence</h2>
<p><strong>tmnf.exchange</strong> (anciennement tmn.acescrew.com) est LA bibliothèque de maps TMNF. C'est un site communautaire qui héberge des dizaines de milliers de circuits téléchargeables gratuitement.</p>

<h3>Comment télécharger une map</h3>
<ul>
<li>Allez sur <strong>tmnf.exchange</strong>.</li>
<li>Utilisez les filtres : Environment (Stadium, Desert...), Difficulty (easy, intermediate, expert), Style (Fullspeed, Tech, Lol...).</li>
<li>Cliquez sur une map pour voir sa fiche : auteur, screenshot, commentaires, notes des joueurs.</li>
<li>Cliquez sur <strong>Download</strong> — vous obtenez un fichier <code>.Map.Gbx</code>.</li>
<li>Copiez ce fichier dans <code>Documents/TrackMania Nations Forever/Maps/My Maps/</code> sur votre PC.</li>
<li>Dans le jeu : <strong>Solo &gt; My Maps</strong> pour y jouer seul, ou uploadez la map sur votre serveur TrackHost.</li>
</ul>

<h2>Les catégories de maps à connaître</h2>
<h3>Fullspeed (FS)</h3>
<p>Circuits rapides, peu de virages, priorité aux sauts et à la conservation de la vitesse. Populaires sur les serveurs publics. Exemples de maps légendaires : <em>Banshee</em> de Scrapie, <em>Detonation</em>.</p>

<h3>Tech</h3>
<p>Nombreux virages, basse vitesse moyenne, technique précise requise. Très populaires dans la scène compétitive.</p>

<h3>LOL / Bobsleigh</h3>
<p>Maps créatives, souvent décalées ou humoristiques. Idéales pour jouer entre amis sans prise de tête.</p>

<h3>Dirt</h3>
<p>Maps sur terre (surface Stadium dirt), physique proche du Rally. Un sous-genre très actif dans la communauté.</p>
<blockquote class="note"><strong>Note :</strong> Les maps sont notées par les joueurs de 0 à 10 sur TMX. Une note supérieure à 7/10 indique généralement un circuit de qualité. Cherchez des maps avec au moins 50 notes pour un avis représentatif.</blockquote>

<h2>ManiaPlanet — L'alternative officielle</h2>
<p>ManiaPlanet (le launcher officiel) intègre un Arcade de maps avec filtre et téléchargement en un clic directement depuis le jeu. Moins riche que TMX mais plus pratique.</p>

<h2>Mettre ses maps sur un serveur TrackHost</h2>
<p>Une fois vos maps téléchargées, vous pouvez les uploader directement depuis l'interface TrackHost, via l'onglet <strong>Maps &amp; Plugins</strong> de votre Dashboard — sans FTP, sans SSH. Glissez-déposez vos fichiers <code>.Map.Gbx</code> et ils sont immédiatement disponibles pour vos joueurs.</p>
`,

    'records-competition-trackmania': `
<h1>Compétition et Records sur TrackMania Nations Forever</h1>
<p>La scène compétitive de TMNF est l'une des plus durables dans l'histoire du gaming PC. En 2026, des joueurs battent encore des records vieux de 15 ans. Voici comment fonctionne l'écosystème des records.</p>

<h2>Local Records — Les records de votre serveur</h2>
<p>Les <strong>Local Records</strong> (records locaux) sont les meilleurs temps réalisés sur une map spécifique, sur un serveur donné. Ils sont gérés par le plugin <strong>XAseco</strong> (ou RASCO).</p>
<h3>Fonctionnement</h3>
<ul>
<li>Chaque fois qu'un joueur finit une map avec un meilleur temps, son chrono est enregistré et affiché dans le widget en jeu (colonne de droite).</li>
<li>Généralement, seuls les <strong>top 30 ou top 50</strong> temps sont conservés.</li>
<li>Les local records sont propres à chaque serveur — votre record sur un serveur ne compte pas sur un autre.</li>
</ul>

<h2>Dedimania — Les records mondiaux</h2>
<p><strong>Dedimania</strong> est le système de records MONDIAL de TMNF. Si votre serveur y est connecté, les temps réalisés sont envoyés à une base de données centrale.</p>
<ul>
<li>Un joueur peut voir son record "world" même sur un nouveau serveur.</li>
<li>Les meilleurs temps mondiaux par map sont publics et consultables.</li>
<li>La connexion à Dedimania nécessite un login serveur autorisé par Nadeo — c'est automatiquement géré sur les plans Pro et Elite de TrackHost.</li>
</ul>

<h2>La scène eSport TMNF</h2>
<p>Bien qu'ancienne, la scène compétitive TMNF reste vivante :</p>
<ul>
<li>Des tournois réguliers sont organisés sur Discord : format TimeAttack sur 1 ou plusieurs maps, avec classement final.</li>
<li>Des événements "Cup" (mode Rounds) opposent des équipes de 2 à 5 joueurs.</li>
<li>Les "hunters" sont des joueurs dont l'objectif est de battre les records World sur le maximum de maps.</li>
</ul>
<blockquote class="tip"><strong>Astuce :</strong> Pour voir les meilleurs temps sur une map avant de s'y lancer, rendez-vous sur tmnf.exchange. La fiche de la map affiche les meilleurs temps enregistrés par la communauté.</blockquote>

<h2>Comment progresser rapidement en compétition</h2>
<ul>
<li><strong>Ghosting</strong> : Télécharger le ghost record du top 1 et le racer directement en jeu.</li>
<li><strong>Analyse segment par segment</strong> : Découpez la map en sections et identifiez où vous perdez plus de 0.1 secondes.</li>
<li><strong>Jouer avec des adversaires meilleurs</strong> : Rejoignez des serveurs avec des joueurs légèrement au-dessus de votre niveau.</li>
<li><strong>Varier les environnements</strong> : Des compétences acquises en Desert ou Rally améliorent votre Stadium.</li>
</ul>
`,

    'mode-time-attack-trackmania': `
<h1>Maîtriser le Mode Time Attack sur TMNF</h1>
<p>Le <strong>Time Attack</strong> (TA) est le mode de jeu le plus joué sur TrackMania Nations Forever. Contrairement aux modes de course classiques, il n'y a pas de course directe contre les adversaires — chaque joueur perfectionne son chrono de son côté, en boucle.</p>

<h2>Comment fonctionne le Time Attack</h2>
<ul>
<li>Tous les joueurs sont sur la même map en même temps.</li>
<li>Chacun peut partir quand il veut et recommencer autant de fois qu'il le souhaite.</li>
<li>À la fin du temps imparti (souvent 5 minutes par map), le serveur passe à la map suivante.</li>
<li>Les <strong>fantômes des autres joueurs</strong> sont optionnellement visibles — vous voyez leurs voitures mais ne pouvez pas les toucher.</li>
<li>Votre meilleur temps de la session est affiché dans le classement en temps réel.</li>
</ul>

<h2>Stratégie : le run parfait</h2>
<h3>1. Mémorisation du circuit</h3>
<p>Les 2-3 premiers tours servent uniquement à mémoriser la map. Apprenez où sont les virages, les sauts, les zones glissantes. Ne vous préoccupez pas encore de votre temps.</p>

<h3>2. Identification des points chauds</h3>
<p>Repérez les 3-4 endroits où vous commettez des erreurs récurrentes. Ce sont vos "points chauds" — ceux sur lesquels vous devez vous concentrer.</p>

<h3>3. Runs partiels</h3>
<p>Sur certains maps très longues, vous pouvez faire des "runs partiels" (repartez après un virage raté sans finir le run). Cela économise du temps d'entraînement.</p>
<blockquote class="important"><strong>Important :</strong> En compétition, un bon chrono commence par un bon départ. Le lancement compte pour 0.1 à 0.3 secondes sur la plupart des maps. Un départ raté compromet le run entier.</blockquote>

<h2>Lire le classement en jeu</h2>
<p>Le classement en Time Attack (affiché à droite de l'écran avec XAseco) montre :</p>
<ul>
<li>Votre nom + votre temps actuel (en vert si vous êtes en course, pas encore fini).</li>
<li>Le classement des finisseurs de la session actuelle.</li>
<li>Les records locaux du serveur (ceux qui existaient avant la session).</li>
</ul>
<p>La couleur de votre temps en course indique votre performance vs le leader : <strong>vert</strong> = vous êtes en avance, <strong>rouge</strong> = vous êtes derrière.</p>

<h2>Réinitialisation rapide</h2>
<p>Si vous ratez une portion de la map, <strong>réinitialisez immédiatement</strong> (touche Retour arrière par défaut) pour ne pas perdre de temps. En TA, un run raté ne coûte rien — seul votre meilleur temps compte.</p>

<h2>Les serveurs TA populaires en 2026</h2>
<ul>
<li><strong>Stadium FS</strong> : fullspeed purs, très grande communauté.</li>
<li><strong>Stadium Tech</strong> : circuits techniques, ambiance plus sérieuse/compétitive.</li>
<li><strong>Stadium Mixed</strong> : rotation variée, idéal pour les joueurs polyvalents.</li>
<li><strong>Dirt/Rally</strong> : niche mais passionnée, souvent des joueurs très techniques.</li>
</ul>
<blockquote class="tip"><strong>Astuce :</strong> Commencez sur un serveur <strong>Easy/Starter</strong> pour vous habituer à l'interface en ligne. Une fois à l'aise, rejoignez des serveurs de votre niveau — cherchez ceux où vous êtes dans le top 50% du classement.</blockquote>
`,
}

/* ─── Guide View ─────────────────────────────────────────────────────────── */
export default function GuideView() {
    const { slug } = useParams<{ slug: string }>()
    const guide = GUIDES.find(g => g.slug === slug)
    const content = slug && GUIDE_HTML[slug] ? GUIDE_HTML[slug].replace(/<h1>.*?<\/h1>\n?/gi, '') : null

    const related = GUIDES.filter(g => g.slug !== slug).slice(0, 3)

    if (!guide || !content) {
        return (
            <div className="card" style={{ padding: 64, textAlign: 'center' }}>
                <p style={{ color: 'var(--text-mid)', marginBottom: 16 }}>Guide non trouvé.</p>
                <Link to="/guides" className="btn btn-ghost"><ArrowLeft size={14} /> Retour aux guides</Link>
            </div>
        )
    }

    const Icon = guide.icon

    return (
        <div style={{ maxWidth: 1100, margin: '0 auto', paddingBottom: 64 }}>
            <SEO
                title={guide.title}
                description={guide.desc}
            />
            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "Article",
                "headline": guide.title,
                "description": guide.desc,
                "articleBody": content.replace(/<[^>]*>/g, ''),
                "author": {
                    "@type": "Organization",
                    "name": "TrackHost"
                }
            }} />
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-low)' }}>
                <Link to="/" style={{ color: 'var(--text-low)', textDecoration: 'none' }}>TrackHost</Link>
                <ChevronRight size={10} />
                <Link to="/guides" style={{ color: 'var(--text-low)', textDecoration: 'none' }}>Guides</Link>
                <ChevronRight size={10} />
                <span style={{ color: 'var(--text-mid)' }}>{guide.category}</span>
            </nav>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 40, alignItems: 'start' }}>
                {/* Main article */}
                <article>
                    {/* Hero */}
                    <div style={{ marginBottom: 32 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                            <div style={{ width: 48, height: 48, borderRadius: 12, background: `${guide.color}18`, border: `1px solid ${guide.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Icon size={22} style={{ color: guide.color }} />
                            </div>
                            <div>
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: guide.color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{guide.category}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-low)' }}>
                                    <Clock size={10} /> {guide.time} de lecture
                                </div>
                            </div>
                        </div>
                        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, color: 'var(--text-high)', lineHeight: 1.25, marginBottom: 16 }}>
                            {guide.title}
                        </h1>
                        <p style={{ fontSize: 16, color: 'var(--text-mid)', lineHeight: 1.6 }}>{guide.desc}</p>
                    </div>

                    <div className="divider" style={{ margin: '24px 0' }} />

                    {/* Article content */}
                    <style>{`
            .guide-article h1 { font-family: var(--font-display); font-size: 26px; font-weight: 700; color: var(--text-high); margin: 36px 0 14px; }
            .guide-article h2 { font-family: var(--font-display); font-size: 20px; font-weight: 700; color: var(--text-high); margin: 28px 0 12px; border-bottom: 1px solid var(--border); padding-bottom: 8px; }
            .guide-article h3 { font-family: var(--font-display); font-size: 16px; font-weight: 600; color: var(--text-high); margin: 22px 0 10px; }
            .guide-article p { font-size: 15px; color: var(--text-mid); line-height: 1.75; margin-bottom: 14px; }
            .guide-article ul { padding-left: 20px; margin-bottom: 16px; }
            .guide-article li { font-size: 14px; color: var(--text-mid); margin-bottom: 6px; line-height: 1.6; }
            .guide-article strong { color: var(--text-high); font-weight: 600; }
            .guide-article em { color: var(--cyan); font-style: italic; }
            .guide-article code { font-family: var(--font-mono); font-size: 12px; background: var(--bg-void); border: 1px solid var(--border); padding: 2px 6px; border-radius: 4px; color: var(--cyan); }
            .guide-article a { color: var(--primary); text-decoration: none; border-bottom: 1px solid transparent; transition: border-color 150ms; }
            .guide-article a:hover { border-bottom-color: var(--primary); }
            .guide-article blockquote { border-left: 3px solid var(--primary); background: var(--bg-raised); padding: 14px 16px; border-radius: 0 8px 8px 0; margin-bottom: 16px; }
            .guide-article blockquote.tip { border-left-color: var(--cyan); }
            .guide-article blockquote.important { border-left-color: var(--yellow); }
            .guide-article blockquote.warning { border-left-color: var(--orange); }
            .guide-article blockquote strong { color: var(--text-high); }
            .guide-article table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
            .guide-article tr { border-bottom: 1px solid var(--border); }
            .guide-article td { padding: 10px 14px; color: var(--text-mid); }
            .guide-article tr:first-child td { color: var(--text-high); font-weight: 600; font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; }
          `}</style>
                    <div
                        className="guide-article"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />

                    <div className="divider" style={{ margin: '32px 0' }} />

                    {/* CTA */}
                    <div className="card" style={{ padding: 24, background: 'var(--primary-dim)', border: '1px solid #00FF8720' }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: 'var(--text-high)', marginBottom: 8 }}>
                            Envie de jouer avec vos amis ?
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--text-mid)', marginBottom: 16 }}>
                            Créez votre propre serveur TMNF en 60 secondes. Invitez-les, uploadez vos maps, et appliquez ces techniques ensemble.
                        </p>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <Link to="/checkout" className="btn btn-primary" style={{ fontSize: 13 }}>Créer un serveur</Link>
                            <Link to="/products" className="btn btn-ghost" style={{ fontSize: 13 }}>Voir les offres</Link>
                        </div>
                    </div>
                </article>

                {/* Sidebar */}
                <aside style={{ position: 'sticky', top: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div className="card" style={{ padding: 20 }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--text-low)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <BookOpen size={12} /> Autres guides
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {related.map(g => (
                                <Link
                                    key={g.slug}
                                    to={`/guides/${g.slug}`}
                                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, background: 'var(--bg-raised)', border: '1px solid var(--border)', textDecoration: 'none', transition: 'border-color 150ms' }}
                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = g.color}
                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}
                                >
                                    <g.icon size={14} style={{ color: g.color, flexShrink: 0 }} />
                                    <span style={{ fontSize: 12, color: 'var(--text-mid)', lineHeight: 1.4 }}>{g.title}</span>
                                </Link>
                            ))}
                        </div>
                        <Link to="/guides" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', marginTop: 12, fontSize: 12 }}>
                            Tous les guides
                        </Link>
                    </div>

                    <div className="card" style={{ padding: 20, background: 'var(--bg-raised)' }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text-high)', marginBottom: 8 }}>Serveurs TrackHost</div>
                        <p style={{ fontSize: 12, color: 'var(--text-mid)', marginBottom: 14, lineHeight: 1.6 }}>
                            Hébergez votre serveur TMNF en un clic. Parfait pour pratiquer les techniques de ce guide avec vos amis.
                        </p>
                        <Link to="/pricing" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', fontSize: 12 }}>
                            Voir les tarifs
                        </Link>
                    </div>
                </aside>
            </div>
        </div>
    )
}
