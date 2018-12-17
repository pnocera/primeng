import {NgModule,Component,AfterViewInit,AfterViewChecked,OnDestroy,Input,Output,EventEmitter,ViewChild,ElementRef,Renderer2} from '@angular/core';
import {trigger, state, style, transition, animate} from '@angular/animations';
import {CommonModule} from '@angular/common';
import {DomHandler} from '../dom/domhandler';

@Component({
    selector: 'p-sidebar',
    template: `
        <div #container [ngClass]="{'ng-sidebar ng-widget ng-widget-content ng-shadow':true, 'ng-sidebar-active': visible, 
            'ng-sidebar-left': (position === 'left'), 'ng-sidebar-right': (position === 'right'),
            'ng-sidebar-top': (position === 'top'), 'ng-sidebar-bottom': (position === 'bottom'), 
            'ng-sidebar-full': fullScreen}"
            [@panelState]="visible ? 'visible' : 'hidden'" [ngStyle]="style" [class]="styleClass">
            <a [ngClass]="{'ng-sidebar-close ng-corner-all':true}" *ngIf="showCloseIcon" tabindex="0" role="button" (click)="close($event)" (keydown.enter)="close($event)">
                <span class="pi pi-times"></span>
            </a>
            <ng-content></ng-content>
        </div>
    `,
    animations: [
        trigger('panelState', [
            state('hidden', style({
                opacity: 0
            })),
            state('visible', style({
                opacity: 1
            })),
            transition('visible => hidden', animate('300ms ease-in')),
            transition('hidden => visible', animate('300ms ease-out'))
        ])
    ],
    providers: [DomHandler]
})
export class Sidebar implements AfterViewInit, AfterViewChecked, OnDestroy {

    @Input() position: string = 'left';

    @Input() fullScreen: boolean;

    @Input() appendTo: string;

    @Input() blockScroll: boolean = false;

    @Input() style: any;

    @Input() styleClass: string;

    @Input() autoZIndex: boolean = true;

    @Input() baseZIndex: number = 0;

    @Input() modal: boolean = true;

    @Input() dismissible: boolean = true;

    @Input() showCloseIcon: boolean = true;

    @ViewChild('container') containerViewChild: ElementRef;

    @Output() onShow: EventEmitter<any> = new EventEmitter();

    @Output() onHide: EventEmitter<any> = new EventEmitter();

    @Output() visibleChange:EventEmitter<any> = new EventEmitter();

    initialized: boolean;

    _visible: boolean;

    preventVisibleChangePropagation: boolean;

    mask: HTMLDivElement;

    maskClickListener: Function;

    executePostDisplayActions: boolean;

    constructor(public el: ElementRef, public domHandler: DomHandler, public renderer: Renderer2) {}

    ngAfterViewInit() {
        this.initialized = true;

        if(this.appendTo) {
            if(this.appendTo === 'body')
                document.body.appendChild(this.containerViewChild.nativeElement);
            else
                this.domHandler.appendChild(this.containerViewChild.nativeElement, this.appendTo);
        }

        if(this.visible) {
            this.show();
        }
    }

    @Input() get visible(): boolean {
        return this._visible;
    }

    set visible(val:boolean) {
        this._visible = val;

        if(this.initialized && this.containerViewChild && this.containerViewChild.nativeElement) {
            if(this._visible)
                this.show();
            else {
                if(this.preventVisibleChangePropagation)
                    this.preventVisibleChangePropagation = false;
                else
                    this.hide();
            }
        }
    }

    ngAfterViewChecked() {
        if(this.executePostDisplayActions) {
            this.onShow.emit({});
            this.executePostDisplayActions = false;
        }
    }

    show() {
        this.executePostDisplayActions = true;
        if(this.autoZIndex) {
            this.containerViewChild.nativeElement.style.zIndex = String(this.baseZIndex + (++DomHandler.zindex));
        }

        if(this.modal) {
            this.enableModality();
        }
    }

    hide() {
        this.onHide.emit({});

        if(this.modal) {
            this.disableModality();
        }
    }

    close(event: Event) {
        this.preventVisibleChangePropagation = true;
        this.hide();
        this.visibleChange.emit(false);
        event.preventDefault();
    }

    enableModality() {
        if(!this.mask) {
            this.mask = document.createElement('div');
            this.mask.style.zIndex = String(parseInt(this.containerViewChild.nativeElement.style.zIndex) - 1);
            this.domHandler.addMultipleClasses(this.mask, 'ng-widget-overlay ng-sidebar-mask');
            
            if(this.dismissible){
                this.maskClickListener = this.renderer.listen(this.mask, 'click', (event: any) => {
                    this.close(event);
                });
            }

            document.body.appendChild(this.mask);
            if(this.blockScroll) {
                this.domHandler.addClass(document.body, 'ng-overflow-hidden');
            }
        }
    }

    disableModality() {
        if(this.mask) {
            this.unbindMaskClickListener();
            document.body.removeChild(this.mask);
            if(this.blockScroll) {
                this.domHandler.removeClass(document.body, 'ng-overflow-hidden');
            }
            this.mask = null;
        }
    }

    unbindMaskClickListener() {
        if(this.maskClickListener) {
            this.maskClickListener();
            this.maskClickListener = null;
        }
    }

    ngOnDestroy() {
        this.initialized = false;

        if(this.visible) {
            this.hide();
        }

        if(this.appendTo) {
            this.el.nativeElement.appendChild(this.containerViewChild.nativeElement);
        }

		this.unbindMaskClickListener();
    }
}

@NgModule({
    imports: [CommonModule],
    exports: [Sidebar],
    declarations: [Sidebar]
})
export class SidebarModule { }
