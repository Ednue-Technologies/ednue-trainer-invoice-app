import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainerDetailsComponent } from './components/trainer-details/trainer-details.component';
import { BankDetailsComponent } from './components/bank-details/bank-details.component';
import { CourseDetailsComponent } from './components/course-details/course-details.component';
import { StudentDetailsComponent } from './components/student-details/student-details.component';
import { InvoiceService } from './services/invoice.service';
import { TourService } from './services/tour.service';
import { LucideAngularModule, Send, Copy, Download, Sun, Moon, HelpCircle } from 'lucide-angular';

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
    tourService = inject(TourService);
    protected readonly Send = Send;
    protected readonly Copy = Copy;
    protected readonly Download = Download;
    protected readonly Sun = Sun;
    protected readonly Moon = Moon;
    protected readonly HelpCircle = HelpCircle;

    darkMode = false;

    constructor() {
        // Automatic dark mode detection disabled as per user request
        // Default to Light Mode (false)
        this.darkMode = false;
        this.updateTheme();

        // Auto-start tour for first-time users
        setTimeout(() => {
            if (!this.tourService.hasTourCompleted()) {
                this.tourService.startTour();
            }
        }, 1000);
    }

    updateTheme() {
        if (this.darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

    toggleDarkMode() {
        this.darkMode = !this.darkMode;
        this.updateTheme();
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

        // Store original title
        const originalTitle = document.title;

        // Construct filename: CourseName_Invoice_TrainerName
        const trainer = this.invoiceService.trainer();
        const course = this.invoiceService.course();

        const trainerName = trainer.name ? trainer.name.replace(/\s+/g, '_') : 'Trainer';
        const courseName = course.courseName ? course.courseName.replace(/\s+/g, '_') : 'Course';

        const newTitle = `${courseName}_Invoice_${trainerName}`;
        document.title = newTitle;

        // Print
        window.print();

        // Restore title after a delay to ensure print dialog picks it up
        setTimeout(() => {
            document.title = originalTitle;
        }, 1000);
    }

    startTour() {
        this.tourService.startTour();
    }

    populateDummy = false;
    dummyStudentCount = 100;

    populateDummyData() {
        this.invoiceService.populateAllDummyData(this.dummyStudentCount);
    }
}
