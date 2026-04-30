import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { PokemonCard as PokemonCardComponent } from './pokemon-card';
import type { PokemonCard } from '../../../core/models';

const mockCard: PokemonCard = {
  id: 25,
  name: 'pikachu',
  imageUrl: 'https://example.com/25.png',
  types: ['electric'],
};

describe('PokemonCardComponent', () => {
  let component: PokemonCardComponent;
  let fixture: ComponentFixture<PokemonCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonCardComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('pokemon', mockCard);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render formatted name in title case', () => {
    const h2 = fixture.nativeElement.querySelector('h2') as HTMLHeadingElement;
    expect(h2.textContent?.trim()).toBe('Pikachu');
  });

  it('should render the padded id', () => {
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('#025');
  });

  it('should render the pokemon image with correct src and alt', () => {
    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(img.src).toContain('25.png');
    expect(img.alt).toBe('Pikachu');
  });

  it('should emit toggleFavorite with the pokemon id when button is clicked', () => {
    const spy = vi.fn();
    component.toggleFavorite.subscribe(spy);
    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    btn.click();
    expect(spy).toHaveBeenCalledWith(25);
  });

  it('should format hyphenated names correctly', async () => {
    fixture.componentRef.setInput('pokemon', { ...mockCard, name: 'mr-mime' });
    fixture.detectChanges();
    await fixture.whenStable();
    const h2 = fixture.nativeElement.querySelector('h2') as HTMLHeadingElement;
    expect(h2.textContent?.trim()).toBe('Mr Mime');
  });

  it('should show unfilled heart when isFavorite is false', () => {
    // unfilled heart uses stroke-width (no fill)
    const svg = fixture.nativeElement.querySelector('button svg') as SVGElement;
    expect(svg.getAttribute('fill')).toBe('none');
  });

  it('should show filled heart when isFavorite is true', async () => {
    fixture.componentRef.setInput('isFavorite', true);
    fixture.detectChanges();
    await fixture.whenStable();
    const svg = fixture.nativeElement.querySelector('button svg') as SVGElement;
    expect(svg.getAttribute('fill')).toBe('currentColor');
  });
});
