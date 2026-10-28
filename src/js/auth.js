/**
 * SynxEx Web Application — Authentication & SSO Service
 *
 * Implements OpenID Connect Authorization Code Flow with PKCE using @auth0/auth0-spa-js.
 * Provides unified session management, silent SSO token refresh, protected route guards,
 * and seamless cross-application state with the SynxEx marketing website.
 */

import { createAuth0Client } from '@auth0/auth0-spa-js';

// Configuration loaded from Vite environment variables or defaults
const AUTH_CONFIG = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN || '',
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || '',
  redirectUri: window.location.origin + '/pages/callback.html',
  logoutRedirectUri: import.meta.env.VITE_MARKETING_URL || 'https://synxex-marketing.vercel.app',
};

class AuthService {
  constructor() {
    this.client = null;
    this.user = null;
    this.isAuthenticated = false;
    this.initialized = false;
    this.initPromise = null;
  }

  /**
   * Initializes the Auth0 client and checks for an active SSO session.
   * If Auth0 is not configured with real credentials yet, it operates gracefully in demo mode.
   */
  async init() {
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      // If domain or clientId is missing or placeholder, initialize demo fallback
      if (!AUTH_CONFIG.domain || !AUTH_CONFIG.clientId || AUTH_CONFIG.domain.includes('your-tenant')) {
        console.warn('[SynxEx SSO] Auth0 credentials not yet configured. Operating with demo authentication.');
        const cachedUser = localStorage.getItem('synxex_demo_user');
        if (cachedUser) {
          try {
            this.user = JSON.parse(cachedUser);
            this.isAuthenticated = true;
          } catch {
            this.isAuthenticated = false;
          }
        }
        this.initialized = true;
        return;
      }

      try {
        this.client = await createAuth0Client({
          domain: AUTH_CONFIG.domain,
          clientId: AUTH_CONFIG.clientId,
          authorizationParams: {
            redirect_uri: AUTH_CONFIG.redirectUri,
            scope: 'openid profile email',
          },
          cacheLocation: 'memory',
          useRefreshTokens: true,
        });

        // Check if returning from redirect
        const search = window.location.search;
        if (search.includes('code=') && search.includes('state=')) {
          const result = await this.client.handleRedirectCallback();
          const targetUrl = result.appState?.targetUrl || '/';
          window.history.replaceState({}, document.title, targetUrl);
        }

        this.isAuthenticated = await this.client.isAuthenticated();
        if (this.isAuthenticated) {
          this.user = await this.client.getUser();
        } else {
          // Attempt silent SSO session check with IdP tenant
          try {
            await this.client.checkSession();
            this.isAuthenticated = await this.client.isAuthenticated();
            if (this.isAuthenticated) {
              this.user = await this.client.getUser();
            }
          } catch {
            // No active IdP session; user remains guest
          }
        }
      } catch (err) {
        console.error('[SynxEx SSO] Auth0 initialization error:', err);
      } finally {
        this.initialized = true;
      }
    })();

    return this.initPromise;
  }

  /**
   * Triggers login via Universal Login or Demo
   */
  async login(options = {}) {
    await this.init();
    if (this.client) {
      await this.client.loginWithRedirect({
        authorizationParams: {
          screen_hint: options.screen_hint || 'login',
        },
        appState: {
          targetUrl: options.returnTo || window.location.pathname,
        },
      });
    } else {
      // Demo authentication simulation
      const demoUser = {
        name: options.email ? options.email.split('@')[0] : 'Afnan',
        email: options.email || 'afnan@synxex.com',
        picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop',
      };
      localStorage.setItem('synxex_demo_user', JSON.stringify(demoUser));
      this.user = demoUser;
      this.isAuthenticated = true;
      window.location.href = options.returnTo || '/';
    }
  }

  /**
   * Triggers registration / sign up
   */
  async register(options = {}) {
    return this.login({ ...options, screen_hint: 'signup' });
  }

  /**
   * Logs out the user across the identity provider and redirects to marketing or app
   */
  async logout(returnTo) {
    await this.init();
    const logoutTarget = returnTo || AUTH_CONFIG.logoutRedirectUri;
    localStorage.removeItem('synxex_demo_user');
    this.user = null;
    this.isAuthenticated = false;

    if (this.client) {
      await this.client.logout({
        logoutParams: {
          returnTo: logoutTarget,
        },
      });
    } else {
      window.location.href = logoutTarget;
    }
  }

  /**
   * Enforces protected route access
   */
  async requireAuth(returnTo) {
    await this.init();
    if (!this.isAuthenticated) {
      window.location.href = `/pages/login.html?returnTo=${encodeURIComponent(returnTo || window.location.href)}`;
      return false;
    }
    return true;
  }

  getUser() {
    return this.user;
  }
}

export const authService = new AuthService();

