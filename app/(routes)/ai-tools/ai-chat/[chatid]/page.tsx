
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle, Send } from "lucide-react";
import React, { useState, useEffect } from "react";
import EmptyState from "../_components/EmptyState";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

type messages = {
  content: string;
  role: string;
  type: string;
};

function AiChat() {
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [messageList, setMessageList] = useState<messages[]>([]);
  const { chatid } : any = useParams();
  const router = useRouter();
  console.log(chatid);

  useEffect(() => {
    chatid && GetMessageList();
  },[chatid])

  const GetMessageList=async()=>{
    const result = await axios.get('/api/history?recordId='+chatid);
    console.log(result.data);
    setMessageList(result?.data?.content)
  }


  const onSend = async () => {
    setLoading(true);
    setMessageList((prev) => [
      ...prev,
      {
        content: userInput,
        role: "user",
        type: "text",
      },
    ]);
    setUserInput(""); // Clear input after sending

    const result = await axios.post("/api/ai-career-chat-agent", {
      userInput: userInput,
    });

    console.log(result.data);

    setMessageList((prev) => [...prev, result.data]);
    setLoading(false);
  };

  useEffect(() => {
    // Save message into Database
    messageList.length>0 && updateMessageList();
  }, [messageList]);

  const updateMessageList=async()=>{
    const result = await axios.put('/api/history',{
      content:messageList,
      recordId:chatid
    });
    console.log(result);
  }

  const onNewChat = async () => {
    const id = uuidv4();
    const result = await axios.post('/api/history', {
      recordId: id,
      content: [],
    });
    console.log(result);
    router.replace("/ai-tools/ai-chat/" + id);
  };

  return (
    <div className="px-10 md:px-24 lg:px-36 xl:px-48">
      <div className="flex flex-col gap-2 mt-4">
        <h2 className="font-bold text-lg">AI Career Q/A Chat</h2>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-sm text-gray-600">
            Smart career decision start here - get tailored advice, real-time
            market insights.
          </p>
          <Button className="whitespace-nowrap" onClick={onNewChat}>+ New Chat</Button>
        </div>
      </div>

      <div className="flex flex-col h-[75vh] mt-5">
        {messageList?.length <= 0 && (
          <div className="mt-5">
            <EmptyState
              selectedQuestion={(question: string) =>
                setUserInput((prev) => prev + (prev ? " " : "") + question)
              }
            />
          </div>
        )}

        <div className="flex-1 overflow-y-auto mt-4">
          {/* Message List */}
          {messageList?.map((message, index) => (
            <div key={index}>
              <div
                className={`flex mb-2 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-3 gap-2 rounded-lg ${
                    message.role === "user"
                      ? "bg-gray-200 text-black"
                      : "bg-gray-50 text-black"
                  }`}
                >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>

              {loading && messageList?.length - 1 === index && (
                <div className="flex justify-start p-3 rounded-lg gap-2 bg-gray-50 text-black mb-2">
                  <LoaderCircle className="animate-spin" /> Thinking...
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center gap-6 mt-4">
          <Input
            placeholder="Type here"
            value={userInput}
            onChange={(event) => setUserInput(event.target.value)}
          />
          <Button onClick={onSend} disabled={loading}>
            <Send />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AiChat;
