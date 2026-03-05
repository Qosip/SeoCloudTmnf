import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Tag, Zap, Star, Copy, Check, TrendingDown, Gift, ArrowRight } from 'lucide-react'

const PROMOS = [
    {
        id: 'LAUNCH30',
        title: '🚀 Lancement TrackHost',
        desc: '30% de réduction sur votre premier mois sur tous les plans. Offre limitée aux 500 premiers inscrits.',
        discount: '-30%',
        expires: '31 mars 2026',
        code: 'LAUNCH30',
        color: 'var(--primary)',
        bg: 'var(--primary-dim)',
        badge: 'Populaire',
        urgent: true,
        remaining: 127,
    },
    {
        id: 'ANNUAL20',
        title: '📅 Pack Annuel',
        desc: "Passez à la facturation annuelle et économisez 20% toute l'année. Sans engagement supplémentaire.",
        discount: '-20%',
        expires: 'Permanent',
        code: 'ANNUAL20',
        color: 'var(--cyan)',
        bg: 'var(--cyan-dim)',
        badge: null,
        urgent: false,
        remaining: null,
    },
    {
        id: 'ESPORT50',
        title: '🏆 Équipe eSport',
        desc: '50% sur le plan Elite pour les équipes enregistrées. Cumulable avec le code annuel.',
        discount: '-50%',
        expires: '30 juin 2026',
        code: 'ESPORT50',
        color: 'var(--yellow)',
        bg: '#FFD70015',
        badge: 'Exclusif',
        urgent: false,
        remaining: null,
    },
    {
        id: 'STREAM25',
        title: '🎮 Pack Streamers',
        desc: "25% de réduction sur n'importe quel plan pour les créateurs de contenu. Validation via la Bio Twitch/YouTube.",
        discount: '-25%',
        expires: '15 mai 2026',
        code: 'STREAM25',
        color: 'var(--orange)',
        bg: '#FF8C0015',
        badge: 'Réservé',
        urgent: false,
        remaining: null,
    },
]

const SEASONAL = [
    { label: 'Printemps Tech', off: '15%', plan: 'Starter', ends: '30 avr.' },
    { label: 'Black Friday 2026', off: '40%', plan: 'Tutti', ends: 'No. 2026' },
    { label: 'Bundle Amis', off: '1 mois offert', plan: 'Pour 3 achats', ends: 'Mai 2026' },
]

function useCountdown(target: string) {
    const diff = new Date(target).getTime() - Date.now()
    const d = Math.max(0, Math.floor(diff / 86400000))
    const h = Math.max(0, Math.floor((diff % 86400000) / 3600000))
    return { d, h }
}

function PromoCard({ promo }: { promo: typeof PROMOS[0] }) {
    const [copied, setCopied] = useState(false)
    const { d, h } = useCountdown('2026-03-31')

    function copy() {
        navigator.clipboard.writeText(promo.code).catch(() => { })
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="card speed-stripe promo-card" style={{ borderColor: promo.color + '40', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: 120, height: 120, background: `radial-gradient(circle, ${promo.color}10 0%, transparent 70%)`, pointerEvents: 'none' }} />
            {promo.badge && <div className="plan-badge" style={{ background: promo.color, top: 12, right: 12 }}>{promo.badge}</div>}

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
                <div style={{ fontSize: 32 }}>{promo.title.split(' ')[0]}</div>
                <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-high)', letterSpacing: '0.03em' }}>
                        {promo.title.slice(promo.title.indexOf(' ') + 1)}
                    </h3>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: promo.color, letterSpacing: '-0.01em' }}>
                        {promo.discount}
                    </div>
                </div>
            </div>

            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-mid)', lineHeight: 1.7, marginBottom: 16 }}>{promo.desc}</p>

            {promo.urgent && (
                <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                    {[{ l: 'Jours', v: d }, { l: 'Heures', v: h }].map(({ l, v }) => (
                        <div key={l} style={{ textAlign: 'center', background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 16px', minWidth: 60 }}>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: promo.color }}>{v}</div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-low)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{l}</div>
                        </div>
                    ))}
                    {promo.remaining && <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--orange)' }}>
                        <TrendingDown size={12} /> {promo.remaining} restants
                    </div>}
                </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, background: 'var(--bg-void)', border: '1px dashed var(--border-bright)', borderRadius: 8, padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: promo.color, letterSpacing: '0.1em' }}>
                    {promo.code}
                </div>
                <button className="btn btn-ghost" style={{ padding: '10px 14px', flexShrink: 0 }} onClick={copy}>
                    {copied ? <><Check size={13} style={{ color: 'var(--primary)' }} /> Copié</> : <><Copy size={13} /> Copier</>}
                </button>
                <Link to="/checkout" className="btn btn-primary" style={{ padding: '10px 16px', flexShrink: 0, fontSize: 13 }}>
                    Utiliser <ArrowRight size={13} />
                </Link>
            </div>

            <div style={{ marginTop: 12, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-ghost)' }}>
                <Clock size={9} style={{ display: 'inline', marginRight: 4 }} /> Expire le {promo.expires}
            </div>
        </div>
    )
}

export default function Promo() {
    return (
        <div className="pricing-page">
            <div className="pricing-header">
                <div className="badge badge-green" style={{ marginBottom: 16 }}>
                    <Gift size={11} /> Offres & Promotions
                </div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,4vw,52px)', fontWeight: 700, color: 'var(--text-high)', letterSpacing: '0.01em', lineHeight: 1.05, marginBottom: 16 }}>
                    Des économies pour<br />chaque joueur.
                </h1>
                <p style={{ fontSize: 15, color: 'var(--text-mid)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
                    Codes promos, packs saisonniers, offres exclusives — vérifiez régulièrement pour ne rien manquer.
                </p>
            </div>

            {/* Urgent banner */}
            <div style={{ background: 'linear-gradient(90deg, #00FF8710, #00D4FF10)', border: '1px solid #00FF8730', borderRadius: 'var(--radius-lg)', padding: '16px 24px', marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <Zap size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--text-high)', letterSpacing: '0.02em' }}>Flash Sale — 48h restantes</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-mid)', marginLeft: 12 }}>Utilisez LAUNCH30 avant la fin</span>
                </div>
                <Link to="/checkout" className="btn btn-primary" style={{ fontSize: 13, padding: '8px 18px' }}>En profiter <ArrowRight size={12} /></Link>
            </div>

            {/* Promo cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
                {PROMOS.map(p => <PromoCard key={p.id} promo={p} />)}
            </div>

            {/* Seasonal table */}
            <div style={{ maxWidth: 700, margin: '0 auto' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--text-high)', marginBottom: 20 }}>
                    <Star size={18} style={{ display: 'inline', marginRight: 8, color: 'var(--yellow)' }} />
                    Calendrier des promotions à venir
                </h2>
                <div className="card">
                    <table className="compare-table">
                        <thead>
                            <tr><th>Promotion</th><th>Réduction</th><th>Plan</th><th>Fin</th></tr>
                        </thead>
                        <tbody>
                            {SEASONAL.map(s => (
                                <tr key={s.label}>
                                    <td>{s.label}</td>
                                    <td style={{ textAlign: 'center' }}><span className="badge badge-green">{s.off}</span></td>
                                    <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{s.plan}</td>
                                    <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-mid)' }}>{s.ends}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-ghost)', marginTop: 16, textAlign: 'center' }}>
                    <Tag size={10} style={{ display: 'inline', marginRight: 4 }} />
                    Les codes cumulables sont indiqués dans la description de chaque offre.
                </p>
            </div>
        </div>
    )
}
