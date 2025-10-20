/**
 * Centralized gradient colors configuration
 * Used across gradient border containers and gradient separators
 * 
 * To change gradient colors throughout the entire app, modify these values:
 */

export const GRADIENT_COLORS = {
  from: "#2277ee",
  to: "#5be1fd",
} as const;

export type GradientColors = typeof GRADIENT_COLORS;
