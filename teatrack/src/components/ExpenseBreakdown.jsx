import React from 'react';
import './ExpenseBreakdown.css';

export default function ExpenseBreakdown({ tea, coffee, teaExpense, coffeeExpense, totalExpense, totalCups, teaRate, coffeeRate }) {
  return (
    <div className="expense-breakdown">
      <table className="breakdown-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity (Cups)</th>
            <th>Rate (₹)</th>
            <th>Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Tea</td>
            <td>{tea}</td>
            <td>{teaRate.toFixed(2)}</td>
            <td>₹{teaExpense.toLocaleString()}</td>
          </tr>
          <tr>
            <td>Coffee</td>
            <td>{coffee}</td>
            <td>{coffeeRate.toFixed(2)}</td>
            <td>₹{coffeeExpense.toLocaleString()}</td>
          </tr>
          <tr className="breakdown-total-row">
            <td>Total</td>
            <td>{totalCups}</td>
            <td>-</td>
            <td>₹{totalExpense.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
