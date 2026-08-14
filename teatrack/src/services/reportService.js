import api from './api';

const reportService = {
  /**
   * Get monthly summary report.
   * Defaults to the current month/year.
   */
  async getMonthly(month = null, year = null) {
    const now = new Date();
    const params = {
      month: month ?? now.getMonth() + 1,
      year:  year  ?? now.getFullYear(),
    };
    const { data } = await api.get('/reports/monthly', { params });
    return data;
  },
};

export default reportService;
