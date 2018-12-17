import { NgModule, Component, Input, Output, EventEmitter, ElementRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule, Header, Footer } from '../common/shared';
import { BlockableUI } from '../common/blockableui';

@Component({
    selector: 'p-card',
    template: `
        <div [ngClass]="'ng-card ng-widget ng-widget-content ng-corner-all'" [ngStyle]="style" [class]="styleClass">
            <div class="ng-card-header" *ngIf="headerFacet">
               <ng-content select="p-header"></ng-content>
            </div>
            <div class="ng-card-body">
                <div class="ng-card-title" *ngIf="header">{{header}}</div>
                <div class="ng-card-subtitle" *ngIf="subheader">{{subheader}}</div>
                <div class="ng-card-content">
                    <ng-content></ng-content>
                </div>
                <div class="ng-card-footer" *ngIf="footerFacet">
                    <ng-content select="p-footer"></ng-content>
                </div>
            </div>
        </div>
    `
})
export class Card implements BlockableUI {

    @Input() header: string;

    @Input() subheader: string;

    @Input() style: any;

    @Input() styleClass: string;

    @ContentChild(Header) headerFacet;

    @ContentChild(Footer) footerFacet;

    constructor(private el: ElementRef) { }

    getBlockableElement(): HTMLElement  {
        return this.el.nativeElement.children[0];
    }

}

@NgModule({
    imports: [CommonModule],
    exports: [Card, SharedModule],
    declarations: [Card]
})
export class CardModule { }
