import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface User {
    id: string
    email: string
    name: string
    avatar: string
    plan: 'starter' | 'pro' | 'elite' | null
    createdAt: string
}

interface AuthCtx {
    user: User | null
    login: (email: string, pass: string) => Promise<boolean>
    register: (name: string, email: string, pass: string) => Promise<boolean>
    logout: () => void
    isLoading: boolean
}

const AuthContext = createContext<AuthCtx | null>(null)

const DEFAULT_USER: User = {
    id: 'u1',
    email: 'demo@trackhost.gg',
    name: 'TrackHost Demo',
    avatar: 'TD',
    plan: 'pro',
    createdAt: '2026-01-15',
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const stored = localStorage.getItem('trackhost_user')
        if (stored) { try { setUser(JSON.parse(stored)) } catch { } }
        setIsLoading(false)
    }, [])

    async function login(email: string, _pass: string): Promise<boolean> {
        await new Promise(r => setTimeout(r, 900))
        // Simulate: accept demo creds or any stored user
        const stored = localStorage.getItem(`trackhost_acc_${email}`)
        const u: User = stored ? JSON.parse(stored) : email === 'demo@trackhost.gg'
            ? DEFAULT_USER
            : null
        if (!u) return false
        setUser(u)
        localStorage.setItem('trackhost_user', JSON.stringify(u))
        return true
    }

    async function register(name: string, email: string, _pass: string): Promise<boolean> {
        await new Promise(r => setTimeout(r, 900))
        const u: User = {
            id: crypto.randomUUID(),
            email,
            name,
            avatar: name.slice(0, 2).toUpperCase(),
            plan: null,
            createdAt: new Date().toISOString().split('T')[0],
        }
        localStorage.setItem(`trackhost_acc_${email}`, JSON.stringify(u))
        setUser(u)
        localStorage.setItem('trackhost_user', JSON.stringify(u))
        return true
    }

    function logout() {
        setUser(null)
        localStorage.removeItem('trackhost_user')
    }

    return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be inside AuthProvider')
    return ctx
}
