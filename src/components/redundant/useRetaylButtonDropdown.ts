import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions } from 'react-native';
import { calculateDropdownLayout } from './RetaylButton.helpers';

interface UseRetaylButtonDropdownParams {
  dropdownItems: Array<{ label: string; value: string }> | string[];
  dropdownWidth: number | string;
  dropdownPosition: 'auto' | 'left' | 'right' | 'center';
}

/**
 * Manages dropdown state, positioning, and click-outside behavior for RetaylButton
 */
const useRetaylButtonDropdown = ({
  dropdownItems,
  dropdownWidth,
  dropdownPosition,
}: UseRetaylButtonDropdownParams) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownLayout, setDropdownLayout] = useState({
    left: 0,
    width: 0,
    maxContentWidth: 0,
  });
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const windowWidth = Dimensions.get('window').width;
  const isWebEnvironment = typeof document !== 'undefined';

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (!isWebEnvironment) return;
      if (
        buttonRef.current &&
        !(buttonRef.current as unknown as HTMLElement).contains(
          event.target as Node,
        )
      ) {
        setShowDropdown(false);
      }
    },
    [isWebEnvironment],
  );

  useEffect(() => {
    if (!isWebEnvironment) return undefined;
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      setTimeout(() => {
        if (buttonRef.current) {
          const el = buttonRef.current as unknown as HTMLElement;
          const rect = el.getBoundingClientRect();
          setDropdownLayout(
            calculateDropdownLayout({
              buttonLeft: rect.left,
              buttonWidth: rect.width,
              buttonRight: rect.right,
              dropdownItems,
              dropdownWidth,
              dropdownPosition,
              windowWidth,
            }),
          );
        }
      }, 0);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [
    isWebEnvironment,
    showDropdown,
    dropdownItems,
    dropdownWidth,
    dropdownPosition,
    windowWidth,
    handleClickOutside,
  ]);

  const dropdownData = useMemo(
    () =>
      Array.isArray(dropdownItems)
        ? dropdownItems.map((item) =>
            typeof item === 'string'
              ? { label: item, value: item.toLowerCase().replace(' ', '_') }
              : item,
          )
        : [],
    [dropdownItems],
  );

  const toggleDropdown = useCallback(
    () => setShowDropdown((prev) => !prev),
    [],
  );
  const closeDropdown = useCallback(() => setShowDropdown(false), []);

  return {
    showDropdown,
    dropdownLayout,
    buttonRef,
    dropdownRef,
    dropdownData,
    toggleDropdown,
    closeDropdown,
  };
};

export default useRetaylButtonDropdown;
