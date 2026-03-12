import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
    Zap, Server, Terminal, Map, BarChart2, ChevronRight, ArrowRight,
    Star, BookOpen, MessageSquare, Tag, Gift, ShoppingBag, LogIn,
    Check, Users, Cpu, Activity, Clock, HelpCircle, LayoutDashboard, Layers,
    BarChart3, Settings, Gamepad2
} from 'lucide-react'
import JsonLd from '../components/JsonLd'
import SEO from '../components/SEO'
import './pages.css'

/* ─── Data ──────────────────────────────────────────────────────────────── */
const REVIEWS = [
    { name: 'Speedy_TM', plan: 'Pro', stars: 5, text: "XAseco installé en 1 clic, uptime parfait depuis 3 mois. Je ne reviens pas en arrière." },
    { name: 'GhostLine', plan: 'Elite', stars: 5, text: "32 slots, jamais eu de coupure en tournoi. Le support a réglé un souci en 2h." },
    { name: 'Turbo_K', plan: 'Starter', stars: 5, text: "5€/mois pour un serveur complet. Setup en 2 minutes. Je recommande à 100%." },
    { name: 'NeonDrift', plan: 'Flash', stars: 4, text: "Le serveur 24h est parfait pour mes streams. Simple et pas cher." },
]

function StarRow({ n }: { n: number }) {
    return <div style={{ display: 'flex', gap: 2 }}>
        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={11} style={{ color: i <= n ? 'var(--yellow)' : 'var(--border-bright)', fill: i <= n ? 'var(--yellow)' : 'transparent' }} />)}
    </div>
}

/* ─── Nav Dropdown (avec délai pour faciliter la sélection) ────────────────── */

function NavDropdown({ trigger, children }: { trigger: React.ReactNode; children: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const clearClose = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }
    }
    const scheduleClose = () => {
        clearClose()
        setOpen(false)
    }

    return (
        <div
            className="nav-item-has-dropdown"
            onMouseEnter={() => { clearClose(); setOpen(true) }}
            onMouseLeave={scheduleClose}
        >
            {trigger}
            <div className={`nav-dropdown ${open ? 'nav-dropdown-open' : ''}`}>
                {children}
            </div>
        </div>
    )
}

/* ─── Component ──────────────────────────────────────────────────────────── */
export default function Landing() {
    return (
        <div className="landing">
            <SEO
                title="Hébergement Serveur TrackMania Nations Forever"
                description="La plateforme de référence pour l'hébergement de serveurs TMNF. Déploiement instantané, interface intuitive et support expert. Créez votre serveur en 60 secondes."
            />
            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "TrackHost",
                "url": "https://www.trackhost.gg",
                "description": "La plateforme de référence pour l'hébergement de serveurs TrackMania Nations Forever.",
                "publisher": {
                    "@type": "Organization",
                    "name": "TrackHost, Inc.",
                    "logo": {
                        "@type": "ImageObject",
                        "url": "https://www.trackhost.gg/assets/logo.png"
                    }
                }
            }} />

            {/* ── Top Nav ── */}
            <nav className="landing-nav" style={{ overflow: 'visible' }}>
                <div className="landing-logo">
                    <div className="sidebar-logo-icon" style={{ width: 28, height: 28 }}><Zap size={14} /></div>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, letterSpacing: '0.05em', color: 'var(--text-high)' }}>TrackHost</span>
                </div>

                <div className="landing-nav-links">
                    {/* Boutique */}
                    <NavDropdown trigger={<button className="landing-nav-link"><ShoppingBag size={12} /> Boutique</button>}>
                        <div className="dropdown-title">Acheter</div>
                        <Link to="/products" className="dropdown-link"><ShoppingBag size={14} /> <span>Catalogue Serveurs</span></Link>
                        <Link to="/pricing" className="dropdown-link"><Tag size={14} /> <span>Grille Tarifaire</span></Link>
                        <Link to="/products" className="dropdown-link"><BarChart3 size={14} /> <span>Comparer les plans</span></Link>
                        <div className="dropdown-title">Offres</div>
                        <Link to="/promotions" className="dropdown-link"><Gift size={14} /> <span style={{ color: 'var(--primary)' }}>Promotions Actives</span></Link>
                        <Link to="/checkout" className="dropdown-link"><Zap size={14} /> <span>Commander un serveur</span></Link>
                    </NavDropdown>

                    {/* Mon Serveur */}
                    <NavDropdown trigger={<button className="landing-nav-link"><Server size={12} /> Mon Serveur</button>}>
                        <div className="dropdown-title">Gestion</div>
                        <Link to="/servers" className="dropdown-link"><Layers size={14} /> <span>Mes Serveurs</span></Link>
                        <Link to="/dashboard" className="dropdown-link"><LayoutDashboard size={14} /> <span>Dashboard Live</span></Link>
                        <Link to="/settings" className="dropdown-link"><Settings size={14} /> <span>Paramètres</span></Link>
                        <div className="dropdown-title">Outils</div>
                        <Link to="/console" className="dropdown-link"><Terminal size={14} /> <span>Console RCON</span></Link>
                        <Link to="/maps" className="dropdown-link"><Map size={14} /> <span>Maps &amp; Plugins</span></Link>
                    </NavDropdown>

                    {/* Ressources */}
                    <NavDropdown trigger={<button className="landing-nav-link"><BookOpen size={12} /> Ressources</button>}>
                        <div className="dropdown-title">Guides Jeu</div>
                        <Link to="/guides" className="dropdown-link"><Gamepad2 size={14} /> <span>Guides TrackMania</span></Link>
                        <Link to="/guides/trackmania-nations-forever-guide-debutant" className="dropdown-link"><Star size={14} /> <span>Guide Débutant TMNF</span></Link>
                        <Link to="/guides/techniques-conduite-trackmania" className="dropdown-link"><ArrowRight size={14} /> <span>Techniques de conduite</span></Link>
                        <Link to="/guides/trouver-telecharger-maps-tmnf" className="dropdown-link"><Map size={14} /> <span>Trouver des maps</span></Link>
                        <div className="dropdown-title">Documentation</div>
                        <Link to="/docs" className="dropdown-link"><BookOpen size={14} /> <span>Documentation Complète</span></Link>
                        <Link to="/docs/create-first-server" className="dropdown-link"><Server size={14} /> <span>Guide de Configuration</span></Link>
                        <Link to="/docs/rcon-commands" className="dropdown-link"><Terminal size={14} /> <span>Commandes RCON</span></Link>
                        <div className="dropdown-title">Communauté</div>
                        <Link to="/blog" className="dropdown-link"><MessageSquare size={14} /> <span>Forum &amp; Blog</span></Link>
                        <Link to="/support" className="dropdown-link"><HelpCircle size={14} /> <span>Ouvrir un Ticket</span></Link>
                    </NavDropdown>
                </div>

                <div className="landing-nav-actions">
                    <Link to="/login" className="btn btn-ghost" style={{ fontSize: 13, padding: '10px 18px' }}><LogIn size={14} /> Connexion</Link>
                    <Link to="/checkout" className="btn btn-primary" style={{ fontSize: 13, padding: '10px 20px' }}>Commander <ChevronRight size={14} /></Link>
                </div>
            </nav>

            {/* ── Promo Banner ── */}
            <Link to="/promotions" style={{ textDecoration: 'none' }}>
                <div style={{ background: 'linear-gradient(90deg, var(--primary-dim), var(--cyan-dim))', borderBottom: '1px solid #00FF8730', padding: '10px 48px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                    <Gift size={14} style={{ color: 'var(--primary)' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-mid)' }}>
                        🚀 <strong style={{ color: 'var(--primary)' }}>-30% sur votre 1er mois</strong> avec le code <strong style={{ color: 'var(--primary)', letterSpacing: '0.1em' }}>LAUNCH30</strong> — Offre limitée aux 127 prochains inscrits
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 4 }}>Voir l'offre <ArrowRight size={11} /></span>
                </div>
            </Link>

            {/* ── Hero ── */}
            <section className="landing-hero speed-stripe">
                <div className="hero-glow" />
                <div className="hero-content">
                    <div className="badge badge-green" style={{ marginBottom: 20 }}>
                        <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)' }} />
                        Bêta ouverte — TMNF disponible maintenant
                    </div>
                    <h1 className="hero-title">
                        Votre serveur <span className="hero-highlight">TrackMania</span><br />en un seul clic.
                    </h1>
                    <p className="hero-sub">
                        TrackHost gère toute l'infrastructure à votre place — aucun Linux, aucun SSH.
                        Dashboard, RCON, maps, plugins, monitoring : tout depuis votre navigateur.
                    </p>
                    <div className="hero-actions">
                        <Link to="/checkout" className="btn btn-primary" style={{ fontSize: 15, padding: '12px 28px' }}>
                            Créer mon serveur <ArrowRight size={16} />
                        </Link>
                        <Link to="/products" className="btn btn-ghost" style={{ fontSize: 14, padding: '12px 22px' }}>
                            Voir les produits
                        </Link>
                    </div>
                    <p className="hero-footnote">Aucune compétence technique · Serveur actif en {"< 60s"} · Annulation à tout moment</p>
                </div>

                {/* Terminal mockup */}
                <div className="hero-terminal">
                    <div className="terminal-bar">
                        <span className="t-dot red" /><span className="t-dot orange" /><span className="t-dot green" />
                        <span className="terminal-bar-title">trackhost-console</span>
                    </div>
                    <div className="terminal-body">
                        <div className="t-line"><span className="t-prompt">$</span> server.start()</div>
                        <div className="t-line muted">Provisioning container...</div>
                        <div className="t-line muted">Loading maps: <span className="t-hl">24 maps</span></div>
                        <div className="t-line muted">Installing XAseco <span className="t-hl">1.16.4</span>...</div>
                        <div className="t-line muted">Binding port <span className="t-hl">2350</span></div>
                        <div className="t-line success">✓ Server online · 0/16 players</div>
                        <div className="t-line"><span className="t-prompt">$</span> <span className="t-cursor">_</span></div>
                    </div>
                </div>
            </section>

            {/* ── Stats strip ── */}
            <div style={{ display: 'flex', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                {[
                    { icon: Users, v: '2 400+', l: 'serveurs actifs' },
                    { icon: Activity, v: '99.9%', l: 'uptime moyen' },
                    { icon: Clock, v: '< 60s', l: 'de déploiement' },
                    { icon: Cpu, v: '24/7', l: 'monitoring live' },
                ].map(({ icon: Icon, v, l }) => (
                    <div key={l} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, padding: '20px 32px', borderRight: '1px solid var(--border)' }}>
                        <Icon size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                        <div>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--text-high)', letterSpacing: '0.02em' }}>{v}</div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-low)' }}>{l}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Features ── */}
            <section className="landing-section" id="features">
                <div className="section-label">Fonctionnalités</div>
                <h2 className="section-title">Tout ce dont vous avez besoin.<br />Rien de ce dont vous n'avez pas besoin.</h2>
                <div className="features-grid">
                    {[
                        { icon: Server, color: 'var(--primary)', label: 'Zéro Infra', desc: 'Isolation totale. Aucun SSH. Votre serveur tourne dans un conteneur sécurisé, géré par nos équipes.' },
                        { icon: Terminal, color: 'var(--cyan)', label: 'Console RCON Live', desc: 'Kick, ban, restart map, voir le chat — tout depuis le navigateur, en temps réel.' },
                        { icon: Map, color: 'var(--orange)', label: 'Gestion des Maps', desc: 'Upload vos circuits, modifiez dedicated_cfg, installez XAseco en un clic.' },
                        { icon: BarChart2, color: 'var(--yellow)', label: 'Monitoring Gaming', desc: 'Joueurs, ping, CPU/RAM — graphiques en direct, mis à jour toutes les 2 secondes.' },
                    ].map(({ icon: Icon, color, label, desc }) => (
                        <div className="feature-card card speed-stripe" key={label}>
                            <div className="feature-icon" style={{ '--icon-color': color } as React.CSSProperties}><Icon size={20} /></div>
                            <h3 className="feature-title">{label}</h3>
                            <p className="feature-desc">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Plans preview ── */}
            <section className="landing-section" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                <div className="section-label">Tarifs</div>
                <h2 className="section-title">Simple. Transparent. Honnête.</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
                    {[
                        { name: 'Starter', price: '4.99', color: 'var(--text-mid)', features: ['8 joueurs', '512 MB RAM', 'Console RCON', 'Gestion maps'] },
                        { name: 'Pro', price: '9.99', color: 'var(--primary)', features: ['16 joueurs', '1 GB RAM', 'XAseco inclus', 'Backup daily'], highlight: true },
                        { name: 'Elite', price: '24.99', color: 'var(--yellow)', features: ['32 joueurs', '4 GB RAM', 'Plugins illimités', 'IP dédiée'] },
                    ].map(plan => (
                        <div key={plan.name} className="card" style={{ borderColor: plan.highlight ? 'var(--primary)' : undefined, boxShadow: plan.highlight ? '0 0 30px rgba(0,255,135,0.08)' : undefined }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-high)' }}>{plan.name}</span>
                                <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: plan.highlight ? plan.color : 'var(--text-high)' }}>
                                    {plan.price}€<span style={{ fontSize: 12, color: 'var(--text-low)', fontWeight: 500 }}>/mo</span>
                                </span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                                {plan.features.map(f => (
                                    <div key={f} style={{ display: 'flex', gap: 6 }}>
                                        <Check size={12} style={{ color: plan.color, flexShrink: 0, marginTop: 2 }} />
                                        <span style={{ fontSize: 12, color: 'var(--text-mid)' }}>{f}</span>
                                    </div>
                                ))}
                            </div>
                            <Link to="/checkout" className={`btn ${plan.highlight ? 'btn-primary' : 'btn-outline'}`} style={{ width: '100%', justifyContent: 'center' }}>
                                Choisir {plan.name}
                            </Link>
                        </div>
                    ))}
                </div>
                <div style={{ textAlign: 'center' }}>
                    <Link to="/pricing" className="btn btn-ghost">Voir tous les détails et options <ChevronRight size={14} /></Link>
                </div>
            </section>

            {/* ── Personas ── */}
            <section className="landing-section">
                <div className="section-label">Pour qui ?</div>
                <h2 className="section-title">Pensé pour chaque profil de joueur.</h2>
                <div className="personas-grid">
                    {[
                        { emoji: '🎮', title: 'Entre potes', desc: 'Un serveur privé rapide pour jouer vos propres circuits avec vos amis le weekend.' },
                        { emoji: '🏆', title: 'Tournois eSport', desc: 'Des performances garanties, IP dédiée et 32 slots pour héberger vos compétitions sans lag.' },
                        { emoji: '🛠️', title: 'Créateurs & Mappeurs', desc: 'Testez vos maps online instantanément avec accès RCON total et logs serveur.' },
                    ].map(p => (
                        <div key={p.title} className="persona-card card">
                            <div className="persona-emoji">{p.emoji}</div>
                            <h3 className="persona-title">{p.title}</h3>
                            <p className="persona-desc">{p.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Testimonials ── */}
            <section className="landing-section" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)' }}>
                <div className="section-label">Avis Communauté</div>
                <h2 className="section-title">Ce qu'ils en pensent.</h2>
                <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 16 }}>
                    {REVIEWS.map(r => (
                        <div key={r.name} className="card" style={{ minWidth: 280, flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                <div>
                                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text-high)' }}>{r.name}</div>
                                    <div style={{ fontSize: 11, color: 'var(--text-low)', fontFamily: 'var(--font-mono)' }}>Plan {r.plan}</div>
                                </div>
                                <StarRow n={r.stars} />
                            </div>
                            <p style={{ fontSize: 13, color: 'var(--text-mid)', lineHeight: 1.6, fontStyle: 'italic' }}>"{r.text}"</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Ressources section ── */}
            <section className="landing-section resources-section">
                <div className="section-label" style={{ textAlign: 'center' }}>Ressources</div>
                <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 48 }}>Plus à découvrir</h2>
                <div className="resources-grid">
                    <Link to="/docs" className="resource-card resource-card-cyan">
                        <div className="resource-icon"><BookOpen size={28} /></div>
                        <h3 className="resource-title">Documentation</h3>
                        <p className="resource-desc">Guides complets, commandes RCON, installation XAseco, dedicated_cfg et dépannage.</p>
                        <span className="resource-cta">Explorer la doc <ArrowRight size={14} /></span>
                    </Link>
                    <Link to="/docs/create-first-server" className="resource-card resource-card-primary">
                        <div className="resource-icon"><Server size={28} /></div>
                        <h3 className="resource-title">Guide de configuration</h3>
                        <p className="resource-desc">Déployez votre premier serveur TMNF en moins de 60 secondes. Pas de compétences techniques requises.</p>
                        <span className="resource-cta">Démarrer <ArrowRight size={14} /></span>
                    </Link>
                    <Link to="/blog" className="resource-card resource-card-orange">
                        <div className="resource-icon"><MessageSquare size={28} /></div>
                        <h3 className="resource-title">Forum & Blog</h3>
                        <p className="resource-desc">Communauté active, astuces serveur, tutoriels et annonces de la plateforme.</p>
                        <span className="resource-cta">Rejoindre <ArrowRight size={14} /></span>
                    </Link>
                    <Link to="/promotions" className="resource-card resource-card-green">
                        <div className="resource-icon"><Gift size={28} /></div>
                        <h3 className="resource-title">Promotions</h3>
                        <p className="resource-desc">Codes de réduction et offres limitées pour vos hébergements TrackMania.</p>
                        <span className="resource-cta">Voir les offres <ArrowRight size={14} /></span>
                    </Link>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="landing-footer" style={{ borderTop: '1px solid var(--border)', padding: '48px 48px', marginTop: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 32, marginBottom: 48, textAlign: 'left' }}>
                    <div>
                        <div className="landing-logo" style={{ marginBottom: 16 }}>
                            <div className="sidebar-logo-icon" style={{ width: 24, height: 24 }}><Zap size={12} /></div>
                            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--text-high)' }}>TrackHost</span>
                        </div>
                        <p style={{ fontSize: 12, color: 'var(--text-low)', lineHeight: 1.6, maxWidth: 260 }}>
                            La plateforme de référence pour l'hébergement de serveurs TrackMania Nations Forever. Zéro prise de tête, 100% de fun.
                        </p>
                    </div>
                    <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-high)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 16, letterSpacing: '0.05em' }}>Boutique</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <Link to="/products" style={{ fontSize: 13, color: 'var(--text-mid)', textDecoration: 'none' }}>Produits</Link>
                            <Link to="/pricing" style={{ fontSize: 13, color: 'var(--text-mid)', textDecoration: 'none' }}>Tarifs</Link>
                            <Link to="/promotions" style={{ fontSize: 13, color: 'var(--text-mid)', textDecoration: 'none' }}>Promotions</Link>
                        </div>
                    </div>
                    <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-high)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 16, letterSpacing: '0.05em' }}>Serveurs</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <Link to="/dashboard" style={{ fontSize: 13, color: 'var(--text-mid)', textDecoration: 'none' }}>Dashboard Live</Link>
                            <Link to="/console" style={{ fontSize: 13, color: 'var(--text-mid)', textDecoration: 'none' }}>Console RCON</Link>
                            <Link to="/maps" style={{ fontSize: 13, color: 'var(--text-mid)', textDecoration: 'none' }}>Maps & Plugins</Link>
                        </div>
                    </div>
                    <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-high)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 16, letterSpacing: '0.05em' }}>Ressources</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <Link to="/guides" style={{ fontSize: 13, color: 'var(--text-mid)', textDecoration: 'none' }}>Guides TMNF</Link>
                            <Link to="/blog" style={{ fontSize: 13, color: 'var(--text-mid)', textDecoration: 'none' }}>Communauté</Link>
                            <Link to="/docs" style={{ fontSize: 13, color: 'var(--text-mid)', textDecoration: 'none' }}>Documentation</Link>
                            <Link to="/support" style={{ fontSize: 13, color: 'var(--text-mid)', textDecoration: 'none' }}>Support Client</Link>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 24 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-low)' }}>© 2026 TrackHost, Inc. Tous droits réservés.</span>
                    <div style={{ display: 'flex', gap: 16 }}>
                        <span style={{ fontSize: 12, color: 'var(--text-low)', cursor: 'pointer' }}>CGU</span>
                        <span style={{ fontSize: 12, color: 'var(--text-low)', cursor: 'pointer' }}>Confidentialité</span>
                        <span style={{ fontSize: 12, color: 'var(--text-low)', cursor: 'pointer' }}>Mentions Légales</span>
                    </div>
                </div>
            </footer>
        </div>
    )
}
