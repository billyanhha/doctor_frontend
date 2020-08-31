import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, Link, withRouter } from 'react-router-dom';
import { getDoctorLogin } from '../../redux/doctor';
import { doctorLogout } from '../../redux/auth';
import { PageHeader, Tabs, Button, Menu, Badge, Avatar, Popover, Modal, message } from 'antd'
import Skeleton from "react-loading-skeleton";
// import logo from '../../logo.svg';
import './style.css';
import Notification from '../Notification';
import { countUnreadNotify } from '../../redux/notification';
import {isEmpty} from "lodash";
import Portal from "../Portal/Portal";

import logo from "../../assest/Ikemen_doctor.png";
import avatar from "../../assest/hhs-default_avatar.jpg";
import defaultRingtone from "../../assest/ringtone/HHS.wav";

const Navbar = (props) => {
    const audioRef = useRef();

    const auth = useSelector(state => state.auth);
    const { isLoad } = useSelector(state => state.ui);
    const { currentDoctor } = useSelector(state => state.doctor);
    const { io } = useSelector(state => state.notify);
    const dispatch = useDispatch();
    const [drawerVisible, setdrawerVisible] = useState(false);
    const { unreadNotifyNumber } = useSelector(state => state.notify);
    const {ringtone} = useSelector(state => state.call);

    const { location } = props;

    const [openVideoCall, setOpenVideoCall] = useState(false);
    const [incomingCall, setIncomingCall] = useState(false);
    const [senderData, setSenderData] = useState(null);
    const [senderPeerID, setSenderPeerID] = useState(null);
    const [playRingtone, setPlayRingtone] = useState(false);

    useEffect(() => {
        if(auth?.token){
            dispatch(getDoctorLogin(auth?.token));
        }
    }, []);

    useEffect(() => {
        if (currentDoctor?.id && auth?.token) {
            const data = { receiver_id: currentDoctor?.id }
            dispatch(countUnreadNotify(data))
        }
    }, [currentDoctor]);

    useEffect(() => {
        if (io) {
            //listen when someone call.
            io.on("connect-video-room", (getDoctorID, getSenderData) => {
                if (getDoctorID && !isEmpty(getSenderData)) {
                    setSenderData(getSenderData);
                    setSenderPeerID(getDoctorID);
                    setPlayRingtone(true);
                    setIncomingCall(true);
                }
            });
        }
    }, [currentDoctor, io]);

    useEffect(() => {
        if (playRingtone) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
            audioRef.current.load();
        }
    }, [playRingtone]);

    const logout = () => {
        if(io) {
            dispatch(doctorLogout());
        }
    }

    if (!auth.isLoggedIn) {
        return <Redirect to="/login" />
    }

    const openNofityDrawer = () => {
        setdrawerVisible(true)

    }

    const renderName = () => {
        return (
            <>
                <Popover content={<img className="nav-view-avatar" alt="doctor_avatar" src={currentDoctor?.avatarurl ?? avatar} />}>
                    <Avatar src={currentDoctor?.avatarurl ?? avatar} alt="doctor_avatar" />
                </Popover>
                {currentDoctor?.fullname}
                <Button onClick = {openNofityDrawer} type="link" className="button-notify" >
                    <Badge count={unreadNotifyNumber} dot>
                        Thông báo
                    </Badge>
                </Button>
            </>
        )
    }

    const closeDrawer = () => {
        setdrawerVisible(false)
    }

    const delayLoopRingtone = () => {
        setTimeout(() => {
            audioRef.current.play();
        }, 2000);
    };

    const handleAcceptCall = () => {
        if (senderPeerID) {
            setOpenVideoCall(true);
        } else {
            message.destroy();
            message.error("Không thể kết nối với đối phương!", 4);
        }
        setPlayRingtone(false);
        setIncomingCall(false);
    };

    const handleCancelCall = () => {
        if (io && senderData) {
            io.emit("cancel-video", senderData?.id + "customer");
            message.destroy();
            message.info("Đã từ chối cuộc gọi");
            setPlayRingtone(false);
            setIncomingCall(false);
            setSenderData(null);
            setSenderPeerID(null);
        }
    };

    const closeWindowPortal = () => {
        if (openVideoCall) {
            setOpenVideoCall(false);
            setIncomingCall(false);
            setSenderData(null);
            setSenderPeerID(null);
        }
    };

    window.onbeforeunload = (e) => {
        //cancel call if doctor reload page when a call is coming.
        if (incomingCall && io && senderData) {
            handleCancelCall();
        }
    };

    return (
        <div>
            <Notification visible={drawerVisible} closeDrawer={closeDrawer} />
            {openVideoCall && (
                <Portal
                    url={`${process.env.PUBLIC_URL}/call/video/${senderData?.id}?name=${senderData?.name}&avatar=${senderData?.avatar}&distract=${senderPeerID}`}
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
                    <Button key="accept" type="primary" loading={isLoad} onClick={() => handleAcceptCall()}>
                        Trả lời
                    </Button>,
                    <Button key="decline" onClick={() => handleCancelCall()} danger>
                        Từ chối
                    </Button>
                ]}
            >
                <div className="video-call-incoming">
                    <Avatar src={senderData?.avatar} alt={senderData?.name ?? "customer_name"} size="large" type="circle flexible" />
                    <b>{senderData?.name} gọi video cho bạn.</b>
                </div>
            </Modal>
            <PageHeader
                className="site-page-header-responsive"
                title={<Link to = "/" className="verify-email-logo"><img alt="Ikemen_Doc_Logo" src={logo} /></Link>}
                extra={[
                    <b style={{fontSize: "1rem"}}>{isLoad ? <Skeleton /> : renderName()}</b>,
                    <Button type="primary" onClick={logout}>Đăng xuất</Button>,
                ]}
                footer={
                    <Menu selectedKeys={[location.pathname]} mode="horizontal">
                        <Menu.Item key="/">
                            <Link className="navbar-item" to="/">Yêu cầu mới</Link>
                        </Menu.Item>
                        <Menu.Item key="/timetable">
                            <Link className="navbar-item" to="/timetable">Lịch làm việc</Link>
                        </Menu.Item>
                        <Menu.Item key="/package">
                            <Link className="navbar-item" to="/package">Các gói điều dưỡng</Link>
                        </Menu.Item>
                        <Menu.Item key="/viewServiceCategory">
                            <Link className="navbar-item" to="/viewServiceCategory">Dịch vụ</Link>
                        </Menu.Item>
                        <Menu.Item key="/newService">
                            <Link className="navbar-item" to="/newService">Đề xuất dịch vụ</Link>
                        </Menu.Item>
                        <Menu.Item key="/viewForm">
                            <Link className="navbar-item" to="/viewForm">Mẫu văn bản</Link>
                        </Menu.Item>
                        <Menu.Item key="/profile">
                            <Link className="navbar-item" to="/profile">Thông tin của tôi</Link>
                        </Menu.Item>
                    </Menu>
                }
            >
            </PageHeader>
        </div>
        // <div className="logo">
        //     <img src={logo} alt="Logo" />
        // </div>
    )
}

export default withRouter(Navbar);
