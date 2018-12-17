import {browser, by, element, ElementArrayFinder, ElementFinder} from "protractor";

describe('Growl', () => {
    let successButton: ElementFinder;
    let growlItemContainer: ElementArrayFinder;

    beforeEach(() => {
        browser.get('#/growl');
        successButton = element(by.css('.implementation .ng-button-success'));
        growlItemContainer = element.all(by.css('.implementation .ng-growl .ng-growl-item-container .ng-growl-item'));
    });

    it('should show and hide success messages', () => {
        successButton.click();
        expect<any>(growlItemContainer.count()).toBe(1);
        browser.sleep(4000);
        expect<any>(growlItemContainer.count()).toBe(0);
    });
});
