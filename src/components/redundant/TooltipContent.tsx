import React from 'react';
import Tooltip, { TooltipProps } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

interface TooltipContentProps {
  content: React.ReactNode;
  children: React.ReactNode;
}

// Define styled component for custom Tooltip
const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))`
  & .MuiTooltip-tooltip {
    background-color: #dadada;
    color: #333;
    padding: 8px;
    max-width: 400px;
    border: 0.3px solid #dadada;
    border-radius: 10px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
  & .MuiTooltip-arrow {
    color: #dadada;
    // margin-left: 17px;
    font-size: 20px;
  }
`;

export const TooltipContent: React.FC<TooltipContentProps> = ({
  content,
  children,
}) => {
  return (
    <CustomTooltip title={content} arrow placement='bottom'>
      <span>{children}</span>
    </CustomTooltip>
  );
};

export default TooltipContent;
