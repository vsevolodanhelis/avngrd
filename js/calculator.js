/**
 * Ukrainian Bank Deposit Calculator
 * Compliant with NBU Regulation 223
 * 
 * This calculator implements all required calculations as per Ukrainian banking regulations:
 * 1. Total fees for additional services (in UAH)
 * 2. Interest rate without tax considerations (annual %)
 * 3. Gross income before taxation
 * 4. Tax calculations (Personal Income Tax + Military Tax in UAH)
 * 5. Net income after taxation
 * 6. Effective interest rate after tax considerations (annual %)
 */

class UkrainianDepositCalculator {
    constructor() {
        this.currencyRates = {
            UAH: 1,
            USD: 37.5, // Approximate rate - in real implementation, fetch from API
            EUR: 40.8, // Approximate rate - in real implementation, fetch from API
        };
        
        this.taxRates = {
            personalIncomeTax: 18, // Default 18%
            militaryTax: 1.5       // Default 1.5%
        };
    }

    /**
     * Main calculation method implementing NBU Regulation 223
     * @param {Object} params - Calculation parameters
     * @returns {Object} - Calculation results
     */
    calculate(params) {
        const {
            depositAmount,
            currency,
            termMonths,
            interestRate,
            additionalFees,
            personalTaxRate,
            militaryTaxRate
        } = this.validateAndNormalizeParams(params);

        // Update tax rates if provided
        this.taxRates.personalIncomeTax = personalTaxRate;
        this.taxRates.militaryTax = militaryTaxRate;

        // 1. Total fees for additional services (always in UAH)
        const totalFeesUAH = this.calculateTotalFees(additionalFees);

        // 2. Interest rate without tax considerations
        const grossInterestRate = interestRate;

        // 3. Gross income before taxation
        const grossIncome = this.calculateGrossIncome(depositAmount, interestRate, termMonths);

        // 4. Tax calculations (in UAH)
        const taxCalculations = this.calculateTaxes(grossIncome, currency);

        // 5. Net income after taxation
        const netIncome = this.calculateNetIncome(grossIncome, taxCalculations, currency);

        // 6. Effective interest rate after tax considerations
        const effectiveInterestRate = this.calculateEffectiveRate(
            depositAmount, netIncome, termMonths, totalFeesUAH, currency
        );

        return {
            // Input summary
            input: {
                depositAmount,
                currency,
                termMonths,
                interestRate,
                additionalFees
            },
            
            // NBU Regulation 223 required results
            results: {
                // 1. Total fees for additional services (UAH)
                totalFeesUAH,
                
                // 2. Interest rate without tax considerations (annual %)
                grossInterestRate,
                
                // 3. Gross income before taxation (in deposit currency)
                grossIncome: {
                    amount: grossIncome,
                    currency: currency,
                    amountUAH: this.convertToUAH(grossIncome, currency)
                },
                
                // 4. Tax calculations (UAH)
                taxation: {
                    personalIncomeTaxUAH: taxCalculations.personalIncomeTaxUAH,
                    militaryTaxUAH: taxCalculations.militaryTaxUAH,
                    totalTaxUAH: taxCalculations.totalTaxUAH
                },
                
                // 5. Net income after taxation (in deposit currency)
                netIncome: {
                    amount: netIncome,
                    currency: currency,
                    amountUAH: this.convertToUAH(netIncome, currency)
                },
                
                // 6. Effective interest rate after tax considerations (annual %)
                effectiveInterestRate
            }
        };
    }

    /**
     * Validate and normalize input parameters
     */
    validateAndNormalizeParams(params) {
        const {
            depositAmount,
            currency = 'UAH',
            depositTerm,
            termUnit = 'months',
            interestRate,
            additionalFees = 0,
            personalTaxRate = 18,
            militaryTaxRate = 1.5
        } = params;

        // Validate required parameters
        if (!depositAmount || depositAmount <= 0) {
            throw new Error('Сума вкладу повинна бути більше 0');
        }
        if (!interestRate || interestRate <= 0) {
            throw new Error('Процентна ставка повинна бути більше 0');
        }
        if (!depositTerm || depositTerm <= 0) {
            throw new Error('Термін вкладу повинен бути більше 0');
        }

        // Convert term to months
        const termMonths = termUnit === 'years' ? depositTerm * 12 : depositTerm;

        return {
            depositAmount: parseFloat(depositAmount),
            currency,
            termMonths,
            interestRate: parseFloat(interestRate),
            additionalFees: parseFloat(additionalFees),
            personalTaxRate: parseFloat(personalTaxRate),
            militaryTaxRate: parseFloat(militaryTaxRate)
        };
    }

    /**
     * Calculate total fees for additional services (always in UAH)
     */
    calculateTotalFees(additionalFees) {
        return additionalFees;
    }

    /**
     * Calculate gross income before taxation
     * Uses compound interest formula: A = P(1 + r/n)^(nt)
     * For simplicity, assuming annual compounding (n=1)
     */
    calculateGrossIncome(principal, annualRate, termMonths) {
        const years = termMonths / 12;
        const rate = annualRate / 100;
        
        // Compound interest calculation
        const finalAmount = principal * Math.pow(1 + rate, years);
        const interest = finalAmount - principal;
        
        return interest;
    }

    /**
     * Calculate taxes on deposit income (always in UAH)
     * Ukrainian tax law: taxes calculated on UAH equivalent of income
     */
    calculateTaxes(grossIncome, currency) {
        const grossIncomeUAH = this.convertToUAH(grossIncome, currency);
        
        // Personal Income Tax (ПДФО)
        const personalIncomeTaxUAH = (grossIncomeUAH * this.taxRates.personalIncomeTax) / 100;
        
        // Military Tax (Військовий збір)
        const militaryTaxUAH = (grossIncomeUAH * this.taxRates.militaryTax) / 100;
        
        const totalTaxUAH = personalIncomeTaxUAH + militaryTaxUAH;

        return {
            personalIncomeTaxUAH,
            militaryTaxUAH,
            totalTaxUAH
        };
    }

    /**
     * Calculate net income after taxation
     */
    calculateNetIncome(grossIncome, taxCalculations, currency) {
        const grossIncomeUAH = this.convertToUAH(grossIncome, currency);
        const netIncomeUAH = grossIncomeUAH - taxCalculations.totalTaxUAH;
        
        // Convert back to original currency
        return this.convertFromUAH(netIncomeUAH, currency);
    }

    /**
     * Calculate effective interest rate after tax considerations
     * This is the actual yield considering taxes and fees
     */
    calculateEffectiveRate(principal, netIncome, termMonths, feesUAH, currency) {
        const years = termMonths / 12;
        const principalUAH = this.convertToUAH(principal, currency);
        const netIncomeUAH = this.convertToUAH(netIncome, currency);
        
        // Adjust for fees
        const adjustedNetIncome = netIncomeUAH - feesUAH;
        
        // Calculate effective annual rate
        // Formula: ((Final Amount / Initial Amount)^(1/years)) - 1
        const finalAmountUAH = principalUAH + adjustedNetIncome;
        const effectiveRate = (Math.pow(finalAmountUAH / principalUAH, 1 / years) - 1) * 100;
        
        return Math.max(0, effectiveRate); // Ensure non-negative
    }

    /**
     * Convert amount to UAH
     */
    convertToUAH(amount, fromCurrency) {
        if (fromCurrency === 'UAH') return amount;
        return amount * this.currencyRates[fromCurrency];
    }

    /**
     * Convert amount from UAH to target currency
     */
    convertFromUAH(amountUAH, toCurrency) {
        if (toCurrency === 'UAH') return amountUAH;
        return amountUAH / this.currencyRates[toCurrency];
    }

    /**
     * Format currency amount for display
     */
    formatCurrency(amount, currency) {
        const formatter = new Intl.NumberFormat('uk-UA', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        const formattedAmount = formatter.format(Math.abs(amount));
        
        const currencySymbols = {
            UAH: '₴',
            USD: '$',
            EUR: '€',
        };

        return `${formattedAmount} ${currencySymbols[currency] || currency}`;
    }

    /**
     * Format percentage for display
     */
    formatPercentage(rate) {
        return `${rate.toFixed(2)}%`;
    }

    /**
     * Update currency exchange rates (for real implementation)
     * In production, this would fetch from a reliable API
     */
    updateCurrencyRates(rates) {
        this.currencyRates = { ...this.currencyRates, ...rates };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UkrainianDepositCalculator;
} else {
    window.UkrainianDepositCalculator = UkrainianDepositCalculator;
}
