import React, { useState, useEffect } from 'react';
import '../style.css'
import { Button, Input, Dropdown, Menu, Tag, message } from 'antd';
import AsyncPaginate from "react-select-async-paginate";
import sService from '../../../../../service/sService';
import { useSelector, useDispatch } from 'react-redux';
import _ from "lodash";
import { DownOutlined } from '@ant-design/icons';
import priorityData from "./../../../../../configs/prioritiy";
import { withRouter } from 'react-router-dom'
import { addServicePackage, editServicePackage } from '../../../../../redux/package';

const ServiceForm = (props) => {

    const {editMode} = props;

    const dispatch = useDispatch();
    const { packageData } = useSelector(state => state.package)
    const { isLoad } = useSelector(state => state.auth)
    const [priority, setpriority] = useState(props?.service?.priority? props?.service?.priority + "" : "1");
    const [service, setservice] = useState(props?.service??{});
    const [note, setnote] = useState(props?.service?.description??"");
    const [disable, setdisable] = useState(false);

    

    const isServiceDuplicate = (id) => {
        let isTrue = false;
        if (!_.isEmpty(packageData?.services)) {
            packageData.services.forEach(element => {
                if (element.service_id === id) {

                    isTrue = true
                }

            });
        }
        return isTrue;
    }


    const loadOptions = async (search, loadedOptions, { page }) => {
        try {
            const response = await sService.getServiceQuery({ query: search, page: page, sortBy: 'name' });
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

    const onChange = (value) => {
        setservice(value)
    }

    const Option = (props) => {
        const option = { ...props?.data };

        return (
            <div className="service-select" ref={props.innerRef} {...props.innerProps}>
                <p className="service-select-name">{option?.name}</p>
                <p className="service-select-description">{option?.description}</p>
                <p>{option?.price + " ₫"}</p>
                {
                    isServiceDuplicate(option.id)
                    &&
                    <p className="service-select-warn">Bạn đã chọn service này rồi</p>

                }
            </div>
        )
    }

    const handleMenuClick = (e) => {

        setpriority(e.key)
    }

    const menu = (
        <Menu selectedKeys={priority} onClick={handleMenuClick}>
            {
                Object.keys(priorityData).map((value, index) => {
                    return (
                        <Menu.Item key={value + ""}>
                            <Tag color={priorityData[value].color}>
                                {value + " - " + priorityData[value].class}
                            </Tag>
                        </Menu.Item>
                    )
                })
            }
        </Menu>
    );

    const clearData =() => {
        setservice({})
        setnote("")
        setpriority("1")
    }

    const submitForm = () => {
        if (_.isEmpty(service)) {
            message.destroy()
            message.error("Vui lòng chọn dịch vụ")
        } else {
            setdisable(true)
            let data = {};
            data.packageId = props.match.params.id
            data.serviceId = service.id
            data.priority = priority;
            data.description = note;
            if(!editMode) {
                dispatch(addServicePackage(data))
            } else {
                data.package_service_id = props?.service?.package_service_id;
                dispatch(editServicePackage(data))
            }
            props.close()
            clearData()
            setTimeout(() => {
                setdisable(false)
            }, 1000);
        }
    }



    const onTextChange = (e) => {
        setnote(e.target.value)
    }


    return (
        <div>
            <div className="form-field">
                <p className="label">Dịch vụ</p>
                <br />
                <div>
                    <AsyncPaginate
                        loadOptions={loadOptions}
                        debounceTimeout={300}
                        value={service}
                        components={{ Option }} // customize menu
                        additional={{
                            page: 1,
                        }}
                        placeholder={'Dịch vụ'}
                        isOptionDisabled={(option) => isServiceDuplicate(option.id)}
                        getOptionLabel={({ name }) => name}
                        defaultOptions
                        cacheOptions
                        isClearable={true}
                        required
                        onChange={onChange}
                    />
                </div>
            </div>
            <br />
            <div>
                Độ ưu tiên <Dropdown overlay={menu}>
                    <Button>
                        <Tag color={priorityData[priority].color}>
                            {priority + " - " + priorityData[priority].class}
                        </Tag>
                        <DownOutlined />
                    </Button>
                </Dropdown>
            </div>
            <br />
            <div className="form-field">
                <p className="label">Chú thích</p>
                <Input.TextArea value={note} onChange={onTextChange} placeholder="Chú thích" className="form-field-input" />
            </div>
            <br />
            <div className="form-field">
                <Button
                    onClick={submitForm}
                    loading={disable || isLoad}
                    // disabled={disable || isLoad} className={disable ? "disable-button" : "default-button"} 
                    type="primary">Xác nhận</Button>
            </div>
        </div>
    );
};

export default withRouter(ServiceForm);