import {NgModule,Component,Input,Output,ElementRef,EventEmitter,forwardRef,ViewChild,ChangeDetectorRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';

export const RADIO_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RadioButton),
  multi: true
};

@Component({
    selector: 'p-radioButton',
    template: `
        <div [ngStyle]="style" [ngClass]="'ng-radiobutton ng-widget'" [class]="styleClass">
            <div class="ng-helper-hidden-accessible">
                <input #rb type="radio" [attr.id]="inputId" [attr.name]="name" [attr.value]="value" [attr.tabindex]="tabindex" 
                    [checked]="checked" (change)="onChange($event)" (focus)="onFocus($event)" (blur)="onBlur($event)" [disabled]="disabled">
            </div>
            <div (click)="handleClick($event, rb, true)"
                [ngClass]="{'ng-radiobutton-box ng-widget ng-state-default':true,
                'ng-state-active':rb.checked,'ng-state-disabled':disabled,'ng-state-focus':focused}">
                <span class="ng-radiobutton-icon ng-clickable" [ngClass]="{'pi pi-circle-on':rb.checked}"></span>
            </div>
        </div>
        <label (click)="select()" [class]="labelStyleClass"
            [ngClass]="{'ng-radiobutton-label':true, 'ng-label-active':rb.checked, 'ng-label-disabled':disabled, 'ng-label-focus':focused}"
            *ngIf="label" [attr.for]="inputId">{{label}}</label>
    `,
    providers: [RADIO_VALUE_ACCESSOR]
})
export class RadioButton implements ControlValueAccessor {

    @Input() value: any;

    @Input() name: string;

    @Input() disabled: boolean;
    
    @Input() label: string;

    @Input() tabindex: number;

    @Input() inputId: string;
    
    @Input() style: any;

    @Input() styleClass: string;

    @Input() labelStyleClass: string;

    @Output() onClick: EventEmitter<any> = new EventEmitter();
    
    @ViewChild('rb') inputViewChild: ElementRef;
            
    public onModelChange: Function = () => {};
    
    public onModelTouched: Function = () => {};
    
    public checked: boolean;
        
    public focused: boolean;

    constructor(private cd: ChangeDetectorRef) {}
    
    handleClick(event, radioButton, focus) {
        event.preventDefault();

        if(this.disabled) {
            return;
        }

        this.select();

        if(focus) {
            radioButton.focus();
        }
    }
    
    select() {
        if(!this.disabled) {
            this.inputViewChild.nativeElement.checked = true;
            this.checked = true;
            this.onModelChange(this.value);
            this.onClick.emit(null);
        }
    }
            
    writeValue(value: any) : void {
        this.checked = (value == this.value);

        if(this.inputViewChild.nativeElement) {
            this.inputViewChild.nativeElement.checked = this.checked;
        }
        
        this.cd.markForCheck();
    }
    
    registerOnChange(fn: Function): void {
        this.onModelChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onModelTouched = fn;
    }
    
    setDisabledState(val: boolean): void {
        this.disabled = val;
    }
    
    onFocus(event) {
        this.focused = true;
    }

    onBlur(event) {
        this.focused = false;
        this.onModelTouched();
    }
    
    onChange(event) {
        this.select();
    }
}

@NgModule({
    imports: [CommonModule],
    exports: [RadioButton],
    declarations: [RadioButton]
})
export class RadioButtonModule { }