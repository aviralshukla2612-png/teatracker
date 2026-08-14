import api from './api';

const entryService = {
  /**
   * Get all entries, optionally filtered by month and year.
   */
  async getAll(month = null, year = null) {
    const params = {};
    if (month) params.month = month;
    if (year)  params.year  = year;
    const { data } = await api.get('/entries', { params });
    return data;
  },

  /**
   * Get a single entry by ID.
   */
  async getById(id) {
    const { data } = await api.get(`/entries/${id}`);
    return data;
  },

  /**
   * Create a new entry.
   * Backend calculates all expenses from current rates.
   */
  async create(date, teaQuantity, coffeeQuantity) {
    const { data } = await api.post('/entries', {
      date,
      tea_quantity:    teaQuantity,
      coffee_quantity: coffeeQuantity,
    });
    return data;
  },

  /**
   * Update an existing entry.
   * Backend recalculates using snapshot rates stored in the entry.
   */
  async update(id, teaQuantity, coffeeQuantity, date = null) {
    const payload = {
      tea_quantity:    teaQuantity,
      coffee_quantity: coffeeQuantity,
    };
    if (date) payload.date = date;
    const { data } = await api.put(`/entries/${id}`, payload);
    return data;
  },

  /**
   * Delete an entry by ID.
   */
  async delete(id) {
    const { data } = await api.delete(`/entries/${id}`);
    return data;
  },
};

export default entryService;
