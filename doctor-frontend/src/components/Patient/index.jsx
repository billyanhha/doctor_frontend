import React, { useEffect, useState } from 'react';
import { Modal, Timeline, Spin } from 'antd';
import { useSelector } from 'react-redux';
import { ClockCircleOutlined } from '@ant-design/icons';
import Button from 'antd/lib/button/button';
import DoctorGoogleMap from '../DoctorGoogleMap';
import Geocode from "react-geocode";

Geocode.setApiKey("AIzaSyCI6EYzveNjHPdKPtWuGFNhblfYECyGxvw");
Geocode.enableDebug();

const Patient = (props) => {

    const { patientInfo } = useSelector(state => state.patient);
    const { currentDoctor } = useSelector(state => state.doctor);
    const { isLoad } = useSelector(state => state.ui);
    const [patientAddress, setPatientAddress] = useState({});
    const [doctorAddress, setDoctorAddress] = useState({});
    const [ready, setReady] = useState(false);

    const size = (obj) => {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

    useEffect(() => {
        console.log(props);
        Geocode.fromAddress(props.patientAddress).then(
            response => {
                const { lat, lng } = response.results[0].geometry.location
                setPatientAddress({ lat, lng });
            },
            error => {
                console.error(error);
            }
        );
        Geocode.fromAddress(props.doctorAddress).then(
            response => {
                const { lat, lng } = response.results[0].geometry.location
                setDoctorAddress({ lat, lng });
            },
            error => {
                console.error(error);
            }
        );
    }, []);

    useEffect(() => {
        if(size(patientAddress)>0 && size(doctorAddress)>0){
            setReady(true);
        }
    }, [patientAddress, doctorAddress]);

    return (
        <div>
            <Modal
                title="Thông tin bệnh nhân"
                visible={props.visible}
                onCancel={props.handleCancel}

                handle={props.handleCancel}
                footer={[
                    <Button onClick={props.handleCancel}>Quay lại</Button>
                ]}
            >
                <div>
                    <Spin size="large" spinning={isLoad}  >

                        <div className="profile-div">
                            <div className="profile-content">
                                <div className="profile-form-update">
                                    <div className="profile-info">
                                        <div className="profile-avatar-div">
                                            <img id="Avatar-profile" src={patientInfo?.avatarurl} alt="Avatar" />
                                        </div>
                                    </div>
                                    <div className="main-form">
                                        <Timeline>
                                            <Timeline.Item><p className="profile-form-label">Họ và tên</p>{patientInfo?.fullname}</Timeline.Item>
                                            <Timeline.Item><p className="profile-form-label">Giới tính</p>{patientInfo?.gender}</Timeline.Item>
                                            <Timeline.Item dot={<ClockCircleOutlined className="timeline-clock-icon" />} color="red"><p className="profile-form-label">Sinh nhật</p>
                                                {patientInfo?.dateofbirth}</Timeline.Item>
                                            <Timeline.Item><p className="profile-form-label">Địa chỉ</p>
                                                {patientInfo?.address}</Timeline.Item>
                                        </Timeline>
                                    </div>
                                </div>
                                <div style={{ width: '400px', height: '400px' }}>
                                    {ready && <DoctorGoogleMap patientAddress={patientAddress} doctorAddress={doctorAddress}/>}
                                </div>
                            </div>
                        </div>
                    </Spin>
                </div>
            </Modal>
        </div>
    );
};

export default Patient;