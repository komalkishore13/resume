const Auth = {
  USERS_KEY: 'portfolio_users',
  SESSION_KEY: 'portfolio_session',

  getUsers() {
    return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
  },

  saveUsers(users) {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  },

  register(name, email, password) {
    const users = this.getUsers();
    if (users.find(u => u.email === email.toLowerCase())) {
      return { success: false, message: 'An account with this email already exists' };
    }

    const user = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      bio: '',
      role: 'Developer',
      createdAt: new Date().toISOString()
    };

    users.push(user);
    this.saveUsers(users);
    this.setSession(user);
    return { success: true, user };
  },

  login(email, password) {
    const users = this.getUsers();
    const user = users.find(u => u.email === email.toLowerCase().trim() && u.password === password);
    if (!user) {
      return { success: false, message: 'Invalid email or password' };
    }
    this.setSession(user);
    return { success: true, user };
  },

  setSession(user) {
    localStorage.setItem(this.SESSION_KEY, JSON.stringify({
      userId: user.id,
      email: user.email,
      loginAt: new Date().toISOString()
    }));
  },

  logout() {
    localStorage.removeItem(this.SESSION_KEY);
  },

  isAuthenticated() {
    return !!localStorage.getItem(this.SESSION_KEY);
  },

  getCurrentUser() {
    const session = JSON.parse(localStorage.getItem(this.SESSION_KEY) || 'null');
    if (!session) return null;
    const users = this.getUsers();
    return users.find(u => u.id === session.userId) || null;
  },

  updateUser(updates) {
    const session = JSON.parse(localStorage.getItem(this.SESSION_KEY) || 'null');
    if (!session) return false;
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === session.userId);
    if (idx === -1) return false;
    Object.assign(users[idx], updates);
    this.saveUsers(users);
    return true;
  },

  getPasswordStrength(password) {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    const labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
    return {
      score,
      label: labels[Math.max(0, Math.min(score - 1, labels.length - 1))] || 'Very Weak',
      percent: (score / 5) * 100
    };
  },

  requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  },

  redirectIfAuth(target) {
    if (this.isAuthenticated()) {
      window.location.href = target || 'dashboard.html';
      return true;
    }
    return false;
  }
};
