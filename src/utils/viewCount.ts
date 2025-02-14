const VIEW_COUNT_KEY = "viewedPosts";

//현재 시간으로부터 24시간이 지났는지 확인- 24시간 뒤에 조회 카운트
const isExpired = (timestamp: number) => {
  const now = Date.now();
  const hoursPassed = (now - timestamp) / (1000 * 60 * 60);
  return hoursPassed >= 24;
};

//자유게시판 조회 기록 확인
export const hasViewedPost = (postId: number): boolean => {
  const viewedPosts = JSON.parse(localStorage.getItem(VIEW_COUNT_KEY) || "{}");

  //해당 게시글 조회 기록 없음
  if (!viewedPosts[postId]) return false;

  //해당 게시글 조회 기록이 24시간 지남 처리
  if (isExpired(viewedPosts[postId])) {
    delete viewedPosts[postId];
    localStorage.setItem(VIEW_COUNT_KEY, JSON.stringify(viewedPosts));
    return false;
  }

  return true;
};

//자유게시판 조회 기록 저장
export const markPostAsViewed = (postId: number) => {
  const viewedPosts = JSON.parse(localStorage.getItem(VIEW_COUNT_KEY) || "{}");
  viewedPosts[postId] = Date.now();
  localStorage.setItem(VIEW_COUNT_KEY, JSON.stringify(viewedPosts));
};
