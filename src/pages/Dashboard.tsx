import { useState, useEffect, useRef, useCallback } from 'react'
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
    CartesianGrid, BarChart, Bar, LineChart, Line, Cell
} from 'recharts'
import {
    Users, Cpu, Activity, Clock, Zap, MessageSquare, Trophy,
    Map, Wifi, AlertTriangle, RotateCcw, Square, UserX, TrendingUp,
    BarChart2, LayoutGrid, FileText
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import SEO from '../components/SEO'

/* ─── Live Data Simulation ────────────────────────────────────────────────── */
function rng(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min }
function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)) }

function makeSample(prev: number, min: number, max: number, drift = 2) {
    return clamp(prev + rng(-drift, drift), min, max)
}

type Sample = { t: string; v: number }

/* Génère des données de graphique selon la plage sélectionnée (déterministe) */
function generateChartData(
    timerange: string,
    baseVal: number,
    variation: number,
    isPlayers = false
): Sample[] {
    const cap = (v: number) => isPlayers ? clamp(v, 0, 16) : Math.max(0, v)
    if (timerange === '1h') {
        return Array.from({ length: 12 }, (_, i) => ({
            t: `-${55 - i * 5}m`,
            v: cap(baseVal + Math.sin(i * 0.8) * variation + (i % 3) - 1)
        }))
    }
    if (timerange === '6h') {
        return Array.from({ length: 18 }, (_, i) => ({
            t: `${i}h`,
            v: cap(baseVal + Math.sin(i * 0.4) * variation + (i % 2))
        }))
    }
    if (timerange === '24h') {
        return Array.from({ length: 24 }, (_, i) => ({
            t: `${i}h`,
            v: cap(baseVal + Math.sin(i * 0.3) * variation + (i >= 14 && i <= 22 ? 4 : 0) + (i % 2) - 0.5)
        }))
    }
    if (timerange === '7d') {
        return Array.from({ length: 7 }, (_, i) => ({
            t: `J${i + 1}`,
            v: cap(baseVal + (i === 5 || i === 6 ? 5 : 0) + (i % 2))
        }))
    }
    return Array.from({ length: 30 }, (_, i) => ({
        t: `J${i + 1}`,
        v: cap(baseVal + (i % 7 >= 5 ? 3 : 0) + (i % 3) - 1)
    }))
}

const PLAYERS_NAMES = ['Speedy_TM', 'Ghost99', 'Racer07', 'NeonDrift', 'AlphaRun', 'Turbo_K', 'FastLane', 'MaxVelo', 'SkyRacer', 'DustStorm', 'Piston99', 'BlazeIt']
const MAP_ROTATION = ['A01-Race', 'Stadium_Racer_v2', 'DesertPeak_Pro', 'HelixLoop_Final', 'CoastDash', 'AlpineTrack']

const TIMERANGES = [{ id: '1h', label: '1h' }, { id: '6h', label: '6h' }, { id: '24h', label: '24h' }, { id: '7d', label: '7j' }, { id: '30d', label: '30j' }] as const
const GRAPH_TYPES = [{ id: 'area', label: 'Aire', Icon: LayoutGrid }, { id: 'line', label: 'Ligne', Icon: Activity }, { id: 'bar', label: 'Barres', Icon: BarChart2 }] as const

const SERVER_LOGS = [
    { ts: '10:52:03', level: 'INFO', msg: 'Player Speedy_TM connected (slot 1)' },
    { ts: '10:51:58', level: 'INFO', msg: 'Map loaded: Stadium_Racer_v2 (24 checkpoints)' },
    { ts: '10:51:45', level: 'INFO', msg: 'XAseco: Record saved for Ghost99 - 0:52.124' },
    { ts: '10:51:32', level: 'WARN', msg: 'High ping detected: Racer07 (142ms)' },
    { ts: '10:51:18', level: 'INFO', msg: 'Player NeonDrift left (was slot 4)' },
    { ts: '10:51:02', level: 'INFO', msg: 'RestartMap requested by admin' },
    { ts: '10:50:55', level: 'INFO', msg: 'Dedimania: 3 new world records submitted' },
    { ts: '10:50:41', level: 'INFO', msg: 'Player AlphaRun connected (slot 3)' },
    { ts: '10:50:30', level: 'INFO', msg: 'Match finish - Map completed by 5/8 players' },
    { ts: '10:50:12', level: 'INFO', msg: 'Server uptime: 4d 12h 33m' },
]

interface PlayerRow { name: string; ping: number; pb: string; score: number }
interface ChatMsg { ts: string; name: string; msg: string; type: 'chat' | 'join' | 'leave' | 'record' }

function fmtTime(ms: number) {
    const min = Math.floor(ms / 60000); const sec = ((ms % 60000) / 1000).toFixed(3)
    return `${min}:${parseFloat(sec) < 10 ? '0' : ''}${sec}`
}

/* ─── Custom Tooltip ─────────────────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label, unit }: { active?: boolean; payload?: { value: number }[]; label?: string; unit?: string }) => {
    if (!active || !payload?.length) return null
    return (
        <div style={{ background: '#121923', border: '1px solid #1F2E44', borderRadius: 8, padding: '8px 12px', fontFamily: 'JetBrains Mono', fontSize: 11 }}>
            <div style={{ color: '#4A5A72', marginBottom: 2 }}>{label}</div>
            <div style={{ color: '#00FF87', fontWeight: 700 }}>{payload[0].value}{unit ?? ''}</div>
        </div>
    )
}

/* ─── Kick Modal ─────────────────────────────────────────────────────────── */
function KickModal({ player, onClose }: { player: string; onClose: () => void }) {
    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--text-high)', marginBottom: 8 }}>
                    Kick <span style={{ color: 'var(--red)' }}>{player}</span>?
                </div>
                <p style={{ color: 'var(--text-mid)', fontSize: 13, marginBottom: 20 }}>
                    Le joueur sera déconnecté du serveur. Il peut rejoindre à nouveau.
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-danger" style={{ flex: 1 }} onClick={onClose}><UserX size={13} /> Kick</button>
                    <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Annuler</button>
                </div>
            </div>
        </div>
    )
}

/* ─── Dashboard ───────────────────────────────────────────────────────────── */
export default function Dashboard() {
    // Live series
    const [playerSeries, setPlayerSeries] = useState<Sample[]>(() => Array.from({ length: 20 }, (_, i) => ({ t: `-${20 - i}m`, v: rng(3, 12) })))
    const [cpuSeries, setCpuSeries] = useState<Sample[]>(() => Array.from({ length: 20 }, (_, i) => ({ t: `-${20 - i}m`, v: rng(15, 45) })))
    const [pingSeries, setPingSeries] = useState<Sample[]>(() => Array.from({ length: 20 }, (_, i) => ({ t: `-${20 - i}m`, v: rng(18, 80) })))
    const [ramSeries, setRamSeries] = useState<Sample[]>(() => Array.from({ length: 20 }, (_, i) => ({ t: `-${20 - i}m`, v: rng(180, 350) })))

    // Scalar KPIs
    const [playerCount, setPlayerCount] = useState(5)
    const [avgPing, setAvgPing] = useState(24)
    const [cpuPct, setCpuPct] = useState(28)
    const [ramMb, setRamMb] = useState(245)
    const uptime = 99.8
    const [records, setRecords] = useState(7)
    const [currentMap, setCurrentMap] = useState(0)
    const [mapTimer, setMapTimer] = useState(420)

    // Players list
    const [players, setPlayers] = useState<PlayerRow[]>(() =>
        PLAYERS_NAMES.slice(0, 5).map(name => ({ name, ping: rng(18, 80), pb: fmtTime(rng(42000, 95000)), score: rng(100, 2000) }))
    )

    // Chat
    const [chat, setChat] = useState<ChatMsg[]>([
        { ts: '10:42', name: 'Speedy_TM', msg: 'gg wp les gars !', type: 'chat' },
        { ts: '10:43', name: 'Racer07', msg: 't\'as vu ce temps wsh', type: 'chat' },
        { ts: '10:44', name: 'NeonDrift', msg: '', type: 'join' },
        { ts: '10:45', name: 'Ghost99', msg: 'nouveau record !', type: 'record' },
    ])
    const chatRef = useRef<HTMLDivElement>(null)
    const [timerange, setTimerange] = useState<(typeof TIMERANGES)[number]['id']>('24h')
    const [graphType, setGraphType] = useState<(typeof GRAPH_TYPES)[number]['id']>('area')
    const [activeTab, setActiveTab] = useState<'overview' | 'logs'>('overview')

    // Map timer countdown
    useEffect(() => {
        const id = setInterval(() => setMapTimer(t => { if (t <= 1) { setCurrentMap(m => (m + 1) % MAP_ROTATION.length); return 480 } return t - 1 }), 1000)
        return () => clearInterval(id)
    }, [])

    // Régénérer les graphiques quand la plage change
    useEffect(() => {
        setPlayerSeries(generateChartData(timerange, 6, 4, true))
        setCpuSeries(generateChartData(timerange, 30, 15))
        setPingSeries(generateChartData(timerange, 35, 25))
        setRamSeries(generateChartData(timerange, 240, 80))
    }, [timerange])

    // Live data pump every 2s
    const tick = useCallback((tr: typeof timerange) => {
        const now = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        const isLiveCharts = tr === '1h'

        setPlayerCount(p => {
            const n = clamp(p + rng(-1, 1), 0, 16)
            setPlayers(prev => {
                if (n > p && prev.length < 16) {
                    const available = PLAYERS_NAMES.filter(nm => !prev.find(pl => pl.name === nm))
                    if (available.length) {
                        const name = available[rng(0, available.length - 1)]
                        setChat(c => [...c.slice(-49), { ts: now, name, msg: '', type: 'join' }])
                        return [...prev, { name, ping: rng(20, 80), pb: fmtTime(rng(42000, 95000)), score: rng(100, 800) }]
                    }
                }
                if (n < p && prev.length > 1) {
                    const idx = rng(0, prev.length - 1)
                    setChat(c => [...c.slice(-49), { ts: now, name: prev[idx].name, msg: '', type: 'leave' }])
                    return prev.filter((_, i) => i !== idx)
                }
                return prev.map(pl => ({ ...pl, ping: clamp(pl.ping + rng(-5, 5), 10, 200) }))
            })
            if (isLiveCharts) setPlayerSeries(s => [...s.slice(-19), { t: now, v: n }])
            return n
        })

        setCpuPct(p => { const n = makeSample(p, 10, 85, 4); if (isLiveCharts) setCpuSeries(s => [...s.slice(-19), { t: now, v: n }]); return n })
        setAvgPing(p => { const n = makeSample(p, 15, 100, 5); if (isLiveCharts) setPingSeries(s => [...s.slice(-19), { t: now, v: n }]); return n })
        setRamMb(p => { const n = makeSample(p, 160, 430, 8); if (isLiveCharts) setRamSeries(s => [...s.slice(-19), { t: now, v: n }]); return n })

        // Random record event
        if (Math.random() < 0.1) {
            const p = players[rng(0, Math.max(0, players.length - 1))]
            if (p) {
                const time = fmtTime(rng(42000, 95000))
                setChat(c => [...c.slice(-49), { ts: now, name: p.name, msg: `Record: ${time}`, type: 'record' }])
                setRecords(r => r + 1)
            }
        }
        // Random chat
        if (Math.random() < 0.15) {
            const msgs = ['gg !', 'trop fort', 'wp', 'next map !', 'laisse moi passer lol', 'pb !!']
            const p = players[rng(0, Math.max(0, players.length - 1))]
            if (p) setChat(c => [...c.slice(-49), { ts: now, name: p.name, msg: msgs[rng(0, msgs.length - 1)], type: 'chat' }])
        }
    }, [playerCount, players])

    useEffect(() => { const id = setInterval(() => tick(timerange), 2000); return () => clearInterval(id) }, [tick, timerange])
    useEffect(() => { chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' }) }, [chat])

    const [kickTarget, setKickTarget] = useState<string | null>(null)
    const fmtMapTimer = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

    // Hourly / daily data based on timerange (stable per timerange)
    const points = timerange === '1h' ? 12 : timerange === '6h' ? 18 : timerange === '24h' ? 24 : timerange === '7d' ? 7 : 30
    const [hourlyBars, setHourlyBars] = useState(() =>
        Array.from({ length: points }, (_, i) => {
            const v = 4 + (i % 5) + Math.floor(i / 3) // deterministic-ish pattern
            return timerange === '7d' || timerange === '30d' ? { h: `J${i + 1}`, v } : { h: `${(i * (24 / points)) | 0}h`, v }
        })
    )
    useEffect(() => {
        const p = timerange === '1h' ? 12 : timerange === '6h' ? 18 : timerange === '24h' ? 24 : timerange === '7d' ? 7 : 30
        setHourlyBars(Array.from({ length: p }, (_, i) => {
            const v = 4 + (i % 5) + Math.floor(i / 3)
            return timerange === '7d' || timerange === '30d' ? { h: `J${i + 1}`, v } : { h: `${(i * (24 / p)) | 0}h`, v }
        }))
    }, [timerange])
    const peakHour = hourlyBars.reduce((acc, cur, i) => (cur.v > (hourlyBars[acc]?.v ?? 0) ? i : acc), 0)

    return (
        <>
            <SEO 
                title="Tableau de bord - Live Monitoring" 
                description="Suivez les performances de votre serveur TrackMania en temps réel : joueurs, CPU, RAM et logs."
            />
            {kickTarget && <KickModal player={kickTarget} onClose={() => setKickTarget(null)} />}

            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-subtitle">Live monitoring · My TMNF Server · Mise à jour toutes les 2s</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <div className="dashboard-timerange">
                        {TIMERANGES.map(tr => (
                            <button key={tr.id} className={`timerange-btn ${timerange === tr.id ? 'active' : ''}`} onClick={() => setTimerange(tr.id)}>{tr.label}</button>
                        ))}
                    </div>
                    <div className="dashboard-graph-type">
                        {GRAPH_TYPES.map(gt => (
                            <button key={gt.id} className={`graph-type-btn ${graphType === gt.id ? 'active' : ''}`} onClick={() => setGraphType(gt.id)} title={gt.label}>
                                <gt.Icon size={14} />
                            </button>
                        ))}
                    </div>
                    <div style={{ width: 1, height: 24, background: 'var(--border)' }} />
                    <button className="btn btn-ghost" style={{ fontSize: 12, padding: '7px 14px' }}><RotateCcw size={13} /> Restart</button>
                    <button className="btn btn-danger" style={{ fontSize: 12, padding: '7px 14px' }}><Square size={13} /> Stop</button>
                </div>
            </div>

            {/* Tabs */}
            <div className="dashboard-tabs" style={{ marginBottom: 24 }}>
                <button className={`dashboard-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                    <Activity size={14} /> Vue d'ensemble
                </button>
                <button className={`dashboard-tab ${activeTab === 'logs' ? 'active' : ''}`} onClick={() => setActiveTab('logs')}>
                    <FileText size={14} /> Logs serveur
                </button>
            </div>

            <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {/* ── Row 1: KPI Cards ── */}
            <div className="grid-4" style={{ marginBottom: 'var(--space-4)' }}>
                {[
                    { icon: Users, label: 'Joueurs', value: `${playerCount} / 16`, sub: `${records} records ce soir`, color: 'var(--primary)', trend: '+2' },
                    { icon: Cpu, label: 'CPU', value: `${cpuPct}%`, sub: 'Conteneur 2 vCPU', color: 'var(--cyan)', trend: cpuPct > 60 ? '↑' : '→' },
                    { icon: Activity, label: 'Ping moyen', value: `${avgPing} ms`, sub: 'P99 < 120ms', color: 'var(--yellow)', trend: avgPing > 80 ? '↑' : '✓' },
                    { icon: Zap, label: 'RAM', value: `${ramMb} MB`, sub: '512 MB allouée', color: 'var(--orange)', trend: `${Math.round(ramMb / 5.12)}%` },
                ].map(({ icon: Icon, label, value, sub, color, trend }) => (
                    <div className="card stat-card speed-stripe" key={label}>
                        <div className="stat-card-header">
                            <span className="stat-label">{label}</span>
                            <Icon size={14} style={{ color }} />
                        </div>
                        <div className="stat-value" style={{ color }}>{value}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                            <span className="stat-sub">{sub}</span>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color }}>{trend}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Row 2: Secondary KPIs ── */}
            <div className="grid-4" style={{ marginBottom: 'var(--space-4)' }}>
                {[
                    { icon: Trophy, label: 'Records brisés', value: String(records), color: 'var(--yellow)' },
                    { icon: Map, label: 'Map actuelle', value: MAP_ROTATION[currentMap], color: 'var(--cyan)' },
                    { icon: Clock, label: 'Prochaine map', value: fmtMapTimer(mapTimer), color: 'var(--text-mid)' },
                    { icon: TrendingUp, label: 'Uptime 30j', value: `${uptime.toFixed(1)}%`, color: 'var(--primary)' },
                ].map(({ icon: Icon, label, value, color }) => (
                    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }} key={label}>
                        <div style={{ width: 36, height: 36, background: `color-mix(in oklch, ${color} 12%, transparent)`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Icon size={16} style={{ color }} />
                        </div>
                        <div>
                            <div className="stat-label">{label}</div>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color, letterSpacing: '0.02em', marginTop: 2 }}>{value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Row 3: Charts ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                {/* Players over time */}
                <div className="card speed-stripe">
                    <div className="card-title" style={{ marginBottom: 12 }}><Users size={12} /> Joueurs connectés (live)</div>
                    <ResponsiveContainer width="100%" height={140}>
                        {graphType === 'bar' ? (
                            <BarChart data={playerSeries} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                                <CartesianGrid stroke="#1F2E44" strokeDasharray="3 3" />
                                <XAxis dataKey="t" tick={{ fill: '#4A5A72', fontSize: 9, fontFamily: 'JetBrains Mono' }} interval={4} />
                                <YAxis domain={[0, 16]} tick={{ fill: '#4A5A72', fontSize: 9, fontFamily: 'JetBrains Mono' }} />
                                <Tooltip content={<CustomTooltip unit=" joueurs" />} />
                                <Bar dataKey="v" fill="#00FF87" radius={[3, 3, 0, 0]} isAnimationActive={false} />
                            </BarChart>
                        ) : graphType === 'line' ? (
                            <LineChart data={playerSeries} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                                <CartesianGrid stroke="#1F2E44" strokeDasharray="3 3" />
                                <XAxis dataKey="t" tick={{ fill: '#4A5A72', fontSize: 9, fontFamily: 'JetBrains Mono' }} interval={4} />
                                <YAxis domain={[0, 16]} tick={{ fill: '#4A5A72', fontSize: 9, fontFamily: 'JetBrains Mono' }} />
                                <Tooltip content={<CustomTooltip unit=" joueurs" />} />
                                <Line type="monotone" dataKey="v" stroke="#00FF87" strokeWidth={2} dot={false} isAnimationActive={false} />
                            </LineChart>
                        ) : (
                            <AreaChart data={playerSeries} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                                <defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00FF87" stopOpacity={0.25} /><stop offset="100%" stopColor="#00FF87" stopOpacity={0} /></linearGradient></defs>
                                <CartesianGrid stroke="#1F2E44" strokeDasharray="3 3" />
                                <XAxis dataKey="t" tick={{ fill: '#4A5A72', fontSize: 9, fontFamily: 'JetBrains Mono' }} interval={4} />
                                <YAxis domain={[0, 16]} tick={{ fill: '#4A5A72', fontSize: 9, fontFamily: 'JetBrains Mono' }} />
                                <Tooltip content={<CustomTooltip unit=" joueurs" />} />
                                <Area type="monotone" dataKey="v" stroke="#00FF87" strokeWidth={2} fill="url(#pg)" dot={false} isAnimationActive={false} />
                            </AreaChart>
                        )}
                    </ResponsiveContainer>
                </div>

                {/* CPU over time */}
                <div className="card speed-stripe">
                    <div className="card-title" style={{ marginBottom: 12 }}><Cpu size={12} /> CPU % (live)</div>
                    <ResponsiveContainer width="100%" height={140}>
                        {graphType === 'bar' ? (
                            <BarChart data={cpuSeries} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                                <CartesianGrid stroke="#1F2E44" strokeDasharray="3 3" />
                                <XAxis dataKey="t" tick={{ fill: '#4A5A72', fontSize: 9, fontFamily: 'JetBrains Mono' }} interval={4} />
                                <YAxis domain={[0, 100]} tick={{ fill: '#4A5A72', fontSize: 9, fontFamily: 'JetBrains Mono' }} />
                                <Tooltip content={<CustomTooltip unit="%" />} />
                                <Bar dataKey="v" fill="#00D4FF" radius={[3, 3, 0, 0]} isAnimationActive={false} />
                            </BarChart>
                        ) : graphType === 'line' ? (
                            <LineChart data={cpuSeries} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                                <CartesianGrid stroke="#1F2E44" strokeDasharray="3 3" />
                                <XAxis dataKey="t" tick={{ fill: '#4A5A72', fontSize: 9, fontFamily: 'JetBrains Mono' }} interval={4} />
                                <YAxis domain={[0, 100]} tick={{ fill: '#4A5A72', fontSize: 9, fontFamily: 'JetBrains Mono' }} />
                                <Tooltip content={<CustomTooltip unit="%" />} />
                                <Line type="monotone" dataKey="v" stroke="#00D4FF" strokeWidth={2} dot={false} isAnimationActive={false} />
                            </LineChart>
                        ) : (
                            <AreaChart data={cpuSeries} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                                <defs><linearGradient id="cpu-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00D4FF" stopOpacity={0.25} /><stop offset="100%" stopColor="#00D4FF" stopOpacity={0} /></linearGradient></defs>
                                <CartesianGrid stroke="#1F2E44" strokeDasharray="3 3" />
                                <XAxis dataKey="t" tick={{ fill: '#4A5A72', fontSize: 9, fontFamily: 'JetBrains Mono' }} interval={4} />
                                <YAxis domain={[0, 100]} tick={{ fill: '#4A5A72', fontSize: 9, fontFamily: 'JetBrains Mono' }} />
                                <Tooltip content={<CustomTooltip unit="%" />} />
                                <Area type="monotone" dataKey="v" stroke="#00D4FF" strokeWidth={2} fill="url(#cpu-g)" dot={false} isAnimationActive={false} />
                            </AreaChart>
                        )}
                    </ResponsiveContainer>
                </div>

                {/* Ping over time */}
                <div className="card speed-stripe">
                    <div className="card-title" style={{ marginBottom: 12 }}><Wifi size={12} /> Ping moyen (live)</div>
                    <ResponsiveContainer width="100%" height={140}>
                        <AreaChart data={pingSeries} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                            <defs><linearGradient id="ping-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFD700" stopOpacity={0.2} /><stop offset="100%" stopColor="#FFD700" stopOpacity={0} /></linearGradient></defs>
                            <CartesianGrid stroke="#1F2E44" strokeDasharray="3 3" />
                            <XAxis dataKey="t" tick={{ fill: '#4A5A72', fontSize: 9, fontFamily: 'JetBrains Mono' }} interval={4} />
                            <YAxis domain={[0, 200]} tick={{ fill: '#4A5A72', fontSize: 9, fontFamily: 'JetBrains Mono' }} />
                            <Tooltip content={<CustomTooltip unit=" ms" />} />
                            <Area type="monotone" dataKey="v" stroke="#FFD700" strokeWidth={2} fill="url(#ping-g)" dot={false} isAnimationActive={false} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Hourly / Peak */}
                <div className="card speed-stripe">
                    <div className="card-title" style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                        <TrendingUp size={12} /> Activité {timerange === '7d' || timerange === '30d' ? 'par jour' : 'par heure'}
                        <span className="badge badge-cyan" style={{ fontSize: 10, marginLeft: 'auto' }}>
                            Pic: {timerange === '7d' || timerange === '30d' ? `J${peakHour + 1}` : `${peakHour * (24 / points) | 0}h`} ({hourlyBars[peakHour]?.v ?? 0} joueurs)
                        </span>
                    </div>
                    <ResponsiveContainer width="100%" height={140}>
                        <BarChart data={hourlyBars} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                            <CartesianGrid stroke="#1F2E44" strokeDasharray="3 3" />
                            <XAxis dataKey="h" tick={{ fill: '#4A5A72', fontSize: 9, fontFamily: 'JetBrains Mono' }} />
                            <YAxis domain={[0, 16]} tick={{ fill: '#4A5A72', fontSize: 9, fontFamily: 'JetBrains Mono' }} />
                            <Tooltip content={<CustomTooltip unit=" joueurs" />} />
                            <Bar dataKey="v" fill="#1E2B3E" radius={[3, 3, 0, 0]}>
                                {hourlyBars.map((_, i) => (
                                    <Cell key={i} fill={i === peakHour ? '#00FF87' : '#1E2B3E'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ── Row 4: Players + Chat ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-4)' }}>
                {/* Player list */}
                <div className="card">
                    <div className="card-title" style={{ marginBottom: 12 }}>
                        <Users size={12} /> Joueurs connectés
                        <span className="badge badge-green" style={{ marginLeft: 'auto' }}>{playerCount}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 80px 70px 60px', gap: 8, padding: '0 4px 6px', borderBottom: '1px solid var(--border)' }}>
                            {['Joueur', 'Ping', 'Meilleur temps', 'Score', ''].map(h => (
                                <span key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-ghost)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</span>
                            ))}
                        </div>
                        {players.map(p => (
                            <div key={p.name} style={{ display: 'grid', gridTemplateColumns: '1fr 60px 80px 70px 60px', gap: 8, padding: '6px 4px', borderRadius: 6, transition: 'background 150ms' }}
                                className="player-row">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-high)' }}>{p.name}</span>
                                </div>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: p.ping > 100 ? 'var(--red)' : p.ping > 60 ? 'var(--orange)' : 'var(--primary)' }}>{p.ping}ms</span>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-mid)' }}>{p.pb}</span>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-mid)' }}>{p.score}</span>
                                <button className="btn btn-danger" style={{ padding: '3px 8px', fontSize: 10 }} onClick={() => setKickTarget(p.name)}>
                                    <UserX size={10} />
                                </button>
                            </div>
                        ))}
                        {players.length === 0 && (
                            <div style={{ padding: '24px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-low)' }}>Aucun joueur connecté</div>
                        )}
                    </div>
                </div>

                {/* Chat/Event feed */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <MessageSquare size={12} style={{ color: 'var(--text-low)' }} />
                        <span className="card-title">Chat & Events</span>
                    </div>
                    <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 280 }}>
                        {chat.map((m, i) => (
                            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', animation: 'fade-in 200ms ease both' }}>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-ghost)', flexShrink: 0, paddingTop: 1 }}>{m.ts}</span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    {m.type === 'join' && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--primary)' }}>→ {m.name} a rejoint</span>}
                                    {m.type === 'leave' && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--red)' }}>← {m.name} a quitté</span>}
                                    {m.type === 'record' && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--yellow)' }}>🏆 {m.name}: {m.msg}</span>}
                                    {m.type === 'chat' && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-mid)' }}><span style={{ color: 'var(--cyan)' }}>{m.name}</span>: {m.msg}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* RAM chart (full width) */}
            <div className="card speed-stripe" style={{ marginTop: 'var(--space-4)' }}>
                <div className="card-title" style={{ marginBottom: 12 }}><AlertTriangle size={12} /> RAM utilisée (MB, live) · 512 MB allouée</div>
                <ResponsiveContainer width="100%" height={100}>
                    <AreaChart data={ramSeries} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                        <defs><linearGradient id="ram-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FF8C00" stopOpacity={0.3} /><stop offset="100%" stopColor="#FF8C00" stopOpacity={0} /></linearGradient></defs>
                        <CartesianGrid stroke="#1F2E44" strokeDasharray="3 3" />
                        <XAxis dataKey="t" tick={{ fill: '#4A5A72', fontSize: 9, fontFamily: 'JetBrains Mono' }} interval={4} />
                        <YAxis domain={[0, 512]} tick={{ fill: '#4A5A72', fontSize: 9, fontFamily: 'JetBrains Mono' }} />
                        <Tooltip content={<CustomTooltip unit=" MB" />} />
                        <Area type="monotone" dataKey="v" stroke="#FF8C00" strokeWidth={2} fill="url(#ram-g)" dot={false} isAnimationActive={false} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            </motion.div>
            )}

            {activeTab === 'logs' && (
            <motion.div key="logs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="dashboard-logs-panel">
                <div className="card" style={{ overflow: 'hidden' }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div className="card-title"><FileText size={14} /> Logs serveur · Temps réel</div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button className="btn btn-ghost" style={{ fontSize: 11, padding: '5px 12px' }}>Exporter</button>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-low)' }}>10 dernières entrées</span>
                        </div>
                    </div>
                    <div style={{ maxHeight: 480, overflowY: 'auto' }} className="console-output">
                        {SERVER_LOGS.map((log, i) => (
                            <div key={i} className="console-line dashboard-log-line" style={{ color: log.level === 'WARN' ? 'var(--orange)' : 'var(--text-mid)' }}>
                                <span className="console-ts">{log.ts}</span>
                                <span style={{ width: 50, flexShrink: 0, color: log.level === 'WARN' ? 'var(--orange)' : 'var(--cyan)' }}>{log.level}</span>
                                <span className="console-text">{log.msg}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
            )}
            </AnimatePresence>
        </>
    )
}
