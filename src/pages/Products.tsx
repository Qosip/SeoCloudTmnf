import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, Filter, Search, ChevronRight, Zap, Shield, ArrowRight, Clock, Users } from 'lucide-react'
import JsonLd from '../components/JsonLd'
import SEO from '../components/SEO'

const PRODUCTS = [
    {
        id: 'tmnf-starter',
        name: 'TMNF Starter Pack',
        game: 'TrackMania Nations Forever',
        price: 4.99,
        originalPrice: null,
        badge: null,
        stars: 4.7,
        reviews: 142,
        tags: ['starter', 'solo', 'amis'],
        features: ['8 joueurs', '512 MB RAM', '1 vCPU', 'Console RCON', 'Gestion maps'],
        color: 'var(--text-mid)',
        popular: false,
        desc: "L'entrée en matière idéale. Un serveur TMNF complet pour jouer le soir avec vos potes, sans prise de tête.",
    },
    {
        id: 'tmnf-pro',
        name: 'TMNF Pro Server',
        game: 'TrackMania Nations Forever',
        price: 9.99,
        originalPrice: 12.99,
        badge: 'Bestseller',
        stars: 4.9,
        reviews: 389,
        tags: ['pro', 'esport', 'équipe'],
        features: ['16 joueurs', '1 GB RAM', '2 vCPU', 'XAseco inclus', 'Backup daily', 'Monitoring 7j'],
        color: 'var(--primary)',
        popular: true,
        desc: "Le choix des équipes sérieuses. XAseco pré-configuré, records trackés, monitoring avancé et SLA 99.9% uptime.",
    },
    {
        id: 'tmnf-elite',
        name: 'TMNF Elite — Événement',
        game: 'TrackMania Nations Forever',
        price: 24.99,
        originalPrice: null,
        badge: 'Premium',
        stars: 5.0,
        reviews: 67,
        tags: ['elite', 'événement', 'compétition'],
        features: ['32 joueurs', '4 GB RAM', '4 vCPU', 'Tous plugins', 'IP dédiée', 'Backup horaire', 'Support 24/7'],
        color: 'var(--yellow)',
        popular: false,
        desc: "Pour les tournois, les streams, les compétitions. IP dédiée, plugins complets, priorité de support, SLA 99.99%.",
    },
    {
        id: 'tmnf-flash',
        name: 'TMNF Flash — 24h',
        game: 'TrackMania Nations Forever',
        price: 1.99,
        originalPrice: null,
        badge: 'Nouveau',
        stars: 4.5,
        reviews: 28,
        tags: ['ephémère', 'live', 'stream'],
        features: ['12 joueurs', '512 MB RAM', '1 vCPU', 'Actif 24h', 'Pas de renouvellement'],
        color: 'var(--orange)',
        popular: false,
        desc: "Un serveur pour une session. Idéal pour les streams. Expire automatiquement après 24h. Aucun abonnement.",
    },
]

const REVIEWS = [
    { name: 'Speedy_TM', plan: 'Pro', stars: 5, date: 'Fév. 2026', text: "Uptime parfait depuis 3 mois. Le dashboard me permet de voir en 1 coup d'oeil si des amis jouent. XAseco s'est installé en un clic. Impossible de revenir en arrière." },
    { name: 'GhostLine', plan: 'Elite', stars: 5, date: 'Jan. 2026', text: "On utilise TrackHost pour nos tournois. 32 slots, jamais eu de coupure. Le support a résolu un souci en moins de 2h. Au top." },
    { name: 'AlphaRun', plan: 'Pro', stars: 4, date: 'Déc. 2025', text: "Produit solide. J'aurais voulu plus d'options pour les alertes, mais le monitoring de base fait le boulot. Console RCON vraiment pratique." },
    { name: 'Turbo_K', plan: 'Starter', stars: 5, date: 'Fév. 2026', text: "Pour 5€/mois j'ai un serveur complet pour jouer avec mes potes. Setup en 2 minutes. Je recommande à 100%." },
    { name: 'NeonDrift', plan: 'Flash', stars: 4, date: 'Mars 2026', text: "Le serveur éphémère 24h est parfait pour mes streams. Je le lance avant le live et l'oublie. Simple et pas cher." },
]

function StarRow({ n }: { n: number }) {
    return <div style={{ display: 'flex', gap: 2 }}>
        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} style={{ color: i <= Math.round(n) ? 'var(--yellow)' : 'var(--border)', fill: i <= Math.round(n) ? 'var(--yellow)' : 'transparent' }} />)}
    </div>
}

export default function Products() {
    const [search, setSearch] = useState('')
    const [filterTag, setFilter] = useState('')
    const [sort, setSort] = useState<'price' | 'stars' | 'popular'>('popular')

    const filtered = PRODUCTS
        .filter(p => {
            const q = search.toLowerCase()
            return (!q || p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q))
                && (!filterTag || p.tags.includes(filterTag))
        })
        .sort((a, b) => sort === 'price' ? a.price - b.price : sort === 'stars' ? b.stars - a.stars : (b.popular ? 1 : 0) - (a.popular ? 1 : 0))

    const ALL_TAGS = [...new Set(PRODUCTS.flatMap(p => p.tags))]
    const avgStars = (REVIEWS.reduce((s, r) => s + r.stars, 0) / REVIEWS.length).toFixed(1)

    return (
        <>
            <SEO 
                title="Produits et Solutions d'Hébergement" 
                description="Explorez notre catalogue de serveurs TrackMania Nations Forever. Solutions managées pour joueurs, streamers et clubs eSport. Qualité premium garantie."
            />
            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": "Nos Produits TrackHost",
                "description": "Serveurs TMNF managés · Configuration instantanée · Pas de compétences requises.",
                "mainEntity": {
                    "@type": "ItemList",
                    "itemListElement": PRODUCTS.map((p, i) => ({
                        "@type": "ListItem",
                        "position": i + 1,
                        "item": {
                            "@type": "Product",
                            "name": p.name,
                            "description": p.desc,
                            "offers": {
                                "@type": "Offer",
                                "price": p.price.toFixed(2),
                                "priceCurrency": "EUR"
                            },
                            "aggregateRating": {
                                "@type": "AggregateRating",
                                "ratingValue": p.stars,
                                "reviewCount": p.reviews
                            }
                        }
                    }))
                }
            }} />
            <div className="page-header">
                <h1 className="page-title">Nos Produits</h1>
                <p className="page-subtitle">Serveurs TMNF managés · Configuration instantanée · Pas de compétences requises</p>
            </div>

            {/* Trust bar */}
            <div className="trust-bar" style={{ marginBottom: 'var(--space-6)' }}>
                {[
                    { icon: Users, v: '2 400+', l: 'serveurs actifs' },
                    { icon: Star, v: avgStars, l: 'note moyenne' },
                    { icon: Clock, v: '< 60s', l: 'de provisionnement' },
                    { icon: Shield, v: '99.9%', l: 'uptime moyen' },
                ].map(({ icon: Icon, v, l }) => (
                    <div key={l} className="trust-item">
                        <Icon size={16} style={{ color: 'var(--primary)' }} />
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--text-high)' }}>{v}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-low)' }}>{l}</span>
                    </div>
                ))}
            </div>

            {/* Search + Filter bar */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 'var(--space-5)', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
                    <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-low)' }} />
                    <input className="input" placeholder="Rechercher un produit…" value={search}
                        onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                    <Filter size={12} style={{ color: 'var(--text-low)' }} />
                    {ALL_TAGS.map(t => (
                        <button key={t} className={`badge ${filterTag === t ? 'badge-cyan' : 'badge-gray'}`} style={{ cursor: 'pointer' }}
                            onClick={() => setFilter(filterTag === t ? '' : t)}>{t}</button>
                    ))}
                </div>
                <select className="input" style={{ width: 'auto', cursor: 'pointer', paddingRight: 36 }} value={sort} onChange={e => setSort(e.target.value as typeof sort)}>
                    <option value="popular">Popularité</option>
                    <option value="price">Prix croissant</option>
                    <option value="stars">Meilleures notes</option>
                </select>
            </div>

            {/* Product grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
                {filtered.map(prod => (
                    <div key={prod.id} className={`card product-card speed-stripe ${prod.popular ? 'product-popular' : ''}`}
                        style={{ borderColor: prod.popular ? prod.color : undefined, position: 'relative' }}>
                        {prod.badge && <div className="plan-badge" style={{ background: prod.color === 'var(--text-mid)' ? 'var(--bg-raised)' : prod.color }}>{prod.badge}</div>}

                        <div style={{ marginBottom: 12 }}>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-low)', marginBottom: 4 }}>{prod.game}</div>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 700, color: 'var(--text-high)', letterSpacing: '0.03em', marginBottom: 8 }}>{prod.name}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <StarRow n={prod.stars} />
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-low)' }}>{prod.stars} ({prod.reviews} avis)</span>
                            </div>
                        </div>

                        <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-mid)', lineHeight: 1.7, marginBottom: 16 }}>{prod.desc}</p>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                            {prod.features.map(f => (
                                <span key={f} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 4, padding: '2px 8px', color: 'var(--text-mid)' }}>
                                    {f}
                                </span>
                            ))}
                        </div>

                        <div className="divider" />

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                            <div>
                                {prod.originalPrice && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-low)', textDecoration: 'line-through' }}>{prod.originalPrice.toFixed(2)}€/mois</div>}
                                <div>
                                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: prod.popular ? prod.color : 'var(--text-high)', letterSpacing: '-0.01em' }}>{prod.price.toFixed(2)}€</span>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-low)', marginLeft: 4 }}>/mois</span>
                                </div>
                                {prod.originalPrice && <span className="badge badge-green" style={{ fontSize: 9 }}>-{Math.round((1 - prod.price / prod.originalPrice) * 100)}%</span>}
                            </div>
                            <Link to="/checkout" className={`btn ${prod.popular ? 'btn-primary' : 'btn-outline'}`} style={{ fontSize: 13, padding: '10px 18px', flexShrink: 0 }}>
                                Commander <ArrowRight size={13} />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Reviews */}
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 'var(--space-5)' }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--text-high)' }}>Avis clients</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <StarRow n={parseFloat(avgStars)} />
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--yellow)' }}>{avgStars}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-low)' }}>/ 5 · {REVIEWS.length} avis vérifiés</span>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 'var(--space-3)' }}>
                    {REVIEWS.map((r, i) => (
                        <div key={i} className="card review-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                    <div className="avatar-circle" style={{ background: 'var(--bg-raised)', color: 'var(--text-mid)' }}>
                                        {r.name.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, color: 'var(--text-high)' }}>{r.name}</div>
                                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-ghost)' }}>Plan {r.plan} · {r.date}</div>
                                    </div>
                                </div>
                                <StarRow n={r.stars} />
                            </div>
                            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-mid)', lineHeight: 1.7 }}>"{r.text}"</p>
                            <div style={{ marginTop: 10 }}><span className="badge badge-green" style={{ fontSize: 9 }}>Achat vérifié</span></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="card" style={{ marginTop: 'var(--space-6)', background: 'linear-gradient(135deg, var(--bg-raised), var(--bg-surface))', textAlign: 'center', padding: 'var(--space-7)' }}>
                <Zap size={28} style={{ color: 'var(--primary)', marginBottom: 12 }} />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: 'var(--text-high)', marginBottom: 8 }}>Pas sûr de votre choix ?</h3>
                <p style={{ color: 'var(--text-mid)', fontSize: 14, marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
                    Commencez avec le Starter et upgradez à tout moment. Garantie 7 jours, aucun risque.
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                    <Link to="/pricing" className="btn btn-outline">Comparer les plans <ChevronRight size={14} /></Link>
                    <Link to="/checkout" className="btn btn-primary">Démarrer maintenant <ArrowRight size={14} /></Link>
                </div>
            </div>
        </>
    )
}
