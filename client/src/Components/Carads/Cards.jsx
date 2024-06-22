import { useEffect, useState } from "react";
// import "./Cards.css";
import CardsData from "./CardsData"; // カードデータのインポート

const Cards = () => {
  const [selectedCards, setSelectedCards] = useState([]);

  const handleClck = (id, icon, name, description) => {
    // カードがすでに選択されているかどうかを確認
    const isSelected = selectedCards.some((card) => card.id === id);

    if (!isSelected) {
      // 新しいカードを選択リストに追加
      setSelectedCards([...selectedCards, { id, icon, name, description }]);
    } else {
      // カードが選択されていれば、選択リストから削除
      const updatedCards = selectedCards.filter((card) => card.id !== id);
      setSelectedCards(updatedCards);
    }
  };

  // selectedCards の変更を監視してログを出力
  useEffect(() => {
    console.log(selectedCards);
  }, [selectedCards]);

  return (
    <>
      {/* 選択されたカードの情報を表示 */}
      {selectedCards.length > 0 && (
        <div className="SelectedCardsContainer">
          {selectedCards.map((card) => (
            <div key={card.id} className="SelectedCard">
              <img src={card.icon} />
              <h4>{card.name}</h4>
              <h4>{card.description}</h4>
            </div>
          ))}
        </div>
      )}

      <div className="CradsContainer">
        {CardsData.slice(0, 36).map((item) => (
          <img
            key={item.id}
            className="Card"
            src={item.icon}
            alt={item.name}
            onClick={() =>
              handleClck(item.id, item.icon, item.name, item.description)
            }
          />
        ))}
      </div>
    </>
  );
};

export default Cards;
