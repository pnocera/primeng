import { TestBed, ComponentFixture, tick, fakeAsync, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Dropdown } from './dropdown';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '../../../../node_modules/@angular/forms';

describe('Dropdown', () => {
    
    let dropdown: Dropdown;
    let fixture: ComponentFixture<Dropdown>;
    
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          NoopAnimationsModule,
          FormsModule
        ],
        declarations: [
          Dropdown,
        ]
      }).compileComponents();
      
      fixture = TestBed.createComponent(Dropdown);
      dropdown = fixture.componentInstance;
    });

    it('should disabled', () => {
      dropdown.disabled=true;
      dropdown.editable=true;
      fixture.detectChanges();

      const containerEl = fixture.debugElement.query(By.css('.ng-dropdown')).nativeElement;
      const hiddenEl = fixture.debugElement.queryAll(By.css('.ng-helper-hidden-accessible'))[1].children[0].nativeElement;
      const editableInputEl = fixture.debugElement.query(By.css('.ng-dropdown')).children[2].nativeElement;
      expect(containerEl.className).toContain('ng-state-disabled')
      expect(hiddenEl.disabled).toEqual(true);
      expect(editableInputEl.disabled).toEqual(true);
    });

    it('should get a name', () => {
      dropdown.name = "Primeng";
      fixture.detectChanges();

      const selectEl = fixture.debugElement.query(By.css('.ng-helper-hidden-accessible')).children[0].nativeElement;     
      expect(selectEl.name).toEqual("Primeng")
    });

    it('should change dropdown icon', () => {
      dropdown.dropdownIcon = "Primeng";
      fixture.detectChanges();

      const dropdownSpanEl = fixture.debugElement.query(By.css('.ng-dropdown-trigger-icon.ng-clickable')).nativeElement;
      expect(dropdownSpanEl.className).toContain("Primeng")
    });

    it('should change style and styleClass', () => {
      dropdown.styleClass = "Primeng";
      dropdown.style = {'primeng':'rocks'}
      fixture.detectChanges();

      const containerEl = fixture.debugElement.query(By.css('.ng-dropdown'));
      expect(containerEl.nativeElement.className).toContain("Primeng");
      expect(containerEl.nativeElement.style.primeng).toEqual("rocks");
    });

    it('should change panelStyleClass', () => {
      dropdown.panelStyleClass = "Primeng";
      dropdown.options = [
        {name: 'New York', code: 'NY'},
        {name: 'Rome', code: 'RM'},
        {name: 'London', code: 'LDN'},
        {name: 'Istanbul', code: 'IST'},
        {name: 'Paris', code: 'PRS'}
      ];
      const container = fixture.debugElement.query(By.css('div')).nativeElement;
      container.click();
      fixture.detectChanges();

      const dropdownPanel = fixture.debugElement.query(By.css('.ng-dropdown-panel'));
      expect(dropdownPanel).toBeTruthy();
      expect(dropdownPanel.nativeElement.className).toContain("Primeng");
    });

    it('should open when clicked', () => {
      dropdown.options = [
        {name: 'New York', code: 'NY'},
        {name: 'Rome', code: 'RM'},
        {name: 'London', code: 'LDN'},
        {name: 'Istanbul', code: 'IST'},
        {name: 'Paris', code: 'PRS'}
      ];
      fixture.detectChanges();
      
      const container = fixture.debugElement.query(By.css('.ng-dropdown')).nativeElement;
      container.click();
      fixture.detectChanges();

      const dropdownPanel = fixture.debugElement.query(By.css('.ng-dropdown-panel'));
      expect(container.className).toContain('ng-dropdown-open');
      expect(dropdownPanel).toBeTruthy();
    });

    it('should close', () => {
      dropdown.options = [
        {name: 'New York', code: 'NY'},
        {name: 'Rome', code: 'RM'},
        {name: 'London', code: 'LDN'},
        {name: 'Istanbul', code: 'IST'},
        {name: 'Paris', code: 'PRS'}
      ];
      fixture.detectChanges();
      
      const container = fixture.debugElement.query(By.css('.ng-dropdown')).nativeElement;
      container.click();
      fixture.detectChanges();

      container.click();
      fixture.detectChanges();

      const dropdownPanel = fixture.debugElement.query(By.css('.ng-dropdown-panel'));
      expect(container.className).not.toContain('ng-dropdown-open');
      expect(dropdownPanel).toBeFalsy();
    });

    it('should item selected', () => {
      dropdown.options = [
        {name: 'New York', code: 'NY'},
        {name: 'Rome', code: 'RM'},
        {name: 'London', code: 'LDN'},
        {name: 'Istanbul', code: 'IST'},
        {name: 'Paris', code: 'PRS'}
      ];
      fixture.detectChanges();
      
      const container = fixture.debugElement.query(By.css('.ng-dropdown')).nativeElement;
      container.click();
      fixture.detectChanges();

      const items = fixture.debugElement.query(By.css('.ng-dropdown-items'));
      items.children[2].nativeElement.click();
      fixture.detectChanges();
      expect(dropdown.selectedOption.name).toEqual('London');
      expect(items.children[2].nativeElement.className).toContain('ng-state-highlight')
    });

    it('should item clear', () => {
      dropdown.options = [
        {label:'Select City', value:null},
        {label:'New York', value:{id:1, name: 'New York', code: 'NY'}},
        {label:'Rome', value:{id:2, name: 'Rome', code: 'RM'}},
        {label:'London', value:{id:3, name: 'London', code: 'LDN'}},
        {label:'Istanbul', value:{id:4, name: 'Istanbul', code: 'IST'}},
        {label:'Paris', value:{id:5, name: 'Paris', code: 'PRS'}}
      ];
      dropdown.showClear=true;
      fixture.detectChanges();
      
      const container = fixture.debugElement.query(By.css('.ng-dropdown')).nativeElement;
      container.click();
      fixture.detectChanges();

      const items = fixture.debugElement.query(By.css('.ng-dropdown-items'));
      items.children[2].nativeElement.click();
      fixture.detectChanges();
      const itemCloseIcon = fixture.debugElement.query(By.css('.ng-dropdown-clear-icon'));
      itemCloseIcon.nativeElement.click();
      fixture.detectChanges();

      expect(dropdown.selectedOption).toEqual({ label: 'Select City', value: null });
      expect(items.children[2].nativeElement.className).not.toContain('ng-state-highlight')
    });

    it('should filtered', async(() => {
      dropdown.options = [
        {label: 'New York', code: 'NY'},
        {label: 'Rome', code: 'RM'},
        {label: 'London', code: 'LDN'},
        {label: 'Istanbul', code: 'IST'},
        {label: 'Paris', code: 'PRS'}
      ];
      dropdown.filter = true;
      fixture.detectChanges();
      
      const container = fixture.debugElement.query(By.css('.ng-dropdown')).nativeElement;
      container.click();
      fixture.detectChanges();

      const filterDiv = fixture.debugElement.query(By.css('.ng-dropdown-filter-container'));
      expect(filterDiv).toBeTruthy();
      const filterInputEl = fixture.debugElement.query(By.css('.ng-dropdown-filter'));
      filterInputEl.nativeElement.value = "n";
      filterInputEl.nativeElement.dispatchEvent(new Event('keydown'));
      const event = {'target':{'value':'n'}};
      dropdown.onFilter(event)
      fixture.detectChanges();

      const items=fixture.debugElement.query(By.css('.ng-dropdown-items'));
      expect(items.nativeElement.children.length).toEqual(3);
    }));

    it('should filtered and display not found warning', async(() => {
      dropdown.options = [
        {label: 'New York', code: 'NY'},
        {label: 'Rome', code: 'RM'},
        {label: 'London', code: 'LDN'},
        {label: 'Istanbul', code: 'IST'},
        {label: 'Paris', code: 'PRS'}
      ];
      dropdown.filter = true;
      fixture.detectChanges();
      
      const container = fixture.debugElement.query(By.css('.ng-dropdown')).nativeElement;
      container.click();
      fixture.detectChanges();

      const filterDiv = fixture.debugElement.query(By.css('.ng-dropdown-filter-container'));
      expect(filterDiv).toBeTruthy();
      const filterInputEl = fixture.debugElement.query(By.css('.ng-dropdown-filter'));
      filterInputEl.nativeElement.value = "primeng";
      filterInputEl.nativeElement.dispatchEvent(new Event('keydown'));
      const event = {'target':{'value':'primeng'}};
      dropdown.onFilter(event)
      fixture.detectChanges();

      const items = fixture.debugElement.query(By.css('.ng-dropdown-items'));
      const emptyMesage = items.children[0]; 
      expect(items.nativeElement.children.length).toEqual(1);
      expect(emptyMesage).toBeTruthy();
      expect(emptyMesage.nativeElement.textContent).toEqual("No results found");
    }));

});
