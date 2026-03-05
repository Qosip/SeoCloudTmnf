import { useState } from 'react'
import { Check, Zap, Shield, Star, Plus, Minus, ChevronRight, HelpCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

/* ─── Data ────────────────────────────────────────────────────────────────── */
const PLANS = [
    {
        id: 'starter',
        name: 'Starter',
        icon: Zap,
        price: 4.99,
        period: 'mois',
        tagline: 'Parfait pour jouer entre amis',
        color: 'var(--text-mid)',
        highlight: false,
        features: [
            '1 serveur TMNF',
            '8 slots joueurs',
            '512 MB RAM dédiée',
            '1 vCPU',
            'Dashboard web complet',
            'Console RCON',
            'Gestion des maps',
            'Monitoring de base',
            '99.5% uptime SLA',
            'Support communauté',
        ],
        missing: ['XAseco pré-installé', 'Backup automatique', 'IP dédiée', 'Support prioritaire'],
    },
    {
        id: 'pro',
        name: 'Pro',
        icon: Shield,
        price: 9.99,
        period: 'mois',
        tagline: 'Pour les équipes sérieuses',
        color: 'var(--primary)',
        highlight: true,
        badge: 'Le plus populaire',
        features: [
            '3 serveurs TMNF',
            '16 slots joueurs',
            '1 GB RAM dédiée',
            '2 vCPU',
            'Dashboard web complet',
            'Console RCON avancée',
            'Gestion des maps',
            'Monitoring avancé (7j)',
            'XAseco pré-installé',
            'Backup automatique (daily)',
            '99.9% uptime SLA',
            'Support prioritaire (24h)',
        ],
        missing: ['IP dédiée'],
    },
    {
        id: 'elite',
        name: 'Elite',
        icon: Star,
        price: 24.99,
        period: 'mois',
        tagline: 'Pour les événements et eSports',
        color: 'var(--yellow)',
        highlight: false,
        features: [
            'Serveurs illimités',
            '32 slots joueurs',
            '4 GB RAM dédiée',
            '4 vCPU',
            'Dashboard web complet',
            'Console RCON avancée',
            'Gestion des maps',
            'Monitoring avancé (30j)',
            'Tous les plugins inclus',
            'Backup automatique (horaire)',
            'IP dédiée',
            '99.99% uptime SLA',
            'Support 24/7 en direct',
        ],
        missing: [],
    },
]

const ADDONS = [
    { id: 'extra-ram', label: 'RAM supplémentaire', desc: '+512 MB par unité', price: 1.99, unit: 'unité/mois', max: 8 },
    { id: 'extra-slot', label: 'Slots supplémentaires', desc: '+4 slots par unité', price: 0.99, unit: 'unité/mois', max: 4 },
    { id: 'ip-ded', label: 'IP dédiée', desc: 'Adresse IP fixe pour votre serveur', price: 2.49, unit: '/mois', max: 1 },
    { id: 'backup', label: 'Backup horaire', desc: 'Sauvegardes toutes les heures', price: 1.49, unit: '/mois', max: 1 },
    { id: 'xaseco', label: 'XAseco + ManiaLive', desc: 'Pack plugins complet pré-configuré', price: 0.99, unit: '/mois', max: 1 },
]

const REGIONS = [
    { id: 'eu-paris', label: '🇫🇷 Europe — Paris', ping: '~8ms FR', price: 0 },
    { id: 'eu-frankfurt', label: '🇩🇪 Europe — Frankfurt', ping: '~12ms DE', price: 0 },
    { id: 'eu-london', label: '🇬🇧 Europe — London', ping: '~18ms UK', price: 0 },
    { id: 'na-east', label: '🇺🇸 Amérique — East', ping: '~90ms US', price: 0 },
]

const BILLING = ['monthly', 'yearly'] as const
type Billing = typeof BILLING[number]

/* ─── FAQ ─────────────────────────────────────────────────────────────────── */
const FAQ = [
    { q: 'Puis-je changer de plan à tout moment ?', a: 'Oui. Vous pouvez upgrader ou downgrader votre plan à tout moment depuis votre dashboard. La facturation est proratisée.' },
    { q: 'Combien de temps pour lancer mon serveur ?', a: 'Moins de 60 secondes après le paiement. Le serveur est provisionné automatiquement et vous recevez un accès immédiat à votre panel.' },
    { q: 'Puis-je avoir mon propre IP ?', a: "Oui, l'option IP dédiée est disponible en add-on pour le plan Starter et Pro, et incluse dans Elite." },
    { q: 'Quelle est votre politique de remboursement ?', a: 'Nous offrons une garantie satisfait ou remboursé de 7 jours sur votre premier mois.' },
    { q: 'Puis-je installer mes propres plugins ?', a: 'Absolument. Vous pouvez uploader et gérer tous les plugins compatibles TMNF depuis le panel de gestion.' },
]

/* ─── Components ──────────────────────────────────────────────────────────── */
function AddonCounter({ max, price }: { max: number; price: number }) {
    const [count, setCount] = useState(0)
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => setCount(Math.max(0, count - 1))} className="btn btn-ghost" style={{ padding: '4px 8px', minWidth: 28 }} disabled={count === 0}><Minus size={11} /></button>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-high)', minWidth: 20, textAlign: 'center' }}>{count}</span>
            <button onClick={() => setCount(Math.min(max, count + 1))} className="btn btn-ghost" style={{ padding: '4px 8px', minWidth: 28 }} disabled={count === max}><Plus size={11} /></button>
            {count > 0 && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--primary)' }}>+{(price * count).toFixed(2)}€</span>}
        </div>
    )
}

export default function Pricing() {
    const [billing, setBilling] = useState<Billing>('monthly')
    const [selected, setSelected] = useState('pro')
    const [region, setRegion] = useState('eu-paris')
    const [openFaq, setOpenFaq] = useState<number | null>(null)

    const disc = billing === 'yearly' ? 0.8 : 1

    return (
        <div className="pricing-page">
            {/* ── Header ── */}
            <div className="pricing-header">
                <div className="badge badge-green" style={{ marginBottom: 16 }}>Tarifs transparents · Sans engagement</div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px,5vw,60px)', fontWeight: 700, color: 'var(--text-high)', letterSpacing: '0.01em', lineHeight: 1.05, marginBottom: 16 }}>
                    Des serveurs puissants,<br />des prix <span style={{ color: 'var(--primary)' }}>honnêtes.</span>
                </h1>
                <p style={{ fontSize: 16, color: 'var(--text-mid)', maxWidth: 520, margin: '0 auto 32px', lineHeight: 1.7 }}>
                    Payez uniquement ce que vous utilisez. Pas de frais cachés, pas de contrats longue durée.
                </p>

                {/* Billing toggle */}
                <div className="billing-toggle">
                    <button className={`bill-btn ${billing === 'monthly' ? 'active' : ''}`} onClick={() => setBilling('monthly')}>Mensuel</button>
                    <button className={`bill-btn ${billing === 'yearly' ? 'active' : ''}`} onClick={() => setBilling('yearly')}>
                        Annuel
                        <span className="badge badge-green" style={{ marginLeft: 8, fontSize: 9, padding: '1px 6px' }}>-20%</span>
                    </button>
                </div>
            </div>

            {/* ── Plan Cards ── */}
            <div className="plans-grid">
                {PLANS.map(plan => {
                    const Icon = plan.icon
                    const finalPrice = (plan.price * disc).toFixed(2)
                    const isSelected = selected === plan.id
                    return (
                        <div
                            key={plan.id}
                            className={`plan-card card ${plan.highlight ? 'plan-highlight' : ''} ${isSelected ? 'plan-selected' : ''}`}
                            style={{ borderColor: isSelected ? plan.color : undefined, cursor: 'pointer' }}
                            onClick={() => setSelected(plan.id)}
                        >
                            {plan.badge && <div className="plan-badge" style={{ background: plan.color }}>{plan.badge}</div>}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                                <div style={{ width: 36, height: 36, background: `color-mix(in oklch, ${plan.color} 15%, transparent)`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size={18} style={{ color: plan.color }} />
                                </div>
                                <div>
                                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--text-high)', letterSpacing: '0.04em' }}>{plan.name}</div>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-low)' }}>{plan.tagline}</div>
                                </div>
                            </div>

                            <div style={{ marginBottom: 20 }}>
                                <span style={{ fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 700, color: plan.highlight ? plan.color : 'var(--text-high)', letterSpacing: '-0.02em' }}>{finalPrice}€</span>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-low)', marginLeft: 4 }}>/{plan.period}</span>
                                {billing === 'yearly' && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--primary)', marginTop: 2 }}>soit {(plan.price * 12 * disc).toFixed(0)}€/an</div>}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                                {plan.features.map(f => (
                                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                        <Check size={13} style={{ color: plan.color, flexShrink: 0, marginTop: 1 }} />
                                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-mid)' }}>{f}</span>
                                    </div>
                                ))}
                                {plan.missing?.map(f => (
                                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, opacity: 0.35 }}>
                                        <Minus size={13} style={{ color: 'var(--text-low)', flexShrink: 0, marginTop: 1 }} />
                                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-low)', textDecoration: 'line-through' }}>{f}</span>
                                    </div>
                                ))}
                            </div>

                            <Link to="/checkout" className={`btn ${plan.highlight ? 'btn-primary' : 'btn-outline'}`}
                                style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}>
                                Choisir {plan.name} <ChevronRight size={14} />
                            </Link>
                        </div>
                    )
                })}
            </div>

            {/* ── Configurator ── */}
            <div className="config-section">
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--text-high)', letterSpacing: '0.02em', marginBottom: 8 }}>
                    Configurez votre serveur
                </h2>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-low)', marginBottom: 32 }}>
                    Personnalisez votre plan avec les options ci-dessous
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                    {/* Region */}
                    <div className="card">
                        <div className="card-title" style={{ marginBottom: 16 }}>🌍 Région du serveur</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {REGIONS.map(r => (
                                <label key={r.id} className={`region-row ${region === r.id ? 'active' : ''}`} onClick={() => setRegion(r.id)}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                        <div className={`radio-dot ${region === r.id ? 'checked' : ''}`} />
                                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-high)' }}>{r.label}</span>
                                    </div>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--primary)' }}>{r.ping}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Add-ons */}
                    <div className="card">
                        <div className="card-title" style={{ marginBottom: 16 }}>⚡ Options supplémentaires</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {ADDONS.map(addon => (
                                <div key={addon.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-raised)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                                    <div>
                                        <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, color: 'var(--text-high)' }}>{addon.label}</div>
                                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-low)', marginTop: 2 }}>
                                            {addon.desc} · {addon.price.toFixed(2)}€ {addon.unit}
                                        </div>
                                    </div>
                                    <AddonCounter max={addon.max} price={addon.price} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Comparison Table ── */}
            <div className="config-section">
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--text-high)', marginBottom: 24 }}>Comparatif détaillé</h2>
                <div className="card" style={{ overflowX: 'auto' }}>
                    <table className="compare-table">
                        <thead>
                            <tr>
                                <th>Fonctionnalité</th>
                                {PLANS.map(p => <th key={p.id} style={{ color: p.color }}>{p.name}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                ['Nombre de serveurs', '1', '3', 'Illimité'],
                                ['Slots joueurs max', '8', '16', '32'],
                                ['RAM dédiée', '512 MB', '1 GB', '4 GB'],
                                ['vCPU', '1', '2', '4'],
                                ['Historique monitoring', '24h', '7 jours', '30 jours'],
                                ['XAseco / ManiaLive', '❌', '✅', '✅'],
                                ['Backup automatique', '❌', 'Daily', 'Horaire'],
                                ['IP dédiée', '❌', 'Option', '✅'],
                                ['SLA uptime', '99.5%', '99.9%', '99.99%'],
                                ['Support', 'Communauté', '24h', '24/7 live'],
                            ].map(([feat, ...vals]) => (
                                <tr key={feat}>
                                    <td>{feat}</td>
                                    {vals.map((v, i) => <td key={i} style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{v}</td>)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── FAQ ── */}
            <div className="config-section">
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--text-high)', marginBottom: 24 }}>
                    <HelpCircle size={20} style={{ display: 'inline', marginRight: 8, color: 'var(--primary)' }} />
                    Questions fréquentes
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 720 }}>
                    {FAQ.map((f, i) => (
                        <div key={i} className="faq-item card" onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ cursor: 'pointer' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                                <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: 'var(--text-high)', letterSpacing: '0.02em' }}>{f.q}</span>
                                <ChevronRight size={14} style={{ color: 'var(--text-low)', transform: openFaq === i ? 'rotate(90deg)' : 'none', transition: 'transform 200ms', flexShrink: 0 }} />
                            </div>
                            {openFaq === i && <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-mid)', marginTop: 12, lineHeight: 1.7 }}>{f.a}</p>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
