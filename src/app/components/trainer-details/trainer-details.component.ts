import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvoiceService } from '../../services/invoice.service';
import { LucideAngularModule, User, Mail, Phone, Calendar } from 'lucide-angular';

@Component({
    selector: 'app-trainer-details',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    templateUrl: './trainer-details.component.html',
    styleUrls: ['./trainer-details.component.css']
})
export class TrainerDetailsComponent {
    invoiceService = inject(InvoiceService);

    // Icons
    User = User;
    Mail = Mail;
    Phone = Phone;
    Calendar = Calendar;

    update(field: string, value: string) {
        this.invoiceService.updateTrainer({ [field]: value });
    }

    validate(field: string, value: string) {
        this.invoiceService.validateField(field, value);
    }
}