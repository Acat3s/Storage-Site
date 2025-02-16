import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function VideoStorageApp() {
  const [videoLinks, setVideoLinks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [thumbnails, setThumbnails] = useState({});

  const addVideo = () => {
    if (inputValue.trim() !== "") {
      setVideoLinks([...videoLinks, inputValue.trim()]);
      setThumbnails((prev) => ({ ...prev, [inputValue.trim()]: getThumbnail(inputValue.trim()) }));
      setInputValue("");
    }
  };

  const isSendvid = (url) => url.includes("sendvid.com");

  const getThumbnail = (url) => {
    if (isSendvid(url)) {
      return "https://via.placeholder.com/480x270?text=No+Preview"; // Default placeholder
    }
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
      return `https://img.youtube.com/vi/${videoId}/0.jpg`;
    }
    return "https://via.placeholder.com/480x270?text=No+Preview";
  };

  return (
    <div className="p-6 max-w-lg mx-auto space-y-4">
      <h1 className="text-xl font-bold">Video Storage</h1>
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Enter video URL"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button onClick={addVideo}>Add Video</Button>
      </div>
      <div className="space-y-4">
        {videoLinks.map((link, index) => (
          <Card key={index} className="cursor-pointer p-2">
            <CardContent>
              {isSendvid(link) ? (
                <div onClick={() => window.open(link, "_blank")} className="cursor-pointer">
                  <img src={thumbnails[link]} alt="Video Thumbnail" className="w-full h-auto" />
                  <Button className="mt-2 w-full">Open Sendvid Video</Button>
                </div>
              ) : (
                <video controls className="w-full">
                  <source src={link} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
