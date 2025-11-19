import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvoiceService } from '../../services/invoice.service';
import { LucideAngularModule, Users, Plus, Trash2, Copy } from 'lucide-angular';

@Component({
    selector: 'app-student-details',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    templateUrl: './student-details.component.html',
    styleUrls: ['./student-details.component.css']
})
export class StudentDetailsComponent {
    invoiceService = inject(InvoiceService);

    Users = Users;
    Plus = Plus;
    Trash2 = Trash2;
    Copy = Copy;

    addStudent() {
        this.invoiceService.addStudent();
    }

    removeStudent(index: number) {
        this.invoiceService.removeStudent(index);
    }

    copyPrevious(index: number) {
        this.invoiceService.copyPreviousStudent(index);
    }

    update(index: number, field: string, value: string) {
        this.invoiceService.updateStudent(index, { [field]: value });
    }

    trackByIndex(index: number): number {
        return index;
    }

    validateEndDate(index: number, endDate: string) {
        this.invoiceService.validateStudentEndDate(index, endDate);
    }
}
