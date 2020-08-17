import React, { useEffect, useState } from 'react';
import "../style.css"
import { ChatItem } from 'react-chat-elements'
import { useDispatch, useSelector } from 'react-redux';
import { getChat, getMoreChat } from '../../../redux/chat';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin, Button } from 'antd';
import moment from "moment"
import _ from "lodash";
import { withRouter } from 'react-router-dom';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const MessChatList = (props) => {

    const dispatch = useDispatch();
    const { chatList, isOutOfChatListData, getChatLoad } = useSelector(state => state.chat);
    const { currentDoctor } = useSelector(state => state.doctor);
    const { io } = useSelector(state => state.notify);

    const [disable, setdisable] = useState(false);
    const [page, setpage] = useState(1);

    useEffect(() => {

        getChatData()
        if (io && currentDoctor?.id) {
            io.on('server-send-notification-chat', data => {
                const payload = { page: 1, id: currentDoctor?.id }
                dispatch(getChat(payload))
            })
        }


    }, [currentDoctor, io]);


    const getChatData = () => {
        if (currentDoctor?.id) {
            const data = { page: page, id: currentDoctor?.id }
            dispatch(getChat(data))
        }

    }



    const getMoreChatData = () => {
        if (!isOutOfChatListData && !getChatLoad) {

            setdisable(true)
            const nextPage = page + 1;
            setpage(nextPage)
            const data = { page: nextPage, id: currentDoctor?.id }
            dispatch(getMoreChat(data))
            setTimeout(() => {
                setdisable(false)
            }, 1000);
        }
    }

    const openChatThread = (value) => {
        props.history.push("/messenger/" + value?.customer_id + "?name=" + value?.customer_name + "&avatar=" + value?.customer_avatar)
    }


    const renderChatList = chatList?.map((value, index) => {
        return (
            <div key={value?.customer_id}
                className="chat-item-wrapper" style={{ backgroundColor: `${(props.match.params.id === value?.customer_id) ? '#f2f2f2' : ''}` }}>
                <ChatItem
                    onClick={() => openChatThread(value)}
                    avatar={value?.customer_avatar}
                    alt={value?.customer_name}
                    title={value?.customer_name}
                    subtitle={value?.msg}
                    date={new Date(moment(value?.last_created).format())}
                    unread={value?.num_doctor_unread} />
            </div>
        )
    })



    return (
        <div>
            {
                (chatList?.length === 0 && !getChatLoad) ?
                    (<center><h4>Bạn chưa có cuộc hội thoại nào</h4></center>) : ''
            }
            <div>
                {renderChatList}
                <center>
                    <Button
                        loading={disable || getChatLoad}
                        style={{ display: `${isOutOfChatListData ? 'none' : ''}` }}
                        type="link" onClick={getMoreChatData} >Tải thêm</Button>
                </center>
            </div>
        </div>
    );
};

export default withRouter(MessChatList);