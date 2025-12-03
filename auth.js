// ====================================
// USER AUTHENTICATION & ACCOUNT MANAGEMENT
// Complete auth system with session management
// ====================================

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.sessionToken = null;
        this.init();
    }

    init() {
        // Check for existing session
        this.loadSession();
        this.setupAuthUI();
        this.setupEventListeners();
    }

    loadSession() {
        const savedSession = localStorage.getItem('ecf_session');
        if (savedSession) {
            try {
                const session = JSON.parse(savedSession);
                if (this.isSessionValid(session)) {
                    this.currentUser = session.user;
                    this.sessionToken = session.token;
                    this.updateUIForLoggedInUser();
                } else {
                    this.clearSession();
                }
            } catch (e) {
                this.clearSession();
            }
        }
    }

    isSessionValid(session) {
        if (!session.expiresAt) return false;
        return new Date(session.expiresAt) > new Date();
    }

    saveSession(user, token) {
        const session = {
            user,
            token,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        };
        localStorage.setItem('ecf_session', JSON.stringify(session));
    }

    clearSession() {
        localStorage.removeItem('ecf_session');
        this.currentUser = null;
        this.sessionToken = null;
    }

    setupAuthUI() {
        // Add auth modal to page
        const authModal = document.createElement('div');
        authModal.id = 'authModal';
        authModal.className = 'auth-modal';
        authModal.innerHTML = `
      <div class="auth-modal-overlay" id="authModalOverlay"></div>
      <div class="auth-modal-content">
        <button class="auth-modal-close" id="authModalClose">&times;</button>
        
        <div id="loginForm" class="auth-form active">
          <h2>Sign In</h2>
          <p class="auth-subtitle">Access your shipments and account</p>
          
          <form id="loginFormElement">
            <div class="form-group">
              <label for="loginEmail" class="form-label">Email</label>
              <input type="email" id="loginEmail" class="form-input" placeholder="your@email.com" required>
            </div>
            
            <div class="form-group">
              <label for="loginPassword" class="form-label">Password</label>
              <input type="password" id="loginPassword" class="form-input" placeholder="••••••••" required>
            </div>
            
            <div class="auth-options">
              <label class="checkbox-label">
                <input type="checkbox" id="rememberMe">
                <span>Remember me</span>
              </label>
              <a href="#" class="auth-link">Forgot password?</a>
            </div>
            
            <button type="submit" class="btn btn-ghost" style="width: 100%; margin-top: var(--space-md);">
              Sign In
            </button>
          </form>
          
          <p class="auth-footer">
            Don't have an account? 
            <a href="#" id="showSignup" class="auth-link">Sign up</a>
          </p>
          
          <div class="auth-demo">
            <p><strong>Demo Account:</strong></p>
            <p>Email: demo@emeraldcity.com</p>
            <p>Password: demo123</p>
          </div>
        </div>
        
        <div id="signupForm" class="auth-form">
          <h2>Create Account</h2>
          <p class="auth-subtitle">Start shipping with us today</p>
          
          <form id="signupFormElement">
            <div class="form-group">
              <label for="signupName" class="form-label">Full Name</label>
              <input type="text" id="signupName" class="form-input" placeholder="John Doe" required>
            </div>
            
            <div class="form-group">
              <label for="signupCompany" class="form-label">Company Name</label>
              <input type="text" id="signupCompany" class="form-input" placeholder="Your Company Inc">
            </div>
            
            <div class="form-group">
              <label for="signupEmail" class="form-label">Email</label>
              <input type="email" id="signupEmail" class="form-input" placeholder="your@email.com" required>
            </div>
            
            <div class="form-group">
              <label for="signupPassword" class="form-label">Password</label>
              <input type="password" id="signupPassword" class="form-input" placeholder="••••••••" required>
            </div>
            
            <label class="checkbox-label" style="margin-top: var(--space-md);">
              <input type="checkbox" id="agreeTerms" required>
              <span>I agree to the Terms of Service and Privacy Policy</span>
            </label>
            
            <button type="submit" class="btn btn-ghost" style="width: 100%; margin-top: var(--space-md);">
              Create Account
            </button>
          </form>
          
          <p class="auth-footer">
            Already have an account? 
            <a href="#" id="showLogin" class="auth-link">Sign in</a>
          </p>
        </div>
      </div>
    `;
        document.body.appendChild(authModal);

        // Add user menu to navigation
        const nav = document.querySelector('nav');
        if (nav) {
            const userMenu = document.createElement('div');
            userMenu.id = 'userMenu';
            userMenu.className = 'user-menu';
            userMenu.innerHTML = `
        <button class="btn btn-ghost" id="loginBtn">Sign In</button>
        <div class="user-profile" id="userProfile" style="display: none;">
          <button class="user-avatar" id="userAvatar">
            <span id="userInitials">U</span>
          </button>
          <div class="user-dropdown" id="userDropdown">
            <div class="user-info">
              <div class="user-name" id="userName">User Name</div>
              <div class="user-email" id="userEmail">user@email.com</div>
            </div>
            <div class="user-menu-divider"></div>
            <a href="#" class="user-menu-item" id="myShipments">
              <span>📦</span> My Shipments
            </a>
            <a href="#" class="user-menu-item" id="myQuotes">
              <span>💰</span> My Quotes
            </a>
            <a href="#" class="user-menu-item" id="accountSettings">
              <span>⚙️</span> Settings
            </a>
            <div class="user-menu-divider"></div>
            <a href="#" class="user-menu-item" id="logoutBtn">
              <span>🚪</span> Sign Out
            </a>
          </div>
        </div>
      `;
            nav.appendChild(userMenu);
        }
    }

    setupEventListeners() {
        // Login button
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.showAuthModal('login'));
        }

        // Modal close
        const closeBtn = document.getElementById('authModalClose');
        const overlay = document.getElementById('authModalOverlay');
        if (closeBtn) closeBtn.addEventListener('click', () => this.hideAuthModal());
        if (overlay) overlay.addEventListener('click', () => this.hideAuthModal());

        // Form toggles
        const showSignup = document.getElementById('showSignup');
        const showLogin = document.getElementById('showLogin');
        if (showSignup) showSignup.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchForm('signup');
        });
        if (showLogin) showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchForm('login');
        });

        // Login form
        const loginForm = document.getElementById('loginFormElement');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Signup form
        const signupForm = document.getElementById('signupFormElement');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }

        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }

        // User avatar dropdown
        const userAvatar = document.getElementById('userAvatar');
        if (userAvatar) {
            userAvatar.addEventListener('click', () => {
                const dropdown = document.getElementById('userDropdown');
                if (dropdown) {
                    dropdown.classList.toggle('active');
                }
            });
        }

        // My Shipments
        const myShipments = document.getElementById('myShipments');
        if (myShipments) {
            myShipments.addEventListener('click', (e) => {
                e.preventDefault();
                this.showUserShipments();
            });
        }
    }

    showAuthModal(form = 'login') {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.add('active');
            this.switchForm(form);
        }
    }

    hideAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    switchForm(formType) {
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');

        if (formType === 'login') {
            loginForm?.classList.add('active');
            signupForm?.classList.remove('active');
        } else {
            signupForm?.classList.add('active');
            loginForm?.classList.remove('active');
        }
    }

    async handleLogin(e) {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Signing in...';

        try {
            const result = await freightAPI.authenticateUser(email, password);

            if (result.success) {
                this.currentUser = result.user;
                this.sessionToken = result.token;

                if (rememberMe) {
                    this.saveSession(result.user, result.token);
                }

                this.updateUIForLoggedInUser();
                this.hideAuthModal();
                showNotification(`Welcome back, ${result.user.name}!`, 'success');
            }
        } catch (error) {
            showNotification(error.message || 'Login failed', 'error');
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.textContent = 'Sign In';
        }
    }

    async handleSignup(e) {
        e.preventDefault();

        const name = document.getElementById('signupName').value;
        const company = document.getElementById('signupCompany').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;

        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Creating account...';

        try {
            // Simulate account creation
            await new Promise(resolve => setTimeout(resolve, 1500));

            const newUser = {
                id: 'user_' + Date.now(),
                name,
                company,
                email,
                shipments: [],
                savedAddresses: []
            };

            this.currentUser = newUser;
            this.sessionToken = 'jwt_token_' + Date.now();
            this.saveSession(newUser, this.sessionToken);

            this.updateUIForLoggedInUser();
            this.hideAuthModal();
            showNotification(`Account created successfully! Welcome, ${name}!`, 'success');
        } catch (error) {
            showNotification('Failed to create account', 'error');
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.textContent = 'Create Account';
        }
    }

    handleLogout() {
        this.clearSession();
        this.updateUIForLoggedOutUser();
        showNotification('Signed out successfully', 'success');

        // Close dropdown
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) dropdown.classList.remove('active');
    }

    updateUIForLoggedInUser() {
        const loginBtn = document.getElementById('loginBtn');
        const userProfile = document.getElementById('userProfile');
        const userName = document.getElementById('userName');
        const userEmail = document.getElementById('userEmail');
        const userInitials = document.getElementById('userInitials');

        if (loginBtn) loginBtn.style.display = 'none';
        if (userProfile) userProfile.style.display = 'block';

        if (this.currentUser) {
            if (userName) userName.textContent = this.currentUser.name;
            if (userEmail) userEmail.textContent = this.currentUser.email;
            if (userInitials) {
                const initials = this.currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
                userInitials.textContent = initials;
            }
        }
    }

    updateUIForLoggedOutUser() {
        const loginBtn = document.getElementById('loginBtn');
        const userProfile = document.getElementById('userProfile');

        if (loginBtn) loginBtn.style.display = 'block';
        if (userProfile) userProfile.style.display = 'none';
    }

    async showUserShipments() {
        if (!this.currentUser) return;

        try {
            const shipments = await freightAPI.getUserShipments(this.currentUser.id);

            // Create shipments modal
            let shipmentsModal = document.getElementById('shipmentsModal');
            if (!shipmentsModal) {
                shipmentsModal = document.createElement('div');
                shipmentsModal.id = 'shipmentsModal';
                shipmentsModal.className = 'auth-modal';
                document.body.appendChild(shipmentsModal);
            }

            shipmentsModal.innerHTML = `
        <div class="auth-modal-overlay"></div>
        <div class="auth-modal-content" style="max-width: 900px;">
          <button class="auth-modal-close">&times;</button>
          <h2>My Shipments</h2>
          <div class="shipments-list">
            ${shipments.length > 0 ? shipments.map(s => `
              <div class="shipment-item card" style="margin-bottom: var(--space-md);">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                  <div>
                    <h3>${s.id}</h3>
                    <p><strong>Status:</strong> <span style="color: var(--primary);">${s.status}</span></p>
                    <p><strong>Route:</strong> ${s.origin} → ${s.destination}</p>
                    <p><strong>ETA:</strong> ${s.eta}</p>
                  </div>
                  <button class="btn btn-ghost" onclick="document.getElementById('trackingInput').value='${s.id}'; document.getElementById('trackingForm').dispatchEvent(new Event('submit')); document.getElementById('shipmentsModal').classList.remove('active');">
                    Track
                  </button>
                </div>
              </div>
            `).join('') : '<p>No shipments found</p>'}
          </div>
        </div>
      `;

            shipmentsModal.classList.add('active');

            // Close button
            shipmentsModal.querySelector('.auth-modal-close').addEventListener('click', () => {
                shipmentsModal.classList.remove('active');
            });

            shipmentsModal.querySelector('.auth-modal-overlay').addEventListener('click', () => {
                shipmentsModal.classList.remove('active');
            });

        } catch (error) {
            showNotification('Failed to load shipments', 'error');
        }
    }
}

// Initialize auth manager
const authManager = new AuthManager();
