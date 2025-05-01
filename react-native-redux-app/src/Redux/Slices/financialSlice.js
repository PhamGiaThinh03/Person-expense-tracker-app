import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  balance: 7600000,
  income: 10000000,
  expense: 2400000,
  searchQuery: "",
  transactions: [
    {
      id: "1",
      title: "Shopping",
      date: "15.04.2025",
      amount: 200000,
      type: "expense",
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/8b6f1f6296c47410d12a7cf55b7dfdf56e667e91?placeholderIfAbsent=true&apiKey=21f0d2bdb9a14271bd5d002b9ab383d8",
    },
    {
      id: "2",
      title: "Salary",
      date: "15.04.2025",
      amount: 10000000,
      type: "income",
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/1d0ecd86e056e6777cda16f26d853fd644536f75?placeholderIfAbsent=true&apiKey=21f0d2bdb9a14271bd5d002b9ab383d8",
    },
    {
      id: "3",
      title: "Groceries",
      date: "12.04.2025",
      amount: 150000,
      type: "expense",
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/8b6f1f6296c47410d12a7cf55b7dfdf56e667e91?placeholderIfAbsent=true&apiKey=21f0d2bdb9a14271bd5d002b9ab383d8",
    },
    {
      id: "4",
      title: "Freelance",
      date: "10.04.2025",
      amount: 2000000,
      type: "income",
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/1d0ecd86e056e6777cda16f26d853fd644536f75?placeholderIfAbsent=true&apiKey=21f0d2bdb9a14271bd5d002b9ab383d8",
    },
  ],
  budgets: [
    {
      id: "1",
      title: "Food & Drink",
      startDate: "01.04.2025",
      endDate: "30.04.2025",
      current: 650000,
      max: 2000000,
    },
    {
      id: "2",
      title: "Shopping",
      startDate: "01.04.2025",
      endDate: "30.04.2025",
      current: 650000,
      max: 2000000,
    },
  ],
  plans: [
    {
      id: "1",
      title: "Save for vacation",
      target: 15000000,
      current: 5000000,
      deadline: "01.12.2025",
    },
    {
      id: "2",
      title: "New laptop",
      target: 25000000,
      current: 10000000,
      deadline: "01.08.2025",
    },
  ],
};

const financialSlice = createSlice({
  name: "financial",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    addTransaction: (state, action) => {
      state.transactions.unshift(action.payload);

      // Update balance
      if (action.payload.type === "income") {
        state.income += action.payload.amount;
        state.balance += action.payload.amount;
      } else {
        state.expense += action.payload.amount;
        state.balance -= action.payload.amount;
      }
    },
    addBudget: (state, action) => {
      state.budgets.push(action.payload);
    },
    addPlan: (state, action) => {
      state.plans.push(action.payload);
    },
    updatePlan: (state, action) => {
      const index = state.plans.findIndex(
        (plan) => plan.id === action.payload.id,
      );
      if (index !== -1) {
        state.plans[index] = { ...state.plans[index], ...action.payload };
      }
    },
  },
});

export const {
  setSearchQuery,
  addTransaction,
  addBudget,
  addPlan,
  updatePlan,
} = financialSlice.actions;

// Selectors
export const selectBalance = (state) => state.financial.balance;
export const selectIncome = (state) => state.financial.income;
export const selectExpense = (state) => state.financial.expense;
export const selectSearchQuery = (state) => state.financial.searchQuery;
export const selectTransactions = (state) => state.financial.transactions;
export const selectFilteredTransactions = (state) => {
  const query = state.financial.searchQuery.toLowerCase();
  if (!query) return state.financial.transactions;

  return state.financial.transactions.filter((transaction) =>
    transaction.title.toLowerCase().includes(query),
  );
};
export const selectBudgets = (state) => state.financial.budgets;
export const selectPlans = (state) => state.financial.plans;

export default financialSlice.reducer;
