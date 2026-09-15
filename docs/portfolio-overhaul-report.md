# Repository engineering overhaul

## Scope and publication state

Twenty repositories were available in the public owner inventory. Eighteen received scoped
changes (sixteen code projects, the profile and this portfolio). `fares` has no source or
stated purpose; `Machine_Learning_Intern_Summer_2025` is a fork whose current checkout contains
only a motivational README. Neither was turned into an invented project. Private or otherwise
unavailable repositories are not claimed as inspected. In particular, the old portfolio's
`cancer_cell_detection` reference was absent from the available owner inventory and was
replaced with the verified supermarket ETL project rather than unsupported metrics.

Changes are published on `codex/portfolio-overhaul` review branches in all eighteen changed
repositories. Default branches and live
deployments have not been overwritten. `repository-scan.json` records the original Git heads,
complete original trees, workflows/tests and large artifacts. `validation-results.json`
records the actual local check commands, exit codes and output. The skills matrix is separate
in `skills-matrix.md`; `publication-status.md` links every review comparison and exact remote
CI evidence. Generated local clones/runtimes are excluded from this site's Git tree
and Pages artifact. The user's existing `images/portfolio.png` change was preserved and is
not part of this overhaul.

## Engineering decisions

The work followed scan → analyze → plan → implement → test → document → verify for each
supported project. Existing notebooks and trusted legacy artifacts were retained for
provenance. Important logic was moved into reusable code where it was available and useful;
missing training datasets, model weights and feature definitions were not fabricated.

PostgreSQL is justified only in the hotel system: users, hotels, inputs, predictions and model
versions have relational constraints and transactional lineage. SQLite remains local Django
framework state, not a patient/prediction store. Local CSV/JSON, native model files, a small
in-memory vector index and Chroma serve the other projects' actual needs. MongoDB was not
added for an unstructured-data claim. Models are files, not blobs in the application database.

No project currently needs Spark, Airflow, a cloud warehouse or multi-cloud provisioning.
The supermarket source is 1,014 rows and is a manual batch assignment. The tabular ML datasets
fit comfortably in memory. Training scripts are finite local jobs; tiny retrieval examples
are not distributed search systems. Adding schedulers or paid infrastructure would not solve
an observed problem. Docker is appropriate for the hotel multi-service app and was implemented
there; no container platform was forced into small utilities or notebook research.

No paid provider calls, production usage, cloud success, accuracy improvement, hardware
throughput or clinical suitability is claimed. Small synthetic/fixture tests prove code
paths, not real-world model quality. Pattern scanning current source is not a full Git-history
credential audit; any previously committed genuine credentials still require owner rotation.

## Local verification summary

All supported Python projects pass their declared lint/format and test checks after fixes.
The refreshed local run passed 82 Python tests across the supported packages/applications
and portfolio. Together with four Node tests and two native C++ tests, this is 88 actual
passing tests; tiny synthetic tests are not treated as real-data quality benchmarks.
The local suite includes real XGBoost, random-forest, native Keras LSTM and ONNX model loading;
actual hotel/heart/LSTM training; HTTP API validation; data-quality failures; file cleanup;
retrieval/tool routing; and a synthetic U-Net train/save/load/inference path.

The Uber client passes TypeScript checking and a Vite 8.3.0 production build. Both its client
and backend dependency audits reported zero vulnerabilities at verification time; this is
not a permanent security guarantee. Four Node tests pass, including real HTTP-to-ONNX
prediction. Two native C++ schedule tests pass, and a real ESP32 firmware build succeeds:
45,664/327,680 RAM bytes and 794,817/1,310,720 flash bytes. Physical hardware is unverified.

Nineteen YAML files (workflows plus Compose) parsed successfully. Parsing is not workflow
execution. All seventeen code/site review-branch CI suites also passed actual remote
execution at the commits recorded in `remote-ci-results.json`; profile-only docs need no
runtime suite. Hotel migrations were exercised through upgrade → downgrade → upgrade on SQLite.
Local Docker and PostgreSQL servers were unavailable. CI explicitly configures a PostgreSQL
test database and a separate Docker build/Compose health smoke test; both actually passed
in [the hotel CI run](https://github.com/HassanG04/Hotel-Cancellation-Prediciton/actions/runs/35028674614).
The ten-test suite passed with PostgreSQL configured, including real API/database integration;
container build/startup, `/health` and `/docs` also passed. These are CI checks, not a cloud or
production deployment. The integration fixtures use
`TEST_DATABASE_URL` rather than silently deleting an application database, and PostgreSQL
fixtures require an explicitly named `*_test` database.

## Repository reports

### DEPI_TASKS — Data Engineering

Before: supermarket CSV/notebook assignment and analytical questions under `assignment panda/`.
Data flowed directly from CSV into notebook calculations. pandas was the processing engine;
no database, backend, ML/AI pipeline, deployment, scheduler, monitoring or CI existed. Testing
and reproducibility were notebook-level, with no reusable quality boundary.

Implemented: `src/supermarket_etl` ingestion/validation/transformation package and CLI,
required schema, type/date coercion, categorical/payment normalization, duplicate invoice
rejection, missing-price reconstruction, range checks, financial reconciliation, date and
satisfaction features, clean/reject CSV and quality/business JSON. Idempotent outputs,
dependency metadata, Git ignores, real tests, lint/format CI and README flow diagram were added.

Architecture: source CSV → quality rules → accepted/rejected records → derived fields →
analytics outputs. No database or orchestrator is justified for this single local source.
Validation: three tests pass; real run 1,014 input, 959 accepted, 55 rejected, 14 duplicate
invoices, 24 reconstructed prices and zero revenue reconciliation failures. Validated
revenue 306,565.21. Portfolio value: explainable ETL and data-quality engineering.
Remaining: dataset-specific rules, no incremental/scheduled ingestion or historical warehouse.

### Hotel-Cancellation-Prediciton — Hybrid / ML Engineering + Backend

Before: XGBoost experiment with a 36,285-row reservation CSV, legacy pickle, HTML UI,
FastAPI/MongoDB backend and a second Django tree. Users, hotels and predictions were nested
documents; model bytes were stored in MongoDB. No migrations or reliable lineage contract,
weak configuration and no automated tests/CI. The notebook encoded room suffixes 1..7,
but the UI used an incompatible zero-based mapping.

Implemented: PostgreSQL-oriented SQLAlchemy schema for users, hotels, observations,
predictions and model versions, primary/foreign keys, check/unique constraints, cascade
relationships, useful indexes, Alembic migration, transactional input/prediction storage,
native UBJ plus feature metadata, startup registry/checksum, validated authenticated
FastAPI prediction endpoint, health/OpenAPI, safe admin creation, environment settings,
PBKDF2 password hashing, secure-cookie option, practical request/prediction logging/latency,
non-root Dockerfile/Compose/Postgres health and volumes, env example and CI. The legacy
Django source remains, with environment configuration replacing its hardcoded secret.

Added reusable validated CSV training with fixed encodings, stratified 70/15/15 splits,
prior baseline, fixed-seed XGBoost, metrics and export. Rare valid bookings are retained,
not blanket-filtered with IQR. The UI/schema/tests now use correct room codes 1..7.
README contains system/data-flow/ERD, setup, training, API, monitoring and limitations.

Architecture: validated booking → loaded native XGBoost → response + transactionally
persisted observation/prediction/model lineage → owner/admin views. Model files stay outside
the database. Technologies actually added: PostgreSQL configuration/driver, SQLAlchemy,
Alembic, Pydantic contracts, Docker configuration and GitHub Actions; no warehouse or MLflow.

Validation: ten tests pass, including real model, unique/check/foreign-key constraints and API/DB/training-export paths.
SQLite migration round trip passes. Real full-data training split 25,399/5,443/5,443;
validation accuracy 0.87268 (baseline 0.67242), test accuracy 0.86478, ROC AUC 0.92462.
Default legacy-native version `xgb-12fafa9cc47d`; retraining does not silently replace it.
Portfolio value: relational design, model lifecycle and application engineering.
Remaining: public API authentication hardening,
production HTTPS/security review and any real cloud deployment. No existing MongoDB
production records were migrated or destroyed; no accessible production dataset was assumed.

### heart-detection-model — Machine Learning Engineering

Before: UCI CSV/EDA/model comparison notebook, XGBoost pickle and desktop form. The GUI
scaled inputs despite unscaled final XGBoost training and incorrectly handled categories.
No DB/API/AI pipeline or deployment; no reusable training package, tests or CI.

Implemented: `src/heart_model` validated feature dataclass, strict numeric/integer/boolean
and category checks, exact 22-column one-hot encoding without inappropriate scaling,
native UBJ conversion/metadata/checksum, inference CLI/example and real tests/CI.
Training now validates/cleans UCI data, removes duplicates, records missingness, fits median
and mode imputation only on training rows, uses isolated stratified splits, compares a prior
baseline, and exports native model/configuration/metadata/evaluation. README documents the
preprocessing mismatch, lifecycle and educational limitations.

Architecture: CSV → train-only preprocessing → baseline/XGBoost → held-out report + UBJ;
complete patient JSON → explicit fixed feature schema → native inference. pandas/scikit-learn/
XGBoost are sufficient; no database/API/orchestrator was added to a CLI project.
Validation: eleven tests and real CLI inference pass. Full training used 918 distinct
rows (642/138/138); test accuracy 0.84058, ROC AUC 0.88646, Brier score 0.12902.
Portfolio value: reproducible tabular ML and train/serve schema consistency.
Remaining: severe missingness, external hospital validation, calibration/fairness/clinical
studies. Historical notebook scores are not used as a new benchmark.

### yet_another_heart_disease_application — ML Engineering / Application

Before: UCI research notebook and Django app, tuned random-forest/scaler/feature-name joblib
files, SQLite framework DB and tracked bytecode. Clinical form → preprocessing → pickle
inference; eager/fragile loading, weak settings and no real test or CI coverage. No AI pipeline.

Implemented: lazy trusted-artifact service, bounded numeric and discrete category validation,
three interaction features, exact 14-feature DataFrame/scaler contract, checksum/model version,
probability/latency, safe 400/503 responses and genuine readiness. Environment configuration,
pinned serialization-compatible scikit-learn 1.8.0, Git ignores and removal of generated DB/
bytecode from tracking were added (local ignored copies preserved). Duplicate case-colliding
README names were consolidated. No patient/prediction persistence or extra database added.

Added reusable training from four included processed UCI files, explicit raw-to-app codes,
train-only category/numeric imputation/scaling, isolated splits, prior baseline and fixed-seed
random forest. Artifacts and metadata/export names are compatible with the service;
`HEART_ARTIFACT_DIR` selects a retrained directory without replacing the default model.
README/CI/tests cover training and serving.

Architecture: form → validated/engineered features → saved scaler → RF → risk/probability;
training remains a finite local CLI. Validation: four Django and two retraining tests pass;
full run 918 distinct rows, 642/138/138 split, test accuracy 0.82609, ROC AUC 0.87818,
Brier score 0.13565. Portfolio value: integration of real models and a reliable web boundary.
Remaining: unseen-hospital evaluation, artifact portability/security, clinical validation;
no public production deployment or real medical impact is claimed.

### Cellula_LSTM_Week1 — NLP / ML Engineering

Before: notebook joining queries and image descriptions for toxic-category LSTM training,
plus research PDFs. The final test partition was also used for training validation.
No reusable data/training code, artifacts, tests, database/API/CI/deployment or monitoring.

Implemented: schema/null/deduplication and conflicting-label checks, joined text contract,
deterministic class-aware train/validation/test allocation with rare-class safeguards,
train-only tokenizer/label encoder, seeded TensorFlow LSTM, early stopping, majority baseline,
native Keras and JSON/tokenizer/labels exports, evaluation/source checksum, CLI and tests/CI.
Recovered the authorized local CSV from the existing quantization archive; data/artifacts
remain ignored because redistribution terms are unknown. README distinguishes research
notes from implemented methods.

Architecture: CSV → validated unique text → approximately 70/15/15 splits → train-only
tokenization → LSTM → held-out per-class report + artifacts. No serving API or infrastructure
is needed here; another repository demonstrates the legacy model's serving boundary.
Validation: five data tests pass and real TensorFlow 2.21.0 CPU training completes with early
stopping. 3,000 source rows become 2,027 distinct inputs, split 1,417/305/305. The measured
run reports weighted F1 0.91808 but macro F1 0.43772, with zero recall for several categories.
Portfolio value: leakage prevention, reproducible neural training and honest error analysis.
Remaining: mixed safe/unsafe/harm taxonomy, four-example rare classes, no external moderation
evaluation. High weighted F1 is not evidence of reliable harmful-content detection.

### RAG_Cellula_Week_3 — LLM/Generative AI

Before: notebook using HumanEval-style prompts, MiniLM/FAISS retrieval and CodeGen;
no independently testable components, evaluator, API/storage/deployment or CI.

Implemented: `src/code_rag` retriever/embedding and generator protocols, hashing offline
embedding fixture and optional sentence-transformer adapter, cosine in-memory index,
source-grounded prompts, lazy Transformers generation, latency/syntax validation, Recall@k/MRR
evaluation CLI and four-case fixture, five tests, packaging/CI and README diagram.
Architecture: prompt corpus → embedding/index → retrieved examples → source prompt → generator
→ syntax metadata. Small corpus does not justify a persistent vector DB, API or orchestrator.
Validation: five tests pass; actual four-case retrieval fixture achieved Recall@2=1 and MRR=1.
Those tiny deterministic scores are not HumanEval code correctness or hallucination metrics.
Portfolio value: retrieval/generation separation and evaluation boundaries.
Remaining: live model generation, larger independent corpus and answer/correctness evaluation.

### Cellula_NLP_Week4 — AI Engineering / NLP

Before: three brittle LangChain/OpenRouter scripts for support, conversational memory and
file RAG, with hardcoded local paths/eager dependencies and weak token/word bookkeeping.
No deployment, external database, tests/CI or reproducible storage contract.

Implemented: explicit HTTP provider adapter with key/model environment, timeout, response
validation, real reported token usage/latency and no automatic paid-call retries. Support
policy, bounded recent-message memory, local TF-IDF file retrieval, stable chunk IDs, idempotent
JSON persistence, top-k sources and empty-retrieval abstention; task wrappers remain.
Packaging/env example/tests/CI and architecture/rationale README were added.
Architecture: validated task → bounded history or local document retrieval → OpenRouter;
local retrieval is lexical, not a falsely claimed semantic vector DB. Four tests pass using
deterministic retrieval and mocked HTTP/provider responses, including failure paths.
Portfolio value: practical provider/memory/retrieval boundaries. Remaining: authorized live
provider evaluation, robust prompt-injection defenses and independent answer-quality tests.

### cellula_NLP_week5 — Hybrid AI Application

Before: Django app joining LangGraph code assistance, Chroma RAG, LSTM classification and
BLIP captions. Eager heavy imports, missing LSTM weights, tracked cache/SQLite/Chroma artifacts,
unsafe upload handling and disabled CSRF prevented a dependable lightweight startup.

Implemented: lazy feature loading, retained LangGraph intent routing with bounded OpenAI
calls, Python syntax checking without execution, deterministic Chroma ingestion IDs/source
metadata/relevance threshold/empty abstention, ingestion management command/example document,
BLIP no-gradient cached loading, bounded forms, enabled CSRF, Pillow validation and random
5-MB temporary image handling with guaranteed cleanup, safe 400/503 and health indicators.
Environment settings, split lightweight/AI dependencies, ignores, tests/CI and README diagrams.

Recovered the legacy H5 from `Quantization_Cellula_Week_2/code.rar` only after tokenizer and
label encoder hashes matched byte-for-byte. Converted to a checked-in 5.3-MB native Keras model
and JSON tokenizer/nine labels/provenance. Serving no longer unpickles tokenizer/labels;
returns validated probabilities, label, artifact version and latency. Caption-only mode
does not classify. Generated caches and DB files are untracked, locally preserved.

Architecture: Django → independent code/RAG/text/image services; Chroma persists local chunks,
SQLite holds framework state, not model binaries. Eight tests pass, including real native
LSTM inference, CSRF, retrieval/source contracts, missing-model handling, and cleanup on
caption success/failure. `How can I stay safe online?` was actually classified `Violent Crimes`:
a recorded false-positive failure, not a model-quality success. Portfolio value: resilient
multi-capability service boundaries and artifact recovery. Remaining: live OpenAI/Chroma
embedding/BLIP execution, moderation quality/taxonomy and production security/deployment.

### cellula_NLP_week6_and_week7 — AI Engineering / Agents

Before: loosely validated LangChain context tools, Ollama/Wikipedia calls and Flask interface;
fragile structured outputs, unnecessary routing, debug settings and tracked bytecode.
No database, deployment, automated evaluation/tests/CI or reliable failure boundary.

Implemented: finite context agent, explicit tools and Ollama HTTP adapter, validated JSON
split outputs/strict boolean presence and relevance judgments, usable-context routing,
Wikipedia fallback only when needed, empty-source abstention, tool error trace/logging,
latency/token metadata, configurable local model/URL and bounded input. Flask factory enables
injected testing, safe content-type/input/provider errors, liveness and Ollama readiness.
Ignored/untracked bytecode, env/config/dependencies, five tests/CI and README data flow.
Architecture: question/context → split/presence/relevance → context or Wikipedia → Ollama
answer + trace. No persistence, autonomous unbounded loop or orchestration platform needed.
Five tests pass with controlled tool/provider outputs, malformed JSON and failure cases.
Portfolio value: routing/state/tool validation. Remaining: live Ollama model and Wikipedia
execution, answer correctness and larger failure-case evaluation; no autonomous deployment claim.

### Emoji_Recognition — NLP / Application

Before: emotion/emoji notebook, Django app and DistilBERT tokenizer/config with six labels
but missing trained TensorFlow transformer weights. Eager model loading, insecure development
settings, tracked framework DB/bytecode and unsafe frontend HTML rendering; no tests/CI.

Implemented: lazy local-only transformer loader that explicitly requires weights, validated
bounded text, stable softmax/probability/label schema, version/latency output, safe 400/405/503,
readiness, environment settings, split optional ML dependencies, XSS-safe textContent rendering,
Git hygiene, four Django tests/CI and corrected README limitations. Architecture: text →
contract → optional local DistilBERT → six-class probabilities → DOM-safe presentation.
SQLite is framework-only; no unnecessary database/API framework or Docker added.
Four contract/UI/failure tests and Django check pass. Real transformer inference cannot be
verified without missing weights; fake model outputs are not an accuracy benchmark.
Portfolio value: safe NLP serving contracts. Remaining: authorized training data/weights,
reproducible fine-tuning and independent evaluation; old 93.1% portfolio claim removed.

### River-Flood-Prediction — Computer Vision / ML Engineering

Before: U-Net notebook/Flask prototype with unavailable real images/masks/checkpoint, shared
dataset transform state across splits and dummy `NO FLOOD` fallback. No DB/AI pipeline,
reliable data contract, isolated reusable training, tests/CI or verified deployment.

Implemented: strict unique image/mask pairing, spatial/class/range checks, seeded split,
independent dataset/transform instances with training-only augmentation and nearest-neighbor
mask resize, compact U-Net, reusable training/checkpoint/held-out IoU report, genuine lazy
checkpoint inference/hashversion, Flask factory and health/readiness, bounded validated image
uploads, segmentation overlay/flood fraction/latency and safe missing-model 503. No dummy
classification path. Packaging/env/ignores/four tests/CI and synchronized architecture README.
Architecture: paired data → isolated preprocessing/splits → U-Net → best checkpoint →
validated image API → mask/overlay. pandas/Spark/database/orchestrator are unnecessary here.
Four tests pass, including real one-epoch training on six tiny synthetic pairs and native
PyTorch checkpoint inference. This is a code-path smoke test, not flood-detection quality.
Portfolio value: CV data contract/train-serve lifecycle. Remaining: real source/checkpoint,
geographic leakage assessment and benchmark; 1% flood-fraction threshold is a demo heuristic.

### ShopLifting_Detection — Computer Vision

Before: research notebook, saved three-estimator ensemble, YOLO pose weights and PNG utility;
README claimed absent Django/Celery infrastructure. Saved ensemble expects MediaPipe-33
features (528 pose, 1,779 appearance/motion; combined regressor 1,896), whereas the newer
notebook uses incompatible YOLO-17/MobileNet features. Required original pose asset/extractor
is unavailable. No deployable backend, database, testing/CI or trustworthy video serving.

Implemented: lazy trusted ensemble loader, class/weight/dimension/finite/row-alignment checks,
weighted soft voting, metadata/checksum/latency, NPZ CLI with pickle-disabled data loading,
three real tests, minimal supported dependencies, optional video utility, CI and truthful
README feature-flow/compatibility gap. PNG conversion is path/grouping-aware with lazy cv2
and positive FPS/dimensions; no fabricated backend reconstructed from incompatible features.
Architecture: compatible feature NPZ → validated three-model ensemble → class/probability.
Three tests pass and all saved estimators run on a controlled valid two-row feature matrix;
zeros are not realistic footage or an accuracy measurement. Portfolio value: preserving
artifact contracts and detecting train/serve incompatibility. Remaining: original compatible
raw-video extractor/pose asset and independent real-video evaluation/deployment.

### Quantization_Cellula_Week_2 — ML Engineering / Quantization

Before: research PDF and opaque `code.rar`, without inspectable source/tests/CI. Inspection
showed the archive contains an LSTM/BLIP Streamlit demo and dataset, not implemented LLM
quantization. Extracted selected source/data/trusted artifacts under `code/`, excluding caches
and temporary files. Expanded CSV data and duplicate pickle/H5 artifacts stay local and
ignored; permission review blocked dataset publication because redistribution terms are
unknown. Only selected legacy Python source was published. The original archive was retained.

Implemented: `src/quantization_lab` symmetric signed INT8 per-tensor/per-output-channel
quantization, zero/range/channel validation, dequantization, storage including scale overhead,
linear-output error evaluation, deterministic CLI, four tests, packaging/CI and README rationale.
Architecture: float weights → scale/INT8 representation → storage/error measurement →
dequantized reference output. No database, serving API, GPU/LLM deployment or scheduler needed.
Four tests pass. Real seeded 512×128 weight/32-input experiment: float storage 262,144 bytes;
per-tensor 65,540 bytes, output RMSE 0.257921; per-output-channel 66,048 bytes, RMSE 0.172352.
Storage ratios about 4.00×/3.97× include scales. Portfolio value: measured numerical trade-offs.
Remaining: real INT8 kernel/throughput, LLM quantization and quality/latency benchmarks.
Reference matmul dequantizes to floating point; it is not a hardware speedup claim.

### Uber-Fare-Prediction — ML Engineering / Backend Application

Before: XGBoost regression notebook/joblib/ONNX artifacts, duplicate Django/Node/React trees,
health-only Node backend/MongoDB, missing Gemini service import, fake browser accounts/history/
dashboard figures and browser API-key injection. Model engineered-distance definitions and
training dataset unavailable; no complete tested inference flow or CI.

Implemented: supported stateless Express + ONNX Runtime CPU service, exact 20-field closed
schema and saved encoder categories, finite/range/integer/calendar validation, startup input-name
verification, genuine prediction/currency/version/latency, health/readiness, bounded JSON,
CORS/loopback configuration, request IDs and structured logs without trip bodies, safe errors,
graceful shutdown and four real Node tests. React now uses a focused real prediction form,
local CSS/assets, no invented auth/history/analytics or LLM fare. Vite no longer injects keys;
updated Vite 8.3.0/plugin/lockfiles, scoped TypeScript entrypoints and build CI, env/ignores/README.
Legacy trees remain preserved; their Django secret now comes from environment. Broad legacy
deletion was rejected by permission review, so a safer supported-entrypoint boundary was used.

Architecture: React → validated Express API → loaded ONNX model → historical fare estimate.
No persistence means no database is justified. Four tests pass, including real HTTP-to-ONNX
inference. Client typecheck/build pass; client and backend current dependency audits each
reported zero vulnerabilities. Version `onnx-524e1e3abd93`. Portfolio value: real JS model
serving without a pretend LLM/backend. Remaining: engineered-feature provenance/units, source
data/retraining/real holdout regression metrics, public serving hardening or cloud deployment.

Browser verification against the built local UI and actual API returned `$30.64 USD` for
the example trip. Passenger count zero displayed a clear validation error and cleared the
previous estimate. This proves one end-to-end success/failure flow, not model quality,
current ride pricing, broad accessibility or a latency benchmark.

### Automatic-Box-Opener — Embedded Application / Hybrid

Before: single ESP32 C++ medical-box sketch connecting sensors/display/servo, clock schedules,
Wi-Fi and MQTT, with embedded credentials, blocking reconnection and unbounded sensor waits.
No database/ML/AI pipeline, reproducible firmware build, native tests or CI; manual hardware use.

Implemented: PlatformIO target/dependencies, separated example/local secrets, bounded Wi-Fi
startup and ultrasonic timeout, non-blocking MQTT retry intervals, invalid DHT handling,
pure schedule helpers/date reset, two native Unity tests, firmware CI and README architecture/
wiring/configuration/limits. Local operation remains possible without connectivity.
Architecture: clock/sensors → scheduling/control → servo/display + MQTT telemetry.
Two native tests and real ESP32 build pass; RAM 13.9%, flash 60.6% as measured above.
Portfolio value: reproducible embedded software and failure/time-bound handling, not forced AI.
Remaining: physical sensor/servo/schedule validation, live MQTT and device/network security;
originally committed credentials must be rotated if they were real. No history rewrite.

### words_combination_generator — Backend/Application Utility

Before: small Python Arabic/English word-variant generator for moderation lists, exception
swallowing and fragile character handling; no DB/API/ML/AI/deployment/tests/CI.
Implemented: deterministic bounded generation, positive cap validation, cleaned Arabic
handling and explicit error behavior; packaging, ignores, four real tests, CI and concise README.
Architecture: supplied word → character variants → bounded unique combinations. Four tests,
lint and format pass. No database, neural model, API, container or scheduler is justified.
Portfolio value: tested small utility with resource bounds. Remaining: linguistic recall/
false-positive evaluation and real moderation integration; a word list is not semantic safety.

### HassanG04 — Profile / Presentation

Before: profile README with broad unverified accuracy/deployment claims and an unavailable
cancer repository reference. No application/pipeline/storage/runtime or engineering tests needed.
Implemented: factual student positioning, links to concrete data/ML/AI code, limitations and
engineering judgment; removed unsupported headline metrics and cloud/production implication.
Architecture: profile README → inspectable project links. Validation: links match the available
owner inventory; this is documentation, not a runtime test. Portfolio value: clear evidence-led
navigation. Remaining: review branches need merging; personal education/contact details remain
owner-supplied rather than independently certified.

### portfolio — Backend/Application (Static Website)

Before: seven static HTML role pages, CSS/vanilla JS/Bootstrap/Font Awesome, images/sounds and
existing GitHub Pages workflow. No backend/database/ML/AI pipeline required. Unsupported old
project metrics/architecture descriptions and no static integrity test gate.
Implemented: evidence-corrected project cards and AI/ML/DE role content, verified ETL replacing
unavailable cancer evidence, profile alignment, local-file/anchor/ID/dynamic-image validator,
six tests, JavaScript syntax CI, Pages pre-upload gate, README, scan/results/report/matrix,
and clone/runtime exclusion. Existing appearance/interactions and user's image change preserved.
Architecture: static Pages artifact → HTML/CSS/JS → project evidence links. Six tests and
both JS syntax checks pass; all seven pages' local routes/assets/anchors validate.
Portfolio value: coherent honest engineering presentation and build hygiene. Remaining:
current changes have not been deployed; offline checks do not verify external CDN/link uptime,
browser visual behavior or full accessibility. No new cloud deployment claimed.

### fares — Unclassified / Empty

Before/after: empty repository, no files or stated problem, technologies, architecture, data,
storage, backend, ML/AI pipeline, deployment, tests, docs, CI, monitoring or reproducibility.
No speculative project was implemented. Portfolio value: none yet. Required missing decision:
what this repository is intended to build. This is a genuine information gap, not skipped work.

### Machine_Learning_Intern_Summer_2025 — Fork / Unclassified

Before/after: public GitHub marks it a fork; current cloned main contains only a motivational
README despite historical size metadata. No current project/source/data/architecture/API/
database/ML/AI/deployment/tests/CI/monitoring to engineer or claim as original portfolio work.
Read-only inspection completed; no changes. Remaining: owner-authored project source/purpose
would be required for an overhaul. Fork history size is not current implementation evidence.

### CI follow-up

Remote execution found two differences the local checks could not expose: PlatformIO had
no requirements/pyproject file for the setup action's default pip-cache hash, and the word
generator needed explicit isort first-party classification for its uppercase `GC` module
on Linux. The subsequent Linux run also exposed a shebang without a tracked executable
bit; `GC.py` now has executable Git mode, and its usage examples name the actual file.
Python Git attributes and the formatter explicitly use LF to prevent mixed Windows/Linux
line endings from failing the formatting gate.
Those configurations were fixed; latest verification results are recorded separately. Official current checkout,
Python-setup and Node-setup action release tags replaced deprecated action runtimes;
application language versions/stacks were not forced to match.
The remote verifier rejects empty, unfinished, failed and stale-commit evidence; three of
the portfolio's six tests exercise those rules. An optional in-memory `GITHUB_TOKEN` supports
authenticated reads when GitHub's public API quota is exhausted, without recording secrets.

## Maturity and remaining work

The supported code moves from exploratory/fragile prototypes to tested, documented local
packages and application boundaries. This is not a claim of production maturity. The most
important next evidence is real AI-provider evaluation, compatible raw-video extraction,
authorized missing CV/NLP artifacts, and security review before public serving. Hotel
PostgreSQL integration and container startup have now passed actual remote CI.
Cloud requires a selected account, explicit cost/security constraints and actual deployment
checks; it was not provisioned speculatively. Review-branch publication and remote CI results
are recorded separately. Merge/deployment decisions should preserve owner control.
