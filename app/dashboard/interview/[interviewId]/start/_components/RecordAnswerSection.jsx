"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState, useRef } from "react";
import { Mic, StopCircle, Loader2, Camera, CameraOff } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/utils/GeminiAIModal";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";

const RecordAnswerSection = ({ 
  mockInterviewQuestion, 
  activeQuestionIndex, 
  interviewData, 
  onAnswerSave,
}) => {
  const [userAnswer, setUserAnswer] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const recognitionRef = useRef(null);
  const webcamRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    // Speech recognition setup
    if (typeof window !== "undefined" && 'webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      const recognition = recognitionRef.current;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          }
        }
        if (finalTranscript.trim()) {
          setUserAnswer(prev => (prev + ' ' + finalTranscript).trim());
        }
      };
      recognition.onerror = (event) => {
        toast.error(`Speech recognition error: ${event.error}`);
        setIsRecording(false);
      };
      recognition.onend = () => {
        setIsRecording(false);
      };
    }

    // Auto-enable webcam
    EnableWebcam();

    // Cleanup on unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Attach stream to video element whenever webcamEnabled changes
  useEffect(() => {
    if (webcamEnabled && streamRef.current && webcamRef.current) {
      webcamRef.current.srcObject = streamRef.current;
    }
  }, [webcamEnabled]);

  const EnableWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      setWebcamEnabled(true);
    } catch (error) {
      toast.error("Failed to enable webcam");
      console.error("Webcam error:", error);
    }
  };

  const DisableWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (webcamRef.current) {
      webcamRef.current.srcObject = null;
    }
    setWebcamEnabled(false);
  };

  const StartStopRecording = () => {
    if (!recognitionRef.current) {
      toast.error("Speech-to-text not supported");
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
      toast.info("Recording stopped");
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
      toast.info("Recording started");
    }
  };

  const UpdateUserAnswer = async () => {
    if (!userAnswer.trim()) {
      toast.error("Please provide an answer");
      return;
    }
    setLoading(true);
    try {
      const feedbackPrompt = `Question: ${mockInterviewQuestion[activeQuestionIndex]?.question}, User Answer: ${userAnswer}. Please give a rating out of 10 and feedback on improvement in JSON format { "rating": <number>, "feedback": <text> }`;
      const result = await chatSession.sendMessage(feedbackPrompt);
      const mockJsonResp = result.response.text().replace(/```json|```/g, '').trim();
      const JsonfeedbackResp = JSON.parse(mockJsonResp);
      const answerRecord = {
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestionIndex]?.question,
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        feedback: JsonfeedbackResp?.feedback,
        rating: JsonfeedbackResp?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("DD-MM-YYYY"),
      };
      await db.insert(UserAnswer).values(answerRecord);
      onAnswerSave?.(answerRecord);
      toast.success("Answer recorded successfully");
      setUserAnswer("");
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsRecording(false);
    } catch (error) {
      toast.error("Failed to save answer", { description: error.message });
      console.error("Answer save error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center flex-col relative">
      {loading && (
        <div className="fixed inset-0 bg-black/70 z-[9999] flex flex-col justify-center items-center">
          <Loader2 className="h-16 w-16 animate-spin text-white mb-4" />
          <p className="text-white text-lg">Saving your answer...</p>
        </div>
      )}

      <div className="flex flex-col w-full justify-center items-center bg-gray-900 border border-gray-700 rounded-lg p-5">
        {webcamEnabled ? (
          <video
  ref={webcamRef}
  autoPlay
  playsInline
  muted
  className="w-full h-[300px] object-cover rounded-lg"
/>
        ) : (
          <div className="w-full h-[300px] flex justify-center items-center bg-gray-800 rounded-lg">
            <p className="text-gray-400">Webcam Disabled</p>
          </div>
        )}
        <Button variant="outline" className="mt-4 text-gray-100 border-gray-600 bg-gray-800 hover:bg-gray-700" onClick={webcamEnabled ? DisableWebcam : EnableWebcam}>
          {webcamEnabled ? (
            <><CameraOff className="mr-2 h-4 w-4" /> Disable Webcam</>
          ) : (
            <><Camera className="mr-2 h-4 w-4" /> Enable Webcam</>
          )}
        </Button>
      </div>

      <Button disabled={loading} variant="outline" className="my-4 text-gray-100 border-gray-600 bg-gray-800 hover:bg-gray-700" onClick={StartStopRecording}>
        {isRecording ? (
          <h2 className="text-red-500 items-center animate-pulse flex gap-2">
            <StopCircle /> Stop Recording
          </h2>
        ) : (
          <h2 className="text-gray-100 flex gap-2 items-center">
            <Mic /> Record Answer
          </h2>
        )}
      </Button>

      <textarea
        className="w-full h-32 p-4 mt-4 border border-gray-600 rounded-md bg-gray-800 text-gray-100"
        placeholder="Your answer will appear here..."
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
      />

      <Button className="mt-4" onClick={UpdateUserAnswer} disabled={loading || !userAnswer.trim()}>
        {loading ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
        ) : (
          "Save Answer"
        )}
      </Button>
    </div>
  );
};

export default RecordAnswerSection;