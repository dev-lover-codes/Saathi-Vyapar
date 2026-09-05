/**
 * financialEngine.ts
 * Pure TypeScript financial calculation engine.
 * No external dependencies — all logic is deterministic and testable.
 */

/**
 * Calculate the break-even point in units.
 * Break-even = Fixed Costs / (Price Per Unit - Variable Cost Per Unit)
 *
 * @param fixedCosts - Total fixed costs per period (₹)
 * @param pricePerUnit - Selling price per unit (₹)
 * @param variableCostPerUnit - Variable cost per unit (₹)
 * @returns Number of units needed to break even, or Infinity if contribution margin is 0 or negative
 */
export function calculateBreakEven(
  fixedCosts: number,
  pricePerUnit: number,
  variableCostPerUnit: number
): number {
  const contributionMargin = pricePerUnit - variableCostPerUnit;

  // Guard: division by zero or negative contribution margin
  if (contributionMargin <= 0) {
    return Infinity;
  }

  return fixedCosts / contributionMargin;
}

/**
 * Calculate the profit margin percentage.
 * Margin % = (Revenue - Expenses) / Revenue * 100
 *
 * @param revenue - Total revenue (₹)
 * @param expenses - Total expenses (₹)
 * @returns Margin as a percentage (can be negative for a loss). Returns 0 if revenue is 0.
 */
export function calculateMarginPercent(revenue: number, expenses: number): number {
  // Guard: division by zero
  if (revenue === 0) {
    return 0;
  }

  return ((revenue - expenses) / revenue) * 100;
}

/**
 * Assess the cash flow risk level for a business.
 *
 * Risk levels:
 * - 'high':   expenses/revenue >= 0.9, OR existing loans with expenses/revenue >= 0.7, OR revenue = 0
 * - 'medium': expenses/revenue >= 0.7, OR existing loans present
 * - 'low':    all other cases
 *
 * @param monthlyRevenue - Monthly revenue (₹)
 * @param monthlyExpenses - Monthly expenses (₹)
 * @param existingLoans - Whether the business has outstanding loans
 * @returns Risk classification: 'low' | 'medium' | 'high'
 */
export function assessCashFlowRisk(
  monthlyRevenue: number,
  monthlyExpenses: number,
  existingLoans: boolean
): 'low' | 'medium' | 'high' {
  // No revenue → highest risk
  if (monthlyRevenue === 0) {
    return 'high';
  }

  const ratio = monthlyExpenses / monthlyRevenue;

  // High risk conditions
  if (ratio >= 0.9 || (existingLoans && ratio >= 0.7)) {
    return 'high';
  }

  // Medium risk conditions
  if (ratio >= 0.7 || existingLoans) {
    return 'medium';
  }

  return 'low';
}

/** Input profile for financial summary generation */
export interface FinancialSummaryInput {
  monthlyRevenueEst: number;
  monthlyExpenseEst: number;
  existingLoans: boolean;
}

/** Output from financial summary generation */
export interface FinancialSummaryOutput {
  breakEvenUnits: number;
  marginPercent: number;
  cashFlowRisk: 'low' | 'medium' | 'high';
  explanation: string;
}

/**
 * Generate a complete financial summary for a business profile.
 * Uses deterministic calculations — no LLM involved.
 * The explanation is a template-based string in English; it will be
 * translated/rephrased by the LLM in the API layer.
 *
 * Note: Break-even units are computed assuming fixed costs = monthly expenses
 * and a per-unit model is not available at onboarding. We use a simplified
 * approximation: breakEven is reported as a revenue target (₹) by treating
 * pricePerUnit=revenue and variableCostPerUnit=0 when units are unknown.
 * The actual unit-based break-even requires price and variable cost data.
 *
 * @param profile - Business financial profile
 * @returns Financial summary with metrics and human-readable explanation
 */
export function generateFinancialSummary(
  profile: FinancialSummaryInput
): FinancialSummaryOutput {
  const { monthlyRevenueEst, monthlyExpenseEst, existingLoans } = profile;

  // For break-even: treat fixedCosts = monthly expenses, price = revenue/unit proxy
  // Since we don't have per-unit data, calculate break-even as minimum revenue needed
  // to cover fixed costs (monthlyExpenseEst) with 0 variable cost — gives the revenue target
  const breakEvenUnits = calculateBreakEven(
    monthlyExpenseEst, // fixed costs = monthly expenses
    monthlyRevenueEst, // price proxy (revenue)
    0 // no variable cost info at this stage
  );

  const marginPercent = calculateMarginPercent(monthlyRevenueEst, monthlyExpenseEst);
  const cashFlowRisk = assessCashFlowRisk(monthlyRevenueEst, monthlyExpenseEst, existingLoans);

  // Build a template explanation (no LLM — pure string template)
  const riskDescriptions: Record<string, string> = {
    low: 'Your cash flow looks healthy. You have a comfortable buffer between income and expenses.',
    medium:
      'Your cash flow has moderate risk. Consider reducing discretionary expenses or increasing revenue streams.',
    high: 'Your cash flow is under significant pressure. Immediate attention to expense reduction or revenue growth is recommended.',
  };

  const loanNote = existingLoans
    ? ' Note: Your existing loan obligations increase your financial risk — factor in EMI payments carefully.'
    : '';

  const marginNote =
    marginPercent >= 0
      ? `Your current profit margin is ${marginPercent.toFixed(1)}%.`
      : `You are currently operating at a loss of ${Math.abs(marginPercent).toFixed(1)}%.`;

  const breakEvenNote =
    breakEvenUnits === Infinity
      ? 'Break-even cannot be calculated with current data (revenue may be zero or below costs).'
      : `You need to maintain at least ₹${monthlyExpenseEst.toFixed(0)} in monthly revenue to cover your costs.`;

  const explanation =
    `${riskDescriptions[cashFlowRisk]}${loanNote} ` +
    `${marginNote} ${breakEvenNote} ` +
    `Monthly Revenue: ₹${monthlyRevenueEst.toFixed(0)}, Monthly Expenses: ₹${monthlyExpenseEst.toFixed(0)}.`;

  return {
    breakEvenUnits: isFinite(breakEvenUnits) ? parseFloat(breakEvenUnits.toFixed(2)) : Infinity,
    marginPercent: parseFloat(marginPercent.toFixed(2)),
    cashFlowRisk,
    explanation,
  };
}
