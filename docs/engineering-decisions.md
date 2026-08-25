# Engineering decisions

## 1. One phase threshold across every runtime

출발 전 UI와 운행 중 UI가 겹치지 않도록 `scheduled departure + delay`를 유일한 단계 전환 기준으로 정했습니다. 서버, Swift와 Dart가 같은 규칙을 사용하므로 갱신 직후에도 타는 곳과 위치가 동시에 나타나지 않습니다.

경계값에서 `now == delayed departure`이면 `running`입니다. 이 조건을 플랫폼별 테스트에 명시해 구현 언어에 따른 차이를 막았습니다.

## 2. Prevent stale asynchronous commits

역을 빠르게 바꾸거나 토큰 등록이 겹치면 먼저 시작한 요청이 나중에 끝날 수 있습니다. 단순히 마지막으로 완료된 결과를 저장하면 UI와 구독이 과거 상태로 되돌아갑니다.

각 작업 시작 시 증가하는 generation/revision을 발급하고, 완료 시 현재 값과 일치하는 작업만 commit합니다. 공개 샘플의 Swift `GenerationGate`와 Dart `RevisionGate`가 이 패턴의 최소 구현입니다.

## 3. Coalesce in-flight requests, not only cached values

동일한 열차를 앱 요청과 background worker가 동시에 조회할 수 있습니다. TTL 값만 캐시하면 cache miss 순간에는 같은 upstream 요청이 여러 번 발생합니다.

`TTLCache`는 완성된 값과 별도로 pending promise를 보관합니다. 같은 키의 호출자는 한 loader를 공유하고, 성공 여부와 무관하게 작업이 끝나면 pending 항목을 정리합니다. 공개 Node 테스트가 동시 호출 한 번만 loader를 실행하는지 확인합니다.

## 4. Keep confirmed and inferred location separate

좌표로 계산한 최근접역은 유용하지만 실제 운행 상태와 다를 수 있습니다. 이를 확정 현재역처럼 표시하면 정확도 문제보다 신뢰 문제가 더 커집니다.

계약에서 `currentStation`/`nextStation`과 `nearestStation`/거리 값을 분리하고, 확정값이 없을 때만 UI가 추정값을 보조 정보로 표시하도록 했습니다.

## 5. Treat restore and token rotation as normal state transitions

Live Activity와 Android ongoing notification은 앱 프로세스보다 오래 살 수 있습니다. 앱 시작 시 단순히 새 항목을 만들지 않고 OS 상태, 로컬 저장과 서버 구독을 대조합니다.

등록 요청에는 revision을 포함해 늦게 도착한 이전 등록이 새 토큰을 덮지 않게 했습니다. 푸시 실패도 즉시 구독 삭제로 연결하지 않고 재시도와 명시적 무효 토큰을 구분했습니다.

## 6. Separate the public contract from private integrations

클라이언트가 데이터 제공자를 직접 호출하면 제공자 변경, 인증, rate limit과 장애 대응이 앱 릴리스에 묶입니다. 앱은 하나의 정규화된 계약만 소비하고 제공자별 처리는 서버 뒤에 둡니다.

포트폴리오 저장소도 같은 경계를 따릅니다. 계약과 일반화 가능한 상태·동시성 코드는 공개하지만, 실제 provider adapter와 운영 push engine은 포함하지 않습니다.
