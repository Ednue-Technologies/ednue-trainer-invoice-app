import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainerDetailsComponent } from './components/trainer-details/trainer-details.component';
import { BankDetailsComponent } from './components/bank-details/bank-details.component';
import { CourseDetailsComponent } from './components/course-details/course-details.component';
import { StudentDetailsComponent } from './components/student-details/student-details.component';
import { InvoiceService } from './services/invoice.service';
import { LucideAngularModule, Send, Copy, Download, Sun, Moon } from 'lucide-angular';

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
    protected readonly Send = Send;
    protected readonly Copy = Copy;
    protected readonly Download = Download;
    protected readonly Sun = Sun;
    protected readonly Moon = Moon;

    darkMode = false;

    constructor() {
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.darkMode = true;
            document.documentElement.classList.add('dark');
        }
    }

    toggleDarkMode() {
        this.darkMode = !this.darkMode;
        if (this.darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
    currentYear = new Date().getFullYear();

    generateInvoice() {
        const mailtoLink = this.invoiceService.generateMailto();
        if (mailtoLink) {
            window.location.href = mailtoLink;
        } else {
            alert('Please fix the validation errors before generating the invoice.');
        }
    }

    async copyEmailToClipboard() {
        const htmlContent = this.invoiceService.generateHtmlEmail();
        if (!htmlContent) {
            alert('Please fix the validation errors before copying.');
            return;
        }

        try {
            const type = 'text/html';
            const blob = new Blob([htmlContent], { type });
            const data = [new ClipboardItem({ [type]: blob })];
            await navigator.clipboard.write(data);
            alert('Email content copied to clipboard! You can now paste it into your email client.');
        } catch (err) {
            console.error('Failed to copy: ', err);
            alert('Failed to copy email content. Please try again.');
        }
    }

    downloadPdf() {
        if (!this.invoiceService.validate()) {
            alert('Please fix the validation errors before downloading.');
            return;
        }
        window.print();
    }

    populateDummy = true;
    dummyStudentCount = 100;

    populateDummyData() {
        this.invoiceService.populateAllDummyData(this.dummyStudentCount);
    }
}
