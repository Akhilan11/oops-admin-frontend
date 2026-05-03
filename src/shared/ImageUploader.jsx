import { useRef, useState } from 'react';
import { resizeImage } from '../utils/resizeImage';

export default function ImageUploader({ images = [], onChange, max = 5 }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = async (files) => {
    const remaining = max - images.length;
    const toProcess = Array.from(files).slice(0, remaining);
    const results = await Promise.all(toProcess.map((f) => resizeImage(f)));
    onChange([...images, ...results]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  const remove = (idx) => {
    onChange(images.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <div className="grid grid-cols-5 gap-2.5 mb-3">
        {images.map((src, i) => (
          <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-warmblack/10 group">
            <img src={src} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-warmblack/70 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              x
            </button>
            {i === 0 && (
              <span className="absolute bottom-1.5 left-1.5 text-[8px] font-bold uppercase tracking-wider bg-warmblack text-white px-1.5 py-0.5 rounded">
                Main
              </span>
            )}
          </div>
        ))}
        {images.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-warmblack/20 hover:text-warmblack/40 hover:border-warmblack/20 transition-colors duration-200 ${
              dragOver ? 'border-warmblack/30 bg-warmblack/[0.02]' : 'border-warmblack/10'
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span className="text-[9px] font-semibold mt-1">Add</span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files.length) handleFiles(e.target.files);
          e.target.value = '';
        }}
      />
      <p className="text-[10px] text-warmblack/30">{images.length}/{max} images. Click or drag to add.</p>
    </div>
  );
}
