export type SubCategory = {
  id: string;
  icon: string;
  title: string;
}

export type Category = {
  id: string;
  icon: string;
  title: string;
  description: string;
  subCategories: SubCategory[];
}

export const CATEGORY_STORAGE_KEY = "sixtify_help_categories_v3";

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "cat-1",
    icon: "EventAvailable",
    title: "Attendance",
    description: "Manage attendance, shifts, approvals, leave, biometric devices, and reports.",
    subCategories: [
      { id: "sub-101", icon: "CheckCircle", title: "Approvals" },
      { id: "sub-102", icon: "Schedule", title: "Shift & Day Management" },
      { id: "sub-103", icon: "EventAvailable", title: "Attendance Management" },
      { id: "sub-104", icon: "BeachAccess", title: "Leave Management" },
      { id: "sub-105", icon: "Fingerprint", title: "Biometric Device" },
      { id: "sub-106", icon: "Assessment", title: "Reports" },
    ],
  },
  {
    id: "cat-2",
    icon: "Payments",
    title: "Payroll",
    description: "Manage compensation, payroll processing, tax compliance, calculators, and reports.",
    subCategories: [
      { id: "sub-201", icon: "AccountBalanceWallet", title: "Compensation & Payroll" },
      { id: "sub-202", icon: "SwapHoriz", title: "Payroll Transaction" },
      { id: "sub-203", icon: "Payments", title: "Payroll Process" },
      { id: "sub-204", icon: "Gavel", title: "Tax Compliance" },
      { id: "sub-205", icon: "Calculate", title: "Statutory Calculator" },
      { id: "sub-206", icon: "AdminPanelSettings", title: "Payroll Administration" },
      { id: "sub-207", icon: "Tune", title: "Payroll Configuration" },
      { id: "sub-208", icon: "Assessment", title: "Reports" },
    ],
  },
];

