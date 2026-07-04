import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-top-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="topnav" aria-label="Top navigation">
      <div class="topnav-left">
        <span class="wordmark text-headline-md">BuildWithAI</span>
        <div class="topnav-tabs" role="tablist">
          <a
            routerLink="/"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            class="tab"
            role="tab"
            >Laboratory</a
          >
          <a
            routerLink="/evaluation"
            routerLinkActive="active"
            class="tab"
            role="tab"
            >History</a
          >
          <a routerLink="/" class="tab disabled" role="tab" aria-disabled="true" tabindex="-1"
            >Insights</a
          >
        </div>
      </div>
      <div class="topnav-right">
        <button type="button" class="icon-btn" aria-label="Settings">
          <span class="material-symbols-outlined" aria-hidden="true">settings</span>
        </button>
        <button type="button" class="icon-btn" aria-label="Help">
          <span class="material-symbols-outlined" aria-hidden="true">help</span>
        </button>
      </div>
    </nav>
  `,
  styles: [`
    .topnav {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: var(--topnav-height);
      z-index: 50;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 var(--space-lg);
      background: var(--color-surface);
      border-bottom: var(--border-1);
    }

    .topnav-left {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .wordmark {
      font-weight: 700;
      color: var(--color-primary);
    }

    .topnav-tabs {
      display: flex;
      gap: var(--space-md);
      margin-left: var(--space-xl);
      height: var(--topnav-height);
      align-items: center;
    }

    .tab {
      height: 100%;
      display: flex;
      align-items: center;
      padding: 0 var(--space-xs);
      color: var(--color-on-surface-variant);
      text-decoration: none;
      font-weight: 500;
      transition: background 0.2s;
    }
    .tab:hover {
      background: var(--color-surface-container-high);
    }
    .tab.active {
      color: var(--color-primary);
      font-weight: 700;
      border-bottom: 2px solid var(--color-primary);
    }
    .tab.disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    .topnav-right {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }

    .icon-btn {
      padding: var(--space-sm);
      border: none;
      background: transparent;
      cursor: pointer;
      border-radius: var(--radius-full);
      color: var(--color-on-surface-variant);
      transition: background 0.2s;
    }
    .icon-btn:hover {
      background: var(--color-surface-container-high);
    }

    :focus-visible {
      outline: var(--border-2-primary);
      outline-offset: -2px;
    }
  `],
})
export class TopNavComponent {}
