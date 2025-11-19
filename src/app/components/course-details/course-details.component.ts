import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvoiceService } from '../../services/invoice.service';
import { LucideAngularModule, BookOpen, Users, DollarSign, Calculator } from 'lucide-angular';

@Component({
    selector: 'app-course-details',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    templateUrl: './course-details.component.html',
    styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent {
    invoiceService = inject(InvoiceService);

    BookOpen = BookOpen;
    Users = Users;
    DollarSign = DollarSign;
    Calculator = Calculator;

    update(field: string, value: any) {
        if (field === 'totalStudents') {
            const newCount = Number(value);
            const currentStudents = this.invoiceService.students();

            // Check if we are reducing the count
            if (newCount < currentStudents.length) {
                // Get the students that will be removed
                const studentsToRemove = currentStudents.slice(newCount);

                // Check if any of them have data (name, start date, or end date)
                const hasData = studentsToRemove.some(s => s.name || s.startDate || s.endDate);

                if (hasData) {
                    if (!confirm('Reducing the student count will delete existing data. Are you sure?')) {
                        // If cancelled, we need to revert the input.
                        // We use setTimeout to ensure the UI updates after the current event loop
                        setTimeout(() => {
                            this.invoiceService.course.update(c => ({ ...c }));
                        });
                        return;
                    }
                }
            }
        }
        this.invoiceService.updateCourse({ [field]: value });
    }

    validate(field: string, value: any) {
        this.invoiceService.validateField(field, value);
    }
}
