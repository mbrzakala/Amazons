import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopNavComponent } from './shell/top-nav.component';
import { SideNavComponent } from './shell/side-nav.component';

@Component({
  imports: [TopNavComponent, SideNavComponent, RouterOutlet],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
