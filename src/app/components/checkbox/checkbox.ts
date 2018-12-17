import {NgModule,Component,Input,Output,EventEmitter,forwardRef,ChangeDetectorRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl} from '@angular/forms';

export const CHECKBOX_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => Checkbox),
  multi: true
};

@Component({
    selector: 'p-checkbox',
    template: `
        <div [ngStyle]="style" [ngClass]="'ng-chkbox ng-widget'" [class]="styleClass">
            <div class="ng-helper-hidden-accessible">
                <input #cb type="checkbox" [attr.id]="inputId" [name]="name" [value]="value" [checked]="checked" (focus)="onFocus($event)" (blur)="onBlur($event)"
                [ngClass]="{'ng-state-focus':focused}" (change)="handleChange($event)" [disabled]="disabled" [attr.tabindex]="tabindex">
            </div>
            <div class="ng-chkbox-box ng-widget ng-corner-all ng-state-default" (click)="onClick($event,cb,true)"
                        [ngClass]="{'ng-state-active':checked,'ng-state-disabled':disabled,'ng-state-focus':focused}">
                <span class="ng-chkbox-icon ng-clickable" [ngClass]="{'pi pi-check':checked}"></span>
            </div>
        </div>
        <label (click)="onClick($event,cb,true)" [class]="labelStyleClass"
                [ngClass]="{'ng-chkbox-label': true, 'ng-label-active':checked, 'ng-label-disabled':disabled, 'ng-label-focus':focused}"
                *ngIf="label" [attr.for]="inputId">{{label}}</label>
    `,
    providers: [CHECKBOX_VALUE_ACCESSOR]
})
export class Checkbox implements ControlValueAccessor {

    @Input() value: any;

    @Input() name: string;

    @Input() disabled: boolean;
    
    @Input() binary: string;
    
    @Input() label: string;

    @Input() tabindex: number;

    @Input() inputId: string;
    
    @Input() style: any;

    @Input() styleClass: string;

    @Input() labelStyleClass: string;
    
    @Input() formControl: FormControl;
    
    @Output() onChange: EventEmitter<any> = new EventEmitter();
    
    model: any;
    
    onModelChange: Function = () => {};
    
    onModelTouched: Function = () => {};
        
    focused: boolean = false;
    
    checked: boolean = false;

    constructor(private cd: ChangeDetectorRef) {}

    onClick(event,checkbox,focus:boolean) {
        event.preventDefault();
        
        if(this.disabled) {
            return;
        }
        
        this.checked = !this.checked;
        this.updateModel();
        
        if(focus) {
            checkbox.focus();
        }
    }
    
    updateModel() {
        if(!this.binary) {
            if(this.checked)
                this.addValue();
            else
                this.removeValue();

            this.onModelChange(this.model);
            
            if(this.formControl) {
                this.formControl.setValue(this.model);
            }
        }
        else {
            this.onModelChange(this.checked);
        }
        
        this.onChange.emit(this.checked);
    }
    
    handleChange(event) {
        this.checked = event.target.checked;
        this.updateModel();
    }

    isChecked(): boolean {
        if(this.binary)
            return this.model;
        else
            return this.model && this.model.indexOf(this.value) > -1;
    }

    removeValue() {
        this.model = this.model.filter(val => val !== this.value);
    }

    addValue() {
        if(this.model)
            this.model = [...this.model, this.value];
        else
            this.model = [this.value];
    }
    
    onFocus(event) {
        this.focused = true;
    }

    onBlur(event) {
        this.focused = false;
        this.onModelTouched();
    }
    
    writeValue(model: any) : void {
        this.model = model;
        this.checked = this.isChecked();
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
}

@NgModule({
    imports: [CommonModule],
    exports: [Checkbox],
    declarations: [Checkbox]
})
export class CheckboxModule { }