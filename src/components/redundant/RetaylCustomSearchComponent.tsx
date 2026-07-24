import React from 'react';
import { FONTFAMILY } from '@retayl/fonts';
import { CloseIcon } from '@retayl/icons';

interface RetaylCustomSearchComponentProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  width?: string;
  height?: string;
  borderColor?: string;
  borderWidth?: string;
  borderRadius?: string;
  maxWidth?: string;
  isDynamicWidth?: boolean;
  minWidth?: string; // Minimum width for dynamic sizing
}

const RetaylCustomSearchComponent: React.FC<
  RetaylCustomSearchComponentProps
> = ({
  placeholder = 'Search',
  value,
  onChange,
  leftIcon,
  rightIcon,
  width = 'auto',
  height = '40px',
  borderColor = '#ccc',
  borderWidth = '1px',
  borderRadius = '4px',
  maxWidth = '100%',
  isDynamicWidth = false,
  minWidth = '200px',
}) => {
  const widthStyle = isDynamicWidth
    ? { width: '100%', minWidth, maxWidth }
    : { width, maxWidth };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: `${borderWidth} solid ${borderColor}`,
        borderRadius,
        height,
        padding: '12px 16px',
        ...widthStyle,
      }}
    >
      <div className='flex flex-row justify-start items-center gap-2'>
        <div>{leftIcon && leftIcon}</div>
        <input
          id='search'
          type='text'
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            maxWidth: isDynamicWidth ? '100%' : maxWidth,
            fontFamily: FONTFAMILY.light,
          }}
        />
      </div>
      {value ? (
        <button
          onClick={() => onChange('')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            marginLeft: '8px',
            fontSize: '16px',
            color: borderColor,
          }}
        >
          <CloseIcon />
        </button>
      ) : (
        <div>{rightIcon && rightIcon}</div>
      )}
    </div>
  );
};

export default RetaylCustomSearchComponent;
