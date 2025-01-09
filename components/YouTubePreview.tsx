
// 
import Image from 'next/image';

interface YouTubePreviewProps {
  videoId: string;
  onClick: () => void;
}

const YouTubePreview: React.FC<YouTubePreviewProps> = ({ videoId, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="relative w-full aspect-video rounded-lg overflow-hidden cursor-pointer group"
    >
      <Image 
        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
        alt="Video thumbnail"
        width={1280}
        height={720}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
          <svg 
            className="w-8 h-8 text-white" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default YouTubePreview;
