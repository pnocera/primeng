import {NgModule,Component,ElementRef,Input,Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DomHandler} from '../dom/domhandler';
import {MenuItem} from '../common/menuitem';
import {RouterModule} from '@angular/router';

@Component({
    selector: 'p-tabMenu',
    template: `
        <div [ngClass]="'ng-tabmenu ng-widget ng-widget-content ng-corner-all'" [ngStyle]="style" [class]="styleClass">
            <ul class="ng-tabmenu-nav ng-helper-reset ng-helper-clearfix ng-widget-header ng-corner-all" role="tablist">
                <li *ngFor="let item of model"
                    [ngClass]="{'ng-tabmenuitem ng-state-default ng-corner-top':true,'ng-state-disabled':item.disabled,
                        'ng-tabmenuitem-hasicon':item.icon,'ng-state-active':activeItem==item,'ng-helper-hidden': item.visible === false}"
                        [routerLinkActive]="'ng-state-active'" [routerLinkActiveOptions]="item.routerLinkActiveOptions||{exact:false}">
                    <a *ngIf="!item.routerLink" [href]="item.url||'#'" class="ng-menuitem-link ng-corner-all" (click)="itemClick($event,item)"
                        [attr.target]="item.target" [attr.title]="item.title" [attr.id]="item.id">
                        <span class="ng-menuitem-icon " [ngClass]="item.icon" *ngIf="item.icon"></span>
                        <span class="ng-menuitem-text">{{item.label}}</span>
                    </a>
                    <a *ngIf="item.routerLink" [routerLink]="item.routerLink" [queryParams]="item.queryParams" class="ng-menuitem-link ng-corner-all" (click)="itemClick($event,item)"
                        [attr.target]="item.target" [attr.title]="item.title" [attr.id]="item.id">
                        <span class="ng-menuitem-icon " [ngClass]="item.icon" *ngIf="item.icon"></span>
                        <span class="ng-menuitem-text">{{item.label}}</span>
                    </a>
                </li>
            </ul>
        </div>
    `,
    providers: [DomHandler]
})
export class TabMenu {

    @Input() model: MenuItem[];

    @Input() activeItem: MenuItem;

    @Input() popup: boolean;

    @Input() style: any;

    @Input() styleClass: string;

    itemClick(event: Event, item: MenuItem) {
        if(item.disabled) {
            event.preventDefault();
            return;
        }

        if(!item.url) {
            event.preventDefault();
        }

        if(item.command) {
            item.command({
                originalEvent: event,
                item: item
            });
        }

        this.activeItem = item;
    }
}

@NgModule({
    imports: [CommonModule,RouterModule],
    exports: [TabMenu,RouterModule],
    declarations: [TabMenu]
})
export class TabMenuModule { }
