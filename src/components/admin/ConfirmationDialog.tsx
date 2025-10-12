import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
          confirmButton: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
        };
      case "warning":
        return {
          icon: <AlertTriangle className="h-6 w-6 text-yellow-600" />,
          confirmButton:
            "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
        };
      case "info":
        return {
          icon: <AlertTriangle className="h-6 w-6 text-blue-600" />,
          confirmButton: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
        };
      default:
        return {
          icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
          confirmButton: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            {variantStyles.icon}
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 ${variantStyles.confirmButton}`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
