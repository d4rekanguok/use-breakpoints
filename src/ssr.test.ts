/**
 * @jest-environment node
 */

import { getCurrentZone } from './'

test('getCurrentZone should respect default value', () => {
  const defaultZone = 1
  const zone = getCurrentZone([0], 1)
  expect(zone).toBe(1)
})