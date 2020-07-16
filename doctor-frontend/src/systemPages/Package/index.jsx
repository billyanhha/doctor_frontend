import React, { useState, useEffect } from 'react';
import './style.css';
import Navbar from '../../components/Navbar';
import Search from 'antd/lib/input/Search';
import { Dropdown, Button, Menu, Table, Spin, Avatar, Radio, Tag } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import statusData from '../../configs/packageStatus';
import { useSelector, useDispatch } from 'react-redux';
import { getDoctorPackage } from '../../redux/package';
import moment from "moment"
import _ from "lodash"
import { Link } from 'react-router-dom';
import { Modal } from 'antd';
import {
    getPatientInfo
} from '../../redux/patient';
import Patient from '../../components/Patient';


const Package = () => {

    const [currentKey, setcurrentKey] = useState(0);
    const [currentSearchBy, setcurrentSearchBy] = useState('patient_name');
    const [searchText, setSearchText] = useState('');
    const [currentPage, setcurrentPage] = useState(1);
    const [disableBtn, setdisableBtn] = useState(false);
    const { isLoad } = useSelector(state => state.ui)
    const { doctorPackage } = useSelector(state => state.package)
    const { currentDoctor } = useSelector(state => state.doctor);
    const { patientInfo } = useSelector(state => state.patient);
    const [packageAddress, setPackageAddress] = useState("");
    const dispatch = useDispatch();

    const [visible, setVisible] = useState(false);
    
    const showModal = (id, packageAddress) => {
        setVisible(true);
        console.log(packageAddress);
        setPackageAddress(packageAddress);
        dispatch(getPatientInfo(id));
    };

    const handleOk = e => {
        setVisible(false)
    };

    const handleCancel = e => {
        setVisible(false)
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 200,
            render: (id) => <Link target="_blank" to={"package/" + id} >{id}</Link>,
        },
        {
            title: 'Bệnh nhân',
            dataIndex: 'avatarurl',
            key: 'avatarurl',
            render: (avatarurl, data) => {
                return (
                    <div>
                        <Avatar shape="square"
                            size={100} icon={<UserOutlined />}
                            src={avatarurl}
                        />
                        <br/>
                        <a onClick={()=>showModal(data?.patient_id, data?.address)}>{data.patient_name} </a>
                        
                    </div>
                )
            }
        },
        {
            title: 'SĐT',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Lý do',
            dataIndex: 'reason',
            key: 'reason',
        },
        {
            title: 'Trạng thái hiện tại',
            dataIndex: 'status_name',
            key: 'status_name',
            render: (status_name) => <Tag color="processing">{status_name}</Tag>,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (created_at) => <p>{moment(created_at).format('MM / DD /  YYYY, h:mm:ss')}</p>,
        },
    ];


    useEffect(() => {
        handleFirstSearch('', currentKey, currentSearchBy)
    }, []);

    const renderMenuStatus = statusData.status.map((value, index) => {
        return (
            <Menu.Item key={index}>
                {value.msg}
            </Menu.Item>
        )
    })

    const handleMenuClick = (e) => {
        let value = e.key
        setcurrentKey(value)
        handleFirstSearch(searchText, value, currentSearchBy)
    }

    const onRadioGroupChange = e => {
        let value = e.target.value
        setcurrentSearchBy(value)
        handleFirstSearch(searchText, currentKey, value)
    }

    const onSearchChange = _.debounce((value) => {

        setSearchText(value)
        handleFirstSearch(value, currentKey, currentSearchBy)

    }, 300)

    const onSerchDebounce = (e) => {
        onSearchChange(e?.target?.value?.trim())
    }


    const menu = (
        <Menu selectedKeys={[currentKey]} onClick={handleMenuClick}>
            {renderMenuStatus}
        </Menu>
    );


    const onPageNumberChange = (pageNum) => {
        setcurrentPage(pageNum.current)
        getDoctorPackagePaging(pageNum.current)
    }

    const handleFirstSearch = (value, currentStatusKey, currentRadioSearch) => {
        setcurrentPage(1)
        setdisableBtn(true);
        let params = {};
        params[currentRadioSearch] = value.trim();
        params.page = 1;
        params.itemsPage = 4; // move to config
        if (statusData.status[currentStatusKey].id !== "-1") {
            params.status_id = statusData.status[currentStatusKey].id;
        }

        dispatch(getDoctorPackage(currentDoctor?.id, params))

        setTimeout(() => {
            setdisableBtn(false);
        }, 1000);
    }

    const getDoctorPackagePaging = (pageNum) => {
        setdisableBtn(true);
        let params = {};
        params[currentSearchBy] = searchText;
        params.page = pageNum;
        params.itemsPage = 4; // move to config
        if (statusData.status[currentKey].id !== "-1") {
            params.status_id = statusData.status[currentKey].id;
        }

        dispatch(getDoctorPackage(currentDoctor?.id, params))

        setTimeout(() => {
            setdisableBtn(false);
        }, 1000);
    }


    const renderSearchBy = () => {
        switch (currentSearchBy) {
            case 'patient_name': {
                return <span> tên bệnh nhân </span>
            }
            case 'address': {
                return <span> địa chỉ </span>
            }
            case 'phone': {
                return <span> số điện thoại </span>
            }
            case 'reason': {
                return <span> lí do </span>
            }
            default: break
        }
    }

    const renderSearchLabel = () => {
        return searchText && (
            <span> với [ {renderSearchBy()} ] là <span className="hightlight">
                {searchText}
            </span>
            </span>
        )

    }


    return (
        <div className="default-div">
            <div>
                <Navbar />
                <div className="default-center-div">
                    <div className="package-filter">
                        <div className="search-input">
                            <Search
                                placeholder="Tìm kiếm gói"
                                // onSearch={handleSearchEnter}
                                onChange={onSerchDebounce}
                                loading={disableBtn || isLoad}
                            // enterButton="Tìm"
                            />
                            <div>
                                <br />
                                <Radio.Group onChange={onRadioGroupChange} defaultValue={currentSearchBy} name="radiogroup">
                                    <span><b>Tìm kiếm với </b> </span>
                                    <Radio value={'patient_name'}>Tên bệnh nhân</Radio>
                                    <Radio value={'address'}>Địa chỉ</Radio>
                                    <Radio value={'reason'}>Lý do</Radio>
                                    <Radio value={'phone'}>Số điện thoại</Radio>
                                </Radio.Group>
                            </div>
                        </div>
                        <div>
                            <Dropdown overlay={menu}>
                                <Button>
                                    {statusData.status[currentKey].msg} <DownOutlined />
                                </Button>
                            </Dropdown>
                        </div>
                    </div>
                    <Spin size="large" spinning={isLoad}  >
                        <br />
                        <span>
                            Có <b>{doctorPackage?.[0]?.full_count ?? 0}</b> gói với trạng thái
                            <span className="hightlight"> " {statusData.status[currentKey].msg} " </span>
                            {renderSearchLabel()}
                        </span>
                        {/* {console.log(visible,' ',packageAddress, ' ',currentDoctor?.address)} */}
                        {visible ? <Patient handleCancel = {handleCancel}  visible = {visible} patientAddress={packageAddress} doctorAddress={currentDoctor?.address}/> : ""}
                        <div className="package-table">
                            <Table
                                columns={columns}
                                scroll={{ x: '90vw' }}
                                onChange={onPageNumberChange}
                                pagination={{

                                    current: currentPage,
                                    pageSize: 4,
                                    total: doctorPackage?.[0]?.full_count ?? 0,
                                    showSizeChanger: false

                                }}
                                dataSource={doctorPackage.map((value, index) => {
                                    return { ...value, key: value.id }
                                })}
                            />
                        </div>
                    </Spin>
                </div>
            </div>
        </div>
    );
};

export default Package;