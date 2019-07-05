import * as React from 'react'
import { useContext, useState, useEffect } from 'react'

type MQListEventListener = (this: MediaQueryList, ev: MediaQueryListEvent) => void

type GetCurrentZone = (FullBreakpoints: number[]) => number
const getCurrentZone: GetCurrentZone = bps => {
  if (typeof window === 'undefined') return 0
  const width = window.innerWidth
  let zone = bps.findIndex(bp => width < bp)
  if (zone < 0) zone = bps.length - 1
  return zone
}

type GetMediaQueryLists = (FullBreakPoints: number[]) => MediaQueryList[]
const getMqLists: GetMediaQueryLists = (bps) => bps.map((bp, i) => {
  const nextBp = bps[i + 1]
  return window.matchMedia(
    `(min-width: ${bp}px) ${nextBp ? `and (max-width: ${nextBp}px)` : ''}`
  )
})

export const ZoneContext = React.createContext<number>(0)
export const useZone = () => useContext(ZoneContext)

interface ZoneManagerProps {
  breakpoints?: number[]
}

// bootstrap default breakpoints
export const ZoneManager: React.FC<ZoneManagerProps> = ({
  breakpoints = [576, 767, 991, 1199], 
  children 
}) => {
  const bps = [0, ...breakpoints]
  const [zone, setZone] = useState(getCurrentZone(bps))

  useEffect(() => {
    const listenerForZone = (i: number):MQListEventListener => (e) => {
      if (!e.matches) return
      setZone(i)
    }
    
    const listeners: MQListEventListener[] = []
    const mqLists = getMqLists(bps)
    mqLists.forEach((mqList, i) => {
      const listener = listenerForZone(i)
      mqList.addListener(listener)
      listeners.push(listener)
    })

    return () => {
      mqLists.forEach((mqList, i) => mqList.removeListener(listeners[i]))
    }
  }, [bps])

  return <ZoneContext.Provider value={zone}>{children}</ZoneContext.Provider>
}
