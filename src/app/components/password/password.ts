import {NgModule,Directive,ElementRef,HostListener,Input,OnDestroy,DoCheck,NgZone} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DomHandler} from '../dom/domhandler';

@Directive({
    selector: '[pPassword]',
    host: {
        '[class.ng-inputtext]': 'true',
        '[class.ng-corner-all]': 'true',
        '[class.ng-state-default]': 'true',
        '[class.ng-widget]': 'true',
        '[class.ng-state-filled]': 'filled'
    },
    providers: [DomHandler]
})
export class Password implements OnDestroy,DoCheck {

    @Input() promptLabel: string = 'Enter a password';

    @Input() weakLabel: string = 'Weak';

    @Input() mediumLabel: string = 'Medium';

    @Input() strongLabel: string = 'Strong';
    
    @Input() feedback: boolean = true;
    
    panel: HTMLDivElement;
    
    meter: any;
    
    info: any;
    
    filled: boolean;
    
    constructor(public el: ElementRef, public domHandler: DomHandler, public zone: NgZone) {}
    
    ngDoCheck() {
        this.updateFilledState();
    }
    
    //To trigger change detection to manage ng-state-filled for material labels when there is no value binding
    @HostListener('input', ['$event']) 
    onInput(e) {
        this.updateFilledState();
    }
    
    updateFilledState() {
        this.filled = this.el.nativeElement.value && this.el.nativeElement.value.length;
    }

    createPanel() {
        this.panel = document.createElement('div');
        this.panel.className = 'ng-password-panel ng-widget ng-state-highlight ng-corner-all';
        this.meter = document.createElement('div');
        this.meter.className = 'ng-password-meter';
        this.info = document.createElement('div');
        this.info.className = 'ng-password-info';
        this.info.textContent = this.promptLabel;
        this.panel.appendChild(this.meter);
        this.panel.appendChild(this.info);
        this.panel.style.minWidth = this.domHandler.getOuterWidth(this.el.nativeElement) + 'px';
        document.body.appendChild(this.panel);
    }
        
    @HostListener('focus', ['$event']) 
    onFocus(e) {
        if (this.feedback) {
            if (!this.panel) {
                this.createPanel();
            }
    
            this.panel.style.zIndex = String(++DomHandler.zindex);
            this.zone.runOutsideAngular(() => {
                setTimeout(() => {
                    this.domHandler.addClass(this.panel, 'ng-password-panel-visible');
                    this.domHandler.removeClass(this.panel, 'ng-password-panel-hidden');
                }, 1);
                this.domHandler.absolutePosition(this.panel, this.el.nativeElement);
            });
        }
    }
    
    @HostListener('blur', ['$event']) 
    onBlur(e) {   
        if (this.feedback) {
            this.domHandler.addClass(this.panel, 'ng-password-panel-hidden');
            this.domHandler.removeClass(this.panel, 'ng-password-panel-visible');

            this.zone.runOutsideAngular(() => {
                setTimeout(() => {
                    this.ngOnDestroy();
                }, 150);
            });
        }     
    }
    
    @HostListener('keyup', ['$event'])
    onKeyup(e) {
        if (this.feedback) {
            let value = e.target.value,
            label = null,
            meterPos = null;

            if(value.length === 0) {
                label = this.promptLabel;
                meterPos = '0px 0px';
            }
            else {
                var score = this.testStrength(value);

                if(score < 30) {
                    label = this.weakLabel;
                    meterPos = '0px -10px';
                }
                else if(score >= 30 && score < 80) {
                    label = this.mediumLabel;
                    meterPos = '0px -20px';
                } 
                else if(score >= 80) {
                    label = this.strongLabel;
                    meterPos = '0px -30px';
                }
            }

            this.meter.style.backgroundPosition = meterPos;
            this.info.textContent = label;
        }
    }
    
    testStrength(str: string) {
        let grade: number = 0;
        let val;

        val = str.match('[0-9]');
        grade += this.normalize(val ? val.length : 1/4, 1) * 25;

        val = str.match('[a-zA-Z]');
        grade += this.normalize(val ? val.length : 1/2, 3) * 10;

        val = str.match('[!@#$%^&*?_~.,;=]');
        grade += this.normalize(val ? val.length : 1/6, 1) * 35;

        val = str.match('[A-Z]');
        grade += this.normalize(val ? val.length : 1/6, 1) * 30;

        grade *= str.length / 8;

        return grade > 100 ? 100 : grade;
    }
    
    normalize(x, y) {
        let diff = x - y;

        if(diff <= 0)
            return x / y;
        else
            return 1 + 0.5 * (x / (x + y/4));
    }
    
    get disabled(): boolean {
        return this.el.nativeElement.disabled;
    }
    
    ngOnDestroy() {
        if (this.panel) {
            document.body.removeChild(this.panel);
            this.panel = null;
            this.meter = null;
            this.info = null;
        }
    }
}

@NgModule({
    imports: [CommonModule],
    exports: [Password],
    declarations: [Password]
})
export class PasswordModule { }
