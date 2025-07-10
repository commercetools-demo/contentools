import React, { useState } from 'react';
import styled from 'styled-components';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const TabsContainer = styled.div`
  width: 100%;
`;

const TabsList = styled.div<{ variant: TabsProps['variant'] }>`
  display: flex;
  border-bottom: ${props => props.variant === 'underline' ? '2px solid #e1e5e9' : 'none'};
  background-color: ${props => props.variant === 'default' ? '#f8f9fa' : 'transparent'};
  border-radius: ${props => props.variant === 'default' ? '4px 4px 0 0' : '0'};
  gap: ${props => props.variant === 'pills' ? '8px' : '0'};
  padding: ${props => props.variant === 'pills' ? '4px' : '0'};
`;

const getSizeStyles = (size: TabsProps['size']) => {
  switch (size) {
    case 'small':
      return {
        padding: '8px 12px',
        fontSize: '12px'
      };
    case 'large':
      return {
        padding: '16px 24px',
        fontSize: '16px'
      };
    default:
      return {
        padding: '12px 16px',
        fontSize: '14px'
      };
  }
};

const TabButton = styled.button<{
  active: boolean;
  disabled?: boolean;
  variant: TabsProps['variant'];
  size: TabsProps['size'];
}>`
  background: none;
  border: none;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  font-family: inherit;
  font-weight: ${props => props.active ? '600' : '400'};
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  opacity: ${props => props.disabled ? '0.5' : '1'};
  
  ${props => {
    const sizeStyles = getSizeStyles(props.size);
    return `
      padding: ${sizeStyles.padding};
      font-size: ${sizeStyles.fontSize};
    `;
  }}
  
  ${props => {
    switch (props.variant) {
      case 'pills':
        return `
          border-radius: 6px;
          background-color: ${props.active ? '#3498db' : 'transparent'};
          color: ${props.active ? 'white' : '#666'};
          
          &:hover:not(:disabled) {
            background-color: ${props.active ? '#2980b9' : '#f5f5f5'};
          }
        `;
      case 'underline':
        return `
          color: ${props.active ? '#3498db' : '#666'};
          border-bottom: 2px solid ${props.active ? '#3498db' : 'transparent'};
          margin-bottom: -2px;
          
          &:hover:not(:disabled) {
            color: #3498db;
          }
        `;
      default:
        return `
          color: ${props.active ? '#333' : '#666'};
          background-color: ${props.active ? 'white' : 'transparent'};
          border-bottom: ${props.active ? '2px solid white' : '2px solid transparent'};
          margin-bottom: -2px;
          
          &:hover:not(:disabled) {
            background-color: ${props.active ? 'white' : '#e9ecef'};
          }
        `;
    }
  }}
  
  &:focus {
    outline: 2px solid #3498db;
    outline-offset: 2px;
    border-radius: 2px;
  }
`;

const TabBadge = styled.span`
  background-color: #e74c3c;
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 16px;
  text-align: center;
  line-height: 1.2;
`;

const TabContent = styled.div<{ variant: TabsProps['variant'] }>`
  padding: 20px;
  background-color: white;
  border: ${props => props.variant === 'default' ? '1px solid #e1e5e9' : 'none'};
  border-top: none;
  border-radius: ${props => props.variant === 'default' ? '0 0 4px 4px' : '0'};
  min-height: 200px;
`;

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'default',
  size = 'medium',
  className
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(tabs[0]?.id || '');
  const currentActiveTab = activeTab || internalActiveTab;

  const handleTabClick = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab && !tab.disabled) {
      if (!activeTab) {
        setInternalActiveTab(tabId);
      }
      if (onTabChange) {
        onTabChange(tabId);
      }
    }
  };

  const activeTabContent = tabs.find(tab => tab.id === currentActiveTab)?.content;

  return (
    <TabsContainer className={className}>
      <TabsList variant={variant} role="tablist">
        {tabs.map(tab => (
          <TabButton
            key={tab.id}
            active={currentActiveTab === tab.id}
            disabled={tab.disabled}
            variant={variant}
            size={size}
            onClick={() => handleTabClick(tab.id)}
            role="tab"
            aria-selected={currentActiveTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
          >
            {tab.label}
            {tab.badge && (
              <TabBadge aria-label={`${tab.badge} notifications`}>
                {tab.badge}
              </TabBadge>
            )}
          </TabButton>
        ))}
      </TabsList>
      
      <TabContent
        variant={variant}
        role="tabpanel"
        id={`tabpanel-${currentActiveTab}`}
        aria-labelledby={`tab-${currentActiveTab}`}
      >
        {activeTabContent}
      </TabContent>
    </TabsContainer>
  );
}; 