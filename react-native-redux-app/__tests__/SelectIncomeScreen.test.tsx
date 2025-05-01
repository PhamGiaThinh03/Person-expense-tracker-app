import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import financialReducer, {
  setSelectedIncomeType,
} from "../src/Redux/Slices/financialSlice";
import SelectIncomeScreen from "../app/select-income";
import { Alert, Dimensions, Platform, AsyncStorage } from "react-native";
import * as Analytics from "../src/utils/analytics";
import { translate, getPreferredLanguage } from "../src/i18n/translations";

// Mock dependencies
jest.mock("expo-router", () => ({
  router: {
    back: jest.fn(),
    push: jest.fn(),
  },
  useNavigation: () => ({
    addListener: jest.fn(() => jest.fn()),
  }),
}));

jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: "light",
    Medium: "medium",
  },
  NotificationFeedbackType: {
    Error: "error",
    Success: "success",
  },
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  SafeAreaProvider: ({ children }) => children,
}));

jest.mock("@/hooks/useThemeColor", () => ({
  __esModule: true,
  default: jest.fn(),
  useThemeColor: () => "#2F80ED",
}));

jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

// Mock AsyncStorage
jest.mock("react-native", () => {
  const RN = jest.requireActual("react-native");
  return {
    ...RN,
    AsyncStorage: {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    },
    AccessibilityInfo: {
      ...RN.AccessibilityInfo,
      announceForAccessibility: jest.fn(),
      setAccessibilityFocus: jest.fn(),
    },
    findNodeHandle: jest.fn(() => 1),
    NetInfo: {
      addEventListener: jest.fn(() => ({ remove: jest.fn() })),
      fetch: jest.fn(() =>
        Promise.resolve({ isConnected: true, isInternetReachable: true }),
      ),
    },
  };
});

// Mock components
jest.mock("../components/ThemedText", () => {
  const React = require("react");
  return {
    ThemedText: ({ children, style, lightColor, darkColor, ...props }) => (
      <mock-themed-text style={style} {...props}>
        {children}
      </mock-themed-text>
    ),
  };
});

jest.mock("../components/ThemedView", () => {
  const React = require("react");
  return {
    ThemedView: ({ children, style, ...props }) => (
      <mock-themed-view style={style} {...props}>
        {children}
      </mock-themed-view>
    ),
  };
});

// Mock Alert
jest.spyOn(Alert, "alert").mockImplementation(() => {});

// Mock Analytics
jest.mock("../src/utils/analytics", () => ({
  trackScreenView: jest.fn(),
  trackUserAction: jest.fn(),
  trackFormSubmit: jest.fn(),
  trackError: jest.fn(),
  startPerformanceTimer: jest.fn(() => ({
    stop: jest.fn(),
  })),
  initAnalytics: jest.fn(),
}));

// Mock i18n
jest.mock("../src/i18n/translations", () => ({
  translate: jest.fn((key) => key),
  getPreferredLanguage: jest.fn(() => "en"),
  SupportedLanguage: ["en", "vi", "es", "fr"],
}));

// Create a mock store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      financial: financialReducer,
    },
    preloadedState: {
      financial: {
        balance: 5000000,
        income: 3000000,
        expense: 1500000,
        searchQuery: "",
        selectedIncomeType: null,
        transactions: [],
        budgets: [],
        plans: [],
        ...initialState,
      },
    },
  });
};

describe("SelectIncomeScreen", () => {
  let store;
  const originalDimensions = Dimensions.get("window");

  // Mock dimensions for testing responsive layouts
  const mockDimensions = (width, height) => {
    jest.spyOn(Dimensions, "get").mockImplementation((dim) => {
      if (dim === "window" || dim === "screen") {
        return { width, height };
      }
      return originalDimensions;
    });
  };

  beforeEach(() => {
    store = createMockStore();
    jest.clearAllMocks();

    // Default to portrait mode dimensions
    mockDimensions(375, 812);

    // Mock platform
    Platform.OS = "ios";

    // Mock AsyncStorage
    AsyncStorage.getItem.mockImplementation((key) => {
      if (key === "languagePreference") return Promise.resolve("en");
      if (key === "selectedIncomeType") return Promise.resolve(null);
      if (key === "pendingIncomeSelections") return Promise.resolve(null);
      return Promise.resolve(null);
    });

    // Mock NetInfo
    Platform.NetInfo = {
      addEventListener: jest.fn(() => ({ remove: jest.fn() })),
      fetch: jest.fn(() =>
        Promise.resolve({ isConnected: true, isInternetReachable: true }),
      ),
    };
  });

  afterAll(() => {
    // Restore original dimensions
    jest.spyOn(Dimensions, "get").mockRestore();
  });

  it("renders correctly in portrait mode", () => {
    const { getByText, getAllByText } = render(
      <Provider store={store}>
        <SelectIncomeScreen />
      </Provider>,
    );

    expect(getByText("Income")).toBeTruthy();
    expect(getByText("Salary")).toBeTruthy();
    expect(getByText("Business")).toBeTruthy();
    expect(getByText("Gifts")).toBeTruthy();
    expect(getByText("Others")).toBeTruthy();
    expect(getByText("Confirm")).toBeTruthy();
    expect(getByText("Cancel")).toBeTruthy();

    // Check for bottom navigation
    expect(getByText("Home")).toBeTruthy();
    expect(getByText("Stats")).toBeTruthy();
    expect(getByText("Profile")).toBeTruthy();
  });

  it("initializes analytics on mount", () => {
    render(
      <Provider store={store}>
        <SelectIncomeScreen />
      </Provider>,
    );

    expect(Analytics.initAnalytics).toHaveBeenCalled();
    expect(Analytics.trackScreenView).toHaveBeenCalledWith(
      "select_income",
      expect.any(Object),
    );
    expect(Analytics.startPerformanceTimer).toHaveBeenCalledWith(
      "select_income_screen_load",
    );
  });

  it("loads saved language preference on mount", async () => {
    // Mock AsyncStorage to return a saved language
    AsyncStorage.getItem.mockImplementation((key) => {
      if (key === "languagePreference") return Promise.resolve("fr");
      return Promise.resolve(null);
    });

    await act(async () => {
      render(
        <Provider store={store}>
          <SelectIncomeScreen />
        </Provider>,
      );
    });

    // Verify AsyncStorage was called with the correct key
    expect(AsyncStorage.getItem).toHaveBeenCalledWith("languagePreference");
  });

  it("renders correctly in landscape mode", () => {
    // Mock landscape dimensions
    mockDimensions(812, 375);

    const { getByText } = render(
      <Provider store={store}>
        <SelectIncomeScreen />
      </Provider>,
    );

    expect(getByText("Income")).toBeTruthy();
    expect(getByText("Salary")).toBeTruthy();
    expect(getByText("Business")).toBeTruthy();
    expect(getByText("Gifts")).toBeTruthy();
    expect(getByText("Others")).toBeTruthy();
  });

  it("renders correctly on small screens", () => {
    // Mock small screen dimensions
    mockDimensions(320, 568);

    const { getByText } = render(
      <Provider store={store}>
        <SelectIncomeScreen />
      </Provider>,
    );

    expect(getByText("Income")).toBeTruthy();
    expect(getByText("Salary")).toBeTruthy();
  });

  it("allows selecting an income type", () => {
    const { getByText } = render(
      <Provider store={store}>
        <SelectIncomeScreen />
      </Provider>,
    );

    fireEvent.press(getByText("Salary"));

    // Verify analytics was called
    expect(Analytics.trackUserAction).toHaveBeenCalledWith(
      "select_income_type",
      expect.any(Object),
    );

    // Verify AsyncStorage was called to save the selection
    expect(AsyncStorage.setItem).toHaveBeenCalled();

    fireEvent.press(getByText("Confirm"));

    // Check if the action was dispatched
    const actions = store.getState().financial.selectedIncomeType;
    expect(actions).toBe("Salary");

    // Verify form submission was tracked
    expect(Analytics.trackFormSubmit).toHaveBeenCalledWith(
      "income_selection",
      expect.any(Object),
    );
  });

  it("shows an alert when trying to confirm without selection", async () => {
    const { getByText } = render(
      <Provider store={store}>
        <SelectIncomeScreen />
      </Provider>,
    );

    fireEvent.press(getByText("Confirm"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalled();
      expect(Analytics.trackError).toHaveBeenCalledWith(
        "income_selection_validation_error",
        expect.any(Object),
      );
    });
  });

  it("navigates back when cancel is pressed", () => {
    const { getByText } = render(
      <Provider store={store}>
        <SelectIncomeScreen />
      </Provider>,
    );

    fireEvent.press(getByText("Cancel"));

    // Verify analytics was called
    expect(Analytics.trackUserAction).toHaveBeenCalledWith(
      "cancel_income_selection",
    );

    // Check if router.back was called
    const { router } = require("expo-router");
    expect(router.back).toHaveBeenCalled();
  });

  it("pre-selects income type from Redux state", () => {
    const preloadedStore = createMockStore({
      selectedIncomeType: "Business",
    });

    const { getByText } = render(
      <Provider store={preloadedStore}>
        <SelectIncomeScreen />
      </Provider>,
    );

    // Business should be pre-selected
    expect(getByText("Business")).toBeTruthy();

    // Confirm button should be enabled
    const confirmButton = getByText("Confirm").parentNode;
    expect(confirmButton.props.disabled).toBeFalsy();
  });

  it("validates selection before confirming", async () => {
    const { getByText } = render(
      <Provider store={store}>
        <SelectIncomeScreen />
      </Provider>,
    );

    // Try to confirm without selection
    fireEvent.press(getByText("Confirm"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalled();
      expect(Analytics.trackError).toHaveBeenCalled();
    });

    // Select an income type
    fireEvent.press(getByText("Salary"));

    // Confirm with selection
    fireEvent.press(getByText("Confirm"));

    // Should not show alert again
    expect(Alert.alert).toHaveBeenCalledTimes(1);

    // Should dispatch action and navigate back
    const { router } = require("expo-router");
    await waitFor(() => {
      expect(router.back).toHaveBeenCalled();
    });
  });

  it("handles offline mode correctly", async () => {
    // Mock NetInfo to simulate offline
    Platform.NetInfo = {
      addEventListener: jest.fn((callback) => {
        callback({ isConnected: false, isInternetReachable: false });
        return { remove: jest.fn() };
      }),
      fetch: jest.fn(() =>
        Promise.resolve({ isConnected: false, isInternetReachable: false }),
      ),
    };

    const { getByText } = render(
      <Provider store={store}>
        <SelectIncomeScreen />
      </Provider>,
    );

    // Select an income type
    fireEvent.press(getByText("Salary"));

    // Confirm selection
    fireEvent.press(getByText("Confirm"));

    // Should add to pending selections
    expect(AsyncStorage.setItem).toHaveBeenCalled();

    // Should show offline notification
    expect(Alert.alert).toHaveBeenCalled();
  });

  it("handles language change correctly", async () => {
    const { getByText, getByLabelText } = render(
      <Provider store={store}>
        <SelectIncomeScreen />
      </Provider>,
    );

    // Find and press the language selector toggle
    const languageToggle = getByLabelText("Toggle language selector");
    fireEvent.press(languageToggle);

    // Find and select a different language (assuming the language buttons are rendered)
    // This might need adjustment based on how your language selector is implemented
    const frenchOption = getByText("FR");
    fireEvent.press(frenchOption);

    // Verify analytics was called
    expect(Analytics.trackUserAction).toHaveBeenCalledWith(
      "change_language",
      expect.any(Object),
    );

    // Verify language preference was saved
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "languagePreference",
      "fr",
    );
  });

  it("handles loading state during submission", async () => {
    // Mock a delay in the Redux dispatch
    jest.useFakeTimers();

    const { getByText } = render(
      <Provider store={store}>
        <SelectIncomeScreen />
      </Provider>,
    );

    // Select an income type
    fireEvent.press(getByText("Salary"));

    // Start confirmation
    fireEvent.press(getByText("Confirm"));

    // Advance timers to simulate async operation
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Should navigate back after the delay
    const { router } = require("expo-router");
    expect(router.back).toHaveBeenCalled();

    jest.useRealTimers();
  });

  it("announces selection to screen readers", () => {
    const { getByText } = render(
      <Provider store={store}>
        <SelectIncomeScreen />
      </Provider>,
    );

    // Select an income type
    fireEvent.press(getByText("Salary"));

    // Should announce selection
    expect(
      require("react-native").AccessibilityInfo.announceForAccessibility,
    ).toHaveBeenCalled();
  });

  it("navigates to home when home tab is pressed", () => {
    const { getByText } = render(
      <Provider store={store}>
        <SelectIncomeScreen />
      </Provider>,
    );

    // Press home tab
    fireEvent.press(getByText("Home"));

    // Should track navigation
    expect(Analytics.trackUserAction).toHaveBeenCalledWith("navigate_to_home");

    // Should navigate to home
    const { router } = require("expo-router");
    expect(router.push).toHaveBeenCalledWith("/home");
  });

  it("renders correctly on Android", () => {
    // Mock Android platform
    Platform.OS = "android";

    const { getByText } = render(
      <Provider store={store}>
        <SelectIncomeScreen />
      </Provider>,
    );

    expect(getByText("Income")).toBeTruthy();
    expect(getByText("Salary")).toBeTruthy();
  });

  it("sorts income types by priority", () => {
    const { getAllByRole } = render(
      <Provider store={store}>
        <SelectIncomeScreen />
      </Provider>,
    );

    // Get all radio buttons (income type options)
    const options = getAllByRole("radio");

    // First option should be Salary (priority 1)
    expect(options[0].props.accessibilityLabel).toContain("Salary");
  });

  it("syncs pending selections when coming online", async () => {
    // Mock AsyncStorage to return pending selections
    AsyncStorage.getItem.mockImplementation((key) => {
      if (key === "pendingIncomeSelections")
        return Promise.resolve(JSON.stringify(["Salary"]));
      return Promise.resolve(null);
    });

    // Mock NetInfo to simulate coming online
    let networkCallback;
    Platform.NetInfo = {
      addEventListener: jest.fn((callback) => {
        networkCallback = callback;
        return { remove: jest.fn() };
      }),
      fetch: jest.fn(() =>
        Promise.resolve({ isConnected: false, isInternetReachable: false }),
      ),
    };

    await act(async () => {
      render(
        <Provider store={store}>
          <SelectIncomeScreen />
        </Provider>,
      );
    });

    // Simulate coming online
    await act(async () => {
      networkCallback({ isConnected: true, isInternetReachable: true });
    });

    // Should try to sync pending selections
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(
      "pendingIncomeSelections",
    );
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
      "pendingIncomeSelections",
    );
  });

  it("handles errors during confirmation", async () => {
    // Mock dispatch to throw an error
    const mockDispatch = jest.fn(() => {
      throw new Error("Test error");
    });

    // Create a store with the mock dispatch
    const mockStore = {
      ...store,
      dispatch: mockDispatch,
    };

    const { getByText } = render(
      <Provider store={mockStore}>
        <SelectIncomeScreen />
      </Provider>,
    );

    // Select an income type
    fireEvent.press(getByText("Salary"));

    // Try to confirm
    fireEvent.press(getByText("Confirm"));

    // Should track error
    await waitFor(() => {
      expect(Analytics.trackError).toHaveBeenCalledWith(
        "income_selection_confirmation_error",
        expect.any(Object),
      );
      expect(Alert.alert).toHaveBeenCalled();
    });
  });
});
