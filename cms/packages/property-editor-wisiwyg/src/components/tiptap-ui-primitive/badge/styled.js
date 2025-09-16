import styled from 'styled-components';

const badgeColorVars = `
  /* Default colors - Light mode */
  --tt-badge-border-color: var(--tt-gray-light-a-200);
  --tt-badge-border-color-subdued: var(--tt-gray-light-a-200);
  --tt-badge-border-color-emphasized: var(--tt-gray-light-a-600);
  --tt-badge-text-color: var(--tt-gray-light-a-500);
  --tt-badge-text-color-subdued: var(--tt-gray-light-a-400);
  --tt-badge-text-color-emphasized: var(--tt-gray-light-a-600);
  --tt-badge-bg-color: var(--white);
  --tt-badge-bg-color-subdued: var(--white);
  --tt-badge-bg-color-emphasized: var(--white);
  --tt-badge-icon-color: var(--tt-gray-light-a-500);
  --tt-badge-icon-color-subdued: var(--tt-gray-light-a-400);
  --tt-badge-icon-color-emphasized: var(--tt-brand-color-600);

  .dark & {
    --tt-badge-border-color: var(--tt-gray-dark-a-200);
    --tt-badge-border-color-subdued: var(--tt-gray-dark-a-200);
    --tt-badge-border-color-emphasized: var(--tt-gray-dark-a-500);
    --tt-badge-text-color: var(--tt-gray-dark-a-500);
    --tt-badge-text-color-subdued: var(--tt-gray-dark-a-400);
    --tt-badge-text-color-emphasized: var(--tt-gray-dark-a-600);
    --tt-badge-bg-color: var(--black);
    --tt-badge-bg-color-subdued: var(--black);
    --tt-badge-bg-color-emphasized: var(--black);
    --tt-badge-icon-color: var(--tt-gray-dark-a-500);
    --tt-badge-icon-color-subdued: var(--tt-gray-dark-a-400);
    --tt-badge-icon-color-emphasized: var(--tt-brand-color-400);
  }
`;

const ghostVariant = `
  &[data-style="ghost"] {
    --tt-badge-bg-color: transparent;
    --tt-badge-bg-color-subdued: transparent;
    --tt-badge-bg-color-emphasized: transparent;
    
    .dark & {
      --tt-badge-bg-color: transparent;
      --tt-badge-bg-color-subdued: transparent;
      --tt-badge-bg-color-emphasized: transparent;
    }
  }
`;

const grayVariant = `
  &[data-style="gray"] {
    --tt-badge-text-color-emphasized: var(--white);
    --tt-badge-bg-color: var(--tt-gray-light-a-100);
    --tt-badge-bg-color-subdued: var(--tt-gray-light-a-50);
    --tt-badge-bg-color-emphasized: var(--tt-gray-light-a-700);
    --tt-badge-icon-color-emphasized: var(--white);
    
    .dark & {
      --tt-badge-text-color-emphasized: var(--black);
      --tt-badge-bg-color: var(--tt-gray-dark-a-100);
      --tt-badge-bg-color-subdued: var(--tt-gray-dark-a-50);
      --tt-badge-bg-color-emphasized: var(--tt-gray-dark-a-800);
      --tt-badge-icon-color-emphasized: var(--black);
    }
  }
`;

const brandVariant = `
  &[data-style="brand"] {
    --tt-badge-border-color: var(--tt-brand-color-300);
    --tt-badge-border-color-subdued: var(--tt-brand-color-200);
    --tt-badge-border-color-emphasized: var(--tt-brand-color-600);
    --tt-badge-text-color: var(--tt-brand-color-800);
    --tt-badge-text-color-subdued: var(--tt-brand-color-700);
    --tt-badge-text-color-emphasized: var(--tt-brand-color-50);
    --tt-badge-bg-color: var(--tt-brand-color-100);
    --tt-badge-bg-color-subdued: var(--tt-brand-color-50);
    --tt-badge-bg-color-emphasized: var(--tt-brand-color-600);
    --tt-badge-icon-color: var(--tt-brand-color-800);
    --tt-badge-icon-color-subdued: var(--tt-brand-color-700);
    --tt-badge-icon-color-emphasized: var(--tt-brand-color-100);
    
    .dark & {
      --tt-badge-border-color: var(--tt-brand-color-700);
      --tt-badge-border-color-subdued: var(--tt-brand-color-800);
      --tt-badge-border-color-emphasized: var(--tt-brand-color-400);
      --tt-badge-text-color: var(--tt-brand-color-200);
      --tt-badge-text-color-subdued: var(--tt-brand-color-300);
      --tt-badge-text-color-emphasized: var(--tt-brand-color-950);
      --tt-badge-bg-color: var(--tt-brand-color-900);
      --tt-badge-bg-color-subdued: var(--tt-brand-color-950);
      --tt-badge-bg-color-emphasized: var(--tt-brand-color-400);
      --tt-badge-icon-color: var(--tt-brand-color-200);
      --tt-badge-icon-color-subdued: var(--tt-brand-color-300);
      --tt-badge-icon-color-emphasized: var(--tt-brand-color-900);
    }
  }
`;

const colorVariants = `
  &[data-style="green"] {
    --tt-badge-border-color: var(--tt-color-green-inc-2);
    --tt-badge-border-color-subdued: var(--tt-color-green-inc-3);
    --tt-badge-border-color-emphasized: var(--tt-color-green-dec-2);
    --tt-badge-text-color: var(--tt-color-green-dec-3);
    --tt-badge-text-color-subdued: var(--tt-color-green-dec-2);
    --tt-badge-text-color-emphasized: var(--tt-color-green-inc-5);
    --tt-badge-bg-color: var(--tt-color-green-inc-4);
    --tt-badge-bg-color-subdued: var(--tt-color-green-inc-5);
    --tt-badge-bg-color-emphasized: var(--tt-color-green-dec-1);
    --tt-badge-icon-color: var(--tt-color-green-dec-3);
    --tt-badge-icon-color-subdued: var(--tt-color-green-dec-2);
    --tt-badge-icon-color-emphasized: var(--tt-color-green-inc-5);
    
    .dark & {
      --tt-badge-border-color: var(--tt-color-green-dec-2);
      --tt-badge-border-color-subdued: var(--tt-color-green-dec-3);
      --tt-badge-border-color-emphasized: var(--tt-color-green-base);
      --tt-badge-text-color: var(--tt-color-green-inc-3);
      --tt-badge-text-color-subdued: var(--tt-color-green-inc-2);
      --tt-badge-text-color-emphasized: var(--tt-color-green-dec-5);
      --tt-badge-bg-color: var(--tt-color-green-dec-4);
      --tt-badge-bg-color-subdued: var(--tt-color-green-dec-5);
      --tt-badge-bg-color-emphasized: var(--tt-color-green-inc-1);
      --tt-badge-icon-color: var(--tt-color-green-inc-3);
      --tt-badge-icon-color-subdued: var(--tt-color-green-inc-2);
      --tt-badge-icon-color-emphasized: var(--tt-color-green-dec-5);
    }
  }
  
  &[data-style="yellow"] {
    --tt-badge-border-color: var(--tt-color-yellow-inc-2);
    --tt-badge-border-color-subdued: var(--tt-color-yellow-inc-3);
    --tt-badge-border-color-emphasized: var(--tt-color-yellow-dec-1);
    --tt-badge-text-color: var(--tt-color-yellow-dec-3);
    --tt-badge-text-color-subdued: var(--tt-color-yellow-dec-2);
    --tt-badge-text-color-emphasized: var(--tt-color-yellow-dec-3);
    --tt-badge-bg-color: var(--tt-color-yellow-inc-4);
    --tt-badge-bg-color-subdued: var(--tt-color-yellow-inc-5);
    --tt-badge-bg-color-emphasized: var(--tt-color-yellow-base);
    --tt-badge-icon-color: var(--tt-color-yellow-dec-3);
    --tt-badge-icon-color-subdued: var(--tt-color-yellow-dec-2);
    --tt-badge-icon-color-emphasized: var(--tt-color-yellow-dec-3);
    
    .dark & {
      --tt-badge-border-color: var(--tt-color-yellow-dec-2);
      --tt-badge-border-color-subdued: var(--tt-color-yellow-dec-3);
      --tt-badge-border-color-emphasized: var(--tt-color-yellow-inc-1);
      --tt-badge-text-color: var(--tt-color-yellow-inc-3);
      --tt-badge-text-color-subdued: var(--tt-color-yellow-inc-2);
      --tt-badge-text-color-emphasized: var(--tt-color-yellow-dec-3);
      --tt-badge-bg-color: var(--tt-color-yellow-dec-4);
      --tt-badge-bg-color-subdued: var(--tt-color-yellow-dec-5);
      --tt-badge-bg-color-emphasized: var(--tt-color-yellow-base);
      --tt-badge-icon-color: var(--tt-color-yellow-inc-3);
      --tt-badge-icon-color-subdued: var(--tt-color-yellow-inc-2);
      --tt-badge-icon-color-emphasized: var(--tt-color-yellow-dec-3);
    }
  }
  
  &[data-style="red"] {
    --tt-badge-border-color: var(--tt-color-red-inc-2);
    --tt-badge-border-color-subdued: var(--tt-color-red-inc-3);
    --tt-badge-border-color-emphasized: var(--tt-color-red-dec-2);
    --tt-badge-text-color: var(--tt-color-red-dec-3);
    --tt-badge-text-color-subdued: var(--tt-color-red-dec-2);
    --tt-badge-text-color-emphasized: var(--tt-color-red-inc-5);
    --tt-badge-bg-color: var(--tt-color-red-inc-4);
    --tt-badge-bg-color-subdued: var(--tt-color-red-inc-5);
    --tt-badge-bg-color-emphasized: var(--tt-color-red-dec-1);
    --tt-badge-icon-color: var(--tt-color-red-dec-3);
    --tt-badge-icon-color-subdued: var(--tt-color-red-dec-2);
    --tt-badge-icon-color-emphasized: var(--tt-color-red-inc-5);
    
    .dark & {
      --tt-badge-border-color: var(--tt-color-red-dec-2);
      --tt-badge-border-color-subdued: var(--tt-color-red-dec-3);
      --tt-badge-border-color-emphasized: var(--tt-color-red-base);
      --tt-badge-text-color: var(--tt-color-red-inc-3);
      --tt-badge-text-color-subdued: var(--tt-color-red-inc-2);
      --tt-badge-text-color-emphasized: var(--tt-color-red-dec-5);
      --tt-badge-bg-color: var(--tt-color-red-dec-4);
      --tt-badge-bg-color-subdued: var(--tt-color-red-dec-5);
      --tt-badge-bg-color-emphasized: var(--tt-color-red-inc-1);
      --tt-badge-icon-color: var(--tt-color-red-inc-3);
      --tt-badge-icon-color-subdued: var(--tt-color-red-inc-2);
      --tt-badge-icon-color-emphasized: var(--tt-color-red-dec-5);
    }
  }
`;

export const StyledBadge = styled.div`
  ${badgeColorVars}

  font-size: 0.625rem;
  font-weight: 700;
  font-feature-settings: 'salt' on, 'cv01' on;
  line-height: 1.15;
  height: 1.25rem;
  min-width: 1.25rem;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: solid 1px;
  border-radius: var(--tt-radius-sm, 0.375rem);
  transition-property: background, color, opacity;
  transition-duration: var(--tt-transition-duration-default);
  transition-timing-function: var(--tt-transition-easing-default);

  background-color: var(--tt-badge-bg-color);
  border-color: var(--tt-badge-border-color);
  color: var(--tt-badge-text-color);

  &[data-size='large'] {
    font-size: 0.75rem;
    height: 1.5rem;
    min-width: 1.5rem;
    padding: 0.375rem;
    border-radius: var(--tt-radius-md, 0.375rem);
  }

  &[data-size='small'] {
    height: 1rem;
    min-width: 1rem;
    padding: 0.125rem;
    border-radius: var(--tt-radius-xs, 0.25rem);
  }

  .tiptap-badge-text {
    padding: 0 0.125rem;
    flex-grow: 1;
    text-align: left;
  }

  &[data-text-trim='on'] .tiptap-badge-text {
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .tiptap-badge-icon {
    pointer-events: none;
    flex-shrink: 0;
    width: 0.625rem;
    height: 0.625rem;
    color: var(--tt-badge-icon-color);
  }

  &[data-size='large'] .tiptap-badge-icon {
    width: 0.75rem;
    height: 0.75rem;
  }

  &[data-appearance='emphasized'] {
    background-color: var(--tt-badge-bg-color-emphasized);
    border-color: var(--tt-badge-border-color-emphasized);
    color: var(--tt-badge-text-color-emphasized);

    .tiptap-badge-icon {
      color: var(--tt-badge-icon-color-emphasized);
    }
  }

  &[data-appearance='subdued'] {
    background-color: var(--tt-badge-bg-color-subdued);
    border-color: var(--tt-badge-border-color-subdued);
    color: var(--tt-badge-text-color-subdued);

    .tiptap-badge-icon {
      color: var(--tt-badge-icon-color-subdued);
    }
  }

  ${ghostVariant}
  ${grayVariant}
  ${brandVariant}
  ${colorVariants}
`;

export const StyledBadgeGroup = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;

  &[data-orientation='vertical'] {
    flex-direction: column;
  }

  &[data-orientation='horizontal'] {
    flex-direction: row;
  }
`;
