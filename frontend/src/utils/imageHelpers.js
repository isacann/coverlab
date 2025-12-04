/**
 * Compress and convert image file to Base64 Data URI
 * 
 * Features:
 * - Resizes to max 1280px (maintains aspect ratio)
 * - Converts to JPEG format
 * - Compresses to 80% quality
 * - Returns Base64 Data URI string
 * 
 * @param {File} file - Image file from input
 * @returns {Promise<string>} - Base64 Data URI string
 */
export const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      reject(new Error('File must be an image'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Configuration
        const MAX_DIMENSION = 1280;
        const JPEG_QUALITY = 0.8;
        
        // Calculate new dimensions (maintain aspect ratio)
        let width = img.width;
        let height = img.height;
        
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }
        
        console.log(`📐 Image resize: ${img.width}x${img.height} → ${width}x${height}`);
        
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to JPEG Base64
        const compressedBase64 = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
        
        // Calculate size reduction
        const originalSize = (e.target.result.length * 0.75) / 1024; // KB
        const compressedSize = (compressedBase64.length * 0.75) / 1024; // KB
        const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(1);
        
        console.log(`🗜️ Compression: ${originalSize.toFixed(0)}KB → ${compressedSize.toFixed(0)}KB (${reduction}% reduction)`);
        
        resolve(compressedBase64);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = e.target.result;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Compress image and return as Blob (Binary file)
 * 
 * USE THIS for API calls that require binary file upload (multipart/form-data)
 * 
 * Features:
 * - Resizes to max 1280px width (maintains aspect ratio)
 * - Converts to JPEG format
 * - Compresses to 80% quality
 * - Returns Blob object (binary file)
 * 
 * @param {File} file - Image file from input
 * @returns {Promise<Blob>} - Compressed image as Blob
 */
export const compressImageToBlob = (file) => {
  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      reject(new Error('File must be an image'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Configuration
        const MAX_DIMENSION = 1280;
        const JPEG_QUALITY = 0.8;
        
        // Calculate new dimensions (maintain aspect ratio)
        let width = img.width;
        let height = img.height;
        
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }
        
        console.log(`📐 Image resize: ${img.width}x${img.height} → ${width}x${height}`);
        
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to Blob (Binary)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Calculate size reduction
              const originalSize = file.size / 1024; // KB
              const compressedSize = blob.size / 1024; // KB
              const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(1);
              
              console.log(`🗜️ Compression: ${originalSize.toFixed(0)}KB → ${compressedSize.toFixed(0)}KB (${reduction}% reduction)`);
              
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          'image/jpeg',
          JPEG_QUALITY
        );
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = e.target.result;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Get file size in human-readable format
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};
