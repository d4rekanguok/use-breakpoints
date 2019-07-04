<h1 style="text-align: center;">use-breakpoints</h1>

<p style="text-align: center;">React hook* for setting breakpoints in the browsers with `window.matchMedia`, SSR friendly<br />
<small style="text-align: center;"> * It's actually not a hook, it's a container component with a context hook</small></p>

---

### Why

I needed to detect browser's width on resize when developing a fairly animation-heavy website with [Gatsby.js](https://gatsbyjs.org). However I realized that I only need to know which 'zone' (area between breakpoints) the browser is in & it made more sense to use `window.matchMedia` instead (Plus it's more fun to try out a 'new' API).

This is actually not really a hook, no, it *was* a hook until I realized each hook usage in a component added new event listeners to the dom. Granted, it probably doesn't matter, but I prefer to attach only the events that I needed, as often as I needed to.

### How

Wrap the root of your app with `<ZoneManager />` from `use-zone-breakpoints`. It accepts a single props: An array of breakpoints in pixels.

```jsx
  <ZoneManager breakpoints={[ 576, 767, 991, 1199 ]}>
    <App />
  </ZoneManager>
```

It'll create zones in between these breakpoints. For example, these are the zone created with the breakpoints above:

breakpoints | 0 -> 576 | 576 -> 767 | 767 -> 991 | 991 -> 1199 | 1199 -> ∞    
--:         |:-:       |:-:         |:-:          |:-:          |:-:
zone        | 0        | 1          | 2           | 3           | 4


#### Example

[Codesandbox](https://codesandbox.io/s/beautiful-dhawan-3qtjf?fontsize=14)

Minimal one pager:

```jsx
import React from 'react'
import { render } from 'react-dom'
import { useZone, ZoneManager } from 'use-zone-breakpoints'

const ZoneDisplay = () => {
  const zone = useZone()
  return (<h1>{zone}</h1>)
}

const App = () => (
  <ZoneManager breakpoints={[ 360, 480, 640, 960, 1280 ]}>
    <h1>Zone</h1>
    <ZoneDisplay />
  </ZoneManager>
)

const $root = document.getElementById('root')
render(<App />, $root)
```

### Use with Gatsby

Import `<ZoneManager>` & wrap root element in `gatsby-browser.js` & `gatsby-ssr.js`:

```
export const wrapRootElement = ({ element }) => (
  <ZoneManager breakpoints={[ 360, 960 ]}>{ element }</ZoneManager>
)
```

Then import `useZone` to get zone in any functional components.

### Use with js-in-css

I keep an array of breakpoints as a constant:

```js
const BREAKPOINTS = [360, 640, 960]
```

This breakpoints can be shared with a styled library, like [this example with emotion](https://emotion.sh/docs/media-queries)