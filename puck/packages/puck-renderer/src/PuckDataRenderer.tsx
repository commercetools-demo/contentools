import React from 'react';
import { Render } from '@measured/puck';
import type { Config, Data } from '@measured/puck';
import type { PuckData, PuckConfig } from '@commercetools-demo/puck-types';

export interface PuckDataRendererProps {
  /** The Puck Data to render (from the API or SSR props). */
  data: PuckData;
  /**
   * The Puck Config that defines available components and their render functions.
   * Must match the config used in the editor to ensure consistent output.
   */
  config: PuckConfig;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * SSR-friendly renderer — no data fetching, renders whatever Data you pass in.
 * Wrap with PuckApiProvider only if you use it alongside API hooks.
 */
export const PuckDataRenderer: React.FC<PuckDataRendererProps> = ({
  data,
  config,
  className,
  style,
}) => {
  return (
    <div className={className} style={style}>
      <Render config={config as Config} data={data as Data} />
    </div>
  );
};
