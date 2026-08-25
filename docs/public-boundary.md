# Public source boundary

## Included

- 제품 문제, 사용자 흐름과 전체 시스템 구조
- 합성 데이터 기반 API 계약과 mock server
- 시간·단계 전환, 자정 보정과 비동기 세대 제어
- 캐시와 진행 중 요청 병합의 일반화된 구현
- iOS·Flutter·서버에서 동일 계약을 유지한 의사결정
- 자체 제작 앱 화면 캡처

## Intentionally private

- 실제 철도 데이터 제공자와 endpoint별 adapter
- provider 요청 헤더, 예외 규칙 및 전체 정규화 로직
- push 인증, 서명, 전송과 token lifecycle의 운영 구현
- 구독 데이터 모델, abuse control과 운영 관측 구성
- 배포 workflow, 서버 주소, tunnel과 데이터베이스 설정
- 전체 UI 소스 및 독자적인 제품·사업 로직

## Excluded assets

- credential, `.env`, private key와 실제 토큰
- 운영 응답을 저장한 fixture 또는 로그
- 재배포 권한이 명확하지 않은 폰트와 제3자 원본 데이터
- production bundle identifier, signing entitlement와 release keystore

## Automated checks

`node tools/check-public-boundary.mjs`는 다음을 검사합니다.

- 운영·외부 제공자 도메인 문자열
- private key header와 일반적인 credential token 형식
- credential이 포함된 데이터베이스 URI
- `.env`, key, keystore와 font 파일
- 운영 bundle identifier

이 검사는 사람의 검토를 대체하지 않습니다. 공개 전에는 새 이력으로 시작하고, GitHub 설정에서 공개한 뒤에도 secret scanning 결과를 확인해야 합니다.
