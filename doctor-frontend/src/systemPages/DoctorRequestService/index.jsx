import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { Spin } from 'antd';
import { withRouter } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { Form, Input, InputNumber, Button } from 'antd';
import {
    requestNewService,
    getAllServiceRequest
} from '../../redux/doctor';

import './style.css';
import { Table } from 'antd';

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
};

const validateMessages = {
    required: '${label} bị trống!',
    types: {
        number: '${label} không phải là số!',
    },
    number: {
        range: '${label} phải nằm trong khoảng từ ${min} đến ${max}',
    },

};


const DoctorRequestService = (props) => {

    const dispatch = useDispatch();
    const { isLoad } = useSelector(state => state.ui);
    const [service, setService] = useState(props?.service ?? {});
    const { currentDoctor } = useSelector(state => state.doctor);
    const { serviceRequest } = useSelector(state => state.doctor);


    useEffect(() => {
        dispatch(getAllServiceRequest(currentDoctor?.id));
    }, []);


    const onFinish = values => {
        console.log(values);
        dispatch(requestNewService(currentDoctor?.id, values));
        setService({});
        // const timer = setTimeout(() => window.location.reload(), 1000);
        // return () => clearTimeout(timer);
    };

    // console.log('servicerequest: ', serviceRequest);

    const columns = [
        { title: 'Tên', dataIndex: 'name', key: 'name' },
        { title: 'Giá', 
        dataIndex: 'price', 
        key: 'price',
    },
        { title: 'Ngày tạo', 
        dataIndex: 'createdAt', 
        key: 'createdAt' ,
    },

    ];



    return (
        <div className="default-form-div">
            <Navbar />
            <Spin size="large" spinning={isLoad}  >

                <div className="doctorform-div">
                <h2 style={{ margin: 0, color: '#1f8ffc' }}>Bạn muốn yêu cầu cung cấp thêm dịch vụ hoặc thay đổi thống tin dịch vụ hiện có?
                        </h2>
                    <p>Hãy điền vào form dưới đây:</p>
                    <div className="form-content-div">

                        <div className="adding-form-div">
                            <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
                                <Form.Item name={['data', 'name']} label="Tên dịch vụ" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item name={['data', 'description']} label="Mô tả" rules={[{ required: true }]}>
                                    <Input.TextArea />
                                </Form.Item>
                                <Form.Item name={['data', 'price']} label="Giá" rules={[{ type: 'number', min: 0, max: 990000 }]}>
                                    <InputNumber />
                                </Form.Item>
                                <Form.Item name={['data', 'reason']} label="Lý do" rules={[{ required: true }]}>
                                    <Input.TextArea placeholder="Hãy điền lý do muốn thêm dịch vụ" />
                                </Form.Item>
                                <center>
                                    <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                                        <Button type="primary" htmlType="submit">
                                            Gửi
                                        </Button>
                                    </Form.Item>
                                </center>
                            </Form>
                        </div>
                    </div>
                    <h2 style={{ margin: 0, color: '#1f8ffc' }}>Lịch sử những yêu cầu của bạn</h2>

                    <div className="view-request-div">
                        <Table
                            columns={columns}
                            expandable={{
                                expandedRowRender: record =>
                                    <div className="request-info-div">
                                        <div className="request-info-left-div">
                                            <h3 style={{ margin: 0, color: '#1f8ffc' }}>Mô tả</h3> <p >{record.description}</p>
                                            <h3 style={{ margin: 0, color: '#1f8ffc' }}>Lý do</h3> <p >{record.reason}</p>
                                        </div>
                                        <div className="request-info-right-div">
                                            <h3 style={{ margin: 0, color: '#ff4d4f' }}>Phản hồi từ Admin</h3> <p >{record.response}</p>
                                        </div>
                                    </div>,
                                rowExpandable: record => record.name !== 'Not Expandable',
                            }}
                            dataSource={serviceRequest}
                        />
                    </div>
                    

                </div>
            </Spin>
        </div>
    );
}

export default withRouter(DoctorRequestService);