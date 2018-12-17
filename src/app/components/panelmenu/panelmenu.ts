import {NgModule,Component,ElementRef,OnDestroy,Input} from '@angular/core';
import {trigger,state,style,transition,animate} from '@angular/animations';
import {CommonModule} from '@angular/common';
import {MenuItem} from '../common/menuitem';
import {RouterModule} from '@angular/router';

export class BasePanelMenuItem {
        
    handleClick(event, item) {
        if(item.disabled) {
            event.preventDefault();
            return;
        }
        
        item.expanded = !item.expanded;
        
        if(!item.url) {
            event.preventDefault();
        }
                   
        if(item.command) {
            item.command({
                originalEvent: event,
                item: item
            });
        }
    }
}

@Component({
    selector: 'p-panelMenuSub',
    template: `
        <ul class="ng-submenu-list" [@submenu]="expanded ? {value: 'visible', params: {transitionParams: transitionOptions}} : {value: 'hidden', params: {transitionParams: transitionOptions}}">
            <ng-template ngFor let-child [ngForOf]="item.items">
                <li *ngIf="child.separator" class="ng-menu-separator ng-widget-content">
                <li *ngIf="!child.separator" class="ng-menuitem ng-corner-all" [ngClass]="child.styleClass" [class.ng-helper-hidden]="child.visible === false" [ngStyle]="child.style">
                    <a *ngIf="!child.routerLink" [href]="child.url||'#'" class="ng-menuitem-link ng-corner-all" [attr.tabindex]="item.expanded ? null : '-1'" [attr.id]="child.id"
                        [ngClass]="{'ng-state-disabled':child.disabled}" 
                        (click)="handleClick($event,child)" [attr.target]="child.target" [attr.title]="child.title">
                        <span class="ng-panelmenu-icon pi pi-fw" [ngClass]="{'pi-caret-right':!child.expanded,'pi-caret-down':child.expanded}" *ngIf="child.items"></span
                        ><span class="ng-menuitem-icon" [ngClass]="child.icon" *ngIf="child.icon"></span
                        ><span class="ng-menuitem-text">{{child.label}}</span>
                    </a>
                    <a *ngIf="child.routerLink" [routerLink]="child.routerLink" [queryParams]="child.queryParams" [routerLinkActive]="'ng-state-active'" [routerLinkActiveOptions]="child.routerLinkActiveOptions||{exact:false}" class="ng-menuitem-link ng-corner-all" 
                        [ngClass]="{'ng-state-disabled':child.disabled}" [attr.tabindex]="item.expanded ? null : '-1'" [attr.id]="child.id"
                        (click)="handleClick($event,child)" [attr.target]="child.target" [attr.title]="child.title">
                        <span class="ng-panelmenu-icon pi pi-fw" [ngClass]="{'pi-caret-right':!child.expanded,'pi-caret-down':child.expanded}" *ngIf="child.items"></span
                        ><span class="ng-menuitem-icon" [ngClass]="child.icon" *ngIf="child.icon"></span
                        ><span class="ng-menuitem-text">{{child.label}}</span>
                    </a>
                    <p-panelMenuSub [item]="child" [expanded]="child.expanded" [transitionOptions]="transitionOptions" *ngIf="child.items"></p-panelMenuSub>
                </li>
            </ng-template>
        </ul>
    `,
    animations: [
        trigger('submenu', [
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
export class PanelMenuSub extends BasePanelMenuItem {
    
    @Input() item: MenuItem;
    
    @Input() expanded: boolean;

    @Input() transitionOptions: string;
}

@Component({
    selector: 'p-panelMenu',
    template: `
        <div [class]="styleClass" [ngStyle]="style" [ngClass]="'ng-panelmenu ng-widget'">
            <ng-container *ngFor="let item of model;let f=first;let l=last;">
                <div class="ng-panelmenu-panel" [ngClass]="{'ng-helper-hidden': item.visible === false}">
                    <div [ngClass]="{'ng-widget ng-panelmenu-header ng-state-default':true,'ng-corner-top':f,'ng-corner-bottom':l&&!item.expanded,
                    'ng-state-active':item.expanded,'ng-state-disabled':item.disabled}" [class]="item.styleClass" [ngStyle]="item.style">
                        <a *ngIf="!item.routerLink" [href]="item.url||'#'" (click)="handleClick($event,item)"
                           [attr.target]="item.target" [attr.title]="item.title" class="ng-panelmenu-header-link">
                        <span *ngIf="item.items" class="ng-panelmenu-icon pi pi-fw" [ngClass]="{'pi-caret-right':!item.expanded,'pi-caret-down':item.expanded}"></span
                        ><span class="ng-menuitem-icon" [ngClass]="item.icon" *ngIf="item.icon"></span
                        ><span class="ng-menuitem-text">{{item.label}}</span>
                        </a>
                        <a *ngIf="item.routerLink" [routerLink]="item.routerLink" [queryParams]="item.queryParams" [routerLinkActive]="'ng-state-active'" [routerLinkActiveOptions]="item.routerLinkActiveOptions||{exact:false}"
                           (click)="handleClick($event,item)" [attr.target]="item.target" [attr.title]="item.title" class="ng-panelmenu-header-link">
                        <span *ngIf="item.items" class="ng-panelmenu-icon pi pi-fw" [ngClass]="{'pi-caret-right':!item.expanded,'pi-caret-down':item.expanded}"></span
                        ><span class="ng-menuitem-icon" [ngClass]="item.icon" *ngIf="item.icon"></span
                        ><span class="ng-menuitem-text">{{item.label}}</span>
                        </a>
                    </div>
                    <div *ngIf="item.items" class="ng-panelmenu-content-wrapper" [@rootItem]="item.expanded ? {value: 'visible', params: {transitionParams: transitionOptions}} : {value: 'hidden', params: {transitionParams: transitionOptions}}"  (@rootItem.done)="onToggleDone()"
                         [ngClass]="{'ng-panelmenu-content-wrapper-overflown': !item.expanded||animating}">
                        <div class="ng-panelmenu-content ng-widget-content">
                            <p-panelMenuSub [item]="item" [expanded]="true" [transitionOptions]="transitionOptions" class="ng-panelmenu-root-submenu"></p-panelMenuSub>
                        </div>
                    </div>
                </div>
            </ng-container>
        </div>
    `,
    animations: [
        trigger('rootItem', [
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
export class PanelMenu extends BasePanelMenuItem {
    
    @Input() model: MenuItem[];

    @Input() style: any;

    @Input() styleClass: string;

    @Input() multiple: boolean = true;

    @Input() transitionOptions: string = '400ms cubic-bezier(0.86, 0, 0.07, 1)';
    
    public animating: boolean;
                
    collapseAll() {
    	for(let item of this.model) {
    		if(item.expanded) {
    			item.expanded = false;
    		}
    	}
    }

    handleClick(event, item) {
    	if(!this.multiple) {
            for(let modelItem of this.model) {
        		if(item !== modelItem && modelItem.expanded) {
        			modelItem.expanded = false;
        		}
        	}
    	}
        
        this.animating = true;
        super.handleClick(event, item);
    }
    
    onToggleDone() {
        this.animating = false;
    }

}

@NgModule({
    imports: [CommonModule,RouterModule],
    exports: [PanelMenu,RouterModule],
    declarations: [PanelMenu,PanelMenuSub]
})
export class PanelMenuModule { }
