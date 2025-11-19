import { PageData, PageType, BlockData } from '../types';
import { v4 as uuidv4 } from 'uuid'; // We'll simulate uuid since we can't import real uuid easily without package.json, using Math.random fallback

const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const STORAGE_KEY = 'welfare_flow_pages';

export const getPages = (): PageData[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const getPage = (id: string): PageData | undefined => {
  const pages = getPages();
  return pages.find((p) => p.id === id);
};

export const savePage = (page: PageData): void => {
  const pages = getPages();
  const index = pages.findIndex((p) => p.id === page.id);
  if (index >= 0) {
    pages[index] = page;
  } else {
    pages.push(page);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
};

export const deletePage = (id: string): void => {
  const pages = getPages();
  const newPages = pages.filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newPages));
};

export const createInitialPage = (type: PageType): PageData => {
  const base: PageData = {
    id: generateId(),
    type,
    title: type === 'invitation' ? '복지관 행사 초대장' : type === 'newsletter' ? '월간 소식지' : '사업 홍보',
    blocks: [],
    theme: {
      backgroundColor: '#ffffff',
      fontFamily: 'sans-serif',
      primaryColor: '#4f46e5',
    },
    createdAt: Date.now(),
  };

  // Pre-populate based on type
  if (type === 'invitation') {
    base.blocks = [
      { id: generateId(), type: 'text', content: { text: '2024년 복지관 개관기념 행사' }, style: { fontSize: '2xl', fontWeight: 'bold', textAlign: 'center', padding: '20px' } },
      { id: generateId(), type: 'image', content: { url: 'https://picsum.photos/800/600', alt: '행사 이미지' }, style: {} },
      { id: generateId(), type: 'schedule', content: { eventName: '기념식', startDate: '2024-10-10T14:00', endDate: '2024-10-10T16:00', location: '복지관 1층 강당' }, style: {} },
      { id: generateId(), type: 'map', content: { address: '서울시 어딘가', placeName: '행복복지관' }, style: {} },
      { id: generateId(), type: 'form', content: { fields: [{ id: '1', label: '성함', type: 'text', required: true }, { id: '2', label: '연락처', type: 'tel', required: true }], submitButtonText: '참석 신청하기' }, style: {} },
    ];
  } else if (type === 'newsletter') {
    base.blocks = [
      { id: generateId(), type: 'text', content: { text: '10월 행복 뉴스레터' }, style: { fontSize: 'xl', fontWeight: 'bold', textAlign: 'left', padding: '16px' } },
      { id: generateId(), type: 'image', content: { url: 'https://picsum.photos/800/400', alt: '활동 사진' }, style: {} },
      { id: generateId(), type: 'text', content: { text: '지난 달 우리 복지관에서는 다양한 프로그램이 진행되었습니다. 어르신들과 함께한 가을 나들이 소식을 전해드립니다.' }, style: { fontSize: 'base', padding: '16px' } },
      { id: generateId(), type: 'link', content: { url: '#', label: '자세히 보기', style: 'button' }, style: { textAlign: 'center' } },
    ];
  } else {
    // Promotion
    base.blocks = [
      { id: generateId(), type: 'text', content: { text: '노인 일자리 사업 참여자 모집' }, style: { fontSize: '2xl', fontWeight: 'bold', color: '#ffffff', backgroundColor: '#4f46e5', padding: '30px' } },
      { id: generateId(), type: 'business', content: { items: [{ label: '사업명', value: '우리동네 지킴이' }, { label: '모집기간', value: '2024.09.01 ~ 09.15' }, { label: '대상', value: '관내 65세 이상 어르신' }] }, style: {} },
      { id: generateId(), type: 'form', content: { fields: [{id: '1', label: '성명', type:'text', required: true}], submitButtonText: '상담 신청' }, style: {} }
    ];
  }

  return base;
};
