import { WS_BASE } from './api';

class WSService {
  constructor() {
    this.ws = null;
    this.token = null;
    this.listeners = new Set();
    this.reconnectAttempts = 0;
    this.reconnectTimer = null;
    this.isUnmounted = false;
  }

  setToken(token) {
    this.token = token;
  }

  connect() {
    if (!this.token || this.token === 'undefined') return;
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) return;

    const wsUrl = `${WS_BASE}?token=${this.token}`;
    console.log('Connecting to WebSocket...', WS_BASE);
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WS connected');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        this.listeners.forEach(callback => callback(msg));
      } catch (err) {
        console.error('WS Parse Error', err);
      }
    };

    this.ws.onerror = (err) => console.error('WebSocket Error', err);

    this.ws.onclose = () => {
      if (this.isUnmounted) return;
      console.log('WS disconnected, reconnecting...');
      const timeout = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      this.reconnectAttempts++;
      this.reconnectTimer = setTimeout(() => this.connect(), timeout);
    };
  }

  disconnect() {
    this.isUnmounted = true;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }
}

export const wsService = new WSService();
