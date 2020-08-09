import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, Link, withRouter } from 'react-router-dom';
import { getDoctorLogin } from '../../redux/doctor';
import { doctorLogout } from '../../redux/auth';
import { PageHeader, Tabs, Button, Menu, Badge } from 'antd'
import Skeleton from "react-loading-skeleton";
import logo from '../../logo.svg';
import './style.css';
import Notification from '../Notification';
import { countUnreadNotify } from '../../redux/notification';


const Navbar = (props) => {
    const auth = useSelector(state => state.auth);
    const { isLoad } = useSelector(state => state.ui);
    const { currentDoctor } = useSelector(state => state.doctor);
    const dispatch = useDispatch();
    const [drawerVisible, setdrawerVisible] = useState(false);
    const { unreadNotifyNumber } = useSelector(state => state.notify);


    const { location } = props;

    useEffect(() => {
        dispatch(getDoctorLogin(auth?.token));
    }, []);

    useEffect(() => {
        if (currentDoctor?.id) {
            const data = { receiver_id: currentDoctor?.id }
            dispatch(countUnreadNotify(data))
        }
    }, [currentDoctor]);

    const logout = () => {
        dispatch(doctorLogout());
    }

    if (!auth.isLoggedIn) {
        return <Redirect to="/login" />
    }

    const openNofityDrawer = () => {
        setdrawerVisible(true)

    }

    const renderName = () => {
        return (
            <div>
                {currentDoctor?.fullname}
                <Button onClick = {openNofityDrawer} type="link" className="button-notify" >
                    <Badge count={unreadNotifyNumber} dot>
                        Thông báo
                    </Badge>
                </Button>
            </div>
        )
    }

    const closeDrawer = () => {
        setdrawerVisible(false)
    }


    return (
        <div>
            <Notification visible={drawerVisible} closeDrawer={closeDrawer} />
            <PageHeader
                className="site-page-header-responsive"
                title={isLoad ? <Skeleton /> : renderName()}
                extra={[
                    <Button type="primary" onClick={logout}>Đăng xuất</Button>
                    ,
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
                        <Menu.Item key="/profile">
                            <Link className="navbar-item" to="/profile">Thông tin của tôi</Link>
                        </Menu.Item>
                        <Menu.Item key="/newService">
                            <Link className="navbar-item" to="/newService">Đề xuất dịch vụ</Link>
                        </Menu.Item>
                        <Menu.Item key="/viewForm">
                            <Link className="navbar-item" to="/viewForm">Mẫu văn bản</Link>
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
