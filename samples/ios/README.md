# Swift domain sample

운영 iOS 앱은 SwiftUI, SwiftData, ActivityKit과 WidgetKit을 사용합니다. 이 공개 Swift Package는 signing, entitlement, 운영 API 없이 다음 핵심 규칙을 검증할 수 있게 분리한 샘플입니다.

- 지연을 반영한 단일 여정 단계 정책
- 자정을 넘는 시각표의 단조 증가 정규화
- 오래된 비동기 결과를 막는 actor 기반 generation gate

```bash
swift run KorailLiveShowcaseCheck
swift test
```

실제 ActivityKit attributes, push token과 전체 화면 코드는 공개 범위에서 제외했습니다.
