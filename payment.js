// ====================================
// PAYMENT INTEGRATION
// Stripe-style payment processing UI
// ====================================

class PaymentProcessor {
    constructor() {
        this.setupPaymentUI();
    }

    setupPaymentUI() {
        // Add payment modal
        const paymentModal = document.createElement('div');
        paymentModal.id = 'paymentModal';
        paymentModal.className = 'auth-modal';
        paymentModal.innerHTML = `
      <div class="auth-modal-overlay"></div>
      <div class="auth-modal-content" style="max-width: 600px;">
        <button class="auth-modal-close" id="paymentModalClose">&times;</button>
        
        <h2>💳 Payment</h2>
        <p class="auth-subtitle">Secure payment processing</p>
        
        <div id="paymentSummary" class="payment-summary"></div>
        
        <form id="paymentForm">
          <div class="form-group">
            <label for="cardName" class="form-label">Cardholder Name</label>
            <input type="text" id="cardName" class="form-input" placeholder="John Doe" required>
          </div>
          
          <div class="form-group">
            <label for="cardNumber" class="form-label">Card Number</label>
            <input type="text" id="cardNumber" class="form-input" placeholder="4242 4242 4242 4242" maxlength="19" required>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="cardExpiry" class="form-label">Expiry Date</label>
              <input type="text" id="cardExpiry" class="form-input" placeholder="MM/YY" maxlength="5" required>
            </div>
            <div class="form-group">
              <label for="cardCVV" class="form-label">CVV</label>
              <input type="text" id="cardCVV" class="form-input" placeholder="123" maxlength="4" required>
            </div>
          </div>
          
          <div class="form-group">
            <label for="billingZip" class="form-label">Billing ZIP Code</label>
            <input type="text" id="billingZip" class="form-input" placeholder="98101" required>
          </div>
          
          <div class="payment-security">
            <span>🔒</span>
            <span>Secure payment powered by Stripe</span>
          </div>
          
          <button type="submit" class="btn btn-ghost" style="width: 100%; margin-top: var(--space-md);">
            Pay Now
          </button>
        </form>
        
        <div class="payment-test-cards">
          <p><strong>Test Cards:</strong></p>
          <p>4242 4242 4242 4242 (Success)</p>
          <p>4000 0000 0000 0002 (Decline)</p>
        </div>
      </div>
    `;
        document.body.appendChild(paymentModal);

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Close button
        const closeBtn = document.getElementById('paymentModalClose');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hidePaymentModal());
        }

        // Card number formatting
        const cardNumber = document.getElementById('cardNumber');
        if (cardNumber) {
            cardNumber.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\s/g, '');
                let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
                e.target.value = formattedValue;
            });
        }

        // Expiry formatting
        const cardExpiry = document.getElementById('cardExpiry');
        if (cardExpiry) {
            cardExpiry.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                    value = value.slice(0, 2) + '/' + value.slice(2, 4);
                }
                e.target.value = value;
            });
        }

        // CVV - numbers only
        const cardCVV = document.getElementById('cardCVV');
        if (cardCVV) {
            cardCVV.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '');
            });
        }

        // Payment form submission
        const paymentForm = document.getElementById('paymentForm');
        if (paymentForm) {
            paymentForm.addEventListener('submit', (e) => this.handlePayment(e));
        }
    }

    showPaymentModal(amount, description) {
        const modal = document.getElementById('paymentModal');
        const summary = document.getElementById('paymentSummary');

        if (summary) {
            summary.innerHTML = `
        <div class="card" style="background: var(--gradient-primary); color: white; margin-bottom: var(--space-lg);">
          <h3 style="color: white;">Payment Summary</h3>
          <p style="color: var(--emerald-100);">${description}</p>
          <div class="quote-amount" style="font-size: 2.5rem; margin: var(--space-md) 0;">
            $${amount}
          </div>
        </div>
      `;
        }

        if (modal) {
            modal.classList.add('active');
        }
    }

    hidePaymentModal() {
        const modal = document.getElementById('paymentModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    async handlePayment(e) {
        e.preventDefault();

        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const cardName = document.getElementById('cardName').value;
        const cardExpiry = document.getElementById('cardExpiry').value;
        const cardCVV = document.getElementById('cardCVV').value;
        const billingZip = document.getElementById('billingZip').value;

        // Validate card
        if (!this.validateCard(cardNumber, cardExpiry, cardCVV)) {
            showNotification('Invalid card details', 'error');
            return;
        }

        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Processing...';

        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Check if test card for decline
            if (cardNumber === '4000000000000002') {
                throw new Error('Card declined');
            }

            // Success
            this.hidePaymentModal();
            showNotification('Payment successful! Confirmation email sent.', 'success');

            // Reset form
            e.target.reset();

            // Show success animation
            this.showSuccessAnimation();

        } catch (error) {
            showNotification(error.message || 'Payment failed', 'error');
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.textContent = 'Pay Now';
        }
    }

    validateCard(number, expiry, cvv) {
        // Basic Luhn algorithm for card validation
        if (!/^\d{13,19}$/.test(number)) return false;

        // Expiry validation
        if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
        const [month, year] = expiry.split('/').map(Number);
        if (month < 1 || month > 12) return false;

        // CVV validation
        if (!/^\d{3,4}$/.test(cvv)) return false;

        return true;
    }

    showSuccessAnimation() {
        const successDiv = document.createElement('div');
        successDiv.className = 'payment-success-animation';
        successDiv.innerHTML = `
      <div class="success-checkmark">
        <div class="check-icon">
          <span class="icon-line line-tip"></span>
          <span class="icon-line line-long"></span>
          <div class="icon-circle"></div>
          <div class="icon-fix"></div>
        </div>
      </div>
      <h2 style="color: var(--primary); margin-top: var(--space-lg);">Payment Successful!</h2>
    `;
        document.body.appendChild(successDiv);

        setTimeout(() => {
            successDiv.classList.add('active');
        }, 100);

        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }
}

// Initialize payment processor
const paymentProcessor = new PaymentProcessor();

// Add "Book & Pay" buttons to quote results
document.addEventListener('DOMContentLoaded', () => {
    // Modify quote result to include payment button
    const originalCalculateQuote = window.calculateQuote;
    if (originalCalculateQuote) {
        window.calculateQuote = function (...args) {
            originalCalculateQuote.apply(this, args);

            // Add payment button after quote is displayed
            setTimeout(() => {
                const quoteResult = document.getElementById('quoteResult');
                if (quoteResult && quoteResult.classList.contains('active')) {
                    const amount = document.getElementById('quoteAmount').textContent.replace('$', '');

                    let payBtn = document.getElementById('payQuoteBtn');
                    if (!payBtn) {
                        payBtn = document.createElement('button');
                        payBtn.id = 'payQuoteBtn';
                        payBtn.className = 'btn btn-primary';
                        payBtn.style.marginTop = 'var(--space-md)';
                        payBtn.textContent = 'Book & Pay Now';
                        payBtn.onclick = () => {
                            const service = document.getElementById('service').value;
                            const origin = document.getElementById('origin').value;
                            const destination = document.getElementById('destination').value;
                            paymentProcessor.showPaymentModal(
                                amount,
                                `${service.charAt(0).toUpperCase() + service.slice(1)} Freight: ${origin} → ${destination}`
                            );
                        };
                        quoteResult.appendChild(payBtn);
                    }
                }
            }, 200);
        };
    }
});
