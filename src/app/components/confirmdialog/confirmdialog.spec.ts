import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ConfirmDialog } from './confirmdialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ConfirmationService} from '../common/api';

@Component({
  template: `<p-confirmDialog></p-confirmDialog>

  <button type="button" (click)="confirm1()" pButton icon="pi pi-check" label="Confirm"></button>`
})
class TestConfirmDialogComponent {

  constructor(private confirmationService: ConfirmationService) {}

  header:string;

  confirm1() {
	this.confirmationService.confirm({
	message: 'Are you sure that you want to proceed?',
	header: 'Confirmation',
	icon: 'pi pi-exclamation-triangle',
	accept: () => {
		this.header = "accept";
		},
		reject: () => {
		this.header = "reject";
		}
	});
  }

}

describe('ConfirmDialog', () => {
  
  let confirmDialog: ConfirmDialog;
  let fixture: ComponentFixture<TestConfirmDialogComponent>;
  
  beforeEach(() => {
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
      imports: [
        NoopAnimationsModule
      ],
      declarations: [
        ConfirmDialog,
        TestConfirmDialogComponent,
      ],
      providers:[
        ConfirmationService
      ]
      });
      
      fixture = TestBed.createComponent(TestConfirmDialogComponent);
      confirmDialog = fixture.debugElement.query(By.css('p-confirmDialog')).componentInstance;
    });

    it('should display the header', () => {
		confirmDialog.header = "PrimengRocks!";
		confirmDialog.visible = true;
		fixture.detectChanges();

		const confirmDialogEl = fixture.debugElement.query(By.css('.ng-dialog-title')).nativeElement;
		expect(confirmDialogEl).toBeTruthy();
		expect(confirmDialogEl.textContent).toContain('PrimengRocks!');
    });

    it('should display the close icon when closable is true', () => {
        confirmDialog.visible = true;
        fixture.detectChanges();

        const closeEl = fixture.debugElement.query(By.css('.ng-dialog-titlebar-icon'));
        expect(closeEl).not.toBeNull();
    });

    it('should not create the container element by default', () => {
		fixture.detectChanges();

		expect(fixture.debugElement.query(By.css('.ng-dialog'))).toBeFalsy;
		expect(confirmDialog.visible).toEqual(undefined);
    });

    it('should add rtl class when rtl is enabled', () => {
		confirmDialog.visible = true;
		confirmDialog.rtl = true;
		fixture.detectChanges();

		expect(fixture.debugElement.query(By.css('div')).classes['ng-dialog-rtl']).toEqual(true);
    });

    it('should not have a close icon', () => {
		confirmDialog.visible = true;
		confirmDialog.closable = false;
		fixture.detectChanges();

		expect(fixture.debugElement.query(By.css('a'))).toBeFalsy();
    });

    it('should change buttonStyles', () => {
		confirmDialog.visible = true;
		confirmDialog.rejectButtonStyleClass = "Primeng ROCKS!";
		confirmDialog.acceptButtonStyleClass = "Primeng ROCKS!";
		fixture.detectChanges();

		expect(fixture.debugElement.query(By.css('.ng-dialog-footer')).children[0].nativeElement.className).toContain("Primeng ROCKS!");
		expect(fixture.debugElement.query(By.css('.ng-dialog-footer')).children[1].nativeElement.className).toContain("Primeng ROCKS!");
    });

    it('should change icons', () => {
		confirmDialog.visible = true;
		confirmDialog.icon = "Primeng ROCKS!";
		confirmDialog.acceptIcon = "Primeng ROCKS!";
		confirmDialog.rejectIcon = "Primeng ROCKS!";
		fixture.detectChanges();

		expect(fixture.debugElement.query(By.css('.ng-confirmdialog-icon')).nativeElement.className).toContain("Primeng ROCKS!");
		expect(fixture.debugElement.query(By.css('.ng-dialog-footer')).children[0].nativeElement.icon).toContain("Primeng ROCKS!");
		expect(fixture.debugElement.query(By.css('.ng-dialog-footer')).children[1].nativeElement.icon).toContain("Primeng ROCKS!");
    });

    it('should not show accept button', () => {
		confirmDialog.visible = true;
		confirmDialog.acceptVisible = false;
		fixture.detectChanges();

		expect(fixture.debugElement.query(By.css('.ng-dialog-footer')).children[1]).toBeFalsy();
    });

    it('should not show reject button', () => {
		confirmDialog.visible = true;
		confirmDialog.rejectVisible = false;
		fixture.detectChanges();

		expect(fixture.debugElement.query(By.css('.ng-dialog-footer')).children[1]).toBeFalsy();
    });

    it('should run accept', () => {
		const confirmEl = fixture.debugElement.query(By.css('button')).nativeElement;
		confirmEl.click();
		fixture.detectChanges();
		
		const acceptButtonEl = fixture.debugElement.query(By.css('.ng-dialog-footer')).children[0].nativeElement;
		acceptButtonEl.click();
		expect(fixture.componentInstance.header).toEqual("accept");      
    });

    it('should run reject', () => {
		const confirmEl = fixture.debugElement.query(By.css('button')).nativeElement;
		confirmEl.click();
		fixture.detectChanges();
		
		const rejectButtonEl = fixture.debugElement.query(By.css('.ng-dialog-footer')).children[1].nativeElement;
		rejectButtonEl.click();
		expect(fixture.componentInstance.header).toEqual("reject");
	});
	
	it('should close when click close icon', fakeAsync(() => {
		const buttonEl = fixture.debugElement.query(By.css('button')).nativeElement;
		buttonEl.click();
		fixture.detectChanges();

		const closeEl = fixture.debugElement.query(By.css(".ng-dialog-titlebar-close")).nativeElement;
		closeEl.click();
		tick(300);
		fixture.detectChanges();
		
		const confirmDialogEl = fixture.debugElement.query(By.css("div"));
		expect(confirmDialogEl).toBeFalsy();
	}));

	it('should set width and height (deprecated)', fakeAsync(() => {
		confirmDialog.width = 250;
		confirmDialog.height = 250;
		const buttonEl = fixture.debugElement.query(By.css('button')).nativeElement;
		buttonEl.click();
		fixture.detectChanges();
		
		tick(300);
		const container = fixture.debugElement.query(By.css(".ng-dialog"));
		expect(container.nativeElement.style.height).toEqual("250px");
		expect(container.nativeElement.style.width).toEqual("250px");
	}));

	it('should close with esc', fakeAsync(() => {
		const buttonEl = fixture.debugElement.query(By.css('button')).nativeElement;
		buttonEl.click();
		const closeSpy = spyOn(confirmDialog,"close").and.callThrough();
		fixture.detectChanges();
		
		tick(300);
		const escapeEvent: any = document.createEvent('CustomEvent');
        escapeEvent.which = 27;
        escapeEvent.initEvent('keydown', true, true);
        document.dispatchEvent(escapeEvent as KeyboardEvent);
		fixture.detectChanges();
		
		expect(closeSpy).toHaveBeenCalled();
	}));

	it('should call onWindowResize when resize', fakeAsync(() => {
		const buttonEl = fixture.debugElement.query(By.css('button')).nativeElement;
		buttonEl.click();
		const onWindowResizeSpy = spyOn(confirmDialog,"onWindowResize").and.callThrough();
		fixture.detectChanges();
		
		tick(300);
		window.dispatchEvent(new Event('resize'));
		fixture.detectChanges();
		
		expect(onWindowResizeSpy).toHaveBeenCalled();
	}));

	it('should set container height %100 with breakpoint', fakeAsync(() => {
		confirmDialog.breakpoint = 100000000;
		const buttonEl = fixture.debugElement.query(By.css('button')).nativeElement;
		buttonEl.click();
		const onWindowResizeSpy = spyOn(confirmDialog,"onWindowResize").and.callThrough();
		fixture.detectChanges();

		tick(300);
		window.dispatchEvent(new Event('resize'));
		fixture.detectChanges();
		
		const container = fixture.debugElement.query(By.css("div"));
		expect(onWindowResizeSpy).toHaveBeenCalled();
		expect(container.nativeElement.style.width).toEqual('100%');
		expect(container.nativeElement.style.left).toEqual('0px');
	}));
});
