"use client";

import React, { useEffect, useState } from 'react'
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { Bot, Plus, ListChecks, Trophy, Zap, TrendingUp } from "lucide-react";
import AddNewInterview from './_components/AddNewInterview'
import InterviewList from './_components/InterviewList'

function Dashboard() {
  const { user } = useUser();
  const [interviewData, setInterviewData] = useState([]);
  const [isNewInterviewModalOpen, setIsNewInterviewModalOpen] = useState(false);
  const [statsCards, setStatsCards] = useState([
    { icon: <ListChecks size={32} className="text-indigo-400" />, title: "Total Interviews", value: "0" },
    { icon: <Trophy size={32} className="text-green-400" />, title: "Best Score", value: "N/A" },
    { icon: <TrendingUp size={32} className="text-blue-400" />, title: "Improvement Rate", value: "0%" }
  ]);

  const fetchInterviews = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;
    try {
      const response = await fetch('/api/fetchUserData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: user.primaryEmailAddress.emailAddress })
      });
      if (!response.ok) throw new Error('Failed to fetch interview data');
      const data = await response.json();
      const userSpecificInterviews = data.userAnswers.filter(
        interview => interview.userEmail === user.primaryEmailAddress.emailAddress
      );
      setInterviewData(userSpecificInterviews);
      const totalInterviews = userSpecificInterviews.length;
      const bestScore = totalInterviews > 0
        ? Math.max(...userSpecificInterviews.map(item => parseInt(item.rating || '0'))) : 0;
      const improvementRate = calculateImprovementRate(userSpecificInterviews);
      setStatsCards([
        { icon: <ListChecks size={32} className="text-indigo-400" />, title: "Total Interviews", value: totalInterviews.toString() },
        { icon: <Trophy size={32} className="text-green-400" />, title: "Best Score", value: bestScore ? `${bestScore}/10` : 'N/A' },
        { icon: <TrendingUp size={32} className="text-blue-400" />, title: "Improvement Rate", value: `${improvementRate}%` }
      ]);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch interviews');
    }
  };

  const calculateImprovementRate = (interviews) => {
    if (interviews.length <= 1) return 0;
    const scores = interviews.map(i => parseInt(i.rating || '0')).sort((a, b) => a - b);
    return Math.round(((scores[scores.length - 1] - scores[0]) / scores[0]) * 100);
  };

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) fetchInterviews();
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 flex items-center gap-3">
            <Bot className="text-indigo-400" size={32} />
            Dashboard
          </h2>
          <h3 className="text-lg sm:text-xl text-gray-400 mt-2">
            Welcome, {user?.firstName || 'Interviewer'}
          </h3>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-500 text-sm sm:text-base">
            {user?.primaryEmailAddress?.emailAddress || 'Not logged in'}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {statsCards.map((card) => (
          <div key={card.title} className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center border border-gray-700">
            {card.icon}
            <div className="ml-4">
              <p className="text-xs sm:text-sm text-gray-400">{card.title}</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-100">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Interview Section */}
      <div className="bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-700">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 space-y-4 sm:space-y-0">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-100 flex items-center gap-3">
            <Zap size={24} className="text-yellow-400" />
            Create AI Mock Interview
          </h2>
          <button
            onClick={() => setIsNewInterviewModalOpen(true)}
            className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            New Interview
          </button>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
          <AddNewInterview isOpen={isNewInterviewModalOpen} onClose={() => setIsNewInterviewModalOpen(false)} />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-100 mb-6">Interview History</h2>
        <InterviewList interviews={interviewData} />
      </div>
    </div>
  );
}

export default Dashboard;