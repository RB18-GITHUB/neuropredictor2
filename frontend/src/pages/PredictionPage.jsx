import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ChevronRight, FileText, Database, CheckCircle2 } from 'lucide-react';
import api, { authService } from '../lib/api';

const SAMPLE_DATA = [
  {
    name: "Patient A (High Risk - ~97%)",
    payload: {
      "MDVP:Fo(Hz)": 150.258, "MDVP:Fhi(Hz)": 154.609, "MDVP:Flo(Hz)": 75.349,
      "MDVP:Jitter(%)": 0.00248, "MDVP:Jitter(Abs)": 0.00002, "MDVP:RAP": 0.00105,
      "MDVP:PPQ": 0.00136, "Jitter:DDP": 0.00315, "MDVP:Shimmer": 0.01131,
      "MDVP:Shimmer(dB)": 0.107, "Shimmer:APQ3": 0.00522, "Shimmer:APQ5": 0.00659,
      "MDVP:APQ": 0.01009, "Shimmer:DDA": 0.01567, "NHR": 0.00495, "HNR": 26.759,
      "RPDE": 0.296888, "DFA": 0.722356, "spread1": -6.878393, "spread2": 0.089267,
      "D2": 2.004055, "PPE": 0.113942
    }
  },
  {
    name: "Patient B (High Risk - ~84%)",
    payload: {
      "MDVP:Fo(Hz)": 197.569, "MDVP:Fhi(Hz)": 217.627, "MDVP:Flo(Hz)": 90.794,
      "MDVP:Jitter(%)": 0.00803, "MDVP:Jitter(Abs)": 0.00004, "MDVP:RAP": 0.0049,
      "MDVP:PPQ": 0.00448, "Jitter:DDP": 0.0147, "MDVP:Shimmer": 0.02177,
      "MDVP:Shimmer(dB)": 0.189, "Shimmer:APQ3": 0.01279, "Shimmer:APQ5": 0.01272,
      "MDVP:APQ": 0.01439, "Shimmer:DDA": 0.03836, "NHR": 0.01337, "HNR": 19.269,
      "RPDE": 0.372222, "DFA": 0.725216, "spread1": -5.736781, "spread2": 0.164529,
      "D2": 2.88245, "PPE": 0.202879
    }
  },
  {
    name: "Patient C (Low Risk - Healthy Baseline)",
    payload: {
      "MDVP:Fo(Hz)": 236.200, "MDVP:Fhi(Hz)": 244.663, "MDVP:Flo(Hz)": 102.137,
      "MDVP:Jitter(%)": 0.00277, "MDVP:Jitter(Abs)": 0.00001, "MDVP:RAP": 0.00154,
      "MDVP:PPQ": 0.00153, "Jitter:DDP": 0.00462, "MDVP:Shimmer": 0.02448,
      "MDVP:Shimmer(dB)": 0.217, "Shimmer:APQ3": 0.01410, "Shimmer:APQ5": 0.01426,
      "MDVP:APQ": 0.01621, "Shimmer:DDA": 0.04231, "NHR": 0.00620, "HNR": 24.078,
      "RPDE": 0.469928, "DFA": 0.628232, "spread1": -6.816086, "spread2": 0.172270,
      "D2": 2.235197, "PPE": 0.119652
    }
  }
];

const METRICS_GROUPS = [
  {
    title: 'Fundamental Frequency (Vocal Fold Vibration)',
    icon: FileText,
    fields: [
      { id: 'MDVP:Fo(Hz)', label: 'Average Fo', desc: 'Average vocal fundamental frequency' },
      { id: 'MDVP:Fhi(Hz)', label: 'Maximum Fo', desc: 'Maximum vocal fundamental frequency' },
      { id: 'MDVP:Flo(Hz)', label: 'Minimum Fo', desc: 'Minimum vocal fundamental frequency' },
    ]
  },
  {
    title: 'Frequency Variation (Jitter)',
    icon: FileText,
    fields: [
      { id: 'MDVP:Jitter(%)', label: 'Jitter (%)', desc: 'Percentage of cycle-to-cycle frequency variation' },
      { id: 'MDVP:Jitter(Abs)', label: 'Jitter (Abs)', desc: 'Absolute cycle-to-cycle frequency variation' },
      { id: 'MDVP:RAP', label: 'RAP', desc: 'Relative amplitude perturbation' },
      { id: 'MDVP:PPQ', label: 'PPQ', desc: 'Five-point period perturbation quotient' },
      { id: 'Jitter:DDP', label: 'DDP', desc: 'Average absolute difference of differences between jitter cycles' },
    ]
  },
  {
    title: 'Amplitude Variation (Shimmer)',
    icon: FileText,
    fields: [
      { id: 'MDVP:Shimmer', label: 'Shimmer', desc: 'Local amplitude variation' },
      { id: 'MDVP:Shimmer(dB)', label: 'Shimmer (dB)', desc: 'Local amplitude variation in decibels' },
      { id: 'Shimmer:APQ3', label: 'APQ3', desc: 'Three-point amplitude perturbation quotient' },
      { id: 'Shimmer:APQ5', label: 'APQ5', desc: 'Five-point amplitude perturbation quotient' },
      { id: 'MDVP:APQ', label: 'APQ', desc: '11-point amplitude perturbation quotient' },
      { id: 'Shimmer:DDA', label: 'DDA', desc: 'Average absolute difference between consecutive shimmer amplitudes' },
    ]
  },
  {
    title: 'Noise & Nonlinear Measures',
    icon: FileText,
    fields: [
      { id: 'NHR', label: 'NHR', desc: 'Noise-to-harmonics ratio' },
      { id: 'HNR', label: 'HNR', desc: 'Harmonics-to-noise ratio' },
      { id: 'RPDE', label: 'RPDE', desc: 'Recurrence period density entropy (dynamical complexity)' },
      { id: 'DFA', label: 'DFA', desc: 'Detrended fluctuation analysis (signal fractal scaling)' },
      { id: 'spread1', label: 'Spread 1', desc: 'Nonlinear measure of fundamental frequency variation' },
      { id: 'spread2', label: 'Spread 2', desc: 'Nonlinear measure of fundamental frequency variation' },
      { id: 'D2', label: 'D2', desc: 'Correlation dimension (vocal tract complexity)' },
      { id: 'PPE', label: 'PPE', desc: 'Pitch period entropy' },
    ]
  }
];

export default function PredictionPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSelectSample = (e) => {
    const selected = SAMPLE_DATA.find(s => s.name === e.target.value);
    if (selected) {
      setFormData(selected.payload);
      setError(null);
    } else {
      setFormData({});
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) || '' });
    if (error) setError(null);
  };

  const handleNext = () => {
    const currentFields = METRICS_GROUPS[step].fields;
    const isComplete = currentFields.every(f => formData[f.id] !== undefined && formData[f.id] !== '');
    if (!isComplete) {
      setError("Please fill in all fields for this section.");
      return;
    }
    setError(null);
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    const isComplete = METRICS_GROUPS[3].fields.every(f => formData[f.id] !== undefined && formData[f.id] !== '');
    if (!isComplete) {
      setError("Please complete all required measurements.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const isAuthenticated = await authService.ensureAuthenticated();
      if (!isAuthenticated) throw new Error("Authentication failed");

      const res = await api.post('/predict', formData);
      if (res.data?.status === 'success') {
        setTimeout(() => {
          navigate('/results', { state: { result: res.data.data, payload: formData } });
        }, 1500);
      } else {
        throw new Error(res.data?.message || 'Prediction failed');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "An error occurred");
      setLoading(false);
    }
  };

  const CurrentIcon = METRICS_GROUPS[step].icon;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Clinical Assessment</h1>
        <p className="text-muted-foreground text-sm">Enter vocal biomarker measurements for risk stratification.</p>
      </div>

      <div className="bg-card border border-border shadow-sm rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold flex items-center text-foreground">
            <Database className="w-4 h-4 mr-2 text-primary" />
            Patient Data Profile
          </h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Select a pre-configured patient profile or enter laboratory measurements manually below.</p>
        <select 
          onChange={handleSelectSample}
          className="w-full bg-secondary/50 border border-border text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 outline-none transition-colors"
          defaultValue=""
        >
          <option value="" disabled>-- Select a sample patient --</option>
          {SAMPLE_DATA.map(sample => (
            <option key={sample.name} value={sample.name}>{sample.name}</option>
          ))}
        </select>
      </div>

      <div className="bg-card border border-border shadow-sm rounded-xl overflow-hidden">
        {/* Progress Bar */}
        <div className="flex border-b border-border bg-secondary/30">
          {METRICS_GROUPS.map((group, i) => (
            <div 
              key={i}
              className={`flex-1 p-3 text-center text-xs font-semibold uppercase tracking-wider transition-colors
                ${step === i ? 'text-primary border-b-2 border-primary bg-card' : 
                  step > i ? 'text-foreground/70 cursor-pointer hover:bg-secondary' : 'text-muted-foreground'}`}
              onClick={() => step > i && setStep(i)}
            >
              Step {i + 1}
            </div>
          ))}
        </div>

        <div className="p-6 md:p-8">
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg flex items-center border border-red-100 dark:border-red-900/30 text-sm">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <div className="flex items-center mb-6 text-foreground">
            <CurrentIcon className="w-6 h-6 mr-3 text-primary" />
            <h2 className="text-xl font-semibold">{METRICS_GROUPS[step].title}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <AnimatePresence mode="wait">
              {METRICS_GROUPS[step].fields.map((field) => (
                <motion.div 
                  key={field.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-1.5"
                >
                  <label className="text-sm font-medium text-foreground block">
                    {field.label}
                  </label>
                  <input
                    type="number"
                    step="any"
                    name={field.id}
                    value={formData[field.id] || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/50 text-sm"
                    placeholder="0.00"
                  />
                  <p className="text-[11px] text-muted-foreground">{field.desc}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-border">
            <button
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0 || loading}
              className={`px-5 py-2 text-sm font-medium rounded-lg transition-colors ${step === 0 ? 'opacity-0 pointer-events-none' : 'text-muted-foreground hover:bg-secondary'}`}
            >
              Back
            </button>
            
            {step < METRICS_GROUPS.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center px-6 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary-hover transition-colors shadow-sm"
              >
                Continue
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`flex items-center px-8 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary-hover transition-all shadow-sm ${loading ? 'opacity-90 cursor-wait' : ''}`}
              >
                {loading ? (
                  <>
                    <motion.div 
                      animate={{ rotate: 360 }} 
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full mr-2"
                    />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Process Assessment
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
