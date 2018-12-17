import {NgModule,Component,Input,Output,EventEmitter,ElementRef} from '@angular/core';
import {trigger,state,style,transition,animate} from '@angular/animations';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../common/shared';
import {BlockableUI} from '../common/blockableui';

let idx: number = 0;

@Component({
    selector: 'p-fieldset',
    template: `
        <fieldset [attr.id]="id" [ngClass]="{'ng-fieldset ng-widget ng-widget-content ng-corner-all': true, 'ng-fieldset-toggleable': toggleable}" [ngStyle]="style" [class]="styleClass">
            <legend class="ng-fieldset-legend ng-corner-all ng-state-default ng-unselectable-text">
                <ng-container *ngIf="toggleable; else legendContent">
                    <a tabindex="0" (click)="toggle($event)" (keydown.enter)="toggle($event)" [attr.aria-controls]="id + '-content'" [attr.aria-expanded]="!collapsed">
                        <ng-container *ngTemplateOutlet="legendContent"></ng-container>
                    </a>
                </ng-container>
                <ng-template #legendContent>
                    <span class="ng-fieldset-toggler pi" *ngIf="toggleable" [ngClass]="{'pi-minus': !collapsed,'pi-plus':collapsed}"></span>
                    <span class="ng-fieldset-legend-text">{{legend}}</span>
                    <ng-content select="p-header"></ng-content>
                </ng-template>
            </legend>
            <div [attr.id]="id + '-content'" class="ng-fieldset-content-wrapper" [@fieldsetContent]="collapsed ? {value: 'hidden', params: {transitionParams: transitionOptions}} : {value: 'visible', params: {transitionParams: transitionOptions}}" 
                        [ngClass]="{'ng-fieldset-content-wrapper-overflown': collapsed||animating}" [attr.aria-hidden]="collapsed"
                         (@fieldsetContent.done)="onToggleDone($event)" role="region">
                <div class="ng-fieldset-content">
                    <ng-content></ng-content>
                </div>
            </div>
        </fieldset>
    `,
    animations: [
        trigger('fieldsetContent', [
            state('hidden', style({
                height: '0px'
            })),
            state('visible', style({
                height: '*'
            })),
            transition('visible => hidden', animate('{{transitionParams}}')),
            transition('hidden => visible', animate('{{transitionParams}}'))
        ])
    ]
})
export class Fieldset implements BlockableUI {

    @Input() legend: string;

    @Input() toggleable: boolean;

    @Input() collapsed: boolean = false;

    @Output() collapsedChange: EventEmitter<any> = new EventEmitter();
    
    @Output() onBeforeToggle: EventEmitter<any> = new EventEmitter();

    @Output() onAfterToggle: EventEmitter<any> = new EventEmitter();
    
    @Input() style: any;
        
    @Input() styleClass: string;

    @Input() transitionOptions: string = '400ms cubic-bezier(0.86, 0, 0.07, 1)';
    
    public animating: boolean;
    
    constructor(private el: ElementRef) {}
    
    id: string = `ng-fieldset-${idx++}`;
        
    toggle(event) {
        if(this.animating) {
            return false;
        }
        
        this.animating = true;
        this.onBeforeToggle.emit({originalEvent: event, collapsed: this.collapsed});
        
        if(this.collapsed)
            this.expand(event);
        else
            this.collapse(event);
            
        this.onAfterToggle.emit({originalEvent: event, collapsed: this.collapsed});   
        event.preventDefault();
    }
    
    expand(event) {
        this.collapsed = false;
        this.collapsedChange.emit(this.collapsed);
    }
    
    collapse(event) {
        this.collapsed = true;
        this.collapsedChange.emit(this.collapsed);
    }
    
    getBlockableElement(): HTMLElement {
        return this.el.nativeElement.children[0];
    }
    
    onToggleDone(event: Event) {
        this.animating = false;
    }

}

@NgModule({
    imports: [CommonModule],
    exports: [Fieldset,SharedModule],
    declarations: [Fieldset]
})
export class FieldsetModule { }