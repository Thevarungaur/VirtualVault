import React from 'react';
import { Trash2, Lock, Unlock } from 'lucide-react';

interface VaultItemProps {
  id: string;
  type: 'text' | 'image';
  content: string;
  isDecrypted: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

export const VaultItem: React.FC<VaultItemProps> = ({
  type,
  content,
  isDecrypted,
  onToggle,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          {type === 'text' ? (
            <p className="text-gray-800 break-words">
              {isDecrypted ? content : '••••••••'}
            </p>
          ) : (
            <div className="relative aspect-video w-full max-w-md mx-auto">
              {isDecrypted ? (
                <img
                  src={content}
                  alt="Decrypted content"
                  className="rounded-md object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                  <Lock className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={onToggle}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          >
            {isDecrypted ? (
              <Lock className="w-5 h-5" />
            ) : (
              <Unlock className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};