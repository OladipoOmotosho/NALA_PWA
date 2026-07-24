import React from 'react';
import RetaylSwitchBase, { RetaylSwitchProps } from './RetaylSwitchBase';

/**
 * RetaylSwitch - Web toggle switch component
 *
 * Web wrapper for RetaylSwitchBase without haptic feedback.
 * Provides consistent API across platforms.
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 *
 * @example
 * ```tsx
 * <RetaylSwitch
 *   isActive={enabled}
 *   onToggle={setEnabled}
 *   size="md"
 * />
 * ```
 */
const RetaylSwitch: React.FC<RetaylSwitchProps> = (props) => (
  <RetaylSwitchBase {...props} />
);

RetaylSwitch.displayName = 'RetaylSwitch';

export type { RetaylSwitchProps };
export default RetaylSwitch;
