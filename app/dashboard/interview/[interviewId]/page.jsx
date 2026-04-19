"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Lightbulb, WebcamIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { toast } from "sonner";

function Interview({ params }) {
  const [interviewData, setInterviewData] = useState(null);
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  useEffect(() => {
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId));
      if (result.length > 0) {
        setInterviewData(result[0]);
      } else {
        toast.error("Interview details not found");
      }
    } catch (error) {
      toast.error("Error fetching interview details");
    }
  };

  const handleWebcamToggle = () => {
    if (!webCamEnabled) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => {
          setWebCamEnabled(true);
          toast.success("Webcam and microphone enabled");
        })
        .catch(() => toast.error("Failed to access webcam or microphone"));
    } else {
      setWebCamEnabled(false);
    }
  };

  if (!interviewData) {
    return <div className="text-gray-300 p-10">Loading interview details...</div>;
  }

  return (
    <div className="my-10">
      <h2 className="font-bold text-2xl text-gray-100">Let's get started</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-5">

        {/* Left side */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col p-5 rounded-lg border border-gray-700 gap-5">
            <h2 className="text-lg text-gray-100">
              <strong>Job Role/Job Position: </strong>{interviewData.jobPosition}
            </h2>
            <h2 className="text-lg text-gray-100">
              <strong>Job Description/Tech Stack: </strong>{interviewData.jobDesc}
            </h2>
            <h2 className="text-lg text-gray-100">
              <strong>Years of Experience: </strong>{interviewData.jobExperience}
            </h2>
          </div>
          <div className="p-5 border rounded-lg border-indigo-800 bg-indigo-950">
            <h2 className="flex gap-2 items-center text-indigo-300">
              <Lightbulb />
              <span>Information</span>
            </h2>
            <h2 className="mt-3 text-indigo-200">
              Enable Video Web Cam and Microphone to Start your AI Generated Mock Interview.
              It has 5 questions which you can answer and will provide a report based on your answers.
              NOTE: We never record your video. Web cam access can be disabled at any time.
            </h2>
          </div>
        </div>

        {/* Right side - Webcam + Button */}
        <div className="flex flex-col items-center gap-4">
          {webCamEnabled ? (
            <Webcam
              mirrored={true}
              style={{ height: "320px", width: "100%", objectFit: "cover", borderRadius: "8px" }}
              onUserMedia={() => setWebCamEnabled(true)}
              onUserMediaError={() => {
                toast.error("Webcam access error");
                setWebCamEnabled(false);
              }}
            />
          ) : (
            <div className="w-full flex flex-col items-center gap-4">
              <WebcamIcon className="h-72 border border-gray-700 rounded-lg w-full p-20 bg-gray-800 text-gray-400" />
              <Button className="w-full" variant="ghost" onClick={handleWebcamToggle}>
                Enable Web Cam and Microphone
              </Button>
            </div>
          )}
          <Link href={`/dashboard/interview/${params.interviewId}/start`} className="w-full">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
              Start Interview
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Interview;