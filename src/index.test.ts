import { getCurrentZone } from './'

test('getCurrentZone should get current zone correctly', () => {
  const bps = [ 0, 100, 200, 300, 400 ]

  const testWidth = [50, 150, 250, 350, 450]
  testWidth.forEach((width, i) => {
    (window as any).innerWidth = width
    const zone = getCurrentZone(bps)
    expect(zone).toBe(i)
  })
})