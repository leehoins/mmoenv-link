// Supabase 설정 파일
// 환경변수나 설정에 따라 Supabase URL과 anon key를 설정하세요

const SUPABASE_CONFIG = {
  url: 'https://dnyuvyompyqcyvvwssvj.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRueXV2eW9tcHlxY3l2dndzc3ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzMjE5MTksImV4cCI6MjA5Njg5NzkxOX0.mkDxXiVfrEkT07q4LIrtFxBhKGV1VrDG-tRVu2V-WGI',
  instagramFeed: {
    enabled: true,
    limit: 9,
  },
};

// Supabase 클라이언트 초기화 함수
let supabase = null;

async function initSupabase() {
  if (typeof window !== 'undefined' && window.supabase) {
    // CDN으로 로드된 Supabase 사용
    supabase = window.supabase.createClient(
      SUPABASE_CONFIG.url, 
      SUPABASE_CONFIG.anonKey
    );
  } else {
    console.error('Supabase 클라이언트를 로드할 수 없습니다. HTML에 CDN 스크립트가 포함되어 있는지 확인하세요.');
  }
  return supabase;
}

// 설정 검증 함수
function validateConfig() {
  if (!SUPABASE_CONFIG.url || SUPABASE_CONFIG.url === 'YOUR_SUPABASE_URL') {
    console.warn('Supabase URL이 설정되지 않았습니다. supabase-config.js 파일을 업데이트하세요.');
    return false;
  }
  
  if (!SUPABASE_CONFIG.anonKey || SUPABASE_CONFIG.anonKey === 'YOUR_SUPABASE_ANON_KEY') {
    console.warn('Supabase anon key가 설정되지 않았습니다. supabase-config.js 파일을 업데이트하세요.');
    return false;
  }
  
  return true;
}

// 전역으로 내보내기
if (typeof window !== 'undefined') {
  window.SUPABASE_CONFIG = SUPABASE_CONFIG;
  window.initSupabase = initSupabase;
  window.validateConfig = validateConfig;
}
