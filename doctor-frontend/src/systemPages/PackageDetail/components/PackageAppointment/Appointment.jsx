import React, { useEffect, useState } from 'react';
import { Tag, Button } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import slot from "../../../../configs/slot";
import priorityData from "../../../../configs/prioritiy"
import package_appointment_status from "../../../../configs/package_appointment_status"
import _ from "lodash";
import moment from "moment"
import Modal from 'antd/lib/modal/Modal';
import AppointmentDetail from '../../../../components/AppointmentDetail';

const Appointment = (props) => {


    const { packageData } = useSelector(state => state.package)
    let chosenStyle = {
        position: 'absolute',
        top: '0',
        bottom: '0',
        right: '0',
        left: '0',
        backgroundColor: '#F5ED05',
        opacity: '0.3',
    }

    const appointmentId = props.location.hash;

    const [style, setstyle] = useState(chosenStyle);
    const [showAppointmentDetailModal, setshowAppointmentDetailModal] = useState(false);
    const [currentAppointment, setcurrentAppointment] = useState({});

    const handleCancel = () => {
        setshowAppointmentDetailModal(false)
    }

    const openAppointmentDetailModal = (value) => {
        setcurrentAppointment(value)
        setshowAppointmentDetailModal(true)

    }

    const debounceStyle = _.debounce(() => {
        setstyle({ display: 'none' })
    }, 1000)

    const doDebounce = () => {
        debounceStyle()
    }

    useEffect(() => {
        setstyle(chosenStyle)

        doDebounce()

    }, [appointmentId]);



    const renderServices = (appointment_service) => !_.isEmpty(appointment_service) ? appointment_service?.map((value, index) => {
        return (
            <a key={value.id} href={`#${value?.id}`}>
                <Tag className="service-tag" color={priorityData?.[`${value?.priority}`].color}>{value?.service_name}</Tag>
            </a>
        )
    }) : <span className="hightlight">Hiện chưa thêm dịch vụ nào </span>

    const renderAppointments = packageData?.appointments?.map((value, index) => {
        return (
            <div className="package-appointment-list-item"
                id={value?.id}
                style={{ borderLeft: `10px solid ${package_appointment_status?.[`${value?.status_id}`]?.color}` }}
                key={value?.id}>
                <div className="package-service-description-chosen"
                    style={
                        (appointmentId === `#${value.id}`) ? style : {}
                    }
                >
                </div>

                <p className="hightlight package-appointment-date">{moment(value?.date).format("DD - MM - YYYY")}</p>
                <p> Slot : {value?.slot_id} từ ( {slot?.[`${value?.slot_id}`]?.from} - {slot?.[`${value?.slot_id}`]?.to}  ) </p>
                <div className="package-service-item">
                    Dịch vụ sử dụng : {renderServices(value?.appointment_service)}
                </div>
                <br />
                <div>
                    Note : {value?.note ?? 'Không có ghi chú gì'}
                </div>
                <div className="status-detail">
                    <div>
                        Trạng thái hiện tại : <Tag color={package_appointment_status?.[`${value?.status_id}`]?.color} > {value?.status_name} </Tag>
                    </div>
                    <Button type="link" onClick={() => openAppointmentDetailModal(value)}>Xem thêm</Button>
                </div>
            </div >
        )
    })

    return (
        <div className="package-appointment-list">
            <p className="package-service-title">Các buổi hẹn</p>
            <div className="package-appointment-list-appointment">
                {renderAppointments}
            </div>
            <Modal
                visible={showAppointmentDetailModal}
                onCancel={handleCancel}
                width={'90%'}
                footer={[

                ]}
            // onOk={handleOk}
            >
                <AppointmentDetail
                    currentAppointment={currentAppointment}
                    close = {handleCancel}
                />
            </Modal>
        </div>
    );
};

export default withRouter(Appointment);