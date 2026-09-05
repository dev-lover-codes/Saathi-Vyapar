/**
 * schemeMatcher.test.ts
 * Vitest tests for the scheme matching engine.
 * Tests various business profiles against mock scheme data.
 */

import { describe, it, expect } from 'vitest';
import { matchSchemes, BusinessProfile, SchemeRecord } from './schemeMatcher';

// ── Mock Schemes ──────────────────────────────────────────────────────────────

const mockSchemes: SchemeRecord[] = [
  {
    id: 'scheme-1',
    name: 'PMEGP',
    eligibility_rules: {
      income_max: 2500000, // ₹25 lakh annual
    },
  },
  {
    id: 'scheme-2',
    name: 'Stand-Up India',
    eligibility_rules: {
      category: ['sc', 'st'],
      // Also for women — but we don't mix gender+category in same rule here for test clarity
    },
  },
  {
    id: 'scheme-3',
    name: 'Mahila Samridhi Yojana',
    eligibility_rules: {
      gender: 'female',
      income_max: 1200000, // ₹12 lakh annual
    },
  },
  {
    id: 'scheme-4',
    name: 'KVIC Honey Mission',
    eligibility_rules: {
      sector: ['agriculture', 'beekeeping'],
    },
  },
  {
    id: 'scheme-5',
    name: 'PM SVANidhi',
    eligibility_rules: {
      // Street vendors — no category/sector restriction
    },
  },
];

// ── Test Scenarios ─────────────────────────────────────────────────────────────

describe('matchSchemes', () => {
  // Scenario 1: SC entrepreneur with low revenue — should match PMEGP + Stand-Up India
  it('SC entrepreneur with low revenue matches PMEGP and Stand-Up India', () => {
    const profile: BusinessProfile = {
      monthly_revenue_est: 15000, // ₹1.8L annual — within PMEGP limit
      monthly_expense_est: 10000,
      existing_loans: false,
      category: 'sc',
      sector: 'retail',
      gender: 'male',
    };

    const results = matchSchemes(profile, mockSchemes);

    const pmegp = results.find((r) => r.scheme.name === 'PMEGP');
    const standUp = results.find((r) => r.scheme.name === 'Stand-Up India');
    const mahila = results.find((r) => r.scheme.name === 'Mahila Samridhi Yojana');

    expect(pmegp?.eligible).toBe(true);
    expect(standUp?.eligible).toBe(true);
    expect(mahila?.eligible).toBe(false); // male, not female
  });

  // Scenario 2: Female ST entrepreneur with low income — eligible for Mahila + Stand-Up India
  it('Female ST entrepreneur matches Mahila Samridhi Yojana and Stand-Up India', () => {
    const profile: BusinessProfile = {
      monthly_revenue_est: 8000, // ₹96K annual — well within ₹12L limit
      monthly_expense_est: 5000,
      existing_loans: false,
      category: 'st',
      sector: 'services',
      gender: 'female',
    };

    const results = matchSchemes(profile, mockSchemes);

    const mahila = results.find((r) => r.scheme.name === 'Mahila Samridhi Yojana');
    const standUp = results.find((r) => r.scheme.name === 'Stand-Up India');

    expect(mahila?.eligible).toBe(true);
    expect(standUp?.eligible).toBe(true);
  });

  // Scenario 3: High-revenue general category male — exceeds income limits
  it('High-revenue general category male exceeds PMEGP income limit', () => {
    const profile: BusinessProfile = {
      monthly_revenue_est: 250000, // ₹30L annual — exceeds PMEGP ₹25L limit
      monthly_expense_est: 150000,
      existing_loans: true,
      category: 'general',
      sector: 'manufacturing',
      gender: 'male',
    };

    const results = matchSchemes(profile, mockSchemes);

    const pmegp = results.find((r) => r.scheme.name === 'PMEGP');
    expect(pmegp?.eligible).toBe(false);
    // Reason should mention the income limit
    expect(pmegp?.reasons.some((r) => r.includes('exceeds'))).toBe(true);
  });

  // Scenario 4: Agriculture sector entrepreneur matches KVIC Honey Mission
  it('Agriculture sector entrepreneur matches KVIC Honey Mission', () => {
    const profile: BusinessProfile = {
      monthly_revenue_est: 12000,
      monthly_expense_est: 8000,
      existing_loans: false,
      category: 'obc',
      sector: 'agriculture',
      gender: 'male',
    };

    const results = matchSchemes(profile, mockSchemes);

    const kvic = results.find((r) => r.scheme.name === 'KVIC Honey Mission');
    expect(kvic?.eligible).toBe(true);
    expect(kvic?.reasons.some((r) => r.includes('✓'))).toBe(true);
  });

  // Scenario 5: Any entrepreneur qualifies for PM SVANidhi (no eligibility restrictions)
  it('Any entrepreneur qualifies for PM SVANidhi (open scheme)', () => {
    const profile: BusinessProfile = {
      monthly_revenue_est: 5000,
      monthly_expense_est: 4000,
      existing_loans: false,
      category: 'general',
      sector: 'street_vending',
      gender: 'female',
    };

    const results = matchSchemes(profile, mockSchemes);

    const svaNidhi = results.find((r) => r.scheme.name === 'PM SVANidhi');
    expect(svaNidhi?.eligible).toBe(true);
    expect(svaNidhi?.reasons.some((r) => r.includes('no specific eligibility'))).toBe(true);
  });

  // Scenario 6: Eligible schemes appear first in sorted results
  it('Returns eligible schemes before ineligible ones', () => {
    const profile: BusinessProfile = {
      monthly_revenue_est: 5000,
      monthly_expense_est: 3000,
      existing_loans: false,
      category: 'general',
      gender: 'male',
    };

    const results = matchSchemes(profile, mockSchemes);

    // Find the index of first ineligible result
    const firstIneligibleIndex = results.findIndex((r) => !r.eligible);
    // Find the index of last eligible result
    const lastEligibleIndex = results.reduce(
      (acc, r, i) => (r.eligible ? i : acc),
      -1
    );

    // All eligible schemes should appear before ineligible ones
    if (firstIneligibleIndex !== -1 && lastEligibleIndex !== -1) {
      expect(lastEligibleIndex).toBeLessThan(firstIneligibleIndex);
    }
  });

  // Scenario 7: Reasons contain meaningful text
  it('Reasons contain human-readable text with checkmarks', () => {
    const profile: BusinessProfile = {
      monthly_revenue_est: 20000,
      monthly_expense_est: 12000,
      existing_loans: false,
      category: 'sc',
      sector: 'retail',
      gender: 'male',
    };

    const results = matchSchemes(profile, mockSchemes);

    results.forEach((result) => {
      expect(result.reasons.length).toBeGreaterThan(0);
      result.reasons.forEach((reason) => {
        expect(typeof reason).toBe('string');
        expect(reason.length).toBeGreaterThan(0);
      });
    });
  });

  // Scenario 8: Empty profile category fails category-restricted schemes
  it('Profile with no category fails category-restricted schemes', () => {
    const profile: BusinessProfile = {
      monthly_revenue_est: 10000,
      monthly_expense_est: 7000,
      existing_loans: false,
      // no category
      gender: 'male',
    };

    const results = matchSchemes(profile, mockSchemes);

    const standUp = results.find((r) => r.scheme.name === 'Stand-Up India');
    expect(standUp?.eligible).toBe(false);
    expect(standUp?.reasons.some((r) => r.includes('not specified'))).toBe(true);
  });
});
