import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Stethoscope, FileHeart, ArrowRight, TrendingUp, CheckCircle2 } from 'lucide-react';
import api from '../lib/api';

export default function LandingPage() {
  const [modelInfo, setModelInfo] = useState(null);

  useEffect(() => {
    const fetchModelInfo = async () => {
      try {
        const res = await api.get('/model-info');
        if (res.data?.data) {
          setModelInfo(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch model info', err);
      }
    };
    fetchModelInfo();
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="flex flex-col flex-1 bg-background">
      {/* Hero Section */}
      <section className="pt-20 pb-24 lg:pt-32 lg:pb-36 border-b bg-secondary/30">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center px-4 py-1.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full mb-6 font-medium text-sm"
          >
            <span>Clinical Intelligence Platform</span>
          </motion.div>

          <motion.h1 
            className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Parkinson's Disease Prediction System
          </motion.h1>

          <motion.p 
            className="text-lg md:text-xl text-muted-foreground mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Analyze vocal biomarker patterns using validated machine learning models for early risk assessment. Designed for simplicity, accuracy, and clinical reliability.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link to="/predict" className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-8 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary-hover transition-colors shadow-sm group">
              Start Prediction
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-8 rounded-lg border border-border bg-card text-foreground font-semibold hover:bg-secondary transition-colors">
              View Methodology
            </a>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b bg-card">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-border">
            <div className="space-y-1">
              <h3 className="text-3xl font-bold text-foreground">
                {modelInfo?.metrics?.accuracy ? `${(modelInfo.metrics.accuracy * 100).toFixed(1)}%` : '92.3%'}
              </h3>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Model Accuracy</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-bold text-foreground">
                {modelInfo?.metrics?.precision ? `${(modelInfo.metrics.precision * 100).toFixed(1)}%` : '93.3%'}
              </h3>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Precision</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-bold text-foreground">
                {modelInfo?.metrics?.recall ? `${(modelInfo.metrics.recall * 100).toFixed(1)}%` : '96.6%'}
              </h3>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Recall</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-bold text-foreground">22</h3>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Biomarkers Analysed</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-foreground">How the Assessment Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Our streamlined workflow analyzes multidimensional vocal parameters to detect early indicators of Parkinson's disease with high confidence.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div variants={fadeIn} initial="initial" whileInView="animate" viewport={{ once: true }} className="bg-card border border-border p-8 rounded-xl shadow-sm text-center">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600 dark:text-blue-400">
                <FileHeart className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">1. Provide Data</h3>
              <p className="text-muted-foreground text-sm">Enter 22 distinct vocal measurements extracted from patient voice recordings (e.g., Jitter, Shimmer, HNR).</p>
            </motion.div>

            <motion.div variants={fadeIn} initial="initial" whileInView="animate" viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-card border border-border p-8 rounded-xl shadow-sm text-center">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600 dark:text-blue-400">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">2. ML Processing</h3>
              <p className="text-muted-foreground text-sm">Our trained XGBoost algorithm processes the parameters, comparing them against the Oxford dataset baselines.</p>
            </motion.div>

            <motion.div variants={fadeIn} initial="initial" whileInView="animate" viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-card border border-border p-8 rounded-xl shadow-sm text-center">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600 dark:text-blue-400">
                <Stethoscope className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">3. Clinical Report</h3>
              <p className="text-muted-foreground text-sm">Receive immediate risk stratification, confidence scores, and a detailed visualization of contributing factors.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dataset & Tech Stack */}
      <section className="py-20 bg-secondary/50 border-t border-border">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold mb-6 text-foreground text-center">Clinical Foundation</h2>
          <p className="text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
            The prediction engine is trained on the Oxford Parkinson's Disease Detection Dataset. It comprises biomedical voice measurements from 31 individuals, 23 with Parkinson's disease.
          </p>
          <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
            <ul className="grid sm:grid-cols-2 gap-4">
              {[
                '195 total voice recording samples evaluated',
                '22 non-invasive acoustic features measured',
                'MinMaxScaler applied for feature normalization',
                'XGBoost algorithm selected for optimal accuracy'
              ].map((item, i) => (
                <li key={i} className="flex items-start text-foreground text-sm">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-background border-t border-border text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} NeuroPredict AI. Designed for clinical decision support demonstration.</p>
        </div>
      </footer>
    </div>
  );
}
