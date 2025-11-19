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
        this.invoiceService.updateCourse({ [field]: value });
    }

    validate(field: string, value: any) {
        this.invoiceService.validateField(field, value);
    }
}
