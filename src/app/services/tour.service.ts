import { Injectable } from '@angular/core';
import Shepherd from 'shepherd.js';

@Injectable({
    providedIn: 'root'
})
export class TourService {
    private tour: any = null;
    private readonly TOUR_COMPLETED_KEY = 'invoiceTourCompleted';

    constructor() { }

    initTour(): any {
        this.tour = new Shepherd.Tour({
            useModalOverlay: true,
            defaultStepOptions: {
                classes: 'invoice-tour-step',
                scrollTo: { behavior: 'smooth', block: 'center' },
                cancelIcon: {
                    enabled: true
                }
            }
        });

        // Step 1: Welcome
        this.tour.addStep({
            id: 'welcome',
            text: `<h3>Welcome to the Invoice Generator!</h3>
             <p>Let me show you how to create and send invoices to <strong>ednuetech@gmail.com</strong>.</p>
             <p>This quick tour will guide you through all the features.</p>`,
            buttons: [
                {
                    text: 'Skip Tour',
                    action: this.tour.cancel,
                    secondary: true
                },
                {
                    text: 'Start Tour',
                    action: this.tour.next
                }
            ]
        });

        // Step 2: Trainer Details
        this.tour.addStep({
            id: 'trainer-details',
            text: `<h3>Add Your Details</h3>
             <p>Start by entering your <strong>trainer information</strong>:</p>
             <ul>
               <li>Name</li>
               <li>Email ID</li>
               <li>Contact Number</li>
             </ul>`,
            attachTo: {
                element: 'app-trainer-details',
                on: 'bottom'
            },
            buttons: [
                {
                    text: 'Back',
                    action: this.tour.back,
                    secondary: true
                },
                {
                    text: 'Next',
                    action: this.tour.next
                }
            ]
        });

        // Step 3: Course Details
        this.tour.addStep({
            id: 'course-details',
            text: `<h3>Add Course Details</h3>
             <p>Enter the course information:</p>
             <ul>
               <li><strong>Course Name</strong></li>
               <li><strong>Duration</strong> (days/hours)</li>
               <li><strong>Total Students</strong></li>
               <li><strong>Price Per Student</strong></li>
             </ul>
             <p>The grand total will be calculated automatically!</p>`,
            attachTo: {
                element: 'app-course-details',
                on: 'bottom'
            },
            buttons: [
                {
                    text: 'Back',
                    action: this.tour.back,
                    secondary: true
                },
                {
                    text: 'Next',
                    action: this.tour.next
                }
            ]
        });

        // Step 4: Student Details
        this.tour.addStep({
            id: 'student-details',
            text: `<h3>Manage Student Details</h3>
             <p>Enter individual student information:</p>
             <ul>
               <li>Student Name</li>
               <li>Course, Duration, Start/End Dates</li>
             </ul>
             <p><strong>⚠️ Note:</strong> Course End Date cannot be in the future.</p>
             <p><strong>💡 Pro Tip:</strong> Use the <strong>Copy to All</strong> button in the first row to copy course details to all students!</p>`,
            attachTo: {
                element: 'app-student-details',
                on: 'top'
            },
            buttons: [
                {
                    text: 'Back',
                    action: this.tour.back,
                    secondary: true
                },
                {
                    text: 'Next',
                    action: this.tour.next
                }
            ]
        });

        // Step 5: Bank Details
        this.tour.addStep({
            id: 'bank-details',
            text: `<h3>Add Bank Details</h3>
             <p>Enter your payment information:</p>
             <ul>
               <li>Bank Name</li>
               <li>Account Number</li>
               <li>IFSC Code</li>
               <li>Branch</li>
             </ul>`,
            attachTo: {
                element: 'app-bank-details',
                on: 'top'
            },
            buttons: [
                {
                    text: 'Back',
                    action: this.tour.back,
                    secondary: true
                },
                {
                    text: 'Next',
                    action: this.tour.next
                }
            ]
        });

        // Step 6: Send Invoice Options
        this.tour.addStep({
            id: 'send-options',
            text: `<h3>Send Invoice</h3>
             <p>Three ways to send your invoice to <strong>ednuetech@gmail.com</strong>:</p>
             <ul>
               <li><strong>📧 Copy Email</strong> - Copies HTML email to clipboard</li>
               <li><strong>📄 Download PDF</strong> - Download as PDF to attach</li>
               <li><strong>✉️ Generate & Send</strong> - Opens mailto link with invoice details</li>
             </ul>`,
            attachTo: {
                element: '.flex.justify-end.gap-4',
                on: 'bottom'
            },
            buttons: [
                {
                    text: 'Back',
                    action: this.tour.back,
                    secondary: true
                },
                {
                    text: 'Next',
                    action: this.tour.next
                }
            ]
        });

        // Step 7: Dark Mode
        this.tour.addStep({
            id: 'dark-mode',
            text: `<h3>🌙 Dark Mode</h3>
             <p>Toggle between <strong>Light</strong> and <strong>Dark</strong> themes using this switch!</p>
             <p>Your eyes will thank you during late-night invoice sessions. 😊</p>`,
            attachTo: {
                element: '.theme-switch',
                on: 'left'
            },
            buttons: [
                {
                    text: 'Back',
                    action: this.tour.back,
                    secondary: true
                },
                {
                    text: 'Next',
                    action: this.tour.next
                }
            ]
        });

        // Step 8: Populate Dummy Data
        this.tour.addStep({
            id: 'dummy-data',
            text: `<h3>🧪 Test with Sample Data</h3>
             <p>Click <strong>Populate Dummy Data</strong> to fill the form with sample information.</p>
             <p>Perfect for testing or learning!</p>`,
            attachTo: {
                element: 'button:has-text("Populate Dummy Data")',
                on: 'bottom'
            },
            buttons: [
                {
                    text: 'Back',
                    action: this.tour.back,
                    secondary: true
                },
                {
                    text: 'Finish Tour',
                    action: this.tour.complete
                }
            ]
        });

        // Mark tour as completed when finished
        this.tour.on('complete', () => {
            localStorage.setItem(this.TOUR_COMPLETED_KEY, 'true');
        });

        return this.tour;
    }

    startTour(): void {
        if (!this.tour) {
            this.initTour();
        }
        this.tour?.start();
    }

    hasTourCompleted(): boolean {
        return localStorage.getItem(this.TOUR_COMPLETED_KEY) === 'true';
    }

    resetTour(): void {
        localStorage.removeItem(this.TOUR_COMPLETED_KEY);
    }
}
