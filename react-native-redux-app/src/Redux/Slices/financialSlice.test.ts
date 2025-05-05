import financialReducer, {
  addTransaction, addBudget, deleteBudget, updateTransaction, deleteTransaction
} from './financialSlice';

describe('financialSlice', () => {
  it('should add an income transaction', () => {
    const initialState = { ...financialReducer(undefined, { type: '' }) };
    const tx = { id: '1', type: 'income', title: 'Salary', amount: 1000, date: '2024-06-01' };
    const state = financialReducer(initialState, addTransaction(tx));
    expect(state.transactions).toContainEqual(tx);
    expect(state.income).toBe(1000);
    expect(state.balance).toBe(1000);
  });
  it('should add a budget and calculate spentAmount', () => {
    const initialState = { ...financialReducer(undefined, { type: '' }) };
    const tx = { id: '1', type: 'expense', title: 'Food', amount: 100, date: '2024-06-01', category: 'Food' };
    let state = financialReducer(initialState, addTransaction(tx));
    state = financialReducer(state, addBudget({ id: 'b1', category: 'Food', amount: 500, startDate: '2024-06-01', endDate: '2024-06-30' }));
    expect(state.budgets[0].spentAmount).toBe(100);
  });
  it('should delete a budget', () => {
    const initialState = { ...financialReducer(undefined, { type: '' }) };
    let state = financialReducer(initialState, addBudget({ id: 'b1', category: 'Food', amount: 500, startDate: '2024-06-01', endDate: '2024-06-30' }));
    state = financialReducer(state, deleteBudget('b1'));
    expect(state.budgets).toHaveLength(0);
  });
  it('should update a transaction', () => {
    const initialState = { ...financialReducer(undefined, { type: '' }) };
    let state = financialReducer(initialState, addTransaction({ id: '1', type: 'income', title: 'Salary', amount: 1000, date: '2024-06-01' }));
    state = financialReducer(state, updateTransaction({ id: '1', updates: { amount: 2000 } }));
    expect(state.transactions[0].amount).toBe(2000);
    expect(state.income).toBe(2000);
    expect(state.balance).toBe(2000);
  });
  it('should delete a transaction', () => {
    const initialState = { ...financialReducer(undefined, { type: '' }) };
    let state = financialReducer(initialState, addTransaction({ id: '1', type: 'income', title: 'Salary', amount: 1000, date: '2024-06-01' }));
    state = financialReducer(state, deleteTransaction('1'));
    expect(state.transactions).toHaveLength(0);
    expect(state.income).toBe(0);
    expect(state.balance).toBe(0);
  });
}); 