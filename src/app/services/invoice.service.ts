import { Injectable, signal, computed } from '@angular/core';

export interface TrainerDetails {
  name: string;
  email: string;
  contact: string;
  date: string;
}

export interface BankDetails {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  ifsc: string;
  branch: string;
  pan: string;
}

export interface CourseDetails {
  courseName: string;
  totalStudents: number;
  pricePerStudent: number;
}

export interface Student {
  id: number;
  name: string;
  courseName: string;
  duration: string;
  durationUnit: string;
  startDate: string;
  endDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  // Signals for State Management
  trainer = signal<TrainerDetails>({ name: '', email: '', contact: '', date: new Date().toISOString().split('T')[0] });
  bank = signal<BankDetails>({ bankName: '', accountHolder: '', accountNumber: '', ifsc: '', branch: '', pan: '' });
  course = signal<CourseDetails>({ courseName: '', totalStudents: 0, pricePerStudent: 0 });
  students = signal<Student[]>([
    { id: 1, name: '', courseName: '', duration: '', durationUnit: 'days', startDate: '', endDate: '' }
  ]);

  // Computed Values
  totalAmount = computed(() => {
    const c = this.course();
    return c.totalStudents * c.pricePerStudent;
  });

  constructor() { }

  // Update Methods
  updateTrainer(data: Partial<TrainerDetails>) {
    this.trainer.update(current => ({ ...current, ...data }));
  }

  updateBank(data: Partial<BankDetails>) {
    this.bank.update(current => ({ ...current, ...data }));
  }

  updateCourse(data: Partial<CourseDetails>) {
    this.course.update(current => ({ ...current, ...data }));

    // If totalStudents is updated, sync the students array
    if (data.totalStudents !== undefined) {
      this.students.update(current => {
        const targetCount = data.totalStudents!;
        if (current.length < targetCount) {
          // Add new students
          const newStudents = Array.from({ length: targetCount - current.length }, (_, i) => ({
            id: current.length + i + 1,
            name: '',
            courseName: current.length > 0 ? current[0].courseName : '',
            duration: current.length > 0 ? current[0].duration : '',
            durationUnit: current.length > 0 ? current[0].durationUnit : 'days',
            startDate: current.length > 0 ? current[0].startDate : '',
            endDate: current.length > 0 ? current[0].endDate : ''
          }));
          return [...current, ...newStudents];
        } else if (current.length > targetCount) {
          // Remove students from the end
          return current.slice(0, targetCount);
        }
        return current;
      });
    }
  }

  // Student Methods
  addStudent() {
    this.students.update(current => [
      ...current,
      { id: current.length + 1, name: '', courseName: '', duration: '', durationUnit: 'days', startDate: '', endDate: '' }
    ]);
    // Also update the course total students count to match
    this.course.update(c => ({ ...c, totalStudents: this.students().length }));
  }

  removeStudent(index: number) {
    this.students.update(current => current.filter((_, i) => i !== index));
    // Also update the course total students count to match
    this.course.update(c => ({ ...c, totalStudents: this.students().length }));
  }

  updateStudent(index: number, data: Partial<Student>) {
    this.students.update(current => {
      const updated = [...current];
      updated[index] = { ...updated[index], ...data };
      return updated;
    });
  }

  copyPreviousStudent(index: number) {
    if (index === 0) return;
    this.students.update(current => {
      const updated = [...current];
      const prev = updated[index - 1];
      updated[index] = {
        ...updated[index],
        courseName: prev.courseName,
        duration: prev.duration,
        durationUnit: prev.durationUnit,
        startDate: prev.startDate,
        endDate: prev.endDate
      };
      return updated;
    });
  }

  copyToAllStudents(sourceIndex: number) {
    this.students.update(current => {
      const source = current[sourceIndex];
      return current.map((student, index) => {
        if (index === sourceIndex) return student;
        return {
          ...student,
          courseName: source.courseName,
          duration: source.duration,
          durationUnit: source.durationUnit,
          startDate: source.startDate,
          endDate: source.endDate
        };
      });
    });
  }

  // Validation State
  errors = signal<{ [key: string]: string }>({});

  validateField(field: string, value: any) {
    const newErrors = { ...this.errors() };
    let error = '';

    switch (field) {
      case 'trainerName':
        if (!value.trim()) error = 'Name is required';
        break;
      case 'trainerEmail':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email address';
        break;
      case 'trainerContact':
        if (!/^[6-9]\d{9}$/.test(value)) {
          error = 'Invalid Indian mobile number (10 digits)';
        }
        break;
      case 'trainerDate':
        if (!value) {
          error = 'Date is required';
        } else {
          const date = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          date.setHours(0, 0, 0, 0);
          const diffTime = date.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (Math.abs(diffDays) > 5) error = 'Date must be within 5 days of today';
        }
        break;
      case 'bankName':
        if (!value.trim()) error = 'Bank Name is required';
        break;
      case 'accountHolder':
        if (!value.trim()) error = 'Account Holder Name is required';
        break;
      case 'accountNumber':
        if (!/^\d{9,18}$/.test(value)) error = 'Invalid Account Number (9-18 digits)';
        break;
      case 'ifsc':
        if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value)) error = 'Invalid IFSC Code';
        break;
      case 'branch':
        if (!value.trim()) error = 'Branch is required';
        break;
      case 'pan':
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)) error = 'Invalid PAN Number';
        break;
      case 'courseName':
        if (!value.trim()) error = 'Course Name is required';
        break;
    }

    if (error) {
      newErrors[field] = error;
    } else {
      delete newErrors[field];
    }
    this.errors.set(newErrors);
  }

  validateStudentEndDate(index: number, endDate: string) {
    if (!endDate) return;
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today

    const newErrors = { ...this.errors() };
    if (end > today) {
      newErrors[`studentEndDate_${index}`] = 'End date cannot be in the future';
    } else {
      delete newErrors[`studentEndDate_${index}`];
    }
    this.errors.set(newErrors);
  }

  validate(): boolean {
    const t = this.trainer();
    const b = this.bank();
    const c = this.course();

    this.validateField('trainerName', t.name);
    this.validateField('trainerEmail', t.email);
    this.validateField('trainerContact', t.contact);
    this.validateField('trainerDate', t.date);

    this.validateField('bankName', b.bankName);
    this.validateField('accountHolder', b.accountHolder);
    this.validateField('accountNumber', b.accountNumber);
    this.validateField('ifsc', b.ifsc);
    this.validateField('branch', b.branch);
    this.validateField('pan', b.pan);

    this.validateField('courseName', c.courseName);

    return Object.keys(this.errors()).length === 0;
  }

  // Generate Mailto Link
  generateMailto() {
    // Validate all fields before generating the mailto link
    if (!this.validate()) {
      return null;
    }

    const t = this.trainer();
    const b = this.bank();
    const c = this.course();
    const s = this.students();
    const total = this.totalAmount();

    // Subject format: "<Course Name> Trainer Invoice - <Trainer Name> - <Date>"
    const subject = `${c.courseName} Trainer Invoice - ${t.name} - ${t.date}`;

    // Body follows the exact template the user provided (plain‑text for mailto)
    const body = `Hello Sir/Madam,
Please find the trainer invoice details below.

Bank Account Details
*Bank Name:* ${b.bankName}
*Account Holder Name:* ${b.accountHolder}
*Account Number:* ${b.accountNumber}
*IFSC Code:* ${b.ifsc}
*Bank Branch:* ${b.branch}
*PAN Number:* ${b.pan}

Trainer Details
*Trainer Name:* ${t.name}
*Contact Number:* ${t.contact}
*Email Address:* ${t.email}
*Invoice Date:* ${t.date}

Course Details
S. No Course Name Total Students Price Per Student Total
1 ${c.courseName} ${c.totalStudents} ${c.pricePerStudent} ${total}

*Grand Total:* ${total}

Student Details
S.No Student Name Course Name Duration Start Date End Date
${s
        .map((stu, i) => `${i + 1} ${stu.name} ${stu.courseName} ${stu.duration} ${stu.durationUnit} ${stu.startDate} ${stu.endDate}`)
        .join('\n')}

Thanks & Regards,
${t.name}`;

    return `mailto:ednuetech@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  generateHtmlEmail() {
    if (!this.validate()) return null;

    const t = this.trainer();
    const b = this.bank();
    const c = this.course();
    const s = this.students();
    const total = this.totalAmount();

    const containerStyle = 'font-family: "Georgia", serif; color: #333; max-width: 800px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 40px; background-color: #ffffff;';
    const headerStyle = 'border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 30px;';
    const sectionTitleStyle = 'font-size: 18px; font-weight: bold; color: #ec4899; margin-top: 30px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px;';
    const tableStyle = 'width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;';
    const thStyle = 'border: 1px solid #ddd; padding: 12px; background-color: #f8f9fa; text-align: left; font-weight: bold; color: #495057;';
    const tdStyle = 'border: 1px solid #ddd; padding: 12px; text-align: left; color: #212529;';
    const totalStyle = 'background-color: #e9ecef; font-weight: bold; padding: 15px; text-align: right; font-size: 16px; border-radius: 4px; margin-top: 20px;';

    const html = `
      <div style="${containerStyle}">
        <div style="${headerStyle}">
          <h2 style="margin: 0; color: #ec4899;">Trainer Invoice</h2>
          <p style="margin: 5px 0 0; color: #666; font-size: 14px;">${c.courseName}</p>
        </div>

        <p style="font-size: 15px; line-height: 1.6;">Hello Sir/Madam,</p>
        <p style="font-size: 15px; line-height: 1.6;">Please find the trainer invoice details below.</p>
        
        <h3 style="${sectionTitleStyle}">Bank Account Details</h3>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; font-size: 14px; line-height: 1.8;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div><strong>Bank Name:</strong> ${b.bankName}</div>
            <div><strong>Account Holder:</strong> ${b.accountHolder}</div>
            <div><strong>Account Number:</strong> ${b.accountNumber}</div>
            <div><strong>IFSC Code:</strong> ${b.ifsc}</div>
            <div><strong>Branch:</strong> ${b.branch}</div>
            <div><strong>PAN Number:</strong> ${b.pan}</div>
          </div>
        </div>

        <h3 style="${sectionTitleStyle}">Trainer Details</h3>
        <div style="font-size: 14px; line-height: 1.8;">
          <strong>Name:</strong> ${t.name}<br>
          <strong>Contact:</strong> ${t.contact}<br>
          <strong>Email:</strong> ${t.email}<br>
          <strong>Date:</strong> ${t.date}
        </div>

        <h3 style="${sectionTitleStyle}">Course Details</h3>
        <table style="${tableStyle}">
          <thead>
            <tr>
              <th style="${thStyle}">S. No</th>
              <th style="${thStyle}">Course Name</th>
              <th style="${thStyle}">Total Students</th>
              <th style="${thStyle}">Price Per Student</th>
              <th style="${thStyle}">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="${tdStyle}">1</td>
              <td style="${tdStyle}">${c.courseName}</td>
              <td style="${tdStyle}">${c.totalStudents}</td>
              <td style="${tdStyle}">${c.pricePerStudent}</td>
              <td style="${tdStyle}">${total}</td>
            </tr>
          </tbody>
        </table>

        <div style="${totalStyle}">
          Grand Total: ${total}
        </div>

        <h3 style="${sectionTitleStyle}">Student Details</h3>
        <table style="${tableStyle}">
          <thead>
            <tr>
              <th style="${thStyle}">S.No</th>
              <th style="${thStyle}">Student Name</th>
              <th style="${thStyle}">Course Name</th>
              <th style="${thStyle}">Duration</th>
              <th style="${thStyle}">Start Date</th>
              <th style="${thStyle}">End Date</th>
            </tr>
          </thead>
          <tbody>
            ${s.map((stu, i) => `
              <tr style="${i % 2 === 0 ? '' : 'background-color: #f9f9f9;'}">
                <td style="${tdStyle}">${i + 1}</td>
                <td style="${tdStyle}">${stu.name}</td>
                <td style="${tdStyle}">${stu.courseName}</td>
                <td style="${tdStyle}">${stu.duration} ${stu.durationUnit}</td>
                <td style="${tdStyle}">${stu.startDate}</td>
                <td style="${tdStyle}">${stu.endDate}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <p style="margin-top: 40px; font-size: 15px; border-top: 1px solid #eee; padding-top: 20px;">
          Thanks & Regards,<br>
          <strong>${t.name}</strong>
        </p>
      </div>
    `;

    return html;
  }
}

