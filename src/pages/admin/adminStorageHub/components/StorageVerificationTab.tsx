/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { FileText, X, Download } from "lucide-react";

export default function StorageVerificationTab({ hub }: { hub: any }) {
  console.log("Verification Documents Data:", hub);

  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [activePhotoModalIndex, setActivePhotoModalIndex] = useState(0);

  const rawDocs = hub?.verificationDocuments || [];

  // Helper to format file sizes from bytes to KB/MB
  const formatFileSize = (bytes: number) => {
    if (!bytes) return "1.0MB";
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Helper to format ISO date strings neatly
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Helper to map snake_case document types to clean user-friendly titles
  const formatDocType = (type: string) => {
    switch (type) {
      case "business_registration":
        return "Business Registration";
      case "proof_of_ownership":
        return "Proof of Ownership/Lease";
      case "inspection_report":
        return "Inspection Report";
      case "facility_photos":
        return "Facility Photos";
      default:
        return type
          ? type
              .replace(/_/g, " ")
              .replace(/\b\w/g, (l: string) => l.toUpperCase())
          : "Document";
    }
  };

  // Map real data from hub or fallback to placeholders if empty
  const documents =
    rawDocs.length > 0
      ? rawDocs.map((doc: any) => ({
          _dId: doc._id || doc.id,
          type: formatDocType(doc.type),
          rawType: doc.type,
          fileName: doc.fileName || "Document",
          fileSize: formatFileSize(doc.fileSize),
          verifiedBy: doc.verifiedBy?.fullName || "Super Admin",
          verificationDate: formatDate(doc.verifiedAt),
          uploadDate: formatDate(doc.uploadedAt),
          status: doc.status
            ? doc.status.charAt(0).toUpperCase() + doc.status.slice(1)
            : "Verified",
          isImages:
            doc.type === "facility_photos" ||
            (doc.fileUrls && doc.fileUrls.length > 1),
          fileUrls: doc.fileUrls || [],
        }))
      : [
          {
            _dId: "d1",
            type: "Business Registration",
            fileName: "CAC certificate.pdf",
            fileSize: "2.4MB",
            verifiedBy: "Super Admin",
            verificationDate: "23 Aug. 2026",
            uploadDate: "19 Aug. 2026",
            status: "Verified",
            isPdf: true,
            fileUrls: [],
          },
          {
            _dId: "d2",
            type: "Proof of Ownership/Lease",
            fileName: "Lease agreement.pdf",
            fileSize: "1.8MB",
            verifiedBy: "Super Admin",
            verificationDate: "23 Aug. 2026",
            uploadDate: "19 Aug. 2026",
            status: "Verified",
            isPdf: true,
            fileUrls: [],
          },
          {
            _dId: "d3",
            type: "Facility Photos",
            fileName: "5 images.jpg",
            fileSize: "4.2MB",
            verifiedBy: "Super Admin",
            verificationDate: "23 Aug. 2026",
            uploadDate: "19 Aug. 2026",
            status: "Verified",
            isImages: true,
            fileUrls: [],
          },
          {
            _dId: "d4",
            type: "Inspection Report",
            fileName: "Inspection report.pdf",
            fileSize: "1.6MB",
            verifiedBy: "Super Admin",
            verificationDate: "23 Aug. 2026",
            uploadDate: "19 Aug. 2026",
            status: "Verified",
            isPdf: true,
            fileUrls: [],
          },
        ];

  const primaryVerifier = documents[0]?.verifiedBy || "Super Admin";
  const primaryVerificationDate =
    documents[0]?.verificationDate || "23 Aug. 2026";
  const inspectionDoc =
    documents.find((d: any) => d.rawType === "inspection_report") ||
    documents[3];
  const lastInspectionDate = inspectionDoc?.uploadDate || "2 Sept. 2026";

  const handleDownload = (doc: any) => {
    if (doc?.fileUrls && doc.fileUrls.length > 0) {
      window.open(doc.fileUrls[0], "_blank");
    } else {
      alert("No download URL available for this document.");
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn">
      {/* Top Meta Bar */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="flex flex-col gap-0.5">
          <span className="text-stone-400 font-medium">Verified By</span>
          <span className="font-bold text-stone-900">{primaryVerifier}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-stone-400 font-medium">Verification Date</span>
          <span className="font-bold text-stone-900">
            {primaryVerificationDate}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-stone-400 font-medium">Last Inspection</span>
          <span className="font-bold text-stone-900">{lastInspectionDate}</span>
        </div>
      </div>

      {/* Documents List Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="divide-y divide-stone-100">
          {documents.map((doc: any, index: number) => (
            <div
              key={doc._dId || index}
              className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-stone-100 rounded-xl">
                  <FileText className="h-6 w-6 text-stone-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">
                    {doc.type}
                  </h4>
                  <span className="text-xs text-stone-500">
                    {doc.fileName} • {doc.fileSize}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-4 text-xs">
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full text-[11px]">
                    ✓ {doc.status}
                  </span>
                  <span className="text-stone-400 text-[11px]">
                    Uploaded: {doc.uploadDate} &nbsp;•&nbsp; Verified:{" "}
                    {doc.verificationDate}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedDoc(doc);
                      setActivePhotoModalIndex(0);
                    }}
                    className="px-4 py-1.5 border border-stone-200 hover:bg-stone-50 text-stone-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDownload(doc)}
                    className="px-4 py-1.5 border border-stone-200 hover:bg-stone-50 text-stone-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" /> Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View Document Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-stone-200 max-w-2xl w-full p-6 shadow-2xl flex flex-col gap-6 animate-scaleIn">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-stone-700" />
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    {selectedDoc.type}
                  </h3>
                  <span className="text-xs text-stone-500">
                    {selectedDoc.fileName} • {selectedDoc.fileSize}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-semibold rounded-full">
                  ✓ Verified
                </span>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Document Preview Box */}
            <div className="bg-stone-900 rounded-xl p-6 flex flex-col items-center justify-center min-h-[320px] relative">
              {selectedDoc.isImages && selectedDoc.fileUrls?.length > 0 ? (
                <div className="flex flex-col items-center gap-4 w-full">
                  <div className="relative w-full h-[240px] rounded-lg overflow-hidden bg-stone-800 flex items-center justify-center">
                    <img
                      src={
                        selectedDoc.fileUrls[activePhotoModalIndex] ||
                        selectedDoc.fileUrls[0]
                      }
                      alt="Facility view"
                      className="max-h-full object-contain"
                    />
                  </div>
                  {selectedDoc.fileUrls.length > 1 && (
                    <div className="flex items-center gap-2">
                      {selectedDoc.fileUrls.map((_: any, i: number) => (
                        <button
                          key={i}
                          onClick={() => setActivePhotoModalIndex(i)}
                          className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${activePhotoModalIndex === i ? "bg-emerald-500 scale-110" : "bg-stone-600"}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full flex flex-col items-center gap-4 text-center">
                  <div className="border-4 border-emerald-600 p-4 rounded-sm flex flex-col items-center gap-2">
                    <span className="text-[10px] font-bold tracking-widest text-stone-700 uppercase">
                      Document Preview
                    </span>
                    <span className="text-sm font-bold text-stone-900">
                      {selectedDoc.fileName}
                    </span>
                    <span className="text-[9px] text-stone-500">
                      {selectedDoc.type.toUpperCase()}
                    </span>
                  </div>
                  {selectedDoc.fileUrls?.[0] && (
                    <a
                      href={selectedDoc.fileUrls[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#1B4D3E] font-semibold hover:underline"
                    >
                      Open File in New Tab
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-5 py-2 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => handleDownload(selectedDoc)}
                className="px-5 py-2 bg-[#1B4D3E] text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer"
              >
                <Download className="h-4 w-4" /> Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
