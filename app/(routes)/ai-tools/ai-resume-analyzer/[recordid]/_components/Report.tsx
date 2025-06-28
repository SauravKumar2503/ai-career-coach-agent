
import React from "react";

type SectionScore = {
  score: number;
  comment?: string;
};

type ReportData = {
  overall_score: number;
  overall_feedback: string;
  summary_comment: string;
  sections: {
    contact_info?: SectionScore;
    experience?: SectionScore;
    education?: SectionScore;
    skills?: SectionScore;
  };
  tips_for_improvement?: string[];
  whats_good?: string[];
  ["needs-improvement"]?: string[];
};

type ReportProps = {
  data: ReportData | null;
};



const getScoreColor = (score: number) => {
  if (score >= 85) return "bg-green-100 text-green-700";
  if (score >= 60) return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
};

const getBarColor = (score: number) => {
  if (score >= 85) return "bg-green-500";
  if (score >= 60) return "bg-yellow-500";
  return "bg-red-500";
};

const Report: React.FC<ReportProps> = ({ data }) => {
  if (!data) return <p className="text-gray-500">No report data available.</p>;

  return (
    <div className="p-6 rounded-2xl border bg-white shadow-xl h-[85vh] overflow-y-auto">
      <h1 className="text-2xl font-extrabold text-gray-800 mb-4">📄 AI Resume Analysis</h1>

      

      {/* Overall Score */}
      <div className="mb-6 p-4 border rounded-xl bg-gray-50">
        <h2 className="text-xl font-bold mb-2 text-gray-700">Overall Score</h2>

        {/* Score and Badge */}
        <div className="flex items-center justify-between">
          <p className="text-4xl font-extrabold text-blue-600">{data.overall_score}/100</p>
          <span
            className={`text-sm px-3 py-1 rounded-full font-semibold ${getScoreColor(
              data.overall_score
            )}`}
          >
            {data.overall_feedback}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${getBarColor(data.overall_score)}`}
              style={{ width: `${data.overall_score}%` }}
            ></div>
          </div>
        </div>

        {/* Summary */}
        <p className="text-sm text-gray-500 italic mt-2">{data.summary_comment}</p>
      </div>

      {/* Section Breakdown */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">📊 Section Breakdown</h3>
        <div className="grid grid-cols-1 gap-4">
          {Object.entries(data.sections).map(([key, section]) =>
            section ? (
              <div
                key={key}
                className="border rounded-xl p-4 bg-white shadow-md transition-all"
              >
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-semibold text-gray-800 capitalize">
                    {key.replace("_", " ")}
                  </h4>
                  <span
                    className={`text-sm px-3 py-1 rounded-full font-medium ${getScoreColor(
                      section.score
                    )}`}
                  >
                    {section.score}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full transition-all duration-500 ${getBarColor(
                      section.score
                    )}`}
                    style={{ width: `${section.score}%` }}
                  ></div>
                </div>

                {section.comment && (
                  <p className="text-sm mt-2 text-gray-600">{section.comment}</p>
                )}
              </div>
            ) : null
          )}
        </div>
      </div>

      {/* Tips for Improvement */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">💡 Tips for Improvement</h3>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          {data.tips_for_improvement?.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </div>

      {/* What's Good */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">✅ What’s Good</h3>
        <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
          {data.whats_good?.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      </div>

      {/* Needs Improvement */}
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">🚫 Needs Improvement</h3>
        <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
          {data["needs-improvement"]?.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      </div>

      
    </div>
  );
};

export default Report;
