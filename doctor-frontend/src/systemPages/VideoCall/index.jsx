import React, {useState, useEffect, useLayoutEffect, useRef, createRef, forwardRef, useImperativeHandle} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory, withRouter} from "react-router-dom";
import Peer from "peerjs";

import {message, Tooltip, Avatar} from "antd";
import {LoadingOutlined} from "@ant-design/icons";

import {useCamera} from "./CustomHooks/useCamera";

import calling from "../../assest/images/call.png";
import endCall from "../../assest/images/call-disconnected.png";
import micOn from "../../assest/images/microphone.png";
import micOff from "../../assest/images/block-microphone.png";
import cameraOn from "../../assest/images/video-call.png";
import cameraOff from "../../assest/images/no-video.png";
// import audioOn from "../../assest/images/audio.png";
// import audioOff from "../../assest/images/mute.png";
import close from "../../assest/images/close.png";

import "./style.css";

const VideoCall = props => {
    const receiverID = props.match?.params?.direct;
    /**
     * @param distract = null → NOT an incomming call
     * Detect as an incomming call → @conclusion all param = null (distract, name, avatar)
     */
    const params = new URLSearchParams(props.location.search);
    const senderPeerID = params.get("distract"); //null: this call is a call away (NOT an incomming call).

    // const isCallLoad = useSelector(state => state.call.isCallLoad)
    const {io} = useSelector(state => state.notify);
    const {currentDoctor} = useSelector(state => state.doctor);

    // const history = useHistory();
    const myFaceRef = createRef();
    const oppFaceRef = createRef();
    // const oppFaceRef = useRef(null);

    /**
     * This lib/component will open camera/mic and "streaming" by passing data through react ref into @video tag.
     *
     * @ignore *** streaming, setStreaming ***
     *
     * @exports camera true/false: turn on/off webcam/camera
     * @exports micro true/false: turn on/off micro
     */
    const [
        myStreamData,
        setMyStreamData,
        getVideo,
        setVideo,
        camera,
        setCamera,
        micro,
        setMic,
        isCameraInitialised,
        streaming,
        setStreaming,
        errorStream
    ] = useCamera(myFaceRef);

    const [
        customerStreamData,
        setCustomerStreamData,
        getVideoCustomer,
        setVideoCustomer,
        cameraCustomer,
        setCameraCustomer,
        microCustomer,
        setMicCustomer,
        isCameraInitialisedCustomer,
        streamingCustomer,
        setStreamingCustomer,
        errorStreamCustomer
    ] = useCamera(oppFaceRef);

    // const peer = new Peer(undefined, {
    //     host: "ikemen-api.herokuapp.com",
    //     secure: true,
    //     port: 443,
    //     path: "/peerjs"
    // });

    const peer = new Peer({host: "peerjs-server.herokuapp.com", secure: true, port: 443});

    const [peerID, setPeerID] = useState(null);
    const [toggleAction, setToggleAction] = useState(true); //false: calling action, true: ended call action
    const [viewMyFace, setViewMyFace] = useState(false);
    const [isCallLoad, setIsCallLoad] = useState(true);
    const [isDisconnected, setIsDisconnected] = useState(false);

    const getOppositeName = () => {
        return params.get("name");
    };

    const getOppositeAvatar = () => {
        return params.get("avatar");
    };

    const requestSocketNewCall = () => {
        if (!senderPeerID) {
            /**
             *  @param event
             *  @param receiverID = customerID
             *  @param peerID of doctor
             */
            let senderData = {id: currentDoctor?.id, name: currentDoctor?.fullname, avatar: currentDoctor?.avatarurl};
            io.emit("video-connect", senderData, receiverID + "customer", peerID);
        }
    };

    const handleSocket = () => {
        requestSocketNewCall();

        io.on("cancel-video", () => {
            message.destroy();
            message.info("Bệnh nhân đã huỷ cuộc gọi, cửa sổ này sẽ tự đóng sau 5 giây!", 5);
            setToggleAction(false);
            setTimeout(() => {
                closeWindow();
            }, 5000);
        });

        io.on("connect-video-room-offline", data => {
            console.log("-video-room-offline", data);
            if (data === true) {
                setIsCallLoad(false);
                setIsDisconnected(true);
                message.info("Bệnh nhận không trực tuyến, xin hãy gọi lại sau!", 4);
            }
        });

        // Listen event other disconnected
        io.on("user-disconnected", userId => {
            setIsDisconnected(true);
            message.info("Đối phương đã ngắt kết nối!", 4);
        });
    };

    const closeWindow = () => {
        window.close();
    };

    const viewAllFace = () => {
        setViewMyFace(!viewMyFace);
    };

    const toggleCamera = () => {
        setCamera(!camera);
    };

    const toggleMicro = () => {
        // setMic(!micro);
        if (micro) {
            setMic(false);
        } else {
            setMic(true);
        }
    };

    const actionCall = action => {
        switch (action) {
            case 0: //call again
                // history.replace("/");

                setToggleAction(true);
                // myFaceRef = createRef();
                // setStreaming(true);
                break;
            case 1: //end call
                if (io) {
                    io.emit("cancel-video", receiverID + "customer");
                }
                closeWindow();
                setToggleAction(false);
                // myFaceRef.current = null;
                // setStreaming(false);
                break;

            default:
                break;
        }
    };

    /**
     * this func trigger if customer requests a call to doctor.
     * @description Make a peer call to customer.
     *
     */
    const handlePeerCallToCustomer = customerPeerId => {
        const call = peer.call(customerPeerId, myStreamData);

        //listen when customer answer back (peer answer), and get his/her stream
        call.on("stream", customerVideoStream => {
            setCustomerStreamData(customerVideoStream);
        });
    };

    useEffect(() => {
        //only (senderPeerID != null/false) mean: → only incomming call will trigger this func
        if (!senderPeerID) return;

        /**
         * @require myStreamData had to ready first (defind as a MediaStream Object)
         */
        if (peerID && isCameraInitialised && !isCameraInitialisedCustomer) {
            //wait until streaming data on doctor side is ready!
            console.log("countdown 15s");
            setIsCallLoad(false);
            setTimeout(() => {
                console.log("trigger handlePeerCallToCustomer");
                handlePeerCallToCustomer(senderPeerID);
            }, 9000);
        }
    }, [peerID, isCameraInitialised, isCameraInitialisedCustomer]);

    //demo flow
    useEffect(() => {
        if (toggleAction) {
            //end call
            if (isCallLoad) setIsCallLoad(false);
        } else {
            //call again
            setIsCallLoad(true);
        }
    }, [toggleAction]);

    useEffect(() => {
        message.destroy();
        if (errorStream) message.error(errorStream, 3);
        if (errorStreamCustomer) message.error(errorStreamCustomer, 3);
    }, [errorStream, errorStreamCustomer]);

    useEffect(() => {
        if (io && peerID && currentDoctor?.id) {
            handleSocket();
        }
    }, [io, peerID, currentDoctor]);

    useEffect(() => {
        let streamInit;

        peer.on("open", id => {
            setPeerID(id);
        });

        navigator.mediaDevices.getUserMedia({audio: true, video: true}).then(stream => {
            setMyStreamData(stream);
            streamInit = stream;
        });

        if (!senderPeerID) {
            //senderPeerID = null if Doctor requests a call to Doctor (to socket)
            peer.on("call", call => {
                call.answer(streamInit);
                call.on("stream", customerVideoStream => {
                    setCustomerStreamData(customerVideoStream);
                });
                if (isCallLoad) setIsCallLoad(false);
            });
        }

        peer.on("error", err => {
            console.log("peer error: " + err.message);
            message.info(err.message);
        });
    }, []);

    return (
        <div className="video-call-wrapper">
            <div className="video-call-container">
                {toggleAction ? (
                    <>
                        <div className="call-opposite-camera">
                            <div className="call-opposite-info">
                                <Avatar src={getOppositeAvatar()} alt={getOppositeName()} size="large" type="circle flexible" />
                                <b>{getOppositeName()}</b>
                            </div>
                            {isCallLoad ? (
                                <div>
                                    <LoadingOutlined /> Đang gọi
                                </div>
                            ) : (
                                !isCameraInitialisedCustomer &&
                                !isDisconnected && (
                                    <div>
                                        <LoadingOutlined /> Đang kết nối...
                                    </div>
                                )
                            )}
                            <video ref={oppFaceRef} id="oppVideo" autoPlay />
                        </div>
                        <div className={`call-my-camera ${viewMyFace ? "call-my-camera-full" : ""}`} onClick={() => viewAllFace()}>
                            {viewMyFace && (
                                <div className="call-hover-action">
                                    <div className="call-my-camera-action call-action-image call-action-close">
                                        <img src={close} alt="show-all-face" />
                                    </div>
                                    Thu nhỏ
                                </div>
                            )}
                            {!isCameraInitialised && (
                                <div>
                                    <LoadingOutlined /> Đang khởi tạo...
                                </div>
                            )}
                            <video ref={myFaceRef} id="myVideo" autoPlay />
                        </div>
                    </>
                ) : (
                    <div className="call-waiting">Cuộc gọi đã kết thúc!</div>
                )}
                <div className="call-action-bar">
                    {toggleAction ? (
                        <>
                            {camera ? (
                                <Tooltip title="Tắt Camera">
                                    <div className="call-action-image" onClick={() => toggleCamera()}>
                                        <img src={cameraOn} alt="call-camera" />
                                    </div>
                                </Tooltip>
                            ) : (
                                <Tooltip title="Bật Camera">
                                    <div className="call-action-image call-action-close" onClick={() => toggleCamera()}>
                                        <img src={cameraOff} alt="call-camera" />
                                    </div>
                                </Tooltip>
                            )}
                            <Tooltip title="Kết thúc cuộc gọi" placement="top">
                                <div className="call-action-image call-action-off-image" onClick={() => actionCall(1)}>
                                    <img src={endCall} alt="end-call" />
                                </div>
                            </Tooltip>
                            <Tooltip title={(micro ? "Tắt" : "Bật") + " Micro"}>
                                <div className={`call-action-image ${micro ? "" : "call-action-close"}`} onClick={() => toggleMicro()}>
                                    <img src={micro ? micOn : micOff} alt="call-micro" />
                                </div>
                            </Tooltip>
                        </>
                    ) : (
                        <>
                            {/* <Tooltip title="Gọi lại">
                                <div className="call-action-image" onClick={() => actionCall(0)}>
                                    <img src={calling} alt="calling" />
                                </div>
                            </Tooltip> */}
                            <Tooltip title="Đóng">
                                <div className="call-action-image call-action-close" onClick={() => closeWindow()}>
                                    <img src={close} alt="closeWindow" />
                                </div>
                            </Tooltip>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default withRouter(VideoCall);
