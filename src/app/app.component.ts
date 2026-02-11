import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainerDetailsComponent } from './components/trainer-details/trainer-details.component';
import { BankDetailsComponent } from './components/bank-details/bank-details.component';
import { CourseDetailsComponent } from './components/course-details/course-details.component';
import { StudentDetailsComponent } from './components/student-details/student-details.component';
import { InvoiceService } from './services/invoice.service';
import { TourService } from './services/tour.service';
import { ToastService } from './services/toast.service';
import { ToastComponent } from './components/toast/toast.component';
import { LucideAngularModule, Send, Copy, Download, Sun, Moon, HelpCircle, RotateCcw } from 'lucide-angular';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        TrainerDetailsComponent,
        BankDetailsComponent,
        CourseDetailsComponent,
        StudentDetailsComponent,
        LucideAngularModule,
        ToastComponent
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    invoiceService = inject(InvoiceService);
    tourService = inject(TourService);
    toastService = inject(ToastService);

    protected readonly Send = Send;
    protected readonly Copy = Copy;
    protected readonly Download = Download;
    protected readonly Sun = Sun;
    protected readonly Moon = Moon;
    protected readonly HelpCircle = HelpCircle;
    protected readonly RotateCcw = RotateCcw;

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
            this.toastService.error('Please fix the validation errors before generating the invoice.');
        }
    }

    async copyEmailToClipboard() {
        const htmlContent = this.invoiceService.generateHtmlEmail();
        if (!htmlContent) {
            this.toastService.error('Please fix the validation errors before copying.');
            return;
        }

        try {
            const type = 'text/html';
            const blob = new Blob([htmlContent], { type });
            const data = [new ClipboardItem({ [type]: blob })];
            await navigator.clipboard.write(data);
            this.toastService.success('Email content copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy: ', err);
            this.toastService.error('Failed to copy email content. Please try again.');
        }
    }

    downloadPdf() {
        if (!this.invoiceService.validate()) {
            this.toastService.error('Please fix the validation errors before downloading.');
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

    resetData() {
        if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
            this.invoiceService.reset();
            this.toastService.info('All data has been reset.');
        }
    }

    populateDummy = false;
    dummyStudentCount = 100;

    populateDummyData() {
        this.invoiceService.populateAllDummyData(this.dummyStudentCount);
        this.toastService.success(`Populated ${this.dummyStudentCount} dummy students.`);
    }
}

