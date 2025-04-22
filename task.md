# Content Versioning and Publishing States Implementation Plan

## Overview
This document outlines the implementation plan for adding versioning capabilities and publishing states (draft/published) to content items and pages in the CMS.

## Features
1. Version History (usecase1)
   - Store up to 5 recent versions per content item/page (configurable via .env)
   - Show version history in a sidebar
   - Allow reverting to previous versions
   - Display changes (delta) between versions

2. Publishing States (usecase2)
   - Support draft and published states for content items and pages
   - Show appropriate UI for current state
   - Provide publish and revert functionality
   - Default to showing draft when available, published otherwise

## Implementation Tasks

### 1. Backend Changes

#### 1.1 Data Models
- Extend ContentItem and Page interfaces to include:
  ```typescript
  interface VersionInfo {
    id: string;
    timestamp: string;
    author?: string;
    delta?: Record<string, any>; // Changes from previous version
    summary?: string; // Short description of changes
  }

  interface StateInfo {
    draft?: ContentItem | Page;
    published?: ContentItem | Page;
  }

  // Extended ContentItem interface
  interface ContentItem {
    // Existing fields...
    id: string;
    type: string;
    key: string;
    businessUnitKey: string;
    name: string;
    properties: Record<string, any>;
    
    // New fields:
    currentState: 'draft' | 'published' | 'both';
  }

  // Separate storage for versions and states
  interface ContentItemVersions {
    key: string; // Same as ContentItem key
    businessUnitKey: string;
    versions: VersionInfo[];
  }

  interface ContentItemStates {
    key: string; // Same as ContentItem key
    businessUnitKey: string;
    states: StateInfo;
  }
  ```
- Similar extensions for the Page interface

#### 1.2 Environment Configuration
- Add to service/.env:
  ```
  MAX_VERSIONS=5
  ```

#### 1.3 API Endpoints
Create new API endpoints in the service layer:

**Content Item Versions:**
- `GET /api/{businessUnitKey}/content-items/{key}/versions` - List versions
- `POST /api/{businessUnitKey}/content-items/{key}/versions` - Save new version
- `GET /api/{businessUnitKey}/content-items/{key}/versions/{versionId}` - Get specific version

**Content Item States:**
- `GET /api/{businessUnitKey}/content-items/{key}/states` - Get states
- `PUT /api/{businessUnitKey}/content-items/{key}/states/draft` - Save draft
- `PUT /api/{businessUnitKey}/content-items/{key}/states/published` - Publish
- `DELETE /api/{businessUnitKey}/content-items/{key}/states/draft` - Delete draft (revert)

**Pages Versions:**
- `GET /api/{businessUnitKey}/pages/{key}/versions` - List versions
- `POST /api/{businessUnitKey}/pages/{key}/versions` - Save new version
- `GET /api/{businessUnitKey}/pages/{key}/versions/{versionId}` - Get specific version

**Pages States:**
- `GET /api/{businessUnitKey}/pages/{key}/states` - Get states
- `PUT /api/{businessUnitKey}/pages/{key}/states/draft` - Save draft
- `PUT /api/{businessUnitKey}/pages/{key}/states/published` - Publish
- `DELETE /api/{businessUnitKey}/pages/{key}/states/draft` - Delete draft (revert)

#### 1.4 Service Implementation
- Create new routes:
  - `content-item-version.route.ts`
  - `content-item-state.route.ts`
  - `page-version.route.ts`
  - `page-state.route.ts`

for each of the routes, use `CustomObjectController` to create the controller.
for each of the controllers, use a new container to instantiate the controller. Add the container to .env file.
- Add routes to service.route.ts

### 2. Frontend Changes

#### 2.1 Redux Store Updates

**New Slices:**
- Create new slices in store:
  - `version.slice.ts` - Handle version management
  - `state.slice.ts` - Handle state management

**Content Item Slice Updates:**
- Update `content-item.slice.ts`:
  - Add state management actions:
    - `saveDraft`
    - `publish`
    - `revertToCurrent`
  - Add version management actions:
    - `fetchVersions`
    - `saveVersion`
    - `applyVersion`

**Pages Slice Updates:**
- Update `pages.slice.ts` with similar actions

#### 2.2 API Client Updates
- Extend `api.ts` with new endpoints:
  ```typescript
  // Version management
  export async function fetchVersionsEndpoint<T>(baseURL: string, contentType: 'pages' | 'content-items', key: string): Promise<ApiResponse<T>[]> {
    return fetchApi<T[]>(`${baseURL}/${contentType}/${key}/versions`);
  }

  export async function saveVersionEndpoint<T>(baseURL: string, contentType: 'pages' | 'content-items', key: string, data: T): Promise<ApiResponse<T>> {
    return fetchApi<T>(`${baseURL}/${contentType}/${key}/versions`, {
      method: 'POST',
      body: JSON.stringify({ value: data }),
    });
  }

  // State management
  export async function getStatesEndpoint<T>(baseURL: string, contentType: 'pages' | 'content-items', key: string): Promise<ApiResponse<T>> {
    return fetchApi<T>(`${baseURL}/${contentType}/${key}/states`);
  }

  export async function saveDraftEndpoint<T>(baseURL: string, contentType: 'pages' | 'content-items', key: string, data: T): Promise<ApiResponse<T>> {
    return fetchApi<T>(`${baseURL}/${contentType}/${key}/states/draft`, {
      method: 'PUT',
      body: JSON.stringify({ value: data }),
    });
  }

  export async function publishEndpoint<T>(baseURL: string, contentType: 'pages' | 'content-items', key: string, data: T): Promise<ApiResponse<T>> {
    return fetchApi<T>(`${baseURL}/${contentType}/${key}/states/published`, {
      method: 'PUT',
      body: JSON.stringify({ value: data }),
    });
  }

  export async function revertDraftEndpoint(baseURL: string, contentType: 'pages' | 'content-items', key: string): Promise<void> {
    return fetchApi(`${baseURL}/${contentType}/${key}/states/draft`, {
      method: 'DELETE',
    });
  }
  ```

#### 2.3 New UI Components
- Create new components:

**Version History Components:**
```typescript
// assets/src/components/molecules/version-history-sidebar.ts
@customElement('version-history-sidebar')
export class VersionHistorySidebar extends LitElement {
  @property({ type: Array })
  versions: VersionInfo[] = [];

  @property({ type: String })
  selectedVersionId: string | null = null;

  render() {
    return html`
      <div class="version-sidebar">
        <h3>Version History</h3>
        <div class="version-list">
          ${this.versions.map(version => html`
            <div 
              class="version-item ${this.selectedVersionId === version.id ? 'selected' : ''}"
              @click=${() => this._selectVersion(version.id)}
            >
              <div class="version-date">${new Date(version.timestamp).toLocaleString()}</div>
              <div class="version-summary">${version.summary || 'No description'}</div>
            </div>
          `)}
        </div>
        ${this.selectedVersionId ? html`
          <div class="version-actions">
            <ui-button variant="primary" @click=${this._applyVersion}>Apply Version</ui-button>
          </div>
        ` : ''}
      </div>
    `;
  }
}
```

**State Management Components:**
```typescript
// assets/src/components/molecules/publishing-state-controls.ts
@customElement('publishing-state-controls')
export class PublishingStateControls extends LitElement {
  @property({ type: String })
  currentState: 'draft' | 'published' | 'both' = 'published';

  render() {
    return html`
      <div class="state-controls">
        <div class="state-indicator ${this.currentState}">
          ${this._getStateLabel()}
        </div>
        <div class="state-actions">
          ${this._renderActions()}
        </div>
      </div>
    `;
  }

  private _getStateLabel() {
    switch(this.currentState) {
      case 'draft': return 'Draft';
      case 'published': return 'Published';
      case 'both': return 'Draft (Unpublished Changes)';
      default: return '';
    }
  }

  private _renderActions() {
    switch(this.currentState) {
      case 'draft':
        return html`<ui-button variant="success" @click=${this._publish}>Publish</ui-button>`;
      case 'both':
        return html`
          <ui-button variant="success" @click=${this._publish}>Publish</ui-button>
          <ui-button variant="outline" @click=${this._revert}>Revert to Published</ui-button>
        `;
      default:
        return '';
    }
  }
}
```

#### 2.4 Content Item Editor Updates
- Modify `content-item-editor.ts`:
  ```typescript
  @customElement('content-item-editor')
  export class ContentItemEditor extends LitElement {
    // Existing properties...
    
    @property({ type: String })
    currentState: 'draft' | 'published' | 'both' = 'published';
    
    @state()
    private showVersionHistory = false;
    
    @state()
    private versions: VersionInfo[] = [];
    
    @state()
    private selectedVersionId: string | null = null;
    
    render() {
      if (!this.item) {
        return html`<div>No item selected</div>`;
      }
    
      return html`
        <div>
          <div class="content-item-header">
            <ui-back-button @click="${() => this.dispatchEvent(new CustomEvent('back'))}">
              Back to List
            </ui-back-button>
            
            <div class="content-item-controls">
              ${this.versions.length > 0 ? html`
                <ui-button 
                  variant="outline" 
                  @click=${() => this.showVersionHistory = !this.showVersionHistory}
                >
                  ${this.showVersionHistory ? 'Hide Version History' : 'Show Version History'}
                </ui-button>
              ` : ''}
              
              <publishing-state-controls
                .currentState=${this.currentState}
                @publish=${this._handlePublish}
                @revert=${this._handleRevert}
              ></publishing-state-controls>
            </div>
          </div>
          
          <div class="content-item-body ${this.showVersionHistory ? 'with-sidebar' : ''}">
            ${this.isNew ? html`
              <cms-property-editor
                .component="${this.item}"
                .baseURL="${this.baseURL}"
                .businessUnitKey="${this.businessUnitKey}"
                @component-updated="${this._handleComponentUpdated}"
              ></cms-property-editor>
            ` : html`
              <div class="content-item-edit">
                <cms-property-editor
                  class="content-item-edit-editor"
                  .component="${this.fetchedItem}"
                  .baseURL="${this.baseURL}"
                  .businessUnitKey="${this.businessUnitKey}"
                  @component-updated="${this._handleComponentUpdated}"
                ></cms-property-editor>
                <div class="content-item-edit-preview">
                  <content-item-preview
                    .contentItemKey="${this.item.key}"
                    .baseURL="${this.baseURL}"
                    .businessUnitKey="${this.businessUnitKey}"
                  ></content-item-preview>
                </div>
              </div>
            `}
            
            ${this.showVersionHistory ? html`
              <version-history-sidebar
                .versions=${this.versions}
                .selectedVersionId=${this.selectedVersionId}
                @version-selected=${this._handleVersionSelected}
                @apply-version=${this._handleApplyVersion}
              ></version-history-sidebar>
            ` : ''}
          </div>
        </div>
      `;
    }
    
    // Add new methods for handling versions and states...
  }
  ```

#### 2.5 Pages App Updates
- Similar updates to pages-app component with version history and publishing controls

#### 2.6 Styles Updates
- Add CSS for new components and interactions:
  ```css
  .content-item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .content-item-controls {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  
  .content-item-body {
    display: flex;
    gap: 20px;
  }
  
  .content-item-body.with-sidebar {
    grid-template-columns: 1fr 300px;
  }
  
  .version-sidebar {
    width: 300px;
    border-left: 1px solid #e0e0e0;
    padding: 0 15px;
  }
  
  .version-item {
    padding: 10px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
  }
  
  .version-item.selected {
    background-color: #f0f7ff;
    border-left: 3px solid #3498db;
  }
  
  .state-indicator {
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 12px;
  }
  
  .state-indicator.draft {
    background-color: #fff8e1;
    color: #ff8f00;
  }
  
  .state-indicator.published {
    background-color: #e8f5e9;
    color: #2e7d32;
  }
  
  .state-indicator.both {
    background-color: #fff8e1;
    color: #ff8f00;
  }
  ```

### 3. Utility Functions

#### 3.1 Version Delta Calculation
- Create utility for calculating diffs between versions:
  ```typescript
  // assets/src/utils/version-utils.ts
  export function calculateDelta(
    newVersion: ContentItem | Page, 
    previousVersion: ContentItem | Page
  ): Record<string, any> {
    const delta: Record<string, any> = {};
    
    // For content items, check properties
    if ('properties' in newVersion && 'properties' in previousVersion) {
      const newProps = newVersion.properties;
      const oldProps = previousVersion.properties;
      
      Object.keys(newProps).forEach(key => {
        if (JSON.stringify(newProps[key]) !== JSON.stringify(oldProps[key])) {
          delta[`properties.${key}`] = {
            old: oldProps[key],
            new: newProps[key]
          };
        }
      });
    }
    
    // For pages, check components and layout
    if ('components' in newVersion && 'components' in previousVersion) {
      // Component changes logic
    }
    
    return delta;
  }
  
  export function generateSummary(delta: Record<string, any>): string {
    const changedFields = Object.keys(delta);
    if (changedFields.length === 0) return 'No changes';
    
    if (changedFields.length === 1) {
      return `Changed ${changedFields[0].split('.').pop()}`;
    }
    
    return `Changed ${changedFields.length} fields`;
  }
  ```

### 4. Implementation Order

1. Backend Changes:
   - Update data models
   - Create API endpoints for version and state management
   - Implement controllers and routes for these endpoints

2. Frontend Utilities:
   - Implement version comparison utilities
   - Add delta calculation functions

3. Redux Store Updates:
   - Update content-item.slice.ts and pages.slice.ts
   - Add state and version management actions
   - Update API client utilities

4. UI Components:
   - Create version-history-sidebar component
   - Create publishing-state-controls component
   - Add styling for new components

5. Content Item Editor Integration:
   - Update content-item-editor.ts with version and state features
   - Connect to Redux store
   - Add event handlers for version and state actions

6. Pages App Integration:
   - Similar updates to pages-app

7. Testing:
   - Test version history functionality
   - Test publishing workflow
   - Validate delta calculations

### 5. Testing

#### 5.1 Unit Tests
- Test delta calculation utility
- Test state management logic in Redux slices
- Test version history components

#### 5.2 Integration Tests
- Test content item versioning end-to-end
- Test page versioning end-to-end
- Test publishing workflow
- Test version restoration

#### 5.3 Manual Testing Scenarios
- Create content and publish it
- Make changes and test draft state
- Publish changes and verify published state
- Revert changes and verify reversion to published state
- Create multiple versions and test version history
- Apply previous versions and verify content changes

### 6. Rollout Plan
1. Implement backend changes
2. Add frontend utilities and Redux store updates
3. Implement UI components without connecting to backend
4. Connect frontend to backend
5. Deploy and test in staging
6. Deploy to production 