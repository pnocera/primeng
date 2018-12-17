import {NgModule,Component,ElementRef,AfterViewInit,Input,Output,Renderer2} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DomHandler} from '../dom/domhandler';
import {MenuItem} from '../common/menuitem';
import {Location} from '@angular/common';
import {RouterModule} from '@angular/router';

@Component({
    selector: 'p-megaMenu',
    template: `
        <div [class]="styleClass" [ngStyle]="style"
            [ngClass]="{'ng-megamenu ng-widget ng-widget-content ng-corner-all':true,'ng-megamenu-horizontal': orientation == 'horizontal','ng-megamenu-vertical': orientation == 'vertical'}">
            <ul class="ng-megamenu-root-list">
                <ng-template ngFor let-category [ngForOf]="model">
                    <li *ngIf="category.separator" class="ng-menu-separator ng-widget-content" [ngClass]="{'ng-helper-hidden': category.visible === false}">
                    <li *ngIf="!category.separator" #item [ngClass]="{'ng-menuitem ng-corner-all':true,'ng-menuitem-active':item==activeItem, 'ng-helper-hidden': category.visible === false}"
                        (mouseenter)="onItemMouseEnter($event, item, category)" (mouseleave)="onItemMouseLeave($event, item)">
   
                        <a *ngIf="!category.routerLink" [href]="category.url||'#'" [attr.target]="category.target" [attr.title]="category.title" [attr.id]="category.id" (click)="itemClick($event, category)"
                            [ngClass]="{'ng-menuitem-link ng-corner-all':true,'ng-state-disabled':category.disabled}" [ngStyle]="category.style" [class]="category.styleClass">
                            <span class="ng-menuitem-icon" *ngIf="category.icon" [ngClass]="category.icon"></span>
                            <span class="ng-menuitem-text">{{category.label}}</span>
                            <span *ngIf="category.items" class="ng-submenu-icon pi pi-fw" [ngClass]="{'pi-caret-down':orientation=='horizontal','pi-caret-right':orientation=='vertical'}"></span>
                        </a>
                        <a *ngIf="category.routerLink" [routerLink]="category.routerLink" [queryParams]="category.queryParams" [routerLinkActive]="'ng-state-active'" [routerLinkActiveOptions]="category.routerLinkActiveOptions||{exact:false}" 
                            [attr.target]="category.target" [attr.title]="category.title" [attr.id]="category.id"
                            (click)="itemClick($event, category)" [ngClass]="{'ng-menuitem-link ng-corner-all':true,'ng-state-disabled':category.disabled}" [ngStyle]="category.style" [class]="category.styleClass">
                            <span class="ng-menuitem-icon" *ngIf="category.icon" [ngClass]="category.icon"></span>
                            <span class="ng-menuitem-text">{{category.label}}</span>
                        </a>

                        <div class="ng-megamenu-panel ng-widget-content ng-corner-all ng-shadow" *ngIf="category.items">
                            <div class="ng-g">
                                <ng-template ngFor let-column [ngForOf]="category.items">
                                    <div [class]="getColumnClass(category)">
                                        <ng-template ngFor let-submenu [ngForOf]="column">
                                            <ul class="ng-megamenu-submenu">
                                                <li class="ng-widget-header ng-megamenu-submenu-header ng-corner-all">{{submenu.label}}</li>
                                                <ng-template ngFor let-item [ngForOf]="submenu.items">
                                                    <li *ngIf="item.separator" class="ng-menu-separator ng-widget-content" [ngClass]="{'ng-helper-hidden': item.visible === false}">
                                                    <li *ngIf="!item.separator" class="ng-menuitem ng-corner-all" [ngClass]="{'ng-helper-hidden': item.visible === false}">
                                                        <a *ngIf="!item.routerLink" [href]="item.url||'#'" class="ng-menuitem-link ng-corner-all" [attr.target]="item.target" [attr.title]="item.title" [attr.id]="item.id"
                                                            [ngClass]="{'ng-state-disabled':item.disabled}" (click)="itemClick($event, item)">
                                                            <span class="ng-menuitem-icon" *ngIf="item.icon" [ngClass]="item.icon"></span>
                                                            <span class="ng-menuitem-text">{{item.label}}</span>
                                                        </a>
                                                        <a *ngIf="item.routerLink" [routerLink]="item.routerLink" [queryParams]="item.queryParams" [routerLinkActive]="'ng-state-active'" 
                                                            [routerLinkActiveOptions]="item.routerLinkActiveOptions||{exact:false}" class="ng-menuitem-link ng-corner-all" 
                                                             [attr.target]="item.target" [attr.title]="item.title" [attr.id]="item.id"
                                                            [ngClass]="{'ng-state-disabled':item.disabled}" (click)="itemClick($event, item)">
                                                            <span class="ng-menuitem-icon" *ngIf="item.icon" [ngClass]="item.icon"></span>
                                                            <span class="ng-menuitem-text">{{item.label}}</span>
                                                        </a>
                                                    </li>
                                                </ng-template>
                                            </ul>
                                        </ng-template>
                                    </div>
                                </ng-template>
                            </div>
                        </div>
                    </li>
                </ng-template>
                <li class="ng-menuitem ng-menuitem-custom ng-corner-all" *ngIf="orientation === 'horizontal'">
                    <ng-content></ng-content>
                </li>
            </ul>
        </div>
    `,
    providers: [DomHandler]
})
export class MegaMenu {

    @Input() model: MenuItem[];

    @Input() style: any;

    @Input() styleClass: string;
    
    @Input() orientation: string = 'horizontal';

    @Input() autoZIndex: boolean = true;

    @Input() baseZIndex: number = 0;
    
    activeItem: any;

    hideTimeout: any;
                
    constructor(public el: ElementRef, public domHandler: DomHandler, public renderer: Renderer2) {}
    
    onItemMouseEnter(event, item, menuitem: MenuItem) {
        if(menuitem.disabled) {
            return;
        }

        if(this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
        
        this.activeItem = item;

        if(menuitem.items) {
            let submenu = item.children[0].nextElementSibling;
            if (submenu) {
                if (this.autoZIndex) {
                    submenu.style.zIndex = String(this.baseZIndex + (++DomHandler.zindex));
                }

                if (this.orientation === 'horizontal') {
                    submenu.style.top = this.domHandler.getOuterHeight(item.children[0]) + 'px';
                    submenu.style.left = '0px';
                }
                else if (this.orientation === 'vertical') {
                    submenu.style.top = '0px';
                    submenu.style.left = this.domHandler.getOuterWidth(item.children[0]) + 'px';
                }
            }
        }
    }
    
    onItemMouseLeave(event, link) {
        this.hideTimeout = setTimeout(() => {
            this.activeItem = null;
        }, 1000);
    }
    
    itemClick(event, item: MenuItem) {
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
                        
        this.activeItem = null;
    }
    
    getColumnClass(menuitem: MenuItem) {
        let length = menuitem.items ? menuitem.items.length: 0;
        let columnClass;
        switch(length) {
            case 2:
                columnClass= 'ng-g-6';
            break;
            
            case 3:
                columnClass= 'ng-g-4';
            break;
            
            case 4:
                columnClass= 'ng-g-3';
            break;
            
            case 6:
                columnClass= 'ng-g-2';
            break;
                        
            default:
                columnClass= 'ng-g-12';
            break;
        }
        
        return columnClass;
    }
}

@NgModule({
    imports: [CommonModule,RouterModule],
    exports: [MegaMenu,RouterModule],
    declarations: [MegaMenu]
})
export class MegaMenuModule { }