import api from './api';

const authService = {
  /**
   * Login and store token + user in localStorage.
   */
  async login(email, password) {
    const { data } = await api.post('/login', { email, password });
    if (data.success) {
      localStorage.setItem('teatrack_token', data.token);
      localStorage.setItem('teatrack_user', JSON.stringify(data.user));
    }
    return data;
  },

  /**
   * Logout and clear local storage.
   */
  async logout() {
    try {
      await api.post('/logout');
    } finally {
      localStorage.removeItem('teatrack_token');
      localStorage.removeItem('teatrack_user');
    }
  },

  /**
   * Get the currently authenticated user from the API.
   */
  async me() {
    const { data } = await api.get('/me');
    return data.data;
  },

  /**
   * Get the locally stored user (from localStorage).
   */
  getStoredUser() {
    const user = localStorage.getItem('teatrack_user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Check if the user is logged in.
   */
  isLoggedIn() {
    return !!localStorage.getItem('teatrack_token');
  },

  /**
   * Check if the stored user is a super_admin.
   */
  isSuperAdmin() {
    const user = this.getStoredUser();
    return user?.role === 'super_admin';
  },
};

export default authService;
