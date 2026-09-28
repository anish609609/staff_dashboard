/**
 * Realistic high-fidelity prescription and clinical report preview images (SVG Data URLs)
 * for past consultations and previewing attachments in Doctor Dashboard.
 */

export const SAMPLE_PRESCRIPTION_1 = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800" style="background:#fcfbf7;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto;">
  <rect width="600" height="800" fill="#fcfbf7"/>
  <rect x="20" y="20" width="560" height="760" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" rx="8"/>
  
  <!-- Header Letterhead -->
  <rect x="20" y="20" width="560" height="110" fill="#0f766e" rx="8"/>
  <text x="50" y="58" fill="#ffffff" font-size="22" font-weight="bold">VAMSHI ENT HOSPITAL</text>
  <text x="50" y="78" fill="#99f6e4" font-size="12" font-weight="medium">Super Speciality Ear, Nose &amp; Throat Care Center</text>
  <text x="50" y="98" fill="#ccfbf1" font-size="10">Consultation Slip · Reg No: VEH-KL-9821 · Tel: +91 40 2345 6789</text>
  
  <!-- Doctor Details -->
  <text x="550" y="54" fill="#ffffff" font-size="13" font-weight="bold" text-anchor="end">Dr. Vamshi Krishna</text>
  <text x="550" y="72" fill="#99f6e4" font-size="11" text-anchor="end">MS (ENT), Senior Consultant</text>
  <text x="550" y="90" fill="#ccfbf1" font-size="10" text-anchor="end">Reg: TSMC-44821</text>
  
  <!-- Patient Info Bar -->
  <rect x="35" y="145" width="530" height="52" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1" rx="4"/>
  <text x="50" y="166" fill="#334155" font-size="11" font-weight="bold">Patient: <tspan fill="#0f172a">Rajesh Kumar</tspan></text>
  <text x="240" y="166" fill="#334155" font-size="11" font-weight="bold">Age / Gender: <tspan fill="#0f172a">48y / Male</tspan></text>
  <text x="420" y="166" fill="#334155" font-size="11" font-weight="bold">UHID: <tspan fill="#0f172a">VEH-10492</tspan></text>
  <text x="50" y="186" fill="#334155" font-size="11" font-weight="bold">Date: <tspan fill="#0f172a">12 Aug 2026</tspan></text>
  <text x="240" y="186" fill="#334155" font-size="11" font-weight="bold">BP: <tspan fill="#0f172a">128/84 mmHg</tspan></text>
  <text x="420" y="186" fill="#334155" font-size="11" font-weight="bold">Weight: <tspan fill="#0f172a">72 kg</tspan></text>

  <!-- Clinical Diagnosis -->
  <text x="50" y="230" fill="#0f766e" font-size="14" font-weight="bold">CLINICAL DIAGNOSIS:</text>
  <text x="50" y="252" fill="#1e293b" font-size="13" font-style="italic">Deviated Nasal Septum (DNS) to Right with Chronic Sinusitis</text>

  <!-- Rx symbol -->
  <text x="50" y="300" fill="#0f766e" font-size="28" font-family="serif" font-weight="bold">℞</text>
  <line x1="50" y1="312" x2="550" y2="312" stroke="#e2e8f0" stroke-width="1"/>

  <!-- Medicines Table -->
  <g transform="translate(50, 335)">
    <!-- Item 1 -->
    <text x="0" y="0" fill="#0f172a" font-size="13" font-weight="bold">1. Tab. Amoxicillin + Clavulanate (625mg)</text>
    <text x="20" y="18" fill="#475569" font-size="11">1 Tablet — Twice daily (After food) × 5 Days</text>
    <text x="420" y="0" fill="#64748b" font-size="11" font-weight="semibold">Qty: 10 Tabs</text>

    <!-- Item 2 -->
    <text x="0" y="55" fill="#0f172a" font-size="13" font-weight="bold">2. Tab. Levocetirizine + Montelukast (5/10mg)</text>
    <text x="20" y="73" fill="#475569" font-size="11">1 Tablet — Night only at bedtime × 10 Days</text>
    <text x="420" y="55" fill="#64748b" font-size="11" font-weight="semibold">Qty: 10 Tabs</text>

    <!-- Item 3 -->
    <text x="0" y="110" fill="#0f172a" font-size="13" font-weight="bold">3. Fluticasone Furoate Nasal Spray 27.5mcg</text>
    <text x="20" y="128" fill="#475569" font-size="11">2 Puffs in each nostril daily morning × 15 Days</text>
    <text x="420" y="110" fill="#64748b" font-size="11" font-weight="semibold">Qty: 1 Bottle</text>

    <!-- Item 4 -->
    <text x="0" y="165" fill="#0f172a" font-size="13" font-weight="bold">4. Normal Saline Nasal Wash Sachets</text>
    <text x="20" y="183" fill="#475569" font-size="11">Gentle nasal lavage twice daily with warm distilled water</text>
    <text x="420" y="165" fill="#64748b" font-size="11" font-weight="semibold">Qty: 1 Pack</text>
  </g>

  <!-- Doctor Advice & Instructions Box -->
  <rect x="45" y="560" width="510" height="90" fill="#f0fdfa" stroke="#99f6e4" stroke-width="1" rx="6"/>
  <text x="60" y="582" fill="#0f766e" font-size="12" font-weight="bold">DOCTOR'S CLINICAL ADVICE &amp; CAUTIONS:</text>
  <text x="60" y="604" fill="#334155" font-size="11">• Steam inhalation morning and evening for 5 minutes.</text>
  <text x="60" y="622" fill="#334155" font-size="11">• Avoid direct AC air blast &amp; cold beverages for 2 weeks.</text>
  <text x="60" y="640" fill="#334155" font-size="11">• Review with CT PNS scan report if nasal blockage persists.</text>

  <!-- Footer Signatures -->
  <line x1="45" y1="675" x2="555" y2="675" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="4,4"/>
  <text x="50" y="705" fill="#64748b" font-size="11">Next Follow-up Visit: <tspan fill="#0f766e" font-weight="bold">After 7 Days (19 Aug 2026)</tspan></text>
  <text x="50" y="725" fill="#94a3b8" font-size="10">Consult emergency ENT triage in case of acute nose bleeding or high fever.</text>

  <!-- Digital Stamp & Signature -->
  <path d="M 430,715 C 450,700 480,725 500,705 C 515,690 535,715 545,710" fill="none" stroke="#1d4ed8" stroke-width="2" stroke-linecap="round"/>
  <text x="490" y="730" fill="#0f172a" font-size="11" font-weight="bold" text-anchor="middle">Dr. Vamshi Krishna</text>
  <text x="490" y="744" fill="#64748b" font-size="9" text-anchor="middle">MS (ENT), Reg No: 44821</text>
</svg>
`)}`;

export const SAMPLE_PRESCRIPTION_2 = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800" style="background:#fafaf9;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto;">
  <rect width="600" height="800" fill="#fafaf9"/>
  <rect x="20" y="20" width="560" height="760" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" rx="8"/>
  
  <!-- Header Letterhead -->
  <rect x="20" y="20" width="560" height="110" fill="#047857" rx="8"/>
  <text x="50" y="58" fill="#ffffff" font-size="22" font-weight="bold">VAMSHI ENT HOSPITAL</text>
  <text x="50" y="78" fill="#a7f3d0" font-size="12" font-weight="medium">Otology &amp; Audiology Evaluation Clinic</text>
  <text x="50" y="98" fill="#d1fae5" font-size="10">Consultation Slip · Reg No: VEH-AUD-105 · Tel: +91 40 2345 6789</text>
  
  <text x="550" y="54" fill="#ffffff" font-size="13" font-weight="bold" text-anchor="end">Dr. Vamshi Krishna</text>
  <text x="550" y="72" fill="#a7f3d0" font-size="11" text-anchor="end">Senior ENT Surgeon</text>
  <text x="550" y="90" fill="#d1fae5" font-size="10" text-anchor="end">Room 01 (ENT Outpatient)</text>
  
  <!-- Patient Info Bar -->
  <rect x="35" y="145" width="530" height="52" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1" rx="4"/>
  <text x="50" y="166" fill="#334155" font-size="11" font-weight="bold">Patient: <tspan fill="#0f172a">Lakshmi Narayanan</tspan></text>
  <text x="240" y="166" fill="#334155" font-size="11" font-weight="bold">Age / Gender: <tspan fill="#0f172a">62y / Female</tspan></text>
  <text x="420" y="166" fill="#334155" font-size="11" font-weight="bold">UHID: <tspan fill="#0f172a">VEH-10518</tspan></text>
  <text x="50" y="186" fill="#334155" font-size="11" font-weight="bold">Date: <tspan fill="#0f172a">02 Sep 2026</tspan></text>
  <text x="240" y="186" fill="#334155" font-size="11" font-weight="bold">Tympanometry: <tspan fill="#0f172a">Type A Bilateral</tspan></text>
  <text x="420" y="186" fill="#334155" font-size="11" font-weight="bold">PTA Check: <tspan fill="#0f172a">Mild-Moderate</tspan></text>

  <!-- Clinical Diagnosis -->
  <text x="50" y="230" fill="#047857" font-size="14" font-weight="bold">CLINICAL DIAGNOSIS:</text>
  <text x="50" y="252" fill="#1e293b" font-size="13" font-style="italic">Bilateral Age-Related Sensorineural Hearing Loss (Presbycusis) with Mild Tinnitus</text>

  <!-- Rx symbol -->
  <text x="50" y="300" fill="#047857" font-size="28" font-family="serif" font-weight="bold">℞</text>
  <line x1="50" y1="312" x2="550" y2="312" stroke="#e2e8f0" stroke-width="1"/>

  <!-- Medicines Table -->
  <g transform="translate(50, 335)">
    <text x="0" y="0" fill="#0f172a" font-size="13" font-weight="bold">1. Tab. Ginkgo Biloba Extract (120mg)</text>
    <text x="20" y="18" fill="#475569" font-size="11">1 Tablet once daily in the morning × 30 Days</text>
    <text x="420" y="0" fill="#64748b" font-size="11" font-weight="semibold">Qty: 30 Tabs</text>

    <text x="0" y="55" fill="#0f172a" font-size="13" font-weight="bold">2. Tab. Methylcobalamin + Alpha Lipoic Acid</text>
    <text x="20" y="73" fill="#475569" font-size="11">1 Capsule daily after dinner × 30 Days (Neuro-support)</text>
    <text x="420" y="55" fill="#64748b" font-size="11" font-weight="semibold">Qty: 30 Caps</text>

    <text x="0" y="110" fill="#0f172a" font-size="13" font-weight="bold">3. Pure Tone Audiometry (PTA) &amp; Speech Discrimination</text>
    <text x="20" y="128" fill="#475569" font-size="11">Referred to Audio Lab Room 03 for digital hearing aid trial</text>
    <text x="420" y="110" fill="#047857" font-size="11" font-weight="bold">Trial Prescribed</text>
  </g>

  <!-- Doctor Advice & Instructions Box -->
  <rect x="45" y="510" width="510" height="90" fill="#ecfdf5" stroke="#a7f3d0" stroke-width="1" rx="6"/>
  <text x="60" y="532" fill="#047857" font-size="12" font-weight="bold">DOCTOR'S INSTRUCTIONS &amp; LIFESTYLE ADVICE:</text>
  <text x="60" y="554" fill="#334155" font-size="11">• Avoid prolonged exposure to loud televisions and noisy environments.</text>
  <text x="60" y="572" fill="#334155" font-size="11">• Binaural RIC (Receiver-in-Canal) hearing aid recommended for conversational clarity.</text>
  <text x="60" y="590" fill="#334155" font-size="11">• Maintain adequate ear canal dryness. Avoid earbud cleaning.</text>

  <!-- Footer Signatures -->
  <line x1="45" y1="675" x2="555" y2="675" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="4,4"/>
  <text x="50" y="705" fill="#64748b" font-size="11">Review: <tspan fill="#047857" font-weight="bold">In 4 Weeks after Hearing Aid Trial Fitting</tspan></text>
  
  <path d="M 430,715 C 450,700 480,725 500,705 C 515,690 535,715 545,710" fill="none" stroke="#047857" stroke-width="2" stroke-linecap="round"/>
  <text x="490" y="730" fill="#0f172a" font-size="11" font-weight="bold" text-anchor="middle">Dr. Vamshi Krishna</text>
  <text x="490" y="744" fill="#64748b" font-size="9" text-anchor="middle">MS (ENT), Reg No: 44821</text>
</svg>
`)}`;

export const SAMPLE_PRESCRIPTION_3 = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800" style="background:#f8fafc;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto;">
  <rect width="600" height="800" fill="#f8fafc"/>
  <rect x="20" y="20" width="560" height="760" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" rx="8"/>
  
  <rect x="20" y="20" width="560" height="110" fill="#0369a1" rx="8"/>
  <text x="50" y="58" fill="#ffffff" font-size="22" font-weight="bold">VAMSHI ENT HOSPITAL</text>
  <text x="50" y="78" fill="#bae6fd" font-size="12" font-weight="medium">Laryngology &amp; Voice Disorders Clinic</text>
  <text x="50" y="98" fill="#e0f2fe" font-size="10">Consultation Slip · Reg No: VEH-VOI-3301 · Tel: +91 40 2345 6789</text>
  
  <text x="550" y="54" fill="#ffffff" font-size="13" font-weight="bold" text-anchor="end">Dr. Vamshi Krishna</text>
  <text x="550" y="72" fill="#bae6fd" font-size="11" text-anchor="end">MS (ENT), Head &amp; Neck</text>
  <text x="550" y="90" fill="#e0f2fe" font-size="10" text-anchor="end">Room 01 (ENT Outpatient)</text>
  
  <rect x="35" y="145" width="530" height="52" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1" rx="4"/>
  <text x="50" y="166" fill="#334155" font-size="11" font-weight="bold">Patient: <tspan fill="#0f172a">Meenakshi Sundaram</tspan></text>
  <text x="240" y="166" fill="#334155" font-size="11" font-weight="bold">Age / Gender: <tspan fill="#0f172a">54y / Female</tspan></text>
  <text x="420" y="166" fill="#334155" font-size="11" font-weight="bold">UHID: <tspan fill="#0f172a">VEH-10789</tspan></text>
  <text x="50" y="186" fill="#334155" font-size="11" font-weight="bold">Date: <tspan fill="#0f172a">15 Sep 2026</tspan></text>
  <text x="240" y="186" fill="#334155" font-size="11" font-weight="bold">Video Laryngoscopy: <tspan fill="#0f172a">Vocal Cord Nodules (Bilateral)</tspan></text>
  <text x="420" y="186" fill="#334155" font-size="11" font-weight="bold">Ref: <tspan fill="#0f172a">Voice Clinic</tspan></text>

  <text x="50" y="230" fill="#0369a1" font-size="14" font-weight="bold">CLINICAL DIAGNOSIS:</text>
  <text x="50" y="252" fill="#1e293b" font-size="13" font-style="italic">Bilateral Vocal Cord Nodules due to Vocal Abuse with LPRD (Laryngopharyngeal Reflux)</text>

  <text x="50" y="300" fill="#0369a1" font-size="28" font-family="serif" font-weight="bold">℞</text>
  <line x1="50" y1="312" x2="550" y2="312" stroke="#e2e8f0" stroke-width="1"/>

  <g transform="translate(50, 335)">
    <text x="0" y="0" fill="#0f172a" font-size="13" font-weight="bold">1. Tab. Pantoprazole + Domperidone (40/30mg)</text>
    <text x="20" y="18" fill="#475569" font-size="11">1 Capsule empty stomach in morning 30 mins before food × 14 Days</text>
    <text x="420" y="0" fill="#64748b" font-size="11" font-weight="semibold">Qty: 14 Caps</text>

    <text x="0" y="55" fill="#0f172a" font-size="13" font-weight="bold">2. Syp. Sodium Alginate + Potassium Bicarbonate</text>
    <text x="20" y="73" fill="#475569" font-size="11">10ml after dinner and at bedtime × 14 Days</text>
    <text x="420" y="55" fill="#64748b" font-size="11" font-weight="semibold">Qty: 1 Bottle</text>

    <text x="0" y="110" fill="#0f172a" font-size="13" font-weight="bold">3. Absolute Voice Rest &amp; Speech Therapy Sessions</text>
    <text x="20" y="128" fill="#475569" font-size="11">Speech language pathologist consultation for vocal hygiene</text>
    <text x="420" y="110" fill="#0369a1" font-size="11" font-weight="bold">Mandatory</text>
  </g>

  <rect x="45" y="510" width="510" height="90" fill="#f0f9ff" stroke="#bae6fd" stroke-width="1" rx="6"/>
  <text x="60" y="532" fill="#0369a1" font-size="12" font-weight="bold">VOICE HYGIENE INSTRUCTIONS:</text>
  <text x="60" y="554" fill="#334155" font-size="11">• Strict voice rest. Strictly do not whisper or clear throat forcefully.</text>
  <text x="60" y="572" fill="#334155" font-size="11">• Keep well hydrated (3-4 litres of warm water daily).</text>
  <text x="60" y="590" fill="#334155" font-size="11">• Early dinner (at least 2.5 hours before lying down to sleep).</text>

  <line x1="45" y1="675" x2="555" y2="675" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="4,4"/>
  <text x="50" y="705" fill="#64748b" font-size="11">Review: <tspan fill="#0369a1" font-weight="bold">After 3 Weeks with Repeat 70° Rigid Laryngoscopy</tspan></text>
  
  <path d="M 430,715 C 450,700 480,725 500,705 C 515,690 535,715 545,710" fill="none" stroke="#0369a1" stroke-width="2" stroke-linecap="round"/>
  <text x="490" y="730" fill="#0f172a" font-size="11" font-weight="bold" text-anchor="middle">Dr. Vamshi Krishna</text>
  <text x="490" y="744" fill="#64748b" font-size="9" text-anchor="middle">MS (ENT), Reg No: 44821</text>
</svg>
`)}`;
