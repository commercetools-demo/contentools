import React, { createContext, useContext, useState, type ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Context
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
// components override — sticky search input + scrollable list
//
// CSS trick: Puck's Drawer renders each item as a direct `div` child of the
// `[data-puck-dnd]` container (flex, gap:12px). When an item is hidden we
// inject a `data-hidden-component` span; the `:has()` rule sets that wrapper
// to `display:none` so it's removed from the flex flow entirely (no gap
// accumulation from invisible items).
// ---------------------------------------------------------------------------

export const ComponentsPanel: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { search, setSearch } = useContext(ComponentSearchContext);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Remove hidden DrawerItem wrappers from the flex layout */}
      <style>{`[data-puck-dnd] > div:has([data-hidden-component]) { display: none !important; }`}</style>

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
        <input
          type="search"
          placeholder="Search components…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '6px 10px',
            borderRadius: '4px',
            border: '1px solid var(--puck-color-grey-08, #d1d5db)',
            background: 'var(--puck-color-white, #fff)',
            fontSize: '13px',
            outline: 'none',
            color: 'inherit',
          }}
        />
      </div>

      {/* Scrollable component list */}
      <div style={{ flex: 1, overflowY: 'auto' }}>{children}</div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// componentItem override — hides non-matching items via a data marker so
// the CSS rule above can remove the wrapper from the flex flow.
// ---------------------------------------------------------------------------

export const ComponentItemFilter: React.FC<{ children: ReactNode; name: string }> = ({
  children,
  name,
}) => {
  const { search } = useContext(ComponentSearchContext);
  const isHidden = search.trim() !== '' && !name.toLowerCase().includes(search.toLowerCase());

  if (isHidden) {
    // Render a zero-size marker; the `:has([data-hidden-component])` CSS rule
    // hides the ancestor DrawerItem wrapper completely (no gap residue).
    return <span data-hidden-component />;
  }
  return <>{children}</>;
};
