import React, { useEffect, useState } from 'react';
import './style.css'
import { Drawer, Button, Badge } from 'antd';
import { NotificationOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getDoctorNotification, getMoreDoctorNotification, markReadNotify, markAllRead } from '../../redux/notification';
import moment from "moment";
import {
    FieldTimeOutlined
} from '@ant-design/icons';


const itemsPage = 30

const Notification = (props) => {

    const dispatch = useDispatch()
    const { notifications, isOutOfData } = useSelector(state => state.notify);
    const { currentDoctor } = useSelector(state => state.doctor);
    const { isLoad } = useSelector(state => state.ui);
    const { unreadNotifyNumber } = useSelector(state => state.notify);

    const [page, setpage] = useState(1);
    const [disable, setdisable] = useState(false);

    useEffect(() => {

        if (currentDoctor?.id) {
            const data = { id: currentDoctor?.id, itemsPage: itemsPage, page: page }
            dispatch(getDoctorNotification(data))
        }



    }, [currentDoctor]);

    const getMoreDoctorNotificationData = () => {
        setdisable(true)
        let currentPage = page;
        const data = { id: currentDoctor?.id, itemsPage: itemsPage, page: ++currentPage }
        setpage(currentPage)
        dispatch(getMoreDoctorNotification(data))
        setTimeout(() => {
            setdisable(false)
        }, 1000);
    }

    const markAllReadFunc = () => {
        const data = { id: currentDoctor?.id, itemsPage: itemsPage, page: 1, receiver_id: currentDoctor?.id };
        dispatch(markAllRead(data))

    }

    const renderHeader = () => {
        return (
            <div className="drawer-header">
                <div>
                    <Badge count={unreadNotifyNumber} showZero>
                        <h3>Thông báo <NotificationOutlined /></h3>
                    </Badge>
                </div>
                <Button onClick={markAllReadFunc} type="link" primary>
                    Đánh dấu tất cả là đã xem
                </Button>
            </div>
        )
    }


    const markReadNotifyFunc = (value) => {
        if (!value?.is_read) {
            const data = { id: value?.id, is_read: true }
            dispatch(markReadNotify(data))
        }
        window.location.href = (value?.url)
    }

    const renderNotify = notifications.map((value, index) => {
        return (
            <div key={value?.id} onClick={() => markReadNotifyFunc(value)} className={(!value?.is_read ? "notify-item-nonread " : "notify-item")}>
                <p >
                    <Badge status="processing" />
                    {value?.content}
                </p>
                <div className="notify-date">
                    <FieldTimeOutlined /> {moment(value?.created_at).startOf('hour').fromNow()}
                </div>
            </div>
        )
    })


    return (
        <div className="notify-drawer">
            <Drawer
                title={renderHeader()}
                placement="right"
                drawerStyle={{ maxWidth: '500px' }}
                onClose={props.closeDrawer}
                visible={props.visible}
                bodyStyle={{ padding: 0 }}
            >
                {renderNotify}
                <div className="notify-loadmore">
                    <center>
                        <Button
                            style={{ visibility: `${isOutOfData ? 'hidden' : 'visible'}` }}
                            loading={disable || isLoad}
                            onClick={getMoreDoctorNotificationData} className="notify-loadmore-btn" type="primary">Tải thêm</Button>
                    </center>
                </div>
            </Drawer>
        </div>
    );
};

export default Notification;