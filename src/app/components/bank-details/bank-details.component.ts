import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvoiceService } from '../../services/invoice.service';
import { LucideAngularModule, Landmark, CreditCard, FileText, MapPin } from 'lucide-angular';

@Component({
    selector: 'app-bank-details',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    templateUrl: './bank-details.component.html',
    styleUrls: ['./bank-details.component.css']
})
export class BankDetailsComponent {
    invoiceService = inject(InvoiceService);

    Landmark = Landmark;
    CreditCard = CreditCard;
    FileText = FileText;
    MapPin = MapPin;

    update(field: string, value: string) {
        this.invoiceService.updateBank({ [field]: value });
    }

    validate(field: string, value: string) {
        this.invoiceService.validateField(field, value);
    }

    updateWithCaps(field: string, event: Event) {
        const input = event.target as HTMLInputElement;
        const uppercased = input.value.toUpperCase();
        this.invoiceService.updateBank({ [field]: uppercased });
    }

    updateNumberOnly(field: string, event: Event) {
        const input = event.target as HTMLInputElement;
        const numbersOnly = input.value.replace(/\D/g, '');
        this.invoiceService.updateBank({ [field]: numbersOnly });
    }
}
