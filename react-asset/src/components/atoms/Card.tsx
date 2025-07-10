import React from 'react';
import styled from 'styled-components';

export interface CardProps {
  header?: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  width?: string;
  height?: string;
}

const StyledCard = styled.div<{ width?: string; height?: string }>`
  width: ${props => props.width || '300px'};
  height: ${props => props.height || '200px'};
  border-radius: 8px;
  border: 1px solid #ddd;
  overflow: hidden;
  transition: all 0.3s;
  cursor: ${props => props.onClick ? 'pointer' : 'default'};
  display: flex;
  flex-direction: column;
  background-color: white;
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const CardHeader = styled.div`
  padding: 1rem;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
`;

const CardContent = styled.div`
  padding: 1rem;
  flex: 1;
  overflow: auto;
`;

export const Card: React.FC<CardProps> = ({ 
  header, 
  children, 
  onClick, 
  className,
  width,
  height,
  ...props 
}) => {
  return (
    <StyledCard 
      onClick={onClick} 
      className={className}
      width={width}
      height={height}
      {...props}
    >
      {header && (
        <CardHeader>
          <CardTitle>{header}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        {children}
      </CardContent>
    </StyledCard>
  );
}; 