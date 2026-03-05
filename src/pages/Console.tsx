import { useState, useRef, useEffect, useCallback } from 'react'
import { Terminal, Send, Trash2, ChevronRight, Download, Copy } from 'lucide-react'

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface LogLine {
    type: 'cmd' | 'info' | 'chat' | 'warn' | 'success' | 'error' | 'result'
    text: string
    ts: string
}

/* ─── RCON Command Engine ────────────────────────────────────────────────── */
const PLAYERS = ['Speedy_TM', 'Ghost99', 'Racer07', 'NeonDrift', 'AlphaRun', 'Turbo_K']
const MAPS = ['A01-Race (Nadeo)', 'StadiumRacer_v2 (TMX)', 'DesertPeak_Pro (TMX)', 'HelixLoop_Final (TMX)', 'CoastDash (TrackHost)']
let currentMap = 1

function handleCommand(raw: string): LogLine[] {
    const cmd = raw.trim()
    const lcmd = cmd.toLowerCase()
    const now = ts()

    // ── Server state commands ─────────────────────────────────────────────────
    if (lcmd === 'restartmap') return [
        { type: 'info', text: 'Restarting current map...', ts: now },
        { type: 'success', text: `Map restarted: ${MAPS[currentMap]} · 0 players ready`, ts: now },
    ]
    if (lcmd === 'nextmap') {
        currentMap = (currentMap + 1) % MAPS.length
        return [
            { type: 'info', text: 'Changing to next map...', ts: now },
            { type: 'success', text: `Now playing: ${MAPS[currentMap]}`, ts: now },
        ]
    }
    if (lcmd === 'prevmap') {
        currentMap = (currentMap - 1 + MAPS.length) % MAPS.length
        return [
            { type: 'info', text: 'Changing to previous map...', ts: now },
            { type: 'success', text: `Now playing: ${MAPS[currentMap]}`, ts: now },
        ]
    }

    // ── Player list ────────────────────────────────────────────────────────────
    if (lcmd === 'getplayerlist') return [
        { type: 'result', text: '─── Player List (' + PLAYERS.length + '/16) ───────────────', ts: now },
        ...PLAYERS.map((p, i) => ({ type: 'result' as const, text: `  Slot ${i + 1} │ ${p.padEnd(14)} │ Ping: ${20 + i * 13}ms │ Spec: No`, ts: now })),
        { type: 'result', text: '────────────────────────────────────────────', ts: now },
    ]

    // ── Map info ───────────────────────────────────────────────────────────────
    if (lcmd === 'getcurrentmapinfo') return [
        { type: 'result', text: '─── Current Map Info ────────────────────────', ts: now },
        { type: 'result', text: `  Name     │ ${MAPS[currentMap]}`, ts: now },
        { type: 'result', text: '  Author   │ Nadeo / Community', ts: now },
        { type: 'result', text: '  UId      │ AbCdEf1234567890', ts: now },
        { type: 'result', text: '  GoldTime │ 0:52.000', ts: now },
        { type: 'result', text: '  NbLaps   │ 1', ts: now },
        { type: 'result', text: '────────────────────────────────────────────', ts: now },
    ]

    // ── Server info ────────────────────────────────────────────────────────────
    if (lcmd === 'getserverinfo' || lcmd === 'serverinfo') return [
        { type: 'result', text: '─── Server Info ─────────────────────────────', ts: now },
        { type: 'result', text: '  Name      │ My TMNF Server', ts: now },
        { type: 'result', text: '  Comment   │ Hosted on TrackHost.gg', ts: now },
        { type: 'result', text: '  Players   │ 6 / 16', ts: now },
        { type: 'result', text: '  Spectators│ 0 / 32', ts: now },
        { type: 'result', text: '  HideServer│ No', ts: now },
        { type: 'result', text: '  Port      │ 2350', ts: now },
        { type: 'result', text: '  Uptime    │ 2j 14h 27min', ts: now },
        { type: 'result', text: '────────────────────────────────────────────', ts: now },
    ]

    // ── Kick ──────────────────────────────────────────────────────────────────
    if (lcmd.startsWith('/kick ') || lcmd.startsWith('kick ')) {
        const name = cmd.split(' ').slice(1).join(' ')
        if (!name) return [{ type: 'error', text: 'Usage: /kick <pseudo>', ts: now }]
        const found = PLAYERS.find(p => p.toLowerCase() === name.toLowerCase())
        if (!found) return [{ type: 'error', text: `Player not found: ${name}. Use GetPlayerList to see connected players.`, ts: now }]
        return [
            { type: 'info', text: `Kicking player: ${found}...`, ts: now },
            { type: 'success', text: `${found} has been kicked from the server.`, ts: now },
        ]
    }

    // ── Ban ────────────────────────────────────────────────────────────────────
    if (lcmd.startsWith('/ban ') || lcmd.startsWith('ban ')) {
        const name = cmd.split(' ').slice(1).join(' ')
        if (!name) return [{ type: 'error', text: 'Usage: /ban <pseudo>', ts: now }]
        return [
            { type: 'info', text: `Banning player: ${name}...`, ts: now },
            { type: 'warn', text: `${name} added to blacklist. They will be rejected on reconnect.`, ts: now },
        ]
    }

    // ── Unban ──────────────────────────────────────────────────────────────────
    if (lcmd.startsWith('/unban ')) {
        const name = cmd.split(' ')[1]
        return [{ type: 'success', text: `${name} removed from blacklist.`, ts: now }]
    }

    // ── GetBanList ─────────────────────────────────────────────────────────────
    if (lcmd === 'getbanlist') return [
        { type: 'result', text: '─── Ban List ────────────────────────────────', ts: now },
        { type: 'result', text: '  No players currently banned.', ts: now },
        { type: 'result', text: '────────────────────────────────────────────', ts: now },
    ]

    // ── Password ───────────────────────────────────────────────────────────────
    if (lcmd.startsWith('setserverpassword ')) {
        const pass = cmd.split(' ').slice(1).join(' ')
        return [{ type: 'success', text: pass ? `Server password set to: ${pass}` : 'Server password cleared (public).', ts: now }]
    }
    if (lcmd === 'clearpassword' || lcmd === 'setserverpassword') {
        return [{ type: 'success', text: 'Server is now public (no password).', ts: now }]
    }

    // ── Max players ────────────────────────────────────────────────────────────
    if (lcmd.startsWith('setmaxplayers ')) {
        const n = parseInt(cmd.split(' ')[1])
        if (isNaN(n) || n < 1 || n > 32) return [{ type: 'error', text: 'Usage: SetMaxPlayers <1-32>', ts: now }]
        return [{ type: 'success', text: `Max players set to: ${n}`, ts: now }]
    }

    // ── ForceSpec ─────────────────────────────────────────────────────────────
    if (lcmd.startsWith('/forcespec ')) {
        const name = cmd.split(' ')[1]
        return [
            { type: 'info', text: `Forcing ${name} to spectator...`, ts: now },
            { type: 'success', text: `${name} is now spectating.`, ts: now },
        ]
    }

    // ── Chat ──────────────────────────────────────────────────────────────────
    if (lcmd.startsWith('/say ') || lcmd.startsWith('chatmessage ')) {
        const msg = cmd.split(' ').slice(1).join(' ')
        return [{ type: 'chat', text: `[Server] ${msg}`, ts: now }]
    }

    // ── XAseco commands ────────────────────────────────────────────────────────
    if (lcmd === 'getrecords' || lcmd === '/records') return [
        { type: 'result', text: '─── Local Records ───────────────────────────', ts: now },
        { type: 'result', text: '  #1 │ Speedy_TM  │ 0:47.321', ts: now },
        { type: 'result', text: '  #2 │ Racer07    │ 0:48.104', ts: now },
        { type: 'result', text: '  #3 │ NeonDrift  │ 0:49.882', ts: now },
        { type: 'result', text: '  #4 │ Ghost99    │ 0:51.445', ts: now },
        { type: 'result', text: '────────────────────────────────────────────', ts: now },
    ]

    if (lcmd === 'clearrecords') return [
        { type: 'warn', text: 'Clearing all local records for current map...', ts: now },
        { type: 'success', text: 'Records cleared.', ts: now },
    ]

    // ── Restart server ─────────────────────────────────────────────────────────
    if (lcmd === 'restartserver' || lcmd === 'restart') return [
        { type: 'warn', text: 'Server restart initiated...', ts: now },
        { type: 'info', text: 'Saving state...', ts: now },
        { type: 'info', text: 'Restarting process...', ts: now },
        { type: 'success', text: 'Server restarted successfully. Players will be reconnected.', ts: now },
    ]

    // ── Stop ──────────────────────────────────────────────────────────────────
    if (lcmd === 'stop' || lcmd === 'stopserver') return [
        { type: 'warn', text: 'Use the Dashboard "Stop" button to safely halt the server. Command acknowledged.', ts: now },
    ]

    // ── Help ──────────────────────────────────────────────────────────────────
    if (lcmd === 'help' || lcmd === '?') return [
        { type: 'result', text: '─── Available Commands ──────────────────────', ts: now },
        { type: 'result', text: '  RestartMap          Relance la map actuelle', ts: now },
        { type: 'result', text: '  NextMap / PrevMap   Change de map', ts: now },
        { type: 'result', text: '  GetPlayerList       Liste des joueurs', ts: now },
        { type: 'result', text: '  GetCurrentMapInfo   Infos de la map', ts: now },
        { type: 'result', text: '  GetServerInfo       Infos du serveur', ts: now },
        { type: 'result', text: '  /kick <pseudo>      Expulse un joueur', ts: now },
        { type: 'result', text: '  /ban <pseudo>       Banit un joueur', ts: now },
        { type: 'result', text: '  /unban <pseudo>     Retire un ban', ts: now },
        { type: 'result', text: '  GetBanList          Liste des bannis', ts: now },
        { type: 'result', text: '  SetServerPassword   Définit le mdp', ts: now },
        { type: 'result', text: '  SetMaxPlayers <n>   Max joueurs', ts: now },
        { type: 'result', text: '  /forcespec <pseudo> Met en spectateur', ts: now },
        { type: 'result', text: '  /say <message>      Message serveur', ts: now },
        { type: 'result', text: '  GetRecords          Records actuels', ts: now },
        { type: 'result', text: '  ClearRecords        Efface les records', ts: now },
        { type: 'result', text: '  RestartServer       Redémarre le serveur', ts: now },
        { type: 'result', text: '  help / ?            Affiche cette aide', ts: now },
        { type: 'result', text: '────────────────────────────────────────────', ts: now },
    ]

    // ── Unknown ────────────────────────────────────────────────────────────────
    return [{ type: 'error', text: `Unknown command: "${cmd}". Type "help" to see available commands.`, ts: now }]
}

function ts() { return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }

/* ─── Live Events ─────────────────────────────────────────────────────────── */
const LIVE_EVENTS: { type: LogLine['type']; text: string }[] = [
    { type: 'chat', text: '[Speedy_TM] encore !!' },
    { type: 'info', text: 'Player joined: AlphaRun' },
    { type: 'chat', text: '[Racer07] pb !!' },
    { type: 'success', text: 'Record: NeonDrift — 0:49.321' },
    { type: 'warn', text: 'High ping: Ghost99 (190ms)' },
    { type: 'chat', text: '[AlphaRun] gg wp' },
    { type: 'info', text: 'Player left: Turbo_K' },
    { type: 'success', text: 'Record: Speedy_TM — 0:46.882 (nouveau record serveur!)' },
    { type: 'chat', text: '[NeonDrift] next map svp' },
    { type: 'info', text: 'XAseco: Karma updated for StadiumRacer_v2' },
]

const QUICK_CMDS = [
    { label: 'RestartMap', cmd: 'RestartMap' },
    { label: 'NextMap', cmd: 'NextMap' },
    { label: 'GetPlayerList', cmd: 'GetPlayerList' },
    { label: 'GetRecords', cmd: 'GetRecords' },
    { label: 'GetCurrentMapInfo', cmd: 'GetCurrentMapInfo' },
    { label: 'GetServerInfo', cmd: 'GetServerInfo' },
    { label: '/kick Ghost99', cmd: '/kick Ghost99' },
    { label: 'GetBanList', cmd: 'GetBanList' },
    { label: '/say Roadmap coming!', cmd: '/say Roadmap coming!' },
    { label: 'Help', cmd: 'help' },
]

const INIT_LOGS: LogLine[] = [
    { type: 'info', text: 'ManiaPlanet Dedicated Server booting...', ts: '10:42:00' },
    { type: 'info', text: 'Loading TrackHost runtime environment', ts: '10:42:01' },
    { type: 'info', text: 'Map pool loaded: 24 maps', ts: '10:42:02' },
    { type: 'info', text: 'XAseco 1.16.4 initialized', ts: '10:42:03' },
    { type: 'success', text: 'Server online — port 2350 — 0/16 players', ts: '10:42:04' },
    { type: 'info', text: 'Player joined: Speedy_TM (ping: 22ms)', ts: '10:43:09' },
    { type: 'chat', text: '[Speedy_TM] gg wp les gars !', ts: '10:43:11' },
    { type: 'info', text: 'Player joined: Racer07 (ping: 45ms)', ts: '10:44:15' },
    { type: 'warn', text: 'High ping: Ghost99 (280ms)', ts: '10:45:33' },
    { type: 'success', text: 'Record: Speedy_TM — 0:47.321 (nouveau record!)', ts: '10:46:02' },
    { type: 'result', text: 'Type "help" to see available RCON commands.', ts: '10:46:05' },
]

/* ─── Component ──────────────────────────────────────────────────────────── */
export default function Console() {
    const [logs, setLogs] = useState<LogLine[]>(INIT_LOGS)
    const [input, setInput] = useState('')
    const [history, setHistory] = useState<string[]>([])
    const [histIdx, setHistIdx] = useState(-1)
    const [live, setLive] = useState(true)
    const bottomRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [logs])

    // Live event pump
    const fire = useCallback(() => {
        if (!live) return
        const e = LIVE_EVENTS[Math.floor(Math.random() * LIVE_EVENTS.length)]
        setLogs(l => [...l.slice(-199), { ...e, ts: ts() }])
    }, [live])

    useEffect(() => {
        const id = setInterval(fire, 4000 + Math.random() * 4000)
        return () => clearInterval(id)
    }, [fire])

    function submit(cmd?: string) {
        const raw = (cmd ?? input).trim()
        if (!raw) return
        const t = ts()
        setLogs(l => [...l.slice(-199), { type: 'cmd', text: `❯ ${raw}`, ts: t }])
        setHistory(h => [raw, ...h.slice(0, 49)])
        setHistIdx(-1)
        setInput('')

        // Simulate network delay then response
        const delay = 120 + Math.random() * 180
        setTimeout(() => {
            const responses = handleCommand(raw)
            setLogs(l => [...l, ...responses])
        }, delay)
        inputRef.current?.focus()
    }

    function onKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter') { submit(); return }
        if (e.key === 'ArrowUp') {
            e.preventDefault()
            const next = Math.min(histIdx + 1, history.length - 1)
            setHistIdx(next); setInput(history[next] ?? '')
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            const next = Math.max(histIdx - 1, -1)
            setHistIdx(next); setInput(next === -1 ? '' : history[next])
        }
    }

    function exportLogs() {
        const text = logs.map(l => `[${l.ts}] ${l.text}`).join('\n')
        const blob = new Blob([text], { type: 'text/plain' })
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = `rcon-logs-${Date.now()}.txt`
        a.click()
    }

    const logColor: Record<LogLine['type'], string> = {
        cmd: 'var(--primary)', info: 'var(--text-mid)', chat: 'var(--cyan)',
        warn: 'var(--orange)', success: 'var(--primary)', error: 'var(--red)', result: 'var(--text-low)',
    }
    const logPrefix: Record<LogLine['type'], string> = {
        cmd: '', info: '·', chat: '💬', warn: '⚠', success: '✓', error: '✗', result: '│',
    }

    return (
        <>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="page-title">Console RCON</h1>
                    <p className="page-subtitle">
                        TrackMania Nations Forever · Serveur connecté · {' '}
                        <span style={{ color: live ? 'var(--primary)' : 'var(--red)' }}>
                            {live ? '⬤ Live events ON' : '⬤ Live events OFF'}
                        </span>
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-ghost" style={{ fontSize: 11 }} onClick={() => setLive(!live)}>
                        {live ? 'Pause events' : 'Resume events'}
                    </button>
                    <button className="btn btn-ghost" style={{ fontSize: 11 }} onClick={exportLogs}>
                        <Download size={12} /> Export logs
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 'var(--space-4)', height: 'calc(100vh - 200px)' }}>

                {/* ── Main Terminal ── */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                    {/* Title bar */}
                    <div className="terminal-bar" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="t-dot red" /><span className="t-dot orange" /><span className="t-dot green" />
                        <span className="terminal-bar-title" style={{ marginLeft: 4 }}>
                            <Terminal size={11} /> rcon@tmnf://my-server:2350
                        </span>
                        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                            <button className="btn btn-ghost" style={{ padding: '3px 8px', fontSize: 10 }}
                                onClick={() => { navigator.clipboard.writeText(logs.map(l => `[${l.ts}] ${l.text}`).join('\n')).catch(() => { }) }}>
                                <Copy size={10} /> Copy
                            </button>
                            <button className="btn btn-ghost" style={{ padding: '3px 8px', fontSize: 10 }} onClick={() => setLogs([])}>
                                <Trash2 size={10} /> Clear
                            </button>
                        </div>
                    </div>

                    {/* Output */}
                    <div className="console-output" style={{ flex: 1 }}>
                        {logs.map((line, i) => (
                            <div key={i} className="console-line" style={{ animationDelay: `${Math.min(i * 5, 50)}ms` }}>
                                <span className="console-ts">{line.ts}</span>
                                {logPrefix[line.type] && <span className="console-prefix" style={{ color: logColor[line.type] }}>{logPrefix[line.type]}</span>}
                                <span className="console-text" style={{ color: logColor[line.type], fontFamily: 'var(--font-mono)', fontSize: 12 }}>{line.text}</span>
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <div className="console-input-row">
                        <ChevronRight size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                        <input
                            ref={inputRef}
                            className="input"
                            style={{ background: 'transparent', border: 'none', borderRadius: 0, padding: '0 8px', boxShadow: 'none' }}
                            placeholder='Tapez une commande RCON… (essayez "help")'
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={onKeyDown}
                            autoFocus
                        />
                        <button className="btn btn-primary" style={{ padding: '0 14px', height: 36, flexShrink: 0 }} onClick={() => submit()}>
                            <Send size={13} />
                        </button>
                    </div>
                </div>

                {/* ── Quick Commands ── */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div className="card-title" style={{ marginBottom: 8 }}>⚡ Commandes rapides</div>
                    {QUICK_CMDS.map(({ label, cmd }) => (
                        <button key={cmd} className="btn btn-ghost"
                            style={{ fontSize: 11, padding: '8px 10px', justifyContent: 'flex-start', fontFamily: 'var(--font-mono)', textTransform: 'none', letterSpacing: 0 }}
                            onClick={() => submit(cmd)}>
                            <ChevronRight size={10} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                            {label}
                        </button>
                    ))}

                    <div className="divider" style={{ margin: '8px 0' }} />
                    <div className="card-title" style={{ marginBottom: 6 }}>⌨ Raccourcis</div>
                    {[['↑ / ↓', 'Historique'], ['Enter', 'Envoyer'], ['Ctrl+L', 'Clear']].map(([k, v]) => (
                        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-low)', padding: '3px 0' }}>
                            <span style={{ color: 'var(--text-mid)' }}>{k}</span><span>{v}</span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
