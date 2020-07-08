import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { Spin } from 'antd';
import { withRouter } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { Form, Input, InputNumber, Button } from 'antd';
import { Tag } from 'antd';
import _ from "lodash";
import priorityData from "../../configs/prioritiy";
import sService from '../../service/sService';
import {
    requestNewService,
    getAllServiceRequest
} from '../../redux/doctor';

import AsyncPaginate from "react-select-async-paginate";
import './style.css';
import { Table } from 'antd';

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
};

const validateMessages = {
    required: '${label} bị trống!',
    types: {
        number: '${label} is not a validate number!',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    },

};


const DoctorRequestService = (props) => {

    const dispatch = useDispatch();
    const { isLoad } = useSelector(state => state.ui);
    const [service, setservice] = useState(props?.service ?? {});
    const { currentDoctor } = useSelector(state => state.doctor);
    const { serviceRequest } = useSelector(state => state.doctor);


    useEffect(() => {
        dispatch(getAllServiceRequest(currentDoctor?.id));
    }, []);


    const onFinish = values => {
        console.log(values);
        dispatch(requestNewService(currentDoctor?.id, values));
        const timer = setTimeout(() => window.location.reload(), 1000);
        return () => clearTimeout(timer);
    };

    console.log('servicerequest: ', serviceRequest);

    const loadOptions = async (search, loadedOptions, { page }) => {
        try {
            // console.log(search, ' ',page);
            const response = await sService.getServiceQuery({ query: search, page: page, sortBy: 'name' });
            // console.log(response);
            return {
                options: response?.services?.result,
                hasMore: !response?.services?.isOutOfData,
                additional: {
                    page: page + 1,
                },
            };
        } catch (error) {
            console.log(error);
        }
    }

    const Option = (props) => {
        const option = { ...props?.data };

        return (
            <div className="service-select" ref={props.innerRef} {...props.innerProps}>
                <p className="service-select-name">{option?.name}</p>
                <p className="service-select-description">{option?.description}</p>
                <p>{option?.price + " ₫"}</p>
            </div>
        )
    }

    const onChange = (value) => {
        setservice(value)
    }

    const columns = [
        { title: 'Tên', dataIndex: 'name', key: 'name' },
        { title: 'Giá', 
        dataIndex: 'price', 
        key: 'price',
        sorter: (a, b) => a.price - b.price,
    },
        { title: 'Ngày tạo', 
        dataIndex: 'createdAt', 
        key: 'createdAt' ,
        sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
    },

    ];



    return (
        <div className="default-form-div">
            <Navbar />
            <Spin size="large" spinning={isLoad}  >
                <div className="search-service-div">
                    <h2 style={{ margin: 0, color: '#1f8ffc' }}>Những dịch vụ mà hệ thống đang sử dụng</h2>
                    <AsyncPaginate
                        loadOptions={loadOptions}
                        debounceTimeout={300}
                        value={service}
                        components={{ Option }} // customize menu
                        additional={{
                            page: 1,
                        }}
                        placeholder={'Dịch vụ'}
                        getOptionLabel={({ name }) => name}
                        defaultOptions
                        cacheOptions
                        isClearable={true}
                        required
                        onChange={onChange}
                    />
                </div>

                <div className="doctorform-div">
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
                    <h2 style={{ margin: 0, color: '#1f8ffc' }}>Bạn muốn yêu cầu cung cấp thêm dịch vụ hoặc thay đổi thống tin dịch vụ hiện có?
                        </h2>
                    <p>Hãy điền vào form dưới đây:</p>
                    <div className="form-content-div">

                        <div className="adding-form-div">
                            <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
                                <Form.Item name={['data', 'name']} label="Tên dịch vụ" rules={[{ required: true }]}>
                                    <Input value={service?.name} />
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

                </div>
            </Spin>
        </div>
    );
}

export default withRouter(DoctorRequestService);