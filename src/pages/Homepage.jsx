import React, { useState, Fragment, useEffect } from "react";
import Item from "../components/Item";
import ItemWrapper from "../components/ItemWrapper";
import Col from "../components/Col";
import Board from "../components/Board";
import { data, statuses as initialStatuses } from "../data";

const Homepage = () => {
    const [items, setItems] = useState(data);
    const [statuses, setStatuses] = useState(initialStatuses);

    useEffect(()=>document.activeElement.blur(),[]);

    //セクション間でアイテムを移動させる
    //status -> dropした先のstatusリテラル
    const onDrop = (item, monitor, status) => {
        //status -> グループの種別
        let droppedIndex = -1;
        const mapping = statuses.find(si => si.status === status);
        setItems(prevState => {
            const updatedItems = prevState
                .filter(i => i.id !== item.id)
                .concat({ ...item, status});

            let newItems = [];
            for (let i = 0; i < statuses.length; i++) {
                for (let j = 0; j < updatedItems.length; j++) {
                    if (updatedItems[j].status === statuses[i].status) newItems.push(updatedItems[j]);
                }
            }

            //dropしたインデックスを保持しておく
            for (let i = 0; i < newItems.length - 1; i++) {
                if (newItems[i].status === status && newItems[i + 1].status !== status) droppedIndex = i;
            }
            if (droppedIndex == -1) droppedIndex = newItems.length - 1;

            return [...newItems];
        });
        return droppedIndex;
    };


    //セクション内のアイテムを移動する
    const moveItem = (dragIndex, hoverIndex) => {
        const item = items[dragIndex];
        setItems(prevState => {
            //itemsをgroupedItems内の順序を守ったまま、グループ別にソートしたい
            //ここで並べ替えを行わないと、returnの中で定義したindexと矛盾が生じる
            let newItems = [];
            for (let i = 0; i < statuses.length; i++) {
                for (let j = 0; j < items.length; j++) {
                    if (items[j].status === statuses[i].status) newItems.push(items[j]);
                }
            }
            newItems = newItems.filter((_, index) => index !== dragIndex);
            newItems.splice(hoverIndex, 0, item);
            return [...newItems];
        });
    };

    //セクション自体を移動する
    const moveSection = (dragIndex, hoverIndex) => {
        const status = statuses[dragIndex];
        setStatuses(prevState => {
            let newStatuses = prevState.filter((_, index) => index !== dragIndex);
            newStatuses.splice(hoverIndex, 0, status);
            return newStatuses;
        });
    }

    //セクションにアイテムを追加する
    const addItem = (status) => {
        const mapping = statuses.find(si => si.status === status);
        setItems(prevState => {
            //後でmapで置換する
            let newItem = {
                id: items.length + 1,
                status: status,
                content: "new item"
            }
            const updatedItems = prevState
                .concat(newItem);

            let newItems = [];
            for (let i = 0; i < statuses.length; i++) {
                for (let j = 0; j < updatedItems.length; j++) {
                    if (updatedItems[j].status === statuses[i].status) newItems.push(updatedItems[j]);
                }
            }
            return [...newItems];
        });
    }

    //セクションからアイテムを削除する
    const deleteItem = (id) => {
        setItems(prevState => {
            let newItems = prevState.filter(item => item.id !== id);
            return [...newItems];
        });
    }

    //セクションを追加する
    const addSection = () => {
        setStatuses(prevState => {
            let randomColor = "#" + Math.floor(Math.random() * 0xFFFFFF).toString(16);
            while(statuses.map(item=>item.color).includes(randomColor)){
                randomColor = "#" + Math.floor(Math.random() * 0xFFFFFF).toString(16);
            }
            let newStatus = {
                status: "section" + prevState.length,
                icon: "仮",
                color: randomColor
            }
            let newStatuses = prevState.concat(newStatus);
            return [...newStatuses];
        })
    }

    //セクションを削除する
    const deleteSection = (section)=> {
        setItems(prevState=>{
            let newItems = prevState.filter(item=>item.status!==section);
            return [...newItems];
        });
        setStatuses(prevState=>{
            let newStatuses = prevState.filter(item=>item.status!==section);
            return [...newStatuses];
        })
    }
    
    //セクションとアイテムのタイトルを変更する
    const titleChange = (status, event)=> {
        setStatuses(prevState=>{
            let newStatuses = prevState.map(item=>{
                if(item.status === status) return item = {...item, status:event.target.value};
                else return item;
            });
            return [...newStatuses];
        });
        setItems(prevState=>{
            console.log(prevState)
            let newItems = prevState.map(item=>{
                if(item.status === status) return item = {...item, status:event.target.value};
                else return item;
            });
            return [...newItems];
        });
    }

    //アイテムのcontentを変更する
    const contentChange = (id, event)=> {
        setItems(prevState=>{
            let newItems = prevState.map(item=>{
                if(item.id === id) return item = {...item, content:event.target.value};
                else return item;
            });
            return [...newItems];
        });
    }
    

    let itemIndex = 0;
    return (
        <Fragment>
            <button onClick={addSection} className={"ml-5 btn btn-lg btn-info"}>Add section</button>
            <div className={"row"}>
                {statuses.map((s, sectionIndex) => {
                    const groupedItem = items.filter(item => item.status == s.status);
                    const firstIndex = itemIndex;
                    itemIndex = itemIndex + groupedItem.length;
                    return (
                        <Board 
                            key={s.status}
                            status={s.status}
                            index={sectionIndex}
                            moveSection={moveSection}
                            deleteSection={deleteSection}
                            addItem={addItem}
                            titleChange={titleChange}
                        >
                            <ItemWrapper onDrop={onDrop} status={s.status}>
                                <Col>
                                    {items
                                        .filter(i => i.status === s.status)
                                        .map((i, idx) => 
                                        <Item 
                                            key={i.id}
                                            item={i}
                                            index={firstIndex + idx}
                                            moveItem={moveItem}
                                            deleteItem={deleteItem}
                                            contentChange={contentChange}
                                            status={s}
                                        />)
                                    }
                                </Col>
                            </ItemWrapper>
                        </Board>
                    );
                })}
            </div>
        </Fragment>
    );
};

export default Homepage;