import React from 'react';
import { Tabs, Button, Descriptions, PageHeader, Popconfirm, message, Tag } from 'antd';
import './style.css';
import Info from './Info';
import { useEffect } from 'react';
import moment from "moment";
import slot from "../../configs/slot"
import appointment_status from "../../configs/appointment_status"
import package_appointment_status from "../../configs/package_appointment_status"
import { useSelector, useDispatch } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { updateAppointmentPackage } from '../../redux/package';
import FormResult from './FormResult';
import { getForm } from '../../redux/form';

const { TabPane } = Tabs;

const AppointmentDetail = (props) => {

    const { currentAppointment } = props;

    const dispatch = useDispatch()
    const doctor = useSelector(state => state.doctor);
    const { token } = useSelector(state => state.auth)

    useEffect(() => {

        dispatch(getForm('appointment_result_form'))

    }, [currentAppointment]);

    const callback = (key) => {
    }

    const confirm = (value) => {
        if(value === appointment_status.done){
            const {pulse, systolic, temperature, diastolic} = currentAppointment
            if(!pulse || !systolic || !temperature || !diastolic ){
                message.destroy()
                message.error("Bạn chưa gửi toàn bộ các chỉ số về mạch , huyết áp , nhiệt độ của bệnh nhân")
                return
            }
        }
        let data = {}
        data.appointment_status_id = value
        data.token = token;
        let doctorId = doctor?.currentDoctor?.id
        let appointmentId = currentAppointment.id
        let packageId = props.match.params.id
        dispatch(updateAppointmentPackage(data, appointmentId, doctorId, packageId))
        props.close()
    }



    const cancel = (e) => {
    }

    

    const checkIfAppointmentNotExpire = () => { // doctor cancle , user cancle , done
        return (currentAppointment.status_id === appointment_status.pending)
            ||
            (currentAppointment.status_id === appointment_status.dueDate)
    }



    return (
        <div>
            <PageHeader
                className="site-page-header-responsive"
                title={`Cuộc hẹn vào ${moment(currentAppointment?.date).format("DD - MM - YYYY")} `}
                subTitle={`Slot : ${currentAppointment?.slot_id} từ ( ${slot?.[`${currentAppointment?.slot_id}`]?.from} - ${slot?.[`${currentAppointment?.slot_id}`]?.to}  ) `}
                extra={
                    checkIfAppointmentNotExpire() &&
                    [
                        <Popconfirm
                            title="Xác nhận hoàn thành cuộc hẹn"
                            onConfirm={(e) => confirm(appointment_status.done)}
                            placement="bottom"
                            onCancel={cancel}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <Button type="primary" key="1">Hoàn thành</Button>
                        </Popconfirm>
                        ,
                        <Popconfirm
                            title="Xác nhận hủy cuộc hẹn"
                            onConfirm={(e) => confirm(appointment_status.doctorCancel)}
                            placement="bottom"
                            onCancel={cancel}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <Button type="danger" key="2">Hủy</Button>
                        </Popconfirm>
                        ,
                    ]}
                footer={
                    <Tabs defaultActiveKey="1" onChange={callback}>
                        <TabPane tab="Thông tin gói" key="1">
                            <Info checkIfAppointmentNotExpire={checkIfAppointmentNotExpire}
                                close={() => props.close()} currentAppointment={currentAppointment} />
                        </TabPane>
                        <TabPane tab="Ghi chú kết quả" key="2">
                            <FormResult close={() => props.close()} currentAppointment={currentAppointment} />
                        </TabPane>
                       
                    </Tabs>
                }
            >
                <Descriptions size="small" column={3}>
                    <Descriptions.Item label="Thuộc gói">
                        <Link target="_blank" to={"/package/" + currentAppointment?.package_id} className="hightlight">{currentAppointment?.package_id}</Link>
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                        <div>
                            <Tag color={package_appointment_status?.[`${currentAppointment?.status_id}`]?.color} > {currentAppointment?.status_name} </Tag>
                        </div>
                    </Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ">
                        <p className="hightlight">{currentAppointment?.address}</p>
                    </Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">
                        <p className="hightlight">{currentAppointment?.phone}</p>
                    </Descriptions.Item>
                </Descriptions>
            </PageHeader>
        </div>
    );
};

export default withRouter(AppointmentDetail);
