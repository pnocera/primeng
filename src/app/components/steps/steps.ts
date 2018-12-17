import {NgModule,Component,Input,Output,EventEmitter} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MenuItem} from '../common/menuitem';
import {RouterModule} from '@angular/router';

@Component({
    selector: 'p-steps',
    template: `
        <div [ngClass]="{'ng-steps ng-widget ng-helper-clearfix':true,'ng-steps-readonly':readonly}" [ngStyle]="style" [class]="styleClass">
            <ul role="tablist">
                <li *ngFor="let item of model; let i = index" class="ng-steps-item" #menuitem
                    [ngClass]="{'ng-state-highlight ng-steps-current':(i === activeIndex),
                        'ng-state-default':(i !== activeIndex),
                        'ng-state-complete':(i < activeIndex),
                        'ng-state-disabled ng-steps-incomplete':item.disabled||(i !== activeIndex && readonly)}">
                    <a *ngIf="!item.routerLink" [href]="item.url||'#'" class="ng-menuitem-link" (click)="itemClick($event, item, i)" [attr.target]="item.target" [attr.id]="item.id">
                        <span class="ng-steps-number">{{i + 1}}</span>
                        <span class="ng-steps-title">{{item.label}}</span>
                    </a>
                    <a *ngIf="item.routerLink" [routerLink]="item.routerLink" [queryParams]="item.queryParams" [routerLinkActive]="'ng-state-active'" [routerLinkActiveOptions]="item.routerLinkActiveOptions||{exact:false}" class="ng-menuitem-link" (click)="itemClick($event, item, i)" [attr.target]="item.target" [attr.id]="item.id">
                        <span class="ng-steps-number">{{i + 1}}</span>
                        <span class="ng-steps-title">{{item.label}}</span>
                    </a>
                </li>
            </ul>
        </div>
    `
})
export class Steps {
    
    @Input() activeIndex: number = 0;
    
    @Input() model: MenuItem[];
    
    @Input() readonly: boolean =  true;
    
    @Input() style: any;
        
    @Input() styleClass: string;
    
    @Output() activeIndexChange: EventEmitter<any> = new EventEmitter();
    
    itemClick(event: Event, item: MenuItem, i: number) {
        if(this.readonly || item.disabled) {
            event.preventDefault();
            return;
        }
        
        this.activeIndexChange.emit(i);
                
        if(!item.url) {
            event.preventDefault();
        }
        
        if(item.command) {            
            item.command({
                originalEvent: event,
                item: item,
                index: i
            });
        }
    }
    
}

@NgModule({
    imports: [CommonModule,RouterModule],
    exports: [Steps,RouterModule],
    declarations: [Steps]
})
export class StepsModule { }