import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  title: string;
  amount: number;
  date: string;
  category?: string;
}

interface Budget {
  id: string;
  category: string;
  amount: number;
  startDate: string;
  endDate: string;
  spentAmount: number;
}

interface Plan {
  id: string;
  title: string;
  current: number;
  target: number;
  deadline: string;
}

interface FinancialState {
  balance: number;
  income: number;
  expense: number;
  transactions: Transaction[];
  budgets: Budget[];
  plans: Plan[];
  searchQuery: string;
  selectedIncomeType: string | null;
  selectedExpenseType: string | null;
  selectedDate: string | null;
}

const initialState: FinancialState = {
  balance: 0,
  income: 0,
  expense: 0,
  transactions: [],
  budgets: [],
  searchQuery: '',
  selectedIncomeType: null,
  selectedExpenseType: null,
  selectedDate: null,
  plans: [],
};

const isDateInRange = (date: string, startDate: string, endDate: string) => {
  const checkDate = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);
  return checkDate >= start && checkDate <= end;
};

const financialSlice = createSlice({
  name: 'financial',
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.push(action.payload);
      if (action.payload.type === 'income') {
        state.income += action.payload.amount;
        state.balance += action.payload.amount;
      } else {
        state.expense += action.payload.amount;
        state.balance -= action.payload.amount;
        
        // Update budget if expense matches a budget category and is within date range
        if (action.payload.category) {
          const matchingBudget = state.budgets.find(
            budget => 
              budget.category === action.payload.category &&
              isDateInRange(action.payload.date, budget.startDate, budget.endDate)
          );
          if (matchingBudget) {
            matchingBudget.spentAmount += action.payload.amount;
          }
        }
      }
    },
    addBudget: (state, action: PayloadAction<Omit<Budget, 'spentAmount'>>) => {
      const newBudget: Budget = {
        ...action.payload,
        spentAmount: 0
      };
      
      // Calculate initial spent amount from existing transactions
      const existingExpenses = state.transactions.filter(
        transaction =>
          transaction.type === 'expense' &&
          transaction.category === newBudget.category &&
          isDateInRange(transaction.date, newBudget.startDate, newBudget.endDate)
      );
      
      newBudget.spentAmount = existingExpenses.reduce(
        (total, expense) => total + expense.amount,
        0
      );
      
      state.budgets.push(newBudget);
    },
    updateBudget: (state, action: PayloadAction<{ id: string; updates: Partial<Budget> }>) => {
      const budget = state.budgets.find(b => b.id === action.payload.id);
      if (budget) {
        Object.assign(budget, action.payload.updates);
        
        // Recalculate spent amount if date range changed
        if (action.payload.updates.startDate || action.payload.updates.endDate) {
          const startDate = action.payload.updates.startDate || budget.startDate;
          const endDate = action.payload.updates.endDate || budget.endDate;
          
          const expenses = state.transactions.filter(
            transaction =>
              transaction.type === 'expense' &&
              transaction.category === budget.category &&
              isDateInRange(transaction.date, startDate, endDate)
          );
          
          budget.spentAmount = expenses.reduce(
            (total, expense) => total + expense.amount,
            0
          );
        }
      }
    },
    deleteBudget: (state, action: PayloadAction<string>) => {
      state.budgets = state.budgets.filter(budget => budget.id !== action.payload);
    },
    setSelectedIncomeType: (state, action: PayloadAction<string>) => {
      state.selectedIncomeType = action.payload;
    },
    setSelectedExpenseType: (state, action: PayloadAction<string>) => {
      state.selectedExpenseType = action.payload;
    },
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    updateTransaction: (state, action: PayloadAction<{ id: string; updates: Partial<Transaction> }>) => {
      const transaction = state.transactions.find(t => t.id === action.payload.id);
      if (transaction) {
        // Trừ giá trị cũ khỏi income/expense/balance
        if (transaction.type === 'income') {
          state.income -= transaction.amount;
          state.balance -= transaction.amount;
        } else {
          state.expense -= transaction.amount;
          state.balance += transaction.amount;
        }
        // Cập nhật transaction
        Object.assign(transaction, action.payload.updates);
        // Cộng lại giá trị mới
        if (transaction.type === 'income') {
          state.income += transaction.amount;
          state.balance += transaction.amount;
        } else {
          state.expense += transaction.amount;
          state.balance -= transaction.amount;
        }
      }
    },
    deleteTransaction: (state, action: PayloadAction<string>) => {
      const transaction = state.transactions.find(t => t.id === action.payload);
      if (transaction) {
        if (transaction.type === 'income') {
          state.income -= transaction.amount;
          state.balance -= transaction.amount;
        } else {
          state.expense -= transaction.amount;
          state.balance += transaction.amount;
        }
      }
      state.transactions = state.transactions.filter(t => t.id !== action.payload);
    },
  },
});

export const {
  addTransaction,
  addBudget,
  updateBudget,
  deleteBudget,
  updateTransaction,
  deleteTransaction,
  setSelectedIncomeType,
  setSelectedExpenseType,
  setSelectedDate,
  setSearchQuery,
} = financialSlice.actions;

// Selectors
export const selectBalance = (state: RootState) => state.financial.transactions.reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);
export const selectIncome = (state: RootState) => state.financial.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
export const selectExpense = (state: RootState) => state.financial.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
export const selectBudgets = (state: RootState) => state.financial.budgets;
export const selectPlans = (state: RootState) => state.financial.plans;
export const selectFilteredTransactions = (state: RootState) => {
  const query = state.financial.searchQuery.toLowerCase();
  return state.financial.transactions.filter(
    transaction =>
      transaction.title.toLowerCase().includes(query) ||
      transaction.amount.toString().includes(query) ||
      transaction.date.includes(query)
  );
};
export const selectSearchQuery = (state: RootState) => state.financial.searchQuery;

// New Budget Selectors
export const selectTotalBudgetAmount = (state: RootState) =>
  state.financial.budgets.reduce((total, budget) => total + budget.amount, 0);

export const selectTotalSpentAmount = (state: RootState) =>
  state.financial.budgets.reduce((total, budget) => total + budget.spentAmount, 0);

export const selectRemainingAmount = (state: RootState) =>
  selectTotalBudgetAmount(state) - selectTotalSpentAmount(state);

export const selectBudgetProgress = (state: RootState) =>
  state.financial.budgets.map(budget => ({
    ...budget,
    progress: (budget.spentAmount / budget.amount) * 100,
    remaining: budget.amount - budget.spentAmount,
  }));

export default financialSlice.reducer; 