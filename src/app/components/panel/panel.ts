import {NgModule,Component,Input,Output,EventEmitter,ElementRef,ContentChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule,Footer} from '../common/shared';
import {BlockableUI} from '../common/blockableui';
import {trigger,state,style,transition,animate} from '@angular/animations';

let idx: number = 0;

@Component({
    selector: 'p-panel',
    template: `
        <div [attr.id]="id" [ngClass]="'ng-panel ng-widget ng-widget-content ng-corner-all'" [ngStyle]="style" [class]="styleClass">
            <div [ngClass]="{'ng-panel-titlebar ng-widget-header ng-helper-clearfix ng-corner-all': true, 'ng-panel-titlebar-clickable': (toggleable && toggler === 'header')}" 
                *ngIf="showHeader" (click)="onHeaderClick($event)">
                <span class="ng-panel-title" *ngIf="header">{{header}}</span>
                <ng-content select="p-header"></ng-content>
                <a *ngIf="toggleable" [attr.id]="id + '-label'" class="ng-panel-titlebar-icon ng-panel-titlebar-toggler ng-corner-all ng-state-default" tabindex="0"
                    (click)="onIconClick($event)" (keydown.enter)="onIconClick($event)" [attr.aria-controls]="id + '-content'" role="tab" [attr.aria-expanded]="!collapsed">
                    <span [class]="collapsed ? expandIcon : collapseIcon"></span>
                </a>
            </div>
            <div [attr.id]="id + '-content'" class="ng-panel-content-wrapper" [@panelContent]="collapsed ? {value: 'hidden', params: {transitionParams: transitionOptions}} : {value: 'visible', params: {transitionParams: transitionOptions}}" (@panelContent.done)="onToggleDone($event)"
                [ngClass]="{'ng-panel-content-wrapper-overflown': collapsed||animating}"
                role="region" [attr.aria-hidden]="collapsed" [attr.aria-labelledby]="id + '-label'">
                <div class="ng-panel-content ng-widget-content">
                    <ng-content></ng-content>
                </div>
                
                <div class="ng-panel-footer ng-widget-content" *ngIf="footerFacet">
                    <ng-content select="p-footer"></ng-content>
                </div>
            </div>
        </div>
    `,
    animations: [
        trigger('panelContent', [
            state('hidden', style({
                height: '0',
                opacity: 0
            })),
            state('visible', style({
                height: '*',
                opacity: 1
            })),
            transition('visible <=> hidden', animate('{{transitionParams}}'))
        ])
    ]
})
export class Panel implements BlockableUI {

    @Input() toggleable: boolean;

    @Input() header: string;

    @Input() collapsed: boolean = false;
    
    @Input() style: any;
    
    @Input() styleClass: string;
    
    @Input() expandIcon: string = 'pi pi-plus';
    
    @Input() collapseIcon: string = 'pi pi-minus';
  
    @Input() showHeader: boolean = true;

    @Input() toggler: string = "icon";
    
    @Output() collapsedChange: EventEmitter<any> = new EventEmitter();

    @Output() onBeforeToggle: EventEmitter<any> = new EventEmitter();

    @Output() onAfterToggle: EventEmitter<any> = new EventEmitter();
    
    @Input() transitionOptions: string = '400ms cubic-bezier(0.86, 0, 0.07, 1)';

    @ContentChild(Footer) footerFacet;
    
    animating: boolean;
    
    id: string = `ng-panel-${idx++}`;
    
    constructor(private el: ElementRef) {}

    onHeaderClick(event: Event) {
        if (this.toggler === 'header') {
            this.toggle(event);
        }
    }

    onIconClick(event: Event) {
        if (this.toggler === 'icon') {
            this.toggle(event);
        }
    }
    
    toggle(event: Event) {
        if(this.animating) {
            return false;
        }
        
        this.animating = true;
        this.onBeforeToggle.emit({originalEvent: event, collapsed: this.collapsed});
        
        if(this.toggleable) {
            if(this.collapsed)
                this.expand(event);
            else
                this.collapse(event);
        }
        
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
        this.onAfterToggle.emit({originalEvent: event, collapsed: this.collapsed});
    }

}

@NgModule({
    imports: [CommonModule],
    exports: [Panel,SharedModule],
    declarations: [Panel]
})
export class PanelModule { }
