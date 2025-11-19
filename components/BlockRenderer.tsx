import React, { useState } from 'react';
import { BlockData, BlockStyle } from '../types';
import { Calendar, MapPin, ExternalLink, Instagram, Facebook, Youtube, Globe, ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface BlockRendererProps {
  block: BlockData;
  isPreview?: boolean;
}

const applyStyle = (style: BlockStyle) => {
  const s: React.CSSProperties = {};
  if (style.backgroundColor) s.backgroundColor = style.backgroundColor;
  if (style.color) s.color = style.color;
  if (style.padding) s.padding = style.padding;
  return s;
};

const getTextClasses = (style: BlockStyle) => {
  const classes = [];
  if (style.fontSize === 'sm') classes.push('text-sm');
  if (style.fontSize === 'base') classes.push('text-base');
  if (style.fontSize === 'lg') classes.push('text-lg');
  if (style.fontSize === 'xl') classes.push('text-xl');
  if (style.fontSize === '2xl') classes.push('text-2xl');
  
  if (style.fontWeight === 'bold') classes.push('font-bold');
  
  if (style.textAlign === 'center') classes.push('text-center');
  else if (style.textAlign === 'right') classes.push('text-right');
  else classes.push('text-left');

  return classes.join(' ');
};

// Helper to extract YouTube ID
const getYoutubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const GalleryBlock = ({ images, containerStyle }: { images: {url: string}[], containerStyle: any }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) return <div style={containerStyle} className="text-gray-400 text-center bg-gray-50 p-10">이미지가 없습니다.</div>;

    const next = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }
    
    const prev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }

    return (
        <div className="w-full relative group" style={containerStyle}>
            <div className="aspect-video bg-gray-200 relative overflow-hidden rounded-lg">
                <img 
                    src={images[currentIndex].url} 
                    alt={`Slide ${currentIndex}`} 
                    className="w-full h-full object-cover transition-opacity duration-300"
                />
                {images.length > 1 && (
                    <>
                        <button 
                            onClick={prev}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full hover:bg-black/50 transition"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button 
                            onClick={next}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full hover:bg-black/50 transition"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                            {images.map((_, idx) => (
                                <div key={idx} className={`w-2 h-2 rounded-full ${idx === currentIndex ? 'bg-white' : 'bg-white/50'}`} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export const BlockRenderer: React.FC<BlockRendererProps> = ({ block, isPreview = false }) => {
  const containerStyle = applyStyle(block.style);
  const textClasses = getTextClasses(block.style);

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <div className={`w-full ${!block.style.padding ? 'p-4' : ''}`} style={containerStyle}>
      {children}
    </div>
  );

  switch (block.type) {
    case 'text':
      return (
        <Wrapper>
          <div className={`whitespace-pre-wrap ${textClasses}`}>{block.content.text}</div>
        </Wrapper>
      );

    case 'image':
      return (
        <div className="w-full" style={containerStyle}>
           <img 
             src={block.content.url} 
             alt={block.content.alt} 
             className="w-full h-auto object-cover block"
           />
        </div>
      );

    case 'video':
       const videoId = getYoutubeId(block.content.url);
       return (
         <div className="w-full" style={containerStyle}>
             <div className="aspect-video w-full bg-black rounded-lg overflow-hidden relative">
                 {videoId ? (
                     <iframe 
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${videoId}`} 
                        title="Video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                     ></iframe>
                 ) : (
                     <div className="w-full h-full flex items-center justify-center flex-col text-gray-500">
                         <Play className="w-12 h-12 mb-2 text-gray-600" />
                         <span className="text-sm text-gray-400 px-4 text-center break-all">{block.content.url || 'URL을 입력하세요'}</span>
                     </div>
                 )}
             </div>
         </div>
       );

    case 'gallery':
       return <GalleryBlock images={block.content.images} containerStyle={containerStyle} />;

    case 'schedule':
      return (
        <Wrapper>
          <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-4 rounded-r-lg">
            <h3 className={`font-bold text-lg mb-2 ${textClasses}`}>{block.content.eventName}</h3>
            <div className="flex items-center text-gray-600 mb-1">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="text-sm">
                {new Date(block.content.startDate).toLocaleDateString()} ~ {new Date(block.content.endDate).toLocaleDateString()}
              </span>
            </div>
            {block.content.location && (
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm">{block.content.location}</span>
              </div>
            )}
          </div>
        </Wrapper>
      );

    case 'business':
      return (
        <Wrapper>
          <div className="overflow-hidden border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="bg-white divide-y divide-gray-200">
                {block.content.items.map((item: any, idx: number) => (
                  <tr key={idx}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 w-1/3">{item.label}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Wrapper>
      );

    case 'link':
      return (
        <Wrapper>
          <div className={textClasses}>
            {block.content.style === 'button' ? (
              <a 
                href={block.content.url} 
                target="_blank" 
                rel="noreferrer"
                className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700 transition-colors w-full text-center"
              >
                {block.content.label}
              </a>
            ) : (
              <a 
                href={block.content.url} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center text-indigo-600 hover:underline"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                {block.content.label}
              </a>
            )}
          </div>
        </Wrapper>
      );

    case 'map':
       // Simulation of a map
      return (
        <Wrapper>
          <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center flex-col text-gray-500 border border-gray-300">
             <MapPin className="w-8 h-8 mb-2 text-gray-400" />
             <p className="font-semibold">{block.content.placeName}</p>
             <p className="text-sm">{block.content.address}</p>
             <p className="text-xs mt-2 text-gray-400">(지도 API 연동 시 실제 지도 표시)</p>
          </div>
        </Wrapper>
      );

    case 'form':
      return (
        <Wrapper>
          <form className="bg-white p-4 border rounded-lg shadow-sm" onSubmit={(e) => e.preventDefault()}>
            {block.content.fields.map((field: any) => (
              <div key={field.id} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === 'checkbox' ? (
                  <input type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                ) : (
                  <input 
                    type={field.type} 
                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder={field.label}
                    disabled={!isPreview} 
                  />
                )}
              </div>
            ))}
            <button 
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
              disabled={!isPreview}
            >
              {block.content.submitButtonText}
            </button>
          </form>
        </Wrapper>
      );
    
    case 'social':
        return (
            <Wrapper>
                <div className={`flex gap-4 justify-center ${textClasses}`}>
                    {block.content.links.map((link: any, idx: number) => {
                        let Icon = Globe;
                        if(link.platform === 'instagram') Icon = Instagram;
                        if(link.platform === 'facebook') Icon = Facebook;
                        if(link.platform === 'youtube') Icon = Youtube;

                        return (
                            <a key={idx} href={link.url} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-indigo-600 transition-colors">
                                <Icon className="w-6 h-6" />
                            </a>
                        )
                    })}
                </div>
            </Wrapper>
        );

    default:
      return <div className="p-4 text-red-500">Unknown Block Type</div>;
  }
};