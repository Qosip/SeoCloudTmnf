import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    Plus, Server, Activity, Users, Cpu, Wifi, Play, Square, RotateCcw,
    Terminal, Settings, ChevronRight, Zap, Clock, Map, ExternalLink
} from 'lucide-react'
import SEO from '../components/SEO'

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface GameServer {
    id: string
    name: string
    plan: 'Starter' | 'Pro' | 'Elite' | 'Flash'
    status: 'online' | 'offline' | 'restarting'
    players: number
    maxPlayers: number
    cpu: number
    ping: number
    ram: number
    ramMax: number
    region: string
    map: string
    uptime: string
    ip: string
    port: number
}

const INITIAL_SERVERS: GameServer[] = [
    {
        id: 's1',
        name: 'My TMNF Server',
        plan: 'Pro',
        status: 'online',
        players: 6, maxPlayers: 16,
        cpu: 28, ping: 24, ram: 245, ramMax: 1024,
        region: '🇫🇷 Paris',
        map: 'StadiumRacer_v2',
        uptime: '2j 14h 27m',
        ip: '51.158.124.42',
        port: 2350,
    },
    {
        id: 's2',
        name: 'Training Server',
        plan: 'Starter',
        status: 'offline',
        players: 0, maxPlayers: 8,
        cpu: 0, ping: 0, ram: 0, ramMax: 512,
        region: '🇩🇪 Frankfurt',
        map: 'A01-Race',
        uptime: '—',
        ip: '62.210.11.37',
        port: 2350,
    },
]

function rng(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min }
function clamp(v: number, a: number, b: number) { return Math.max(a, Math.min(b, v)) }

const STATUS_COLOR: Record<GameServer['status'], string> = {
    online: 'var(--primary)',
    offline: 'var(--red)',
    restarting: 'var(--orange)',
}
const STATUS_LABEL: Record<GameServer['status'], string> = {
    online: 'En ligne',
    offline: 'Hors ligne',
    restarting: 'Redémarrage…',
}

/* ─── Server Card ─────────────────────────────────────────────────────────── */
function ServerCard({ server, onAction }: { server: GameServer; onAction: (id: string, action: 'restart' | 'stop' | 'start') => void }) {
    const isOnline = server.status === 'online'
    const isRestarting = server.status === 'restarting'

    return (
        <div className="card speed-stripe" style={{ borderColor: isOnline ? 'var(--border)' : 'var(--border)', position: 'relative', overflow: 'visible' }}>
            {/* Plan badge */}
            <div style={{
                position: 'absolute', top: 12, right: 12,
                background: server.plan === 'Pro' ? 'var(--primary)' : server.plan === 'Elite' ? 'var(--yellow)' : 'var(--bg-raised)',
                color: server.plan === 'Pro' || server.plan === 'Elite' ? '#020805' : 'var(--text-mid)',
                fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700,
                padding: '3px 9px', borderRadius: 99, letterSpacing: '0.06em', textTransform: 'uppercase',
                border: server.plan === 'Starter' || server.plan === 'Flash' ? '1px solid var(--border)' : 'none',
            }}>{server.plan}</div>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, paddingRight: 60 }}>
                <div style={{
                    width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                    background: `color-mix(in oklch, ${STATUS_COLOR[server.status]} 15%, transparent)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `2px solid ${STATUS_COLOR[server.status]}40`,
                }}>
                    <Server size={18} style={{ color: STATUS_COLOR[server.status] }} />
                </div>
                <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text-high)', letterSpacing: '0.03em' }}>
                        {server.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2, flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-mono)', fontSize: 11, color: STATUS_COLOR[server.status] }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: STATUS_COLOR[server.status], display: 'inline-block', animation: isOnline ? 'pulse-dot 2s ease-in-out infinite' : undefined }} />
                            {STATUS_LABEL[server.status]}
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-ghost)' }}>{server.region}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-ghost)' }}>{server.ip}:{server.port}</span>
                    </div>
                </div>
            </div>

            {/* Metrics grid */}
            {isOnline ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
                    {[
                        { icon: Users, label: 'Joueurs', value: `${server.players}/${server.maxPlayers}`, color: 'var(--primary)' },
                        { icon: Cpu, label: 'CPU', value: `${server.cpu}%`, color: 'var(--cyan)' },
                        { icon: Wifi, label: 'Ping', value: `${server.ping}ms`, color: server.ping > 100 ? 'var(--orange)' : 'var(--primary)' },
                        { icon: Activity, label: 'RAM', value: `${server.ram}MB`, color: 'var(--orange)' },
                    ].map(({ icon: Icon, label, value, color }) => (
                        <div key={label} style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                <Icon size={11} style={{ color }} />
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-ghost)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
                            </div>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color, letterSpacing: '0.02em' }}>{value}</div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Square size={14} style={{ color: 'var(--red)' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-low)' }}>Serveur arrêté — démarrez-le pour accéder aux métriques</span>
                </div>
            )}

            {/* Info row */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
                {isOnline && <>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-low)', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Map size={11} /> {server.map}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-low)', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Clock size={11} /> {server.uptime}
                    </span>
                </>}
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-low)', display: 'flex', alignItems: 'center', gap: 5, marginLeft: 'auto' }}>
                    <span style={{ cursor: 'pointer', color: 'var(--text-low)' }}>
                        {server.ip}:{server.port} <ExternalLink size={9} style={{ display: 'inline' }} />
                    </span>
                </span>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8 }}>
                {isOnline ? (<>
                    <Link to="/console" className="btn btn-outline" style={{ fontSize: 12, padding: '7px 14px' }}><Terminal size={12} /> Console</Link>
                    <Link to="/dashboard" className="btn btn-ghost" style={{ fontSize: 12, padding: '7px 14px' }}><Activity size={12} /> Dashboard</Link>
                    <button className="btn btn-ghost" style={{ fontSize: 12, padding: '7px 14px' }}
                        onClick={() => onAction(server.id, 'restart')} disabled={isRestarting}>
                        <RotateCcw size={12} /> Restart
                    </button>
                    <button className="btn btn-danger" style={{ fontSize: 12, padding: '7px 14px', marginLeft: 'auto' }}
                        onClick={() => onAction(server.id, 'stop')}>
                        <Square size={12} /> Stop
                    </button>
                </>) : (
                    <button className="btn btn-primary" style={{ fontSize: 12, padding: '7px 18px' }}
                        onClick={() => onAction(server.id, 'start')}>
                        <Play size={12} /> Démarrer
                    </button>
                )}
                <Link to={`/settings`} className="btn btn-ghost" style={{ fontSize: 12, padding: '7px 12px', marginLeft: isOnline ? 0 : 'auto' }}>
                    <Settings size={12} />
                </Link>
            </div>
        </div>
    )
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
export default function Servers() {
    const [servers, setServers] = useState<GameServer[]>(INITIAL_SERVERS)

    // Live data pump for online servers
    useEffect(() => {
        const id = setInterval(() => {
            setServers(ss => ss.map(s => {
                if (s.status !== 'online') return s
                return {
                    ...s,
                    players: clamp(s.players + rng(-1, 1), 0, s.maxPlayers),
                    cpu: clamp(s.cpu + rng(-3, 3), 5, 85),
                    ping: clamp(s.ping + rng(-4, 4), 10, 150),
                    ram: clamp(s.ram + rng(-5, 5), 100, s.ramMax),
                }
            }))
        }, 2500)
        return () => clearInterval(id)
    }, [])

    function handleAction(id: string, action: 'restart' | 'stop' | 'start') {
        setServers(ss => ss.map(s => {
            if (s.id !== id) return s
            if (action === 'stop') return { ...s, status: 'offline', players: 0, cpu: 0, ping: 0, ram: 0, uptime: '—' }
            if (action === 'start') return { ...s, status: 'online', cpu: rng(10, 30), ping: rng(15, 40), ram: rng(150, 280), uptime: '0m' }
            if (action === 'restart') {
                setTimeout(() => {
                    setServers(prev => prev.map(p => p.id === id ? { ...p, status: 'online' } : p))
                }, 2500)
                return { ...s, status: 'restarting' }
            }
            return s
        }))
    }

    const onlineCount = servers.filter(s => s.status === 'online').length
    const totalPlayers = servers.filter(s => s.status === 'online').reduce((acc, s) => acc + s.players, 0)

    return (
        <>
            <SEO 
                title="Tableau de bord - Mes Serveurs" 
                description="Gérez vos serveurs TrackMania Nations Forever depuis votre espace personnel."
                noindex
            />
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="page-title">Mes Serveurs</h1>
                    <p className="page-subtitle">
                        {onlineCount} en ligne · {servers.length} serveur{servers.length > 1 ? 's' : ''} · {totalPlayers} joueurs actifs
                    </p>
                </div>
                <Link to="/checkout" className="btn btn-primary" style={{ fontSize: 13 }}>
                    <Plus size={14} /> Ajouter un serveur
                </Link>
            </div>

            {/* Summary bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
                {[
                    { label: 'Serveurs actifs', value: `${onlineCount}/${servers.length}`, color: 'var(--primary)', icon: Server },
                    { label: 'Joueurs connectés', value: String(totalPlayers), color: 'var(--cyan)', icon: Users },
                    { label: 'CPU moyen', value: onlineCount ? `${Math.round(servers.filter(s => s.status === 'online').reduce((a, s) => a + s.cpu, 0) / onlineCount)}%` : '—', color: 'var(--orange)', icon: Cpu },
                    { label: 'Ping moyen', value: onlineCount ? `${Math.round(servers.filter(s => s.status === 'online').reduce((a, s) => a + s.ping, 0) / onlineCount)}ms` : '—', color: 'var(--yellow)', icon: Zap },
                ].map(({ label, value, color, icon: Icon }) => (
                    <div key={label} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px' }}>
                        <div style={{ width: 34, height: 34, background: `color-mix(in oklch, ${color} 12%, transparent)`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Icon size={16} style={{ color }} />
                        </div>
                        <div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-low)', marginBottom: 2 }}>{label}</div>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color, letterSpacing: '0.02em' }}>{value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Server cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {servers.map(server => (
                    <ServerCard key={server.id} server={server} onAction={handleAction} />
                ))}
            </div>

            {/* Add server prompt */}
            <Link to="/checkout" style={{ textDecoration: 'none' }}>
                <div className="card" style={{
                    marginTop: 'var(--space-4)', border: '2px dashed var(--border)', background: 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
                    padding: 'var(--space-6)', cursor: 'pointer', transition: 'all 200ms',
                }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                    <Plus size={18} style={{ color: 'var(--text-low)' }} />
                    <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--text-mid)', letterSpacing: '0.03em' }}>
                            Ajouter un serveur
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-ghost)', marginTop: 2 }}>
                            Choisissez un plan et configurez votre nouveau serveur
                        </div>
                    </div>
                    <ChevronRight size={16} style={{ color: 'var(--text-low)', marginLeft: 'auto' }} />
                </div>
            </Link>
        </>
    )
}
