// lib/client-cookies.ts
import { setCookie, parseCookies, destroyCookie } from "nookies"

export const storeCookie = (key: string, value: string) => {
    setCookie(null, key, value, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        httpOnly: false
    })
}

export const getCookie = (key: string) => {
    const cookies = parseCookies()
    return cookies[key]
}

export const removeCookie = (key: string) => {
    destroyCookie(null, key)
}
