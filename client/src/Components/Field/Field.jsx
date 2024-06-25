import { useEffect, useState } from "react";
import "./Field.css";
import { Header } from "./Header/Header";
import ItemData from "./ItemData"; // カードデータのインポート
import ShotGunImage from "./ShotGun.jpg";

import io from "socket.io-client";
// const socket = io.connect("http://localhost:5001");
const socket = io.connect("https://shotgun.onrender.com");

export const Field = () => {
  const [myId, setMyId] = useState("");
  const [otherUsers, setOtherUsers] = useState([]);

  const [userName, setUserName] = useState({
    flag: false,
    name: "",
  });

  const [otherUserName, setOtherUserName] = useState({
    flag: false,
    name: "",
  });

  const [gunFlag, setGunFlag] = useState(false);
  const [itemFlag, setItemFlag] = useState(false);

  const [myLife, setMyLife] = useState("♡♡♡♡♡♡♡");
  const [opponentLife, setOpponentLife] = useState("♡♡♡♡♡♡♡");

  const [valette, setvalettealette] = useState("〇〇◎〇〇◎");

  const [selectedItem, setSelectedItem] = useState({
    id: "",
    icon: "",
    name: "",
    description: "",
  });

  const handleGunClick = () => {
    setGunFlag(!gunFlag);
    if (itemFlag === true) {
      setItemFlag(!itemFlag);
    }
  };

  const handleItemClick = () => {
    setItemFlag(!itemFlag);
    if (gunFlag === true) {
      setGunFlag(!gunFlag);
    }
  };

  const handleClck = (id, icon, name, description) => {
    console.log("クリニック");

    // console.log(id, icon, name, description);

    socket.emit("item_value", id, icon, name, description);
  };

  const generateRandomNumber = () => {
    // Math.random() は0以上1未満のランダムな数を返す
    const randomNumber = Math.random();

    // 0以上0.5未満の場合は1を返し、それ以外の場合は2を返す
    if (randomNumber < 0.5) {
      return 1;
    } else {
      return 2;
    }
  };

  const handleUse = (gunFlag) => {
    if (gunFlag === true) {
      // テスト
      const result = generateRandomNumber();
      console.log(result); // ランダムに1または2が出力される

      if (result === 1) {
        if (opponentLife.length > 0) {
          // サーバーに更新した opponentLife を送信
          socket.emit("opponent_life", opponentLife);
        }
      }
      if (result === 2) {
        if (myLife.length > 0) {
          // サーバーに更新した myLife を送信
          socket.emit("my_life", myLife);
        }
      }
    }
  };

  const [text, setText] = useState("");

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    // console.log(userName);
    setUserName({ flag: true, name: text });
    const user = { flag: true, name: text };
    console.log("クライアント" + user);
    socket.emit("userName_value", user, myId);
    setText("");
  };

  useEffect(() => {
    socket.on("your_data", ({ userId, id }) => {
      setMyId(id);
    });

    socket.on("item_value", (data) => {
      //console.log(data.id, data.icon, data.name, data.description);
      setSelectedItem(data);
    });

    socket.on("userName_value", (updatedUserName, { userId, id }) => {
      console.log(
        updatedUserName,
        id,
        userId,
        userName + "useEffectのコンソール"
      );
      if (id === myId) {
        setUserName(updatedUserName);
        console.log("if文の名k" + userName);
      } else {
        setOtherUserName(updatedUserName);
      }
    });

    socket.on("opponent_life", (data) => {
      console.log(data + "useEffect");
      setOpponentLife(data);
    });

    socket.on("my_life", (data) => {
      console.log(data + "useEffect");
      setMyLife(data);
    });

    //以下記載したらテキストの重複が直った
    return () => {
      socket.off("your_data");
      socket.off("item_value");
      socket.off("userName_value");
      socket.off("opponent_life");
      socket.off("my_life");
    };
  }, [myId]); // myIdを依存配列として渡す
  // これにより、自分のユーザー名が他のユーザーの画面で上書きされることを防ぎ、自分の画面でのみ正しいユーザー名が表示されるようになります。
  return (
    <>
      {userName.flag ? (
        <div className="field-container">
          <Header />
          {/* 共通コンテナ */}
          <div className="myFieldContainer">
            {/* 左 */}
            <div className="leftContainer">
              <div className="userLeft">{userName.name}</div>
              <div className="userLeft">{myLife}</div>

              <div className="leftItemContainer">
                {ItemData.slice(0, 8).map((item) => (
                  <img
                    key={item.id}
                    className="leftItems"
                    src={item.icon}
                    alt={item.name}
                    onClick={() => {
                      handleClck(
                        item.id,
                        item.icon,
                        item.name,
                        item.description
                      ),
                        handleItemClick();
                    }}
                  />
                ))}
              </div>
            </div>
            {/* 真ん中 */}
            <div className="centerContainer">
              <div className="centerItemContainer">
                <div className="CentaerButtonContainer">
                  {/* スイッチ */}
                  {gunFlag && (
                    <div className="btn-switch btn-switch-wrap">
                      <input
                        type="checkbox"
                        id="onoff"
                        name="onoff"
                        defaultChecked
                      />
                      <div className="btn-switch-bg">
                        <label className="btn-switch-in" htmlFor="onoff">
                          <span className="on">相手</span>
                          <span className="off">自分</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* //スイッチここまで */}
                  <button
                    className="attackToMeButton"
                    onClick={() => handleUse(gunFlag)}
                  >
                    {gunFlag ? "撃つ" : ""}
                    {itemFlag ? "使う" : ""}
                  </button>
                </div>
                <img
                  className="CenterGunContainer"
                  src={ShotGunImage}
                  alt="ShotGun"
                  onClick={() => {
                    handleClck(
                      ItemData[9].id,
                      ItemData[9].icon,
                      ItemData[9].name,
                      ItemData[9].description
                    );
                    handleGunClick(); // もう一つの関数を呼び出す例
                  }}
                />

                <div className="CenterDiscriptionContainer">
                  {selectedItem.name}
                  <br></br>
                  <br></br>
                  {selectedItem.description}
                </div>
              </div>
            </div>
            {/* 右 */}
            <div className="rightContainer">
              <div className="userRight">{otherUserName.name}</div>
              <div className="userRight">{opponentLife}</div>

              <div className="rightItemContainer">
                {ItemData.slice(0, 8).map((item) => (
                  <img
                    key={item.id}
                    className="rightItems"
                    src={item.icon}
                    alt={item.name}
                    onClick={() =>
                      handleClck(
                        item.id,
                        item.icon,
                        item.name,
                        item.description
                      )
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="inputUserNameContainer">
          <p>ユーザ名を入力してください</p>
          <form onSubmit={handleTextSubmit}>
            <input
              type="text"
              placeholder="ユーザ名"
              onChange={handleTextChange}
              value={text}
            />
            <button>送信</button>
          </form>
        </div>
      )}
    </>
  );
};
