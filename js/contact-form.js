// js/contact-form.js
class ContactForm extends HTMLElement {
  constructor() {
    super();
    this.accessKey = "badfa1ce-055d-43cc-bb1b-050a35206727";
    this.isSubmitting = false;
    this.render();
    this.attachEventListeners();
  }

  render() {
    this.innerHTML = `
      <div>
        <div>
          <div class="p-6">
            <h3 class="text-2xl mb-4" style="color: var(--neon-green)">INSERT COIN TO CONNECT</h3>
            
            <form id="contact-form" class="space-y-4">
              <div class="form-group">
                <label for="name" class="form-label">PLAYER NAME:</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required 
                  class="form-input"
                  data-testid="contact-name"
                >
              </div>
              
              <div class="form-group">
                <label for="email" class="form-label">EMAIL ADDRESS:</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  required 
                  class="form-input"
                  data-testid="contact-email"
                >
              </div>
              
              <div class="form-group">
                <label for="message" class="form-label">MESSAGE:</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows="4" 
                  required 
                  class="form-textarea"
                  data-testid="contact-message"
                ></textarea>
              </div>
              
              <div class="text-center">
                <button 
                  type="submit" 
                  class="submit-button"
                  data-testid="contact-submit"
                  ${this.isSubmitting ? 'disabled' : ''}
                >
                  ${this.isSubmitting ? 'SENDING...' : 'PRESS START'}
                </button>
              </div>
            </form>
            
            <div id="form-message" class="form-message hidden"></div>
          </div>
        </div>
      </div>

      <style>
        .contact-form-container {
          max-width: 600px;
          margin: 0 auto;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          color: var(--neon-green);
          font-family: var(--font-workbench);
          font-size: 14px;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .form-input, .form-textarea {
          width: 100%;
          padding: 12px 16px;
          background: var(--crt-background);
          border: 2px solid var(--neon-green);
          border-radius: 4px;
          color: var(--terminal-text);
          font-family: var(--font-workbench);
          font-size: 16px;
          transition: all 0.3s ease;
          box-shadow: 0 0 5px var(--neon-green), inset 0 0 5px var(--neon-green);
        }

        .form-input:focus, .form-textarea:focus {
          outline: none;
          box-shadow: 0 0 15px var(--neon-green), inset 0 0 10px var(--neon-green);
          transform: scale(1.02);
        }

        .form-textarea {
          resize: vertical;
          min-height: 120px;
        }

        .submit-button {
          background: var(--terminal-bg);
          border: 2px solid var(--neon-green);
          color: var(--neon-green);
          padding: 12px 32px;
          font-family: var(--font-workbench);
          font-size: 18px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 2px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 0 10px var(--neon-green), inset 0 0 5px var(--neon-green);
          animation: button-pulse 2s infinite;
        }

        .submit-button:hover:not(:disabled) {
          background: var(--neon-green);
          color: var(--terminal-bg);
          transform: scale(1.05);
          box-shadow: 0 0 20px var(--neon-green), inset 0 0 10px var(--neon-green);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          animation: none;
        }

        .form-message {
          margin-top: 1rem;
          padding: 12px;
          border-radius: 4px;
          font-family: var(--font-workbench);
          text-align: center;
          font-weight: bold;
        }

        .form-message.success {
          background: var(--neon-green);
          color: var(--terminal-bg);
          border: 2px solid var(--neon-green);
          box-shadow: 0 0 10px var(--neon-green);
        }

        .form-message.error {
          background: var(--neon-red);
          color: var(--terminal-bg);
          border: 2px solid var(--neon-red);
          box-shadow: 0 0 10px var(--neon-red);
        }

        .hidden {
          display: none;
        }

        @keyframes button-pulse {
          0%, 100% { 
            box-shadow: 0 0 10px var(--neon-green), inset 0 0 5px var(--neon-green);
          }
          50% { 
            box-shadow: 0 0 15px var(--neon-green), inset 0 0 8px var(--neon-green);
          }
        }

        /* CRT effect for form inputs */
        .form-input::before, .form-textarea::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 0, 0.1) 2px,
            rgba(0, 255, 0, 0.1) 4px
          );
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .form-input:focus::before, .form-textarea:focus::before {
          opacity: 1;
        }
      </style>
    `;
  }

  attachEventListeners() {
    const form = this.querySelector('#contact-form');
    const messageDiv = this.querySelector('#form-message');
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (this.isSubmitting) return;
      
      this.isSubmitting = true;
      this.updateSubmitButton();
      
      const formData = new FormData(form);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
        access_key: this.accessKey
      };
      
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
          this.showMessage('MESSAGE SENT! +100 POINTS', 'success');
          form.reset();
        } else {
          this.showMessage('GAME OVER! Try again.', 'error');
        }
      } catch (error) {
        console.error('Form submission error:', error);
        this.showMessage('CONNECTION FAILED! Check your internet.', 'error');
      } finally {
        this.isSubmitting = false;
        this.updateSubmitButton();
      }
    });
  }

  updateSubmitButton() {
    const button = this.querySelector('.submit-button');
    button.textContent = this.isSubmitting ? 'SENDING...' : 'PRESS START';
    button.disabled = this.isSubmitting;
  }

  showMessage(text, type) {
    const messageDiv = this.querySelector('#form-message');
    messageDiv.textContent = text;
    messageDiv.className = `form-message ${type}`;
    messageDiv.classList.remove('hidden');
    
    // Hide message after 5 seconds
    setTimeout(() => {
      messageDiv.classList.add('hidden');
    }, 5000);
  }
}

// Register the component
customElements.define("contact-form", ContactForm);
