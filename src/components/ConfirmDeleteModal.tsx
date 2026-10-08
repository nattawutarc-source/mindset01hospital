import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  itemName: string;
  itemDescription?: string;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'ยืนยันการลบข้อมูล',
  itemName,
  itemDescription,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
            <Trash2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">
              การจัดการข้อมูล (Admin Only)
            </span>
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
          </div>
        </div>

        <div className="bg-rose-50/70 border border-rose-100 rounded-2xl p-3.5 space-y-1.5 text-xs text-rose-900">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">
                คุณแน่ใจหรือไม่ว่าต้องการลบ <span className="underline font-bold text-rose-950">"{itemName}"</span>?
              </p>
              {itemDescription && (
                <p className="text-[11px] text-rose-700 mt-1">{itemDescription}</p>
              )}
              <p className="text-[11px] text-rose-700 mt-1 font-medium">
                * ข้อมูลที่ถูกลบจะไม่สามารถกู้คืนได้
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-colors cursor-pointer"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/25 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>ลบข้อมูลถาวร</span>
          </button>
        </div>
      </div>
    </div>
  );
};
