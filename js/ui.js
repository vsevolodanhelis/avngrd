/**
 * Modern UI Controller for Ukrainian Bank Deposit Calculator
 * Enhanced with Tailwind CSS, advanced animations, and premium UX
 */

class ModernDepositCalculatorUI {
    constructor() {
        this.calculator = new UkrainianDepositCalculator();
        this.form = document.getElementById('depositForm');
        this.resultsSection = document.getElementById('resultsSection');
        this.placeholderSection = document.getElementById('placeholderSection');
        this.calculateBtn = document.getElementById('calculateBtn');
        this.isCalculating = false;
        
        this.initializeEventListeners();
        this.initializeAnimations();
        this.setupFormValidation();
        this.updateCurrencyDisplay();
    }

    /**
     * Initialize all event listeners with modern interactions
     */
    initializeEventListeners() {
        // Form submission with enhanced UX
        this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Currency selection with smooth transitions
        const currencyInputs = document.querySelectorAll('input[name="currency"]');
        currencyInputs.forEach(input => {
            input.addEventListener('change', () => this.handleCurrencyChange(input.value));
        });
        
        // Refined validation - only show errors on submission attempts
        const formFields = this.form.querySelectorAll('.form-field');
        formFields.forEach(input => {
            // Handle focus events
            input.addEventListener('focus', () => {
                this.handleInputFocus(input);
            });

            // Handle blur events with subtle validation
            input.addEventListener('blur', () => {
                this.handleInputBlur(input);
                this.updateFieldState(input);
            });

            // Real-time validation and formatting for interacted fields
            input.addEventListener('input', () => {
                // Apply number formatting for specific fields with debouncing
                if (this.shouldFormatNumber(input)) {
                    // Clear any existing timeout
                    clearTimeout(input.formatTimeout);

                    // Debounce formatting to prevent interference with typing
                    input.formatTimeout = setTimeout(() => {
                        this.formatNumberInput(input);
                    }, 100); // Short delay to allow smooth typing
                }

                // No real-time validation - only on submission
            });
        });
        
        // Auto-calculation with debouncing
        this.setupAutoCalculation();
        
        // Keyboard navigation
        this.setupKeyboardNavigation();
    }

    /**
     * Handle currency change with smooth animations
     */
    handleCurrencyChange(currency) {
        const amountSuffix = document.getElementById('amountCurrency');
        const currencySymbols = {
            UAH: '₴',
            USD: '$',
            EUR: '€'
        };
        
        // Animate currency symbol change
        amountSuffix.style.transform = 'scale(0.8)';
        amountSuffix.style.opacity = '0.5';
        
        setTimeout(() => {
            amountSuffix.textContent = currencySymbols[currency];
            amountSuffix.style.transform = 'scale(1)';
            amountSuffix.style.opacity = '1';
        }, 150);
        
        // Update progress indicator
        this.updateProgressIndicator(1);
        
        // Auto-calculate if form is valid
        if (this.isFormValid()) {
            this.debounceCalculation();
        }
    }

    /**
     * Enhanced form submission with loading states
     */
    async handleFormSubmit(event) {
        event.preventDefault();
        
        if (this.isCalculating) return;
        
        try {
            this.setCalculatingState(true);
            
            // Collect and validate form data
            const formData = this.collectFormData();
            this.validateFormData();
            
            // Add slight delay for better UX
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Perform calculation
            const results = this.calculator.calculate(formData);
            
            // Display results with staggered animations
            await this.displayResults(results);
            
            // Update progress indicator
            this.updateProgressIndicator(2);
            
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.setCalculatingState(false);
        }
    }

    /**
     * Collect form data with modern approach
     */
    collectFormData() {
        const formData = new FormData(this.form);
        const selectedCurrency = document.querySelector('input[name="currency"]:checked').value;

        return {
            depositAmount: this.parseNumberInput(formData.get('depositAmount')),
            currency: selectedCurrency,
            depositTerm: formData.get('depositTerm'),
            termUnit: formData.get('termUnit'),
            interestRate: this.parsePercentageInput(formData.get('interestRate')),
            additionalFees: this.parseNumberInput(formData.get('additionalFees')) || 0,
            personalTaxRate: this.parsePercentageInput(formData.get('personalTax')),
            militaryTaxRate: this.parsePercentageInput(formData.get('militaryTax'))
        };
    }

    /**
     * Validate form data with visual feedback on submission
     */
    validateFormData() {
        let isValid = true;

        // Validate all form fields visually
        const requiredFields = ['depositAmount', 'interestRate', 'depositTerm'];
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!this.validateInputOnSubmission(field)) {
                isValid = false;
            }
        });

        // Validate optional fields if they have values
        const optionalFields = ['additionalFees', 'personalTax', 'militaryTax'];
        optionalFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && field.value) {
                if (!this.validateInputOnSubmission(field)) {
                    isValid = false;
                }
            }
        });

        if (!isValid) {
            throw new Error('Будь ласка, виправте помилки у формі');
        }
    }

    /**
     * Parse number input removing formatting (European format)
     */
    parseNumberInput(value) {
        if (!value) return '';

        const str = value.toString();

        // Handle European format: dots for thousands, comma for decimal
        // Examples: 10.000 -> 10000, 10.000,50 -> 10000.50, 1.000.000,25 -> 1000000.25

        // Find the last comma (decimal separator)
        const lastCommaIndex = str.lastIndexOf(',');

        if (lastCommaIndex > -1 && (str.length - lastCommaIndex) <= 3) {
            // Has decimal part (comma with 1-2 digits after)
            const integerPart = str.substring(0, lastCommaIndex).replace(/\./g, ''); // Remove all dots
            const decimalPart = str.substring(lastCommaIndex + 1);
            return `${integerPart}.${decimalPart}`;
        } else {
            // No decimal part, just remove all dots and commas
            return str.replace(/[.,]/g, '');
        }
    }

    /**
     * Parse percentage/decimal input (European format with comma as decimal separator)
     */
    parsePercentageInput(value) {
        if (!value) return '';

        const str = value.toString().trim();

        // For percentage fields, only replace comma with dot for decimal separator
        // Examples: 15 -> 15, 15,5 -> 15.5, 12,75 -> 12.75
        return str.replace(',', '.');
    }

    /**
     * Check if input should have number formatting
     */
    shouldFormatNumber(input) {
        const formatFields = ['depositAmount', 'additionalFees'];
        return formatFields.includes(input.id);
    }

    /**
     * Check if input is a percentage/decimal field
     */
    isPercentageField(input) {
        const percentageFields = ['interestRate', 'personalTax', 'militaryTax'];
        return percentageFields.includes(input.id);
    }

    /**
     * Format number input with thousand separators
     */
    formatNumberInput(input) {
        const cursorPosition = input.selectionStart;
        const originalValue = input.value;
        const cleanValue = this.parseNumberInput(originalValue); // Use proper European parsing

        // Only format if it's a valid number and not empty
        if (cleanValue && !isNaN(parseFloat(cleanValue)) && cleanValue !== '') {
            const formattedValue = this.addThousandSeparators(cleanValue);

            // Only update if the value actually changed
            if (formattedValue !== originalValue) {
                // Calculate cursor position adjustment
                const dotsBeforeCursor = (originalValue.substring(0, cursorPosition).match(/\./g) || []).length;
                const cleanCursorPos = cursorPosition - dotsBeforeCursor;

                // Set the formatted value
                input.value = formattedValue;

                // Calculate new cursor position based on clean position
                let newCursorPosition = cleanCursorPos;

                // Count dots before the cursor in the new formatted value
                let dotCount = 0;
                for (let i = 0; i < Math.min(cleanCursorPos + dotCount, formattedValue.length); i++) {
                    if (formattedValue[i] === '.') {
                        dotCount++;
                        newCursorPosition++;
                    }
                }

                // Ensure cursor position is within bounds
                newCursorPosition = Math.min(newCursorPosition, formattedValue.length);
                newCursorPosition = Math.max(newCursorPosition, 0);

                // Restore cursor position
                setTimeout(() => {
                    input.setSelectionRange(newCursorPosition, newCursorPosition);
                }, 0);
            }
        }
    }

    /**
     * Add thousand separators to number (European format with dots)
     */
    addThousandSeparators(value) {
        // Handle both dot and comma as potential decimal separators in input
        let parts;
        let decimalSeparator = ','; // European decimal separator

        if (value.includes(',')) {
            parts = value.split(',');
        } else if (value.includes('.') && value.lastIndexOf('.') > value.length - 4) {
            // If dot is likely a decimal separator (last dot with 1-3 digits after)
            parts = value.split('.');
            parts[0] = parts[0].replace(/\./g, ''); // Remove any other dots
        } else {
            parts = [value.replace(/[.,]/g, '')]; // Remove all separators, treat as integer
        }

        const integerPart = parts[0];
        const decimalPart = parts[1];

        // Add dots to integer part for thousands (European format)
        const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        // Combine with decimal part if exists (using comma as decimal separator)
        return decimalPart !== undefined ? `${formattedInteger},${decimalPart}` : formattedInteger;
    }

    /**
     * Display results with premium animations
     */
    async displayResults(calculationResults) {
        const { results } = calculationResults;
        
        // Hide placeholder and show results
        this.placeholderSection.classList.add('hidden');
        this.resultsSection.classList.remove('hidden');
        
        // Update result values with staggered animations
        const updates = [
            { id: 'totalFeesResult', value: this.calculator.formatCurrency(results.totalFeesUAH, 'UAH') },
            { id: 'grossRateResult', value: this.calculator.formatPercentage(results.grossInterestRate) },
            { id: 'grossIncomeResult', value: this.calculator.formatCurrency(results.grossIncome.amount, results.grossIncome.currency) },
            { id: 'taxAmountResult', value: this.calculator.formatCurrency(results.taxation.totalTaxUAH, 'UAH') },
            { id: 'netIncomeResult', value: this.calculator.formatCurrency(results.netIncome.amount, results.netIncome.currency) },
            { id: 'effectiveRateResult', value: this.calculator.formatPercentage(results.effectiveInterestRate) }
        ];
        
        // Animate each result with delay
        for (let i = 0; i < updates.length; i++) {
            setTimeout(() => {
                this.updateResultValue(updates[i].id, updates[i].value);
            }, i * 100);
        }
        
        // Scroll to results with smooth animation
        setTimeout(() => {
            this.resultsSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }, 300);
    }

    /**
     * Update result value with premium animation
     */
    updateResultValue(elementId, newValue) {
        const element = document.getElementById(elementId);
        
        // Scale and fade animation
        element.style.transform = 'scale(0.9)';
        element.style.opacity = '0.7';
        
        setTimeout(() => {
            element.textContent = newValue;
            element.style.transform = 'scale(1.05)';
            element.style.opacity = '1';
            
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 200);
        }, 100);
    }

    /**
     * Enhanced loading state management
     */
    setCalculatingState(isCalculating) {
        this.isCalculating = isCalculating;
        const btnText = document.getElementById('btnText');
        const btnLoader = document.getElementById('btnLoader');
        
        if (isCalculating) {
            this.calculateBtn.disabled = true;
            this.calculateBtn.classList.add('opacity-75', 'cursor-not-allowed');
            btnText.textContent = 'Розраховуємо...';
            btnLoader.classList.remove('hidden');
        } else {
            this.calculateBtn.disabled = false;
            this.calculateBtn.classList.remove('opacity-75', 'cursor-not-allowed');
            btnText.textContent = 'Розрахувати доходність';
            btnLoader.classList.add('hidden');
        }
    }

    /**
     * Update field state with subtle visual feedback
     */
    updateFieldState(input) {
        const rawValue = this.isPercentageField(input)
            ? this.parsePercentageInput(input.value)
            : this.parseNumberInput(input.value);

        // Remove all validation classes
        input.classList.remove('submission-error', 'has-valid-value');

        // Add subtle valid state if field has value
        if (rawValue && rawValue.trim() !== '') {
            input.classList.add('has-valid-value');
        }
    }

    /**
     * Validate input on form submission only
     */
    validateInputOnSubmission(input) {
        // Parse value using appropriate parser based on field type
        const rawValue = this.isPercentageField(input)
            ? this.parsePercentageInput(input.value)
            : this.parseNumberInput(input.value);
        const value = parseFloat(rawValue);
        const min = parseFloat(input.min);
        const max = parseFloat(input.max);

        // Clear any existing error states
        this.hideInputError(input);
        input.classList.remove('submission-error');

        // Validate based on field requirements
        if (input.hasAttribute('required') && !rawValue.trim()) {
            this.showSubmissionError(input, 'Це поле обов\'язкове для заповнення');
            return false;
        }

        if (rawValue && (isNaN(value) || value < min || (max && value > max))) {
            let errorMessage = 'Некоректне значення';
            if (value < min) {
                errorMessage = `Мінімальне значення: ${this.addThousandSeparators(min.toString())}`;
            } else if (max && value > max) {
                errorMessage = `Максимальне значення: ${this.addThousandSeparators(max.toString())}`;
            }
            this.showSubmissionError(input, errorMessage);
            return false;
        }

        return true;
    }

    /**
     * Handle input focus with animations
     */
    handleInputFocus(input) {
        input.parentElement.classList.add('transform', 'scale-105');

        // Remove formatting on focus for easier editing
        if (this.shouldFormatNumber(input)) {
            const unformattedValue = this.parseNumberInput(input.value);
            if (unformattedValue !== input.value) {
                input.value = unformattedValue;
            }
        }
    }

    /**
     * Handle input blur with animations
     */
    handleInputBlur(input) {
        input.parentElement.classList.remove('transform', 'scale-105');

        // Apply formatting on blur
        if (this.shouldFormatNumber(input)) {
            this.formatNumberInput(input);
        } else {
            this.formatInput(input);
        }
    }

    /**
     * Format input values (for non-number formatted fields)
     */
    formatInput(input) {
        const rawValue = this.isPercentageField(input)
            ? this.parsePercentageInput(input.value)
            : this.parseNumberInput(input.value);

        if (input.value && !isNaN(rawValue)) {
            const value = parseFloat(rawValue);
            if (input.step && input.step.includes('.')) {
                const decimals = input.step.split('.')[1].length;
                input.value = value.toFixed(decimals);
            }
        }
    }

    /**
     * Update progress indicator
     */
    updateProgressIndicator(step) {
        const steps = document.querySelectorAll('.progress-step');
        steps.forEach((stepEl, index) => {
            if (index < step) {
                stepEl.classList.add('completed');
            }
        });
    }

    /**
     * Setup auto-calculation with debouncing
     */
    setupAutoCalculation() {
        let timeout;
        const inputs = this.form.querySelectorAll('input, select');
        
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    if (this.isFormValid()) {
                        this.handleFormSubmit(new Event('submit'));
                    }
                }, 1500); // 1.5 second delay
            });
        });
    }

    /**
     * Check if form is valid for auto-calculation
     */
    isFormValid() {
        const requiredFields = ['depositAmount', 'interestRate', 'depositTerm'];
        return requiredFields.every(fieldId => {
            const field = document.getElementById(fieldId);
            const rawValue = this.isPercentageField(field)
                ? this.parsePercentageInput(field.value)
                : this.parseNumberInput(field.value);
            const hasValue = rawValue && rawValue.trim() !== '';
            const hasError = field.classList.contains('border-red-500');
            return hasValue && !hasError;
        });
    }

    /**
     * Setup keyboard navigation
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.handleFormSubmit(new Event('submit'));
            }
        });
    }

    /**
     * Initialize entrance animations
     */
    initializeAnimations() {
        // Animate cards on load
        const cards = document.querySelectorAll('.animate-slide-up');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    /**
     * Setup form validation
     */
    setupFormValidation() {
        // Add validation rules and visual feedback
        const inputs = this.form.querySelectorAll('input[required]');
        inputs.forEach(input => {
            input.addEventListener('invalid', (e) => {
                e.preventDefault();
                this.showInputError(input, 'Це поле обов\'язкове');
            });
        });
    }

    /**
     * Show submission error with modern styling
     */
    showSubmissionError(input, message) {
        // Remove existing error message
        this.hideInputError(input);

        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-sm text-red-600 mt-2 flex items-center animate-slide-up';
        errorDiv.innerHTML = `
            <svg class="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>${message}</span>
        `;

        // Insert after input's parent container
        const container = input.closest('.relative') || input.parentElement;
        container.appendChild(errorDiv);

        // Add error styling to input
        input.classList.add('submission-error');
    }

    /**
     * Show input error (legacy method for compatibility)
     */
    showInputError(input, message) {
        this.showSubmissionError(input, message);
    }

    /**
     * Hide input error
     */
    hideInputError(input) {
        // Remove error message
        const container = input.closest('.relative') || input.parentElement;
        const existingError = container.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Remove error styling
        input.classList.remove('border-red-500', 'bg-red-50', 'submission-error');
    }

    /**
     * Show error message with modern styling
     */
    showError(message) {
        // Create modern error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-xl shadow-lg z-50 animate-slide-up';
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    /**
     * Debounce calculation
     */
    debounceCalculation() {
        clearTimeout(this.calculationTimeout);
        this.calculationTimeout = setTimeout(() => {
            this.handleFormSubmit(new Event('submit'));
        }, 1000);
    }

    /**
     * Update currency display
     */
    updateCurrencyDisplay() {
        // Initial currency display setup
        const defaultCurrency = document.querySelector('input[name="currency"]:checked').value;
        this.handleCurrencyChange(defaultCurrency);
    }
}

// Initialize the modern UI when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ModernDepositCalculatorUI();
});
