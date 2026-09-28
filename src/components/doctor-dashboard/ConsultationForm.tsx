import React, { useState, useRef, useMemo, useEffect } from 'react';
import { OPDEntry, DoctorUser } from '../../types/clinic';
import { 
  Camera, 
  Upload, 
  FileText, 
  ZoomIn, 
  Trash2, 
  CheckCircle2, 
  CalendarCheck, 
  Edit3 
} from 'lucide-react';

interface ConsultationFormProps {
  entry: OPDEntry;
  currentDoctor: DoctorUser;
  isConsulted: boolean;
  isEditing: boolean;
  onStartEditing: () => void;
  onCancelEditing: () => void;
  onClose: () => void;
  onSave: (data: {
    doctorNotes: string;
    attachedFile: {
      url: string;
      fileName: string;
      fileType: 'image' | 'pdf';
      fileSize?: string;
      uploadedAt: string;
      uploadedTimestamp: number;
    } | null;
    followUpDays: number | undefined;
  }) => void;
  onZoomPrescription: (preview: { url: string; title: string; date: string }) => void;
}

export const ConsultationForm: React.FC<ConsultationFormProps> = ({
  entry,
  currentDoctor,
  isConsulted,
  isEditing,
  onStartEditing,
  onCancelEditing,
  onClose,
  onSave,
  onZoomPrescription,
}) => {
  // Step 1: Doctor's Note / Diagnosis
  const [doctorNotes, setDoctorNotes] = useState(entry.prescription?.doctorNotes || '');

  // Step 2: Attached prescription state
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

  // Step 3: Follow-up Review Selection: 'none' | '3' | '7' | 'custom'
  const [followUpSelection, setFollowUpSelection] = useState<'none' | '3' | '7' | 'custom'>('7');
  const [customDays, setCustomDays] = useState<string>('14');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Sync internal state when entry changes
  useEffect(() => {
    setDoctorNotes(entry.prescription?.doctorNotes || '');
    if (entry.prescription?.imageUrl) {
      setAttachedFile({
        url: entry.prescription.imageUrl,
        fileName: entry.prescription.fileName || 'Prescription_Scan.jpg',
        fileType: entry.prescription.fileType || 'image',
        uploadedAt: entry.prescription.uploadedAt || new Date().toLocaleString(),
        uploadedTimestamp: Date.now(),
      });
    } else {
      setAttachedFile(null);
    }
    setFollowUpSelection('7');
    setCustomDays('14');
  }, [entry.id, entry.prescription]);

  // Target review date preview calculation for custom days
  const targetDatePreview = useMemo(() => {
    const parsedDays = parseInt(customDays, 10);
    if (isNaN(parsedDays) || parsedDays <= 0) return null;
    const d = new Date();
    d.setDate(d.getDate() + parsedDays);
    return d.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }, [customDays]);

  // Process file upload
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
        fileName: file.name || `Prescription_${now.getTime()}.${isPdf ? 'pdf' : 'jpg'}`,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let effectiveFollowUpDays: number | undefined = undefined;
    if (followUpSelection === '3') effectiveFollowUpDays = 3;
    else if (followUpSelection === '7') effectiveFollowUpDays = 7;
    else if (followUpSelection === 'custom') {
      const parsed = parseInt(customDays, 10);
      if (!isNaN(parsed) && parsed > 0) {
        effectiveFollowUpDays = parsed;
      }
    }

    onSave({
      doctorNotes: doctorNotes.trim(),
      attachedFile,
      followUpDays: effectiveFollowUpDays,
    });
  };

  return (
    <div className="space-y-4">
      {/* Read-Only View for Consulted Patients */}
      {isConsulted && !isEditing ? (
        <div className="space-y-4">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-2.5 flex-wrap sm:flex-nowrap">
            <div className="flex items-center gap-2 min-w-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-bold text-emerald-950 truncate">
                Consultation completed by {currentDoctor.name} ({entry.prescription?.uploadedAt || 'Today'})
              </span>
            </div>
            <button
              type="button"
              onClick={onStartEditing}
              className="w-full sm:w-auto px-3.5 py-1.5 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
            >
              <Edit3 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Edit Consultation</span>
            </button>
          </div>

          {/* Doctor's Note / Diagnosis View */}
          {doctorNotes && (
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-700 block">Doctor's Note / Diagnosis</span>
              <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 whitespace-pre-wrap leading-relaxed shadow-2xs">
                {doctorNotes}
              </div>
            </div>
          )}

          {/* Attached Prescription View */}
          {attachedFile && (
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-700 block">Prescription Attachment</span>
              <div className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    onClick={() =>
                      onZoomPrescription({
                        url: attachedFile.url,
                        title: attachedFile.fileName,
                        date: attachedFile.uploadedAt,
                      })
                    }
                    className="w-12 h-14 rounded-lg bg-slate-50 border border-slate-300 overflow-hidden shrink-0 flex items-center justify-center shadow-2xs cursor-pointer"
                  >
                    {attachedFile.fileType === 'pdf' ? (
                      <FileText className="w-6 h-6 text-rose-500" />
                    ) : (
                      <img src={attachedFile.url} alt="Prescription" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{attachedFile.fileName}</p>
                    <p className="text-[11px] text-slate-500 font-tabular">Uploaded: {attachedFile.uploadedAt}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onZoomPrescription({
                      url: attachedFile.url,
                      title: attachedFile.fileName,
                      date: attachedFile.uploadedAt,
                    })
                  }
                  className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <ZoomIn className="w-3.5 h-3.5 text-slate-500" />
                  <span>Zoom</span>
                </button>
              </div>
            </div>
          )}

          {/* Relocated Session Info at the bottom of modal content */}
          <div className="pt-2.5 pb-1 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-medium font-tabular flex-wrap gap-1">
            <span>
              Session: <strong className="text-slate-800 capitalize">{entry.session} Slot</strong> · {entry.registeredTime}
            </span>
            <span>
              Staff: <strong className="text-slate-800">{entry.createdBy}</strong>
            </span>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        /* Doctor's Workflow Form */
        <form onSubmit={handleSubmit} className="space-y-4">
          {isConsulted && (
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900">
              <span className="font-semibold flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                Editing Consultation Details
              </span>
              <button
                type="button"
                onClick={onCancelEditing}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 underline cursor-pointer p-1"
              >
                Cancel
              </button>
            </div>
          )}

          {/* STEP 1: Doctor's Note / Diagnosis */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              Doctor's Note / Diagnosis
            </label>
            <textarea
              rows={3}
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
              placeholder="Enter diagnosis, findings, or clinical observations..."
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-600 transition-colors shadow-2xs"
            />
          </div>

          {/* STEP 2: Prescription Attachment (Two clean side-by-side buttons) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              Prescription Attachment
            </label>

            {/* Hidden inputs for file and camera selection */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={handleInputChange}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleInputChange}
              className="hidden"
            />

            {!attachedFile ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 min-h-[42px]"
                >
                  <Camera className="w-4 h-4" />
                  <span>Take Camera Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 px-3 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 min-h-[42px]"
                >
                  <Upload className="w-4 h-4 text-slate-500" />
                  <span>Upload File / PDF</span>
                </button>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50/70 border border-emerald-300 rounded-xl flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div
                    onClick={() =>
                      onZoomPrescription({
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
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {attachedFile.fileName}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200/60 px-1.5 py-0.2 rounded uppercase shrink-0">
                        Attached
                      </span>
                    </div>

                    <div className="text-[11px] font-bold text-emerald-900 font-tabular flex items-center gap-1 mt-0.5">
                      <CalendarCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">Uploaded: {attachedFile.uploadedAt}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      onZoomPrescription({
                        url: attachedFile.url,
                        title: attachedFile.fileName,
                        date: attachedFile.uploadedAt,
                      })
                    }
                    className="p-2 text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                    title="Zoom preview"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttachedFile(null)}
                    className="p-2 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Remove file"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* STEP 3: Follow-up Review Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              Follow-up Review
            </label>

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {[
                { id: 'none', label: 'None' },
                { id: '3', label: '3 days' },
                { id: '7', label: '7 days' },
                { id: 'custom', label: 'Custom Date' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFollowUpSelection(opt.id as any)}
                  className={`px-3.5 py-2 text-xs font-bold rounded-full border transition-colors cursor-pointer min-h-[36px] flex items-center justify-center ${
                    followUpSelection === opt.id
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300 ring-1 ring-emerald-500'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Custom Date Numeric Days Input */}
            {followUpSelection === 'custom' && (
              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 animate-in fade-in duration-150 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
                  <label className="text-xs font-semibold text-slate-600 shrink-0">
                    Review in:
                  </label>
                  <div className="flex items-center gap-1.5 flex-1">
                    <input
                      type="number"
                      min={1}
                      max={365}
                      value={customDays}
                      onChange={(e) => setCustomDays(e.target.value)}
                      placeholder="Enter number of days"
                      className="w-full sm:w-40 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-tabular font-bold focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
                    />
                    <span className="text-xs text-slate-500 font-medium shrink-0">days</span>
                  </div>
                </div>

                {targetDatePreview && (
                  <div className="text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-md border border-emerald-200 font-tabular flex items-center gap-1.5">
                    <CalendarCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>
                      Review Date: <strong>{targetDatePreview}</strong> (in {customDays} days)
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Relocated Session Info at the bottom of modal content */}
          <div className="pt-2.5 pb-1 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-medium font-tabular flex-wrap gap-1">
            <span>
              Session: <strong className="text-slate-800 capitalize">{entry.session} Slot</strong> · {entry.registeredTime}
            </span>
            <span>
              Staff: <strong className="text-slate-800">{entry.createdBy}</strong>
            </span>
          </div>

          {/* Primary Action Buttons */}
          <div className="pt-2 border-t border-slate-200 flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={isConsulted ? onCancelEditing : onClose}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer text-center min-h-[42px] flex items-center justify-center"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:shadow transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[42px]"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{isConsulted ? 'Save Changes' : 'Complete Consultation & Save'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
