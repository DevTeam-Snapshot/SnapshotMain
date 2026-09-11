// 스테이프레임 — 디자인 보조용 스크립트
// 실제 광고 이미지 생성 로직(버튼 클릭 시 서버 요청 등)은 포함하지 않았습니다.
// 아래는 참고 이미지 1장을 선택했을 때 정사각형 버튼에 미리보기를 채워주는 역할만 합니다.

(function () {
  var input = document.getElementById('sfPhoto');
  var addButton = document.getElementById('sfImageAdd');
  var icon = document.getElementById('sfImageAddIcon');

  if (!input || !addButton || !icon) return;

  input.addEventListener('change', function (e) {
    var file = e.target.files && e.target.files[0];
    if (!file || !file.type.startsWith('image/')) return;

    var url = URL.createObjectURL(file);
    addButton.style.backgroundImage = 'url(' + url + ')';
    icon.classList.add('sf-image-add-icon-hidden');
  });
})();
