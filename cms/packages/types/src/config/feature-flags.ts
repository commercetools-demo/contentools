// ---------------------------------------------------------------------------
// Feature Flags — canonical shape (stored in Firestore via backoffice)
// ---------------------------------------------------------------------------

export interface FeatureFlags {
  bopis: boolean;
  superuser: boolean;
  quickOrder: boolean;
  [key: string]: boolean;
}

/** Name of a known feature flag. */
export type FeatureFlagName = keyof FeatureFlags & string;
