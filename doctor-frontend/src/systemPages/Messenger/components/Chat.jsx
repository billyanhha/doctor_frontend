import React, { useState, useEffect, useRef } from 'react';
import "../style.css"
import { Avatar, MessageBox } from 'react-chat-elements'
import { Input, Spin } from 'antd';
import { Upload, Button, Tooltip, Popconfirm } from 'antd';
import { FolderAddFilled, CloseCircleFilled } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getThreadChat, getMoreThreadChat, sendMessage, updateIsRead, getChat } from '../../../redux/chat';
import moment from "moment";
import { LoadingOutlined, VideoCameraOutlined } from '@ant-design/icons';
import _ from "lodash"
import { animateScroll } from 'react-scroll'
import Portal from "../../../components/Portal/Portal";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Chat = (props) => {

    const ref = useRef(null)

    const [fileList, setFileList] = useState([]);
    const [file, setfile] = useState({});
    const [openUploadFile, setopenUploadFile] = useState(false);
    const [disable, setdisable] = useState(false);
    const [page, setpage] = useState(1);
    const [chatText, setchatText] = useState('');
    const [isLoadMore, setisLoadMore] = useState(false);
    
    const [openVideoCall, setOpenVideoCall] = useState(false);
    const [confirmVisiable, setConfirmVisiable] = useState(false);

    const dispatch = useDispatch();
    const { currentDoctor } = useSelector(state => state.doctor);
    const { currenThreadChat, threadLoad, sendChatLoad } = useSelector(state => state.chat);
    const { isLoad } = useSelector(state => state.ui);
    const { io } = useSelector(state => state.notify);

    const customer_id = props.match.params.id;
    const params = new URLSearchParams(props.location.search);

    useEffect(() => {

        getChatThreadData();
        updateThreadIsReadFunc()
        setpage(1)
        if (io && currentDoctor?.id && customer_id) {
            io.emit("disconnect-chat", "")
            io.emit("chat", `chat&&${customer_id}&&${currentDoctor?.id}`)
            io.on('chat-thread', data => {
                // updateThreadIsReadFunc()
                // getChatThreadData()
                if (customer_id === data?.customer_id) { // if current chat is exactly the one just send the message
                    const payloadThread = { cusId: data?.customer_id, doctor_id: data?.doctor_id }
                    dispatch(getThreadChat(payloadThread))
                    const payloadUpdate = { cusId: data?.customer_id, doctor_id:  data?.doctor_id, socketId: io?.id }
                    dispatch(updateIsRead(payloadUpdate))
                }
                // updateIsReadNewMsg(data?.customer_id, data?.doctor_id)

            })
        }

    }, [currentDoctor, customer_id, io]);

    const scrollToBottomDiv = () => {
        animateScroll.scrollToBottom({
            containerId: 'messenger-chat-content-list-13',
        })
    }

    useEffect(() => {

        if (!isLoadMore) {
            scrollToBottomDiv()

        }

    }, [currenThreadChat?.data]);


    const getChatThreadData = () => {
        if ((customer_id !== 't') && customer_id && currentDoctor?.id) {
            setisLoadMore(false)
            const data = { cusId: customer_id, doctor_id: currentDoctor?.id }
            dispatch(getThreadChat(data))
        }

    }

    const updateThreadIsReadFunc = () => {
        if ((customer_id !== 't') && customer_id && currentDoctor?.id && io?.id) {
            const data = { cusId: customer_id, doctor_id: currentDoctor?.id, socketId: io?.id }
            dispatch(updateIsRead(data))
        }

    }

    const getMoreChatThreadData = () => {
        if (!currenThreadChat?.isOutOfData && !isLoad && (customer_id !== 't')) {
            setisLoadMore(true)
            setdisable(true)
            const nextPage = page + 1;
            setpage(nextPage)
            const data = { page: nextPage, cusId: customer_id, doctor_id: currentDoctor?.id }
            dispatch(getMoreThreadChat(data))
            // scrollToBottomDiv()
            setTimeout(() => {
                setdisable(false)
            }, 1000);
        }
    }

    const getCustomerName = () => {
        return params.get('name');
    }

    const getCustomerAva = () => {
        return params.get('avatar');
    }

    const onSubmitChat = (e) => {
        const text = e.target.value.trim();
        if (fileList.length !== 0 && io?.id && customer_id && currentDoctor?.id) {
            const formData = new FormData();
            formData.append('image', fileList[0].originFileObj)
            formData.append('customer_id', customer_id)
            formData.append('socketId', io?.id)
            dispatch(sendMessage(formData, customer_id, currentDoctor?.id))
            clearChat();
        }
        if (text && io?.id && customer_id && currentDoctor?.id) {
            const formData = new FormData();
            formData.append('msg', text)
            formData.append('customer_id', customer_id)
            formData.append('socketId', io?.id)
            dispatch(sendMessage(formData, customer_id, currentDoctor?.id))
            clearChat()
        }
    }

    const clearChat = () => {
        if (!sendChatLoad) {
            setopenUploadFile(false)
            setchatText('')
            setFileList([]);
        }
    }


    const onChangeFile = async ({ fileList: newFileList }) => {

        setFileList(newFileList);
        if (newFileList[0]) {
            setfile(newFileList[0].originFileObj)
        }
        ref.current.focus()
    };

    const onPreviewImage = async file => {
        let src = file.url;
        if (!src) {
            src = await new Promise(resolve => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => {
                    resolve(reader.result);
                };
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow.document.write(image.outerHTML);
    };

    const renderUploadFile = openUploadFile && (
        <div className="render-upload-file">
            <Upload
                fileList={fileList}
                listType="picture-card"
                onChange={onChangeFile}
                onPreview={onPreviewImage}
            >
                {fileList.length < 1 && 'Tải ảnh'}
            </Upload>
        </div>
    )

    const openUploadImage = () => {
        setopenUploadFile(!openUploadFile)
        setFileList([]);
    }

    const renderChat = currenThreadChat?.data?.map((value, index) => {
        return (
            <div key={value?.id}>

                {index === 0 ? (
                    <center>
                        <h5>
                            {
                                moment(value?.created_at).format('DD-MM-YYYY [ vào lúc ] hh [ giờ ] mm [ phút ]')
                            }
                        </h5>
                        <Button
                            loading={disable || isLoad}
                            style={{ display: `${currenThreadChat?.isOutOfData ? 'none' : ''}` }}
                            type="link" onClick={getMoreChatThreadData} >Tải thêm</Button>
                    </center>
                ) : ''}

                <div className={"messenger-chat-item " + (value?.sender_type === 'doctor' ? 'messenger-chat-item-user' : '')}>
                    {value?.sender_type == 'doctor' ?
                        '' : (
                            <Avatar
                                src={getCustomerAva()}
                                alt={getCustomerName()}
                                type="circle flexible" />
                        )}
                    <div className={value?.sender_type === 'doctor' ? 'messenger-chat-item-content-user' : "messenger-chat-item-content-nonuser"}>
                        {value?.msg_type === 'text' ? value?.msg : (
                            <a target="_blank" href={value?.msg}>
                                <img className="messenger-chat-item-content-image" src={value?.msg} alt={value?.id} />
                            </a>

                        )}
                        <br />
                        <div className="chat-date">{moment(value?.created_at).fromNow()}</div>
                    </div>
                </div>
            </div>
        )
    })


    const onTextChange = (e) => {
        setchatText(e.target.value)

    }

    const actionVideoCall = () => {
        if(openVideoCall) {
            setConfirmVisiable(true);
        }else {
            setOpenVideoCall(true);
        }
    }

    const closeWindowPortal = () => {
        if(openVideoCall) {
            setOpenVideoCall(false);
            setConfirmVisiable(false);
        }
    }

    return (customer_id === 't') ?

        (
            <div className="messenger-content-wrapper"  >
                <div className="messenger-chat">
                </div>
            </div>
        )

        : (
            <div className="messenger-content-wrapper" >
                <div className="messenger-content" id="messenger-chat-content-list-13" >
                    <div className="messenger-chat" >
                        {openVideoCall && <Portal url={`${process.env.PUBLIC_URL}/call/video/${customer_id}?name=${getCustomerName()}&avatar=${getCustomerAva()}`} closeWindowPortal={closeWindowPortal} />}
                        <div className="messenger-chat-header">
                            <div>
                                <Avatar
                                    src={getCustomerAva()}
                                    alt={getCustomerName()}
                                    size="large"
                                    type="circle flexible" />
                                <b>{getCustomerName()}</b>
                            </div>
                            <Tooltip title="Bắt đầu gọi video" placement="bottom">
                                <Popconfirm visible={confirmVisiable} placement="left" title={"Xác nhận kết thúc cuộc gọi video hiện tại?"} onConfirm={closeWindowPortal} onCancel={()=>setConfirmVisiable(false)} okText="Xác nhận" cancelText="Huỷ">
                                    <div className="messenger-chat-video" onClick={actionVideoCall}>
                                        <VideoCameraOutlined style={{fontSize:"1.2rem", color:"#40a9ff"}} />
                                    </div>
                                </Popconfirm>
                            </Tooltip>
                        </div>
                        <div className="messenger-chat-content" >
                            <div className="messenger-chat-content-list">
                                {renderChat}
                                <Spin size="large" indicator={antIcon} spinning={threadLoad} />

                            </div>
                        </div>
                    </div>
                </div>
                <div className="messenger-chat-content-input">
                    <div className="messenger-chat-content-input-image">
                        {renderUploadFile}
                    </div>
                    <Spin size="large" indicator={antIcon} spinning={sendChatLoad} >
                        <div className="messenger-chat-content-input-form">
                            <div className="messenger-chat-content-input-upload-file">
                                <Button type="link" onClick={openUploadImage}>
                                    {openUploadFile ? <CloseCircleFilled style={{ fontSize: '25px' }} /> : <FolderAddFilled style={{ fontSize: '25px' }} />}
                                </Button>
                            </div>
                            <Input.TextArea
                                // autoSize={false}
                                allowClear={true}
                                ref={ref}
                                autoFocus
                                loading={threadLoad}
                                onChange={onTextChange}
                                value={chatText}
                                onPressEnter={onSubmitChat}
                                style={{ borderRadius: '10px' }}
                                className="messenger-chat-content-input-area"
                                placeholder="" />
                        </div>
                    </Spin>
                </div>
            </div>
        );
};

export default withRouter(Chat);