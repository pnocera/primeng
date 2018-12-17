import { NgModule, Component, ElementRef, Input, Output, EventEmitter, AfterContentInit, ContentChildren, ContentChild, QueryList, TemplateRef,forwardRef, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectItem } from '../common/selectitem';
import { SharedModule, PrimeTemplate, Footer, Header } from '../common/shared';
import { DomHandler } from '../dom/domhandler';
import { ObjectUtils } from '../utils/objectutils';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export const LISTBOX_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Listbox),
    multi: true
};

@Component({
    selector: 'p-listbox',
    template: `
    <div [ngClass]="{'ng-listbox ng-inputtext ng-widget ng-widget-content ng-corner-all':true,'ng-state-disabled':disabled,'ng-state-focus':focus}" [ngStyle]="style" [class]="styleClass">
      <div class="ng-helper-hidden-accessible">
        <input type="text" readonly="readonly" (focus)="onInputFocus($event)" (blur)="onInputBlur($event)">
      </div>
      <div class="ng-widget-header ng-corner-all ng-listbox-header ng-helper-clearfix" *ngIf="headerFacet">
        <ng-content select="p-header"></ng-content>
      </div>
      <div class="ng-widget-header ng-corner-all ng-listbox-header ng-helper-clearfix" *ngIf="(checkbox && multiple && showToggleAll) || filter" [ngClass]="{'ng-listbox-header-w-checkbox': checkbox}">
        <div class="ng-chkbox ng-widget" *ngIf="checkbox && multiple && showToggleAll">
          <div class="ng-helper-hidden-accessible">
            <input type="checkbox" readonly="readonly" [checked]="allChecked" (focus)="onHeaderCheckboxFocus()" (blur)="onHeaderCheckboxBlur()" (keydown.space)="toggleAll($event)">
          </div>
          <div #headerchkbox class="ng-chkbox-box ng-widget ng-corner-all ng-state-default" [ngClass]="{'ng-state-active': allChecked, 'ng-state-focus': headerCheckboxFocus}" (click)="toggleAll($event)">
            <span class="ng-chkbox-icon ng-clickable" [ngClass]="{'pi pi-check':allChecked}"></span>
          </div>
        </div>
        <div class="ng-listbox-filter-container" *ngIf="filter">
          <input type="text" role="textbox" [value]="filterValue||''" (input)="onFilter($event)" class="ng-inputtext ng-widget ng-state-default ng-corner-all" [disabled]="disabled">
          <span class="ng-listbox-filter-icon pi pi-search"></span>
        </div>
      </div>
      <div class="ng-listbox-list-wrapper" [ngStyle]="listStyle">
        <ul class="ng-listbox-list">
          <li *ngFor="let option of options; let i = index;" [style.display]="isItemVisible(option) ? 'block' : 'none'" [attr.tabindex]="option.disabled ? null : '0'"
              [ngClass]="{'ng-listbox-item ng-corner-all':true,'ng-state-highlight':isSelected(option), 'ng-state-disabled': option.disabled}"
              (click)="onOptionClick($event,option)" (dblclick)="onOptionDoubleClick($event,option)" (touchend)="onOptionTouchEnd($event,option)" (keydown)="onOptionKeyDown($event,option)">
            <div class="ng-chkbox ng-widget" *ngIf="checkbox && multiple">
              <div class="ng-chkbox-box ng-widget ng-corner-all ng-state-default" [ngClass]="{'ng-state-active':isSelected(option)}">
                <span class="ng-chkbox-icon ng-clickable" [ngClass]="{'pi pi-check':isSelected(option)}"></span>
              </div>
            </div>
            <span *ngIf="!itemTemplate">{{option.label}}</span>
            <ng-container *ngTemplateOutlet="itemTemplate; context: {$implicit: option, index: i}"></ng-container>
          </li>
        </ul>
      </div>
      <div class="ng-listbox-footer ng-widget-header ng-corner-all" *ngIf="footerFacet">
        <ng-content select="p-footer"></ng-content>
      </div>
    </div>
  `,
    providers: [DomHandler, ObjectUtils, LISTBOX_VALUE_ACCESSOR]
})
export class Listbox implements AfterContentInit, ControlValueAccessor {

    @Input() multiple: boolean;

    @Input() style: any;

    @Input() styleClass: string;

    @Input() listStyle: any;

    @Input() readonly: boolean;

    @Input() disabled: boolean;

    @Input() checkbox: boolean = false;

    @Input() filter: boolean = false;

    @Input() filterMode: string = 'contains';

    @Input() metaKeySelection: boolean = true;

    @Input() dataKey: string;

    @Input() showToggleAll: boolean = true;

    @Input() optionLabel: string;

    @Output() onChange: EventEmitter<any> = new EventEmitter();

    @Output() onDblClick: EventEmitter<any> = new EventEmitter();

    @ViewChild('headerchkbox') headerCheckboxViewChild: ElementRef;

    @ContentChild(Header) headerFacet;

    @ContentChild(Footer) footerFacet;

    @ContentChildren(PrimeTemplate) templates: QueryList<any>;

    public itemTemplate: TemplateRef<any>;

    public _filterValue: string;

    public filtered: boolean;

    public value: any;

    public onModelChange: Function = () => { };

    public onModelTouched: Function = () => { };

    public optionTouched: boolean;

    public focus: boolean;

    public _options: any[];

    public headerCheckboxFocus: boolean;
    
    constructor(public el: ElementRef, public domHandler: DomHandler, public objectUtils: ObjectUtils, public cd: ChangeDetectorRef) { }

    @Input() get options(): any[] {
        return this._options;
    }

    set options(val: any[]) {
        let opts = this.optionLabel ? this.objectUtils.generateSelectItems(val, this.optionLabel) : val;
        this._options = opts;
    }
    
    @Input() get filterValue(): string {
        return this._filterValue;
    }
    
    set filterValue(val: string) {
        this._filterValue = val;
    }

    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'item':
                    this.itemTemplate = item.template;
                    break;

                default:
                    this.itemTemplate = item.template;
                    break;
            }
        });
    }

    writeValue(value: any): void {
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

    onOptionClick(event, option) {
        if (this.disabled || option.disabled || this.readonly) {
            return;
        }

        if (this.multiple) {
            if (this.checkbox)
                this.onOptionClickCheckbox(event, option);
            else
                this.onOptionClickMultiple(event, option);
        }
        else {
            this.onOptionClickSingle(event, option);
        }
        this.optionTouched = false;
    }

    onOptionTouchEnd(event, option) {
        if (this.disabled || option.disabled || this.readonly) {
            return;
        }

        this.optionTouched = true;
    }

    onOptionDoubleClick(event: Event, option: SelectItem): any {
        if (this.disabled || option.disabled || this.readonly) {
            return;
        }

        this.onDblClick.emit({
            originalEvent: event,
            value: this.value
        })
    }

    onOptionClickSingle(event, option) {
        let selected = this.isSelected(option);
        let valueChanged = false;
        let metaSelection = this.optionTouched ? false : this.metaKeySelection;

        if (metaSelection) {
            let metaKey = (event.metaKey || event.ctrlKey);

            if (selected) {
                if (metaKey) {
                    this.value = null;
                    valueChanged = true;
                }
            }
            else {
                this.value = option.value;
                valueChanged = true;
            }
        }
        else {
            this.value = selected ? null : option.value;
            valueChanged = true;
        }

        if (valueChanged) {
            this.onModelChange(this.value);
            this.onChange.emit({
                originalEvent: event,
                value: this.value
            });
        }
    }

    onOptionClickMultiple(event, option) {
        let selected = this.isSelected(option);
        let valueChanged = false;
        let metaSelection = this.optionTouched ? false : this.metaKeySelection;

        if (metaSelection) {
            let metaKey = (event.metaKey || event.ctrlKey);

            if (selected) {
                if (metaKey) {
                    this.removeOption(option);
                }
                else {
                    this.value = [option.value];
                }
                valueChanged = true;
            }
            else {
                this.value = (metaKey) ? this.value || [] : [];
                this.value = [...this.value, option.value];
                valueChanged = true;
            }
        }
        else {
            if (selected) {
                this.removeOption(option);
            }
            else {
                this.value = [...this.value || [], option.value];
            }

            valueChanged = true;
        }

        if (valueChanged) {
            this.onModelChange(this.value);
            this.onChange.emit({
                originalEvent: event,
                value: this.value
            });
        }
    }

    onOptionClickCheckbox(event, option) {
        if (this.disabled || this.readonly) {
            return;
        }

        let selected = this.isSelected(option);

        if (selected) {
            this.removeOption(option);
        }
        else {
            this.value = this.value ? this.value : [];
            this.value = [...this.value, option.value];
        }

        this.onModelChange(this.value);
        this.onChange.emit({
            originalEvent: event,
            value: this.value
        });
    }

    removeOption(option: any): void {
        this.value = this.value.filter(val => !this.objectUtils.equals(val, option.value, this.dataKey));
    }

    isSelected(option: SelectItem) {
        let selected = false;

        if (this.multiple) {
            if (this.value) {
                for (let val of this.value) {
                    if (this.objectUtils.equals(val, option.value, this.dataKey)) {
                        selected = true;
                        break;
                    }
                }
            }
        }
        else {
            selected = this.objectUtils.equals(this.value, option.value, this.dataKey);
        }

        return selected;
    }

    get allChecked(): boolean {
        if (this.filterValue)
            return this.allFilteredSelected();
        else
            return this.value && this.options && (this.value.length > 0 && this.value.length === this.getEnabledOptionCount());
    }

    getEnabledOptionCount(): number {
        if (this.options) {
            let count = 0;
            for (let opt of this.options) {
                if (!opt.disabled) {
                    count++;
                }
            }

            return count;
        }
        else {
            return 0;
        }
    }

    allFilteredSelected(): boolean {
        let allSelected: boolean;
        let options = this.filterValue ? this.getFilteredOptions() : this.options;

        if (this.value && options && options.length)  {
            allSelected = true;
            for (let opt of this.options) {
                if (this.isItemVisible(opt)) {
                    if (!this.isSelected(opt)) {
                        allSelected = false;
                        break;
                    }
                }
            }
        }

        return allSelected;
    }

    onFilter(event) {
        this._filterValue = event.target.value;
    }

    toggleAll(event) {
        if (this.disabled || this.readonly || !this.options || this.options.length === 0) {
            return;
        }

        if (this.allChecked) {
            this.value = [];
        }
        else {
            if (this.options) {
                this.value = [];
                for (let i = 0; i < this.options.length; i++) {
                    let opt = this.options[i];
                    if (this.isItemVisible(opt) && !opt.disabled) {
                        this.value.push(opt.value);
                    }
                }
            }
        }

        this.onModelChange(this.value);
        this.onChange.emit({ originalEvent: event, value: this.value });
        event.preventDefault();
    }

    isItemVisible(option: SelectItem): boolean {
        if (this.filterValue) {
            let visible;
            let filterText = this.objectUtils.removeAccents(this.filterValue).toLowerCase();

            switch (this.filterMode) {
                case 'startsWith':
                    visible = this.objectUtils.removeAccents(option.label).toLowerCase().indexOf(filterText) === 0;
                    break;

                case 'contains':
                    visible = this.objectUtils.removeAccents(option.label).toLowerCase().indexOf(filterText) > -1;
                    break;

                default:
                    visible = true;
            }

            return visible;
        }
        else {
            return true;
        }
    }

    onInputFocus(event) {
        this.focus = true;
    }

    onInputBlur(event) {
        this.focus = false;
    }
    
    onOptionKeyDown(event:KeyboardEvent, option) {
        if (this.readonly) {
            return;
        }
        
        let item = <HTMLLIElement> event.currentTarget;
        
        switch(event.which) {
            //down
            case 40:
                var nextItem = this.findNextItem(item);
                if(nextItem) {
                    nextItem.focus();
                }
                
                event.preventDefault();
            break;
            
            //up
            case 38:
                var prevItem = this.findPrevItem(item);
                if(prevItem) {
                    prevItem.focus();
                }
                
                event.preventDefault();
            break;
            
            //enter
            case 13:
                this.onOptionClick(event, option);
                event.preventDefault();
            break;
        }
    }
    
    findNextItem(item) {
        let nextItem = item.nextElementSibling;

        if (nextItem)
            return this.domHandler.hasClass(nextItem, 'ng-state-disabled') || this.domHandler.isHidden(nextItem) ? this.findNextItem(nextItem) : nextItem;
        else
            return null;
    }

    findPrevItem(item) {
        let prevItem = item.previousElementSibling;
        
        if (prevItem)
            return this.domHandler.hasClass(prevItem, 'ng-state-disabled') || this.domHandler.isHidden(prevItem) ? this.findPrevItem(prevItem) : prevItem;
        else
            return null;
    } 
    
    getFilteredOptions() {
        let filteredOptions = [];
        if(this.filterValue) {
            for (let i = 0; i < this.options.length; i++) {
                let opt = this.options[i];
                if (this.isItemVisible(opt) && !opt.disabled) {
                    filteredOptions.push(opt);
                }
            }
            return filteredOptions;
        }
        else {
            return this.options;
        }
    }

    onHeaderCheckboxFocus() {
        this.headerCheckboxFocus = true;
    }

    onHeaderCheckboxBlur() {
        this.headerCheckboxFocus = false;
    }
}

@NgModule({
    imports: [CommonModule, SharedModule],
    exports: [Listbox, SharedModule],
    declarations: [Listbox]
})
export class ListboxModule { }

