import React from 'react';
import { Modal, Timeline, Spin } from 'antd';
import { useSelector } from 'react-redux';
import { ClockCircleOutlined } from '@ant-design/icons';
import Button from 'antd/lib/button/button';

const Patient = (props) => {

    const { patientInfo } = useSelector(state => state.patient);
    const { isLoad } = useSelector(state => state.ui)

    return (
        <div>
            <Modal
                title="Thông tin bệnh nhân"
                visible={props.visible}
                onCancel={props.handleCancel}

                handle = {props.handleCancel}
                footer = {[
                    <Button onClick= {props.handleCancel}>Quay lại</Button>
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
                            </div>
                        </div>
                    </Spin>
                </div>
            </Modal>
        </div>
    );
};

export default Patient;