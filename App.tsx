import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, GripVertical, Trash2, Edit2, Save, Share2, Settings, MoveUp, MoveDown, X, Image as ImageIcon, Video as VideoIcon, Layers, Calendar as CalIcon, MapPin as MapIcon, Link as LinkIcon, Briefcase as BizIcon, FormInput as FormIcon, Globe as SocialIcon } from 'lucide-react';
import { BlockData, PageData, BlockType, PageType } from './types';
import { BlockRenderer } from './components/BlockRenderer';
import { createInitialPage, savePage, getPages, getPage, deletePage } from './services/storage';

// --- Dashboard Component ---
const Dashboard = () => {
  const [pages, setPages] = useState<PageData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setPages(getPages());
  }, []);

  const handleDelete = (e: React.MouseEvent, id: string, hasPassword?: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (hasPassword) {
      const input = prompt("삭제하려면 비밀번호(4자리)를 입력하세요:");
      if (input !== hasPassword) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }
    } else {
      if(!confirm("정말 삭제하시겠습니까?")) return;
    }
    
    deletePage(id);
    setPages(getPages());
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="max-w-4xl mx-auto mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">내 콘텐츠 보관함</h1>
          <p className="text-gray-500 mt-2">뉴스레터, 홍보물, 초대장을 관리하세요.</p>
        </div>
        <Link to="/create" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition shadow-md flex items-center">
          <Plus className="w-5 h-5 mr-2" /> 새 만들기
        </Link>
      </header>

      <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pages.length === 0 && (
            <div className="col-span-full text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-400 text-lg">생성된 콘텐츠가 없습니다.</p>
                <Link to="/create" className="text-indigo-600 font-medium mt-2 inline-block hover:underline">첫 콘텐츠 만들기</Link>
            </div>
        )}
        {pages.map((page) => (
          <div 
            key={page.id} 
            onClick={() => navigate(`/edit/${page.id}`)}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition cursor-pointer group"
          >
            <div className={`h-3 bg-indigo-500 w-full`}></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-semibold tracking-wider text-indigo-600 uppercase bg-indigo-50 px-2 py-1 rounded">
                  {page.type === 'invitation' ? '초대장' : page.type === 'newsletter' ? '뉴스레터' : '홍보'}
                </span>
                <button 
                    onClick={(e) => handleDelete(e, page.id, page.password)}
                    className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{page.title}</h3>
              <p className="text-sm text-gray-500">{new Date(page.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <span className="text-sm text-gray-500 group-hover:text-indigo-600 transition">편집하기</span>
                <ArrowLeft className="w-4 h-4 rotate-180 text-gray-400 group-hover:text-indigo-600" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Create Selection Component ---
const CreateSelection = () => {
  const navigate = useNavigate();

  const handleSelect = (type: PageType) => {
    const newPage = createInitialPage(type);
    savePage(newPage);
    navigate(`/edit/${newPage.id}`);
  };

  const items = [
    { type: 'newsletter', title: '모바일 뉴스레터', desc: '복지관 소식과 행사 후기를 공유하세요.' },
    { type: 'promotion', title: '사업 홍보', desc: '새로운 프로그램과 사업을 안내하세요.' },
    { type: 'invitation', title: '초대장', desc: '행사 개관 기념 및 프로그램 초대를 만드세요.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-8 font-medium">
          <ArrowLeft className="w-5 h-5 mr-2" /> 돌아가기
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">어떤 콘텐츠를 만드시겠습니까?</h1>
        <p className="text-gray-500 text-center mb-12">목적에 맞는 템플릿을 선택하면 기본 블록이 세팅됩니다.</p>
        
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <button
              key={item.type}
              onClick={() => handleSelect(item.type as PageType)}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:border-indigo-500 hover:shadow-xl transition-all text-left group h-full flex flex-col"
            >
              <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-6 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed flex-grow">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Editor Component ---
const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState<PageData | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  useEffect(() => {
    if (id) {
      const loaded = getPage(id);
      if (loaded) {
        if (loaded.password) {
             const input = prompt("편집하려면 비밀번호(4자리)를 입력하세요:");
             if (input === loaded.password) {
                 setPage(loaded);
                 setIsAuthorized(true);
             } else {
                 alert("비밀번호가 틀렸습니다.");
                 navigate('/');
             }
        } else {
            setPage(loaded);
            setIsAuthorized(true);
        }
      } else {
          navigate('/');
      }
    }
  }, [id, navigate]);

  const handleSave = useCallback(() => {
    if (page) {
      savePage(page);
      // Show toast or simple alert
      const saveBtn = document.getElementById('save-btn');
      if(saveBtn) {
          const originalText = saveBtn.innerText;
          saveBtn.innerText = '저장됨!';
          setTimeout(() => saveBtn.innerText = originalText, 2000);
      }
    }
  }, [page]);

  const addBlock = (type: BlockType) => {
    if (!page) return;
    const newBlock: BlockData = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: getDefaultContent(type),
      style: { padding: '16px', textAlign: 'left' },
    };
    setPage({ ...page, blocks: [...page.blocks, newBlock] });
    setSelectedBlockId(newBlock.id);
    setIsAddMenuOpen(false);
  };

  const updateBlock = (blockId: string, newData: Partial<BlockData>) => {
    if (!page) return;
    const newBlocks = page.blocks.map(b => b.id === blockId ? { ...b, ...newData } : b);
    setPage({ ...page, blocks: newBlocks });
  };

  const deleteBlock = (blockId: string) => {
    if (!page) return;
    if (!confirm("블록을 삭제하시겠습니까?")) return;
    const newBlocks = page.blocks.filter(b => b.id !== blockId);
    setPage({ ...page, blocks: newBlocks });
    setSelectedBlockId(null);
  };

  const moveBlock = (index: number, direction: -1 | 1) => {
    if (!page) return;
    const newBlocks = [...page.blocks];
    if (index + direction < 0 || index + direction >= newBlocks.length) return;
    
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[index + direction];
    newBlocks[index + direction] = temp;
    
    setPage({ ...page, blocks: newBlocks });
  };

  const getDefaultContent = (type: BlockType) => {
    switch (type) {
        case 'text': return { text: '새로운 텍스트입니다. 내용을 입력하세요.' };
        case 'image': return { url: 'https://picsum.photos/600/400', alt: '이미지' };
        case 'video': return { url: '' };
        case 'gallery': return { images: [{url: 'https://picsum.photos/600/400'}, {url: 'https://picsum.photos/600/401'}] };
        case 'schedule': return { eventName: '새 일정', startDate: new Date().toISOString(), endDate: new Date().toISOString(), location: '' };
        case 'link': return { url: 'https://', label: '링크 버튼', style: 'button' };
        case 'business': return { items: [{ label: '항목', value: '내용' }] };
        case 'form': return { fields: [{ id: '1', label: '이름', type: 'text', required: true }], submitButtonText: '제출' };
        case 'map': return { address: '서울시 중구', placeName: '장소명' };
        case 'social': return { links: [{ platform: 'instagram', url: '#' }] };
        default: return {};
    }
  };

  if (!isAuthorized || !page) return null;

  const selectedBlock = page.blocks.find(b => b.id === selectedBlockId);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Left Sidebar - Controls */}
      <div className="w-80 bg-white border-r flex flex-col overflow-y-auto shadow-xl z-20 hidden md:flex">
        <div className="p-4 border-b flex items-center justify-between">
          <Link to="/" className="flex items-center text-gray-500 hover:text-gray-900 font-medium">
            <ArrowLeft className="w-4 h-4 mr-1" /> 나가기
          </Link>
          <div className="flex gap-2">
            <button onClick={() => setIsSettingsOpen(true)} className="p-2 hover:bg-gray-100 rounded text-gray-600" title="페이지 설정"><Settings className="w-5 h-5" /></button>
            <button id="save-btn" onClick={handleSave} className="flex items-center bg-indigo-600 text-white px-3 py-1.5 rounded text-sm font-bold hover:bg-indigo-700 transition">
               <Save className="w-4 h-4 mr-1" /> 저장
            </button>
          </div>
        </div>
        
        <div className="p-4 border-b bg-gray-50">
            <h2 className="font-bold text-gray-700 mb-2">페이지 정보</h2>
            <input 
                value={page.title}
                onChange={(e) => setPage({...page, title: e.target.value})}
                className="w-full border rounded px-2 py-1 mb-2 text-sm"
                placeholder="페이지 제목"
            />
            <div className="flex items-center gap-2">
                 <a href={`/#/view/${page.id}`} target="_blank" className="text-xs text-indigo-600 flex items-center hover:underline">
                    <Share2 className="w-3 h-3 mr-1" /> 발행 링크 열기
                 </a>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {selectedBlock ? (
            <BlockEditor 
                block={selectedBlock} 
                onUpdate={(data) => updateBlock(selectedBlock.id, data)} 
                onClose={() => setSelectedBlockId(null)}
            />
          ) : (
             <div className="text-center text-gray-400 mt-10">
                <p>오른쪽 화면에서 블록을 선택하거나</p>
                <p>새 블록을 추가하세요.</p>
             </div>
          )}
        </div>
      </div>

      {/* Main Editor Area (Mobile Preview) */}
      <div className="flex-1 flex justify-center items-center bg-gray-100 relative p-4">
         {/* Mobile Frame */}
         <div className="relative w-full max-w-[400px] h-[90vh] bg-white shadow-2xl rounded-[3rem] border-8 border-gray-800 overflow-hidden flex flex-col">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl z-30"></div>
            
            {/* Screen Content */}
            <div 
                className="flex-1 overflow-y-auto scrollbar-hide bg-white" 
                style={{backgroundColor: page.theme.backgroundColor}}
            >
                <div className="pt-10 pb-20 min-h-full">
                    {page.blocks.map((block, idx) => (
                        <div 
                            key={block.id} 
                            className={`relative group cursor-pointer hover:ring-2 ring-indigo-400 transition-all ${selectedBlockId === block.id ? 'ring-2 ring-indigo-600 z-10' : ''}`}
                            onClick={() => setSelectedBlockId(block.id)}
                        >
                            {/* Block Actions (Hover) */}
                            <div className={`absolute right-2 top-2 flex gap-1 bg-white shadow rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity z-20 ${selectedBlockId === block.id ? 'opacity-100' : ''}`}>
                                <button onClick={(e) => { e.stopPropagation(); moveBlock(idx, -1); }} className="p-1 hover:bg-gray-100 rounded"><MoveUp className="w-3 h-3" /></button>
                                <button onClick={(e) => { e.stopPropagation(); moveBlock(idx, 1); }} className="p-1 hover:bg-gray-100 rounded"><MoveDown className="w-3 h-3" /></button>
                                <button onClick={(e) => { e.stopPropagation(); deleteBlock(block.id); }} className="p-1 hover:bg-red-50 text-red-500 rounded"><Trash2 className="w-3 h-3" /></button>
                            </div>
                            
                            <BlockRenderer block={block} />
                        </div>
                    ))}
                    
                    {/* Add Block Button (In-flow) */}
                    <div className="p-4 flex justify-center">
                        <button 
                            onClick={() => setIsAddMenuOpen(true)}
                            className="w-10 h-10 bg-indigo-600 rounded-full text-white flex items-center justify-center shadow-lg hover:bg-indigo-700 transition transform hover:scale-110"
                        >
                            <Plus className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
         </div>
      </div>

      {/* Add Block Modal/Drawer */}
      {isAddMenuOpen && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={() => setIsAddMenuOpen(false)}>
            <div className="bg-white rounded-xl p-6 w-full max-w-md m-4 shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">블록 추가</h3>
                    <button onClick={() => setIsAddMenuOpen(false)}><X className="w-5 h-5" /></button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { id: 'text', label: '텍스트', icon: Edit2 },
                        { id: 'image', label: '이미지', icon: ImageIcon },
                        { id: 'video', label: '동영상', icon: VideoIcon },
                        { id: 'gallery', label: '슬라이드', icon: Layers },
                        { id: 'schedule', label: '일정/날짜', icon: CalIcon },
                        { id: 'map', label: '지도', icon: MapIcon },
                        { id: 'link', label: '버튼/링크', icon: LinkIcon },
                        { id: 'business', label: '사업안내', icon: BizIcon },
                        { id: 'form', label: '신청폼', icon: FormIcon },
                        { id: 'social', label: '소셜미디어', icon: SocialIcon },
                    ].map((item) => (
                        <button 
                            key={item.id}
                            onClick={() => addBlock(item.id as BlockType)}
                            className="flex flex-col items-center justify-center p-4 border rounded hover:bg-indigo-50 hover:border-indigo-300 transition"
                        >
                             <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mb-2 text-gray-600">
                                 <item.icon className="w-4 h-4" />
                             </div>
                             <span className="text-sm font-medium">{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
      )}

      {/* Page Settings Modal */}
      {isSettingsOpen && (
          <div className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={() => setIsSettingsOpen(false)}>
              <div className="bg-white rounded-xl p-6 w-full max-w-sm m-4" onClick={e => e.stopPropagation()}>
                  <h3 className="text-lg font-bold mb-4">페이지 설정</h3>
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium mb-1">비밀번호 설정 (삭제/편집 보호)</label>
                          <input 
                            type="text" 
                            maxLength={4}
                            placeholder="4자리 숫자"
                            value={page.password || ''}
                            onChange={(e) => setPage({...page, password: e.target.value})}
                            className="w-full border p-2 rounded"
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium mb-1">배경 색상</label>
                          <div className="flex gap-2">
                              {['#ffffff', '#f8fafc', '#f0f9ff', '#fff7ed', '#fdf2f8'].map(color => (
                                  <button 
                                    key={color}
                                    onClick={() => setPage({...page, theme: {...page.theme, backgroundColor: color}})}
                                    className={`w-8 h-8 rounded-full border ${page.theme.backgroundColor === color ? 'ring-2 ring-offset-2 ring-indigo-500' : ''}`}
                                    style={{backgroundColor: color}}
                                  />
                              ))}
                          </div>
                      </div>
                      <button 
                        onClick={() => setIsSettingsOpen(false)}
                        className="w-full bg-indigo-600 text-white py-2 rounded font-medium mt-2"
                      >
                          닫기
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

// --- Sub-component for Block Editing ---
const BlockEditor = ({ block, onUpdate, onClose }: { block: BlockData, onUpdate: (d: Partial<BlockData>) => void, onClose: () => void }) => {
    const updateContent = (key: string, value: any) => {
        onUpdate({ content: { ...block.content, [key]: value } });
    };

    const updateStyle = (key: string, value: any) => {
        onUpdate({ style: { ...block.style, [key]: value } });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h4 className="font-bold text-gray-800 capitalize">{block.type} 편집</h4>
                <button onClick={onClose} className="text-xs text-gray-500 underline">닫기</button>
            </div>

            {/* Common Style Controls */}
            <div className="space-y-3 border-b pb-4">
                <p className="text-xs font-bold text-gray-400 uppercase">스타일</p>
                <div className="flex gap-2">
                    {['left', 'center', 'right'].map((align) => (
                        <button 
                            key={align}
                            onClick={() => updateStyle('textAlign', align)}
                            className={`flex-1 py-1 text-xs border rounded ${block.style.textAlign === align ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'text-gray-600'}`}
                        >
                            {align === 'left' ? '좌측' : align === 'center' ? '중앙' : '우측'}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2 items-center">
                     <span className="text-xs text-gray-500">크기</span>
                     <select 
                        value={block.style.fontSize || 'base'} 
                        onChange={(e) => updateStyle('fontSize', e.target.value)}
                        className="border rounded px-2 py-1 text-xs flex-1"
                     >
                         <option value="sm">작게</option>
                         <option value="base">보통</option>
                         <option value="lg">크게</option>
                         <option value="xl">더 크게</option>
                         <option value="2xl">제목용</option>
                     </select>
                </div>
                <div className="flex gap-2 items-center">
                     <span className="text-xs text-gray-500">배경</span>
                     <input type="color" value={block.style.backgroundColor || '#ffffff'} onChange={(e) => updateStyle('backgroundColor', e.target.value)} className="h-6 w-6 border rounded cursor-pointer" />
                     <span className="text-xs text-gray-500 ml-2">글자</span>
                     <input type="color" value={block.style.color || '#000000'} onChange={(e) => updateStyle('color', e.target.value)} className="h-6 w-6 border rounded cursor-pointer" />
                </div>
                <label className="flex items-center gap-2 text-xs">
                    <input type="checkbox" checked={block.style.fontWeight === 'bold'} onChange={(e) => updateStyle('fontWeight', e.target.checked ? 'bold' : 'normal')} />
                    굵게
                </label>
            </div>

            {/* Specific Content Controls */}
            <div className="space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase">내용</p>
                
                {block.type === 'text' && (
                    <textarea 
                        className="w-full border rounded p-2 text-sm h-32" 
                        value={block.content.text} 
                        onChange={(e) => updateContent('text', e.target.value)} 
                    />
                )}

                {block.type === 'image' && (
                    <>
                        <input 
                            type="text" 
                            className="w-full border rounded p-2 text-sm" 
                            placeholder="이미지 URL (https://...)"
                            value={block.content.url} 
                            onChange={(e) => updateContent('url', e.target.value)} 
                        />
                        <p className="text-xs text-gray-400">참고: 실제 배포 시에는 이미지 호스팅이 필요합니다.</p>
                    </>
                )}

                {block.type === 'video' && (
                    <>
                        <input 
                            type="text" 
                            className="w-full border rounded p-2 text-sm" 
                            placeholder="YouTube 동영상 URL 입력"
                            value={block.content.url} 
                            onChange={(e) => updateContent('url', e.target.value)} 
                        />
                        <p className="text-xs text-gray-400">YouTube URL을 입력하면 자동으로 플레이어가 삽입됩니다.</p>
                    </>
                )}

                {block.type === 'gallery' && (
                    <>
                        {block.content.images.map((img: any, idx: number) => (
                            <div key={idx} className="flex gap-2 mb-2 items-center">
                                <input 
                                    className="w-full border rounded p-1 text-xs"
                                    value={img.url}
                                    onChange={(e) => {
                                        const newImages = [...block.content.images];
                                        newImages[idx].url = e.target.value;
                                        updateContent('images', newImages);
                                    }}
                                    placeholder="이미지 URL"
                                />
                                <button onClick={() => {
                                    const newImages = block.content.images.filter((_: any, i: number) => i !== idx);
                                    updateContent('images', newImages);
                                }} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        ))}
                        <button 
                            onClick={() => updateContent('images', [...block.content.images, {url: 'https://picsum.photos/600/400'}])}
                            className="text-xs text-indigo-600 font-medium"
                        >
                            + 이미지 추가
                        </button>
                    </>
                )}

                {block.type === 'schedule' && (
                    <>
                         <input type="text" className="w-full border rounded p-2 text-sm mb-2" placeholder="행사명" value={block.content.eventName} onChange={(e) => updateContent('eventName', e.target.value)} />
                         <input type="datetime-local" className="w-full border rounded p-2 text-sm mb-2" value={block.content.startDate.substring(0, 16)} onChange={(e) => updateContent('startDate', e.target.value)} />
                         <input type="datetime-local" className="w-full border rounded p-2 text-sm mb-2" value={block.content.endDate.substring(0, 16)} onChange={(e) => updateContent('endDate', e.target.value)} />
                         <input type="text" className="w-full border rounded p-2 text-sm" placeholder="장소" value={block.content.location} onChange={(e) => updateContent('location', e.target.value)} />
                    </>
                )}

                {block.type === 'link' && (
                    <>
                         <input type="text" className="w-full border rounded p-2 text-sm mb-2" placeholder="버튼/링크 이름" value={block.content.label} onChange={(e) => updateContent('label', e.target.value)} />
                         <input type="text" className="w-full border rounded p-2 text-sm mb-2" placeholder="URL" value={block.content.url} onChange={(e) => updateContent('url', e.target.value)} />
                         <select className="w-full border rounded p-2 text-sm" value={block.content.style} onChange={(e) => updateContent('style', e.target.value)}>
                             <option value="button">버튼 모양</option>
                             <option value="link">텍스트 링크</option>
                         </select>
                    </>
                )}

                {block.type === 'business' && (
                    <div>
                         {block.content.items.map((item: any, idx: number) => (
                             <div key={idx} className="flex gap-1 mb-1">
                                 <input className="border rounded p-1 text-sm w-1/3" value={item.label} onChange={(e) => {
                                     const newItems = [...block.content.items];
                                     newItems[idx].label = e.target.value;
                                     updateContent('items', newItems);
                                 }} />
                                 <input className="border rounded p-1 text-sm w-2/3" value={item.value} onChange={(e) => {
                                     const newItems = [...block.content.items];
                                     newItems[idx].value = e.target.value;
                                     updateContent('items', newItems);
                                 }} />
                                 <button onClick={() => {
                                     const newItems = block.content.items.filter((_: any, i: number) => i !== idx);
                                     updateContent('items', newItems);
                                 }} className="text-red-500"><X className="w-4 h-4" /></button>
                             </div>
                         ))}
                         <button onClick={() => updateContent('items', [...block.content.items, {label: '새 항목', value: ''}])} className="text-xs text-indigo-600 font-medium mt-1">+ 항목 추가</button>
                    </div>
                )}
                
                {block.type === 'form' && (
                    <div>
                        <p className="text-xs mb-2">입력 필드</p>
                        {block.content.fields.map((field: any, idx: number) => (
                            <div key={field.id} className="border p-2 rounded mb-2 bg-gray-50">
                                <div className="flex justify-between mb-1">
                                    <span className="text-xs font-bold">필드 {idx + 1}</span>
                                    <button onClick={() => {
                                         const newFields = block.content.fields.filter((_: any, i: number) => i !== idx);
                                         updateContent('fields', newFields);
                                    }}><X className="w-3 h-3 text-gray-400" /></button>
                                </div>
                                <input className="w-full border rounded p-1 text-xs mb-1" value={field.label} onChange={(e) => {
                                     const newFields = [...block.content.fields];
                                     newFields[idx].label = e.target.value;
                                     updateContent('fields', newFields);
                                }} placeholder="항목명 (예: 이름)" />
                                <div className="flex items-center gap-2">
                                    <select className="border rounded p-1 text-xs" value={field.type} onChange={(e) => {
                                         const newFields = [...block.content.fields];
                                         newFields[idx].type = e.target.value;
                                         updateContent('fields', newFields);
                                    }}>
                                        <option value="text">텍스트</option>
                                        <option value="tel">전화번호</option>
                                        <option value="email">이메일</option>
                                        <option value="checkbox">체크박스</option>
                                    </select>
                                    <label className="text-xs flex items-center"><input type="checkbox" checked={field.required} onChange={(e) => {
                                         const newFields = [...block.content.fields];
                                         newFields[idx].required = e.target.checked;
                                         updateContent('fields', newFields);
                                    }} className="mr-1"/> 필수</label>
                                </div>
                            </div>
                        ))}
                        <button onClick={() => updateContent('fields', [...block.content.fields, { id: Math.random().toString(), label: '새 항목', type: 'text', required: false }])} className="text-xs text-indigo-600 font-medium">+ 필드 추가</button>
                        
                        <div className="mt-4">
                            <span className="text-xs text-gray-500">버튼 텍스트</span>
                            <input className="w-full border rounded p-1 text-sm" value={block.content.submitButtonText} onChange={(e) => updateContent('submitButtonText', e.target.value)} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- Public Viewer Component ---
const Viewer = () => {
    const { id } = useParams();
    const [page, setPage] = useState<PageData | null>(null);

    useEffect(() => {
        if(id) {
            const loaded = getPage(id);
            if(loaded) setPage(loaded);
        }
    }, [id]);

    if(!page) return <div className="min-h-screen flex items-center justify-center text-gray-500">페이지를 찾을 수 없습니다.</div>;

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center sm:py-8">
            <div className="w-full max-w-[480px] bg-white min-h-screen sm:min-h-[800px] sm:h-auto sm:rounded-2xl sm:shadow-2xl overflow-hidden flex flex-col" style={{backgroundColor: page.theme.backgroundColor}}>
                <div className="flex-1 overflow-y-auto">
                    {page.blocks.map((block) => (
                        <BlockRenderer key={block.id} block={block} isPreview={true} />
                    ))}
                    <div className="p-8 text-center text-gray-400 text-xs">
                        <p>Powered by WelfareFlow</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Main App ---
function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create" element={<CreateSelection />} />
        <Route path="/edit/:id" element={<Editor />} />
        <Route path="/view/:id" element={<Viewer />} />
      </Routes>
    </HashRouter>
  );
}

export default App;