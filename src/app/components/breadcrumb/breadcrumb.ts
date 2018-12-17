import {NgModule,Component,Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MenuItem} from '../common/menuitem';
import {Location} from '@angular/common';
import {RouterModule} from '@angular/router';

@Component({
    selector: 'p-breadcrumb',
    template: `
        <div [class]="styleClass" [ngStyle]="style" [ngClass]="'ng-breadcrumb ng-widget ng-widget-header ng-helper-clearfix ng-corner-all'">
            <ul>
                <li class="ng-breadcrumb-home" *ngIf="home">
                    <a *ngIf="!home.routerLink" [href]="home.url||'#'" class="ng-menuitem-link" (click)="itemClick($event, home)" 
                        [ngClass]="{'ng-state-disabled':home.disabled}" [attr.target]="home.target" [attr.title]="home.title" [attr.id]="home.id">
                        <span [ngClass]="home.icon||'pi pi-home'"></span>
                    </a>
                    <a *ngIf="home.routerLink" [routerLink]="home.routerLink" [queryParams]="home.queryParams" [routerLinkActive]="'ng-state-active'" [routerLinkActiveOptions]="home.routerLinkActiveOptions||{exact:false}" class="ng-menuitem-link" (click)="itemClick($event, home)" 
                        [ngClass]="{'ng-state-disabled':home.disabled}" [attr.target]="home.target" [attr.title]="home.title" [attr.id]="home.id">
                        <span [ngClass]="home.icon||'pi pi-home'"></span>
                    </a>
                </li>
                <li class="ng-breadcrumb-chevron pi pi-chevron-right" *ngIf="model&&home"></li>
                <ng-template ngFor let-item let-end="last" [ngForOf]="model">
                    <li role="menuitem">
                        <a *ngIf="!item.routerLink" [href]="item.url||'#'" class="ng-menuitem-link" (click)="itemClick($event, item)" 
                            [ngClass]="{'ng-state-disabled':item.disabled}" [attr.target]="item.target" [attr.title]="item.title" [attr.id]="item.id">
                            <span *ngIf="item.icon" class="ng-menuitem-icon" [ngClass]="item.icon"></span>
                            <span class="ng-menuitem-text">{{item.label}}</span>
                        </a>
                        <a *ngIf="item.routerLink" [routerLink]="item.routerLink" [queryParams]="item.queryParams" [routerLinkActive]="'ng-state-active'" [routerLinkActiveOptions]="item.routerLinkActiveOptions||{exact:false}" class="ng-menuitem-link" (click)="itemClick($event, item)" 
                            [ngClass]="{'ng-state-disabled':item.disabled}" [attr.target]="item.target" [attr.title]="item.title" [attr.id]="item.id">
                            <span *ngIf="item.icon" class="ng-menuitem-icon" [ngClass]="item.icon"></span>
                            <span class="ng-menuitem-text">{{item.label}}</span>
                        </a>
                    </li>
                    <li class="ng-breadcrumb-chevron pi pi-chevron-right" *ngIf="!end"></li>
                </ng-template>
            </ul>
        </div>
    `
})
export class Breadcrumb {

    @Input() model: MenuItem[];

    @Input() style: any;

    @Input() styleClass: string;
    
    @Input() home: MenuItem;
        
    itemClick(event, item: MenuItem) {
        if (item.disabled) {
            event.preventDefault();
            return;
        }
        
        if (!item.url) {
            event.preventDefault();
        }
        
        if (item.command) {            
            item.command({
                originalEvent: event,
                item: item
            });
        }
    }
    
    onHomeClick(event) {
        if (this.home) {
            this.itemClick(event, this.home);
        }
    }
}

@NgModule({
    imports: [CommonModule,RouterModule],
    exports: [Breadcrumb,RouterModule],
    declarations: [Breadcrumb]
})
export class BreadcrumbModule { }
