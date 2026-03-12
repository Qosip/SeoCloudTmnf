import { useState } from 'react'
import { Link, useParams, Routes, Route } from 'react-router-dom'
import {
    MessageSquare, ThumbsUp, MessageCircle, Clock, Search, ExternalLink,
    Award, Hash, Activity, ArrowLeft, Send
} from 'lucide-react'
import { motion } from 'framer-motion'
import JsonLd from '../components/JsonLd'
import SEO from '../components/SEO'

/* ─── Data ──────────────────────────────────────────────────────────────── */
type Reply = { id: string; author: string; avatar: string; date: string; content: string; likes: number }
type Post = {
    id: string
    slug: string
    title: string
    author: string
    avatar: string
    date: string
    category: 'Annonces' | 'Aide & Support' | 'Maps & Mappacking' | 'Discussions'
    content: string
    likes: number
    replies: number
    pinned?: boolean
    hot?: boolean
    messages: Reply[]
}

const POSTS: Post[] = [
    {
        id: '1',
        slug: 'lancement-beta-trackhost',
        title: '📢 Lancement de la Bêta TrackHost — Rejoignez-nous !',
        author: 'TrackHost Team',
        avatar: 'TH',
        date: 'Il y a 2h',
        category: 'Annonces',
        content: "Bonjour à tous ! Toute l'équipe est fière de vous annoncer l'ouverture de la bêta publique de TrackHost. L'objectif : rendre la création d'un serveur TrackMania Nations Forever accessible à tous, sans aucune connaissance technique (adieu les VPS Linux et les ports fermés). Profitez de -30% avec le code LAUNCH30.",
        likes: 124,
        replies: 45,
        pinned: true,
        messages: [
            { id: 'r1', author: 'Speedy_TM', avatar: 'S', date: 'Il y a 2h', content: "Super initiative ! J'attends ça depuis longtemps. Le code LAUNCH30 fonctionne pour tous les plans ?", likes: 12 },
            { id: 'r2', author: 'TrackHost Team', avatar: 'TH', date: 'Il y a 1h45', content: "Oui, LAUNCH30 s'applique sur le premier mois de tous nos plans (Starter, Pro, Elite). Bienvenue à bord !", likes: 28 },
            { id: 'r3', author: 'NeonDrift', avatar: 'N', date: 'Il y a 1h', content: "J'ai testé, setup en 2 min chrono. Incroyable.", likes: 15 },
        ]
    },
    {
        id: '2',
        slug: 'competition-map-neon-drift',
        title: 'Map Competition: "Neon Drift" - Cashprize 100€ 🏆',
        author: 'Speedy_TM',
        avatar: 'S',
        date: 'Il y a 5h',
        category: 'Maps & Mappacking',
        content: "J'organise un petit tournoi ce weekend sur mon serveur Elite. La map principale sera 'Neon Drift_Final'. Entraînez-vous, le record local repartira avec un virement PayPal de 100€ dimanche soir. IP du serveur: 51.158.124.42:2350. Qui en est ?",
        likes: 89,
        replies: 23,
        hot: true,
        messages: [
            { id: 'r4', author: 'Ghost99', avatar: 'G', date: 'Il y a 4h', content: "Je suis chaud ! C'est quelle map exactement pour s'entraîner ?", likes: 5 },
            { id: 'r5', author: 'Speedy_TM', avatar: 'S', date: 'Il y a 3h', content: "Neon Drift_Final, dispo sur TMX. Le serveur est ouvert 24/7 pour l'entraînement.", likes: 8 },
        ]
    },
    {
        id: '3',
        slug: 'tuto-configurer-dedimania',
        title: '[Tuto] Configurer Dedimania avec son propre login',
        author: 'Admin_Mike',
        avatar: 'M',
        date: 'Hier',
        category: 'Aide & Support',
        content: "Pour ceux qui utilisent le plan Pro, n'oubliez pas que pour que Dedimania fonctionne, vous devez créer un compte sur la Player Page Nadeo et insérer votre login/mot de passe dans le dedicated_cfg.txt. J'ai fait une petite vidéo explicative pour ceux que ça intéresse.",
        likes: 42,
        replies: 12,
        messages: [
            { id: 'r6', author: 'Kiki_Kart', avatar: 'K', date: 'Hier', content: "Merci pour le tuto ! Ça marche nickel.", likes: 3 },
        ]
    },
    {
        id: '4',
        slug: 'recherche-mappeurs-campagne-tech',
        title: 'Recherche mappeurs pour campagne Tech',
        author: 'GhostLine',
        avatar: 'G',
        date: 'Hier',
        category: 'Maps & Mappacking',
        content: "Salut ! On est en train de monter un serveur pur Tech et il nous manque quelques maps pour boucler la rotation de 25. Si vous avez des circuits entre 40 et 55 secondes, fluides, sans sauts hasardeux, envoyez-les moi en MP TMX.",
        likes: 15,
        replies: 8,
        messages: []
    },
    {
        id: '5',
        slug: 'serveur-invisible-solution',
        title: 'Serveur invisible dans la liste ? Solution inside.',
        author: 'Neo_Admin',
        avatar: 'N',
        date: 'Il y a 2j',
        category: 'Aide & Support',
        content: "J'ai vu beaucoup de gens demander pourquoi leur serveur n'apparait pas. N'oubliez pas que Nadeo met du temps à actualiser (5 à 10 minutes parfois !). Mettez votre serveur en favoris une fois connecté via l'IP, c'est le plus simple.",
        likes: 210,
        replies: 56,
        hot: true,
        messages: [
            { id: 'r7', author: 'Admin_Mike', avatar: 'M', date: 'Il y a 2j', content: "Exact ! Et n'oubliez pas de vérifier hide_server=0 dans dedicated_cfg.", likes: 45 },
            { id: 'r8', author: 'Turbo_K', avatar: 'T', date: 'Il y a 1j', content: "Ça m'a pris 8 minutes la première fois, j'ai cru que c'était cassé lol", likes: 22 },
        ]
    },
    {
        id: '6',
        slug: 'tmnf-2026-boss-des-jeux-de-course',
        title: 'TMNF en 2026 : Toujours le boss des jeux de course ?',
        author: 'RetroGamer',
        avatar: 'R',
        date: 'Il y a 3j',
        category: 'Discussions',
        content: "Honnêtement, je joue au nouveau Trackmania (2020) de temps en temps, mais je finis toujours par revenir sur Nations Forever. Y'a un feeling de conduite, une légèreté dans le moteur physique que je retrouve nulle part ailleurs. D'autres partagent cet avis ?",
        likes: 185,
        replies: 92,
        messages: []
    },
    {
        id: '7',
        slug: 'changer-duree-timeattack-sans-restart',
        title: 'Comment changer la durée du TimeAttack sans restart ?',
        author: 'Kiki_Kart',
        avatar: 'K',
        date: 'Il y a 4j',
        category: 'Aide & Support',
        content: "Salut, je fais tourner un petit serv avec des amis et parfois on veut rallonger le temps d'une map en cours (exemple de 5min à 10min). Possible via la console RCON sans redémarrer ?",
        likes: 8,
        replies: 3,
        messages: []
    }
]

const CATEGORIES = ['Tous', 'Annonces', 'Aide & Support', 'Maps & Mappacking', 'Discussions']
const TAGS = ['#Tournoi', '#Tuto', '#Tech', '#Dirt', '#RCON', '#XAseco', '#Dedimania']

/* ─── Post Detail View ────────────────────────────────────────────────────── */
function BlogPostView() {
    const { slug } = useParams()
    const post = POSTS.find(p => p.slug === slug)
    const [replyText, setReplyText] = useState('')

    if (!post) return (
        <div className="card" style={{ padding: 64, textAlign: 'center' }}>
            <p style={{ color: 'var(--text-mid)', marginBottom: 16 }}>Topic non trouvé.</p>
            <Link to="/blog" className="btn btn-ghost"><ArrowLeft size={14} /> Retour au forum</Link>
        </div>
    )

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            style={{ maxWidth: 800, margin: '0 auto', paddingBottom: 64 }}
        >
            <SEO 
                title={post.title} 
                description={post.content.slice(0, 160) + '...'}
            />
            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                "headline": post.title,
                "author": {
                    "@type": "Person",
                    "name": post.author
                },
                "datePublished": post.date,
                "articleBody": post.content,
                "comment": post.messages.map(m => ({
                    "@type": "Comment",
                    "text": m.content,
                    "author": {
                        "@type": "Person",
                        "name": m.author
                    }
                }))
            }} />
            <Link to="/blog" className="btn btn-ghost" style={{ marginBottom: 24, fontSize: 13 }}>
                <ArrowLeft size={16} /> Retour au forum
            </Link>

            <div className="card blog-post-detail">
                {post.pinned && <div className="pin-badge"><Award size={10} /> Épinglé</div>}
                <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
                    <div className="avatar-circle" style={{ width: 52, height: 52, fontSize: 18 }}>{post.avatar}</div>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                            <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-high)' }}>{post.author}</span>
                            <span className="badge badge-gray">{post.category}</span>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-low)' }}><Clock size={12} style={{ verticalAlign: -2 }} /> {post.date}</span>
                        </div>
                        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: 'var(--text-high)', marginBottom: 16, lineHeight: 1.3 }}>{post.title}</h1>
                        <p style={{ fontSize: 15, color: 'var(--text-mid)', lineHeight: 1.7 }}>{post.content}</p>
                        <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-low)', fontSize: 13 }}><ThumbsUp size={14} /> {post.likes}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-low)', fontSize: 13 }}><MessageCircle size={14} /> {post.replies} réponses</span>
                        </div>
                    </div>
                </div>

                <div className="divider" />

                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 20, color: 'var(--text-high)' }}>Réponses ({post.messages.length})</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {post.messages.map((msg, i) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            style={{ display: 'flex', gap: 16, padding: 20, background: 'var(--bg-raised)', borderRadius: 12, border: '1px solid var(--border)' }}
                        >
                            <div className="avatar-circle" style={{ width: 40, height: 40, fontSize: 14 }}>{msg.avatar}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--text-high)' }}>{msg.author}</span>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-low)' }}>{msg.date}</span>
                                </div>
                                <p style={{ fontSize: 14, color: 'var(--text-mid)', lineHeight: 1.6 }}>{msg.content}</p>
                                <div style={{ marginTop: 12 }}>
                                    <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 11 }}><ThumbsUp size={12} /> {msg.likes}</button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="divider" style={{ margin: '32px 0' }} />
                <div style={{ display: 'flex', gap: 12 }}>
                    <input className="input" placeholder="Écrire une réponse..." value={replyText} onChange={e => setReplyText(e.target.value)} style={{ flex: 1 }} />
                    <button className="btn btn-primary" style={{ padding: '10px 20px' }}><Send size={14} /> Répondre</button>
                </div>
            </div>
        </motion.div>
    )
}

/* ─── Blog List ───────────────────────────────────────────────────────────── */
function BlogList() {
    const [cat, setCat] = useState('Tous')
    const [search, setSearch] = useState('')

    const filtered = POSTS.filter(p => {
        if (cat !== 'Tous' && p.category !== cat) return false
        if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.content.toLowerCase().includes(search.toLowerCase())) return false
        return true
    })

    return (
        <div style={{ maxWidth: 1100, margin: '0 auto', paddingBottom: 64 }} className="blog-page">
            <SEO 
                title="Espace Communautaire" 
                description="Rejoignez la communauté TrackHost. Participez aux discussions, trouvez des tournois et partagez vos impressions sur TrackMania Nations Forever."
            />
            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "Blog",
                "name": "Espace Communautaire TrackHost",
                "description": "Posez vos questions, trouvez des joueurs, partagez vos circuits et participez aux événements communautaires.",
                "blogPost": POSTS.map(p => ({
                    "@type": "BlogPosting",
                    "headline": p.title,
                    "url": `https://www.trackhost.gg/blog/${p.slug}`,
                    "datePublished": p.date, 
                    "author": {
                        "@type": "Person",
                        "name": p.author
                    }
                }))
            }} />
            {/* ── Header ── */}
            <div className="page-header" style={{ padding: '48px 0', borderBottom: '1px solid var(--border)', marginBottom: 32, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div>
                    <div className="badge badge-orange" style={{ marginBottom: 16 }}><MessageSquare size={10} style={{ marginRight: 4 }} /> Forum & Communauté</div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 700, color: 'var(--text-high)', letterSpacing: '0.01em', marginBottom: 12 }}>
                        Espace Communautaire
                    </h1>
                    <p style={{ fontSize: 15, color: 'var(--text-mid)', maxWidth: 500 }}>
                        Posez vos questions, trouvez des joueurs, partagez vos circuits et participez aux événements communautaires.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ position: 'relative', width: 260 }}>
                        <Search size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-low)' }} />
                        <input className="input" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 38, borderRadius: 20 }} />
                    </div>
                    <button className="btn btn-primary" style={{ borderRadius: 20 }}>Nouveau Topic</button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 32, alignItems: 'start' }}>
                {/* ── Main Feed ── */}
                <div>
                    {/* Category tabs */}
                    <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 16, marginBottom: 16 }}>
                        {CATEGORIES.map(c => (
                            <button key={c} onClick={() => setCat(c)} className={`btn ${cat === c ? 'btn-outline' : 'btn-ghost'}`} style={{ whiteSpace: 'nowrap', fontSize: 12, padding: '6px 14px', borderRadius: 20, borderColor: cat === c ? 'var(--cyan)' : 'transparent', color: cat === c ? 'var(--cyan)' : 'var(--text-mid)' }}>
                                {c}
                            </button>
                        ))}
                    </div>

                    {/* Posts List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {filtered.length === 0 ? (
                            <div className="card" style={{ textAlign: 'center', padding: 48, color: 'var(--text-mid)' }}>Aucun résultat trouvé.</div>
                        ) : filtered.map(post => (
                            <Link key={post.id} to={`/blog/${post.slug}`} className={`card blog-post ${post.pinned ? 'pinned' : ''}`} style={{ padding: 24, cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
                                {post.pinned && <div className="pin-badge"><Award size={10} /> Épinglé</div>}

                                <div style={{ display: 'flex', gap: 16 }}>
                                    {/* Avatar Column */}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                        <div className="avatar-circle" style={{ width: 44, height: 44, fontSize: 16, background: post.pinned ? 'var(--cyan-dim)' : 'var(--bg-raised)', color: post.pinned ? 'var(--cyan)' : 'var(--primary)', borderColor: post.pinned ? '#00D4FF40' : 'var(--border)' }}>
                                            {post.avatar}
                                        </div>
                                    </div>

                                    {/* Content Column */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-high)', fontWeight: 700 }}>{post.author}</span>
                                            <span style={{ color: 'var(--border-bright)' }}>·</span>
                                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-low)', display: 'flex', gap: 4, alignItems: 'center' }}>
                                                <Clock size={10} /> {post.date}
                                            </span>
                                            <span style={{ color: 'var(--border-bright)' }}>·</span>
                                            <span className="badge badge-gray" style={{ fontSize: 9 }}>{post.category}</span>
                                        </div>

                                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-high)', marginBottom: 8, letterSpacing: '0.01em', display: 'flex', alignItems: 'center', gap: 8 }}>
                                            {post.title}
                                            {post.hot && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--orange)', background: '#FF8C0020', padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase' }}>🔥 Hot</span>}
                                        </h2>

                                        <p style={{ fontSize: 13, color: 'var(--text-mid)', lineHeight: 1.6, marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {post.content}
                                        </p>

                                        {/* Actions */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-low)', fontSize: 12, transition: 'color 200ms' }} className="hover:text-primary">
                                                <MessageCircle size={14} /> {post.replies} Réponses
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-low)', fontSize: 12 }}>
                                                <ThumbsUp size={14} /> {post.likes} Likes
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-low)', fontSize: 12, marginLeft: 'auto' }}>
                                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10 }}>Dernier mess. par Admin_Mike il y a 10m</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ── Sidebar ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24, position: 'sticky', top: 24 }}>

                    <div className="card" style={{ background: 'var(--primary-dim)', border: '1px solid #00FF8720' }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-high)', marginBottom: 8 }}>Rejoignez le Discord</h3>
                        <p style={{ fontSize: 12, color: 'var(--text-mid)', marginBottom: 16 }}>Le cœur de la communauté se trouve sur notre serveur Discord officiel. Support rapide, vocaux et annonces.</p>
                        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 12 }}>
                            Rejoindre Discord <ExternalLink size={12} />
                        </button>
                    </div>

                    <div className="card" style={{ padding: 20 }}>
                        <div className="card-title" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Activity size={14} style={{ color: 'var(--orange)' }} /> Statistiques Forum
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                                <span style={{ color: 'var(--text-mid)', fontSize: 13 }}>Membres en ligne</span>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-high)' }}>142</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                                <span style={{ color: 'var(--text-mid)', fontSize: 13 }}>Nouv. Topics (24h)</span>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-high)' }}>24</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-mid)', fontSize: 13 }}>Total des messages</span>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-high)' }}>8,492</span>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ padding: 20 }}>
                        <div className="card-title" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Hash size={14} style={{ color: 'var(--cyan)' }} /> Tags Populaires
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {TAGS.map(tag => (
                                <span key={tag} className="badge badge-gray" style={{ cursor: 'pointer', transition: 'border-color 200ms' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-bright)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

/* ─── Router ──────────────────────────────────────────────────────────────── */
export default function Blog() {
    return (
        <Routes>
            <Route index element={<BlogList />} />
            <Route path=":slug" element={<BlogPostView />} />
        </Routes>
    )
}
