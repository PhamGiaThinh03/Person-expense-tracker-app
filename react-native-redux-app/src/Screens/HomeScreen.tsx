import React from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Platform,
  useWindowDimensions,
  TextInput,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { router } from 'expo-router';
import { ThemedView } from "../../components/ThemedView";
import { ThemedText } from "../../components/ThemedText";
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import {
  selectBalance,
  selectIncome,
  selectExpense,
  selectFilteredTransactions,
  selectBudgets,
  selectPlans,
} from "../Redux/Slices/financialSlice";
import { selectUserInfo } from '../Redux/Slices/userSlice';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  title: string;
  date: string;
  amount: number;
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

type MaterialIconName = 'add-circle-outline' | 'account-balance-wallet' | 'flag';

interface ActionButtonProps {
  icon: MaterialIconName;
  label: string;
  onPress: () => void;
}

const formatNumber = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

// Budget Item Component
const BudgetItem = ({
  category,
  startDate,
  endDate,
  amount,
  spentAmount,
}: {
  category: string;
  startDate: string;
  endDate: string;
  amount: number;
  spentAmount: number;
}) => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 360;
  const progress = Math.min((spentAmount / amount) * 100, 100); // Cap at 100%
  const remaining = amount - spentAmount;
  
  // Determine progress bar color based on percentage spent
  const getProgressColor = () => {
    if (progress >= 100) return '#EB5757'; // Red for overspent
    if (progress >= 80) return '#F2994A'; // Orange for warning
    return '#2F80ED'; // Blue for normal
  };

  return (
    <TouchableOpacity style={styles.budgetItem}>
      <View style={styles.budgetHeader}>
        <View style={styles.budgetIcon}>
          <FontAwesome name="money" size={20} color="#2F80ED" />
        </View>
        <Text style={styles.budgetTitle}>{category}</Text>
      </View>
      <View style={styles.budgetDates}>
        <Text style={styles.budgetDate}>{startDate}</Text>
        <Text style={styles.budgetDate}>{endDate}</Text>
      </View>
      <View style={styles.budgetProgress}>
        <View style={styles.budgetProgressBar}>
          <View
            style={[
              styles.budgetProgressFill,
              {
                width: `${progress}%`,
                backgroundColor: getProgressColor(),
              }
            ]}
          />
        </View>
      </View>
      <View style={styles.budgetAmounts}>
        <Text style={[
          styles.budgetAmount,
          spentAmount > amount && styles.overspentText
        ]}>
          {formatNumber(spentAmount)} đ
        </Text>
        <Text style={styles.budgetAmount}>{formatNumber(amount)} đ</Text>
      </View>
      <View style={styles.budgetFooter}>
        <Text style={[
          styles.remainingText,
          remaining < 0 && styles.overspentText
        ]}>
          {remaining < 0 ? 'Overspent: ' : 'Remaining: '}
          {formatNumber(Math.abs(remaining))} đ
        </Text>
        <Text style={[
          styles.percentageText,
          progress >= 80 && styles.warningText,
          progress >= 100 && styles.overspentText
        ]}>
          {progress.toFixed(1)}%
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// Transaction Item Component
const TransactionItem = ({
  type,
  title,
  date,
  amount,
}: {
  type: 'income' | 'expense';
  title: string;
  date: string;
  amount: number;
}) => {
  const isExpense = type === 'expense';
  const formattedAmount = `${isExpense ? '-' : '+'} ${formatNumber(amount)} đ`;

  return (
    <TouchableOpacity style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <View style={[styles.transactionIcon, isExpense ? styles.expenseIcon : styles.incomeIcon]}>
          {isExpense ? (
            <MaterialIcons name="arrow-downward" size={20} color="#EB5757" />
          ) : (
            <MaterialIcons name="arrow-upward" size={20} color="#2F80ED" />
          )}
          </View>
          <View>
          <Text style={styles.transactionTitle}>{title}</Text>
          <Text style={styles.transactionDate}>{date}</Text>
          </View>
        </View>
      <View style={styles.transactionRight}>
        <Text style={[styles.transactionAmount, isExpense ? styles.expenseText : styles.incomeText]}>
            {formattedAmount}
        </Text>
        <MaterialIcons name="arrow-forward-ios" size={16} color="#666" />
      </View>
    </TouchableOpacity>
  );
};

// Plan Item Component
const PlanItem = ({
  title,
  current,
  target,
  deadline,
}: {
  title: string;
  current: number;
  target: number;
  deadline: string;
}) => {
  const progress = (current / target) * 100;

  return (
    <TouchableOpacity
      style={styles.planItem}
      activeOpacity={0.7}
      accessibilityLabel={`${title} plan`}
    >
      <View style={styles.planHeader}>
        <View style={styles.planIcon}>
          <FontAwesome name="flag" size={20} color="#2F80ED" />
        </View>
        <ThemedText style={styles.planTitle}>{title}</ThemedText>
        <ThemedText style={styles.planDeadline}>Due: {deadline}</ThemedText>
      </View>
      <View style={styles.planProgressContainer}>
        <View style={styles.planProgressBar}>
          <View style={[styles.planProgressFill, { width: `${progress}%` }]} />
        </View>
        <View style={styles.planAmounts}>
          <ThemedText style={styles.planCurrentAmount}>
            {formatNumber(current)} đ
          </ThemedText>
          <ThemedText style={styles.planTargetAmount}>
            {formatNumber(target)} đ
          </ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Action Button Component
const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, onPress }) => (
  <TouchableOpacity
    style={styles.actionButton}
    onPress={onPress}
    activeOpacity={0.7}
    accessibilityLabel={label}
  >
    <View style={styles.actionButtonIcon}>
      <MaterialIcons name={icon} size={24} color="#2F80ED" />
    </View>
    <ThemedText style={styles.actionButtonLabel}>{label}</ThemedText>
  </TouchableOpacity>
);

const HomeScreen = () => {
  const dispatch = useDispatch();

  // Redux selectors
  const balance = useSelector(selectBalance);
  const income = useSelector(selectIncome);
  const expense = useSelector(selectExpense);
  const transactions = useSelector(selectFilteredTransactions);
  const budgets = useSelector(selectBudgets);
  const plans = useSelector(selectPlans);
  const userInfo = useSelector(selectUserInfo);

  // Format currency values
  const formattedBalance = formatNumber(balance) + " đ";
  const formattedIncome = "+" + formatNumber(income) + " đ";
  const formattedExpense = "-" + formatNumber(expense) + " đ";

  // Action handlers
  const handleAddTransaction = () => {
    router.push('/add-income');
  };

  const handleAddBudget = () => {
    router.push('/select-income');
  };

  const handleAddPlan = () => {
    router.push('/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <ThemedView
          style={[styles.mainContent, styles.mainContentSmall]}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.userInfoSection}>
              <TouchableOpacity
                style={styles.avatarContainer}
                activeOpacity={0.8}
                accessibilityLabel="User profile"
              >
                <Ionicons name="person" size={24} color="#2F80ED" />
              </TouchableOpacity>
              <View style={styles.userNameContainer}>
                <View>
                  <ThemedText style={styles.welcomeText}>
                    Welcome{userInfo?.name ? `, ${userInfo.name}` : ''}
                  </ThemedText>
                </View>
              </View>
            </View>
          </View>

          {/* Balance Section */}
          <View style={styles.balanceSection}>
            <Text style={styles.balanceLabel}>My Balance</Text>
            <Text style={styles.balanceAmount}>{formattedBalance}</Text>
          </View>

          {/* Income/Expense Summary */}
          <View style={styles.summaryContainer}>
            <TouchableOpacity
              style={[styles.summaryBox, styles.incomeBox]}
              onPress={() => router.push('/add-income')}
            >
              <Text style={styles.summaryLabel}>Income</Text>
              <Text style={[styles.summaryAmount, styles.incomeText]}>
                {formattedIncome}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.summaryBox, styles.expenseBox]}
              onPress={() => router.push('/add-expense')}
            >
              <Text style={styles.summaryLabel}>Expense</Text>
              <Text style={[styles.summaryAmount, styles.expenseText]}>
                {formattedExpense}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Transactions Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Transactions</Text>
            {transactions.length > 0 ? (
              transactions.map((transaction: Transaction) => (
                <TransactionItem
                  key={transaction.id}
                  type={transaction.type}
                  title={transaction.title}
                  date={transaction.date}
                  amount={transaction.amount}
                />
              ))
            ) : (
              <Text style={styles.emptyText}>No transactions yet</Text>
            )}
          </View>

          {/* Budget Section */}
          <View style={[styles.section, styles.budgetSection]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Budget</Text>
              <TouchableOpacity onPress={() => router.push('/add-budget')}>
                <Text style={styles.addButton}>Add budget</Text>
              </TouchableOpacity>
            </View>
            {budgets.length > 0 ? (
              budgets.map((budget) => (
                <BudgetItem
                  key={budget.id}
                  category={budget.category}
                  startDate={budget.startDate}
                  endDate={budget.endDate}
                  amount={budget.amount}
                  spentAmount={budget.spentAmount}
                />
              ))
            ) : (
              <Text style={styles.emptyText}>No budgets yet</Text>
            )}
          </View>
        </ThemedView>
      </ScrollView>

      {/* Bottom Navigation Icons */}
      <View style={styles.bottomNavIcons}>
        <TouchableOpacity accessibilityLabel="Home" onPress={() => router.push('/home')}>
          <Ionicons name="home" size={28} color="#2F80ED" style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity accessibilityLabel="Statistics" onPress={() => router.push('/chart')}>
          <Ionicons name="stats-chart" size={28} color="#666" style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity accessibilityLabel="Settings" onPress={() => router.push('/settings')}>
          <Ionicons name="settings-outline" size={28} color="#666" style={styles.navIcon} />
        </TouchableOpacity>
      </View>

      {/* Home Indicator */}
      {Platform.OS === "ios" && (
        <View style={styles.homeIndicatorContainer}>
          <View style={styles.homeIndicator} />
        </View>
      )}
    </SafeAreaView>
  );
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  mainContent: {
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: 480,
    width: "100%",
    paddingTop: Platform.OS === "ios" ? 16 : 32,
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  mainContentSmall: {
    paddingHorizontal: 10,
  },
  header: {
    display: "flex",
    marginTop: 25,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingBottom: 10,
  },
  userInfoSection: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarContainer: {
    borderRadius: 24,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 48,
    height: 48,
    backgroundColor: "#F5F5F5",
  },
  avatar: {
    aspectRatio: 1,
    width: 34,
    height: 34,
  },
  userNameContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
    fontWeight: "500",
  },
  welcomeText: {
    color: "rgba(96, 112, 143, 1)",
    fontSize: 14,
    letterSpacing: -0.15,
  },
  userName: {
    color: "rgba(0, 0, 0, 1)",
    fontSize: 20,
    lineHeight: 30,
    letterSpacing: -0.22,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 15,
    height: 44,
  },
  searchIconContainer: {
    marginRight: 8,
  },
  searchIcon: {
    width: 16,
    height: 16,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: "#000",
  },
  clearSearchButton: {
    padding: 8,
  },
  clearSearchText: {
    fontSize: 16,
    color: "#60708F",
  },
  balanceSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  balanceLabel: {
    fontSize: 14,
    color: "#666",
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "600",
    color: "#000",
    marginTop: 8,
  },
  summaryContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 24,
    gap: 12,
  },
  summaryBox: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
  },
  incomeBox: {
    backgroundColor: "#F0F7FF",
  },
  expenseBox: {
    backgroundColor: "#FFF0F0",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
  },
  incomeText: {
    color: "#2F80ED",
  },
  expenseText: {
    color: "#EB5757",
  },
  quickActionsContainer: {
    marginTop: 25,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionButton: {
    alignItems: "center",
    width: "30%",
  },
  actionButtonIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionButtonImage: {
    width: 24,
    height: 24,
  },
  actionButtonLabel: {
    fontSize: 12,
    textAlign: "center",
    color: "#60708F",
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  budgetSection: {
    marginTop: 32,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  addButton: {
    fontSize: 14,
    color: "#2F80ED",
    fontWeight: "600",
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  incomeIcon: {
    backgroundColor: "#E3F2FD",
  },
  expenseIcon: {
    backgroundColor: "#FFEBEE",
  },
  iconText: {
    fontSize: 20,
    fontWeight: "600",
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  transactionDate: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  transactionRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  arrowIcon: {
    fontSize: 20,
    color: "#666",
  },
  budgetItem: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  budgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  budgetIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  budgetTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  budgetDates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  budgetDate: {
    fontSize: 14,
    color: '#666',
  },
  budgetProgress: {
    marginBottom: 8,
  },
  budgetProgressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  budgetProgressFill: {
    height: '100%',
    backgroundColor: '#2F80ED',
  },
  budgetAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  budgetAmount: {
    fontSize: 14,
    color: '#666',
  },
  budgetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  remainingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2F80ED',
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2F80ED',
  },
  warningText: {
    color: '#F2994A',
  },
  overspentText: {
    color: '#EB5757',
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginVertical: 24,
  },
  bottomNavIcons: {
    alignSelf: "center",
    display: "flex",
    marginTop: 39,
    flexDirection: "row",
    alignItems: "center",
    gap: 102,
  },
  navIcon: {
    aspectRatio: 1,
    width: 28,
    height: 28,
  },
  homeIndicatorContainer: {
    display: "flex",
    width: "100%",
    paddingHorizontal: 80,
    paddingTop: 30,
    paddingBottom: Platform.OS === "ios" ? 8 : 0,
    flexDirection: "column",
    alignItems: "center",
  },
  homeIndicator: {
    borderRadius: 100,
    width: 144,
    height: 5,
    backgroundColor: "#E0E0E0",
  },
  planItem: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  planDeadline: {
    fontSize: 14,
    color: '#666',
  },
  planProgressContainer: {
    marginBottom: 8,
  },
  planProgressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  planProgressFill: {
    height: '100%',
    backgroundColor: '#2F80ED',
  },
  planAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  planCurrentAmount: {
    fontSize: 14,
    color: '#666',
  },
  planTargetAmount: {
    fontSize: 14,
    color: '#666',
  },
});

export default HomeScreen;
