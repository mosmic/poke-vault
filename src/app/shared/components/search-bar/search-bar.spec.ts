import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { SearchBar } from './search-bar';

describe('SearchBar', () => {
  let component: SearchBar;
  let fixture: ComponentFixture<SearchBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SearchBar] }).compileComponents();
    fixture = TestBed.createComponent(SearchBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a labelled search input', () => {
    const input = fixture.nativeElement.querySelector('input[type="search"]') as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.getAttribute('aria-label')).toBeTruthy();
  });

  it('model() updates when the user types', async () => {
    const input = fixture.nativeElement.querySelector('input[type="search"]') as HTMLInputElement;
    input.value = 'pikachu';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(component.value()).toBe('pikachu');
  });

  it('should hide clear button when value is empty', () => {
    expect(fixture.nativeElement.querySelector('button[aria-label="Clear search"]')).toBeNull();
  });

  it('reflects model value in the input when non-empty', async () => {
    component.value.set('pika');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input[type="search"]') as HTMLInputElement;
    expect(input.value).toBe('pika');
  });

  it('updates input when value is cleared programmatically', async () => {
    component.value.set('pika');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();
    component.value.set('');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input[type="search"]') as HTMLInputElement;
    expect(input.value).toBe('');
  });
});
