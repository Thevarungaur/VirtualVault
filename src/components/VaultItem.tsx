import React, { useState } from 'react';
import { Trash2, Lock, Unlock, Key } from 'lucide-react';
import toast from 'react-hot-toast';

interface VaultItemProps {
  _id: string;
  title: string;
  type: 'text' | 'image';
  content: string;
  isDecrypted: boolean;
  onToggle: (decryptKey?: number) => void;
  onDelete: () => void;
}

export const VaultItem: React.FC<VaultItemProps> = ({
  title,
  type,
  content,
  isDecrypted,
  onToggle,
  onDelete,
}) => {
  const [decryptKey, setDecryptKey] = useState('');
  const [showDecryptInput, setShowDecryptInput] = useState(false);

  const handleDecrypt = () => {
    if (!decryptKey) {
      toast.error('Please enter a decryption key');
      return;
    }
    onToggle(parseInt(decryptKey));
    setShowDecryptInput(false);
    setDecryptKey('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowDecryptInput(!showDecryptInput)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          >
            {isDecrypted ? (
              <Lock className="w-5 h-5" />
            ) : (
              <Key className="w-5 h-5" />
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

      {showDecryptInput && !isDecrypted && (
        <div className="flex gap-2 mb-3">
          <input
            type="number"
            value={decryptKey}
            onChange={(e) => setDecryptKey(e.target.value)}
            className="flex-1 px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter decryption key"
          />
          <button
            onClick={handleDecrypt}
            className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Decrypt
          </button>
        </div>
      )}

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
                alt={title}
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
    </div>
  );
};