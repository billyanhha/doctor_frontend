import React, { useEffect, useState } from 'react';
import moment from "moment"
import { Modal } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import package_appointment_status from "../../../../configs/package_appointment_status"
import { withRouter } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid';
import slot from "../../../../configs/slot";
import _ from "lodash";
import { getAppointmentsFromTo } from '../../../../redux/doctor';
import interactionPlugin from '@fullcalendar/interaction';
import AddAppointmentForm from './form/AddAppointmentForm';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { updateAppointmentPackage } from '../../../../redux/package';

const Mycalendar = (props) => {

    const { confirm } = Modal;
    const dispatch = useDispatch();
    const { packageData } = useSelector(state => state.package)
    const { token } = useSelector(state => state.auth)
    const doctor = useSelector(state => state.doctor);
    const timeTableData = useSelector(state => state.doctor.appointmentTimeTable);
    const [modal, setmodal] = useState(false);
    const [dateInfo, setdateInfo] = useState('');

    useEffect(() => {

        dispatch(getAppointmentsFromTo(doctor?.currentDoctor?.id, moment().format('YYYY-MM-DD'), moment().add(12, 'days').format('YYYY-MM-DD')));


    }, []);


    const combineData = () => {
        let arr = [...packageData?.appointments];
        timeTableData.forEach(element => {
            let push = true
            arr.forEach(value => {
                if (value.id === element.appointment_id) {
                    push = false
                }
            })
            if (push) {
                arr.push(element)
            }
        })
        return arr
    }

    const eventAppointment = combineData().map((value, index) => {

        //     start: '2014-11-10T10:00:00',
        //   end: '2014-11-10T16:00:00',
        //   display: 'background'
        let start = value?.date + "T" + slot?.[`${value?.slot_id}`]?.from;
        let end = value?.date + "T" + slot?.[`${value?.slot_id}`]?.to;
        let color = package_appointment_status?.[`${value?.status_id}`]?.color;
        if (value?.id) {
            return {
                id: value?.id,
                start: start,
                end: end,
                title: value?.note ?? '',
                backgroundColor: color,
            }
        }
        return {
            id: value?.appointment_id,
            start: start,
            end: end,
            title: (value?.note ?? '') + '(Gói khác)' ,
            backgroundColor: color,
            packageId: `/package/${value?.package_id}#${value.appointment_id}`

        }
    })


    const renderCell = (data) => {
        let classCss = "";
        if (!_.isEmpty(packageData?.appointments)) {
            packageData.appointments.forEach(element => {
                if (moment(element.date).isSame(data.date, 'day')) {
                    classCss = 'current-package-appointment'
                }
            });
        }
        return classCss
    }

    const renderEvent = (event) => {
        let classCss = "";
        let isNotPackageAppointment = true
        if (!_.isEmpty(packageData?.appointments)) {
            packageData.appointments.forEach(element => {
                if (event?.event?._def?.publicId === element.id) {
                    isNotPackageAppointment = false;
                }
            });
            if (isNotPackageAppointment) {
                classCss = 'not-package-appointment'
            }

        }
        return classCss
    }


    const eventClick = (event) => {
        
        if (event.event._def?.extendedProps?.packageId) {
            window.open(event.event._def?.extendedProps?.packageId, "_blank");
        }
        window.location.hash = (event?.event?._def?.publicId);

    }

    const dateClick = (info) => {
        setdateInfo(info)
        if (moment(info.date).isSameOrAfter(moment(), 'day')) {
            setmodal(true)
        }
    }

    const handleCancel = () => {
        setmodal(false)
    }

    const slotLaneDidMount = (info) => {
        let classCss = "";

        classCss = 'slotlabel'
        return classCss

    }

    const getSlot = (time) => {
        let slotId = ""
        Object.keys(slot).forEach(element => {
            if (moment(time).format('HH:mm:ss')===(moment(slot[element].from, 'HH:mm:ss').format('HH:mm:ss'))) {
                slotId = element;
                return slotId;
            }
        })
        return slotId;
    }

    // timeGridWeek
    const handleEventDrop = (info) => {
        const start = info.event.start;
        
        let next = true;
        timeTableData.forEach(element => {
            let startTime = element?.date + "T" + slot?.[`${element?.slot_id}`]?.from;
            if (moment(startTime).isSame(moment(start))) {
                alert(`Ngày ${element?.date} slot ${element?.slot_id} bạn đã có hẹn `);
                info.revert();
                next = false
                return;
            }
        })
        if (moment(start).isBefore(moment())) {
            alert(`Không thể thêm cuộc hẹn vào quá khứ`);
            info.revert();
            next = false
        }
        if (next) {
            confirm({
                icon: <ExclamationCircleOutlined />,
                content: `Bạn xác nhận chuyển cuộc hẹn 
                Ngày ${moment(info.oldEvent.start).format('DD-MM-YYYY HH:mm:ss')} sang ${moment(info.event.start).format('DD-MM-YYYY HH:mm:ss')}`,
                onOk() {
                    let data = {};
                    let doctorId = doctor?.currentDoctor?.id
                    let appointmentId = info.event._def?.publicId
                    let packageId = props.match.params.id
                    data.token = token;
                    data.date = moment(info.event.start).format('YYYY-MM-DD');
                    data.slot_id = getSlot(info.event.start)
                    console.log(data)
                    dispatch(updateAppointmentPackage(data, appointmentId, doctorId, packageId))
                },
                onCancel() {
                    info.revert();

                },
            });
        }
    }


    return (
        <div className="my-calendar">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                locale="vi"
                firstDay={1}
                droppable={true}
                editable={true}
                allDaySlot={false}
                nowIndicator={true}
                eventDrop={handleEventDrop}
                slotLabelFormat={(data) => moment(data.date).format("HH:mm") + " ~ " + moment(data.date).add(150, 'minutes').format("HH:mm")}
                eventTimeFormat={(data) => moment(data.date).format("HH:mm") + " ~ " + moment(data.date).add(150, 'minutes').format("HH:mm")}
                eventClick={eventClick}
                // validRange = {{
                //     start: new Date()
                // }}
                dayCellClassNames={renderCell}
                dateClick={dateClick}
                eventClassNames={renderEvent}
                slotLaneClassNames={slotLaneDidMount}
                displayEventEnd={true}
                navLinks={true}
                slotMinTime={"07:00:00"}
                slotMaxTime={"19:00:00"}
                slotDuration={"3:00:00"}

                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                buttonText={{
                    today: 'Hôm nay',
                    month: 'Tháng',
                    week: 'Tuần',
                    day: 'Ngày',
                }}
                height="80vh"
                events={eventAppointment}
            />
            <Modal
                visible={modal}
                title={"Thêm buổi hẹn vào ngày " + moment(dateInfo.date).format('DD - MM - YYYY')}
                footer={[]}
                onCancel={handleCancel}
            >
                <AddAppointmentForm cancel={handleCancel} dateInfo={dateInfo} />
                {/* {contextHolder} */}
            </Modal>
        </div>
    );
};

export default withRouter(Mycalendar);