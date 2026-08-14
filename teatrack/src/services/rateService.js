import api from './api';

const rateService = {
  /**
   * Get current tea and coffee rates.
   * Accessible by both super_admin and sub_admin.
   */
  async get() {
    const { data } = await api.get('/rates');
    return data;
  },

  /**
   * Update rates. Super Admin only.
   * Sub Admin will receive a 403 error from the server.
   */
  async update(teaRate, coffeeRate) {
    const { data } = await api.put('/rates', { teaRate, coffeeRate });
    return data;
  },
};

export default rateService;
