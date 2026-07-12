import { describe, it, expect } from 'vitest';
import { sum } from '../sum';


describe("first test", () => {
  it('adds two positive numbers', () => {
    expect(sum(1, 2)).toBe(3);
  })

});
