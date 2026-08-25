# Verification record

검증일: 2026-08-25

## Private source audit before extraction

- Native iOS, Node.js server와 Flutter 저장소를 각각 새 작업 디렉터리에 clone했습니다.
- 현재 tree와 전체 Git object history에서 credential 패턴과 민감 파일명을 검사했습니다.
- 실제 credential은 발견되지 않았습니다. 감지된 database URI는 문서 placeholder와 마스킹 단위 테스트의 합성 값이었습니다.
- 운영 Node.js 서버의 기존 단위 테스트 56개가 통과했습니다.

## Public repository checks

| Check | Result |
|---|---|
| Synthetic Node API | 8 tests passed |
| Swift package | Library and executable check built; runtime checks passed |
| Dart package | Format clean, analyzer clean, 4 tests passed |
| OpenAPI document | YAML parsed successfully |
| Public boundary scanner | Passed |
| Local Markdown links | Passed |

전체 iOS 앱 빌드는 ActivityKit signing 환경과 full Xcode가 필요하므로 공개 샘플에서는 순수 Swift Package로 검증 범위를 분리했습니다. Flutter 전체 앱 역시 공개하지 않고, 플랫폼 독립 Dart 도메인 패키지만 검증합니다.

GitHub Actions는 Node, Swift와 Dart를 각각 적합한 runner에서 다시 검사합니다.
