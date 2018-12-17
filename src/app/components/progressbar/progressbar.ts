import {NgModule,Component,Input} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'p-progressBar',
    template: `
        <div [class]="styleClass" [ngStyle]="style" role="progressbar" aria-valuemin="0" [attr.aria-valuenow]="value" aria-valuemax="100"
            [ngClass]="{'ng-progressbar ng-widget ng-widget-content ng-corner-all': true, 'ng-progressbar-determinate': (mode === 'determinate'), 'ng-progressbar-indeterminate': (mode === 'indeterminate')}">
            <div class="ng-progressbar-value ng-progressbar-value-animate ng-widget-header ng-corner-all" [style.width]="value + '%'" style="display:block"></div>
            <div class="ng-progressbar-label" [style.display]="value != null ? 'block' : 'none'" *ngIf="showValue">{{value}}{{unit}}</div>
        </div>
    `
})
export class ProgressBar {

    @Input() value: any;
    
    @Input() showValue: boolean = true;
    
    @Input() style: any;
    
    @Input() styleClass: string;

    @Input() unit: string = '%';
    
    @Input() mode: string = 'determinate';
    
}

@NgModule({
    imports: [CommonModule],
    exports: [ProgressBar],
    declarations: [ProgressBar]
})
export class ProgressBarModule { }