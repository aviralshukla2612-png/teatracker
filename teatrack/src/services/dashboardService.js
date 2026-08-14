import api from './api';

const dashboardService = {
  /**
   * Get dashboard data for a given month and year.
   * Defaults to the current month/year.
   */
  async get(month = null, year = null) {
    const now = new Date();
    const params = {
      month: month ?? now.getMonth() + 1,
      year:  year  ?? now.getFullYear(),
    };
    const { data } = await api.get('/dashboard', { params });
    return data;
  },
};

export default dashboardService;
