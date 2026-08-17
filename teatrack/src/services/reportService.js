import entryService from './entryService';

const reportService = {
  async getMonthly(month = null, year = null) {
    const now = new Date();
    const targetMonth = month ? parseInt(month) : now.getMonth() + 1;
    const targetYear = year ? parseInt(year) : now.getFullYear();

    const { data: entries } = await entryService.getAll(targetMonth, targetYear);

    const totalTea = entries.reduce((sum, e) => sum + e.tea_quantity, 0);
    const totalCoffee = entries.reduce((sum, e) => sum + e.coffee_quantity, 0);
    const totalExpense = entries.reduce((sum, e) => sum + e.total_expense, 0);

    return {
      data: {
        summary: {
          total_tea: totalTea,
          total_coffee: totalCoffee,
          total_expense: totalExpense,
        },
        entries: entries,
      }
    };
  },
};

export default reportService;
