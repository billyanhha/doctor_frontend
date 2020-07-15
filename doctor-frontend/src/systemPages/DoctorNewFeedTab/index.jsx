import React, { useState, useEffect } from 'react';
import './style.css';
import Tab from './Tabs';
import { useDispatch, useSelector } from 'react-redux';
import {
    doctorAcceptPackage,
    doctorRejectPackage,
    nextNotAssignPackageQuery,
    notAssignPackageQuery,
    nextAssignPackageQuery,
    assignPackageQuery
} from '../../redux/package';
import { ArrowRightOutlined, LoadingOutlined, SortDescendingOutlined, DownOutlined } from '@ant-design/icons';
import { getDoctorLogin } from '../../redux/doctor';
import { Input, Spin } from 'antd';
import { Menu, Dropdown, Button } from 'antd';
import _ from "lodash";
import moment from 'moment';
import Navbar from '../../components/Navbar';
import { Popconfirm, message,Popover } from 'antd';
import { Tabs } from 'antd';
import { Radio } from 'antd';
import { Link } from 'react-router-dom';

const { Search } = Input;

const { TabPane } = Tabs;
function callback(key) {
    console.log(key);
}

const DoctorNewFeedTab = (props) => {

    const [active, setActive] = useState('a');
    const dispatch = useDispatch();
    const { currentDoctor } = useSelector(state => state.doctor);
    const { token } = useSelector(state => state.auth);
    const { assignPackage } = useSelector(state => state.package);
    const { notAssignNotDuplicatedPackage } = useSelector(state => state.package);
    const { notAssignDuplicatedPackage } = useSelector(state => state.package);

    const { assignNotDuplicatedPackage } = useSelector(state => state.package);
    const { assignDuplicatedPackage } = useSelector(state => state.package);
    const { packageAcceptUpdated } = useSelector(state => state.package);
    const { packageRejectUpdated } = useSelector(state => state.package);
    const { allAppointmentByPackage } = useSelector(state => state.package);

    const { isOutOfDataAssign } = useSelector(state => state.package)
    const { isOutOfDataNotAssign } = useSelector(state => state.package)
    const { isLoad } = useSelector(state => state.ui);
    const [disableButton, setdisableButton] = useState(false);
    const [pageNotAssign, setPageNotAssign] = useState(1);
    const [pageAssign, setPageAssign] = useState(1);
    const [query, setquery] = useState({});
    const [textSearch, setTextSearch] = useState('');
    const [sortBy, setSortBy] = useState("created_at");
    const [searchBy, setSearchBy] = useState("name");
    const [redirect, setRedirect] = useState(false);
    const [radioButtonValue, setRadioButtonValue] = useState(false);
    const [itemsPage, setItemsPage] = useState(0);
    const [rejectText, setRejectText] = useState("");

    useEffect(() => {
        if (token) {
            dispatch(getDoctorLogin(token));
        }
        setRedirect(true);
    }, []);


    // console.log(notAssignDuplicatedPackage);
    // console.log(notAssignNotDuplicatedPackage);
    console.log(assignDuplicatedPackage);
    // console.log(isOutOfData);
    const onClickOnNotAssign = (value) => {
        const info = notAssignNotDuplicatedPackage?.filter((info, key) => {
            if (key === value)
                return info;
        });
        dispatch(doctorAcceptPackage(currentDoctor?.id, info[0].package_id));
        if (packageAcceptUpdated) {
            message.destroy();
            message.success("Chấp nhận thành công")
        } else {
            message.destroy();
            message.error("Chấp nhận thất bại")
        }
        const timer = setTimeout(() => window.location.reload(), 1000);
        return () => clearTimeout(timer);
    }

    const acceptOnAssign = (value) => {
        const info = assignNotDuplicatedPackage?.filter((info, key) => {
            console.log(key)
            if (key === value)
                return info;
        });
        dispatch(doctorAcceptPackage(currentDoctor?.id, info[0].package_id));
        if (packageAcceptUpdated) {
            message.destroy();
            message.success("Chấp nhận thành công")
        } else {
            message.destroy();
            message.error("Chấp nhận thất bại")
        }
        const timer = setTimeout(() => window.location.reload(), 1000);
        return () => clearTimeout(timer);
    }

    const rejectOnAssign = (value) => {
        const info = assignNotDuplicatedPackage?.filter((info, key) => {
            console.log(key);
            if (key === value)
                return info;
        });
        dispatch(doctorRejectPackage(currentDoctor?.id, info[0]?.package_id, rejectText));
        if (packageRejectUpdated) {
            message.destroy();
            message.success("Đã từ chối thành công với lý do: "+ rejectText)
        } else {
            message.destroy();
            message.error("Đã từ chối thất bại")
        }
        const timer = setTimeout(() => window.location.reload(), 1000);
        return () => clearTimeout(timer);
    }

    const rejectOnAssignDuplicated = (value) => {
        const info = assignDuplicatedPackage?.filter((info, key) => {
            console.log(key);
            if (key === value)
                return info;
        });
        console.log(info)
        dispatch(doctorRejectPackage(currentDoctor?.id, info[0]?.package_id, rejectText));
        if (packageRejectUpdated) {
            message.destroy();
            message.success("Đã từ chối thành công với lý do: "+ rejectText)
        } else {
            message.destroy();
            message.error("Đã từ chối thất bại")
        }
        const timer = setTimeout(() => window.location.reload(), 1000);
        return () => clearTimeout(timer);
    }

    const handleSearchByChange = ((key) => {
        let search = key.key;
        setSearchBy(search);
        handleSearchAndSort(textSearch, sortBy, search, radioButtonValue);

    });

    const handleSortByChange = ((key) => {
        let sort = key.key;
        setSortBy(sort);
        handleSearchAndSort(textSearch, sort, searchBy, radioButtonValue);
    });

    const onChange = (e) => {
        setTextSearch(e.target.value) // store search value
    }

    const onChangeRejectText = (e) =>{
        setRejectText(e.target.value);
    }

    const handleSearchEnter = (value) => {
        handleSearchAndSort(value, sortBy, searchBy, radioButtonValue);
    }

    const handleSearchAndSort = ((value, sortBy, searchBy, duplicated) => {
        let newPage = 1;

        const trimValue = value?.trim();
        disableButtonFunc();
        if (!_.isEmpty(trimValue)) {
            let newQuery = { query: trimValue, sortBy: sortBy, page: newPage, searchBy: searchBy, duplicated: duplicated };
            console.log(newQuery)
            setquery(newQuery);
            if (active === 'a') {
                setPageNotAssign(newPage);
                dispatch(notAssignPackageQuery(currentDoctor?.id, newQuery));
            } else {
                setPageAssign(newPage);
                dispatch(assignPackageQuery(currentDoctor?.id, newQuery));
            }
        } else {
            getNonQueryService(sortBy, duplicated);
        }
    })

    const getNonQueryService = (sortBy, duplicated) => {
        let newPage = 1;
        let newQuery = { sortBy: sortBy, page: newPage, searchBy: searchBy, duplicated: duplicated };
        console.log(newQuery)
        setquery(newQuery);
        if (active === 'a') {
            setPageNotAssign(newPage);

            dispatch(notAssignPackageQuery(currentDoctor?.id, newQuery));
        } else {
            setPageAssign(newPage);
            dispatch(assignPackageQuery(currentDoctor?.id, newQuery));
        }
    }

    const getMoreData = () => {
        disableButtonFunc();
        if (active === 'a') {
            let next = pageNotAssign + 1;
            setPageNotAssign(next);
            const trimValue = textSearch.trim();
            let newQuery = { page: next, searchBy: searchBy, sortBy: sortBy, query: trimValue, duplicated: radioButtonValue };
            console.log(newQuery)
            dispatch(nextNotAssignPackageQuery(currentDoctor?.id, newQuery));
        } else {
            let next = pageAssign + 1;
            setPageAssign(next);
            const trimValue = textSearch.trim();
            let newQuery = { page: next, searchBy: searchBy, sortBy: sortBy, query: trimValue, duplicated: radioButtonValue };
            dispatch(nextAssignPackageQuery(currentDoctor?.id, newQuery));
        }
    }

    const disableButtonFunc = () => {
        setdisableButton(true);
        setTimeout(() => {
            setdisableButton(false);
        }, 1000);
    }

    const handleCreated_at = (value) => {
        return moment(value).format('DD-MM-YYYY HH:mm');
    }

    const onChangeButton = e => {
        setRadioButtonValue(e.target.value);
        handleSearchAndSort(textSearch, sortBy, searchBy, e.target.value);

    };

    const formatDateTime = (dateValue, time1, time2) => {
        dateValue = dateValue?.split("-");
        dateValue = dateValue?.[2] + "-" + dateValue?.[1] + "-" + dateValue?.[0];
        time1 = time1?.substring(0, 5);
        time2 = time2?.substring(0, 5);
        return dateValue + " " + time1 + " - " + time2;
    }

    function cancel() {

    }

    const displayResult = (active, radioButton) => {
        console.log(active, radioButton);
        if (active === 'a' || radioButton === false) {
            return notAssignNotDuplicatedPackage[0]?.full_count ?? 0;
        }
        if (active === 'a' || radioButton === true) {
            return notAssignDuplicatedPackage[0]?.full_count ?? 0;
        }
        if (active === 'b' || radioButton === false) {
            return assignNotDuplicatedPackage[0]?.full_count ?? 0;
        }
        if (active === 'b' || radioButton === true) {
            return assignDuplicatedPackage[0]?.full_count ?? 0;
        }
    }

    useEffect(() => {
        console.log(displayResult(active, radioButtonValue));
    }, [itemsPage])

    const menu1 = (
        <Menu selectedKeys={sortBy} onClick={handleSortByChange}>
            <Menu.Item key="created_at" icon={<SortDescendingOutlined />}>
                Ngày tạo yêu cầu
          </Menu.Item>
            <Menu.Item key="date" icon={<SortDescendingOutlined />}>
                Ngày thực hiện yêu cầu
          </Menu.Item>
        </Menu>
    );

    const menu2 = (
        <Menu selectedKeys={searchBy} onClick={handleSearchByChange}>
            <Menu.Item key="name" icon={<SortDescendingOutlined />}>
                Tên
          </Menu.Item>
            <Menu.Item key="address" icon={<SortDescendingOutlined />}>
                Địa chỉ
          </Menu.Item>
        </Menu>
    );


    const packages = (value,type) => {
        return value?.map((value, key) =>
            (
                <div>
                    <div key={key} className="newfit-content-div">
                        <div className="grid-item first-div">
                            <img src={value?.avatarurl} className="img-div" />
                            <div className="info-div">
                                <h1 className="nameText-div">{value?.patient_name}</h1>
                                <div className="phone-div">
                                    {value?.phone}
                                </div>
                            </div>
                            <div className="time-div">
                                Thời gian:
                            <span><p>{formatDateTime(value?.date, value?.hour_from, value?.hour_to)}</p></span>
                            </div>
                            <div className="address-div">
                                Địa chỉ: <p>{value?.address}</p>
                            </div>
                            

                        </div>
                        <div className="colorTag-div">a</div>
                        <div className=" second-div">
                            <div className="grid-left-div">
                                <div className="reason-div">
                                    Lý do: {value?.reason}
                                </div>

                                {(type === 3 || type ===4) &&  (<div className="more-div">
                                    <Link target="_blank" to={"package/" + value?.package_id} >Chi tiết</Link>
                                    <span className="chitiet-div"><ArrowRightOutlined /></span>
                                </div>)}
                            </div>
                            <div className="grid-right-div">

                                <div className="timeSend-div">
                                    Gửi lúc: <p>{handleCreated_at(value?.created_at)}</p>
                                </div>

                                {type === 1 && (<Popconfirm
                                    title="Bạn có chắc chắn không?"
                                    onConfirm={e => { onClickOnNotAssign(key); }}
                                    onCancel={cancel}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <button className="link-button-accept-div" id={value?.package_id}><span>Chấp nhận</span></button>
                                </Popconfirm>)}

                                {type === 4 && (<Popover
                                    title="Bạn có chắc chắn không?"
                                    
                                    trigger="click"
                                    content={(
                                    <div>
                                        <input required onChange={onChangeRejectText}/>
                                        <button className="reject-button-input-div" onClick={e => { rejectOnAssignDuplicated(key); }}>Gửi</button>
                                    </div>
                                    )}
                                >
                                    <button className="link-button-reject-div" id={value?.package_id}><span>Từ chối</span></button>
                                </Popover>)}
                                
                                {(type === 3) && (<div>
                                    <Popover
                                    title="Xin hãy cho biết lý do chính đáng?"
                                    trigger="click"
                                    content={(
                                    <div>
                                        <input required onChange={onChangeRejectText}/>
                                        <button className="reject-button-input-div" onClick={e => { rejectOnAssign(key); }}>Gửi</button>
                                    </div>
                                    )}
                                >
                                    <button className="reject-div" id={value?.package_id}><span>Từ chối</span></button>
                                </Popover>

                                <Popconfirm
                                    title="Bạn có chắc chắn không?"
                                    onConfirm={e => { acceptOnAssign(key) }}
                                    onCancel={cancel}
                                    okText="Có"
                                    cancelText="Không"
                                >
                                    <button className="accept-div" id={value?.package_id}><span> Chấp nhận</span></button>
                                </Popconfirm></div>)}

                            </div>
                        </div>
                        <hr className="hrNewFeed-div" />
                    </div>

                </div>
            )
        );
    }
    // const packagesExpired = notAssignPackage?.map((value, key) => {
    //     let today = moment().format('YYYY-MM-DD hh:mm:ss');
    //     // console.log(today);
    //     let time = moment.duration("01:00:00");
    //     let today2  = moment().subtract(today, time)
    //     let almostToday = moment(today2._d).format('YYYY-MM-DD hh:mm:ss');
    //     // console.log(almostToday );
    //     let isIn = moment(moment(value.created_at).format('YYYY-MM-DD hh:mm:ss')).isBetween(almostToday,today);
    //     let expired = moment(today).isAfter(moment(value.created_at).format('YYYY-MM-DD hh:mm:ss'));
    //     // console.log(isIn);
    //     }
    // });
    const content = {
        a: (<div className="newfit-container">

            <div className="newfit-content">
                <div className="radioButton-div">
                    <Radio.Group onChange={onChangeButton} value={radioButtonValue}>
                        <Radio value={false}>Không bị trùng</Radio>
                        <Radio value={true}>Bị trùng với lịch làm việc</Radio>
                    </Radio.Group>
                </div>
                <div className="newfit-left-div">
                    {radioButtonValue === false ? packages(notAssignNotDuplicatedPackage,1) : packages(notAssignDuplicatedPackage,2)}
                    
                    {radioButtonValue === false ? 
                    (<center>
                        {packages(notAssignNotDuplicatedPackage,1) && !isOutOfDataNotAssign && (<button
                            onClick={getMoreData}
                            disabled={disableButton || isLoad}
                            className={disableButton || isLoad ? "disable-button-service" : "link-button-div"}
                            id="button">
                            Hiển thị thêm {isLoad && <LoadingOutlined />}
                        </button>)}
                    </center>) 
                    : (<center>
                        {packages(notAssignDuplicatedPackage,2) && !isOutOfDataNotAssign && (<button
                            onClick={getMoreData}
                            disabled={disableButton || isLoad}
                            className={disableButton || isLoad ? "disable-button-service" : "link-button-div"}
                            id="button">
                            Hiển thị thêm {isLoad && <LoadingOutlined />}
                        </button>)}
                    </center>)}
                </div>
            </div>
        </div>),
        b: (<div className="newfit-container">

            <div className="newfit-content">
                <div className="radioButton-div">
                    <Radio.Group onChange={onChangeButton} value={radioButtonValue}>
                        <Radio value={false}>Không bị trùng</Radio>
                        <Radio value={true}>Bị trùng với lịch làm việc</Radio>
                    </Radio.Group>
                </div>
                <div className="newfit-left-div">
                    {radioButtonValue === false ? packages(assignNotDuplicatedPackage,3) : packages(assignDuplicatedPackage,4)}
                    <center>
                        {!isOutOfDataAssign && (<button
                            onClick={getMoreData}
                            disabled={disableButton || isLoad}
                            className={disableButton || isLoad ? "disable-button-service" : "link-button-div"}
                            id="button">
                            Hiển thị thêm {isLoad && <LoadingOutlined />}
                        </button>)}
                    </center>
                </div>
            </div>
        </div>)
    };

    return (
        <div className="default-div">
            <div>
                <Navbar />
                <Spin size="large" spinning={isLoad}  >
                    <div className="firstTab-div">
                        <div className="test-div">
                        <div className="searchText-div">
                            <Search
                                placeholder="Tìm kiếm yêu cầu"
                                onSearch={handleSearchEnter}
                                onChange={onChange}
                                id="textSearch"
                                loading={disableButton || isLoad}
                                enterButton="Tìm"
                            />
                        </div>
                        
                        <div className="sortBy-div">
                            <Dropdown overlay={menu1}>
                                <Button onClick={e => e.preventDefault()}>
                                    Sắp xếp theo <DownOutlined />
                                </Button>
                            </Dropdown>
                        </div>
                        <div className="searchBy-div">
                            <Dropdown overlay={menu2}>
                                <Button onClick={e => e.preventDefault()}>
                                    Tìm kiếm theo <DownOutlined />
                                </Button>
                            </Dropdown>
                        </div>
                        </div>
                        <div className="tab-div">
                            <Tab
                                active={active}
                                onChange={active => { setActive(active); handleSearchAndSort(textSearch, sortBy, searchBy, radioButtonValue) }}
                            >
                                <div key="a">Yêu cầu chung </div>
                                <div key="b">Yêu cầu được chỉ định </div>
                                {/* <div key="d">Yêu cầu sắp hết hạn</div> */}
                            </Tab>
                        </div>
                    </div>
                    <div>{content[active]}</div>
                </Spin>
            </div>
        </div>
    );
};

export default DoctorNewFeedTab;