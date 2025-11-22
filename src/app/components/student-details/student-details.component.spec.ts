import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentDetailsComponent } from './student-details.component';
import { InvoiceService } from '../../services/invoice.service';
import { signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

describe('StudentDetailsComponent', () => {
    let component: StudentDetailsComponent;
    let fixture: ComponentFixture<StudentDetailsComponent>;
    let mockInvoiceService: any;

    beforeEach(async () => {
        mockInvoiceService = {
            students: signal([{ id: 1, name: '', courseName: '', duration: '', durationUnit: 'days', startDate: '', endDate: '' }]),
            errors: signal({}),
            addStudent: jasmine.createSpy('addStudent'),
            removeStudent: jasmine.createSpy('removeStudent'),
            copyPreviousStudent: jasmine.createSpy('copyPreviousStudent'),
            copyToAllStudents: jasmine.createSpy('copyToAllStudents'),
            updateStudent: jasmine.createSpy('updateStudent'),
            validateStudentEndDate: jasmine.createSpy('validateStudentEndDate')
        };

        await TestBed.configureTestingModule({
            imports: [StudentDetailsComponent, FormsModule, LucideAngularModule],
            providers: [
                { provide: InvoiceService, useValue: mockInvoiceService }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(StudentDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call addStudent', () => {
        component.addStudent();
        expect(mockInvoiceService.addStudent).toHaveBeenCalled();
    });

    it('should call removeStudent', () => {
        component.removeStudent(0);
        expect(mockInvoiceService.removeStudent).toHaveBeenCalledWith(0);
    });

    it('should call copyPrevious', () => {
        component.copyPrevious(1);
        expect(mockInvoiceService.copyPreviousStudent).toHaveBeenCalledWith(1);
    });

    it('should call copyToAll', () => {
        component.copyToAll(0);
        expect(mockInvoiceService.copyToAllStudents).toHaveBeenCalledWith(0);
    });

    it('should call updateStudent on update', () => {
        component.update(0, 'name', 'Jane Doe');
        expect(mockInvoiceService.updateStudent).toHaveBeenCalledWith(0, { name: 'Jane Doe' });
    });

    it('should call validateStudentEndDate', () => {
        component.validateEndDate(0, '2023-12-31');
        expect(mockInvoiceService.validateStudentEndDate).toHaveBeenCalledWith(0, '2023-12-31');
    });
});
