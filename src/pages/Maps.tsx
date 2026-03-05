import { useState } from 'react'
import { Upload, Download, Trash2, Play, Package, Settings2, CheckCircle2 } from 'lucide-react'

interface GameMap { name: string; author: string; uid: string; active: boolean }

const MAPS: GameMap[] = [
    { name: 'A01-Race', author: 'Nadeo', uid: 'a01r', active: true },
    { name: 'A02-Race', author: 'Nadeo', uid: 'a02r', active: true },
    { name: 'Stadium_Racer_v2', author: 'Speedy_TM', uid: 'sr2', active: true },
    { name: 'HelixLoop_Final', author: 'Racer07', uid: 'hl1', active: false },
    { name: 'DesertPeak_Pro', author: 'GhostLine', uid: 'dp1', active: true },
]

const PLUGINS = [
    { name: 'XAseco', version: '1.16.4', desc: 'Plugin manager complet pour TMNF', installed: true },
    { name: 'ManiaLive', version: '1.2.1', desc: 'Framework de plugins alternatif', installed: false },
    { name: 'TMX Tools', version: '0.9.8', desc: 'Intégration TrackMania Exchange', installed: false },
]

export default function Maps() {
    const [maps, setMaps] = useState<GameMap[]>(MAPS)
    const [tab, setTab] = useState<'maps' | 'plugins' | 'config'>('maps')

    function toggleMap(uid: string) {
        setMaps(m => m.map(map => map.uid === uid ? { ...map, active: !map.active } : map))
    }

    return (
        <>
            <div className="page-header">
                <h1 className="page-title">Maps & Plugins</h1>
                <p className="page-subtitle">Gérez votre bibliothèque, plugins et configuration</p>
            </div>

            {/* Tabs */}
            <div className="tabs" style={{ marginBottom: 'var(--space-5)' }}>
                {(['maps', 'plugins', 'config'] as const).map(t => (
                    <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                        {{ maps: '🗺 Maps', plugins: '🔌 Plugins', config: '⚙ Config' }[t]}
                    </button>
                ))}
            </div>

            {/* Maps tab */}
            {tab === 'maps' && (
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                        <span className="card-title"><Play size={14} /> {maps.filter(m => m.active).length} / {maps.length} maps actives</span>
                        <button className="btn btn-primary" style={{ fontSize: 12, padding: '7px 14px' }}>
                            <Upload size={13} /> Upload une map
                        </button>
                    </div>
                    <div className="map-list">
                        {maps.map(map => (
                            <div key={map.uid} className="map-row">
                                <div className="map-row-left">
                                    <button className="map-toggle" onClick={() => toggleMap(map.uid)}
                                        style={{ color: map.active ? 'var(--primary)' : 'var(--text-ghost)' }}>
                                        <CheckCircle2 size={16} />
                                    </button>
                                    <div>
                                        <div className="map-name">{map.name}</div>
                                        <div className="map-author">by {map.author}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                                    <span className={`badge ${map.active ? 'badge-green' : 'badge-gray'}`}>
                                        {map.active ? 'Actif' : 'Inactif'}
                                    </span>
                                    <button className="btn btn-danger" style={{ padding: '4px 8px' }}><Trash2 size={12} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Plugins tab */}
            {tab === 'plugins' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {PLUGINS.map(p => (
                        <div key={p.name} className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                            <Package size={20} style={{ color: p.installed ? 'var(--primary)' : 'var(--text-low)', flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--text-high)', fontSize: 15, letterSpacing: '0.03em' }}>
                                    {p.name} <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-low)' }}>v{p.version}</span>
                                </div>
                                <div style={{ fontSize: 12, color: 'var(--text-mid)', marginTop: 2 }}>{p.desc}</div>
                            </div>
                            {p.installed ? (
                                <span className="badge badge-green">Installé</span>
                            ) : (
                                <button className="btn btn-outline" style={{ fontSize: 12, padding: '6px 14px' }}>
                                    <Download size={12} /> Installer
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Config tab */}
            {tab === 'config' && (
                <div className="card">
                    <div className="card-title" style={{ marginBottom: 'var(--space-4)' }}>
                        <Settings2 size={14} /> dedicated_cfg.txt
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        {[
                            { k: 'server_name', v: 'My TMNF Server', label: 'Nom du serveur' },
                            { k: 'max_players', v: '16', label: 'Max joueurs' },
                            { k: 'server_password', v: '', label: 'Mot de passe (vide = public)' },
                            { k: 'ladder_mode', v: 'forced', label: 'Mode Ladder' },
                        ].map(({ k, v, label }) => (
                            <div key={k}>
                                <label style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-low)', display: 'block', marginBottom: 4 }}>{label}</label>
                                <input className="input" defaultValue={v} placeholder={`<${k}>`} />
                            </div>
                        ))}
                        <button className="btn btn-primary" style={{ marginTop: 'var(--space-2)', alignSelf: 'flex-start' }}>
                            Sauvegarder et redémarrer
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
