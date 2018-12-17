import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Button } from './button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('Button', () => {

      let button: Button;
      let fixture: ComponentFixture<Button>;

      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [
              NoopAnimationsModule
          ],
          declarations: [
              Button
          ]
        });

        fixture = TestBed.createComponent(Button);
        button = fixture.componentInstance;
      });

      it('should disabled when disabled is true', () => {
        button.disabled = true;
        fixture.detectChanges();
        const buttonEl = fixture.debugElement.query(By.css('.ng-button'));
        expect(buttonEl.nativeElement.className).toContain('ng-state-disabled');
      });

      it('should display the label and have a text only class', () => {
        button.label = 'PrimeNG';
        fixture.detectChanges();
        const buttonEl = fixture.debugElement.query(By.css('.ng-button'));
        expect(buttonEl.nativeElement.className).toContain('ng-button-text-only');
        expect(buttonEl.nativeElement.textContent).toContain('PrimeNG');
        expect(buttonEl.nativeElement.children.length).toEqual(1);
      });

      it('should display the icon and icon to be on the left by default ', () => {
        button.label = 'PrimeNG';
        button.icon = 'pi pi-times';
        fixture.detectChanges();
        const buttonEl = fixture.debugElement.query(By.css('.ng-button'));
        expect(buttonEl.nativeElement.className).toContain('ng-button-text-icon-left');
        expect(buttonEl.nativeElement.children[0].className).toContain('ng-button-icon-left');
      });

      it('should display the icon', () => {
        button.icon = 'pi pi-times';
        fixture.detectChanges();
        const buttonEl = fixture.debugElement.query(By.css('.ng-button'));
        expect(buttonEl.nativeElement.className).toContain('ng-button-icon-only');
      });

      it('should display the icon on the right and have a label', () => {
        button.label = 'PrimeNG';
        button.icon = 'pi pi-times';
        button.iconPos = 'right';
        fixture.detectChanges();
        const buttonEl = fixture.debugElement.query(By.css('.ng-button'));
        expect(buttonEl.nativeElement.className).toContain('ng-button-text-icon-right');
        expect(buttonEl.nativeElement.children[0].className).toContain('ng-button-icon-right');
        expect(buttonEl.nativeElement.children[1].textContent).toContain('PrimeNG');
      });
      it('should display the icon on the right', () => {
        button.icon = 'pi pi-times';
        button.iconPos = 'right';
        fixture.detectChanges();
        const buttonEl = fixture.debugElement.query(By.css('.ng-button'));
        expect(buttonEl.nativeElement.className).toContain('ng-button-icon-only');
        expect(buttonEl.nativeElement.children[0].className).toContain('ng-button-icon-right');
      });
      it('should enabled by default', () => {
        fixture.detectChanges();
        const buttonEl = fixture.debugElement.query(By.css('.ng-button'));
        expect(buttonEl.nativeElement.className).not.toContain('ng-state-disabled');
      });
      it('should have a empty label and icon', () => {
        fixture.detectChanges();
        const buttonEl = fixture.debugElement.query(By.css('.ng-button'));
        expect(buttonEl.nativeElement.className).toContain('ng-button-text-empty');
      });

});
