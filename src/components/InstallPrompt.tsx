"use client"

import React, { useEffect, useState } from "react"

/**
 * Lightweight PWA install prompt.
 * Listens for `beforeinstallprompt` and shows a small, dismissible banner.
 */
export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<any>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onBeforeInstall = (e: any) => {
      e.preventDefault()
      setDeferred(e)
      // Avoid nagging: show once per session
      if (!sessionStorage.getItem("pwa_install_dismissed")) {
        setVisible(true)
      }
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstall)
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall)
  }, [])

  const install = async () => {
    if (!deferred) return
    setVisible(false)
    const choice = await deferred.prompt()
    // choice.outcome can be 'accepted' or 'dismissed'
    setDeferred(null)
  }

  const dismiss = () => {
    setVisible(false)
    sessionStorage.setItem("pwa_install_dismissed", "1")
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 shadow-lg">
      <div className="flex items-center gap-3 bg-yellow-500 text-black px-4 py-3 rounded-xl border border-yellow-600">
        <span className="font-semibold">Встановити додаток?</span>
        <button onClick={install} className="px-3 py-1 bg-black/10 rounded-lg hover:bg-black/20 font-medium">Встановити</button>
        <button onClick={dismiss} className="px-3 py-1 hover:bg-black/10 rounded-lg font-medium">Пізніше</button>
      </div>
    </div>
  )
}
