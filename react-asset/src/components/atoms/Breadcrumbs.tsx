import React from 'react';
import styled from 'styled-components';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: string;
  className?: string;
}

const BreadcrumbContainer = styled.nav`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  font-size: 14px;
  color: #666;
`;

const BreadcrumbItem = styled.span<{ isLast: boolean; isClickable: boolean }>`
  color: ${props => props.isLast ? '#333' : '#666'};
  font-weight: ${props => props.isLast ? '600' : 'normal'};
  cursor: ${props => props.isClickable ? 'pointer' : 'default'};
  text-decoration: none;
  
  &:hover {
    color: ${props => props.isClickable ? '#3498db' : 'inherit'};
    text-decoration: ${props => props.isClickable ? 'underline' : 'none'};
  }
  
  &:focus {
    outline: 2px solid #3498db;
    outline-offset: 2px;
    border-radius: 2px;
  }
`;

const Separator = styled.span`
  margin: 0 8px;
  color: #999;
  user-select: none;
`;

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ 
  items, 
  separator = '/',
  className 
}) => {
  const handleItemClick = (item: BreadcrumbItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      window.location.href = item.href;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, item: BreadcrumbItem) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleItemClick(item);
    }
  };

  return (
    <BreadcrumbContainer className={className} aria-label="Breadcrumb navigation">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isClickable = !isLast && (!!item.onClick || !!item.href);

        return (
          <React.Fragment key={index}>
            <BreadcrumbItem
              isLast={isLast}
              isClickable={isClickable}
              onClick={isClickable ? () => handleItemClick(item) : undefined}
              onKeyDown={isClickable ? (e) => handleKeyDown(e, item) : undefined}
              tabIndex={isClickable ? 0 : -1}
              role={isClickable ? 'button' : undefined}
              aria-current={isLast ? 'page' : undefined}
            >
              {item.label}
            </BreadcrumbItem>
            {!isLast && <Separator>{separator}</Separator>}
          </React.Fragment>
        );
      })}
    </BreadcrumbContainer>
  );
}; 