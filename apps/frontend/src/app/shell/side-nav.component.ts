import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar" [class.open]="open()">
      <div class="sidebar-header">
        <h2 class="text-headline-md">R&amp;D Lab</h2>
        <p class="text-label-mono subtitle">Technical Reasoning</p>
      </div>

      <nav class="sidebar-nav" aria-label="Main navigation">
        <a
          routerLink="/"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: true }"
          class="nav-item"
          ariaCurrentWhenActive="page"
          (click)="onNavClick()"
        >
          <span class="material-symbols-outlined" aria-hidden="true">add_circle</span>
          <span class="text-label-mono">New Solve</span>
        </a>
        <a
          routerLink="/evaluation"
          routerLinkActive="active"
          class="nav-item"
          ariaCurrentWhenActive="page"
          (click)="onNavClick()"
        >
          <span class="material-symbols-outlined" aria-hidden="true">history</span>
          <span class="text-label-mono">History</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <button type="button" class="nav-item footer-btn" aria-label="Settings">
          <span class="material-symbols-outlined" aria-hidden="true">settings</span>
          <span class="text-label-mono">Settings</span>
        </button>
        <button type="button" class="nav-item footer-btn" aria-label="Documentation">
          <span class="material-symbols-outlined" aria-hidden="true">menu_book</span>
          <span class="text-label-mono">Documentation</span>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      position: fixed;
      left: 0;
      top: var(--topnav-height);
      height: calc(100vh - var(--topnav-height));
      width: var(--sidebar-width);
      background: var(--color-surface-container-low);
      border-right: var(--border-1);
      display: flex;
      flex-direction: column;
      padding: var(--space-md) 0;
      overflow-y: auto;
    }

    .sidebar-header {
      padding: 0 var(--space-lg) var(--space-md);
      border-bottom: var(--border-1);
      margin-bottom: var(--space-md);
    }
    .sidebar-header h2 {
      color: var(--color-primary);
    }
    .subtitle {
      color: var(--color-on-surface-variant);
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
      flex-grow: 1;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-sm) var(--space-lg);
      text-decoration: none;
      color: var(--color-on-surface-variant);
      border-left: 2px solid transparent;
      transition: background 0.2s;
      cursor: pointer;
      background: none;
      border-top: none;
      border-right: none;
      border-bottom: none;
      width: 100%;
      text-align: left;
      font: inherit;
    }
    .nav-item:hover {
      background: var(--color-surface-container-highest);
    }
    .nav-item.active {
      color: var(--color-primary);
      font-weight: 700;
      border-left: 2px solid var(--color-primary);
      background: var(--color-surface-container);
    }
    .nav-item.disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    .sidebar-footer {
      margin-top: auto;
      padding-top: var(--space-md);
      border-top: var(--border-1);
    }
    .footer-btn {
      width: 100%;
    }

    :focus-visible {
      outline: var(--border-2-primary);
      outline-offset: -2px;
    }

    @media (max-width: 767px) {
      .sidebar {
        transform: translateX(-100%);
        transition: transform 0.2s ease;
        z-index: 50;
      }
      .sidebar.open {
        transform: translateX(0);
      }
    }
  `],
})
export class SideNavComponent {
  readonly open = input<boolean>(false);
  readonly closed = output<void>();

  onNavClick(): void {
    this.closed.emit();
  }
}
