
import { ResumeData, FormattingSettings, TemplateType } from './types';

export const DEFAULT_SETTINGS: FormattingSettings = {
  marginTop: 12,
  marginRight: 15,
  marginBottom: 12,
  marginLeft: 15,
  lineHeight: 1.4,
  sectionSpacing: 5,
  template: TemplateType.ADMIN_CLASSICAL,
  font: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  backgroundColor: '#FFFFFF',
  accentColor: '#000000'
};

export const AVAILABLE_FONTS = [
  { name: 'Default (Sans)', value: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' },
  { name: 'Serif (Times)', value: 'Times New Roman, Times, serif' },
  { name: 'Serif (Georgia)', value: 'Georgia, Cambria, "Times New Roman", Times, serif' },
  { name: 'Sans (Arial)', value: 'Arial, Helvetica, sans-serif' },
  { name: 'Mono (Courier)', value: '"Courier New", Courier, monospace' }
];

export const INITIAL_RESUME_DATA: ResumeData = {
  profile: {
    fullName: "Alex Chen",
    phone: "+1 (555) 123-4567",
    email: "alex.chen@example.com",
    linkedin: "linkedin.com/in/alexchen-ml",
    github: "github.com/alexchen-ml",
    leetcode: "leetcode.com/alexchen",
    location: "San Francisco, CA",
    website: "alexchen.dev"
  },
  education: [
    {
      id: '1',
      degree: "Master of Science in Computer Science (AI Specialization)",
      institution: "Stanford University",
      year: "2021 - 2023",
      grade: "GPA: 3.9/4.0"
    },
    {
      id: '2',
      degree: "Bachelor of Science in Computer Engineering",
      institution: "University of California, Berkeley",
      year: "2017 - 2021",
      grade: "GPA: 3.8/4.0"
    }
  ],
  experience: [
    {
      id: '1',
      company: "Neural Tech",
      role: "Machine Learning Engineer",
      duration: "June 2023 - Present",
      location: "San Francisco, CA",
      description: [
        "Designed and deployed <b>Transformer-based NLP models</b> for customer sentiment analysis, improving classification accuracy by <b>15%</b>.",
        "Optimized inference latency of large language models (LLMs) by <b>40%</b> using quantization and TensorRT.",
        "Built an end-to-end MLOps pipeline using MLflow and Kubernetes for automated model retraining and deployment."
      ]
    },
    {
      id: '2',
      company: "DataCorp Intern",
      role: "Data Science Intern",
      duration: "May 2022 - Aug 2022",
      location: "Remote",
      description: [
        "Developed a computer vision system for defect detection in manufacturing using <b>PyTorch</b> and OpenCV.",
        "Analyzed 2TB+ of sensor data to predict equipment failure, reducing downtime by <b>10%</b>.",
        "Collaborated with cross-functional teams to integrate the predictive model into the company's dashboard."
      ]
    }
  ],
  skills: [
    { id: '1', name: "Languages", items: "Python, C++, SQL, Java, Bash" },
    { id: '2', name: "Machine Learning", items: "PyTorch, TensorFlow, Scikit-Learn, Hugging Face Transformers, XGBoost" },
    { id: '3', name: "Deep Learning", items: "CNNs, RNNs, LSTMs, GANs, BERT, GPT, Vision Transformers" },
    { id: '4', name: "MLOps & Tools", items: "Docker, Kubernetes, MLflow, Airflow, AWS (SageMaker, EC2, S3), Git" },
    { id: '5', name: "Data Engineering", items: "Spark, Kafka, Pandas, NumPy, PostgreSQL, MongoDB" }
  ],
  projects: [
    {
      id: '1',
      title: "Generative AI Art Assistant",
      githubLink: "github.com/alexchen-ml/gen-art",
      description: [
        "Built a web application allowing users to generate art from text prompts using Stable Diffusion.",
        "Fine-tuned the model on a custom dataset of architectural sketches to improve domain-specific performance.",
        "Deployed the model backend using FastAPI and React for the frontend interface."
      ]
    },
    {
      id: '2',
      title: "Real-time Traffic Prediction",
      githubLink: "github.com/alexchen-ml/traffic-pred",
      description: [
        "Developed a graph neural network (GNN) to predict traffic flow in real-time using sensor data.",
        "Achieved a Mean Absolute Error (MAE) of 5.2, outperforming baseline statistical models by 20%.",
        "Visualized predictions on an interactive map using Mapbox GL JS."
      ]
    }
  ],
  achievements: [
    { id: '1', description: "Published paper on 'Efficient Transformer Architectures' at NeurIPS 2023 Workshop." },
    { id: '2', description: "Winner of the 2022 Kaggle 'Global Wheat Detection' competition (Top 1%)." },
    { id: '3', description: "Recipient of the Stanford Graduate Fellowship." }
  ],
  settings: DEFAULT_SETTINGS
};

export const EMPTY_RESUME_DATA: ResumeData = {
  profile: {
    fullName: "",
    phone: "",
    email: "",
    linkedin: "",
    github: "",
    leetcode: "",
    website: "",
    location: ""
  },
  education: [],
  experience: [],
  skills: [],
  projects: [],
  achievements: [],
  settings: DEFAULT_SETTINGS
};
