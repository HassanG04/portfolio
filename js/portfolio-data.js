(function () {
  'use strict';

  const allRoles = ['AI', 'ML', 'DS', 'DA', 'DE'];

  const shared = {
    name: 'Hassan Gebril',
    location: 'Alexandria, Egypt',
    github: 'https://github.com/HassanG04',
    linkedin: 'https://www.linkedin.com/in/hassan-gebrill-98a08a299/',
    resumes: {
      AI: 'https://drive.google.com/file/d/1OtvoA3evwZXAcb-kifyhtX20TDkF-zF1/view?usp=sharing',
      ML: 'https://drive.google.com/file/d/1QwQu9VR7pfQ150LYLhrRi9tzvpEFT1UZ/view?usp=drive_link',
      DS: 'https://drive.google.com/file/d/1Hv3CbecJJjHXBKa5ne9_1nqPhPpaRrpr/view?usp=drive_link',
      DA: 'https://drive.google.com/file/d/1mbtZ-syqCMoyOxkj6yaczp5xED4QxzLO/view?usp=drive_link',
      DE: 'https://drive.google.com/file/d/1itIBuVUK0YW5qgI82nqqoZzbameo5YXP/view?usp=sharing'
    }
  };

  const professions = {
    AI: {
      label: 'AI Engineer', short: 'AI', eyebrow: 'Applied intelligence · end-to-end delivery',
      headline: 'AI systems that connect models, interfaces, and real workflows.',
      description: 'I help teams move from an AI idea to a working prototype by combining computer vision, NLP, model evaluation, and Python web delivery.',
      promise: 'Best suited to teams exploring an intelligent product, automating a visual or text-heavy workflow, or turning a trained model into something people can test.',
      skills: ['Python', 'PyTorch', 'Computer Vision', 'Transformers', 'OpenCV', 'Flask', 'Django', 'Model Evaluation']
    },
    ML: {
      label: 'ML Engineer', fullLabel: 'Machine Learning Engineer', short: 'ML', eyebrow: 'Predictive modelling · evaluation · delivery',
      headline: 'Predictive systems built to be tested, explained, and used.',
      description: 'I build supervised machine-learning workflows from data preparation and feature engineering through model comparison, explainability, and application integration.',
      promise: 'Best suited to teams with structured data, a measurable prediction target, and a need for a reproducible model that stakeholders can understand.',
      skills: ['Python', 'scikit-learn', 'XGBoost', 'Optuna', 'SHAP', 'Data Validation', 'Flask', 'Django']
    },
    DS: {
      label: 'Data Scientist', short: 'DS', eyebrow: 'Data exploration · modelling · evidence',
      headline: 'Data science that turns messy questions into measurable evidence.',
      description: 'I explore, prepare, and model data to clarify patterns, compare approaches, and communicate results through reproducible notebooks and usable applications.',
      promise: 'Best suited to teams that need to understand a dataset, test a predictive idea, and translate model results into a decision-ready story.',
      skills: ['Python', 'Pandas', 'Exploratory Analysis', 'Feature Engineering', 'Statistics', 'scikit-learn', 'XGBoost', 'SHAP']
    },
    DA: {
      label: 'Data Analyst', short: 'DA', eyebrow: 'Data quality · patterns · communication',
      headline: 'Clear analysis for teams that need to understand what the data is saying.',
      description: 'I clean and explore structured datasets, identify useful patterns, define meaningful measures, and communicate findings without burying the decision in technical detail.',
      promise: 'Best suited to teams with operational data that needs cleaning, investigation, comparison, and a concise explanation of what matters next.',
      skills: ['Python', 'Pandas', 'Data Cleaning', 'Exploratory Analysis', 'SQL Foundations', 'Data Validation', 'Metrics', 'Reporting']
    },
    DE: {
      label: 'Data Engineer', short: 'DE', eyebrow: 'Reliable inputs · reproducible workflows · delivery',
      headline: 'Cleaner, repeatable data workflows that make downstream work dependable.',
      description: 'I bring a machine-learning perspective to data engineering: validating inputs, shaping reusable preparation steps, and keeping the path from raw data to application understandable.',
      promise: 'Best suited to early-stage teams that need disciplined dataset preparation, validation, schema thinking, and reproducible handoff for analytics or machine learning.',
      skills: ['Python', 'Pandas', 'Data Validation', 'Schema Planning', 'SQL Foundations', 'Reproducibility', 'Pipeline Design', 'Documentation']
    }
  };

  const services = [
    { id: 'ml-development', roles: ['MAIN'], icon: 'fa-brain', title: 'Machine Learning Development', copy: 'Data preparation, feature engineering, model training, evaluation, tuning, and explainability for predictive systems.', tags: ['Python', 'PyTorch', 'scikit-learn'] },
    { id: 'ai-web', roles: ['MAIN'], icon: 'fa-code', tone: 'cyan', title: 'AI-Powered Web Applications', copy: 'Responsive Flask and Django applications that turn trained models into clear, usable workflows.', tags: ['Flask', 'Django', 'JavaScript'] },
    { id: 'computer-vision', roles: ['MAIN', 'AI'], icon: 'fa-eye', tone: 'pink', title: 'Computer Vision Systems', copy: 'Image classification, semantic segmentation, and video understanding prototypes built around a defined operational problem.', tags: ['OpenCV', 'PyTorch', 'Keras'] },
    { id: 'nlp', roles: ['MAIN', 'AI'], icon: 'fa-language', tone: 'green', title: 'NLP & LLM Prototypes', copy: 'Text classification, transformer fine-tuning, semantic retrieval, and retrieval-augmented experiments.', tags: ['Transformers', 'DistilBERT', 'FAISS'] },
    { id: 'database', roles: ['MAIN'], icon: 'fa-database', tone: 'orange', title: 'Database & Data Management', copy: 'Dataset cleaning, validation, schema planning, and SQL-ready data integration for Flask and Django workflows.', tags: ['SQL', 'Data Quality', 'Schema Design'] },
    { id: 'mlops', roles: ['MAIN'], icon: 'fa-gears', tone: 'cyan', title: 'MLOps & Model Delivery', copy: 'Reproducible training and evaluation, model packaging, application integration, and monitoring-ready handoff.', tags: ['Reproducibility', 'Deployment', 'Documentation'] },
    { id: 'ai-delivery', roles: ['AI'], icon: 'fa-window-maximize', title: 'AI Application Delivery', copy: 'Responsive Flask and Django interfaces that turn model inference into a clear, demonstrable workflow.', tags: ['Flask', 'Django', 'JavaScript'] },
    { id: 'predictive-modeling', roles: ['ML'], icon: 'fa-chart-line', title: 'Predictive Modelling', copy: 'Classification and regression workflows covering preparation, feature engineering, training, tuning, and held-out evaluation.', tags: ['scikit-learn', 'XGBoost', 'Optuna'] },
    { id: 'explainability', roles: ['ML'], icon: 'fa-magnifying-glass-chart', title: 'Evaluation & Explainability', copy: 'Metric selection, leakage checks, model comparison, error analysis, and clear feature-level explanations.', tags: ['SHAP', 'Cross-validation', 'AUC'] },
    { id: 'model-integration', roles: ['ML'], icon: 'fa-gears', title: 'Model Application Integration', copy: 'Package trained models into focused Flask or Django experiences that support testing and stakeholder review.', tags: ['Flask', 'Django', 'Python'] },
    { id: 'exploration-quality', roles: ['DS'], icon: 'fa-filter-circle-dollar', title: 'Exploration & Data Quality', copy: 'Profile datasets, identify missingness and outliers, validate assumptions, and prepare analysis-ready features.', tags: ['Pandas', 'EDA', 'Validation'] },
    { id: 'predictive-experiments', roles: ['DS'], icon: 'fa-flask-vial', title: 'Predictive Experiments', copy: 'Frame measurable hypotheses, compare baseline and tuned models, and evaluate results on held-out data.', tags: ['Statistics', 'scikit-learn', 'XGBoost'] },
    { id: 'insight-communication', roles: ['DS'], icon: 'fa-chart-column', title: 'Insight Communication', copy: 'Translate technical findings into clear metrics, limitations, explanations, and next-step recommendations.', tags: ['SHAP', 'Reporting', 'Storytelling'] },
    { id: 'cleaning-validation', roles: ['DA'], icon: 'fa-broom', title: 'Data Cleaning & Validation', copy: 'Resolve missing values, duplicates, inconsistent formats, and outliers while documenting assumptions.', tags: ['Pandas', 'Quality Checks', 'Documentation'] },
    { id: 'exploratory-analysis', roles: ['DA'], icon: 'fa-chart-pie', title: 'Exploratory Analysis', copy: 'Break down trends, segments, relationships, and exceptions around the business question that matters.', tags: ['EDA', 'Metrics', 'Segmentation'] },
    { id: 'reporting', roles: ['DA'], icon: 'fa-file-lines', title: 'Decision-Ready Reporting', copy: 'Present findings, limitations, and practical next steps in language stakeholders can act on.', tags: ['Reporting', 'Visual Story', 'Recommendations'] },
    { id: 'dataset-pipelines', roles: ['DE'], icon: 'fa-database', title: 'Dataset Preparation Pipelines', copy: 'Turn raw structured data into consistent, analysis-ready inputs with explicit transformations and checks.', tags: ['Python', 'Pandas', 'Validation'] },
    { id: 'schema-integration', roles: ['DE'], icon: 'fa-diagram-project', title: 'Schema & Integration Planning', copy: 'Map fields, relationships, formats, and interfaces so data can move cleanly into analytical or web workflows.', tags: ['Schema Design', 'SQL', 'Integration'] },
    { id: 'reproducible-data', roles: ['DE'], icon: 'fa-rotate', title: 'Reproducible ML Data Workflows', copy: 'Organise preparation and evaluation steps so downstream model experiments can be repeated and reviewed.', tags: ['Pipelines', 'Versioning', 'Documentation'] }
  ];

  const projects = [
    {
      id: 'river-flood', title: 'River Flood Protection', repo: 'River-Flood-Prediction', image: 'river_flood.jpg', roles: ['MAIN', 'AI', 'DE'], featured: true,
      details: {
        MAIN: { type: 'Computer Vision · Segmentation', copy: 'Turns satellite imagery into visual flood masks through a compact U-Net and a Flask review workflow.', challenge: 'Identify flooded river areas from satellite imagery.', approach: 'Train a compact U-Net and connect it to a Flask upload workflow.', outcome: 'Visual flood masks for faster image-by-image review.' },
        AI: { type: 'Computer Vision · Segmentation', copy: 'A compact U-Net workflow that turns satellite imagery into flood masks and serves review through Flask.' },
        DE: { type: 'Image Data · Processing Workflow', copy: 'Organises satellite inputs, segmentation processing, saved model artefacts, and a Flask review step.' }
      }
    },
    {
      id: 'shoplifting', title: 'Shoplifting Detection', repo: 'ShopLifting_Detection', image: 'shoplifting.png', roles: ['MAIN', 'AI'], featured: true,
      details: {
        MAIN: { type: 'Computer Vision · Video', copy: 'Validates compatible feature dimensions and runs a saved three-model ensemble.', challenge: 'Classify video-derived features without mixing incompatible extractors.', approach: 'Validate feature dimensions and run the saved three-model ensemble.', outcome: 'Tested feature-level inference; raw-video extraction remains incomplete.' },
        AI: { type: 'Computer Vision · Video', copy: 'Validated feature-level inference through a saved three-model ensemble, with raw-video extraction clearly scoped as future work.' }
      }
    },
    {
      id: 'portfolio', title: 'This Portfolio Website', repo: 'portfolio', image: 'portfolio.png', roles: ['MAIN'],
      details: { MAIN: { type: 'Web Development · UX', copy: 'A responsive, theme-aware portfolio with accessible interactions.', challenge: 'Present multidisciplinary AI work with clarity and personality.', approach: 'Build a responsive, theme-aware experience with accessible interactions.', outcome: 'A maintainable portfolio using HTML, CSS, and JavaScript.' } }
    },
    {
      id: 'uber-fare', title: 'Uber Fare Prediction', repo: 'Uber-Fare-Prediction', image: 'uber_fare.png', roles: ['MAIN', 'ML', 'DS', 'DA'],
      details: {
        MAIN: { type: 'ONNX · Express · React', copy: 'Real ONNX Runtime inference through a validated Express API.', challenge: 'Serve the saved fare model through a real, validated interface.', approach: 'Load ONNX Runtime in Express and connect a focused React form.', outcome: 'Verified model and API tests; historical estimates are not live ride quotes.' },
        ML: { type: 'Model Serving · ONNX', copy: 'Real ONNX Runtime inference through a validated Express API and a focused React interface.' },
        DS: { type: 'Regression · Mobility Data', copy: 'Explores trip attributes, prepares structured features, and evaluates fare predictions with regression metrics.' },
        DA: { type: 'Mobility Data · Regression Analysis', copy: 'Uses structured ride records to examine fare drivers, prepare clean features, and evaluate estimates.' }
      }
    },
    {
      id: 'heart-disease', title: 'Heart Disease Prediction', repo: 'yet_another_heart_disease_application', image: 'heart_disease.png', roles: ['MAIN', 'ML', 'DS', 'DA'], featured: true,
      details: {
        MAIN: { type: 'Reproducible ML · Django', copy: 'Multi-centre clinical data, model tuning, and SHAP explanations in an end-to-end application.', challenge: 'Preserve training and inference feature consistency.', approach: 'Train-only preprocessing, held-out evaluation and validated random-forest serving.', outcome: 'Measured retraining report and real model-loading tests; educational, not clinically validated.' },
        ML: { type: 'Reproducible ML · Healthcare', copy: 'Train-only preprocessing, held-out evaluation and real Django random-forest serving tests; educational only.' },
        DS: { type: 'Healthcare · Explainability', copy: 'Combines data from multiple centres and investigates generalisation with tuned, explainable models.' },
        DA: { type: 'Healthcare Data · Multi-centre Study', copy: 'Prepares and compares multi-centre clinical data while making model outcomes easier to interpret.' }
      }
    },
    {
      id: 'emoji', title: 'Emoji Prediction with DistilBERT', repo: 'Emoji_Recognition', image: 'emoji_predictor.png', roles: ['MAIN', 'AI'], featured: true,
      details: {
        MAIN: { type: 'NLP · Serving Contract', copy: 'Fine-tunes a transformer for short social text and serves it through Django.', challenge: 'Handle text, label mapping and unavailable artifacts reliably.', approach: 'Lazy local-only DistilBERT loading, validated probability outputs and Django error boundaries.', outcome: 'Tested contracts and failure cases; trained transformer weights are missing.' },
        AI: { type: 'NLP · Serving Contract', copy: 'Validated Django serving contract and local-only model loading; trained transformer weights are missing.' }
      }
    },
    {
      id: 'supermarket-etl', title: 'Supermarket Sales ETL', repo: 'DEPI_TASKS', icon: 'fa-database', artLabel: 'ETL', artTone: 'hotel', roles: ['MAIN', 'DE'],
      details: {
        MAIN: { type: 'Data Engineering · ETL', copy: 'A validated, repeatable ETL workflow with reject reporting.', challenge: 'Prevent malformed transactions from contaminating business totals.', approach: 'Validate, normalize, deduplicate, reconcile and retain reject reasons.', outcome: '959 accepted and 55 rejected rows from a verified 1,014-row run.' },
        DE: { type: 'Data Engineering · Validated ETL', copy: 'Schema validation, reject records, deduplication, financial reconciliation and repeatable clean CSV plus quality/business JSON outputs.' }
      }
    },
    {
      id: 'hotel-cancellation', title: 'Hotel Cancellation Prediction', repo: 'Hotel-Cancellation-Prediciton', icon: 'fa-hotel', artLabel: 'XGBoost', artTone: 'hotel', roles: ['MAIN', 'ML', 'DS', 'DA', 'DE'],
      details: {
        MAIN: { type: 'FastAPI · SQL · XGBoost', copy: 'Reusable training, FastAPI serving, relational lineage and migrations.', challenge: 'Trace predictions to validated inputs and model versions.', approach: 'Reusable training, FastAPI serving, relational lineage and migrations.', outcome: 'Real model/API/PostgreSQL tests and Docker Compose startup passed in CI; no public deployment claimed.' },
        ML: { type: 'ML Systems · Relational Lineage', copy: 'Reusable XGBoost training, FastAPI serving and Alembic lineage; actual PostgreSQL tests and Docker Compose startup passed in CI.' },
        DS: { type: 'Classification · Hospitality', copy: 'Studies reservation behaviour through cleaning, feature preparation, and binary classifier comparison.' },
        DA: { type: 'Hospitality Data · Classification', copy: 'Investigates reservation records, handles noisy values, and identifies patterns linked to cancellation.' },
        DE: { type: 'Data Modeling · Prediction Lineage', copy: 'Relational users, hotels, observations and model versions with constraints, indexes and migrations, verified against real PostgreSQL in CI.' }
      }
    },
    {
      id: 'rag-code', title: 'Retrieval-Augmented Code Generation', repo: 'RAG_Cellula_Week_3', icon: 'fa-code-branch', artLabel: 'RAG', artTone: 'rag', roles: ['MAIN', 'AI'],
      details: {
        MAIN: { type: 'NLP · Semantic Retrieval', copy: 'Reusable retrieval and generation boundaries with source-grounded prompts.', challenge: 'Separate retrieval quality from code-generation correctness.', approach: 'Reusable retriever/generator boundaries, source prompts and syntax validation.', outcome: 'Repeatable retrieval evaluation; tiny fixture scores are not generation benchmarks.' },
        AI: { type: 'AI · Retrieval Evaluation', copy: 'Reusable retrieval and generation boundaries with source-grounded prompts and a small repeatable retrieval evaluation.' }
      }
    },
    {
      id: 'heart-model', title: 'Heart Detection Model', repo: 'heart-detection-model', icon: 'fa-heart-pulse', roles: ['ML', 'DE'],
      details: {
        ML: { type: 'Reproducible ML · Native Export', copy: 'Fixed-seed training, train-only imputation, explicit feature schema, native XGBoost export and tested CLI inference.' },
        DE: { type: 'ML Data · Validation', copy: 'Train-only imputation, missingness reporting, explicit one-hot schema and isolated evaluation splits.' }
      }
    },
    {
      id: 'depi-tasks', title: 'DEPI Data Tasks', repo: 'DEPI_TASKS', icon: 'fa-book-open', roles: ['DS', 'DA'],
      details: {
        DS: { type: 'Applied Learning · Notebooks', copy: 'A public notebook collection showing continued practice with data preparation and applied analytical exercises.' },
        DA: { type: 'Applied Learning · Notebooks', copy: 'A public record of practical notebook exercises involving data handling, exploration, and analysis.' }
      }
    }
  ];

  const credentials = [
    { id: 'cellula-cv', roles: ['AI'], image: 'cellula_cv.png', title: 'Cellula Robotics · Computer Vision', type: 'Internship', copy: 'Completed practical training in computer-vision workflows and model development.' },
    { id: 'cellula-ml', roles: ['MAIN', 'ML', 'DS', 'DA', 'DE'], image: 'cellula_ml.png', title: 'Cellula Robotics · Machine Learning', type: 'Internship', copy: 'Completed practical training in machine-learning preparation, modelling, and evaluation.' },
    { id: 'cellula-nlp', roles: [], image: 'cellula_nlp.png', title: 'Cellula Robotics · NLP', type: 'Internship', copy: 'Worked with text preprocessing, embeddings, transformers, and NLP deployment workflows.' },
    { id: 'bue-ai', roles: ['MAIN', ...allRoles], image: 'BUE.jpeg', imageClass: 'credential-card-image--bue', title: 'Fundamentals & Applications in AI', type: 'Training', copy: 'Completed a 12-hour applied artificial-intelligence course at The British University in Egypt.' },
    { id: 'ecpc-qualification', roles: ['MAIN', ...allRoles], image: 'icpc.png', title: '25th in ECPC Qualification', type: 'Achievement', copy: 'Earned with my team through focused algorithmic problem-solving and preparation.' }
  ];

  const experiences = [
    { id: 'cellula', roles: ['MAIN', ...allRoles], icon: 'fa-robot', type: 'Industry internship', title: 'Cellula Robotics', copy: 'Completed practical training across Machine Learning, Computer Vision, and NLP.' },
    { id: 'independent', roles: ['MAIN', ...allRoles], icon: 'fa-laptop-code', type: 'Applied project work', title: 'Independent Projects', copy: 'Built public projects across healthcare, remote sensing, computer vision, NLP, analytics, and predictive modelling.' },
    { id: 'depi-soft-skills', roles: ['MAIN', ...allRoles], icon: 'fa-people-group', type: 'Professional training', title: 'DEPI Soft Skills Program', copy: 'Strengthened communication, collaboration, and professional readiness.' }
  ];

  const activity = {
    ecpc: [
      {
        chapter: 'Chapter one', title: 'My first ECPC', image: 'ECPC1.jpg', alt: 'Hassan with Adham El Behiry and Karim Ayman at ECPC',
        description: 'This was my first time participating in a major collegiate programming contest. ECPC 2024 was thrilling and a learning opportunity for all of us. It was a blast to work with Eng. Adham El Behiry and Eng. Karim Ayman.',
        teammates: [{ name: 'Adham El Behiry' }, { name: 'Karim Ayman' }]
      },
      {
        chapter: 'Chapter two', title: '25th in qualification', image: 'ECPC2.jpg', alt: 'Hassan with Mohammed Ossama and Yasin Moataz at ECPC qualification',
        description: 'Fueled by the momentum of our first contest, we returned with a sharper strategy and fiercer ambition. Securing 25th place in ECPC qualification was a testament to our preparation. Sharing this milestone with Eng. Mohammed Ossama and Eng. Yasin Moataz made it even more rewarding.',
        teammates: [{ name: 'Mohammed Ossama' }, { name: 'Yasin Moataz', linkedin: 'https://www.linkedin.com/in/yaseen-moataz-49b39b308/' }]
      },
      {
        chapter: 'Chapter three', title: 'A stronger return', image: 'ECPC3.jpeg', alt: 'Hassan with Fatma Abaza and Rahma Hussein at ECPC',
        description: 'From the previous year, I was ambitious to improve and aim higher. My team put in overwhelming effort and solved multiple problems. Special thanks to Eng. Fatma Abaza and Eng. Rahma Hussein for making this a truly special team.',
        teammates: [{ name: 'Fatma Abaza' }, { name: 'Rahma Hussein' }]
      },
      {
        chapter: 'Next contest', title: 'The next chapter', image: 'ecpc_logo.png', alt: 'Egyptian Collegiate Programming Contest logo',
        progressUrl: 'https://codeforces.com/profile/Hassan_G04',
        description: 'The next contest is another chance to learn, collaborate, and return sharper. Preparation continues.',
        teammates: []
      }
    ],
    depi: {
      title: 'DEPI Data Engineering', website: 'https://depi-tasks-pi.vercel.app/', image: 'depi.png',
      description: 'Follow my progress through the Data Engineering track, where I am building practical skills in Python, APIs, pandas, SQL, web scraping, Flask, and production-minded data engineering.',
      skills: ['Python', 'APIs', 'pandas', 'SQL', 'Flask'], start: '2026-08', end: '2026-12',
      instructor: { name: 'Eng. Mohamed Hamed', linkedin: 'https://www.linkedin.com/in/mohammed-hamed-b81064195/', message: 'A special thanks to Eng. Mohamed Hamed for the outstanding effort, guidance, and support he provided throughout the DEPI journey.' }
    },
    softSkills: {
      image: 'softskills.jpeg', website: 'https://depi.gov.eg/',
      instructor: {
        name: 'Hadeer Makhlouf',
        role: 'Head of Training · Octopus Outsourcing',
        image: 'hadeer-makhlouf.jpeg',
        linkedin: 'https://www.linkedin.com/in/hadeermakhlouf/',
        description: 'Learning & Development professional with more than seven years of experience designing people-focused learning experiences.'
      },
      copy: 'During my journey with DEPI, the Soft Skills course became an important part of my professional development. I was lucky to have Professor Hadeer Makhlouf as my instructor. She helped us improve and expand our skill sets.'
    }
  };

  const data = {
    shared,
    professions,
    services,
    projects,
    credentials,
    experiences,
    activity,
    main: {
      skills: ['Python', 'PyTorch', 'Keras', 'scikit-learn', 'XGBoost', 'OpenCV', 'Transformers', 'SHAP', 'Flask', 'Django', 'HTML / CSS / JS', 'Git']
    },
    forRole(collection, roleKey) {
      return collection.filter(item => item.roles?.includes(roleKey));
    },
    projectView(project, roleKey) {
      return { ...project, ...(project.details?.[roleKey] || project.details?.MAIN || {}) };
    }
  };

  window.PORTFOLIO_DATA = Object.freeze(data);
}());
