import {NgModule,Directive,ElementRef,HostListener,Input,DoCheck,Optional} from '@angular/core';
import {NgModel} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Directive({
    selector: '[pInputText]',
    host: {
        '[class.ng-inputtext]': 'true',
        '[class.ng-corner-all]': 'true',
        '[class.ng-state-default]': 'true',
        '[class.ng-widget]': 'true',
        '[class.ng-state-filled]': 'filled'
    }
})
export class InputText implements DoCheck {

    filled: boolean;

    constructor(public el: ElementRef, @Optional() public ngModel: NgModel) {}
        
    ngDoCheck() {
        this.updateFilledState();
    }
    
    //To trigger change detection to manage ng-state-filled for material labels when there is no value binding
    @HostListener('input', ['$event']) 
    onInput(e) {
        this.updateFilledState();
    }
    
    updateFilledState() {
        this.filled = (this.el.nativeElement.value && this.el.nativeElement.value.length) ||
                        (this.ngModel && this.ngModel.model);
    }
}

@NgModule({
    imports: [CommonModule],
    exports: [InputText],
    declarations: [InputText]
})
export class InputTextModule { }