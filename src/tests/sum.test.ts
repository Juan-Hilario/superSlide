import { describe, it, expect, test } from 'vitest';
import { sum } from '../sum';


describe("sum function", () => {
  it('adds two positive numbers', () => {
    expect(sum(1, 2)).toBe(3);
    expect(sum(2, 2)).toBe(4);
  })

  test('adds negative numbers', () => {
    expect(sum(-2, -2)).toBe(-4);
  })

  test('adding decimals', () => {
    expect(sum(1.5, 2.5)).toBe(4);
  })

  test('nested sum function; adding three numbers', () => {
    expect(sum(sum(1, 3), 2)).toBe(6);
  })
});
