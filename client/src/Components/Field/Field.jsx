import { useEffect, useState } from "react";
import "./Field.css";
import { Header } from "./Header/Header";
import ItemData from "./ItemData"; // カードデータのインポート
import ShotGunImage from "./ShotGun.jpg";

import io from "socket.io-client";
// const socket = io.connect("http://localhost:5001");
const socket = io.connect("https://shotgun.onrender.com");

export const Field = () => {
  const [messages, setMessages] = useState([]);

  const [selectedItem, setSelectedItem] = useState({
    id: "",
    icon: "",
    name: "",
    description: "",
  });

  const handleClck = (id, icon, name, description) => {
    console.log("クリニック");

    // console.log(id, icon, name, description);
    socket.emit("item_value", id, icon, name, description);
  };

  useEffect(() => {
    socket.on("item_value", (data) => {
      console.log(data.id, data.icon, data.name, data.description);
      setSelectedItem(data);
    });

    //以下記載したらテキストの重複が直った
    return () => {
      socket.off("item_value");
    };
  }, []); // []を依存配列として渡すことで初回のみ実行されるようにする

  return (
    <>
      <div className="field-container">
        <Header />
        {/* 共通コンテナ */}
        <div className="myFieldContainer">
          {/* 左 */}
          <div className="leftContainer">
            <div className="userLeft">left</div>
            <div className="userLeft">♡♡♡♡♡♡♡</div>

            <div className="leftItemContainer">
              {ItemData.slice(0, 8).map((item) => (
                <img
                  key={item.id}
                  className="leftItems"
                  src={item.icon}
                  alt={item.name}
                  onClick={() =>
                    handleClck(item.id, item.icon, item.name, item.description)
                  }
                />
              ))}
            </div>
          </div>
          {/* 真ん中 */}
          <div className="centerContainer">
            <div className="centerItemContainer">
              <div className="CentaerButtonContainer">
                <button className="attackToOtherButton">相手へ○○</button>
                <button className="attackToMeButton">自分へ○○</button>
              </div>
              <img
                className="CenterGunContainer"
                src={ShotGunImage}
                alt="ShotGun"
              />

              <div className="CenterDiscriptionContainer">
                {selectedItem.description}
              </div>
            </div>
          </div>
          {/* 右 */}
          <div className="rightContainer">
            <div className="userRight">right</div>
            <div className="userRight">♡♡♡♡♡♡</div>

            <div className="rightItemContainer">
              {ItemData.slice(0, 8).map((item) => (
                <img
                  key={item.id}
                  className="rightItems"
                  src={item.icon}
                  alt={item.name}
                  onClick={() =>
                    handleClck(item.id, item.icon, item.name, item.description)
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
