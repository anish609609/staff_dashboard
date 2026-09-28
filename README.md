# Vamshi ENT Hospital – Doctor Dashboard & Outpatient Reception System

> **Powered by AshwiniCare** · Clinical Consultation Workspace, Outpatient Analytics & Reception Desk

A high-efficiency, mobile-optimized clinical consultation and outpatient department (OPD) queue management application tailored for **Vamshi ENT Hospital**. Designed for speed, privacy, and clinical clarity for both consulting doctors and front-desk reception staff.

---

## 📁 Project Directory Tree

```text
vamshi-ent-hospital-reception-desk/
├── index.html
├── metadata.json
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
└── src/
    ├── main.tsx                             # App entry point
    ├── App.tsx                              # Root application container & role-based view coordinator
    ├── index.css                            # Tailwind CSS styling directives
    ├── assets/
    │   └── images/
    │       ├── clinic_logo_mark_*.jpg       # Hospital logo mark
    │       └── receptionist_avatar_*.jpg    # Receptionist profile avatar
    ├── types/
    │   └── clinic.ts                        # TypeScript models (OPDEntry, PatientRecord, ConsultationRecord, etc.)
    ├── data/
    │   ├── mockData.ts                      # Hospital details, doctors, initial patient directory & queue data
    │   └── prescriptionAssets.ts            # Sample high-fidelity SVG Rx preview assets
    ├── utils/
    │   ├── audioChime.ts                    # Audio chime sound feedback for actions
    │   └── patientAge.ts                    # Dynamic patient age calculation
    └── components/
        ├── Footer.tsx                       # Centered hospital branding and AshwiniCare attribution
        ├── LoginScreen.tsx                  # Multi-role authentication (Doctor Console vs Reception Staff)
        ├── doctor-dashboard/                # Modularized Doctor Consultation & Analytics Workspace
        │   ├── DoctorDashboard.tsx          # Main doctor orchestrator (Greeting, OPDs vs Analytics tabs)
        │   ├── DoctorHeader.tsx             # Doctor console header with profile, role-switching & logout
        │   ├── OpdsConsultationTab.tsx      # Master consultation workspace with queue, search, and modals
        │   ├── DoctorQueue.tsx              # Real-time incoming patient queue with filters & "Add Appointment" action
        │   ├── QueueCard.tsx                # Dedicated patient queue item card with vertical hierarchy
        │   ├── AddAppointmentModal.tsx      # Fast spot appointment modal with essential fields
        │   ├── PatientConsultationModal.tsx # Consultation modal container with full lifecycle management
        │   ├── PatientHeaderCard.tsx        # Top patient clinical details card (Complaint, Remarks, Phone)
        │   ├── PreviousPrescriptionsAccordion.tsx # Collapsible previous visits & prescription lightbox
        │   ├── ConsultationForm.tsx         # Doctor's note, Rx attachment, follow-up timeline & actions
        │   ├── PatientDetailCard.tsx        # Staff registration details and contact actions
        │   ├── PatientPastHistory.tsx       # Comprehensive prior visits timeline
        │   ├── PrescriptionUploader.tsx     # Physical prescription slip upload form
        │   ├── AnalyticsTab.tsx             # Date filtering, summary metric cards & volume trends
        │   └── StaffPerformanceTable.tsx    # 4-metric staff registrations & mobile-stacked cards
        └── staff-dashboard/                 # Modularized Staff Reception Desk
            ├── StaffDashboard.tsx           # Staff workspace container (Welcome banner, spot desk, live queue)
            ├── Header.tsx                   # Staff top navigation bar with branding & profile
            ├── WelcomeBanner.tsx            # Daily inspirational rotation banner
            ├── LiveOpdQueueTable.tsx        # Mobile-first card-based live OPD queue with expandable cards
            ├── SpotAppointmentDesk.tsx      # Spot appointment booking container & validation orchestrator
            └── appointment-desk/            # Appointment creation sub-components
                ├── DoctorSessionFields.tsx
                ├── PatientInfoFields.tsx
                ├── ComplaintTags.tsx
                ├── ExtraNotesField.tsx
                └── FormActions.tsx
```

---

## 🩺 Doctor Dashboard Architecture (`src/components/doctor-dashboard/`)

| Component | Responsibility & Features |
| :--- | :--- |
| **`DoctorDashboard.tsx`** | Top-level orchestrator. Features dynamic time-based greeting, daily inspirational medical quotation, and prominent top tabs (`📋 OPDs` and `📊 Analytics`) highlighted in emerald green. |
| **`DoctorHeader.tsx`** | Preserves hospital brand styling with "Vamshi ENT Hospital" powered by "AshwiniCare", active doctor profile badge, fast role switch to Staff Desk, and Log Out action. |
| **`OpdsConsultationTab.tsx`** | Responsive workspace coordinating incoming patient queue, quick search, "Add Appointment" registration trigger, and consultation modals. |
| **`DoctorQueue.tsx`** | Real-time queue column showing token badges, status filter buttons (`Waiting`, `Consulted`, `All`), and patient count statistics. |
| **`QueueCard.tsx`** | Individual patient card structured in a clean vertical hierarchy: **Line 1**: Token # + Status Badge; **Line 2**: Patient Name; **Line 3**: Gender & Age; **Line 4**: Chief Complaint. |
| **`AddAppointmentModal.tsx`** | Streamlined modal positioned directly above the patient queue search bar. Captures essential fields only: Patient Name (with autocomplete), Contact Phone (with autocomplete), Gender, Age, OPD Session Slot, and Chief Complaint. |
| **`PatientConsultationModal.tsx`** | Clean consultation modal. Header bar displays Token #, Patient Name, Gender/Age, UHID, Status Badge, and Close Button. Supports post-consultation editing ("Edit Consultation" / "Save Changes"). |
| **`PatientHeaderCard.tsx`** | Clinical priority details: Visit Reason (Chief Complaint) displayed first, Front Desk Remarks (rendered only when present), and Contact Phone Number at the bottom. |
| **`PreviousPrescriptionsAccordion.tsx`** | Accordion displayed only for returning patients. Cards show Doctor's Note/Diagnosis, past prescription image thumbnail with click-to-zoom lightbox, and visit date. |
| **`ConsultationForm.tsx`** | Un-nested consultation workflow: 1. Doctor's Note / Diagnosis textarea; 2. Prescription attachment ("Take Camera Photo" & "Upload File / PDF"); 3. Follow-up review pills (`None`, `3 days`, `7 days`, and `Custom Date` with numeric input and auto-calculated date preview); 4. Action button. Relocates session info subtly to the bottom. |
| **`AnalyticsTab.tsx`** | Date filtering (`Today`, `This Week`, `This Month`, `Custom Range`), OPD volume metrics, completed ratio, new vs. follow-up ratio, and responsive daily volume trends bar chart. |
| **`StaffPerformanceTable.tsx`** | Displays four essential reception metrics: **Staff Member**, **Registrations**, **Share %**, and **Morning/Evening Session Breakdown** (`M: X / E: Y`). On mobile screens (`< md`), automatically converts into stacked vertical cards without horizontal scroll. |

---

## 🧩 Appointment Desk Architecture (`src/components/appointment-desk/`)

The spot appointment booking system in `SpotAppointmentDesk.tsx` is modularized into focused, reusable sub-components:

| Component | Responsibility & Features |
| :--- | :--- |
| **`SpotAppointmentDesk.tsx`** | Container orchestrator. Manages form state, real-time autocomplete search triggers, validation, 3-second timed toast notifications, audio chimes, and appointment submission. |
| **`PatientInfoFields.tsx`** | Manages patient full name, mobile number (+91), age, and gender selection. Features compact search suggestions (`max-h-48`) displaying Name + Phone (`Ramesh Kumar (+91 98450 12345)`), auto-fill, and full in-place editing of phone number and age for returning patients. |
| **`DoctorSessionFields.tsx`** | Provides `DoctorSelectDropdown` for assigning consulting doctors and `DateSessionRow` for date selection and auto-selected Morning/Evening OPD session slots. |
| **`ComplaintTags.tsx`** | Renders quick-toggle multi-select ENT tags (`Ear Pain`, `Throat Pain`, `Sinus & Cold`, `Hearing Check`, etc.) and a free-text input for custom chief complaints. |
| **`ExtraNotesField.tsx`** | Manages optional clinician notes, scan reports, wheelchair requirements, or special consultation instructions. |
| **`FormActions.tsx`** | Renders form controls: **"Clear Form"** reset button and the primary **"Schedule Appointment"** submit button with icon feedback. |

---

## ⚡ Key Workflow Capabilities

### 1. Vertical Patient Queue Card Hierarchy (`QueueCard.tsx` / `LiveOpdQueueTable.tsx`)
- **Top Line**: Token Number (e.g., `#M-01`) on the left, with Status Badge (`Waiting` / `Consulted`) beside it.
- **Second Line**: Patient Name on its own dedicated row.
- **Third Line**: Gender & Age (`Female · 41y`) on its own dedicated row.
- **Fourth Line**: Chief Complaint clearly highlighted at the bottom.

### 2. Streamlined Clinical Consultation Flow (`PatientConsultationModal.tsx`)
- **Header Bar**: Displays only essential identification: Token #, Patient Name, Gender/Age, UHID, Status Badge, and Close Button.
- **Clinical Priority Card**: Highlights Chief Complaint first, followed by Front Desk Remarks (if present), and Contact Phone Number.
- **Historical Prescriptions**: Collapsible accordion showing prior diagnoses and past prescription document scans with full-screen lightbox inspection.
- **Consultation Entry**: Doctor diagnosis textarea, camera capture (`capture="environment"`) and PDF/image file upload, and follow-up review selector (`None`, `3 days`, `7 days`, `Custom Date` with automatic date calculation).
- **Edit Consultation**: Consulted patients can be reopened by the doctor to revise notes, prescription attachments, or review timelines via **"Save Changes"**.
- **Clean Modal Lifecycle**: Closing the modal resets active highlighting in the queue and cleanly restores background body scrolling.

### 3. Direct Doctor Appointment Registration (`AddAppointmentModal.tsx`)
- Dedicated **"Add Appointment"** button located directly above the queue search bar.
- Essential fields only: Patient Name, Contact Phone (+91), Gender, Age, OPD Session Slot (Morning/Evening), and Reason for Visit.
- Instant autocomplete matching against existing hospital patient records with dynamic age calculation.

### 4. Simplified Analytics & Mobile-Optimized Staff Performance (`AnalyticsTab.tsx` / `StaffPerformanceTable.tsx`)
- **Essential Metrics Only**: Staff Member (Name & Avatar), Total Registrations, % Share of Total, and Morning/Evening Session Breakdown (`M: 4 / E: 2`).
- **Zero Horizontal Scrolling**: Desktop displays a clean 4-column table; mobile screens (`< md`) automatically transform rows into stacked vertical cards.
- **No Extraneous Sections**: Uncluttered view focusing on clinical volume trends and staff distribution without confusing consultant metrics.

### 5. Tap-to-Call Phone Integration
- Receptionists and doctors can tap the **Contact** button to trigger instant direct phone dialing (`tel:+91...`) on mobile devices without manual dialing errors.

### 6. Centered Footer Layout (`Footer.tsx`)
- **Hospital Name:** **Vamshi ENT Hospital** in bold prominent typography.
- **Attribution:** Centered subtext `powered by AshwiniCare`.

---

## 🚀 Running Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation & Startup
```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Production Build & Linting
```bash
# Type check and lint
npm run lint

# Build for production
npm run build
```
