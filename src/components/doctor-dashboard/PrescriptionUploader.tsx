import React, { useState, useRef } from 'react';
import { OPDEntry } from '../../types/clinic';
import { SAMPLE_PRESCRIPTION_1, SAMPLE_PRESCRIPTION_2 } from '../../data/prescriptionAssets';
import { 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  Trash2, 
  CheckCircle, 
  Sparkles, 
  Stethoscope, 
  Pill, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

interface PrescriptionUploaderProps {
  entry: OPDEntry;
  doctorName: string;
  onCompleteConsultation: (data: {
    diagnosis: string;
    doctorNotes: string;
    medicines: string;
    followUpDays: number | null;
    prescriptionFile?: {
      url: string;
      fileName: string;
      fileType: 'image' | 'pdf';
    };
  }) => void;
}

export const PrescriptionUploader: React.FC<PrescriptionUploaderProps> = ({
  entry,
  doctorName,
  onCompleteConsultation,
}) => {
  const [diagnosis, setDiagnosis] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [medicines, setMedicines] = useState('');
  const [followUpDays, setFollowUpDays] = useState<number | null>(7);
  const [isDragging, setIsDragging] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{
    url: string;
    fileName: string;
    fileType: 'image' | 'pdf';
    fileSize?: string;
    uploadedAt: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle local file selection with automatic timestamp capture
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
        fileName: file.name,
        fileType: isPdf ? 'pdf' : 'image',
        fileSize: `${sizeInKb} KB`,
        uploadedAt: formattedTimestamp,
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

  // Quick preset sample attachment helper
  const handleUseSampleRx = (type: 1 | 2) => {
    const sampleUrl = type === 1 ? SAMPLE_PRESCRIPTION_1 : SAMPLE_PRESCRIPTION_2;
    const name = type === 1 ? 'Handwritten_Rx_DrVamshi.jpg' : 'Audiometry_Evaluation_Rx.pdf';
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
    });
    if (!diagnosis) {
      setDiagnosis(type === 1 ? 'Deviated Nasal Septum & Chronic Sinusitis' : 'Presbycusis with Mild Tinnitus');
    }
    if (!medicines) {
      setMedicines(
        type === 1
          ? '1. Tab Augmentin 625mg (1-0-1) x 5 days\n2. Tab Levocet-M (0-0-1) at night x 10 days\n3. Fluticasone Nasal Spray 2 puffs BD'
          : '1. Tab Ginkgo Biloba 120mg (1-0-0) x 30 days\n2. Cap Neuro-B (0-0-1) x 30 days\n3. Hearing aid trial in Audio Lab'
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    onCompleteConsultation({
      diagnosis: diagnosis.trim() || entry.chiefComplaint || 'Consultation Completed',
      doctorNotes: doctorNotes.trim(),
      medicines: medicines.trim(),
      followUpDays,
      prescriptionFile: attachedFile ? {
        url: attachedFile.url,
        fileName: attachedFile.fileName,
        fileType: attachedFile.fileType,
      } : undefined,
    });

    setIsSubmitting(false);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Consultation Completion &amp; Prescription Upload
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-slate-500 font-tabular">
          Consulting: <span className="text-slate-800 font-bold">{doctorName}</span>
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Diagnosis & Follow-up */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Final Clinical Diagnosis / Assessment
            </label>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g. Right DNS with Hypertrophied Turbinates, Acute Otitis..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Recommended Follow-Up
            </label>
            <div className="grid grid-cols-4 gap-1">
              {[null, 3, 7, 14].map((days) => (
                <button
                  key={days === null ? 'none' : days}
                  type="button"
                  onClick={() => setFollowUpDays(days)}
                  className={`py-1.5 px-1 text-[11px] font-bold rounded-lg border text-center transition-colors cursor-pointer ${
                    followUpDays === days
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {days === null ? 'None' : `${days}d`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Medicines Prescribed */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Pill className="w-3.5 h-3.5 text-teal-600" />
              <span>Prescribed Drugs / Treatment Summary (Optional)</span>
            </span>
            <span className="text-[10px] text-slate-400 font-normal">
              Handwritten slip will be primary
            </span>
          </label>
          <textarea
            rows={2}
            value={medicines}
            onChange={(e) => setMedicines(e.target.value)}
            placeholder="e.g. Tab Cefpodoxime 200mg 1-0-1 x 5 days, Nasal Decongestant spray..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-600 transition-colors"
          />
        </div>

        {/* Row 3: Internal Doctor Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">
            Internal Consultation Remarks / Surgical Notes (Optional)
          </label>
          <input
            type="text"
            value={doctorNotes}
            onChange={(e) => setDoctorNotes(e.target.value)}
            placeholder="e.g. Normal tympanic membrane bilaterally. Explained steam inhalation cautions."
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-600 transition-colors"
          />
        </div>

        {/* Row 4: Drag & Drop / Photo Prescription Attachment Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-emerald-600" />
              <span>Attach Physical Handwritten / Printed Prescription</span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-semibold">
                Photo / PDF Scan
              </span>
            </label>

            {/* Quick Demo Presets */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">Quick Test Preset:</span>
              <button
                type="button"
                onClick={() => handleUseSampleRx(1)}
                className="text-[10px] font-bold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-2 py-0.5 rounded border border-teal-200 transition-colors cursor-pointer flex items-center gap-1"
                title="Attach standard sample ENT Rx photo"
              >
                <Sparkles className="w-2.5 h-2.5" />
                <span>Sample ENT Rx</span>
              </button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            onChange={handleInputChange}
            className="hidden"
          />

          {!attachedFile ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-5 rounded-xl border-2 border-dashed text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-emerald-600 bg-emerald-50'
                  : 'border-slate-300 hover:border-slate-400 bg-slate-50/60 hover:bg-slate-50'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 mx-auto flex items-center justify-center mb-2">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-800">
                Drag &amp; drop prescription photo or PDF, or <span className="text-emerald-700 underline underline-offset-2">browse files</span>
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Supports camera snapshot, JPG, PNG, or PDF scanned consultation slips
              </p>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl flex items-center justify-between gap-3 animate-in fade-in duration-100">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-14 rounded-lg bg-white border border-emerald-200 overflow-hidden shrink-0 flex items-center justify-center shadow-2xs">
                  {attachedFile.fileType === 'pdf' ? (
                    <FileText className="w-6 h-6 text-rose-500" />
                  ) : (
                    <img
                      src={attachedFile.url}
                      alt="Attached Prescription"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {attachedFile.fileName}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-1.5 py-0.2 rounded uppercase">
                      Attached
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-tabular">
                    {attachedFile.fileSize || 'Image Document'} · Ready to save in clinical record
                  </p>
                  <p className="text-[10px] font-bold text-emerald-800 font-tabular mt-0.5">
                    Uploaded: {attachedFile.uploadedAt}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
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
          )}
        </div>

        {/* Submit Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-100">
          <p className="text-[11px] text-slate-400 font-medium">
            Completing consultation will update patient status to <span className="font-semibold text-emerald-700">CONSULTED</span> and advance the queue.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:shadow transition-all cursor-pointer disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Complete Consultation &amp; Save</span>
          </button>
        </div>
      </form>
    </div>
  );
};
