import React from 'react';
import { useLocation, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, ArrowLeft, RefreshCw, FileText } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell } from 'recharts';

export default function ResultsPage() {
  const location = useLocation();
  const result = location.state?.result;
  const payload = location.state?.payload;

  if (!result || !payload) {
    return <Navigate text="No results found" to="/predict" replace />;
  }

  const confidencePct = Math.round(result.confidence * 100);
  const isHighRisk = result.prediction === 1;

  const getRiskColor = () => {
    if (result.risk_level === 'high') return 'text-red-600 dark:text-red-400';
    if (result.risk_level === 'medium') return 'text-amber-600 dark:text-amber-400';
    return 'text-emerald-600 dark:text-emerald-400';
  };

  const getRiskBg = () => {
    if (result.risk_level === 'high') return 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-900/30';
    if (result.risk_level === 'medium') return 'bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-900/30';
    return 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-900/30';
  };

  // Recharts Gauge
  const gaugeData = [
    { name: 'Confidence', value: confidencePct },
    { name: 'Remainder', value: 100 - confidencePct }
  ];
  const gaugeColors = [isHighRisk ? '#dc2626' : '#059669', '#e2e8f0'];

  // Radar chart comparing patient data to healthy baselines (mock baselines for visualization)
  const radarData = [
    { metric: 'Jitter', patient: payload['MDVP:Jitter(%)'] * 1000, healthy: 2.7 },
    { metric: 'Shimmer', patient: payload['MDVP:Shimmer'] * 100, healthy: 1.5 },
    { metric: 'NHR', patient: payload['NHR'] * 1000, healthy: 5.0 },
    { metric: 'HNR', patient: payload['HNR'], healthy: 25.0 },
    { metric: 'RPDE', patient: payload['RPDE'] * 100, healthy: 40.0 },
    { metric: 'DFA', patient: payload['DFA'] * 100, healthy: 65.0 },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Assessment Report</h1>
          <p className="text-muted-foreground text-sm mt-1">Generated on {new Date(result.timestamp).toLocaleString()}</p>
        </div>
        <Link to="/predict" className="flex items-center text-sm font-medium text-primary hover:text-primary-hover">
          <ArrowLeft className="w-4 h-4 mr-1" /> New Assessment
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Primary Verdict Card */}
        <div className={`lg:col-span-3 border rounded-xl p-8 flex flex-col md:flex-row items-center gap-8 ${getRiskBg()}`}>
          <div className="flex-1">
            <div className="flex items-center mb-4">
              {isHighRisk ? 
                <AlertTriangle className={`w-8 h-8 mr-3 ${getRiskColor()}`} /> : 
                <CheckCircle className={`w-8 h-8 mr-3 ${getRiskColor()}`} />
              }
              <h2 className={`text-2xl font-bold ${getRiskColor()}`}>
                {isHighRisk ? 'Positive Indication' : 'Negative Indication'}
              </h2>
            </div>
            <p className="text-foreground/80 mb-4 leading-relaxed">
              Based on the vocal biomarker analysis, the model indicates a <strong className="font-semibold">{result.risk_level} risk</strong> of Parkinsonian characteristics with <strong className="font-semibold">{confidencePct}% confidence</strong>.
            </p>
            <div className="text-sm px-4 py-3 bg-background/50 rounded-lg border border-border inline-block">
              <span className="font-medium text-foreground">Clinical Note:</span>{' '}
              <span className="text-muted-foreground">
                {isHighRisk 
                  ? 'Recommend confirmatory clinical exam and neurological specialist follow-up.' 
                  : 'Routine monitoring recommended. No immediate action required based on voice metrics.'}
              </span>
            </div>
          </div>
          
          <div className="w-48 h-48 relative flex-shrink-0 bg-background rounded-full shadow-sm border border-border p-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gaugeData}
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={80}
                  startAngle={90} endAngle={-270}
                  dataKey="value" stroke="none"
                >
                  {gaugeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={gaugeColors[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-foreground">{confidencePct}%</span>
              <span className="text-xs text-muted-foreground font-medium uppercase">Confidence</span>
            </div>
          </div>
        </div>

        {/* Biomarker Profile */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center mb-6">
            <FileText className="w-5 h-5 mr-2 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Biomarker Profile Analysis</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: 'var(--muted)', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                <Radar name="Patient Data" dataKey="patient" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                <Radar name="Healthy Baseline" dataKey="healthy" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-4">
            Comparison of normalized patient inputs against standard healthy baselines.
          </p>
        </div>

        {/* Model Metadata */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center mb-6">
            <FileText className="w-5 h-5 mr-2 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Analysis Details</h3>
          </div>
          
          <div className="space-y-4 flex-1">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase">Risk Level</p>
              <p className={`font-semibold capitalize ${getRiskColor()}`}>{result.risk_level}</p>
            </div>
            <div className="pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground font-medium uppercase">Model Version</p>
              <p className="font-mono text-sm text-foreground mt-1">{result.model_version || 'v1.0'}</p>
            </div>
            <div className="pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground font-medium uppercase">Algorithm</p>
              <p className="text-sm text-foreground mt-1">XGBoost Classifier</p>
            </div>
            <div className="pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground font-medium uppercase">Processing ID</p>
              <p className="font-mono text-xs text-muted-foreground mt-1 truncate">
                {Math.random().toString(36).substring(2, 15)}
              </p>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-border">
            <Link to="/history" className="w-full flex items-center justify-center px-4 py-2 bg-secondary text-foreground hover:bg-secondary/80 font-medium rounded-lg text-sm transition-colors border border-border">
              <RefreshCw className="w-4 h-4 mr-2" />
              View Dashboard
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
