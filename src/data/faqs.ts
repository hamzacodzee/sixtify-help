export type FaqItem = {
  question: string;
  answer: string;
}

export const SUBCATEGORY_FAQS: Record<string, FaqItem[]> = {
  APPROVALS: [
    {
      question: "How do I approve or reject pending attendance regularization requests?",
      answer:
        "Go to Attendance > Approvals, filter by pending requests, review the employee's punch-in/punch-out reason, and click Approve or Reject. You can also select multiple rows for bulk approval.",
    },
    {
      question: "Can a manager delegate approvals while on leave?",
      answer:
        "Yes. In Approval Settings, a manager can assign an acting approver for a specific date range so pending leave and attendance requests are routed automatically.",
    },
    {
      question: "What happens if an approval request is not acted upon before payroll lock?",
      answer:
        "Unapproved requests remain pending and are excluded from the current payroll cycle. Once approved later, any attendance or LOP adjustments are reflected in the next cycle.",
    },
  ],
  "SHIFT & DAY MANAGEMENT": [
    {
      question: "How do I create and assign a new shift to employees?",
      answer:
        "Navigate to Attendance > Shift & Day Management, click Add Shift, configure start/end times, break duration, and grace period, then assign it to individuals or departments.",
    },
    {
      question: "How are rotational or weekly-off shifts configured?",
      answer:
        "Use the Shift Roster view to schedule rotational shifts across weeks and mark custom weekly-off days per employee or team.",
    },
    {
      question: "How does late-mark and early-out grace time work?",
      answer:
        "If an employee punches in within the configured grace minutes after shift start, it is marked Present without penalty. Exceeding the grace window triggers a late-mark rule.",
    },
  ],
  "ATTENDANCE MANAGEMENT": [
    {
      question: "How can an employee regularize a missed punch?",
      answer:
        "Employees can open their Attendance Calendar, select the date with a missing punch, click Regularize, enter the actual in/out time and reason, and submit for manager approval.",
    },
    {
      question: "How is overtime (OT) calculated?",
      answer:
        "Overtime is calculated automatically based on extra hours worked beyond the assigned shift duration, subject to minimum OT threshold and OT policy approval.",
    },
    {
      question: "How do I lock attendance before running payroll?",
      answer:
        "Go to Attendance > Attendance Management, select the pay period, verify all pending regularizations are resolved, and click Lock Attendance.",
    },
  ],
  "LEAVE MANAGEMENT": [
    {
      question: "How do employees apply for leave and check their balance?",
      answer:
        "Employees can view their available leave balances (CL, SL, PL) under Leave Management and click Apply Leave to submit a request with dates and reason.",
    },
    {
      question: "How are leave carry-forward and encashment handled at year-end?",
      answer:
        "Year-end leave rules automatically carry forward eligible unused days up to the configured cap and process any encashment through Payroll.",
    },
    {
      question: "Can half-day leaves be combined with shift timings?",
      answer:
        "Yes. When applying for leave, employees can choose First Half or Second Half, and attendance will only expect punches for the working half.",
    },
  ],
  "BIOMETRIC DEVICE": [
    {
      question: "How do I sync punch logs from a biometric device?",
      answer:
        "Open Attendance > Biometric Device, select the configured device, and click Sync Now. Scheduled auto-sync also runs at the configured interval.",
    },
    {
      question: "Why are punches from a biometric device not appearing for an employee?",
      answer:
        "Verify that the employee's Biometric ID in their profile matches the User ID registered on the biometric machine and that the device status is Online.",
    },
    {
      question: "What should I do if a biometric device shows Offline?",
      answer:
        "Check the device's network/IP connectivity and port configuration. Once back online, trigger a manual sync to pull all buffered punches.",
    },
  ],
  "COMPENSATION & PAYROLL": [
    {
      question: "How do I define or revise an employee's salary structure?",
      answer:
        "Go to Payroll > Compensation & Payroll, select the employee, choose a salary template or customize earnings/deductions, and set the effective date.",
    },
    {
      question: "How are salary arrears calculated after a backdated revision?",
      answer:
        "When a salary revision has a past effective date, the system automatically computes the difference for prior processed months and adds it as Arrears in the next payroll run.",
    },
  ],
  "PAYROLL TRANSACTION": [
    {
      question: "How do I add a one-time bonus or reimbursement?",
      answer:
        "Navigate to Payroll > Payroll Transaction, select the pay period, click Add Transaction, choose Bonus or Reimbursement, and enter the amount.",
    },
    {
      question: "How are employee loans and salary advances deducted?",
      answer:
        "Approved loans/advances are scheduled with monthly EMI installments that automatically appear as deductions in each payroll transaction cycle until settled.",
    },
  ],
  "PAYROLL PROCESS": [
    {
      question: "What are the steps to run monthly payroll?",
      answer:
        "1) Lock Attendance & Leave, 2) Review Payroll Transactions (bonuses/LOP), 3) Run Payroll Preview, 4) Verify net pay & statutory deductions, and 5) Finalize & Publish Payslips.",
    },
    {
      question: "How do I generate bank transfer (NEFT) files after payroll?",
      answer:
        "Once payroll is finalized, click Export Bank Advice in Payroll Process to download the bank-formatted NEFT/RTGS payout sheet.",
    },
  ],
  "TAX COMPLIANCE": [
    {
      question: "How do employees choose between Old and New Tax Regimes?",
      answer:
        "Employees can select their preferred tax regime under Payroll > Tax Compliance at the start of the financial year or before the cut-off date.",
    },
    {
      question: "How are investment proofs verified and Form 16 generated?",
      answer:
        "HR/Finance reviews submitted 80C/80D/HRA proofs in Tax Compliance. After Q4 TDS filing, Form 16 Part A & B can be generated and published to employees.",
    },
  ],
  "STATUTORY CALCULATOR": [
    {
      question: "How are PF, ESI, and Professional Tax (PT) calculated?",
      answer:
        "PF is calculated on Basic + DA (subject to statutory wage ceiling), ESI applies to gross wages within the ESI threshold, and PT follows state-wise slab rates.",
    },
    {
      question: "Can I preview statutory contributions before running payroll?",
      answer:
        "Yes. Use the Statutory Calculator to enter sample Basic/Gross figures and instantly preview employee and employer PF, ESI, and PT breakdowns.",
    },
  ],
  "PAYROLL ADMINISTRATION": [
    {
      question: "How do I configure pay groups and pay cycles?",
      answer:
        "In Payroll > Payroll Administration, create pay groups (e.g., Monthly Salaried, Consultants) and define their cut-off and payout dates.",
    },
    {
      question: "Who can lock or unlock a finalized payroll?",
      answer:
        "Only users with Payroll Admin permissions can lock or unlock a payroll cycle, and all actions are recorded in the audit log.",
    },
  ],
  "PAYROLL CONFIGURATION": [
    {
      question: "How do I add custom earnings or deduction components?",
      answer:
        "Go to Payroll > Payroll Configuration > Salary Components, click Add Component, set whether it is taxable/statutory-applicable, and define its calculation formula.",
    },
    {
      question: "Can I customize the payslip layout?",
      answer:
        "Yes. Under Payslip Settings, you can toggle company logo, YTD totals, leave summary, and custom footer notes.",
    },
  ],
  REPORTS: [
    {
      question: "What reports are available for Attendance and Payroll?",
      answer:
        "You can generate Monthly Muster Roll, Late/Early Summary, Overtime Report, Payroll Register, Bank Advice, and PF/ESI/PT Challan reports.",
    },
    {
      question: "In which formats can I export reports?",
      answer:
        "All reports support instant export to Excel (.xlsx), CSV, and PDF formats with custom date-range and department filters.",
    },
  ],
};

export function getFaqsForSubCategory(title: string): FaqItem[] {
  const key = title.trim().toUpperCase();

  if (SUBCATEGORY_FAQS[key]) {
    return SUBCATEGORY_FAQS[key];
  }

  return [
    {
      question: `How do I get started with ${title}?`,
      answer: `Navigate to the ${title} section from the main module menu to configure settings, view records, and manage daily operations.`,
    },
    {
      question: `Where can I find permissions for ${title}?`,
      answer: `Role-based permissions for ${title} can be managed under Admin > Roles & Permissions.`,
    },
  ];
}

const ARTICLE_COUNTS_KEY = "sixtify_help_article_counts_v1";

export function getArticleCounts(): Record<string, number> {
  if (typeof window === "undefined") {return {};}
  try {
    const saved = localStorage.getItem(ARTICLE_COUNTS_KEY);

    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

export function incrementArticleCount(question: string): void {
  if (typeof window === "undefined" || !question) {return;}
  try {
    const counts = getArticleCounts();

    counts[question] = (counts[question] ?? 0) + 1;
    localStorage.setItem(ARTICLE_COUNTS_KEY, JSON.stringify(counts));
  } catch {
    // Ignore storage errors
  }
}

