import React, { useEffect, useState } from 'react';
import priorityData from "../../configs/prioritiy"
import { Select, Tag, Input, InputNumber, Button, Form } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import _ from "lodash"
import { updateAppointmentPackage } from '../../redux/package';
import { withRouter } from 'react-router-dom';
import appointment_status from "../../configs/appointment_status"

const Info = (props) => {

    const [form] = Form.useForm();
    const layout = {
        labelCol: { span: 24 },
        wrapperCol: { span: 24 },
    };

    const { currentAppointment } = props;

    const { appointment_service } = props?.currentAppointment

    const getCurrentService = !_.isEmpty(appointment_service) ? appointment_service.map((value, index) => {
        return (
            value.id
        )
    }) : []

    const [services, setservices] = useState([]);


    const dispatch = useDispatch()
    const { packageData } = useSelector(state => state.package)
    const doctor = useSelector(state => state.doctor);
    const { token } = useSelector(state => state.auth)
    const { isLoad } = useSelector(state => state.ui)
    const [note, setnote] = useState('');
    const [disable, setdisable] = useState(false);

    
    useEffect(() => {

        setservices(getCurrentService)
        setnote(currentAppointment?.note)
        form.resetFields()


    }, [currentAppointment]);
    


    const renderServices = packageData?.services?.map((value, index) => {
        return (
            <Select.Option key={value?.id}>
                <Tag
                    className="service-tag"
                    color={priorityData[`${value?.priority}`].color}>{value?.name}</Tag>
                <br />
            </Select.Option>
        )
    })

    const handleChange = (value) => {
        setservices(value)
    }

    const submitForm = values => {
        try {
            setdisable(true);
            let data = { ...values };
            let doctorId = doctor?.currentDoctor?.id
            let appointmentId = currentAppointment.id
            let packageId = props.match.params.id
            data.note = note;
            data.token = token;
            if((currentAppointment.status_id === appointment_status.dueDate) ) {
                data.services = services.map((value, index) => {
                    return { package_service_id: value }
                })
            } else {
                data.editResult = true
            }
            dispatch(updateAppointmentPackage(data, appointmentId, doctorId, packageId))

            props.close()
        } catch (error) {
            console.log(error);
        } finally {
            form.resetFields()
            setnote('')
            setTimeout(() => {
                setdisable(false);
            }, 800);
        }
    };

    const onFinishFailed = errorInfo => {
        // console.log('Failed:', errorInfo);
    };

    const onNoteChange = (e) => {
        setnote(e.target.value)
    }

    return (
        <div>
            <h2 className="label-info">- Các dịch vụ</h2>
            <Select
                mode="multiple"
                disabled = {!props.checkIfAppointmentNotExpire()}
                style={{ width: '100%' }}
                placeholder="Chọn dịch vụ"
                value={services}
                onChange={handleChange}
            >
                {renderServices}
            </Select>
            <h2 className="label-info">- Ghi chú</h2>
            <Input.TextArea value={note} onChange={onNoteChange} />
            <h2 className="label-info">- Các số liệu</h2>

            <Form
                {...layout}
                name="basic"
                form={form}
                initialValues={currentAppointment}
                onFinish={submitForm}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    label='Huyết áp tâm trương / mmHg'
                    name='diastolic'
                    rules={[{ type: 'number', min: 0, max: 300, message: 'Điền số liệu thích hợp' }]}
                >
                    <InputNumber
                    // onChange={onChange}
                    />
                </Form.Item>
                <Form.Item
                    label='Huyết át tâm thu / mmHg'
                    name='systolic'
                    rules={[{ type: 'number', min: 0, max: 300, message: 'Điền số liệu thích hợp' }]}
                >
                    <InputNumber
                    // onChange={onChange}
                    />
                </Form.Item>
                <Form.Item
                    label='Mạch / nhịp/phút'
                    name='pulse'
                    rules={[{ type: 'number', min: 0,  max: 220, message: 'Điền số liệu thích hợp' }]}
                >
                    <InputNumber
                    />
                </Form.Item>
                <Form.Item
                    label='Nhiệt độ °C'
                    name='temperature'
                    rules={[{ type: 'number', min: 0, max: 50, message: 'Điền số liệu thích hợp' }]}
                >
                    <InputNumber
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        loading={disable || isLoad}
                        type="primary"
                        htmlType="submit" >Lưu</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default withRouter(Info);