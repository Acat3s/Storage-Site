import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

const VideoStorageApp = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const { data, error } = await supabase.from("videos").select("id, url");
    if (error) {
      console.error("Erreur lors de la récupération des vidéos :", error);
    } else {
      setVideos(data);
    }
  };

  const addVideo = async () => {
    const url = prompt("Entre l'URL de la vidéo :");
    if (url) {
      const { data, error } = await supabase.from("videos").insert([{ url }]).select("id");
      if (error) {
        console.error("Erreur lors de l'ajout de la vidéo :", error);
      } else if (data && data.length > 0) {
        setVideos([...videos, { id: data[0].id, url }]);
      }
    }
  };

  const removeVideo = async (id) => {
    const { error } = await supabase.from("videos").delete().match({ id });
    if (error) {
      console.error("Erreur lors de la suppression de la vidéo :", error);
    } else {
      setVideos(videos.filter((video) => video.id !== id));
    }
  };

  const isSibnet = (url) => url.includes("sibnet.ru");
  const isYouTube = (url) => url.includes("youtube.com") || url.includes("youtu.be");

  const VideoComponent = ({ url }) => {
    if (isSibnet(url)) {
      return <iframe src={url} width="600" height="340" allowFullScreen></iframe>;
    } else if (isYouTube(url)) {
      const videoId = new URL(url).searchParams.get("v");
      return <iframe src={`https://www.youtube.com/embed/${videoId}`} width="600" height="340" allowFullScreen></iframe>;
    } else {
      return (
        <video width="600" controls>
          <source src={url} type="video/mp4" />
          Votre navigateur ne supporte pas la vidéo.
        </video>
      );
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>📹 Video Storage</h1>
      <button onClick={addVideo}>➕ Ajouter une vidéo</button>
      <div>
        {videos.map((video) => (
          <div key={video.id} style={{ margin: "20px", textAlign: "center" }}>
            <VideoComponent url={video.url} />
            <button onClick={() => removeVideo(video.id)} style={{ marginTop: "10px", backgroundColor: "red", color: "white", border: "none", padding: "5px 10px", cursor: "pointer" }}>
              🗑 Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoStorageApp;
