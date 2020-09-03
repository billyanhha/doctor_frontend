import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from "lodash";
import { notification, Badge, Modal, message, Tooltip, Avatar, Button } from 'antd';
import {SoundOutlined} from "@ant-design/icons";

import { withRouter } from 'react-router-dom';
import io from 'socket.io-client';
import { saveIoInstance, clearIoInstance, markReadNotify, getDoctorNotification, countUnreadNotify } from '../../redux/notification';
import {setCallStatus, setOpponentData, setOpenVideoCall} from "../../redux/call";

import Portal from "../Portal/Portal";
import defaultRingtone from "../../assest/ringtone/HHS.wav";

const Notify = (props) => {
    const audioRef = useRef();

    const notify = useSelector(state => state.notify);
    const {currentDoctor} = useSelector(state => state.doctor);
    const { token } = useSelector(state => state.auth);
    const ringtone = useSelector(state => state.ringtone.ringtone);
    const {callStatus, openVideoCall, opponentData} = useSelector(state => state.call);
    const {isLoad} = useSelector(state => state.ui);

    const dispatch = useDispatch();
    const [incomingCall, setIncomingCall] = useState(false);
    const [senderPeerID, setSenderPeerID] = useState(null);
    const [playRingtone, setPlayRingtone] = useState(false);

    useEffect(() => {

        if (_.isEmpty(token)) {

            dispatch(clearIoInstance())
        }

    }, [token]);

    useEffect(() => {


        if (_.isEmpty(notify?.io) && !_.isEmpty(currentDoctor)) {
            const ioConnectData = io(process.env.REACT_APP_SERVER);
            dispatch(saveIoInstance(ioConnectData))
            ioConnectData.emit("client-send-userId", currentDoctor?.id + "doctor")
        }

    }, [currentDoctor]);

    const markReadNotifyFunc =  (value) => {
        if(!value?.is_read) {
            const data = { id: value?.id, is_read: true }
            dispatch(markReadNotify(data))
        }
        window.location.href = (value?.url)
    }



    const notifyPanel = (data) => {
        if (!_.isEmpty(data)) {
            const btn = (
                <div onClick={() => markReadNotifyFunc(data)}>
                    <a href={data?.url}>Chi tiết</a>
                </div>
            );
            notification["info"]({
                key: data?.id,
                message: 'Thông báo',
                description: data?.content,
                btn,
                duration: 0,
                placement: 'bottomLeft'
            });
        }
    }

    const getMessage = () => {
        if (notify?.io) {
            notify.io.on("server-send-notification", (data) => {
                notifyPanel(data)
                getNewNotify()
                getNotifyNum()
            })
        }
    }

    const getNewNotify = () => {
        if(currentDoctor?.id && token) {
            const data = { id: currentDoctor?.id , itemsPage: 30, page: 1 }
            dispatch(getDoctorNotification(data))
        }

    }

    const getNotifyNum = () => {
        if(currentDoctor?.id && token){
            const data = { receiver_id: currentDoctor?.id  }
            dispatch(countUnreadNotify(data))
        }

    }

    const delayLoopRingtone = () => {
        setTimeout(() => {
            audioRef.current.play();
        }, 2000);
    };

    const handleAcceptCall = () => {
        if (senderPeerID) {
            dispatch(setCallStatus(true));
            dispatch(setOpenVideoCall(true));
        } else {
            message.destroy();
            message.error("Không thể kết nối với đối phương!", 4);
        }
        setPlayRingtone(false);
        setIncomingCall(false);
    };

    const handleCancelCall = type => {
        message.destroy();
        if (type !== null) {
            message.info("Bệnh nhân đã huỷ cuộc gọi", 4);
        } else {
            if (notify?.io && opponentData) {
                notify.io.emit("cancel-video", opponentData?.id + "customer");
                message.info("Đã từ chối cuộc gọi");
            }
        }
        setPlayRingtone(false);
        setIncomingCall(false);
        dispatch(setOpponentData(null));
        setSenderPeerID(null);
    };
    
    const closeWindowPortal = () => {
        if (openVideoCall) {
            if (notify?.io && opponentData){
                notify.io.emit("cancel-video", opponentData?.id + "customer");
            }
            dispatch(setOpenVideoCall(false));
            dispatch(setOpponentData(null));
            dispatch(setCallStatus(false));
            setIncomingCall(false);
            setSenderPeerID(null);
        }
    };

    useEffect(() => {
        if (notify?.io) {
            //listen when customer call.
            notify.io.on("connect-video-room", (getCustomerID, getSenderData) => {
                if (getCustomerID && !_.isEmpty(getSenderData)) {
                    dispatch(setOpponentData(getSenderData));
                    setSenderPeerID(getCustomerID);
                    setPlayRingtone(true);
                    setIncomingCall(true);
                }
            });

            notify.io.on("caller-cancel-call", () => {
                handleCancelCall(1);
            });
        }
    }, [currentDoctor, notify?.io]);

    useEffect(() => {
        if (_.isEmpty(audioRef.current)) return;

        if (playRingtone) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
            audioRef.current.load();
        }
    }, [playRingtone]);

    window.addEventListener("beforeunload", event => {
        //cancel call if user reload page when a call is coming.
        if (incomingCall && io && opponentData) {
            if (callStatus) {
                dispatch(setCallStatus(false));
            }
            handleCancelCall(null);
        }
    });

    return !_.isEmpty(token) && !props.location.pathname.includes("/call/") ? (
        <div>
            {openVideoCall && (
                <Portal
                    url={`${process.env.PUBLIC_URL}/call/video/${opponentData?.id}?name=${opponentData?.name}&avatar=${opponentData?.avatar}${senderPeerID ? "&distract=" + senderPeerID : ""}`}
                    closeWindowPortal={closeWindowPortal}
                />
            )}
            <audio
                ref={audioRef}
                src={ringtone ? "../../assest/ringtone/HHS.wav" + ringtone : defaultRingtone}
                // loop
                onEnded={delayLoopRingtone}
                style={{display: "none"}}
            />
            <Modal
                title="Cuộc gọi đến"
                visible={incomingCall}
                style={{top: 20}}
                width={400}
                closable={false}
                footer={[
                    <Tooltip title="Đổi nhạc chuông trong mục Thông tin của tôi" placement="bottom" getPopupContainer={triggerNode => triggerNode.parentNode}>
                        <SoundOutlined /> ­ <Badge status="processing" />
                    </Tooltip>,
                    <Button key="accept" type="primary" loading={isLoad} onClick={() => handleAcceptCall()} style={{marginLeft: "20px"}}>
                        Trả lời
                    </Button>,
                    <Button key="decline" onClick={() => handleCancelCall(null)} danger>
                        Từ chối
                    </Button>
                ]}
            >
                <div className="video-call-incoming">
                    <Avatar src={opponentData?.avatar} alt={opponentData?.name ?? "customer_name"} size="large" type="circle flexible" />
                    <b>{opponentData?.name} gọi video cho bạn.</b>
                </div>
            </Modal>
            {getMessage()}
        </div>
    ) : '';
};

export default withRouter(Notify);