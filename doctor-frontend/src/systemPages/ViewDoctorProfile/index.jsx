import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { Spin } from 'antd';
import { withRouter } from 'react-router-dom';
import {
    getDoctorDetail, changeDoctorPassword
} from '../../redux/doctor';

import detailCertificate from "../../assest/Doctor_detail_certificate.png";
import detailLanguages from "../../assest/Doctor_detail_Languages.png";
import detailLicense from "../../assest/Doctor_detail_license.png";

import './style.css';
import { Timeline } from 'antd';
import Navbar from '../../components/Navbar';
import { Modal, Button } from 'antd';
import { Input, Space, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

const ViewpatientProfile = (props) => {

    const dispatch = useDispatch();
    const { isLoad } = useSelector(state => state.ui);
    const { currentDoctor } = useSelector(state => state.doctor);
    const { doctorDetail } = useSelector(state => state.doctor);
    const { token } = useSelector(state => state.auth);
    const { doctorUpdated } = useSelector(state => state.doctor);
    const [visible, setVisible] = useState(false);
    const [currentPass, setCurrentPass] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    useEffect(() => {
        window.scrollTo(0, 0)
        dispatch(getDoctorDetail(currentDoctor?.id));
    }, []);

    const renderExperience = doctorDetail?.doctorExperience?.map((value, index) => {
        return (
            <Timeline.Item key={value.id}>{value?.content}</Timeline.Item>
        )
    });

    const renderLanguages = doctorDetail?.doctorLanguage?.map((value, index) => {
        if (index === 0) {
            return (
                <span className="doctor-detail-info">
                    {value?.degree_name}
                </span>
            )
        }
        else return (
            <span>
                <span className="primary-dot">-</span>
                <span className="doctor-detail-info">
                    {value?.degree_name}
                </span>
            </span>
        )
    });

    const renderDegree = doctorDetail?.doctorDegrees?.map((value, index) => {
        if (index === 0) {
            return (
                <span className="doctor-detail-info">
                    {value?.degree_name}
                </span>
            )
        }
        else return (
            <span>
                <span className="primary-dot">-</span>
                <span className="doctor-detail-info">
                    {value?.degree_name}
                </span>
            </span>
        )
    });

    const showModal = () => {
        setVisible(true);

    };

    const handleOk = e => {
        setVisible(false);
        dispatch(changeDoctorPassword(currentDoctor?.id, currentPass, newPassword, confirmNewPassword, token));

    };

    const handleCancel = e => {
        setVisible(false)
    };

    const currentPassword = (e) => {
        console.log(isLoad);
        setCurrentPass(e.target.value);
    }

    const newPass = (e) => {
        setNewPassword(e.target.value);
    }

    const confirmNewPass = (e) => {
        setConfirmNewPassword(e.target.value);
    }


    return (
        <div className="default-div">
            <Navbar />
            <Spin size="large" spinning={isLoad}  >
                <div className="doctor">
                    <div className="detail-contain detail-main-about">
                        <div className="doctor-avatar"
                            style={{ backgroundImage: `url(${doctorDetail?.doctor?.avatarurl})` }}
                        >
                        </div>
                        <div className="detail-content">
                            <div className="detail-title">
                                BS . {doctorDetail?.doctor?.fullname}
                            </div>
                        Địa chỉ:
                        <div className="doctor-info-div doctor-address-div">
                                {doctorDetail?.doctor?.address}
                            </div>
                        Email:
                        <div className="doctor-info-div doctor-email-div">
                                {doctorDetail?.doctor?.email}
                            </div>
                        Giới tính:
                        <div className="doctor-info-div doctor-gender-div">
                                {doctorDetail?.doctor?.gender === "Male" ? "Nam" : "Nữ"}
                            </div>
                        Liên lạc:
                        <div className="doctor-info-div doctor-phone-div">
                                {doctorDetail?.doctor?.phone}
                            </div>
                            <center>
                                <div >
                                    <button className="doctor-info-div doctor-changepass-div" onClick={showModal}>Đổi mật khẩu</button>
                                    <div>
                                        <Modal
                                            title="Thay đổi mật khẩu"
                                            visible={visible}
                                            onOk={handleOk}
                                            onCancel={handleCancel}
                                        >
                                            <Space direction="vertical">
                                                Mật khẩu:
                                            <Input.Password placeholder="input password" onChange={currentPassword} />
                                            Mật khẩu mới:
                                            <Input.Password
                                                    placeholder="input password"
                                                    onChange={newPass}
                                                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                                />
                                            Xác nhận lại mật khẩu mới:
                                            <Input.Password
                                                    placeholder="input password"
                                                    onChange={confirmNewPass}
                                                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                                />
                                            </Space>
                                        </Modal>
                                    </div>
                                </div>
                            </center>
                            <div className="seperator" />

                        </div>
                    </div>
                    <div className="detail-contain doctor-infor-div">
                        <div className="detail-title">
                            Thông tin
                    </div>
                        <div className="seperator" />
                        <div className="detail-list">
                            <div className="detail-list-item">
                                <div className="detail-list-item-top">
                                    <img alt="language"
                                        src={detailLanguages}
                                    />
                                </div>
                                <div className="detail-list-describe">Giao tiếp</div>
                                <div className="detail-list-description">
                                    {renderLanguages}
                                </div>
                            </div>
                            <div className="detail-list-item">
                                <div className="detail-list-item-top">
                                    <img alt="certificate"
                                        src={detailCertificate}
                                    />
                                </div>
                                <div className="detail-list-describe">Học vấn</div>
                                <div className="detail-list-description">
                                    {renderDegree}
                                </div>
                            </div>
                            <div className="detail-list-item">
                                <div className="detail-list-item-top">
                                    <img alt="license"
                                        src={detailLicense}
                                    />
                                </div>
                                <div className="detail-list-describe">Chứng chỉ hành nghề</div>
                                <div className="detail-list-description doctor-detail-info">
                                    {doctorDetail?.doctor?.license}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="detail-contain">
                        <div className="detail-title">
                            Kinh nghiệm
                    </div>
                        <div className="seperator" />

                        <div className="doctor-experiece">
                            <Timeline>
                                {renderExperience}
                            </Timeline>
                        </div>
                    </div>
                </div>
            </Spin>
        </div>
    )
}

export default withRouter(ViewpatientProfile);