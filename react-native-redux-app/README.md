# React Native Redux Financial App

A comprehensive financial management application built with React Native, Expo, and Redux.

![App Screenshot](./assets/images/app-screenshot.png)

## Features

- **Financial Management**: Track income, expenses, budgets, and savings plans
- **Multi-language Support**: Available in English, Vietnamese, Spanish, and French
- **Offline Capability**: Use the app even without an internet connection
- **Analytics Integration**: Track user behavior and app performance
- **Accessibility**: Full support for screen readers and assistive technologies
- **Responsive Design**: Works on various screen sizes and orientations

## Tech Stack

- **React Native**: Cross-platform mobile framework
- **Expo**: Development platform for React Native
- **Redux Toolkit**: State management
- **TypeScript**: Type-safe JavaScript
- **React Navigation**: Navigation library
- **Reanimated**: Animation library
- **Supabase**: Backend as a Service
- **Jest**: Testing framework

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional for mobile development)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/react-native-redux-app.git
   cd react-native-redux-app
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:

   ```bash
   npm start
   # or
   yarn start
   ```

4. Run on a specific platform:

   ```bash
   # iOS
   npm run ios

   # Android
   npm run android

   # Web
   npm run web
   ```

## Project Structure

```
react-native-redux-app/
├── app/                    # Expo Router app directory
│   ├─��� (tabs)/             # Tab-based navigation
│   ├── _layout.tsx         # Root layout
│   ├── add-income.tsx      # Add income screen
│   ├── select-income.tsx   # Select income type screen
│   └── select-day.tsx      # Date selection screen
├── assets/                 # Static assets
├── components/             # Reusable components
├── constants/              # App constants
├── docs/                   # Documentation
├── hooks/                  # Custom React hooks
├── src/                    # Source code
│   ├── Redux/              # Redux store and slices
│   ├── Screens/            # Screen components
│   ├── Services/           # API services
│   ├── Theme/              # Theme configuration
│   ├── Utils/              # Utility functions
│   └── i18n/               # Internationalization
├── __tests__/              # Test files
└── scripts/                # Build and utility scripts
```

## Key Components

### Financial Management

- **HomeScreen**: Dashboard with financial overview
- **AddIncomeScreen**: Add new income transactions
- **SelectIncomeScreen**: Choose income categories
- **BudgetScreen**: Manage and track budgets
- **PlanScreen**: Create and monitor savings plans

### Core Features

- **Offline Support**: Transactions are stored locally and synced when online
- **Multi-language Support**: UI adapts to user's preferred language
- **Theme Support**: Light and dark mode
- **Analytics**: Track user behavior and app performance
- **Accessibility**: Screen reader support and semantic markup

## Development

### Code Style

This project follows the Airbnb JavaScript Style Guide with some modifications. We use ESLint and Prettier for code formatting.

### Testing

Run tests with:

```bash
npm test
# or
yarn test
```

### Building for Production

```bash
expo build:android
expo build:ios
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
