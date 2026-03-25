import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { Search, Database, ExternalLink, Download, Star, Filter, Info, Heart, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { cn } from '../utils/cn';

interface Dataset {
  id: string;
  author: string;
  lastModified: string;
  likes: number;
  downloads: number;
  tags: string[];
  description?: string;
}

export function KnowledgeHub({ user }: { user: any }) {
  const [searchTerm, setSearchTerm] = useState('elderly');
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDatasets = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://huggingface.co/api/datasets?search=${encodeURIComponent(query)}&limit=12&full=true`);
      if (!response.ok) throw new Error('Failed to fetch datasets from Hugging Face');
      const data = await response.json();
      setDatasets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasets(searchTerm);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDatasets(searchTerm);
  };

  return (
    <Layout userRole={user.role}>
      <div className="space-y-12">
        {/* Editorial Header */}
        <div className="max-w-3xl space-y-6">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-sage-accent block"
          >
            Data & Insights
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl font-serif font-bold text-slate-primary leading-tight"
          >
            Knowledge Hub
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-stone-500 font-sans leading-relaxed"
          >
            Explore research, datasets, and insights from the global community via Hugging Face to better understand and serve our elderly population.
          </motion.p>
        </div>

        {/* Featured Project Integration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-10 bg-slate-primary text-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <Heart size={160} />
            </div>
            
            <div className="relative z-10 space-y-8 max-w-2xl">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-terracotta">Featured School Project</span>
                <h2 className="text-4xl font-serif font-bold leading-tight">AI Companion & Emotional Support</h2>
                <p className="text-lg text-linen-bg/60 leading-relaxed">
                  A specialized BiEncoder model based on RoBERTa that classifies empathy levels in mental health support conversations. Integrated as a <span className="text-white font-bold">Companion Tool</span> for our community.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/empathy-lab"
                  className="px-8 py-4 bg-terracotta text-white rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-terracotta/90 transition-all active:scale-95 flex items-center gap-2"
                >
                  Open Companion Lab <ArrowRight size={16} />
                </Link>
                <a 
                  href="https://huggingface.co/RyanDDD/empathy-mental-health-reddit-ER"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-white/10 text-white rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-white/20 transition-all active:scale-95 flex items-center gap-2"
                >
                  Model Card <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <form onSubmit={handleSearch} className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search datasets (e.g., elderly, healthcare, aging)..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sage-accent/20 focus:border-sage-accent transition-all font-sans text-lg"
            />
          </form>
          <button 
            type="submit"
            onClick={handleSearch}
            className="px-8 py-4 bg-slate-primary text-white rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-slate-primary/90 transition-all active:scale-95 whitespace-nowrap"
          >
            Search Hub
          </button>
        </div>

        {/* Dataset Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-stone-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : error ? (
          <div className="p-12 bg-rose-50 border border-rose-100 rounded-2xl text-center space-y-4">
            <Info className="mx-auto text-rose-500" size={48} />
            <p className="text-rose-600 font-medium">{error}</p>
            <button onClick={() => fetchDatasets(searchTerm)} className="text-rose-700 underline font-bold">Try again</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {datasets.map((dataset, i) => (
              <motion.div
                key={dataset.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="h-full flex flex-col group hover:border-sage-accent transition-colors">
                  <div className="p-8 flex-1 space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 bg-sage-accent/10 text-sage-accent rounded-xl flex items-center justify-center group-hover:bg-sage-accent group-hover:text-white transition-colors">
                        <Database size={24} />
                      </div>
                      <div className="flex gap-4 text-stone-400 text-xs font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-1"><Star size={14} /> {dataset.likes}</span>
                        <span className="flex items-center gap-1"><Download size={14} /> {dataset.downloads}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-xl font-serif font-bold text-slate-primary line-clamp-2 leading-tight">
                        {dataset.id.split('/').pop()?.replace(/-/g, ' ')}
                      </h3>
                      <p className="text-sm text-stone-500 font-sans">
                        by <span className="text-sage-accent font-medium">{dataset.author}</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {dataset.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-3 py-1 bg-stone-100 text-stone-500 text-[10px] font-bold uppercase tracking-wider rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="px-8 py-6 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs text-stone-400 font-medium italic">
                      Updated {new Date(dataset.lastModified).toLocaleDateString()}
                    </span>
                    <a 
                      href={`https://huggingface.co/datasets/${dataset.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sage-accent hover:text-slate-primary transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-widest"
                    >
                      View <ExternalLink size={14} />
                    </a>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Footer Note */}
        <div className="p-12 bg-slate-primary text-linen-bg rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <h2 className="text-3xl font-serif font-bold">Contribute to the Hub</h2>
            <p className="text-linen-bg/60 leading-relaxed">
              Found a relevant dataset or research paper? Share it with our community to help improve care standards globally.
            </p>
          </div>
          <button className="px-10 py-5 bg-white text-slate-primary rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-linen-bg transition-all active:scale-95">
            Submit Resource
          </button>
        </div>
      </div>
    </Layout>
  );
}
