(() => {
  const shared = {
    cv: 'https://drive.google.com/drive/folders/1PpwyqrEFpiQ_cHfw4pXXlBEPmE6P9rpv?usp=sharing',
    linkedin: 'https://www.linkedin.com/in/hassan-gebrill-98a08a299/',
    github: 'https://github.com/HassanG04'
  };

  const roles = {
    AI: {
      label: 'AI Engineer',
      short: 'AI',
      eyebrow: 'Applied intelligence · end-to-end delivery',
      headline: 'AI systems that connect models, interfaces, and real workflows.',
      description: 'I help teams move from an AI idea to a working prototype by combining computer vision, NLP, model evaluation, and Python web delivery.',
      promise: 'Best suited to teams exploring an intelligent product, automating a visual or text-heavy workflow, or turning a trained model into something people can test.',
      skills: ['Python', 'PyTorch', 'Computer Vision', 'Transformers', 'OpenCV', 'Flask', 'Django', 'Model Evaluation'],
      services: [
        { icon: 'fa-eye', title: 'Computer Vision Systems', copy: 'Image classification, semantic segmentation, and video understanding prototypes built around a defined operational problem.', tags: ['OpenCV', 'PyTorch', 'Keras'] },
        { icon: 'fa-language', title: 'NLP & LLM Prototypes', copy: 'Text classification, transformer fine-tuning, semantic retrieval, and retrieval-augmented experiments.', tags: ['Transformers', 'DistilBERT', 'FAISS'] },
        { icon: 'fa-window-maximize', title: 'AI Application Delivery', copy: 'Responsive Flask and Django interfaces that turn model inference into a clear, demonstrable workflow.', tags: ['Flask', 'Django', 'JavaScript'] }
      ],
      projects: [
        { type: 'Computer Vision · Segmentation', title: 'River Flood Protection', copy: 'A compact U-Net workflow that turns satellite imagery into flood masks and serves review through Flask.', repo: 'River-Flood-Prediction', image: 'river_flood.jpg' },
        { type: 'Computer Vision · Video', title: 'Shoplifting Detection', copy: 'An end-to-end prototype for classifying suspicious activity in CCTV frame sequences and serving results through a web app.', repo: 'ShopLifting_Detection', image: 'shoplifting.png' },
        { type: 'NLP · Transformers', title: 'Emoji Prediction with DistilBERT', copy: 'A transformer-based classifier for short social text, compared with a classical baseline and delivered through Django.', repo: 'Emoji_Recognition', image: 'emoji_predictor.png' },
        { type: 'NLP · Semantic Retrieval', title: 'Retrieval-Augmented Code Generation', copy: 'A notebook pipeline that retrieves similar programming examples with MiniLM and FAISS before guiding generation.', repo: 'RAG_Cellula_Week_3', icon: 'fa-code-branch' }
      ]
    },
    ML: {
      label: 'Machine Learning Engineer',
      short: 'ML',
      eyebrow: 'Predictive modelling · evaluation · delivery',
      headline: 'Predictive systems built to be tested, explained, and used.',
      description: 'I build supervised machine-learning workflows from data preparation and feature engineering through model comparison, explainability, and application integration.',
      promise: 'Best suited to teams with structured data, a measurable prediction target, and a need for a reproducible model that stakeholders can understand.',
      skills: ['Python', 'scikit-learn', 'XGBoost', 'Optuna', 'SHAP', 'Data Validation', 'Flask', 'Django'],
      services: [
        { icon: 'fa-chart-line', title: 'Predictive Modelling', copy: 'Classification and regression workflows covering preparation, feature engineering, training, tuning, and held-out evaluation.', tags: ['scikit-learn', 'XGBoost', 'Optuna'] },
        { icon: 'fa-magnifying-glass-chart', title: 'Evaluation & Explainability', copy: 'Metric selection, leakage checks, model comparison, error analysis, and clear feature-level explanations.', tags: ['SHAP', 'Cross-validation', 'AUC'] },
        { icon: 'fa-gears', title: 'Model Application Integration', copy: 'Package trained models into focused Flask or Django experiences that support testing and stakeholder review.', tags: ['Flask', 'Django', 'Python'] }
      ],
      projects: [
        { type: 'Explainable ML · Healthcare', title: 'Heart Disease Prediction', copy: 'A multi-centre modelling workflow using imputation, tuning, stacking, and SHAP to support explainable predictions.', repo: 'yet_another_heart_disease_application', image: 'heart_disease.png' },
        { type: 'Regression · XGBoost', title: 'Uber Fare Prediction', copy: 'A structured regression project that prepares ride data, evaluates XGBoost, and delivers estimates through Django.', repo: 'Uber-Fare-Prediction', image: 'uber_fare.png' },
        { type: 'Classification · XGBoost', title: 'Hotel Cancellation Prediction', copy: 'A practical classification workflow for noisy reservation data, including cleaning, comparison, and web-ready inference.', repo: 'Hotel-Cancellation-Prediciton', icon: 'fa-hotel' },
        { type: 'Model Comparison · Healthcare', title: 'Heart Detection Model', copy: 'An earlier modelling study comparing heart-disease classifiers and documenting the XGBoost approach.', repo: 'heart-detection-model', icon: 'fa-heart-pulse' }
      ]
    },
    DS: {
      label: 'Data Scientist',
      short: 'DS',
      eyebrow: 'Data exploration · modelling · evidence',
      headline: 'Data science that turns messy questions into measurable evidence.',
      description: 'I explore, prepare, and model data to clarify patterns, compare approaches, and communicate results through reproducible notebooks and usable applications.',
      promise: 'Best suited to teams that need to understand a dataset, test a predictive idea, and translate model results into a decision-ready story.',
      skills: ['Python', 'Pandas', 'Exploratory Analysis', 'Feature Engineering', 'Statistics', 'scikit-learn', 'XGBoost', 'SHAP'],
      services: [
        { icon: 'fa-filter-circle-dollar', title: 'Exploration & Data Quality', copy: 'Profile datasets, identify missingness and outliers, validate assumptions, and prepare analysis-ready features.', tags: ['Pandas', 'EDA', 'Validation'] },
        { icon: 'fa-flask-vial', title: 'Predictive Experiments', copy: 'Frame measurable hypotheses, compare baseline and tuned models, and evaluate results on held-out data.', tags: ['Statistics', 'scikit-learn', 'XGBoost'] },
        { icon: 'fa-chart-column', title: 'Insight Communication', copy: 'Translate technical findings into clear metrics, limitations, explanations, and next-step recommendations.', tags: ['SHAP', 'Reporting', 'Storytelling'] }
      ],
      projects: [
        { type: 'Regression · Mobility Data', title: 'Uber Fare Prediction', copy: 'Explores trip attributes, prepares structured features, and evaluates fare predictions with regression metrics.', repo: 'Uber-Fare-Prediction', image: 'uber_fare.png' },
        { type: 'Healthcare · Explainability', title: 'Heart Disease Prediction', copy: 'Combines data from multiple centres and investigates generalisation with tuned, explainable models.', repo: 'yet_another_heart_disease_application', image: 'heart_disease.png' },
        { type: 'Classification · Hospitality', title: 'Hotel Cancellation Prediction', copy: 'Studies reservation behaviour through cleaning, feature preparation, and binary classifier comparison.', repo: 'Hotel-Cancellation-Prediciton', icon: 'fa-hotel' },
        { type: 'Applied Learning · Notebooks', title: 'DEPI Data Tasks', copy: 'A public notebook collection showing continued practice with data preparation and applied analytical exercises.', repo: 'DEPI_TASKS', icon: 'fa-book-open' }
      ]
    },
    DA: {
      label: 'Data Analyst',
      short: 'DA',
      eyebrow: 'Data quality · patterns · communication',
      headline: 'Clear analysis for teams that need to understand what the data is saying.',
      description: 'I clean and explore structured datasets, identify useful patterns, define meaningful measures, and communicate findings without burying the decision in technical detail.',
      promise: 'Best suited to teams with operational data that needs cleaning, investigation, comparison, and a concise explanation of what matters next.',
      skills: ['Python', 'Pandas', 'Data Cleaning', 'Exploratory Analysis', 'SQL Foundations', 'Data Validation', 'Metrics', 'Reporting'],
      services: [
        { icon: 'fa-broom', title: 'Data Cleaning & Validation', copy: 'Resolve missing values, duplicates, inconsistent formats, and outliers while documenting assumptions.', tags: ['Pandas', 'Quality Checks', 'Documentation'] },
        { icon: 'fa-chart-pie', title: 'Exploratory Analysis', copy: 'Break down trends, segments, relationships, and exceptions around the business question that matters.', tags: ['EDA', 'Metrics', 'Segmentation'] },
        { icon: 'fa-file-lines', title: 'Decision-Ready Reporting', copy: 'Present findings, limitations, and practical next steps in language stakeholders can act on.', tags: ['Reporting', 'Visual Story', 'Recommendations'] }
      ],
      projects: [
        { type: 'Mobility Data · Regression Analysis', title: 'Uber Fare Prediction', copy: 'Uses structured ride records to examine fare drivers, prepare clean features, and evaluate estimates.', repo: 'Uber-Fare-Prediction', image: 'uber_fare.png' },
        { type: 'Hospitality Data · Classification', title: 'Hotel Cancellation Prediction', copy: 'Investigates reservation records, handles noisy values, and identifies patterns linked to cancellation.', repo: 'Hotel-Cancellation-Prediciton', icon: 'fa-hotel' },
        { type: 'Healthcare Data · Multi-centre Study', title: 'Heart Disease Prediction', copy: 'Prepares and compares multi-centre clinical data while making model outcomes easier to interpret.', repo: 'yet_another_heart_disease_application', image: 'heart_disease.png' },
        { type: 'Applied Learning · Notebooks', title: 'DEPI Data Tasks', copy: 'A public record of practical notebook exercises involving data handling, exploration, and analysis.', repo: 'DEPI_TASKS', icon: 'fa-table' }
      ]
    },
    DE: {
      label: 'Data Engineer',
      short: 'DE',
      eyebrow: 'Reliable inputs · reproducible workflows · delivery',
      headline: 'Cleaner, repeatable data workflows that make downstream work dependable.',
      description: 'I bring a machine-learning perspective to data engineering: validating inputs, shaping reusable preparation steps, and keeping the path from raw data to application understandable.',
      promise: 'Best suited to early-stage teams that need disciplined dataset preparation, validation, schema thinking, and reproducible handoff for analytics or machine learning.',
      skills: ['Python', 'Pandas', 'Data Validation', 'Schema Planning', 'SQL Foundations', 'Reproducibility', 'Pipeline Design', 'Documentation'],
      services: [
        { icon: 'fa-database', title: 'Dataset Preparation Pipelines', copy: 'Turn raw structured data into consistent, analysis-ready inputs with explicit transformations and checks.', tags: ['Python', 'Pandas', 'Validation'] },
        { icon: 'fa-diagram-project', title: 'Schema & Integration Planning', copy: 'Map fields, relationships, formats, and interfaces so data can move cleanly into analytical or web workflows.', tags: ['Schema Design', 'SQL', 'Integration'] },
        { icon: 'fa-rotate', title: 'Reproducible ML Data Workflows', copy: 'Organise preparation and evaluation steps so downstream model experiments can be repeated and reviewed.', tags: ['Pipelines', 'Versioning', 'Documentation'] }
      ],
      projects: [
        { type: 'Structured Data · Preparation', title: 'Hotel Cancellation Prediction', copy: 'Demonstrates cleaning, outlier handling, feature preparation, and a repeatable path from reservations to inference.', repo: 'Hotel-Cancellation-Prediciton', icon: 'fa-hotel' },
        { type: 'Structured Data · Model Delivery', title: 'Uber Fare Prediction', copy: 'Shows the flow from raw trip records through prepared features to a Django-based prediction interface.', repo: 'Uber-Fare-Prediction', image: 'uber_fare.png' },
        { type: 'Image Data · Processing Workflow', title: 'River Flood Protection', copy: 'Organises satellite inputs, segmentation processing, saved model artefacts, and a Flask review step.', repo: 'River-Flood-Prediction', image: 'river_flood.jpg' },
        { type: 'Applied Learning · Notebooks', title: 'DEPI Data Tasks', copy: 'A public collection of notebook exercises that demonstrates consistent data handling and documented practice.', repo: 'DEPI_TASKS', icon: 'fa-folder-tree' }
      ]
    }
  };

  const roleKey = document.body.dataset.role;
  const role = roles[roleKey];
  const root = document.getElementById('rolePageRoot');
  if (!role || !root) return;
  const roleDescriptor = roleKey === 'AI' ? 'AI engineer' : role.label.toLowerCase();
  const contactRole = roleKey === 'AI' ? 'an AI engineer' : `a ${role.label.toLowerCase()}`;

  const serviceMarkup = role.services.map((service, index) => `
    <article class="role-service-card reveal delay-${(index % 3) + 1}">
      <div class="role-card-icon"><i class="fas ${service.icon}" aria-hidden="true"></i></div>
      <h3>${service.title}</h3>
      <p>${service.copy}</p>
      <div class="role-chip-row">${service.tags.map(tag => `<span>${tag}</span>`).join('')}</div>
    </article>`).join('');

  const projectMarkup = role.projects.map((project, index) => {
    const media = project.image
      ? `<img src="../images/${project.image}" alt="${project.title} project preview" loading="lazy" />`
      : `<div class="role-project-art" aria-hidden="true"><i class="fas ${project.icon}"></i><span>${role.short}</span></div>`;
    return `
      <a class="role-project-link reveal delay-${(index % 3) + 1}" href="https://github.com/HassanG04/${project.repo}" target="_blank" rel="noopener" aria-label="View ${project.title} on GitHub">
        <article class="role-project-card">
          <div class="role-project-media">${media}</div>
          <div class="role-project-body">
            <span>${project.type}</span>
            <h3>${project.title}</h3>
            <p>${project.copy}</p>
            <strong><i class="fab fa-github" aria-hidden="true"></i> Open public repository <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i></strong>
          </div>
        </article>
      </a>`;
  }).join('');

  root.innerHTML = `
    <header class="role-hero one-page-section" id="overview" data-scroll-label="Overview">
      <div class="container">
        <div class="role-hero-grid">
          <div class="role-hero-copy reveal-left">
            <span class="role-eyebrow">${role.eyebrow}</span>
            <h1><span>Hassan Gebril</span>${role.label}</h1>
            <p class="role-hero-lead">${role.headline}</p>
            <p>${role.description}</p>
            <div class="hero-actions">
              <a href="#accomplishments" class="btn btn-primary">View relevant work <i class="fas fa-arrow-right ms-2" aria-hidden="true"></i></a>
              <a href="${shared.cv}" target="_blank" rel="noopener" class="btn btn-cv"><i class="fas fa-file-alt" aria-hidden="true"></i> View CV</a>
            </div>
          </div>
          <div class="role-portrait-card reveal-right">
            <div class="role-portrait-aura" aria-hidden="true"></div>
            <img src="../images/profile.jpg" alt="Hassan Gebril — ${role.label}" />
            <div class="role-portrait-caption"><span>Available for opportunities</span><strong>${role.label}</strong><small>Alexandria, Egypt · Remote-ready</small></div>
          </div>
        </div>
      </div>
    </header>

    <section class="section-wrap one-page-section role-about-section" id="about" data-scroll-label="About">
      <div class="container">
        <div class="section-anchor-heading reveal">
          <span class="section-tag">About</span>
          <h2 class="section-heading">An AI foundation shaped for ${roleDescriptor} work.</h2>
          <p>I combine technical curiosity, disciplined problem-solving, and a focus on making each result useful to the people who need it.</p>
        </div>
        <div class="role-about-grid">
          <article class="role-about-card reveal-left">
            <div class="role-about-photo"><img src="../images/profile.jpg" alt="Hassan Gebril" loading="lazy" /></div>
            <div>
              <span class="role-about-kicker">My story</span>
              <h3>From AI study to practical delivery</h3>
              <p>I’m Hassan Gebril, an Artificial Intelligence student at AASTMT on the Data Science track. My experience spans applied machine learning projects, an NLP internship at Cellula Robotics, and competitive problem-solving through ECPC.</p>
              <p>${role.description} I care about clear assumptions, measurable evaluation, and a handoff that another person can understand.</p>
            </div>
          </article>
          <aside class="role-about-profile reveal-right" aria-label="Education and experience highlights">
            <span class="section-tag">At a glance</span>
            <ul>
              <li><i class="fas fa-graduation-cap" aria-hidden="true"></i><span><strong>B.Sc. Artificial Intelligence</strong>Data Science Track · AASTMT</span></li>
              <li><i class="fas fa-briefcase" aria-hidden="true"></i><span><strong>NLP Intern</strong>Cellula Robotics</span></li>
              <li><i class="fas fa-location-dot" aria-hidden="true"></i><span><strong>Alexandria, Egypt</strong>Available for remote collaboration</span></li>
            </ul>
          </aside>
        </div>
        <div class="role-fit-card reveal">
          <div><span class="section-tag">Where I add value</span><h2>${role.promise}</h2></div>
          <div class="role-skill-cloud" aria-label="Relevant skills">${role.skills.map(skill => `<span>${skill}</span>`).join('')}</div>
        </div>
      </div>
    </section>

    <section class="section-wrap one-page-section" id="services" data-scroll-label="Services">
      <div class="container">
        <div class="section-anchor-heading reveal">
          <span class="section-tag">${role.label} services</span>
          <h2 class="section-heading">How I can help</h2>
          <p>Focused services matched to this role, with scope and tools made explicit.</p>
        </div>
        <div class="role-service-grid">${serviceMarkup}</div>
      </div>
    </section>

    <section id="activity" class="section-wrap one-page-section" data-scroll-label="Activity">
      <div class="container activity-main">
        <div class="section-anchor-heading reveal">
          <span class="section-tag">Teamwork &amp; growth</span>
          <h2 class="section-heading">Activity</h2>
          <p>Three ECPC experiences, the next chapter ahead, and one DEPI learning experience that shaped how I solve problems and work with people.</p>
        </div>

        <div class="activity-intro reveal">
          <div><span class="section-tag">The journey so far</span><h2>ECPC taught me more than algorithms.</h2></div>
          <p>Every contest brought a new team, a tougher challenge, and a better version of me. Use the arrows or numbered controls to move between chapters, and click a photo to meet the team.</p>
        </div>

        <section class="ecpc-showcase reveal delay-1" aria-labelledby="ecpc-heading">
          <div class="ecpc-showcase-head">
            <div><span class="ecpc-kicker"><i class="fas fa-code" aria-hidden="true"></i> ECPC Journey</span><h2 id="ecpc-heading">Built by teamwork.</h2></div>
            <div class="ecpc-brand-emblem"><img class="ecpc-brand-mark" src="../images/ecpc_logo.png" alt="Egyptian Collegiate Programming Contest" loading="lazy" /></div>
          </div>

          <div class="ecpc-body">
            <div id="ecpcDeck" class="ecpc-deck" role="region" aria-roledescription="carousel" aria-label="Hassan's ECPC experiences" tabindex="0">
              <div class="ecpc-deck-stage">
                <div class="ecpc-slider-track" aria-live="polite">
                  <article class="ecpc-slide is-active" data-ecpc-slide="0" aria-label="First ECPC experience" aria-hidden="false">
                    <div class="flip-card ecpc-deck-card" data-flip-card>
                      <div class="flip-card-inner">
                        <div class="flip-card-face flip-card-front flip-card-media ecpc-card-front">
                          <img class="flip-card-image" src="../images/ECPC1.jpg" alt="Hassan with Adham El Behiry and Karim Ayman at ECPC" loading="lazy" />
                          <button class="flip-card-hit-area" type="button" data-flip-toggle aria-expanded="false" aria-label="Meet the team from Hassan's first ECPC"></button>
                          <span class="ecpc-photo-number">01 / 04</span>
                          <span class="flip-card-prompt" aria-hidden="true"><i class="fas fa-users" aria-hidden="true"></i><span>Meet the team</span></span>
                        </div>
                        <div class="flip-card-face flip-card-back ecpc-card-back" aria-hidden="true" inert>
                          <span class="ecpc-contacts-label"><i class="fab fa-linkedin-in" aria-hidden="true"></i> Meet the Team!</span>
                          <div class="ecpc-contact-cards">
                            <div class="contact-card"><img class="contact-avatar contact-avatar--photo" src="../images/hadeer-makhlouf.jpeg" alt="" loading="lazy" /><span class="contact-name">Eng. Adham El Behiry</span><span class="contact-desc">No description</span></div>
                            <div class="contact-card"><img class="contact-avatar contact-avatar--photo" src="../images/hadeer-makhlouf.jpeg" alt="" loading="lazy" /><span class="contact-name">Eng. Karim Ayman</span><span class="contact-desc">No description</span></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="ecpc-slide-caption"><span class="ecpc-chapter">Chapter one</span><h3>My first ECPC</h3><p>This was my first time participating in a major collegiate programming contest. ECPC 2024 was thrilling and a learning opportunity for all of us. It was a blast to work with Eng. Adham El Behiry and Eng. Karim Ayman.</p></div>
                  </article>

                  <article class="ecpc-slide" data-ecpc-slide="1" aria-label="Second ECPC experience" aria-hidden="true" inert>
                    <div class="flip-card ecpc-deck-card" data-flip-card>
                      <div class="flip-card-inner">
                        <div class="flip-card-face flip-card-front flip-card-media ecpc-card-front">
                          <img class="flip-card-image" src="../images/ECPC2.jpg" alt="Hassan with Mohammed Ossama and Yasin Moataz at ECPC" loading="lazy" />
                          <button class="flip-card-hit-area" type="button" data-flip-toggle aria-expanded="false" aria-label="Meet the team from Hassan's second ECPC"></button>
                          <span class="ecpc-photo-number">02 / 04</span>
                          <span class="flip-card-prompt" aria-hidden="true"><i class="fas fa-users" aria-hidden="true"></i><span>Meet the team</span></span>
                        </div>
                        <div class="flip-card-face flip-card-back ecpc-card-back" aria-hidden="true" inert>
                          <span class="ecpc-contacts-label"><i class="fab fa-linkedin-in" aria-hidden="true"></i> Meet the Team!</span>
                          <div class="ecpc-contact-cards">
                            <div class="contact-card"><img class="contact-avatar contact-avatar--photo" src="../images/hadeer-makhlouf.jpeg" alt="" loading="lazy" /><span class="contact-name">Eng. Mohammed Ossama</span><span class="contact-desc">No description</span></div>
                            <a class="contact-card is-linked" href="https://www.linkedin.com/in/yaseen-moataz-49b39b308/" target="_blank" rel="noopener" aria-label="Open Eng. Yasin Moataz's LinkedIn profile"><img class="contact-avatar contact-avatar--photo" src="../images/hadeer-makhlouf.jpeg" alt="" loading="lazy" /><span class="contact-name">Eng. Yasin Moataz</span><span class="contact-desc">No description</span></a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="ecpc-slide-caption"><span class="ecpc-chapter">Chapter two</span><h3>25th position in ECPC</h3><p>Fueled by the momentum of our first contest, we returned with a sharper strategy and fiercer ambition. My team and I achieved 25th position in the ECPC qualification round—a result that reflected our relentless preparation. Sharing this milestone with Eng. Mohammed Ossama and Eng. Yasin Moataz made the achievement even more rewarding.</p></div>
                  </article>

                  <article class="ecpc-slide" data-ecpc-slide="2" aria-label="Third ECPC experience" aria-hidden="true" inert>
                    <div class="flip-card ecpc-deck-card" data-flip-card>
                      <div class="flip-card-inner">
                        <div class="flip-card-face flip-card-front flip-card-media ecpc-card-front">
                          <img class="flip-card-image" src="../images/ECPC3.jpeg" alt="Hassan with Fatma Abaza and Rahma Hussein at ECPC" loading="lazy" />
                          <button class="flip-card-hit-area" type="button" data-flip-toggle aria-expanded="false" aria-label="Meet the team from Hassan's third ECPC"></button>
                          <span class="ecpc-photo-number">03 / 04</span>
                          <span class="flip-card-prompt" aria-hidden="true"><i class="fas fa-users" aria-hidden="true"></i><span>Meet the team</span></span>
                        </div>
                        <div class="flip-card-face flip-card-back ecpc-card-back" aria-hidden="true" inert>
                          <span class="ecpc-contacts-label"><i class="fab fa-linkedin-in" aria-hidden="true"></i> Meet the Team!</span>
                          <div class="ecpc-contact-cards">
                            <div class="contact-card"><img class="contact-avatar contact-avatar--photo" src="../images/hadeer-makhlouf.jpeg" alt="" loading="lazy" /><span class="contact-name">Eng. Fatma Abaza</span><span class="contact-desc">No description</span></div>
                            <div class="contact-card"><img class="contact-avatar contact-avatar--photo" src="../images/hadeer-makhlouf.jpeg" alt="" loading="lazy" /><span class="contact-name">Eng. Rahma Hussein</span><span class="contact-desc">No description</span></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="ecpc-slide-caption"><span class="ecpc-chapter">Chapter three</span><h3>Returning with ambition</h3><p>From last year, I was ambitious to improve and reach a higher ranking. My team put in an overwhelming effort and solved multiple problems. Special thanks to Eng. Fatma Abaza and Eng. Rahma Hussein—their effort made this a truly special team.</p></div>
                  </article>

                  <article class="ecpc-slide ecpc-future-slide" data-ecpc-slide="3" aria-label="Next ECPC chapter" aria-hidden="true" inert>
                    <div class="ecpc-deck-card ecpc-future-card">
                      <div class="ecpc-future-aura" aria-hidden="true"></div>
                      <img src="../images/ecpc_logo.png" alt="" loading="lazy" />
                      <span class="ecpc-photo-number">04 / 04</span>
                      <h3>Next Contest?</h3><p>The next ECPC chapter is waiting to be written.</p>
                    </div>
                    <div class="ecpc-slide-caption"><span class="ecpc-chapter">Chapter four</span><h3>Next Contest?</h3><p>Preparation continues. This space will be updated when the next contest journey begins.</p></div>
                  </article>
                </div>

                <div class="ecpc-deck-controls">
                  <button class="ecpc-deck-arrow" id="ecpcPrev" type="button" aria-label="Previous ECPC story"><i class="fas fa-arrow-left" aria-hidden="true"></i></button>
                  <button class="ecpc-deck-arrow" id="ecpcNext" type="button" aria-label="Next ECPC story"><i class="fas fa-arrow-right" aria-hidden="true"></i></button>
                </div>
              </div>

              <div class="ecpc-deck-indicators" aria-label="Choose an ECPC chapter">
                <button type="button" class="is-active" data-ecpc-index="0" aria-current="true" aria-label="Show ECPC chapter 1">1</button>
                <button type="button" data-ecpc-index="1" aria-label="Show ECPC chapter 2">2</button>
                <button type="button" data-ecpc-index="2" aria-label="Show ECPC chapter 3">3</button>
                <button type="button" data-ecpc-index="3" aria-label="Show ECPC chapter 4">4</button>
              </div>
            </div>
          </div>
        </section>

        <section class="soft-skills-section reveal" aria-labelledby="soft-skills-heading">
          <div class="soft-skills-flip flip-card" id="softSkillsFlip" data-flip-card>
            <div class="soft-skills-flip-inner flip-card-inner">
              <div class="soft-skills-photo soft-skills-face flip-card-face flip-card-front flip-card-media">
                <img class="flip-card-image" src="../images/softskills.jpeg" alt="Hassan with his DEPI soft skills class" loading="lazy" />
                <button class="flip-card-hit-area" type="button" data-flip-toggle aria-expanded="false" aria-label="Meet Hassan's soft skills instructor"></button>
                <span class="flip-card-prompt" aria-hidden="true"><i class="fas fa-chalkboard-user" aria-hidden="true"></i><span>Meet the instructor</span></span>
                <a class="soft-skills-book-tag" id="softSkillsBookTag" href="https://depi.gov.eg/" target="_blank" rel="noopener" aria-label="Visit the DEPI website"><span>DEPI Community</span><i class="fas fa-people-group" aria-hidden="true"></i></a>
              </div>
              <div class="soft-skills-back soft-skills-face flip-card-face flip-card-back" aria-hidden="true" inert>
                <span class="linkedin-id-label"><i class="fab fa-linkedin-in" aria-hidden="true"></i> Meet the instructor</span>
                <a class="linkedin-id-card" href="https://www.linkedin.com/in/hadeermakhlouf/" target="_blank" rel="noopener" aria-label="Open Hadeer Makhlouf's LinkedIn profile">
                  <img class="contact-avatar contact-avatar--lg contact-avatar--photo" src="../images/hadeer-makhlouf.jpeg" alt="Hadeer Makhlouf" loading="lazy" />
                  <span class="linkedin-id-content"><strong>Hadeer Makhlouf</strong><small>Head of Training &middot; Octopus Outsourcing</small><span>Learning &amp; Development professional with more than seven years of experience designing people-focused learning experiences.</span><span class="linkedin-id-link"><i class="fab fa-linkedin-in" aria-hidden="true"></i> View LinkedIn profile</span></span>
                </a>
              </div>
            </div>
          </div>
          <div class="soft-skills-copy">
            <span class="section-tag">Beyond technical skills</span>
            <h2 id="soft-skills-heading">Soft Skills</h2>
            <p>During my journey with <a href="https://www.linkedin.com/company/digital-egypt-pioneers-initiative-depi/" target="_blank" rel="noopener">DEPI</a>, the Soft Skills course became an important part of my professional development.</p>
            <p>I was lucky to have <a href="https://www.linkedin.com/in/hadeermakhlouf/" target="_blank" rel="noopener">Professor Hadeer Makhlouf</a> as my instructor. She helped us improve and expand our skill sets.</p>
          </div>
        </section>

        <section class="activity-more reveal" aria-labelledby="activity-more-heading">
          <span class="activity-more-icon" aria-hidden="true"><i class="fas fa-person-digging"></i></span>
          <div><span class="section-tag">More to come</span><h2 id="activity-more-heading">More under construction</h2><p>New activities, collaborations, and learning milestones will be added here.</p></div>
        </section>
      </div>
    </section>

    <section class="section-wrap one-page-section role-work-section" id="accomplishments" data-scroll-label="Accomplishments">
      <div class="container">
        <div class="section-anchor-heading reveal">
          <span class="section-tag">Credentials and public evidence</span>
          <h2 class="section-heading">Accomplishments</h2>
          <p>Training, competition experience, and public projects that support this professional focus.</p>
        </div>
        <div class="row g-4 role-credential-grid">
          <div class="col-md-4 reveal delay-1">
            <article class="credential-card">
              <button class="certificate-preview-trigger" type="button" data-certificate-preview data-certificate-src="../images/cellula_nlp.png" data-certificate-title="Cellula Robotics · NLP" data-certificate-alt="Cellula Robotics NLP internship certificate" aria-label="Inspect the Cellula Robotics NLP internship certificate">
                <img src="../images/cellula_nlp.png" alt="Cellula Robotics NLP internship certificate" loading="lazy" />
                <span class="certificate-preview-cue"><i class="fas fa-magnifying-glass-plus" aria-hidden="true"></i> Inspect certificate</span>
              </button>
              <div><span>Internship</span><h3>Cellula Robotics · NLP</h3><p>Hands-on work with text preprocessing, embeddings, transformers, and NLP deployment workflows.</p></div>
            </article>
          </div>
          <div class="col-md-4 reveal delay-2">
            <article class="credential-card">
              <button class="certificate-preview-trigger" type="button" data-certificate-preview data-certificate-src="../images/icpc.png" data-certificate-title="25th in ECPC Qualification" data-certificate-alt="ECPC qualification achievement certificate" aria-label="Inspect the ECPC qualification achievement certificate">
                <img src="../images/icpc.png" alt="ECPC qualification achievement" loading="lazy" />
                <span class="certificate-preview-cue"><i class="fas fa-magnifying-glass-plus" aria-hidden="true"></i> Inspect certificate</span>
              </button>
              <div><span>Achievement</span><h3>25th in ECPC Qualification</h3><p>Earned with my team through focused algorithmic problem-solving and preparation.</p></div>
            </article>
          </div>
          <div class="col-md-4 reveal delay-3">
            <article class="credential-card">
              <button class="certificate-preview-trigger" type="button" data-certificate-preview data-certificate-src="../images/BUE.jpeg" data-certificate-title="Fundamentals &amp; Applications in AI" data-certificate-alt="British University in Egypt AI certificate" aria-label="Inspect the British University in Egypt AI certificate">
                <img class="credential-card-image--bue" src="../images/BUE.jpeg" alt="British University in Egypt AI certificate" loading="lazy" />
                <span class="certificate-preview-cue"><i class="fas fa-magnifying-glass-plus" aria-hidden="true"></i> Inspect certificate</span>
              </button>
              <div><span>Training</span><h3>Fundamentals &amp; Applications in AI</h3><p>A 12-hour applied artificial-intelligence course completed through The British University in Egypt.</p></div>
            </article>
          </div>
        </div>
        <div class="role-project-heading reveal"><span class="section-tag">Selected public evidence</span><h3>Relevant previous work</h3><p>Only public GitHub repositories that support this professional focus are shown here.</p></div>
        <div class="role-project-grid">${projectMarkup}</div>
      </div>
    </section>

    <section class="section-wrap one-page-section" id="contact" data-scroll-label="Contact">
      <div class="container">
        <div class="role-contact-card reveal">
          <div><span class="section-tag">Start a conversation</span><h2>Need ${contactRole} for your next project?</h2><p>Share the problem, available data, and outcome you need. I’ll help define a practical next step.</p></div>
          <div class="role-contact-actions">
            <a class="btn btn-primary" href="${shared.linkedin}" target="_blank" rel="noopener"><i class="fab fa-linkedin-in" aria-hidden="true"></i> Contact on LinkedIn</a>
            <a class="btn btn-glass" href="${shared.github}" target="_blank" rel="noopener"><i class="fab fa-github" aria-hidden="true"></i> GitHub profile</a>
          </div>
        </div>
      </div>
    </section>

    <dialog class="certificate-viewer" id="certificateViewer" aria-labelledby="certificateViewerTitle">
      <div class="certificate-viewer-panel">
        <div class="certificate-viewer-head">
          <div><span>Certificate preview</span><h2 id="certificateViewerTitle">Certificate</h2></div>
          <button class="certificate-viewer-close" id="certificateViewerClose" type="button" aria-label="Close certificate preview"><i class="fas fa-xmark" aria-hidden="true"></i></button>
        </div>
        <div class="certificate-viewer-media"><img id="certificateViewerImage" alt="" /></div>
      </div>
    </dialog>`;

  document.querySelectorAll('[data-role-label]').forEach(element => { element.textContent = role.label; });
})();
