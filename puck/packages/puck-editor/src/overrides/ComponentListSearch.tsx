import React, { createContext, useContext, useState, type ReactNode } from 'react';
import TextInput from '@commercetools-uikit/text-input';
import {
  useVersionHistoryContext,
  VersionHistorySidebarContent,
} from '@commercetools-demo/puck-version-history';

// ---------------------------------------------------------------------------
// Component search context
// ---------------------------------------------------------------------------

interface ComponentSearchContextValue {
  search: string;
  setSearch: (value: string) => void;
}

export const ComponentSearchContext = createContext<ComponentSearchContextValue>({
  search: '',
  setSearch: () => {},
});

export const ComponentSearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [search, setSearch] = useState('');
  return (
    <ComponentSearchContext.Provider value={{ search, setSearch }}>
      {children}
    </ComponentSearchContext.Provider>
  );
};

// ---------------------------------------------------------------------------
// Tab button — matches Puck's own Inspector/Outline tab style
// ---------------------------------------------------------------------------

const SidebarTab: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    style={{
      flex: 1,
      padding: '8px 12px',
      border: 'none',
      borderBottom: isActive
        ? '2px solid var(--puck-color-azure-07, #1a73e8)'
        : '2px solid transparent',
      background: 'none',
      cursor: 'pointer',
      fontSize: '0.775rem',
      fontWeight: isActive ? 700 : 500,
      color: isActive
        ? 'var(--puck-color-azure-07, #1a73e8)'
        : 'var(--puck-color-grey-07, #374151)',
      transition: 'color 0.12s, border-color 0.12s',
    }}
  >
    {label}
  </button>
);

// ---------------------------------------------------------------------------
// ComponentsPanel override — tabs: "Components" | "History"
//
// CSS trick: Puck's Drawer renders each item as a direct `div` child of the
// `[data-puck-dnd]` container (flex, gap:12px). When an item is hidden we
// inject a `data-hidden-component` span; the `:has()` rule sets that wrapper
// to `display:none` so it's removed from the flex flow entirely.
// ---------------------------------------------------------------------------

export const ComponentsPanel: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { search, setSearch } = useContext(ComponentSearchContext);
  const { isHistoryTabActive, openHistoryTab, closeHistoryTab } = useVersionHistoryContext();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Remove hidden DrawerItem wrappers from the flex layout */}
      <style>{`[data-puck-dnd] > div:has([data-hidden-component]) { display: none !important; }`}</style>

      {/* Tab bar */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--puck-color-grey-04, #e5e7eb)',
          flexShrink: 0,
        }}
      >
        <SidebarTab
          label="Components"
          isActive={!isHistoryTabActive}
          onClick={closeHistoryTab}
        />
        <SidebarTab
          label="History"
          isActive={isHistoryTabActive}
          onClick={openHistoryTab}
        />
      </div>

      {isHistoryTabActive ? (
        /* History tab content */
        <div style={{ flex: 1, padding: '12px', overflowY: 'auto' }}>
          <VersionHistorySidebarContent />
        </div>
      ) : (
        /* Components tab content */
        <>
          {/* Sticky search bar */}
          <div
            style={{
              flexShrink: 0,
              padding: '0',
              margin: '12px 0',
              background: 'var(--puck-color-white, #fff)',
              position: 'sticky',
              top: 0,
              zIndex: 1,
            }}
          >
            <TextInput
              placeholder="Search components…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Scrollable component list */}
          <div style={{ flex: 1, overflowY: 'auto' }}>{children}</div>
        </>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// ComponentItemFilter — hides non-matching items when searching
// ---------------------------------------------------------------------------

export const ComponentItemFilter: React.FC<{ children: ReactNode; name: string }> = ({
  children,
  name,
}) => {
  const { search } = useContext(ComponentSearchContext);
  const isHidden = search.trim() !== '' && !name.toLowerCase().includes(search.toLowerCase());

  if (isHidden) {
    return <span data-hidden-component />;
  }
  return <>{children}</>;
};
