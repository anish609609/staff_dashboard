import React, { useState, useRef } from 'react';
import { OPDEntry, PatientRecord, DoctorUser, ConsultationRecord } from '../../types/clinic';
import { SAMPLE_PRESCRIPTION_1, SAMPLE_PRESCRIPTION_2 } from '../../data/prescriptionAssets';
import { 
  X, 
  Phone, 
  Clock, 
  Calendar, 
  Upload, 
  Camera,
  FileText, 
  Eye, 
  ZoomIn, 
  Download, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  History, 
  User, 
  CalendarCheck
} from 'lucide-react';

interface PatientConsultationModalProps {
  entry: OPDEntry;
  patient?: PatientRecord;
  currentDoctor: DoctorUser;
  isOpen: boolean;
  onClose: () => void;
  onSaveConsultation: (
    consultation: ConsultationRecord,
    updatedEntry: OPDEntry,
    updatedPatient: PatientRecord
  ) => void;
}

export const PatientConsultationModal: React.FC<PatientConsultationModalProps> = ({
  entry,
  patient,
  currentDoctor,
  isOpen,
  onClose,
  onSaveConsultation,
}) => {
  const isReturning = (patient?.totalVisits || 1) > 1;

  // Streamlined form states: strictly Doctor's Note & Follow-Up Review
  const [doctorNotes, setDoctorNotes] = useState(entry.prescription?.doctorNotes || '');
  const [followUpDays, setFollowUpDays] = useState<number | null>(7);
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [customFollowUpDate, setCustomFollowUpDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });

  // Attached prescription state with automatic timestamp
  const [attachedFile, setAttachedFile] = useState<{
    url: string;
    fileName: string;
    fileType: 'image' | 'pdf';
    fileSize?: string;
    uploadedAt: string;
    uploadedTimestamp: number;
  } | null>(() => {
    if (entry.prescription?.imageUrl) {
      return {
        url: entry.prescription.imageUrl,
        fileName: entry.prescription.fileName || 'Prescription_Scan.jpg',
        fileType: entry.prescription.fileType || 'image',
        uploadedAt: entry.prescription.uploadedAt || new Date().toLocaleString(),
        uploadedTimestamp: Date.now(),
      };
    }
    return null;
  });

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Lightbox preview for past or current prescription documents
  const [lightboxPreview, setLightboxPreview] = useState<{
    url: string;
    title: string;
    date: string;
  } | null>(null);

  if (!isOpen) return null;

  // File upload processing with automatic precise timestamping
  const handleFileProcess = (file: File) => {
    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result as string;
      const sizeInKb = (file.size / 1024).toFixed(1);
      const now = new Date();
      const formattedTimestamp = now.toLocaleString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });

      setAttachedFile({
        url: result,
        fileName: file.name || 'Prescription_Photo.jpg',
        fileType: isPdf ? 'pdf' : 'image',
        fileSize: `${sizeInKb} KB`,
        uploadedAt: formattedTimestamp,
        uploadedTimestamp: now.getTime(),
      });
    };

    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  // Quick preset sample attachment helper with timestamp
  const handleUseSampleRx = (type: 1 | 2) => {
    const sampleUrl = type === 1 ? SAMPLE_PRESCRIPTION_1 : SAMPLE_PRESCRIPTION_2;
    const name = type === 1 ? 'Handwritten_Rx_DrVamshi.jpg' : 'Audiology_Evaluation_Rx.pdf';
    const now = new Date();
    const formattedTimestamp = now.toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

    setAttachedFile({
      url: sampleUrl,
      fileName: name,
      fileType: type === 1 ? 'image' : 'pdf',
      fileSize: '142 KB',
      uploadedAt: formattedTimestamp,
      uploadedTimestamp: now.getTime(),
    });

    if (!doctorNotes) {
      setDoctorNotes(
        type === 1
          ? 'Nasal endoscopy revealed deviated nasal septum to right with turbinate hypertrophy. Advised steam inhalation & water precautions. Review after 1 week.'
          : 'Pure tone audiometry shows mild-moderate presbycusis. Advised digital hearing aid trial in audio lab.'
      );
    }
  };

  // Handle Complete Consultation & Save
  const handleCompleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const uploadTimeStr = attachedFile?.uploadedAt || now.toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

    // Calculate follow-up days if custom date selected
    let effectiveFollowUpDays = followUpDays;
    if (showCustomDate && customFollowUpDate) {
      const targetDate = new Date(customFollowUpDate);
      const diffMs = targetDate.getTime() - now.getTime();
      effectiveFollowUpDays = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));
    }

    const consultationRecord: ConsultationRecord = {
      id: `cons-${Date.now()}`,
      opdEntryId: entry.id,
      patientId: entry.patientId,
      patientName: entry.patientName,
      doctorName: currentDoctor.name,
      date: formattedDate,
      timestamp: Date.now(),
      chiefComplaint: entry.chiefComplaint,
      diagnosis: doctorNotes.trim() || entry.chiefComplaint || 'Consultation Completed',
      doctorNotes: doctorNotes.trim(),
      prescriptionImageUrl: attachedFile?.url,
      prescriptionFileName: attachedFile?.fileName,
      prescriptionFileType: attachedFile?.fileType,
      followUpDays: effectiveFollowUpDays || undefined,
    };

    const updatedEntry: OPDEntry = {
      ...entry,
      status: 'consulted',
      prescription: {
        uploadedAt: uploadTimeStr,
        doctorNotes: doctorNotes.trim(),
        imageUrl: attachedFile?.url,
        fileName: attachedFile?.fileName,
        fileType: attachedFile?.fileType,
      },
    };

    const updatedPatient: PatientRecord = {
      ...(patient || {
        id: entry.patientId,
        uhid: `VEH-${Math.floor(10000 + Math.random() * 90000)}`,
        name: entry.patientName,
        phone: entry.phone,
        gender: entry.gender,
        age: entry.age,
        lastVisitDate: formattedDate,
        totalVisits: 1,
      }),
      lastVisitDate: formattedDate,
      totalVisits: (patient?.totalVisits || 1) + 1,
      pastVisits: [
        {
          id: `pv-${Date.now()}`,
          date: formattedDate,
          doctorName: currentDoctor.name,
          diagnosis: doctorNotes.trim() || entry.chiefComplaint || 'Consultation',
          complaint: entry.chiefComplaint || 'Consultation',
          notes: doctorNotes.trim(),
          prescriptionUrl: attachedFile?.url,
          prescriptionFileName: attachedFile?.fileName,
          prescriptionType: attachedFile?.fileType,
        },
        ...(patient?.pastVisits || []),
      ],
    };

    onSaveConsultation(consultationRecord, updatedEntry, updatedPatient);
    onClose();
  };

  const pastVisits = patient?.pastVisits || [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[94vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Clean, Light Top Header (No dark background, no doctor name, no status badges) */}
        <div className="px-5 py-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className={`px-3 py-1 rounded-lg text-xs sm:text-sm font-extrabold font-tabular shrink-0 ${
                entry.session === 'morning'
                  ? 'bg-amber-100 text-amber-950 border border-amber-300'
                  : 'bg-indigo-100 text-indigo-950 border border-indigo-300'
              }`}
            >
              #{entry.tokenDisplay}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-950 truncate">
                  {entry.patientName}
                </h3>
                <span className="text-xs text-slate-500 font-tabular font-medium">
                  ({entry.gender}, {entry.age ? `${entry.age}y` : 'Age N/A'})
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                UHID: <span className="text-slate-600 font-bold">{patient?.uhid || 'VEH-Pending'}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            title="Close patient file"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/60">
          {/* SECTION 1: Staff Registration Details */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
                  1. Staff Registration Details
                </h4>
              </div>
              <div>
                {isReturning ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                    Follow-up Patient ({patient?.totalVisits} visits)
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                    New Patient Registration
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  Reason for Visit / Chief Complaint
                </span>
                <p className="font-bold text-slate-900 text-xs sm:text-sm">
                  {entry.chiefComplaint || 'General ENT Consultation'}
                </p>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  Contact Phone (Tap-to-Dial)
                </span>
                <a
                  href={`tel:+91${entry.phone}`}
                  className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1.5 font-tabular text-xs sm:text-sm"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>+91 {entry.phone}</span>
                </a>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  Registered Timestamp &amp; Intake Staff
                </span>
                <p className="font-semibold text-slate-700 flex items-center gap-1.5 font-tabular">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{entry.registeredTime} by <strong>{entry.createdBy}</strong></span>
                </p>
              </div>
            </div>

            {/* Front Desk Remarks / Extra Notes */}
            {entry.extraNote && (
              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-lg text-xs flex items-start gap-2 text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Front Desk Remarks: </span>
                  <span>{entry.extraNote}</span>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: Previous Visits & Past Prescriptions */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-teal-600" />
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
                  2. Previous Visits &amp; Past Prescriptions ({pastVisits.length})
                </h4>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                Click thumbnails to zoom scanned slips
              </span>
            </div>

            {pastVisits.length === 0 ? (
              <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-lg text-center text-xs text-slate-500">
                No past visit records found. This is the patient's first consult recorded at Vamshi ENT Hospital.
              </div>
            ) : (
              <div className="space-y-3">
                {pastVisits.map((visit) => (
                  <div
                    key={visit.id}
                    className="p-3.5 bg-slate-50/80 border border-slate-200 rounded-xl space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 font-tabular flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {visit.date}
                          </span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-600 font-medium">{visit.doctorName}</span>
                        </div>
                        <p className="font-bold text-emerald-900 mt-0.5">
                          <span className="text-slate-400 font-normal">Diagnosis / Remarks: </span>
                          {visit.diagnosis}
                        </p>
                      </div>

                      {visit.prescriptionUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            setLightboxPreview({
                              url: visit.prescriptionUrl!,
                              title: visit.prescriptionFileName || `${patient?.name}_Rx_${visit.date}`,
                              date: visit.date,
                            })
                          }
                          className="flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer shrink-0"
                        >
                          <Eye className="w-3.5 h-3.5 text-emerald-600" />
                          <span>View Slip</span>
                        </button>
                      )}
                    </div>

                    <div className="bg-white p-2 rounded-lg border border-slate-100 text-[11px] text-slate-600 space-y-0.5">
                      <div>
                        <strong className="text-slate-700">Complaint: </strong>
                        {visit.complaint}
                      </div>
                      {visit.notes && (
                        <div>
                          <strong className="text-slate-700">Advice: </strong>
                          {visit.notes}
                        </div>
                      )}
                    </div>

                    {/* Prescription Attachment Thumbnail */}
                    {visit.prescriptionUrl && (
                      <div className="flex items-center gap-2.5 pt-1">
                        <div
                          onClick={() =>
                            setLightboxPreview({
                              url: visit.prescriptionUrl!,
                              title: visit.prescriptionFileName || `Rx_${visit.date}`,
                              date: visit.date,
                            })
                          }
                          className="relative w-16 h-20 rounded border border-slate-300 bg-white overflow-hidden shadow-2xs cursor-pointer group hover:ring-2 hover:ring-emerald-500 transition-all shrink-0"
                        >
                          <img
                            src={visit.prescriptionUrl}
                            alt="Prescription preview"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/40 flex items-center justify-center transition-colors">
                            <ZoomIn className="w-4 h-4 text-white opacity-80 group-hover:opacity-100" />
                          </div>
                        </div>
                        <div className="text-left text-xs min-w-0">
                          <p className="font-bold text-slate-900 truncate text-[11px]">
                            {visit.prescriptionFileName || 'Prescription Attachment'}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Archived Consultation Slip · Click to inspect full document
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 3: Current Consultation Area (Strictly ONLY 3 Elements in exact sequence) */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-2.5">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
                3. Current Consultation
              </h4>
            </div>

            <form onSubmit={handleCompleteSubmit} className="space-y-4">
              {/* ELEMENT 1: 📷 Prescription Image Uploader (Positioned First) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Attach Prescription Image / Photo</span>
                  </label>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleUseSampleRx(1)}
                      className="text-[10px] font-bold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-2 py-0.5 rounded border border-teal-200 transition-colors cursor-pointer flex items-center gap-1"
                      title="Attach sample handwritten ENT Rx slip"
                    >
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Attach Sample Rx</span>
                    </button>
                  </div>
                </div>

                {/* Hidden input for regular file selection */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleInputChange}
                  className="hidden"
                />

                {/* Hidden input for direct camera snapshot trigger */}
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleInputChange}
                  className="hidden"
                />

                {!attachedFile ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`p-4 rounded-xl border-2 border-dashed text-center transition-all ${
                      isDragging
                        ? 'border-emerald-600 bg-emerald-50'
                        : 'border-slate-300 hover:border-slate-400 bg-slate-50/70 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                        <Camera className="w-4 h-4" />
                      </div>
                      <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center">
                        <Upload className="w-4 h-4" />
                      </div>
                    </div>

                    <p className="text-xs font-bold text-slate-800">
                      Photograph or attach handwritten prescription slip
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5 mb-3">
                      JPG, PNG photos or scanned PDF documents
                    </p>

                    {/* Dual Action Buttons: Direct Camera vs Browse Files */}
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Take Camera Photo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5 text-slate-500" />
                        <span>Upload File / PDF</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-50/70 border border-emerald-300 rounded-xl space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          onClick={() =>
                            setLightboxPreview({
                              url: attachedFile.url,
                              title: attachedFile.fileName,
                              date: attachedFile.uploadedAt,
                            })
                          }
                          className="w-12 h-14 rounded-lg bg-white border border-emerald-300 overflow-hidden shrink-0 flex items-center justify-center shadow-2xs cursor-pointer group"
                          title="Click to zoom attached prescription"
                        >
                          {attachedFile.fileType === 'pdf' ? (
                            <FileText className="w-6 h-6 text-rose-500" />
                          ) : (
                            <img
                              src={attachedFile.url}
                              alt="Attached Prescription"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {attachedFile.fileName}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200/60 px-1.5 py-0.2 rounded uppercase">
                              Attached
                            </span>
                          </div>

                          {/* EXACT PERMANENT PRESCRIPTION UPLOAD TIMESTAMP */}
                          <div className="text-[11px] font-bold text-emerald-900 font-tabular flex items-center gap-1.5 mt-0.5">
                            <CalendarCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Upload Timestamp: {attachedFile.uploadedAt}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => cameraInputRef.current?.click()}
                          className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1"
                          title="Take new camera photo"
                        >
                          <Camera className="w-3 h-3 text-slate-500" />
                          <span className="hidden sm:inline">Camera</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          Replace
                        </button>
                        <button
                          type="button"
                          onClick={() => setAttachedFile(null)}
                          className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Remove file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ELEMENT 2: 📝 Doctor's Note */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Doctor's Note / Clinical Observations</span>
                </label>
                <textarea
                  rows={3}
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  placeholder="Enter diagnosis, clinical observations, surgical advice, or remarks..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-600 transition-colors"
                />
              </div>

              {/* ELEMENT 3: 📅 Follow-Up Review */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Follow-Up Review</span>
                </label>
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { label: 'None', value: null },
                    { label: '3 days', value: 3 },
                    { label: '7 days', value: 7 },
                    { label: '14 days', value: 14 },
                    { label: '30 days', value: 30 },
                  ].map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        setFollowUpDays(item.value);
                        setShowCustomDate(false);
                      }}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                        !showCustomDate && followUpDays === item.value
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowCustomDate(true)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                      showCustomDate
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Custom Date
                  </button>

                  {showCustomDate && (
                    <input
                      type="date"
                      value={customFollowUpDate}
                      onChange={(e) => setCustomFollowUpDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-tabular font-medium focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
                    />
                  )}
                </div>
              </div>

              {/* Action Buttons: Clean & Light */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-[11px] text-slate-400">
                  Updates status to <strong className="text-emerald-700">CONSULTED</strong> and logs prescription in history.
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:shadow transition-all cursor-pointer flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete Consultation &amp; Save</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Clean, Light Lightbox Modal for zooming attached or historical prescription */}
      {lightboxPreview && (
        <div className="fixed inset-0 z-60 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="px-5 py-3.5 bg-white text-slate-900 flex items-center justify-between border-b border-slate-200">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="truncate">
                  <h5 className="text-xs sm:text-sm font-bold truncate text-slate-900">
                    {lightboxPreview.title}
                  </h5>
                  <p className="text-[10px] text-slate-500 font-tabular">
                    Timestamp / Date: {lightboxPreview.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={lightboxPreview.url}
                  download={lightboxPreview.title}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer text-xs flex items-center gap-1 px-2 border border-slate-200"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Save</span>
                </a>
                <button
                  type="button"
                  onClick={() => setLightboxPreview(null)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-50 flex items-center justify-center min-h-[350px]">
              <div className="bg-white p-2 rounded-lg shadow-md border border-slate-300 max-w-full">
                <img
                  src={lightboxPreview.url}
                  alt={lightboxPreview.title}
                  className="max-h-[72vh] w-auto object-contain rounded"
                />
              </div>
            </div>

            <div className="px-5 py-2.5 bg-white border-t border-slate-200 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setLightboxPreview(null)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold text-xs transition-colors cursor-pointer"
              >
                Close Zoom View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
