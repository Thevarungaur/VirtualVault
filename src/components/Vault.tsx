import React, { useState, useCallback, useEffect } from 'react';
import { Upload, Send } from 'lucide-react';
import { VaultItem } from './VaultItem';
import { encryptText, decryptText, encryptImage, decryptImage } from '../utils/cipher';
import { VaultEntry } from '../types';
import toast from 'react-hot-toast';

export const Vault: React.FC = () => {
  const [entries, setEntries] = useState<VaultEntry[]>([]);
  const [text, setText] = useState('');
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/entries', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setEntries(data);
      }
    } catch (error) {
      toast.error('Failed to fetch entries');
    } finally {
      setLoading(false);
    }
  };

  const handleAddText = async () => {
    if (!text || !key) return;
    
    try {
      const encrypted = encryptText(text, parseInt(key));
      const response = await fetch('/api/entries', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'text',
          content: encrypted
        })
      });

      if (response.ok) {
        const newEntry = await response.json();
        setEntries(prev => [...prev, newEntry]);
        setText('');
        toast.success('Text added successfully');
      }
    } catch (error) {
      toast.error('Failed to add text');
    }
  };

  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!key || !e.target.files?.length) return;
    
    try {
      const file = e.target.files[0];
      const encrypted = await encryptImage(file, parseInt(key));
      
      const response = await fetch('/api/entries', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'image',
          content: encrypted
        })
      });

      if (response.ok) {
        const newEntry = await response.json();
        setEntries(prev => [...prev, newEntry]);
        toast.success('Image added successfully');
      }
    } catch (error) {
      toast.error('Failed to add image');
    }
  };

  const toggleDecryption = useCallback((id: string) => {
    setEntries(prev => prev.map(entry => {
      if (entry.id !== id) return entry;
      
      const decryptedContent = entry.type === 'text'
        ? decryptText(entry.content, parseInt(key))
        : decryptImage(entry.content, parseInt(key));
      
      return {
        ...entry,
        content: entry.isDecrypted ? entry.content : decryptedContent,
        isDecrypted: !entry.isDecrypted
      };
    }));
  }, [key]);

  const deleteEntry = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/entries/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setEntries(prev => prev.filter(entry => entry.id !== id));
        toast.success('Entry deleted successfully');
      }
    } catch (error) {
      toast.error('Failed to delete entry');
    }
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Encryption Key (number)
          </label>
          <input
            type="number"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your secret key"
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Text
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter text to encrypt"
              />
              <button
                onClick={handleAddText}
                disabled={!text || !key}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Image
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-indigo-600 rounded-lg tracking-wide border border-indigo-600 border-dashed cursor-pointer hover:bg-indigo-50 transition-colors">
                <Upload className="w-8 h-8" />
                <span className="mt-2 text-base">Select an image</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAddImage}
                  disabled={!key}
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {entries.map((entry) => (
          <VaultItem
            key={entry.id}
            {...entry}
            onToggle={() => toggleDecryption(entry.id)}
            onDelete={() => deleteEntry(entry.id)}
          />
        ))}
      </div>
    </div>
  );
};