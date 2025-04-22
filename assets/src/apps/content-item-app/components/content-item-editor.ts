// Create a new file: assets/src/apps/content-item-app/components/content-item-editor.ts
// with the following content:

import { LitElement, css, html } from 'lit';
import { connect, watch } from 'lit-redux-watch';
import { customElement, property, state } from 'lit/decorators.js';
import '../../../apps/cms-renderer/component-renderer';
import '../../../components/atoms/button';
import '../../../components/molecules/publishing-state-controls';
import '../../../components/molecules/version-history-sidebar';
import { store } from '../../../store';
import { ContentItem, VersionInfo } from '../../../types';
import '../content-item-preview';

@customElement('content-item-editor')
export class ContentItemEditor extends connect(store)(LitElement) {
  @property({ type: Object })
  item: ContentItem | null = null;

  @property({ type: Boolean })
  isNew: boolean = false;

  @property({ type: String })
  baseURL: string = '';

  @property({ type: String })
  businessUnitKey: string = '';

  @state()
  private showVersionHistory = false;

  @watch('version.versions', { noInit: true })
  private versions: VersionInfo[] = [];

  @watch('version.loading', { noInit: true })
  private versionsLoading: boolean = true;

  @state()
  private selectedVersionId: string | null = null;

  @watch('state.currentState', { noInit: true })
  private currentState: 'draft' | 'published' | 'both' | null = null;

  @watch('state.loading', { noInit: true })
  private stateLoading: boolean = true;

  @state()
  private contentVersion: ContentItem | null = null;

  static styles = css`
    :host {
      display: block;
    }

    .content-item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      gap: 20px;
    }

    .content-item-controls {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .content-item-edit {
      display: flex;
      flex-direction: row;
      gap: 10px;
    }

    .content-item-edit-editor {
      flex-basis: 50%;
    }

    .content-item-edit-preview {
      flex-basis: 50%;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .content-item-body {
      display: grid;
    }

    .content-item-body.with-sidebar {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 20px;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    if (this.item?.key && this.baseURL) {

      // Fetch versions and states when component connects
      if (!this.isNew) {
        this.dispatchEvent(
          new CustomEvent('fetch-versions', {
            detail: {
              key: this.item.key,
              contentType: 'content-items',
            },
            bubbles: true,
            composed: true,
          })
        );

        this.dispatchEvent(
          new CustomEvent('fetch-states', {
            detail: {
              key: this.item.key,
              contentType: 'content-items',
            },
            bubbles: true,
            composed: true,
          })
        );
      }
    }
  }

  render() {
    if (!this.item) {
      return html`<div>No item selected</div>`;
    }

    const contentToEdit = this.item;

    return html`
      <div>
        <div class="content-item-header">
          <ui-back-button
            @click="${() => {
              this.dispatchEvent(new CustomEvent('back'));
            }}"
          >
            Back to List
          </ui-back-button>

          <div class="content-item-controls">
            ${!this.isNew
              ? html`
              <ui-button
                    variant="outline"
                    @click="${() => (this.showVersionHistory = !this.showVersionHistory)}"
                  >
                    ${this.showVersionHistory ? 'Hide Version History' : 'Show Version History'}
                  </ui-button>

                  ${!this.stateLoading
                    ? html`
                <publishing-state-controls
                          .currentState="${this.currentState}"
                          @publish="${this._handlePublish}"
                          @revert="${this._handleRevert}"
                        ></publishing-state-controls>
              `
                    : ''}
            `
              : ''}
          </div>
        </div>

        <div class="content-item-body ${this.showVersionHistory ? 'with-sidebar' : ''}">
          ${this.isNew
            ? html`
            <cms-property-editor
                  .component="${this.item}"
                  .baseURL="${this.baseURL}"
                  .businessUnitKey="${this.businessUnitKey}"
                  @component-updated="${this._handleComponentUpdated}"
                ></cms-property-editor>
          `
            : html`
            <div class="content-item-edit">
                  <cms-property-editor
                    class="content-item-edit-editor"
                    .versionedContent="${this.contentVersion}"
                    .component="${contentToEdit}"
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
          ${this.showVersionHistory && !this.versionsLoading
            ? html`
            <version-history-sidebar
                  .versions="${this.versions}"
                  .selectedVersionId="${this.selectedVersionId}"
                  @version-selected="${this._handleVersionSelected}"
                  @apply-version="${this._handleApplyVersion}"
                  @selection-cancelled="${this._handleSelectionCancelled}"
                ></version-history-sidebar>
          `
            : ''}
        </div>
      </div>
    `;
  }

  private _handleComponentUpdated(e: CustomEvent) {
    // Create a copy of the event detail to avoid reference issues
    const updatedComponent = JSON.parse(JSON.stringify(e.detail));
    this.dispatchEvent(new CustomEvent('save', { detail: updatedComponent }));
  }

  private _handlePublish() {
    if (this.item?.key) {
      this.dispatchEvent(
        new CustomEvent('publish', {
          detail: {
            item: this.item,
            key: this.item.key,
            contentType: 'content-items',
            clearDraft: true, // Optionally clear the draft when publishing
          },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  private _handleRevert() {
    if (this.item?.key) {
      this.dispatchEvent(
        new CustomEvent('revert', {
          detail: {
            key: this.item.key,
            contentType: 'content-items',
          },
          bubbles: true,
          composed: true,
        })
      );

      // Clear any selected version after reverting
      this.contentVersion = null;
      this.selectedVersionId = null;
    }
  }

  private _handleVersionSelected(e: CustomEvent) {
    this.selectedVersionId = e.detail;

    // Find the selected version and extract its content item
    const selectedVersion = this.versions.find(v => 'id' in v && v.id === this.selectedVersionId);
    if (selectedVersion) {
      this.contentVersion = selectedVersion as ContentItem;
    }
  }

  private _handleApplyVersion(e: CustomEvent) {
    const versionId = e.detail;

    // Find the selected version
    const selectedVersion = this.versions.find(v => 'id' in v && v.id === versionId);
    if (selectedVersion && this.item?.key) {
      this.dispatchEvent(
        new CustomEvent('save', {
          detail: {
            component: selectedVersion,
          },
        })
      );

      // Reset selection
      this.selectedVersionId = null;
      this.contentVersion = null;
    }
  }

  private _handleSelectionCancelled() {
    this.selectedVersionId = null;
    this.contentVersion = null;
    this.showVersionHistory = false;
  }

  // Map state from store to properties
  mapState(state: any) {
    return {
      versions: state.version.versions,
      currentState: state.state.currentState,
    };
  }
}
