import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeStore } from '../../../state/theme.store';

@Component({
  selector: 'app-theme-toggle',
  imports: [],
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggle {
  protected readonly themeStore = inject(ThemeStore);
}
