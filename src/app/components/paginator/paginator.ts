import {NgModule,Component,OnInit,ElementRef,Input,Output,SimpleChange,EventEmitter,TemplateRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {DropdownModule} from '../dropdown/dropdown';
import {SelectItem} from '../common/selectitem';
import {SharedModule} from '../common/shared';

@Component({
    selector: 'p-paginator',
    template: `
        <div [class]="styleClass" [ngStyle]="style" [ngClass]="'ng-paginator ng-widget ng-widget-header ng-unselectable-text ng-helper-clearfix'"
            *ngIf="alwaysShow ? true : (pageLinks && pageLinks.length > 1)">
            <div class="ng-paginator-left-content" *ngIf="templateLeft">
                <ng-container *ngTemplateOutlet="templateLeft; context: {$implicit: paginatorState}"></ng-container>
            </div>
            <a [attr.tabindex]="isFirstPage() ? null : '0'" class="ng-paginator-first ng-paginator-element ng-state-default ng-corner-all"
                    (click)="changePageToFirst($event)" (keydown.enter)="changePageToFirst($event)" [ngClass]="{'ng-state-disabled':isFirstPage()}" [tabindex]="isFirstPage() ? -1 : null">
                <span class="ng-paginator-icon pi pi-step-backward"></span>
            </a>
            <a tabindex="0" [attr.tabindex]="isFirstPage() ? null : '0'" class="ng-paginator-prev ng-paginator-element ng-state-default ng-corner-all"
                    (click)="changePageToPrev($event)" (keydown.enter)="changePageToPrev($event)" [ngClass]="{'ng-state-disabled':isFirstPage()}" [tabindex]="isFirstPage() ? -1 : null">
                <span class="ng-paginator-icon pi pi-caret-left"></span>
            </a>
            <span class="ng-paginator-pages">
                <a tabindex="0" *ngFor="let pageLink of pageLinks" class="ng-paginator-page ng-paginator-element ng-state-default ng-corner-all"
                    (click)="onPageLinkClick($event, pageLink - 1)" (keydown.enter)="onPageLinkClick($event, pageLink - 1)" [ngClass]="{'ng-state-active': (pageLink-1 == getPage())}">{{pageLink}}</a>
            </span>
            <a [attr.tabindex]="isLastPage() ? null : '0'" class="ng-paginator-next ng-paginator-element ng-state-default ng-corner-all"
                    (click)="changePageToNext($event)" (keydown.enter)="changePageToNext($event)" [ngClass]="{'ng-state-disabled':isLastPage()}" [tabindex]="isLastPage() ? -1 : null">
                <span class="ng-paginator-icon pi pi-caret-right"></span>
            </a>
            <a [attr.tabindex]="isLastPage() ? null : '0'" class="ng-paginator-last ng-paginator-element ng-state-default ng-corner-all"
                    (click)="changePageToLast($event)" (keydown.enter)="changePageToLast($event)" [ngClass]="{'ng-state-disabled':isLastPage()}" [tabindex]="isLastPage() ? -1 : null">
                <span class="ng-paginator-icon pi pi-step-forward"></span>
            </a>
            <p-dropdown [options]="rowsPerPageItems" [(ngModel)]="rows" *ngIf="rowsPerPageOptions" 
                (onChange)="onRppChange($event)" [autoWidth]="false" [appendTo]="dropdownAppendTo"></p-dropdown>
            <div class="ng-paginator-right-content" *ngIf="templateRight">
                <ng-container *ngTemplateOutlet="templateRight; context: {$implicit: paginatorState}"></ng-container>
            </div>
        </div>
    `
})
export class Paginator implements OnInit {

    @Input() pageLinkSize: number = 5;

    @Output() onPageChange: EventEmitter<any> = new EventEmitter();

    @Input() style: any;

    @Input() styleClass: string;

    @Input() alwaysShow: boolean = true;
    
    @Input() templateLeft: TemplateRef<any>;
    
    @Input() templateRight: TemplateRef<any>;

    @Input() dropdownAppendTo: any;

    pageLinks: number[];

    _totalRecords: number = 0;

    _first: number = 0;

    _rows: number = 0;
    
    _rowsPerPageOptions: number[];
    
    rowsPerPageItems: SelectItem[];
    
    paginatorState: any;
    
    ngOnInit() {
        this.updatePaginatorState();
    }

    @Input() get totalRecords(): number {
        return this._totalRecords;
    }

    set totalRecords(val:number) {
        this._totalRecords = val;
        this.updatePageLinks();
        this.updatePaginatorState();
    }

    @Input() get first(): number {
        return this._first;
    }

    set first(val:number) {
        this._first = val;
        this.updatePageLinks();
        this.updatePaginatorState();
    }

    @Input() get rows(): number {
        return this._rows;
    }

    set rows(val:number) {
        this._rows = val;
        this.updatePageLinks();
        this.updatePaginatorState();
    }
    
    @Input() get rowsPerPageOptions(): number[] {
        return this._rowsPerPageOptions;
    }

    set rowsPerPageOptions(val:number[]) {
        this._rowsPerPageOptions = val;
        if(this._rowsPerPageOptions) {
            this.rowsPerPageItems = [];
            for(let opt of this._rowsPerPageOptions) {
                this.rowsPerPageItems.push({label: String(opt), value: opt});
            }
        }
    }

    isFirstPage() {
        return this.getPage() === 0;
    }

    isLastPage() {
        return this.getPage() === this.getPageCount() - 1;
    }

    getPageCount() {
        return Math.ceil(this.totalRecords/this.rows)||1;
    }

    calculatePageLinkBoundaries() {
        let numberOfPages = this.getPageCount(),
        visiblePages = Math.min(this.pageLinkSize, numberOfPages);

        //calculate range, keep current in middle if necessary
        let start = Math.max(0, Math.ceil(this.getPage() - ((visiblePages) / 2))),
        end = Math.min(numberOfPages - 1, start + visiblePages - 1);

        //check when approaching to last page
        var delta = this.pageLinkSize - (end - start + 1);
        start = Math.max(0, start - delta);

        return [start, end];
    }

    updatePageLinks() {
        this.pageLinks = [];
        let boundaries = this.calculatePageLinkBoundaries(),
        start = boundaries[0],
        end = boundaries[1];

        for(let i = start; i <= end; i++) {
            this.pageLinks.push(i + 1);
        }
    }

    changePage(p :number) {
        var pc = this.getPageCount();

        if(p >= 0 && p < pc) {
            this.first = this.rows * p;
            var state = {
                page: p,
                first: this.first,
                rows: this.rows,
                pageCount: pc
            };
            this.updatePageLinks();

            this.onPageChange.emit(state);
            this.updatePaginatorState();
        }
    }

    getPage(): number {
        return Math.floor(this.first / this.rows);
    }

    changePageToFirst(event) {
      if(!this.isFirstPage()){
          this.changePage(0);
      }

      event.preventDefault();
    }

    changePageToPrev(event) {
        this.changePage(this.getPage() - 1);
        event.preventDefault();
    }

    changePageToNext(event) {
        this.changePage(this.getPage()  + 1);
        event.preventDefault();
    }

    changePageToLast(event) {
      if(!this.isLastPage()){
          this.changePage(this.getPageCount() - 1);
      }

      event.preventDefault();
    }

    onPageLinkClick(event, page) {
        this.changePage(page);
        event.preventDefault();
    }

    onRppChange(event) {
        this.changePage(this.getPage());
    }
    
    updatePaginatorState() {
        this.paginatorState = {
            page: this.getPage(),
            rows: this.rows,
            first: this.first,
            totalRecords: this.totalRecords
        }
    }
}

@NgModule({
    imports: [CommonModule,DropdownModule,FormsModule,SharedModule],
    exports: [Paginator,DropdownModule,FormsModule,SharedModule],
    declarations: [Paginator]
})
export class PaginatorModule { }
