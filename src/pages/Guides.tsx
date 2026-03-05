import { Link } from 'react-router-dom'
import { BookOpen, ChevronRight, Clock, Target, Map, Trophy, Flame, Gamepad2, Star, ArrowRight } from 'lucide-react'

export const GUIDES = [
    {
        slug: 'trackmania-nations-forever-guide-debutant',
        title: 'Guide Débutant : Débuter sur TrackMania Nations Forever',
        desc: 'Tout ce qu\'il faut savoir pour commencer sur TMNF : téléchargement, premiers circuits, physique du jeu et conseils pour progresser.',
        category: 'Débutant',
        time: '8 min',
        icon: Gamepad2,
        color: 'var(--primary)',
        tags: ['TMNF', 'Débutant', 'Guide'],
    },
    {
        slug: 'techniques-conduite-trackmania',
        title: 'Techniques de conduite avancées sur TrackMania',
        desc: 'Maîtrisez le freinage, le dérapage (slide), l\'accélération et les sauts pour gratter ces précieuses secondes sur vos temps.',
        category: 'Technique',
        time: '12 min',
        icon: Target,
        color: 'var(--cyan)',
        tags: ['Technique', 'Conduite', 'Optimisation'],
    },
    {
        slug: 'environnements-trackmania-nations',
        title: 'Les Environnements de TrackMania Nations Forever',
        desc: 'Comprendre les 5 surfaces de TMNF : Stadium, Desert, Rally, Bay et Coast — leurs physiques, leurs pièges et leurs circuits emblématiques.',
        category: 'Gameplay',
        time: '10 min',
        icon: Map,
        color: 'var(--orange)',
        tags: ['Environnements', 'Stadium', 'Dirt', 'Tech'],
    },
    {
        slug: 'trouver-telecharger-maps-tmnf',
        title: 'Où trouver et télécharger des maps TMNF ?',
        desc: 'Guide complet pour trouver les meilleures maps sur ManiaPlanet Exchange (TMX), les télécharger et les jouer sur votre serveur ou en local.',
        category: 'Maps',
        time: '6 min',
        icon: Map,
        color: 'var(--yellow)',
        tags: ['Maps', 'TMX', 'Circuits'],
    },
    {
        slug: 'records-competition-trackmania',
        title: 'Compétition et Records sur TrackMania Nations Forever',
        desc: 'Comment fonctionnent les records locaux, Dedimania et le ranking mondial ? Guide de la scène compétitive TMNF en 2026.',
        category: 'Compétition',
        time: '9 min',
        icon: Trophy,
        color: 'var(--yellow)',
        tags: ['Records', 'Compétition', 'Dedimania'],
    },
    {
        slug: 'mode-time-attack-trackmania',
        title: 'Maîtriser le Mode Time Attack sur TMNF',
        desc: 'Le TimeAttack est le mode de jeu roi de TrackMania. Apprenez les stratégies pour améliorer vos chronos et monter dans les classements.',
        category: 'Technique',
        time: '7 min',
        icon: Flame,
        color: 'var(--orange)',
        tags: ['Time Attack', 'Chrono', 'Stratégie'],
    },
]

export default function Guides() {
    return (
        <div style={{ maxWidth: 1100, margin: '0 auto', paddingBottom: 64 }}>
            {/* Header */}
            <div style={{ padding: '48px 0 40px', borderBottom: '1px solid var(--border)', marginBottom: 40 }}>
                <div className="badge badge-cyan" style={{ marginBottom: 16 }}>
                    <BookOpen size={10} style={{ marginRight: 4 }} /> Guides Trackmania
                </div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 700, color: 'var(--text-high)', marginBottom: 16, letterSpacing: '0.01em' }}>
                    Guides TrackMania Nations Forever
                </h1>
                <p style={{ fontSize: 16, color: 'var(--text-mid)', maxWidth: 600, lineHeight: 1.7 }}>
                    Tutoriels, techniques et conseils pour progresser sur TMNF — du premier lancement jusqu'aux records de compétition.
                </p>
            </div>

            {/* Guides Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
                {GUIDES.map(({ slug, title, desc, category, time, icon: Icon, color, tags }) => (
                    <Link
                        key={slug}
                        to={`/guides/${slug}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <article
                            className="card"
                            style={{
                                height: '100%', display: 'flex', flexDirection: 'column', gap: 16, padding: 24,
                                transition: 'border-color 200ms, transform 200ms',
                                cursor: 'pointer',
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = color; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ width: 44, height: 44, borderRadius: 10, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size={20} style={{ color }} />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-low)' }}>
                                    <Clock size={10} /> {time}
                                </div>
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                                    {category}
                                </div>
                                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: 'var(--text-high)', marginBottom: 10, lineHeight: 1.35 }}>
                                    {title}
                                </h2>
                                <p style={{ fontSize: 13, color: 'var(--text-mid)', lineHeight: 1.6 }}>
                                    {desc}
                                </p>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                    {tags.slice(0, 2).map(t => (
                                        <span key={t} className="badge badge-gray" style={{ fontSize: 10 }}>{t}</span>
                                    ))}
                                </div>
                                <ChevronRight size={14} style={{ color: 'var(--text-low)' }} />
                            </div>
                        </article>
                    </Link>
                ))}
            </div>

            {/* CTA section */}
            <div className="card" style={{ marginTop: 40, padding: 32, background: 'var(--primary-dim)', border: '1px solid #00FF8720', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <Star size={16} style={{ color: 'var(--primary)' }} />
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-high)' }}>Prêt à jouer avec des amis ?</span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-mid)' }}>
                        Créez votre propre serveur TMNF en 60 secondes et invitez vos amis à appliquer ces techniques ensemble.
                    </p>
                </div>
                <Link to="/checkout" className="btn btn-primary" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
                    Créer un serveur <ArrowRight size={14} />
                </Link>
            </div>
        </div>
    )
}
