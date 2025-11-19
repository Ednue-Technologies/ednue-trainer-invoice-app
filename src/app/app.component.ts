import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainerDetailsComponent } from './components/trainer-details/trainer-details.component';
import { BankDetailsComponent } from './components/bank-details/bank-details.component';
import { CourseDetailsComponent } from './components/course-details/course-details.component';
import { StudentDetailsComponent } from './components/student-details/student-details.component';
import { InvoiceService } from './services/invoice.service';
import { LucideAngularModule, Send } from 'lucide-angular';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        TrainerDetailsComponent,
        BankDetailsComponent,
        CourseDetailsComponent,
        StudentDetailsComponent,
        LucideAngularModule
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    invoiceService = inject(InvoiceService);
    Send = Send;
    currentYear = new Date().getFullYear();

    generateInvoice() {
        const mailtoLink = this.invoiceService.generateMailto();
        if (mailtoLink) {
            window.location.href = mailtoLink;
        } else {
            alert('Please fix the validation errors before generating the invoice.');
        }
    }
}
