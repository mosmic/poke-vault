import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ThemeToggle } from './theme-toggle';
import { ThemeStore } from '../../../state/theme.store';

// jsdom does not implement matchMedia — required by ThemeStore.resolveInitialTheme()
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('ThemeToggle', () => {
  let component: ThemeToggle;
  let fixture: ComponentFixture<ThemeToggle>;
  let themeStore: InstanceType<typeof ThemeStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeToggle],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeToggle);
    component = fixture.componentInstance;
    themeStore = TestBed.inject(ThemeStore);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a button with an aria-label', () => {
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button).not.toBeNull();
    expect(button.getAttribute('aria-label')).toBeTruthy();
  });

  it('should call themeStore.toggle() when button is clicked', async () => {
    const toggleSpy = vi.spyOn(themeStore, 'toggle');
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();
    await fixture.whenStable();
    expect(toggleSpy).toHaveBeenCalledOnce();
  });
});
