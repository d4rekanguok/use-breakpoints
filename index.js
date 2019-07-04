import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
const getCurrentZone = bps => {
    if (typeof window === 'undefined')
        return 0;
    const width = window.innerWidth;
    let zone = bps.findIndex(bp => width < bp);
    if (zone < 0)
        zone = bps.length - 1;
    return zone;
};
const getMqLists = (bps) => bps.map((bp, i) => {
    const nextBp = bps[i + 1];
    return window.matchMedia(`(min-width: ${bp}px) ${nextBp ? `and (max-width: ${nextBp}px)` : ''}`);
});
export const ZoneContext = React.createContext(0);
export const useZone = () => useContext(ZoneContext);
// bootstrap default breakpoints
export const ZoneManager = ({ breakpoints = [576, 767, 991, 1199], children }) => {
    const bps = [0, ...breakpoints];
    const [zone, setZone] = useState(getCurrentZone(bps));
    useEffect(() => {
        const listenerForZone = (i) => (e) => {
            if (!e.matches)
                return;
            setZone(i);
        };
        const listeners = [];
        const mqLists = getMqLists(bps);
        mqLists.forEach((mqList, i) => {
            const listener = listenerForZone(i);
            mqList.addListener(listener);
        });
        return () => {
            mqLists.forEach((mqList, i) => mqList.removeListener(listeners[i]));
        };
    }, [bps]);
    return React.createElement(ZoneContext.Provider, { value: zone }, children);
};
