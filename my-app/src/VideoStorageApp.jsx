import React, { useState, useEffect } from "react";

export function Card({ children }) {
  return (
    <div className="border border-gray-300 rounded-lg shadow-lg p-4 bg-white hover:shadow-xl transition-shadow duration-300">
      {children}
    </div>
  );
}

export function CardContent({ children }) {
  return <div className="p-2">{children}</div>;
}

export function Input(props) {
  return (
    <input
      {...props}
      className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  );
}

export function Button({ children, ...props }) {
  return (
    <button
      {...props}
      className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      {children}
    </button>
  );
}

export default function VideoStorageApp() {
  const [videoLinks, setVideoLinks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [thumbnails, setThumbnails] = useState({});
  const [titles, setTitles] = useState({});

  useEffect(() => {
    const savedVideos = JSON.parse(localStorage.getItem("videos")) || [];
    const savedThumbnails = JSON.parse(localStorage.getItem("thumbnails")) || {};
    const savedTitles = JSON.parse(localStorage.getItem("titles")) || {};
    setVideoLinks(savedVideos);
    setThumbnails(savedThumbnails);
    setTitles(savedTitles);
  }, []);

  useEffect(() => {
    if (videoLinks.length > 0) {
      localStorage.setItem("videos", JSON.stringify(videoLinks));
      localStorage.setItem("thumbnails", JSON.stringify(thumbnails));
      localStorage.setItem("titles", JSON.stringify(titles));
    }
  }, [videoLinks, thumbnails, titles]);

  const addVideo = async () => {
    if (inputValue.trim() !== "") {
      const newLinks = [...videoLinks, inputValue.trim()];
      const newThumbnails = {
        ...thumbnails,
        [inputValue.trim()]: getThumbnail(inputValue.trim()),
      };
      const videoTitle = await fetchVideoTitle(inputValue.trim());
      const newTitles = {
        ...titles,
        [inputValue.trim()]: videoTitle,
      };
      setVideoLinks(newLinks);
      setThumbnails(newThumbnails);
      setTitles(newTitles);
      localStorage.setItem("videos", JSON.stringify(newLinks));
      localStorage.setItem("thumbnails", JSON.stringify(newThumbnails));
      localStorage.setItem("titles", JSON.stringify(newTitles));
      setInputValue("");
    }
  };

  const removeVideo = (index) => {
    const linkToRemove = videoLinks[index];
    const newLinks = videoLinks.filter((_, i) => i !== index);
    const newThumbnails = { ...thumbnails };
    const newTitles = { ...titles };
    delete newThumbnails[linkToRemove];
    delete newTitles[linkToRemove];
    
    setVideoLinks(newLinks);
    setThumbnails(newThumbnails);
    setTitles(newTitles);
    localStorage.setItem("videos", JSON.stringify(newLinks));
    localStorage.setItem("thumbnails", JSON.stringify(newThumbnails));
    localStorage.setItem("titles", JSON.stringify(newTitles));
  };

  const getThumbnail = (url) => {
    if (url.includes("sibnet.ru")) {
      return "https://video.sibnet.ru/shell.php?videoid=4667179&img=1";
    }
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.split("v=")[1]?.split("&")[0] || url.split("youtu.be/")[1];
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
    return "https://via.placeholder.com/480x270?text=No+Thumbnail";
  };

  const fetchVideoTitle = async (url) => {
    try {
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      const text = data.contents;
      const match = text.match(/<title>(.*?)<\/title>/);
      return match ? match[1] : "Unknown Title";
    } catch (error) {
      return "Unknown Title";
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-100 min-h-screen rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">Video Storage</h1>
      <div className="flex gap-2 mb-6">
        <Input
          type="text"
          placeholder="Enter video URL"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button onClick={addVideo}>Add Video</Button>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {videoLinks.map((link, index) => (
          <Card key={index}>
            <CardContent>
              <h2 className="text-lg font-semibold text-center mb-2">{titles[link]}</h2>
              <a href={link} target="_blank" rel="noopener noreferrer">
                <img
                  src={thumbnails[link]}
                  alt="Video Thumbnail"
                  className="w-full rounded-lg hover:scale-105 transition-transform duration-300"
                />
              </a>
              <Button onClick={() => removeVideo(index)} className="mt-2 bg-red-500 hover:bg-red-600">
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}