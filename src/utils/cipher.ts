// Simple Caesar cipher implementation for demonstration
export const encryptText = (text: string, key: number): string => {
  return text
    .split('')
    .map(char => {
      if (char.match(/[a-zA-Z]/)) {
        const code = char.charCodeAt(0);
        const isUpperCase = code >= 65 && code <= 90;
        const offset = isUpperCase ? 65 : 97;
        return String.fromCharCode(((code - offset + key) % 26) + offset);
      }
      return char;
    })
    .join('');
};

export const decryptText = (text: string, key: number): string => {
  return encryptText(text, 26 - (key % 26));
};

export const encryptImage = async (file: File, key: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const base64 = e.target?.result as string;
        const encrypted = encryptText(base64, key);
        resolve(encrypted);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

export const decryptImage = (encrypted: string, key: number): string => {
  return decryptText(encrypted, key);
};