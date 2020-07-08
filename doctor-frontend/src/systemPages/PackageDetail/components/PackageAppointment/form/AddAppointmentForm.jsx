import React, { useState, useEffect } from 'react';
import "../style.css";
import slot from "../../../../../configs/slot"
import { Menu, Dropdown, Button, Input, Select, Tag, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import moment from "moment";
import { useSelector, useDispatch } from 'react-redux';
import priorityData from "./../../../../../configs/prioritiy";
import _ from "lodash"
import { withRouter } from 'react-router-dom';
import { addServicePackage, addAppointmentPackage, addAppointmentPackageSuccessul } from '../../../../../redux/package';

const AddAppointmentForm = (props) => {

    const dispatch = useDispatch();
    const { packageData, addAppointmentSuccessful } = useSelector(state => state.package)
    const timeTableData = useSelector(state => state.doctor.appointmentTimeTable);
    const { isLoad } = useSelector(state => state.ui)
    const [slotid, setslot] = useState("");
    const [note, setnote] = useState("");
    const [services, setservices] = useState([]);
    const [disable, setdisable] = useState(false);
    const [arr, setarr] = useState([]);

    useEffect(() => {

        dispatch(addAppointmentPackageSuccessul(''))

    }, []);

    useEffect(() => {

        workingSlot();

    }, [props?.dateInfo.date]);

    const clearData = () => {
        setservices([])
        setnote('')
    }


    const workingSlot = () => { // set working slot
        const dateTime = moment(props?.dateInfo.date).format('HH:mm:ss');
        let arr = [];
        let slotID = '';
        const slotData = { ...slot }
        if (dateTime === '00:00:00') { // month choose
            timeTableData.forEach(element => {
                if (moment(props?.dateInfo?.date).isSame(moment(element?.date), 'day')) {
                    delete slotData[element?.slot_id]
                }
            })
            if (moment(props?.dateInfo?.date).isSame(moment(), 'day')) {
                Object.keys(slotData).forEach(element => {
                    if (moment(new Date(),'HH:mm:ss').isAfter(moment(slotData[element].from, 'HH:mm:ss'))) {
                        delete slotData[element]
                    }
                });
            }
            arr = Object.keys(slotData).map((value, index) => {
                return value
            })
            slotID  = "" + (arr[0] || "");
        } else { // week ,
            Object.keys(slot).forEach(ele => {
                if (slot[ele].from === dateTime && moment().isBefore(moment(props?.dateInfo.date))) {
                    arr.push(ele)
                    slotID = "" + ele
                }
            })
        }
        setslot(slotID)
        setarr(arr)
    }


    const handleMenuClick = (e) => {
        setslot(e.key)
    }


    const menu = (
        <Menu selectedKeys={slotid} onClick={handleMenuClick}>
            {arr?.map((value, index) => {
                if (!_.isEmpty(value)) {
                    return (
                        <Menu.Item key={value + ""}>
                            {"Slot " + value + " : " + slot[value].from + " ~ " + slot[value].to}
                        </Menu.Item>
                    )
                }
            })
            }
        </Menu>
    );


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

    const submitAddAppointment = () => {
        setdisable(true)
        if (_.isEmpty(services)) {
            message.destroy();
            message.error("Bạn chưa chọn dịch vụ", 2);
        } else {
            const id = props.match.params.id
            let data = {};
            data.note = note;
            data.services = services.map((value, index) => {
                return { package_service_id: value }
            })
            data.packageId = id;
            data.date = moment(props?.dateInfo.date).format('YYYY-MM-DD');
            data.slot_id = slotid;

            dispatch(addAppointmentPackage(data))
            clearData();
            props.cancel();
        }

        setTimeout(() => {
            setdisable(false);
        }, 1000);
    }


    const onTextChange = (e) => {
        setnote(e.target.value)
    }

    return (
        <div>
            <div>
                <Dropdown overlay={menu}>
                    <Button>
                        {slotid ?
                         ("Slot " + slotid + " : " + slot[slotid].from + " ~ " + slot[slotid].to) 
                        : "Không có slot"
                        
                        }
                        <DownOutlined />
                    </Button>
                </Dropdown>
            </div>
            <br />
            <div className="form-field">
                <p className="label">Dịch vụ</p>
                <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="Chọn dịch vụ"
                    defaultValue={services}
                    onChange={handleChange}
                >
                    {renderServices}
                </Select>
            </div>
            <br />
            <div className="form-field">
                <p className="label">Chú thích</p>
                <Input.TextArea
                    value={note} onChange={onTextChange}
                    placeholder="Chú thích" className="form-field-input" />
            </div>
            <br />
            <div className="form-field">
                <Button
                    onClick={submitAddAppointment}
                    loading={disable || isLoad}
                    type="primary">Xác nhận</Button>
            </div>
        </div>
    );
};

export default withRouter(AddAppointmentForm);