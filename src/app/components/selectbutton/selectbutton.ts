import {NgModule,Component,Input,Output,EventEmitter,forwardRef,ChangeDetectorRef,ContentChild,TemplateRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SelectItem} from '../common/selectitem';
import {ObjectUtils} from '../utils/objectutils';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';

export const SELECTBUTTON_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectButton),
  multi: true
};

@Component({
    selector: 'p-selectButton',
    template: `
        <div [ngClass]="'ng-selectbutton ng-buttonset ng-widget ng-corner-all ng-buttonset-' + (options ? options.length : 0)" [ngStyle]="style" [class]="styleClass">
            <div *ngFor="let option of options; let i = index" class="ng-button ng-widget ng-state-default ng-button-text-only {{option.styleClass}}"
                [ngClass]="{'ng-state-active':isSelected(option), 'ng-state-disabled': disabled || option.disabled, 'ng-state-focus': cbox == focusedItem, 
                'ng-button-text-icon-left': (option.icon != null), 'ng-button-icon-only': (option.icon && !option.label)}" (click)="onItemClick($event,option,cbox,i)" [attr.title]="option.title">
                <ng-container *ngIf="!itemTemplate else customcontent">
                    <span [ngClass]="['ng-clickable', 'ng-button-icon-left']" [class]="option.icon" *ngIf="option.icon"></span>
                    <span class="ng-button-text ng-clickable">{{option.label||'ng-btn'}}</span>
                </ng-container>
                <ng-template #customcontent>
                    <ng-container *ngTemplateOutlet="itemTemplate; context: {$implicit: option, index: i}"></ng-container>
                </ng-template>
                <div class="ng-helper-hidden-accessible">
                    <input #cbox type="checkbox" [checked]="isSelected(option)" (focus)="onFocus($event)" (blur)="onBlur($event)" [attr.tabindex]="tabindex" [attr.disabled]="disabled || option.disabled">
                </div>
            </div>
        </div>
    `,
    providers: [ObjectUtils,SELECTBUTTON_VALUE_ACCESSOR]
})
export class SelectButton implements ControlValueAccessor {

    @Input() tabindex: number;

    @Input() multiple: boolean;
    
    @Input() style: any;
        
    @Input() styleClass: string;

    @Input() disabled: boolean;

    @Input() dataKey: string
    
    @Input() optionLabel: string;
    
    @Output() onOptionClick: EventEmitter<any> = new EventEmitter();

    @Output() onChange: EventEmitter<any> = new EventEmitter();

    @ContentChild(TemplateRef) itemTemplate;
    
    value: any;
    
    focusedItem: HTMLInputElement;
    
    _options: any[];
    
    onModelChange: Function = () => {};
    
    onModelTouched: Function = () => {};
    
    constructor(public objectUtils: ObjectUtils, private cd: ChangeDetectorRef) {}
    
    @Input() get options(): any[] {
        return this._options;
    }

    set options(val: any[]) {
        let opts = this.optionLabel ? this.objectUtils.generateSelectItems(val, this.optionLabel) : val;
        this._options = opts;
    }
    
    writeValue(value: any) : void {
        this.value = value;
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
    
    onItemClick(event, option: SelectItem, checkbox: HTMLInputElement, index: number) {
        if(this.disabled || option.disabled) {
            return;
        }
        
        checkbox.focus();
        
        if(this.multiple) {
            let itemIndex = this.findItemIndex(option);
            if(itemIndex != -1)
                this.value = this.value.filter((val,i) => i!=itemIndex);
            else
                this.value = [...this.value||[], option.value];
        }
        else {
            this.value = option.value;
        }
        
        this.onOptionClick.emit({
            originalEvent: event,
            option: option,
            index: index
        });
        
        this.onModelChange(this.value);
        
        this.onChange.emit({
            originalEvent: event,
            value: this.value
        });
    }
    
    onFocus(event: Event) {
        this.focusedItem = <HTMLInputElement>event.target;
    }
    
    onBlur(event) {
        this.focusedItem = null;
        this.onModelTouched();
    }
    
    isSelected(option: SelectItem) {
        if(this.multiple)
            return this.findItemIndex(option) != -1;
        else
            return this.objectUtils.equals(option.value, this.value, this.dataKey);
    }
    
    findItemIndex(option: SelectItem) {
        let index = -1;
        if(this.value) {
            for(let i = 0; i < this.value.length; i++) {
                if(this.value[i] == option.value) {
                    index = i;
                    break;
                }
            }
        }
        return index;
    }
}

@NgModule({
    imports: [CommonModule],
    exports: [SelectButton],
    declarations: [SelectButton]
})
export class SelectButtonModule { }
