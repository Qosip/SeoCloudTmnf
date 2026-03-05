import { User, Key, Globe, Bell, Save } from 'lucide-react'

const SECTIONS = [
    {
        icon: User,
        title: 'Compte',
        fields: [
            { label: 'Email', type: 'email', value: 'user@trackhost.gg' },
            { label: 'Pseudo ManiaPlanet', type: 'text', value: 'Speedy_TM' },
        ]
    },
    {
        icon: Key,
        title: 'Sécurité',
        fields: [
            { label: 'Mot de passe actuel', type: 'password', value: '' },
            { label: 'Nouveau mot de passe', type: 'password', value: '' },
        ]
    },
    {
        icon: Globe,
        title: 'Serveur',
        fields: [
            { label: 'Région', type: 'text', value: 'Europe (Paris)' },
            { label: 'Plan actif', type: 'text', value: 'Starter — 1 serveur, 16 slots' },
        ]
    },
    {
        icon: Bell,
        title: 'Notifications',
        fields: [
            { label: 'Alerte joueurs (> 10)', type: 'text', value: 'Activé' },
            { label: 'Alerte ping critique', type: 'text', value: 'Activé' },
        ]
    },
]

export default function Settings() {
    return (
        <>
            <div className="page-header">
                <h1 className="page-title">Paramètres</h1>
                <p className="page-subtitle">Compte, sécurité, serveur et notifications</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: 640 }}>
                {SECTIONS.map(({ icon: Icon, title, fields }) => (
                    <div key={title} className="card">
                        <div className="card-title" style={{ marginBottom: 'var(--space-4)' }}>
                            <Icon size={14} /> {title}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                            {fields.map(({ label, type, value }) => (
                                <div key={label}>
                                    <label style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-low)', display: 'block', marginBottom: 4 }}>
                                        {label}
                                    </label>
                                    <input className="input" type={type} defaultValue={value} />
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: 'var(--space-4)' }}>
                            <button className="btn btn-primary" style={{ fontSize: 12, padding: '7px 16px' }}>
                                <Save size={12} /> Sauvegarder
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
