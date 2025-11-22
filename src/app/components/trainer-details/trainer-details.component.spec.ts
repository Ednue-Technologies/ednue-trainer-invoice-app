import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrainerDetailsComponent } from './trainer-details.component';
import { InvoiceService } from '../../services/invoice.service';
import { signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, User, Mail, Phone, Calendar } from 'lucide-angular';

describe('TrainerDetailsComponent', () => {
    let component: TrainerDetailsComponent;
    let fixture: ComponentFixture<TrainerDetailsComponent>;
    let mockInvoiceService: any;

    beforeEach(async () => {
        mockInvoiceService = {
            trainer: signal({ name: '', email: '', contact: '', date: '' }),
            errors: signal({}),
            updateTrainer: jasmine.createSpy('updateTrainer'),
            validateField: jasmine.createSpy('validateField')
        };

        await TestBed.configureTestingModule({
            imports: [TrainerDetailsComponent, FormsModule, LucideAngularModule],
            providers: [
                { provide: InvoiceService, useValue: mockInvoiceService }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TrainerDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call updateTrainer on update', () => {
        component.update('name', 'John Doe');
        expect(mockInvoiceService.updateTrainer).toHaveBeenCalledWith({ name: 'John Doe' });
    });

    it('should call validateField on validate', () => {
        component.validate('trainerName', 'John Doe');
        expect(mockInvoiceService.validateField).toHaveBeenCalledWith('trainerName', 'John Doe');
    });

    it('should display error message if validation fails', () => {
        mockInvoiceService.errors.set({ trainerName: 'Name is required' });
        fixture.detectChanges();
        const errorMsg = fixture.nativeElement.querySelector('.error-msg');
        expect(errorMsg.textContent).toContain('Name is required');
    });
});
