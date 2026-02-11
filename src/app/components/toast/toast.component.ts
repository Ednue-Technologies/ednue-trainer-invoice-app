import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { LucideAngularModule, X, CheckCircle, AlertCircle, Info } from 'lucide-angular';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <div class="toast-container">
      <div *ngFor="let toast of toastService.toasts()" 
           class="toast" 
           [ngClass]="toast.type"
           (click)="toastService.remove(toast.id)">
        
        <div class="toast-icon">
          <lucide-icon *ngIf="toast.type === 'success'" [img]="CheckCircle" class="w-5 h-5"></lucide-icon>
          <lucide-icon *ngIf="toast.type === 'error'" [img]="AlertCircle" class="w-5 h-5"></lucide-icon>
          <lucide-icon *ngIf="toast.type === 'info'" [img]="Info" class="w-5 h-5"></lucide-icon>
        </div>
        
        <div class="toast-message">{{ toast.message }}</div>
        
        <button class="toast-close" (click)="toastService.remove(toast.id); $event.stopPropagation()">
          <lucide-icon [img]="X" class="w-4 h-4"></lucide-icon>
        </button>
      </div>
    </div>
  `,
    styles: [`
    .toast-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      pointer-events: none;
    }

    .toast {
      pointer-events: auto;
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 300px;
      max-width: 400px;
      padding: 16px;
      border-radius: 8px;
      background: white;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      animation: slideIn 0.3s ease-out forwards;
      cursor: pointer;
      border-left: 4px solid transparent;
    }

    .toast.success {
      border-left-color: #10b981;
      background-color: #f0fdf4;
    }
    .toast.success .toast-icon { color: #10b981; }

    .toast.error {
      border-left-color: #ef4444;
      background-color: #fef2f2;
    }
    .toast.error .toast-icon { color: #ef4444; }

    .toast.info {
      border-left-color: #3b82f6;
      background-color: #eff6ff;
    }
    .toast.info .toast-icon { color: #3b82f6; }

    .toast-message {
      flex: 1;
      font-size: 0.95rem;
      color: #1f2937;
      line-height: 1.4;
    }

    .toast-close {
      color: #9ca3af;
      background: transparent;
      border: none;
      padding: 4px;
      cursor: pointer;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .toast-close:hover {
      background-color: rgba(0,0,0,0.05);
      color: #4b5563;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    /* Dark mode support */
    :host-context(.dark) .toast {
      background-color: #1e293b;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
    }
    :host-context(.dark) .toast-message {
      color: #f3f4f6;
    }
    :host-context(.dark) .toast.success { background-color: rgba(16, 185, 129, 0.1); }
    :host-context(.dark) .toast.error { background-color: rgba(239, 68, 68, 0.1); }
    :host-context(.dark) .toast.info { background-color: rgba(59, 130, 246, 0.1); }
  `]
})
export class ToastComponent {
    toastService = inject(ToastService);
    X = X;
    CheckCircle = CheckCircle;
    AlertCircle = AlertCircle;
    Info = Info;
}
