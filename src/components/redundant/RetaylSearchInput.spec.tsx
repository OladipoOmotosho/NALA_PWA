import React from 'react';
import { StyleSheet } from 'react-native';
import { render, fireEvent, act } from '@testing-library/react-native';
import * as fc from 'fast-check';
import { opacity } from '@retayl/utils';
import { RetaylSearchInput } from './RetaylSearchInput';

// Mock timers for debounce tests
jest.useFakeTimers();

afterAll(() => {
  jest.useRealTimers();
});

describe('RetaylSearchInput Property-Based Tests', () => {
  describe('Property 2: Clear button visibility', () => {
    it('should display clear button for any non-empty input value', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }),
          (inputValue) => {
            const mockOnChangeText = jest.fn();
            const { queryByLabelText } = render(
              <RetaylSearchInput
                value={inputValue}
                onChangeText={mockOnChangeText}
                showClearButton={true}
              />,
            );

            const clearButton = queryByLabelText('Clear search');
            expect(clearButton).toBeTruthy();
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should not display clear button for empty input value', () => {
      const mockOnChangeText = jest.fn();
      const { queryByLabelText } = render(
        <RetaylSearchInput
          value=''
          onChangeText={mockOnChangeText}
          showClearButton={true}
        />,
      );

      const clearButton = queryByLabelText('Clear search');
      expect(clearButton).toBeNull();
    });

    it('should not display clear button when showClearButton is false', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 0, maxLength: 100 }),
          (inputValue) => {
            const mockOnChangeText = jest.fn();
            const { queryByLabelText } = render(
              <RetaylSearchInput
                value={inputValue}
                onChangeText={mockOnChangeText}
                showClearButton={false}
              />,
            );

            // Property: Clear button should never be visible when showClearButton is false
            const clearButton = queryByLabelText('Clear search');
            expect(clearButton).toBeNull();
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should hide clear button when loading indicator is shown', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }),
          (inputValue) => {
            const mockOnChangeText = jest.fn();
            const { queryByLabelText } = render(
              <RetaylSearchInput
                value={inputValue}
                onChangeText={mockOnChangeText}
                showClearButton={true}
                isLoading={true}
              />,
            );

            // Property: Clear button should not be visible when loading
            const clearButton = queryByLabelText('Clear search');
            expect(clearButton).toBeNull();
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should clear input value when clear button is pressed', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }),
          (inputValue) => {
            const mockOnChangeText = jest.fn();
            const { getByLabelText } = render(
              <RetaylSearchInput
                value={inputValue}
                onChangeText={mockOnChangeText}
                showClearButton={true}
              />,
            );

            const clearButton = getByLabelText('Clear search');
            fireEvent.press(clearButton);

            expect(mockOnChangeText).toHaveBeenCalledWith('');
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should show clear button immediately after typing any character', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1, maxLength: 1 }), (character) => {
          const mockOnChangeText = jest.fn();
          const { queryByLabelText, rerender } = render(
            <RetaylSearchInput
              value=''
              onChangeText={mockOnChangeText}
              showClearButton={true}
            />,
          );

          expect(queryByLabelText('Clear search')).toBeNull();

          rerender(
            <RetaylSearchInput
              value={character}
              onChangeText={mockOnChangeText}
              showClearButton={true}
            />,
          );

          const clearButton = queryByLabelText('Clear search');
          expect(clearButton).toBeTruthy();
        }),
        { numRuns: 100 },
      );
    });

    it('should hide clear button immediately after clearing input', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }),
          (inputValue) => {
            const mockOnChangeText = jest.fn();
            const { queryByLabelText, rerender } = render(
              <RetaylSearchInput
                value={inputValue}
                onChangeText={mockOnChangeText}
                showClearButton={true}
              />,
            );

            // Clear button should be visible
            expect(queryByLabelText('Clear search')).toBeTruthy();

            // Clear the input
            rerender(
              <RetaylSearchInput
                value=''
                onChangeText={mockOnChangeText}
                showClearButton={true}
              />,
            );

            // Property: Clear button should disappear immediately
            expect(queryByLabelText('Clear search')).toBeNull();
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should handle whitespace-only input correctly', () => {
      fc.assert(
        fc.property(
          fc
            .array(fc.constantFrom(' ', '\t', '\n'), {
              minLength: 1,
              maxLength: 10,
            })
            .map((chars) => chars.join('')),
          (whitespaceInput) => {
            const mockOnChangeText = jest.fn();
            const { queryByLabelText } = render(
              <RetaylSearchInput
                value={whitespaceInput}
                onChangeText={mockOnChangeText}
                showClearButton={true}
              />,
            );

            // Property: Clear button should be visible even for whitespace-only input
            // (component doesn't trim, so any non-empty string shows clear button)
            const clearButton = queryByLabelText('Clear search');
            expect(clearButton).toBeTruthy();
          },
        ),
        { numRuns: 100 },
      );
    });
  });

  describe('Property 3: Disabled state behavior', () => {
    it('should not allow text input when disabled', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          (_inputText) => {
            const mockOnChangeText = jest.fn();
            const { getByLabelText } = render(
              <RetaylSearchInput
                value=''
                onChangeText={mockOnChangeText}
                disabled={true}
              />,
            );

            const input = getByLabelText('Search input');
            expect(input.props.editable).toBe(false);
          },
        ),
        { numRuns: 50 },
      );
    });

    it('should apply reduced opacity when disabled', () => {
      const mockOnChangeText = jest.fn();
      const { getByTestId } = render(
        <RetaylSearchInput
          value=''
          onChangeText={mockOnChangeText}
          disabled={true}
        />,
      );

      const container = getByTestId('search-input-container');
      const containerStyle = StyleSheet.flatten(container.props.style);
      // The container should have reduced opacity when disabled
      expect(containerStyle.opacity).toBe(opacity.disabled);
    });

    it('should remain interactive when not disabled', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          (_inputText) => {
            const mockOnChangeText = jest.fn();
            const { getByLabelText } = render(
              <RetaylSearchInput
                value=''
                onChangeText={mockOnChangeText}
                disabled={false}
              />,
            );

            const input = getByLabelText('Search input');
            expect(input.props.editable).toBe(true);
          },
        ),
        { numRuns: 50 },
      );
    });
  });

  describe('Property 4: Search icon and loading indicator rendering', () => {
    it('should show loading indicator when isLoading is true', () => {
      const mockOnChangeText = jest.fn();
      const { queryByTestId } = render(
        <RetaylSearchInput
          value=''
          onChangeText={mockOnChangeText}
          isLoading={true}
        />,
      );

      // ActivityIndicator should be rendered when loading
      const loadingIndicator = queryByTestId('loading-indicator');
      expect(loadingIndicator).toBeTruthy();
    });

    it('should not show loading indicator when isLoading is false', () => {
      const mockOnChangeText = jest.fn();
      const { queryByTestId } = render(
        <RetaylSearchInput
          value=''
          onChangeText={mockOnChangeText}
          isLoading={false}
        />,
      );

      const loadingIndicator = queryByTestId('loading-indicator');
      expect(loadingIndicator).toBeNull();
    });

    it('should toggle between search icon and loading indicator based on isLoading prop', () => {
      const mockOnChangeText = jest.fn();
      const { queryByTestId, rerender } = render(
        <RetaylSearchInput
          value=''
          onChangeText={mockOnChangeText}
          isLoading={false}
        />,
      );

      // Initially no loading indicator
      expect(queryByTestId('loading-indicator')).toBeNull();

      // Enable loading
      rerender(
        <RetaylSearchInput
          value=''
          onChangeText={mockOnChangeText}
          isLoading={true}
        />,
      );

      expect(queryByTestId('loading-indicator')).toBeTruthy();

      // Disable loading
      rerender(
        <RetaylSearchInput
          value=''
          onChangeText={mockOnChangeText}
          isLoading={false}
        />,
      );

      expect(queryByTestId('loading-indicator')).toBeNull();
    });
  });

  describe('Property 5: Input value changes and onChangeText callback behavior', () => {
    it('should call onChangeText with the input value when no debounce', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }),
          (inputText) => {
            const mockOnChangeText = jest.fn();
            const { getByLabelText } = render(
              <RetaylSearchInput
                value=''
                onChangeText={mockOnChangeText}
                debounceMs={0}
              />,
            );

            const input = getByLabelText('Search input');
            fireEvent.changeText(input, inputText);

            expect(mockOnChangeText).toHaveBeenCalledWith(inputText);
            expect(mockOnChangeText).toHaveBeenCalledTimes(1);
          },
        ),
        { numRuns: 50 },
      );
    });

    it('should preserve input value exactly as typed', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }),
          (inputText) => {
            const mockOnChangeText = jest.fn();
            const { getByLabelText } = render(
              <RetaylSearchInput
                value=''
                onChangeText={mockOnChangeText}
                debounceMs={0}
              />,
            );

            const input = getByLabelText('Search input');
            fireEvent.changeText(input, inputText);

            // The callback should receive the exact input
            expect(mockOnChangeText).toHaveBeenCalledWith(inputText);
          },
        ),
        { numRuns: 50 },
      );
    });

    it('should handle special characters in input', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.constantFrom('!', '@', '#', '$', '%', '^', '&', '*', '(', ')'),
          (baseText, specialChar) => {
            const inputText = baseText + specialChar;
            const mockOnChangeText = jest.fn();
            const { getByLabelText } = render(
              <RetaylSearchInput
                value=''
                onChangeText={mockOnChangeText}
                debounceMs={0}
              />,
            );

            const input = getByLabelText('Search input');
            fireEvent.changeText(input, inputText);

            expect(mockOnChangeText).toHaveBeenCalledWith(inputText);
          },
        ),
        { numRuns: 50 },
      );
    });

    it('should sync internal value with external value prop changes', () => {
      const mockOnChangeText = jest.fn();
      const { getByLabelText, rerender } = render(
        <RetaylSearchInput value='initial' onChangeText={mockOnChangeText} />,
      );

      const input = getByLabelText('Search input');
      expect(input.props.value).toBe('initial');

      rerender(
        <RetaylSearchInput value='updated' onChangeText={mockOnChangeText} />,
      );

      expect(input.props.value).toBe('updated');
    });
  });

  describe('Property 6: Debounce functionality', () => {
    beforeEach(() => {
      jest.clearAllTimers();
    });

    it('should debounce onChangeText calls when debounceMs is set', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 100, max: 1000 }),
          fc.string({ minLength: 1, maxLength: 50 }),
          (debounceMs, inputText) => {
            const mockOnChangeText = jest.fn();
            const { getByLabelText } = render(
              <RetaylSearchInput
                value=''
                onChangeText={mockOnChangeText}
                debounceMs={debounceMs}
              />,
            );

            const input = getByLabelText('Search input');
            fireEvent.changeText(input, inputText);

            // Should not be called immediately
            expect(mockOnChangeText).not.toHaveBeenCalled();

            // Fast-forward time
            act(() => {
              jest.advanceTimersByTime(debounceMs);
            });

            // Should be called after debounce
            expect(mockOnChangeText).toHaveBeenCalledWith(inputText);
            expect(mockOnChangeText).toHaveBeenCalledTimes(1);
          },
        ),
        { numRuns: 20 },
      );
    });

    it('should cancel previous debounce when new input arrives', () => {
      const mockOnChangeText = jest.fn();
      const debounceMs = 300;
      const { getByLabelText } = render(
        <RetaylSearchInput
          value=''
          onChangeText={mockOnChangeText}
          debounceMs={debounceMs}
        />,
      );

      const input = getByLabelText('Search input');

      // Type first value
      fireEvent.changeText(input, 'first');

      // Wait half the debounce time
      act(() => {
        jest.advanceTimersByTime(150);
      });

      // Type second value before debounce completes
      fireEvent.changeText(input, 'second');

      // Complete the debounce for first input (should be cancelled)
      act(() => {
        jest.advanceTimersByTime(150);
      });

      // First callback should not have been called
      expect(mockOnChangeText).not.toHaveBeenCalledWith('first');

      // Complete debounce for second input
      act(() => {
        jest.advanceTimersByTime(150);
      });

      // Only second value should be called
      expect(mockOnChangeText).toHaveBeenCalledWith('second');
      expect(mockOnChangeText).toHaveBeenCalledTimes(1);
    });

    it('should call onChangeText immediately when debounceMs is 0', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1, maxLength: 50 }), (inputText) => {
          const mockOnChangeText = jest.fn();
          const { getByLabelText } = render(
            <RetaylSearchInput
              value=''
              onChangeText={mockOnChangeText}
              debounceMs={0}
            />,
          );

          const input = getByLabelText('Search input');
          fireEvent.changeText(input, inputText);

          // Should be called immediately without waiting
          expect(mockOnChangeText).toHaveBeenCalledWith(inputText);
        }),
        { numRuns: 50 },
      );
    });
  });

  describe('Property 7: Accessibility', () => {
    it('should have correct accessibility role', () => {
      const mockOnChangeText = jest.fn();
      const { getByLabelText } = render(
        <RetaylSearchInput value='' onChangeText={mockOnChangeText} />,
      );

      const input = getByLabelText('Search input');
      expect(input.props.accessibilityRole).toBe('search');
    });

    it('should have accessible clear button', () => {
      const mockOnChangeText = jest.fn();
      const { getByLabelText } = render(
        <RetaylSearchInput
          value='test'
          onChangeText={mockOnChangeText}
          showClearButton={true}
        />,
      );

      const clearButton = getByLabelText('Clear search');
      expect(clearButton.props.accessibilityRole).toBe('button');
    });
  });

  describe('Property 8: Placeholder behavior', () => {
    it('should display custom placeholder text', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          (placeholderText) => {
            const mockOnChangeText = jest.fn();
            const { getByLabelText } = render(
              <RetaylSearchInput
                value=''
                onChangeText={mockOnChangeText}
                placeholder={placeholderText}
              />,
            );

            const input = getByLabelText('Search input');
            expect(input.props.placeholder).toBe(placeholderText);
          },
        ),
        { numRuns: 50 },
      );
    });

    it('should use default placeholder when not specified', () => {
      const mockOnChangeText = jest.fn();
      const { getByLabelText } = render(
        <RetaylSearchInput value='' onChangeText={mockOnChangeText} />,
      );

      const input = getByLabelText('Search input');
      expect(input.props.placeholder).toBe('Search...');
    });
  });
});
