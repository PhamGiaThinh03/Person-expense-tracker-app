/**
 * Analytics utility for tracking user interactions and app performance
 *
 * This module provides functions for tracking events, screen views, and performance metrics.
 * It's designed to be platform-agnostic and can be configured to use different analytics providers.
 */

// Types of events that can be tracked
export enum EventType {
  SCREEN_VIEW = "screen_view",
  USER_ACTION = "user_action",
  FORM_SUBMIT = "form_submit",
  ERROR = "error",
  PERFORMANCE = "performance",
  NETWORK = "network",
}

// Properties that can be included with events
export interface EventProperties {
  [key: string]: string | number | boolean | null | undefined;
}

// Configuration for analytics providers
interface AnalyticsConfig {
  enabled: boolean;
  userId?: string;
  userProperties?: Record<string, string | number | boolean>;
  providers: {
    firebase?: boolean;
    amplitude?: boolean;
    mixpanel?: boolean;
    custom?: boolean;
  };
}

// Default configuration
const defaultConfig: AnalyticsConfig = {
  enabled: true,
  providers: {
    firebase: true,
    amplitude: false,
    mixpanel: false,
    custom: false,
  },
};

// Current configuration
let config: AnalyticsConfig = { ...defaultConfig };

/**
 * Initialize the analytics module with the provided configuration
 *
 * @param customConfig Configuration options
 */
export function initAnalytics(customConfig?: Partial<AnalyticsConfig>): void {
  config = { ...defaultConfig, ...customConfig };

  // Log initialization
  if (config.enabled) {
    console.log("Analytics initialized with config:", config);
  }
}

/**
 * Set the user ID for analytics tracking
 *
 * @param userId The user's unique identifier
 */
export function setUserId(userId: string): void {
  if (!config.enabled) return;

  config.userId = userId;

  // Implementation for different providers would go here
  console.log(`Analytics: Set user ID to ${userId}`);
}

/**
 * Set user properties for analytics tracking
 *
 * @param properties User properties to set
 */
export function setUserProperties(
  properties: Record<string, string | number | boolean>,
): void {
  if (!config.enabled) return;

  config.userProperties = { ...config.userProperties, ...properties };

  // Implementation for different providers would go here
  console.log("Analytics: Set user properties", properties);
}

/**
 * Track an event
 *
 * @param eventType The type of event
 * @param eventName The name of the event
 * @param properties Additional properties for the event
 */
export function trackEvent(
  eventType: EventType,
  eventName: string,
  properties?: EventProperties,
): void {
  if (!config.enabled) return;

  const eventData = {
    type: eventType,
    name: eventName,
    properties: properties || {},
    timestamp: new Date().toISOString(),
    userId: config.userId,
  };

  // Implementation for different providers would go here
  console.log("Analytics: Track event", eventData);
}

/**
 * Track a screen view
 *
 * @param screenName The name of the screen
 * @param properties Additional properties for the screen view
 */
export function trackScreenView(
  screenName: string,
  properties?: EventProperties,
): void {
  trackEvent(EventType.SCREEN_VIEW, screenName, properties);
}

/**
 * Track a user action
 *
 * @param actionName The name of the action
 * @param properties Additional properties for the action
 */
export function trackUserAction(
  actionName: string,
  properties?: EventProperties,
): void {
  trackEvent(EventType.USER_ACTION, actionName, properties);
}

/**
 * Track a form submission
 *
 * @param formName The name of the form
 * @param properties Additional properties for the form submission
 */
export function trackFormSubmit(
  formName: string,
  properties?: EventProperties,
): void {
  trackEvent(EventType.FORM_SUBMIT, formName, properties);
}

/**
 * Track an error
 *
 * @param errorName The name or type of the error
 * @param properties Additional properties for the error
 */
export function trackError(
  errorName: string,
  properties?: EventProperties,
): void {
  trackEvent(EventType.ERROR, errorName, properties);
}

/**
 * Track a performance metric
 *
 * @param metricName The name of the metric
 * @param durationMs The duration in milliseconds
 * @param properties Additional properties for the metric
 */
export function trackPerformance(
  metricName: string,
  durationMs: number,
  properties?: EventProperties,
): void {
  trackEvent(EventType.PERFORMANCE, metricName, {
    duration_ms: durationMs,
    ...properties,
  });
}

/**
 * Track a network request
 *
 * @param requestName The name or endpoint of the request
 * @param properties Additional properties for the request
 */
export function trackNetworkRequest(
  requestName: string,
  properties?: EventProperties & {
    status?: number;
    success?: boolean;
    duration_ms?: number;
    error?: string;
  },
): void {
  trackEvent(EventType.NETWORK, requestName, properties);
}

/**
 * Create a performance timer that can be used to track the duration of an operation
 *
 * @param metricName The name of the metric to track
 * @returns An object with a stop method that stops the timer and tracks the performance
 */
export function startPerformanceTimer(metricName: string) {
  const startTime = performance.now();

  return {
    stop: (properties?: EventProperties) => {
      const endTime = performance.now();
      const durationMs = Math.round(endTime - startTime);
      trackPerformance(metricName, durationMs, properties);
      return durationMs;
    },
  };
}

/**
 * Disable analytics tracking
 */
export function disableAnalytics(): void {
  config.enabled = false;
  console.log("Analytics disabled");
}

/**
 * Enable analytics tracking
 */
export function enableAnalytics(): void {
  config.enabled = true;
  console.log("Analytics enabled");
}

/**
 * Check if analytics tracking is enabled
 *
 * @returns Whether analytics tracking is enabled
 */
export function isAnalyticsEnabled(): boolean {
  return config.enabled;
}
