# Portfolio skills evidence

Evidence recorded during the September 2026 overhaul. Ratings describe implemented code and
verification, not technology familiarity or production experience. Review branches must be
merged before the default-branch portfolio reflects this work.

✅ strong implemented evidence · 🟡 basic implementation or incomplete runtime verification ·
🔴 missing · N/A not applicable to the portfolio's current projects.

| Skill | Status | Repository evidence |
|---|---|---|
| Python | ✅ | Tested packages, CLIs, pipelines and services across DEPI_TASKS, heart-detection-model, Cellula_LSTM_Week1, RAG_Cellula_Week_3 and others |
| SQL | ✅ | Hotel-Cancellation-Prediciton: relational schema, foreign keys, uniqueness/check constraints, indexes, Alembic migration and cascade tests |
| PostgreSQL | ✅ | Hotel: relational driver/configuration/DDL/migration and a ten-test suite including real PostgreSQL API/database integration passed in remote CI |
| MongoDB | 🔴 | Legacy hotel/ride code is not maintained portfolio evidence; unnecessary MongoDB dependency removed from the supported architecture |
| ETL/ELT | ✅ | DEPI_TASKS: CSV ingestion → validation → normalization/deduplication → clean/reject outputs → quality and business summaries; real source run |
| Data validation | ✅ | DEPI financial reconciliation; hotel closed feature contract; heart schema; flood pairing/mask ranges; video feature dimensions |
| Data modeling | ✅ | Hotel users/hotels/observations/predictions/model versions, documented ERD and versioned migration |
| Airflow | 🔴 | Not added: no current scheduled, incremental, dependency-heavy pipeline justifies its operational complexity |
| Spark | 🔴 | Not added: current local datasets/workloads do not demonstrate a distributed-processing need |
| Data warehouse | 🔴 | Not added: no implemented historical business analytics system requiring a cloud warehouse |
| Docker | ✅ | Hotel: actual image build, health-checked application/PostgreSQL Compose startup, health/docs requests and cleanup passed in remote CI |
| CI/CD | ✅ | All seventeen code/site review-branch workflow suites passed actual remote execution at the recorded commits; real test/lint/build gates and hotel PostgreSQL/container jobs. Pages publishing is configured but this overhaul is not deployed |
| AWS/GCP/Azure | 🔴 | No cloud deployment was provisioned or verified; GitHub Actions/Pages are not AWS/GCP/Azure evidence |
| APIs | ✅ | Hotel authenticated FastAPI prediction API; Uber real ONNX HTTP inference; Django/Flask bounded inputs and safe error/health paths |
| ML pipelines | ✅ | Hotel/heart/LSTM real retraining with isolated splits, source checksums, metadata and held-out reports; flood synthetic checkpoint smoke test |
| Experiment tracking | 🟡 | Configuration, source/model hashes and evaluation JSON in retraining pipelines; no MLflow server/registry implemented |
| Model serving | ✅ | Real native XGBoost, random forest/scaler, ONNX and recovered native LSTM inference paths; version/latency outputs |
| Monitoring | 🟡 | Practical application/agent logs, request IDs, health/readiness, per-call latency and persistent hotel lineage; no live drift/alerting system |
| NLP | ✅ | Actual LSTM training and inference, label/probability contracts and per-class failure reporting; Emoji transformer weights remain missing |
| LLMs | 🟡 | OpenRouter/OpenAI/Ollama adapters with bounded requests and response validation; provider execution not verified with live credentials/models |
| RAG | 🟡 | Code retriever/generator separation and real tiny-fixture Recall@k/MRR; local TF-IDF file retrieval; Chroma ingestion contracts. No measured live answer-quality evaluation |
| Agents | 🟡 | Bounded context/tool routing, strict structured outputs, relevance/presence validation and fallback/failure tests; no live Ollama run |
| Computer Vision | 🟡 | Real synthetic U-Net train/checkpoint/inference test; real saved video-feature ensemble. Real flood data/checkpoint and compatible raw-video extractor remain unavailable |
| Testing | ✅ | Real unit/integration/data/model/failure tests, not placeholders; see validation-results.json and per-repository report |

The strongest current evidence is reproducible Python/ML, API serving, data validation and
relational design. Data engineering is a correct small batch pipeline, not a large-scale
warehouse platform. AI engineering has useful tested boundaries but still needs authorized
live-provider/model evaluation. The missing infrastructure skills are intentionally visible;
no stack was introduced merely to turn a red cell green.
