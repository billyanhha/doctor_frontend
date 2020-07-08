import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _, { fill } from 'lodash'
import moment from 'moment';
import axios from '../../axios'
import { Modal, Spin } from 'antd';
import { CalendarTwoTone, ScheduleTwoTone, ClockCircleTwoTone, MobileTwoTone, EnvironmentTwoTone } from '@ant-design/icons';

import {
    getAppointmentsFromTo, getAppointmentsDetail, getPatientDetail, resetStateDetail
} from '../../redux/doctor';

import Navbar from '../../components/Navbar';

import './style.css';

const DoctorDashboard = (props) => {
    const dispatch = useDispatch();
    const { isLoad } = useSelector(state => state.ui);
    const { token } = useSelector(state => state.auth);
    const doctor = useSelector(state => state.doctor);
    const timeTableData = useSelector(state => state.doctor.appointmentTimeTable);
    const appointmentDetail = useSelector(state => state.doctor.appointmentDetail);
    const patientDetail = useSelector(state => state.doctor.patientDetail);
    const [days, setDays] = useState([{}]);
    const [slotConvert, setSlotConvert] = useState([{}]);
    const [slots, setSlots] = useState([{}]);
    const [appointments, setAppointments] = useState([{}]);
    const [apmBasicDetail, setApmBasicDetail] = useState([{}]);
    const [shouldVisible, setShouldVisible] = useState(false);
    let countDateFromMonday = moment(new Date()).day() == 0 ? 7 : moment(new Date()).day();
    const [startDate, setStartDate] = useState(moment(new Date()).subtract('days', countDateFromMonday - 1));
    const [timeStart, setTimeStart] = useState([moment(startDate).format('DD/MM'), moment(startDate).add('days', 6).format('DD/MM')]);
    const dayOfWeek = ['Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy', 'Chủ nhật'];
    const colorBlock = ['bg-dark-blue', 'bg-yellow', 'bg-pink', 'bg-cyan', 'bg-deep-orange', 'bg-cyan-blue', 'bg-purple-darken', 'bg-brown-darken', 'bg-blue-grey-darken', 'bg-green-hhs', 'bg-stripes-blue'];

    //========================  Call Api getAppointments then save to redux store  ========================
    const getAppointments = () => {
        dispatch(getAppointmentsFromTo(doctor?.currentDoctor?.id, moment(startDate).format('YYYY-MM-DD'), moment(startDate).add(6, 'days').format('YYYY-MM-DD')));
    }

    //======================== Handle: core logic of Timetable  ========================
    const handleLogicTimeTable = () => {
        /*
            calculateIndex[]: length = number of appointments (in that week); each value = position to show on Time Table
            fillToTimeTable[]: length = 7 days * number of slots each day; value let us know which block should change color depend on calculateIndex value.
        */
        let calculateIndex = [];
        let allAppointments = {};
        let fillToTimeTable = [{}];
        let getBasicDetail = [{}];

        allAppointments = timeTableData;
        if (allAppointments?.length != 0 && !_.isEmpty(allAppointments)) {
            let colorID = 0;
            let scrollID = 0;
            allAppointments.map((appointments) => {
                moment(appointments?.date).day() == 0
                    ? calculateIndex.push(7 + 7 * (appointments?.slot_id - 1))
                    : calculateIndex.push(moment(appointments?.date).day() + 7 * (appointments?.slot_id - 1));
                if (colorID >= colorBlock.length) {
                    colorID = 0;
                }
                getBasicDetail.push({
                    appointment_id: appointments?.appointment_id,
                    package_id: appointments?.package_id,
                    patient_id: appointments?.patient_id,
                    patient_name: appointments?.patient_name,
                    patient_avatar: appointments?.patient_avatar,
                    slot_id: appointments?.slot_id,
                    date: appointments?.date,
                    colorID: null,
                    scrollID: scrollID
                });
                scrollID++;
            });
            scrollID = 0;
            for (let index = 1; index < 29; index++) {
                fillToTimeTable.push({
                    index: index,
                    package_id: '',
                    value: '',
                    colorID: null,
                    scrollID: null
                });
            }

            getBasicDetail.splice(0, 1);

            calculateIndex.forEach((element, index) => {
                fillToTimeTable[element].value = 'Work';
                if (colorID >= colorBlock.length) {
                    colorID = 0;
                }
                fillToTimeTable[element].package_id = getBasicDetail[index].package_id;

                //Check if appointments're on a same package → same color  
                for (let i = 0; i < fillToTimeTable?.length; i++) {
                    if (fillToTimeTable[element].package_id == fillToTimeTable[i]?.package_id && i != element) {
                        fillToTimeTable[element].colorID = fillToTimeTable[i].colorID;
                        getBasicDetail[index].colorID = fillToTimeTable[i].colorID;
                        break;
                    } else {
                        fillToTimeTable[element].colorID = colorID;
                        getBasicDetail[index].colorID = colorID;
                    }
                }

                fillToTimeTable[element].scrollID = scrollID;
                colorID++;
                scrollID++;
            });

            colorID = 0;
            scrollID = 0;

            fillToTimeTable.splice(0, 1);
            console.log(fillToTimeTable)
            setApmBasicDetail(getBasicDetail)
            setAppointments(fillToTimeTable);
        } else {
            setApmBasicDetail([{}]);
            setAppointments([{}]);
        }
    }

    const getSlot = () => {
        axios.get(`/api/slot`,
            {
                headers: {
                    Authorization: "Bearer " + token,
                    Accept: '*/*'
                }
            })
            .then(data => {
                setSlots(data?.data?.slots)
                let slotDetail = [...new Set(data?.data?.slots?.map(item => item?.hour_from.substring(0, 5) + " - " + item?.hour_to.substring(0, 5)))]
                setSlotConvert(slotDetail);
            })
            .catch(err => console.log(err));
    }

    //========================  Call Api & set data to Redux state  ========================

    const getApmDetail = (apmId, patientID) => {
        if (apmId && patientID) {
            dispatch(getAppointmentsDetail(apmId));
            dispatch(getPatientDetail(patientID));
            setShouldVisible(true);
        } else
            console.log("Cannot get Appointment Detail")
    }

    const resetDetail = () => {
        dispatch(resetStateDetail());
        setShouldVisible(false);
    }

    //========================  Render element  ========================

    const renderDays = days.map(days => <div key={days.index} className={days.value === moment().format('DD/MM') ? "today" : ""}>{dayOfWeek[days.index]}<br />{days.value}</div>);
    const renderSlots = slots.map((slots) =>
        <div key={slots.id}>
            <div className="timetable-hour-from">{slots?.hour_from?.substring(0, 5)}</div>
            <div className="timetable-hour-to">{slots?.hour_to?.substring(0, 5)}</div>
        </div>
    );
    const renderTimeTable = appointments?.length == 1 || _.isEmpty(appointments) || _.isEmpty(apmBasicDetail)
        ? <div className="no-appointment">Tuần này bạn không có lịch làm việc</div>
        : appointments.map(appointments =>
            <div key={appointments.index} className={appointments.value == "Work" ? "timetable-block-work " + colorBlock[appointments.colorID] : ""}>
                <a className={appointments.scrollID == null ? "scroll-disable" : "scroll-appointment"} href={"#" + appointments.scrollID}>
                    {appointments.colorID == null ? "" :
                        <div className="block-content">
                            {/* <span>{apmBasicDetail[appointments.scrollID]?.patient_name?.substring(apmBasicDetail[appointments.scrollID]?.patient_name.indexOf(' '))}</span><br /> */}
                            <span>{apmBasicDetail[appointments.scrollID]?.patient_name}</span><br />
                        </div>
                    }
                </a>
            </div>
        );

    const renderAppointments = appointments?.length == 1 || _.isEmpty(appointments)
        ? <div className="no-appointment">Không có cuộc hẹn trong tuần này</div>
        : apmBasicDetail.map((detail) =>
            <div key={detail?.appointment_id}>
                <div className="dashboard-each-day">
                    <div className="dashboard-day-appointments">
                        {apmBasicDetail[detail.scrollID]?.date == apmBasicDetail[detail.scrollID - 1]?.date ? "" : moment(new Date()).format("YYYY-MM-DD") == apmBasicDetail[detail.scrollID]?.date ? "Hôm nay, " + moment(detail.date).format("DD/MM") : "" + moment(detail.date).format("DD/MM")}
                    </div>
                    <div id={detail.scrollID} className="dashboard-each-appointment">
                        <div className="timetable-detail-info">
                            <img src={detail.patient_avatar} className="timetable-avatar" alt="Avatar" />
                            <div className="timetable-detail-info-basic">
                                <div className="patient-name">{detail.patient_name ? detail.patient_name : "Ẩn danh"}</div>
                                <div className={"color-tag " + colorBlock[detail.colorID]}></div>
                                {/* <div className="patient-detail-showmore">Xem thông tin bệnh nhân</div> */}
                            </div>
                        </div>
                        <div className="appointment-detail-date">
                            <div>{detail.slot_id - 1 ? slotConvert[detail.slot_id - 1] : slotConvert[0] + ""}</div>
                            <div className="appointment-detail-showmore"><span onClick={() => getApmDetail(detail.appointment_id, detail.patient_id)}>Chi tiết ➔</span></div>
                        </div>
                    </div>
                </div>
            </div>
        );


    //========================  Handle Timetable Button event  ========================

    const presentWeek = () => {
        setStartDate(moment(new Date()).subtract(countDateFromMonday - 1, 'days'));
        setTimeStart([moment(startDate).format('DD/MM'), moment(startDate).add(6, 'days').format('DD/MM')]);
    }

    const nextWeek = () => {
        setStartDate(moment(startDate).add(7, 'days'));
        setTimeStart([moment(startDate).format('DD/MM'), moment(startDate).add(6, 'days').format('DD/MM')]);
    }

    const previousWeek = () => {
        setStartDate(moment(startDate).subtract(7, 'days'));
        setTimeStart([moment(startDate).format('DD/MM'), moment(startDate).add(6, 'days').format('DD/MM')]);
    }

    useEffect(() => {
        getAppointments();
        let day = [{}];
        for (let index = 0; index < 7; index++) {
            day.push({
                index: index,
                value: moment(startDate).add(index, 'days').format('DD/MM')
            })
        }
        day.splice(0, 1);
        setDays(day);
    }, [startDate, timeStart]);

    useEffect(() => {
        handleLogicTimeTable();
    }, [timeTableData, startDate]);

    useEffect(() => {
        getSlot();
    }, []);

    return (
        <div className="default-div">
            <Navbar />
            <Spin size="large" spinning={isLoad}  >
                <div className="doctor-time-table">
                    <div className="dashboard-appointments my-scrollbar" id="scrollbar-hhs">
                        <div className="dashboard-appointments-title">Các cuộc hẹn</div>
                        <div className="dashboard-appointments-content">
                            {renderAppointments}
                        </div>
                    </div>
                    <Modal centered visible={shouldVisible} onCancel={resetDetail} width={450} footer={null}>
                        <div className="show-appointment-detail">
                            <div className="timetable-section-name">Thông tin cuộc hẹn</div>
                            <div className="timetable-section-content">
                                <div><CalendarTwoTone twoToneColor="#47c7be" /> {moment(new Date()).format("YYYY-MM-DD") == appointmentDetail?.date ? "Hôm nay, " :
                                    moment(appointmentDetail?.date).day() == 0 ? dayOfWeek[6] + ", " : dayOfWeek[moment(appointmentDetail?.date).day() - 1] + ", "}
                                    {appointmentDetail?.date ? moment(appointmentDetail?.date).format('DD/MM/YYYY') : "Chưa có ngày khám"}
                                </div>
                                <div><ClockCircleTwoTone twoToneColor="#47c7be" /> {appointmentDetail?.slot_id && slots[appointmentDetail?.slot_id - 1]?.hour_from
                                    ? slots[appointmentDetail.slot_id - 1].hour_from.substring(0, 5) + " - " + slots[appointmentDetail.slot_id - 1].hour_to.substring(0, 5)
                                    : "Chưa có giờ khám"}
                                </div>
                                <div><EnvironmentTwoTone twoToneColor="#47c7be" /> {appointmentDetail?.address ?? "Không có địa điểm khám"}</div>
                                <div><EnvironmentTwoTone twoToneColor="#47c7be" /> {appointmentDetail?.phone ?? "Không có số điện thoại"}</div>
                                {/* <div><span className="specification">Huyết áp: </span>{appointmentDetail?.blood_pressure ? appointmentDetail.blood_pressure : "Không có ghi chép"}</div>
                                <div><span className="specification">Mạch: </span>{appointmentDetail?.pulse ?? "Không có ghi chép"}</div> moment(new Date()).day() == 0 ? 7 : moment(new Date()).day()
                                <div><span className="specification">Nhiệt độ cơ thể: </span>{appointmentDetail?.temperature ?? "Không có ghi chép"}</div> */}
                                <div><span className="specification">Ghi chú: </span>{appointmentDetail?.note ?? "Không có ghi chép"}</div>
                            </div>
                        </div>
                        <div className="show-patient-detail">
                            <div className="timetable-section-name">Thông tin bệnh nhân</div>
                            <div className="timetable-section-content-card">
                                <div className="timetable-section-content">
                                    <div className="timetable-detail-info timetable-detail-info-card">
                                        <img src={patientDetail?.avatarurl} alt="Avatar" className="timetable-avatar timetable-avatar-card" />
                                        <div className="timetable-detail-info-basic timetable-detail-info-basic-card">
                                            <div className="patient-name">{patientDetail?.fullname ?? "Ẩn danh"}</div>
                                            <div className="patient-phone"><MobileTwoTone /> {patientDetail?.phone ?? "Không có"}</div>
                                        </div>
                                    </div>
                                    <div><span className="specification">Giới tính: </span>{!patientDetail?.gender ? "Không có dữ liệu" : patientDetail?.gender == "Male" ? "Nam" : "Nữ"}</div>
                                    <div><span className="specification">Ngày sinh: </span>{patientDetail?.dateofbirth ? moment(patientDetail?.dateofbirth).format('DD/MM/YYYY') : "Không có thông tin"}</div>
                                </div>
                            </div>
                        </div>
                    </Modal>
                    <div className="dashboard-timetable">
                        <div className="dashboard-timetable-title">Lịch trình</div>
                        <div className="dashboard-timetable-main">
                            <div className="timetable-button">
                                <button onClick={nextWeek}>Tuần sau</button>
                                <button onClick={previousWeek}>Tuần trước</button>
                                <button className="button-today" onClick={presentWeek}>Hiện tại</button>
                            </div>
                            <div className="timetable-time-range">{moment(startDate).format('DD/MM')} - {moment(startDate).add(6, 'days').format('DD/MM')} năm {moment(startDate).format('YYYY')}</div>

                            <div className="timetable">
                                <div className="timetable-content-days">
                                    {renderDays}
                                </div>
                                <div className="time-interval">
                                    {renderSlots}
                                </div>
                                <div className="timetable-content">
                                    {renderTimeTable}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Spin>
        </div>
    );
};

export default DoctorDashboard;