import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Calendar, ChevronRight, Search, FileText } from 'lucide-react';
import api from '../lib/api';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/prediction-history');
        if (res.data?.data) {
          setHistory(res.data.data.reverse()); // latest first
        }
      } catch (err) {
        console.error('Failed to fetch history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clinical Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Review historical assessment records and trends.</p>
        </div>
        <Link 
          to="/predict" 
          className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary-hover transition-colors shadow-sm text-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Assessment
        </Link>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-secondary/30 flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search records..." 
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
            <div className="w-8 h-8 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin mb-4" />
            Loading historical data...
          </div>
        ) : history.length === 0 ? (
          <div className="p-16 text-center text-muted-foreground flex flex-col items-center">
            <FileText className="w-12 h-12 mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-medium text-foreground mb-1">No assessments found</h3>
            <p className="text-sm mb-6">Run your first prediction to see it listed here.</p>
            <Link to="/predict" className="text-primary hover:underline text-sm font-medium">Get started &rarr;</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-secondary/20 text-muted-foreground font-medium border-b border-border">
                <tr>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Risk Level</th>
                  <th className="px-6 py-4">Confidence</th>
                  <th className="px-6 py-4">Model Version</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {history.map((record, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={record.id} 
                    className="hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-foreground flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                      {new Date(record.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize
                        ${record.risk_level === 'high' ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 
                          record.risk_level === 'medium' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' : 
                          'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'}
                      `}>
                        {record.risk_level}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">
                      {Math.round(record.confidence * 100)}%
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-mono text-xs">
                      {record.model_version || 'v1.0'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-primary hover:text-primary-hover font-medium inline-flex items-center">
                        Details <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
