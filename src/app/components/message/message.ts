import {NgModule,Component,Input,Output,EventEmitter,Optional} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'p-message',
    template: `
        <div aria-live="polite" class="ng-message ng-widget ng-corner-all" *ngIf="severity"
        [ngClass]="{'ng-message-info': (severity === 'info'),
                'ng-message-warn': (severity === 'warn'),
                'ng-message-error': (severity === 'error'),
                'ng-message-success': (severity === 'success')}">
            <span class="ng-message-icon" [ngClass]="icon"></span>
            <span class="ng-message-text" [innerHTML]="text"></span>
        </div>
    `
})
export class UIMessage {

    @Input() severity: string;

    @Input() text: string;

    get icon(): string {
        let icon: string = null;

        if(this.severity) {
            switch(this.severity) {
                case 'success':
                    icon = 'pi pi-check';
                break;

                case 'info':
                    icon = 'pi pi-info-circle';
                break;

                case 'error':
                    icon = 'pi pi-times';
                break;

                case 'warn':
                    icon = 'pi pi-exclamation-triangle';
                break;

                default:
                    icon = 'pi pi-info-circle';
                break;
            }
        }

        return icon;
    }
}

@NgModule({
    imports: [CommonModule],
    exports: [UIMessage],
    declarations: [UIMessage]
})
export class MessageModule { }
