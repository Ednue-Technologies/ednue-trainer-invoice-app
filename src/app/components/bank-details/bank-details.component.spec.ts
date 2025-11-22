import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BankDetailsComponent } from './bank-details.component';
import { InvoiceService } from '../../services/invoice.service';
import { signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

describe('BankDetailsComponent', () => {
    let component: BankDetailsComponent;
    let fixture: ComponentFixture<BankDetailsComponent>;
    let mockInvoiceService: any;

    beforeEach(async () => {
        mockInvoiceService = {
            bank: signal({ bankName: '', accountHolder: '', accountNumber: '', ifsc: '', branch: '', pan: '' }),
            errors: signal({}),
            updateBank: jasmine.createSpy('updateBank'),
            validateField: jasmine.createSpy('validateField')
        };

        await TestBed.configureTestingModule({
            imports: [BankDetailsComponent, FormsModule, LucideAngularModule],
            providers: [
                { provide: InvoiceService, useValue: mockInvoiceService }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(BankDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call updateBank on update', () => {
        component.update('bankName', 'HDFC');
        expect(mockInvoiceService.updateBank).toHaveBeenCalledWith({ bankName: 'HDFC' });
    });

    it('should call validateField on validate', () => {
        component.validate('bankName', 'HDFC');
        expect(mockInvoiceService.validateField).toHaveBeenCalledWith('bankName', 'HDFC');
    });

    it('should convert input to uppercase in updateWithCaps', () => {
        const event = { target: { value: 'abcd' } } as any;
        component.updateWithCaps('ifsc', event);
        expect(mockInvoiceService.updateBank).toHaveBeenCalledWith({ ifsc: 'ABCD' });
    });

    it('should remove non-digits in updateNumberOnly', () => {
        const event = { target: { value: '123abc456' } } as any;
        component.updateNumberOnly('accountNumber', event);
        expect(mockInvoiceService.updateBank).toHaveBeenCalledWith({ accountNumber: '123456' });
    });
});
