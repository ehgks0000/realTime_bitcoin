// TypeScript 타입 정의를 위한 Chrome 타입 임포트
/// <reference types="chrome"/>

// 실행할 스크립트 함수 정의
function executeScript(tab: chrome.tabs.Tab): void {
  // 여기에 스크립트 실행 로직을 작성합니다.
  // 예시: 특정 탭에 스크립트를 주입하는 경우
  if (tab.id) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        console.log("스크립트 실행됨");
      },
    });
  }
}

// 확장 프로그램 아이콘 클릭 이벤트 리스너 추가
chrome.action.onClicked.addListener((tab) => {
  executeScript(tab);
});

// function saveCoinList(myCoinList: string[]) {
//   chrome.storage.sync.set({ coins: myCoinList }, function () {
//     console.log("Coin list saved");
//   });
// }

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.action === "saveCoinList") {
//     saveCoinList(request.data);
//   }
// });
