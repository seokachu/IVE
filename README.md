# 프로젝트명 "IVE로 DIVE"

<br/>

배포 주소 : [배포 링크 이동하기](https://ive-three.vercel.app)

<br>

`1차 배포` : 2024.10.18 ~ 2025.01.26 (메인페이지, 로그인, 회원가입, 굿즈샵, 장바구니, 마이페이지, 결제페이지)<br/>
`2차 배포` : 2025.01.26 ~ 2025.02.02 (버그 수정 반영) <br/>
`3차 배포` : 2025.02.02 ~ 2025.03.06 (자유게시판 추가) <br/>
`4차 배포` : 2025.03.06 ~ 2025.03.16 (소식 페이지 추가) <br/>
`추가 배포` : 2025.03.16 ~ 버그 수정 진행중 <br>

<br>
<br>

## 📌 프로젝트 소개
이 프로젝트는 아이브(IVE) 관련 정보를 제공하는 웹사이트로, 최신 소식, 갤러리, 자유게시판, 굿즈를 결제할 수 있도록 제공합니다.

<br>
<br>

## ✏️ 기술 스택
<table>
  <tr>
    <th>Next.js</th>
    <th>TypeScript</th>
    <th>Supabase</th>
    <th>Recoil</th>
    <th>Shadcn UI</th>
    <th>Toss Payment</th>
    <th>Prettier</th>
  </tr>
  <tr>
    <td align="center">
        <img src="https://github.com/user-attachments/assets/0e7ba33c-456b-491b-a815-afac91a22ae3" alt="next js icon" width="45" height="45" />
    </td>
    <td align="center">
      <img src="https://techstack-generator.vercel.app/ts-icon.svg" alt="icon" width="65" height="65" />
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/6e168931-ee0d-4e90-8710-050dad01942f" alt="supabase icon" width="50" height="50" />
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/1b0fb313-98c1-4790-9eb3-0e266cd926d8" alt="recoil icon" width="50" height="50" />
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/55af3049-b93f-4cf1-a6ab-d57a95022743" alt="shadcn ui icon" width="45" height="45" />
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/b79abc72-27c9-4621-937b-1c768a760f2c" width="45" height="45" alt="Toss Payment icon"/>
    </td>
    <td align="center">
      <img src="https://techstack-generator.vercel.app/prettier-icon.svg" alt="icon" width="65" height="65" />
    </td>
  </tr>
</table>

<table>
  <tr>
    <th>React Hook Form</th>
    <th>Swiper</th>
    <th>React Icons</th>
    <th>React Spinners</th>
    <th>React Daum Postcode</th>
  </tr>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/03bee6fc-6160-46f5-9a6f-832648438d75" width="45" height="45" alt="React Hook Form icon"/>
    </td>
    <td align="center"> 
      <img src="https://github.com/user-attachments/assets/8ccd376d-57e0-4a8e-9ddb-21ae8b8f4d3c" width="45" height="45" alt="Swiper icon"/>
    </td>
     <td align="center">
      <img src="https://github.com/user-attachments/assets/39220fa5-1a49-4303-986f-d143f0104830" width="50" height="50" alt="React Icons icon"/>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/3f1d7331-2260-4392-bf10-4efe1a74fa68" width="45" height="45" alt="React Spinners icon"/>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/3e37e861-3256-4092-99e0-7d2f7accf651" width="45" height="45" alt=""/>
    </td>
  </tr>
</table>

<table>
  <tr>
    <th>React Quill</th>
    <th>React Avatar Editor</th>
    <th>Lodash</th>
  </tr>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/7bba8da4-14e4-4489-b2ac-40eb24218da8" width="50" height="50" alt=""/>
    </td>
     <td align="center">
      <img src="https://github.com/user-attachments/assets/a90b7205-b187-4c62-91f4-8bcc1a9b77e9" width="45" height="45" alt=""/>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/df5b1157-ccfa-4ad4-a5ed-c0cdc2cb2493" width="45" height="45" alt=""/>
    </td>
  </tr>
</table>

<br>
<br>

## ✨ 화면 구성 및 주요 기능
<details>
<summary>메인페이지</summary>
  <br>
  <table>
     <tr>
      <th align="center">PC</th>
      <th align="center">Mobile</th>
    </tr>
    <tr>
      <td valign="top" width="50%;">
        <img src="https://github.com/user-attachments/assets/4b18024f-5e03-4869-b0df-20cbf93cc221" alt="" />
      </td>
      <td valign="top">
        <img src="https://github.com/user-attachments/assets/bb6fee32-53f4-4f27-a96b-c039af8878a5" alt="" />
      </td>
    </tr>
  </table>
  <ul>
    <li>스크롤 시 특정 섹션(ALBUM)부터 헤더 배경 색상 변경</li>
    <li>앨범 섹션 - Swiper 라이브러리로 가로 스크롤 구현</li>
    <li>자유게시판 최신 글 미리보기 제공</li>
    <li>굿즈샵 인기 상품 미리보기 제공</li>
    <li>모바일에서 햄버거 메뉴 클릭 시 사이드바 형태로 변경</li>
  </ul>
</details>

<details>
<summary>로그인,회원가입 페이지</summary>
  <br>
   <table>
   <tr>
     <th align="center">로그인 페이지</th>
     <th align="center">회원가입 페이지</th>
   </tr> 
    <tr>
      <td valign="top" width="50%;">
         <img src="https://github.com/user-attachments/assets/ce09089a-267f-47bb-9336-4e65fcf6d68e" alt=""/>
         <img src="https://github.com/user-attachments/assets/0c1aadee-a1f0-4a63-97e2-bc3c470cc361" alt=""/>
      </td>
      <td>
         <img src="https://github.com/user-attachments/assets/f433fe28-347e-4e1a-b2bf-b64b0221f1cb" alt=""/>
      </td>
    </tr>
  </table>
  <ul>
    <li>로그인 팝업(모달 형태의 로그인 페이지 제공)</li>
    <li>기존 회원을 위한 일반 로그인 페이지</li>
    <li>회원가입 후 첫 로그인 시 폭죽 효과 및 축하 메시지 표시</li>
  </ul>
</details>

<details>
<summary>소식페이지</summary>
<br>
 <table>
    <tr>
      <td valign="top">
         <img src="https://github.com/user-attachments/assets/9db11f54-4afb-4c2c-bd21-6885896f9a39" alt=""/>
      </td>
    </tr>
  </table>
  <ul>
    <li>최신 뉴스 조회 및 카테고리별 필터링</li>
    <li>갤러리 사진 조회</li>
    <li>더 많은 콘텐츠 로드 (페이지네이션)</li>
    <li>모달을 통한 상세 내용 조회</li>
  </ul>
</details>

<details>
<summary>굿즈샵 페이지</summary>
  <br>
  <table>
   <tr>
     <th align="center">굿즈샵 - 메인</th>
     <th align="center">굿즈샵 - 디테일 페이지</th>
   </tr> 
    <tr>
     <td valign="top" width="50%">
       <img src="https://github.com/user-attachments/assets/096f2bcc-dc1b-4719-921c-101dc4999323" alt=""/>
     </td>  
     <td valign="top">
       <img src="https://github.com/user-attachments/assets/572054fa-0842-4e41-bcd7-01c03f6d86f3" alt=""/>
     </td>
    </tr>
  </table>
  <ul>
    <li>
      굿즈샵 페이지
      <ul>
        <li>카테고리별 정렬과 무한스크롤을 통해 콘텐츠를 자동으로 로딩</li>
        <li>비회원 찜하기 기능, 로그인 시 로컬스토리지에 저장된 찜과 연동</li>
      </ul>
    </li>
    <br>
    <li>
      굿즈샵 디테일 페이지
      <ul>
        <li>공유하기 버튼 (링크 복사 기능)</li>
        <li>상품 수량 선택 (최대 5개, 초과 시 토스트 알림)</li>
        <li>상세정보와 리뷰 탭 (상세정보 기본, 별점 평균과 5개씩 나누어 보여주는 페이지네이션)</li>
        <li>자주 묻는 질문(FAQ)은 아코디언 형식으로 표시</li>
      </ul>
    </li>
  </ul>
</details>

<details>
<summary>자유게시판 페이지</summary>
  <br>
   <table>
   <tr>
     <td align="center">자유게시판<br>- 메인</td>
     <td valign="top" width="70%">
       <img src="https://github.com/user-attachments/assets/c423bc33-333e-4c7c-a430-a36b42fa6abb" alt=""/>
       <img src="https://github.com/user-attachments/assets/e3cc78f0-1722-4b69-83fa-2b9bd2157446" alt=""/>
     </td>
   </tr>
   <tr>
     <td align="center">자유게시판<br>- 글쓰기 페이지</td>
     <td valign="top" width="70%">
       <img src="https://github.com/user-attachments/assets/81919716-7891-4fd2-a6d2-5378852621cb" alt=""/>
     </td>  
   </tr>
   <tr>
     <td align="center">자유게시판<br>- 디테일 페이지</td>
     <td valign="top" width="70%">
       <img src="https://github.com/user-attachments/assets/cff95a6d-cfe4-4e18-8e0f-718d744dadc9" alt=""/>
     </td>  
   </tr>
  </table>

  <ul>
    <li>
      자유게시판 - 메인페이지
      <ul>
        <li>게시판 데이터 불러오기 (리스트 10개씩 페이지네이션)</li>
        <li>검색어 입력 시 디바운싱과 하이라이트 표시 기능</li>
        <li>모바일 댓글버튼 클릭 시 댓글로 스크롤 할 수 있게 이동</li>
      </ul>
    </li>
    <br>
    <li>
      자유게시판 - 글쓰기 페이지
      <ul>
        <li>React-quill 라이브러리 사용</li>
      </ul>
    </li>
    <br>
    <li>
      자유게시판 - 디테일 페이지
      <ul>
        <li>공유하기 버튼 (링크 복사 기능)</li>
        <li>좋아요, 댓글, 대댓글 기능</li>
        <li>게시글 수정/삭제, 댓글&대댓글 수정/삭제 기능</li>
      </ul>
    </li>
  </ul>
</details>

<details>
<summary>장바구니 페이지</summary>
  <br>
   <table>
   <tr>
     <th align="center">PC</th>
     <th align="center">Mobile</th>
   </tr> 
    <tr>
      <td valign="top">
        
      </td>
      <td valign="top">
        
      </td>
    </tr>
  </table>
  <ul>
    <li>장바구니 데이터 불러오기 및 체크박스로 아이템 선택 기능</li>
   <li>선택삭제, 전체삭제 기능으로 장바구니 아이템 관리</li>
    <li>상품별 삭제 기능 및 전체삭제 클릭 시 확인 모달</li>
    <li>상품 금액 및 할인 금액 계산 표시</li>
    <li>장바구니가 비어있을 때 '쇼핑하기' 버튼을 통한 UX 개선</li>
    <li>주문자 정보, 배송지 정보 변경 기능</li>
    <li>개인정보 수집 및 이용 동의 모달 (상세 약관 내용 포함)</li>
    <li>결제 금액 실시간 계산 (총 결제 금액, 상품 금액, 할인 금액)</li>
    <li>결제하기 버튼</li>
  </ul>
</details>

<details>
<summary>마이 페이지</summary>
   <table>
   <tr>
     <th align="center">PC</th>
     <th align="center">Mobile</th>
   </tr> 
    <tr>
      <td valign="top">
        
      </td>
      <td valign="top">
        
      </td>
    </tr>
  </table>
  <ul>
    <li>아바타 이미지 변경 - 프로필 이미지 편집(react-avatar-editor 라이브러리)</li>
    <li>닉네임 변경 기능</li>
    <li>찜 목록, 결제 목록, 내가 쓴 글, 배송지 관리 데이터 불러오기</li>
    <li>결제목록 주문상세 페이지, 구매확정 클릭 시 리뷰 작성 기능</li>
    <li>새 배송지 추가 버튼, 배송지 수정 & 삭제, 기본배송지로 설정 기능</li>
  </ul>
</details>

<details>
<summary>결제 페이지</summary>
   <table>
   <tr>
     <th align="center">PC</th>
     <th align="center">Mobile</th>
   </tr> 
    <tr>
      <td valign="top">
        
      </td>
      <td valign="top">
        
      </td>
    </tr>
  </table>
  <ul>
    <li>게시판 데이터 불러오기</li>
    
  </ul>
</details>







## 📁 파일 구조

