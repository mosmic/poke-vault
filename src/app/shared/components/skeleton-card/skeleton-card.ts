import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-skeleton-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="animate-pulse rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
      aria-hidden="true"
    >
      <div class="mb-3 h-32 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
      <div class="mb-1.5 h-3 w-10 rounded bg-gray-200 dark:bg-gray-700"></div>
      <div class="mb-3 h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
      <div class="flex gap-2">
        <div class="h-5 w-14 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div class="h-5 w-14 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      </div>
    </div>
  `,
})
export class SkeletonCard {}
