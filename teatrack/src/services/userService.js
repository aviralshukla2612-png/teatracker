import api from './api';

const userService = {
  /**
   * Get all sub_admin users. Super Admin only.
   */
  async getAll() {
    const { data } = await api.get('/users');
    return data;
  },

  /**
   * Get a single user by ID. Super Admin only.
   */
  async getById(id) {
    const { data } = await api.get(`/users/${id}`);
    return data;
  },

  /**
   * Create a new sub_admin. Super Admin only.
   */
  async create(name, email, password) {
    const { data } = await api.post('/users', { name, email, password });
    return data;
  },

  /**
   * Update a user's name or email. Super Admin only.
   */
  async update(id, name, email) {
    const { data } = await api.put(`/users/${id}`, { name, email });
    return data;
  },

  /**
   * Toggle a user's active/inactive status. Super Admin only.
   */
  async toggleStatus(id) {
    const { data } = await api.patch(`/users/${id}/status`);
    return data;
  },

  /**
   * Delete a user. Super Admin only.
   * Server prevents deletion of the last super_admin.
   */
  async delete(id) {
    const { data } = await api.delete(`/users/${id}`);
    return data;
  },
};

export default userService;
