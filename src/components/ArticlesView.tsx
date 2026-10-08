import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Clock, ChevronRight } from 'lucide-react';
import { ARTICLES } from '../data/mockData';

interface ArticlesViewProps {
  onBack: () => void;
}

export const ArticlesView: React.FC<ArticlesViewProps> = ({ onBack }) => {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  const selectedArticle = ARTICLES.find((a) => a.id === selectedArticleId);

  return (
    <div className="max-w-md mx-auto px-4 pt-3 pb-24 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            if (selectedArticleId) setSelectedArticleId(null);
            else onBack();
          }}
          className="p-2 -ml-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold text-slate-900">
          {selectedArticleId ? 'บทความ' : 'ความรู้ & บทความกายภาพ'}
        </h1>
        <div className="w-8" />
      </div>

      {selectedArticle ? (
        /* Article Details */
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] text-sky-600 font-semibold mb-1">
              <span>{selectedArticle.category}</span>
              <span>·</span>
              <span className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3 h-3" /> {selectedArticle.readTime}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 leading-snug">
              {selectedArticle.title}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {selectedArticle.subtitle}
            </p>
          </div>

          <div className="border-t border-slate-100 pt-4 text-xs text-slate-700 leading-relaxed whitespace-pre-line space-y-2">
            {selectedArticle.content}
          </div>

          <button
            onClick={() => setSelectedArticleId(null)}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            ← กลับไปรายการบทความ
          </button>
        </div>
      ) : (
        /* Article List */
        <div className="space-y-3">
          {ARTICLES.map((article) => (
            <div
              key={article.id}
              onClick={() => setSelectedArticleId(article.id)}
              className="bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl p-4 shadow-xs transition-all cursor-pointer group space-y-2"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 font-semibold">
                  {article.category}
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {article.readTime}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                  {article.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {article.subtitle}
                </p>
              </div>

              <div className="pt-1 flex items-center text-xs font-medium text-sky-600 group-hover:translate-x-0.5 transition-transform">
                <span>อ่านต่อ</span>
                <ChevronRight className="w-4 h-4 ml-0.5" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
