import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { TypeBadge } from './type-badge';

@Component({
  imports: [TypeBadge],
  template: `<app-type-badge [type]="type" />`,
})
class TestHost {
  type = 'fire';
}

describe('TypeBadge', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should render the type name', () => {
    const span = fixture.nativeElement.querySelector('span') as HTMLSpanElement;
    expect(span.textContent?.trim()).toBe('fire');
  });

  it('should apply fire-type styling', () => {
    const span = fixture.nativeElement.querySelector('span') as HTMLSpanElement;
    expect(span.className).toContain('bg-orange-500');
  });

  it('should apply water-type styling', async () => {
    // Create a fresh fixture with the desired input to avoid ExpressionChangedAfterItHasBeenCheckedError
    const fixture2 = TestBed.createComponent(TestHost);
    const host2 = fixture2.componentInstance;
    host2.type = 'water';
    fixture2.detectChanges();
    await fixture2.whenStable();
    const span = fixture2.nativeElement.querySelector('span') as HTMLSpanElement;
    expect(span.className).toContain('bg-blue-500');
  });

  it('should apply fallback class for unknown types', async () => {
    const fixture2 = TestBed.createComponent(TestHost);
    const host2 = fixture2.componentInstance;
    host2.type = 'unknowntype';
    fixture2.detectChanges();
    await fixture2.whenStable();
    const span = fixture2.nativeElement.querySelector('span') as HTMLSpanElement;
    expect(span.className).toContain('bg-gray-300');
  });
});
