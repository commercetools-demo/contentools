import React, { useState, useCallback } from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import { Page, ContentItem } from '@commercetools-demo/contentools-types';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import Card from '@commercetools-uikit/card';
import PrimaryButton from '@commercetools-uikit/primary-button';
import styled from 'styled-components';
// import 'react-grid-layout/css/styles.css';
// import 'react-grid-layout/css/default.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface Props {
  page: Page;
  selectedComponentId: string | null;
  onComponentSelect: (componentId: string | null) => void;
  baseURL: string;
  businessUnitKey: string;
  locale: string;
}

const GridContainer = styled.div`
  .react-grid-layout {
    position: relative;
  }
  
  .react-grid-item {
    transition: all 200ms ease;
    transition-property: left, top;
  }
  
  .react-grid-item.cssTransforms {
    transition-property: transform;
  }
  
  .react-grid-item > .react-resizable-handle {
    position: absolute;
    width: 20px;
    height: 20px;
    bottom: 0;
    right: 0;
    background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNiIgaGVpZ2h0PSI2IiB2aWV3Qm94PSIwIDAgNiA2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZG90cyBmaWxsPSIjOTk5IiBkPSJtMTUgMTJjMCAxLjA1LS44NSAyLTIgMnMtMi0uOTUtMi0yIC44NS0yIDItMiAyIC45NSAyIDJ6bTAgNGMwIDEuMDUtLjg1IDItMiAycy0yLS45NS0yLTIgLjg1LTIgMi0yIDIgLjk1IDIgMnoiLz4KPHN2Zz4K') no-repeat;
    background-position: bottom right;
    padding: 0 3px 3px 0;
    background-repeat: no-repeat;
    background-origin: content-box;
    box-sizing: border-box;
    cursor: se-resize;
  }
`;

const ComponentWrapper = styled.div<{ selected: boolean }>`
  width: 100%;
  height: 100%;
  border: 2px solid ${props => props.selected ? '#007acc' : 'transparent'};
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.2s;
  
  &:hover {
    border-color: ${props => props.selected ? '#007acc' : '#e0e0e0'};
  }
`;

const ComponentCard = styled(Card)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 120px;
`;

const EmptyGridMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: white;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  margin: 40px 0;
`;

const GridControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 16px;
  background: white;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
`;

const PagesGridLayout: React.FC<Props> = ({
  page,
  selectedComponentId,
  onComponentSelect,
  baseURL,
  businessUnitKey,
  locale
}) => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState('lg');
  const [compactType, setCompactType] = useState<'vertical' | 'horizontal' | null>('vertical');

  // Convert page layout to react-grid-layout format
  const generateLayout = useCallback((): Layout[] => {
    const layout: Layout[] = [];
    
    page.layout.rows.forEach((row, rowIndex) => {
      row.cells.forEach((cell, cellIndex) => {
        if (cell.componentId) {
          layout.push({
            i: cell.componentId,
            x: cellIndex * 2, // Grid has 12 columns, cells take 2 columns each
            y: rowIndex * 2,
            w: cell.colSpan * 2,
            h: 2,
            minW: 2,
            minH: 2
          });
        }
      });
    });
    
    return layout;
  }, [page.layout]);

  const handleLayoutChange = useCallback((newLayout: Layout[]) => {
    // Update page layout based on new grid layout
    // This would need to be implemented to update the page state
    console.log('Layout changed:', newLayout);
  }, []);

  const handleBreakpointChange = useCallback((breakpoint: string) => {
    setCurrentBreakpoint(breakpoint);
  }, []);

  const renderComponent = (component: ContentItem) => {
    const isSelected = selectedComponentId === component.id;
    
    return (
      <ComponentWrapper
        key={component.id}
        selected={isSelected}
        onClick={() => onComponentSelect(component.id)}
      >
        <ComponentCard>
          <Spacings.Stack scale="s">
            <Text.Subheadline as="h4">{component.name}</Text.Subheadline>
            <Text.Detail tone="secondary">Type: {component.type}</Text.Detail>
            {component.properties && Object.keys(component.properties).length > 0 && (
              <Text.Detail tone="secondary">
                {Object.keys(component.properties).length} properties
              </Text.Detail>
            )}
          </Spacings.Stack>
        </ComponentCard>
      </ComponentWrapper>
    );
  };

  const layouts = {
    lg: generateLayout(),
    md: generateLayout(),
    sm: generateLayout(),
    xs: generateLayout(),
    xxs: generateLayout()
  };

  if (!page.components || page.components.length === 0) {
    return (
      <>
        <GridControls>
          <Text.Subheadline as="h3">Page Layout</Text.Subheadline>
          <Text.Detail tone="secondary">
            No components yet. Add components from the sidebar.
          </Text.Detail>
        </GridControls>
        
        <EmptyGridMessage>
          <Spacings.Stack scale="m">
            <Text.Headline as="h3">Empty Page</Text.Headline>
            <Text.Body tone="secondary">
              This page doesn't have any components yet. Use the component library 
              to add your first component.
            </Text.Body>
            <PrimaryButton
              label="Open Component Library"
              onClick={() => onComponentSelect(null)}
            />
          </Spacings.Stack>
        </EmptyGridMessage>
      </>
    );
  }

  return (
    <>
      <GridControls>
        <div>
          <Text.Subheadline as="h3">Page Layout</Text.Subheadline>
          <Text.Detail tone="secondary">
            Breakpoint: {currentBreakpoint} | Components: {page.components.length}
          </Text.Detail>
        </div>
        
        <div>
          <label>
            Compact Type:
            <select 
              value={compactType || 'none'} 
              onChange={(e) => setCompactType(e.target.value === 'none' ? null : e.target.value as any)}
              style={{ marginLeft: '8px' }}
            >
              <option value="none">None</option>
              <option value="vertical">Vertical</option>
              <option value="horizontal">Horizontal</option>
            </select>
          </label>
        </div>
      </GridControls>

      <GridContainer>
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          onLayoutChange={handleLayoutChange}
          onBreakpointChange={handleBreakpointChange}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={60}
          isDraggable={true}
          isResizable={true}
          compactType={compactType}
          preventCollision={false}
          margin={[16, 16]}
          containerPadding={[0, 0]}
        >
          {page.components.map(component => renderComponent(component))}
        </ResponsiveGridLayout>
      </GridContainer>
    </>
  );
};

export default PagesGridLayout;
