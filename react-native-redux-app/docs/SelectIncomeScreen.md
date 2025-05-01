# SelectIncomeScreen Component

## Overview

The `SelectIncomeScreen` component provides a user interface for selecting different types of income sources. It is part of the financial management app and integrates with Redux for state management.

![SelectIncomeScreen Screenshot](../assets/images/select-income-screen.png)

## Features

- Selection of predefined income types (Salary, Business, Gifts, Others)
- Visual feedback for selected items
- Form validation with user feedback
- Accessibility support
- Theme-aware styling (light/dark mode)
- Responsive design for different screen sizes
- Haptic feedback for interactions
- Multi-language support
- Offline capability
- Analytics integration
- Performance optimization

## Usage

```tsx
import { router } from "expo-router";

// Navigate to the SelectIncomeScreen
router.push("/select-income");
```

The component is designed to be used as part of the app's navigation flow, typically accessed from the AddIncomeScreen when a user needs to select an income type.

## Props

This component doesn't accept any props as it's designed to be used as a standalone screen in the navigation flow.

## Redux Integration

The component integrates with Redux using the following actions and selectors:

- `setSelectedIncomeType`: Action to update the selected income type in the Redux store
- `selectSelectedIncomeType`: Selector to get the currently selected income type from the Redux store

## Component Structure

```
SelectIncomeScreen
├── Header
│   ├── Back Button
│   └── Title
├── Language Selector
│   └── Language Options (EN, VI, ES, FR)
├── Network Status Indicators
│   ├── Offline Mode
│   └── Pending Changes
├── Income Type Options
│   ├── Salary
│   ├── Business
│   ├── Gifts
│   └── Others
├── Action Buttons
│   ├── Cancel
│   └── Confirm/Save Offline
└── Bottom Navigation
```

## Internationalization

The component supports multiple languages:

- English (en)
- Vietnamese (vi)
- Spanish (es)
- French (fr)

Language selection is persisted using AsyncStorage and can be changed at runtime. The UI automatically updates to reflect the selected language.

```tsx
// Example of language selection
const handleLanguageChange = (language: SupportedLanguage) => {
  setLanguage(language);
  saveLanguagePreference(language);
};
```

## Offline Support

The component includes robust offline support:

- Detects network connectivity status
- Stores selections locally when offline
- Queues changes for synchronization when back online
- Provides visual indicators for offline mode
- Automatically syncs pending changes when connectivity is restored

```tsx
// Example of offline handling
if (networkState.isConnected) {
  // Online - update Redux directly
  dispatch(setSelectedIncomeType(selectedType));
} else {
  // Offline - add to pending selections
  await addToPendingSelections(selectedType as IncomeType);

  // Show offline notification
  Alert.alert(
    translate("selectIncomeType.offlineMode", language),
    translate("alert.offlineNotification", language),
  );
}
```

## Analytics Integration

The component includes comprehensive analytics tracking:

- Screen views
- User interactions (selections, navigation)
- Form submissions
- Errors
- Performance metrics
- Network requests

```tsx
// Example of analytics tracking
Analytics.trackScreenView("select_income", {
  has_preselected_type: reduxSelectedType ? "true" : "false",
  language,
  is_landscape: isLandscape ? "true" : "false",
});

// Performance tracking
const confirmTimer = Analytics.startPerformanceTimer("confirm_selection");
// ... perform operation
confirmTimer.stop({ success: true });
```

## Accessibility

The component includes comprehensive accessibility support:

- Screen reader compatibility with proper labels and hints
- Focus management
- Proper ARIA roles and states
- Announcements for state changes
- Keyboard navigation support
- Translated accessibility labels

```tsx
// Example of accessibility support
accessibilityLabel={translate('accessibility.confirmSelection', language, { type: selectedType as string })}
accessibilityHint={translate('accessibility.returnsToScreen', language)}
accessibilityRole="button"
accessibilityState={{ disabled: isSubmitting || !selectedType }}
```

## Responsive Design

The component adapts to different screen sizes and orientations:

- Portrait and landscape layouts
- Small, medium, and large screen support
- Adaptive typography and spacing
- Grid layout for landscape mode
- Optimized touch targets for different devices

```tsx
// Example of responsive design
<View
  style={[
    styles.actionButtonsContainer,
    isLandscape && styles.landscapeActionButtons,
  ]}
>
  {/* Button content */}
</View>
```

## Performance Optimization

The component is optimized for performance:

- Memoized components with React.memo
- Optimized rendering with useCallback and useMemo
- Efficient state management
- Lazy loading
- Performance tracking

```tsx
// Example of performance optimization
const sortedIncomeTypes = useMemo(
  () =>
    [...incomeTypes].sort((a, b) => (a.priority || 999) - (b.priority || 999)),
  [incomeTypes],
);
```

## Theming

The component uses the app's theming system to support both light and dark modes:

- Background colors
- Text colors
- Button colors
- Icon colors
- Surface colors
- Error colors

```tsx
// Example of theme integration
const primaryColor = useThemeColor({}, "tint");
const backgroundColor = useThemeColor({}, "background");
const textColor = useThemeColor({}, "text");
```

## Form Validation

The component includes validation to ensure a selection is made before proceeding:

- Disabled confirm button when no selection is made
- Error alerts with haptic feedback
- Visual indication of selected items
- Translated error messages

```tsx
// Example of validation
const validateSelection = (): ValidationResult => {
  if (!selectedType) {
    return {
      isValid: false,
      message: translate("validation.pleaseSelectIncomeType", language),
    };
  }

  return { isValid: true };
};
```

## Navigation

The component handles navigation using Expo Router:

- Back button to return to the previous screen
- Swipe gesture to go back
- Confirmation action to save selection and return
- Bottom navigation tabs for app-wide navigation

```tsx
// Example of navigation
router.back();
```

## Gesture Support

The component includes gesture support:

- Swipe right to go back
- Animated transitions
- Visual feedback for gestures

```tsx
// Example of gesture support
const panResponder = useRef(
  PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dy) < 50;
    },
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dx > 0) {
        swipeAnim.setValue(gestureState.dx);
      }
    },
    // Additional handlers...
  }),
).current;
```

## Example

```tsx
// In AddIncomeScreen.tsx
const handleCategorySelect = () => {
  router.push("/select-income");
};

// Later in the UI
<TouchableOpacity
  style={styles.categorySelector}
  onPress={handleCategorySelect}
>
  <Text>Select Income Type</Text>
</TouchableOpacity>;
```

## Best Practices

When using this component:

1. Ensure Redux is properly set up with the financial slice
2. Handle the selected income type in the receiving screen
3. Provide proper navigation context
4. Test with different screen sizes and accessibility tools
5. Test offline functionality
6. Verify translations in all supported languages
7. Monitor analytics for user behavior and performance issues

## Related Components

- `AddIncomeScreen`: The screen that typically navigates to this component
- `SelectDayScreen`: Similar selection pattern for date selection
- `IncomeTypeOption`: Memoized component for rendering income type options
- `LanguageSelector`: Component for selecting the application language

## Testing

The component includes comprehensive test coverage:

- Unit tests for component rendering
- Tests for user interactions
- Tests for Redux integration
- Tests for offline functionality
- Tests for internationalization
- Tests for accessibility

```tsx
// Example test
it("allows selecting an income type", () => {
  const { getByText } = render(
    <Provider store={store}>
      <SelectIncomeScreen />
    </Provider>,
  );

  fireEvent.press(getByText("Salary"));
  fireEvent.press(getByText("Confirm"));

  // Check if the action was dispatched
  const actions = store.getState().financial.selectedIncomeType;
  expect(actions).toBe("Salary");
});
```
