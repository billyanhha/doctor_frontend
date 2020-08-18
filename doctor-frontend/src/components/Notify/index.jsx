import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from "lodash";
import { notification } from 'antd';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import { saveIoInstance, clearIoInstance, markReadNotify, getDoctorNotification, countUnreadNotify } from '../../redux/notification';

const Notify = () => {

    const notify = useSelector(state => state.notify);
    const {currentDoctor} = useSelector(state => state.doctor);
    const { token } = useSelector(state => state.auth);

    const dispatch = useDispatch();

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



    return !_.isEmpty(token) ? (
        <div>
            {getMessage()}
        </div>
    ) : '';
};

export default Notify;