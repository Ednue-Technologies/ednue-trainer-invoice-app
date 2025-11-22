import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CourseDetailsComponent } from './course-details.component';
import { InvoiceService } from '../../services/invoice.service';
import { signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

describe('CourseDetailsComponent', () => {
    let component: CourseDetailsComponent;
    let fixture: ComponentFixture<CourseDetailsComponent>;
    let mockInvoiceService: any;

    beforeEach(async () => {
        mockInvoiceService = {
            course: signal({ courseName: '', totalStudents: 0, pricePerStudent: 0 }),
            students: signal([]),
            totalAmount: signal(0),
            errors: signal({}),
            updateCourse: jasmine.createSpy('updateCourse'),
            validateField: jasmine.createSpy('validateField')
        };

        await TestBed.configureTestingModule({
            imports: [CourseDetailsComponent, FormsModule, LucideAngularModule],
            providers: [
                { provide: InvoiceService, useValue: mockInvoiceService }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CourseDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call updateCourse on update', () => {
        component.update('courseName', 'Angular Basics');
        expect(mockInvoiceService.updateCourse).toHaveBeenCalledWith({ courseName: 'Angular Basics' });
    });

    it('should warn when reducing totalStudents with data', () => {
        spyOn(window, 'confirm').and.returnValue(false);
        mockInvoiceService.students.set([{ name: 'Student 1' }, { name: 'Student 2' }]);

        component.update('totalStudents', 1);

        expect(window.confirm).toHaveBeenCalled();
        expect(mockInvoiceService.updateCourse).not.toHaveBeenCalled();
    });

    it('should not warn when reducing totalStudents without data', () => {
        spyOn(window, 'confirm').and.returnValue(true);
        mockInvoiceService.students.set([{ name: '' }, { name: '' }]);

        component.update('totalStudents', 1);

        expect(window.confirm).not.toHaveBeenCalled();
        expect(mockInvoiceService.updateCourse).toHaveBeenCalledWith({ totalStudents: 1 });
    });

    it('should call validateField on validate', () => {
        component.validate('courseName', 'Angular Basics');
        expect(mockInvoiceService.validateField).toHaveBeenCalledWith('courseName', 'Angular Basics');
    });
});
