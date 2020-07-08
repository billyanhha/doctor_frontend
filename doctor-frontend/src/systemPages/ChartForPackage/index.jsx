import React, { useState, useEffect, Component } from 'react';
import './style.css';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import status from '../../configs/appointment_status';
import { Tabs } from 'antd';
import Chart from 'react-apexcharts';
import {  Spin } from 'antd';
import {
    getAllAppointmentByPackage
} from '../../redux/package';

const ChartForPackage = (props) => {

    const dispatch = useDispatch();
    const [listAppointment, setListAppointment] = useState([]);
    const [temperature, setTemperature] = useState([]);
    const [pulse, setPulse] = useState([]);
    const [systolic, setSystolic] = useState([]);
    const [diastolic, setDiastolic] = useState([]);
    const { allAppointmentByPackage } = useSelector(state => state.package);
    const id = props.id

    const [seriesData, setSeries] = useState([]);
    const [optionsData, setOptions] = useState({});
    const { isLoad } = useSelector(state => state.ui);

    const { TabPane } = Tabs;

    useEffect(()=>{
        dispatch(getAllAppointmentByPackage(id));
    },[]);

    function callback(key) {
        console.log(key);
    }

    const config = (value) => {
        switch (value) {
            case "1": return "7h - 9h30"
            case "2": return "10h - 12h30"
            case "3": return "1h - 3h30"
            case "4": return "4h - 6h30"
        }
        return "";
    }

    const pressureConfig = (systolic, diastolic) => {
        let result = "";
        if (systolic <= 90 && diastolic <= 60) {
            result = "Huyết áp thấp : chỉ số huyết áp tâm thu < 90 mmHg và/hoặc huyết áp tâm trương < 60 mmHg.";
        } else
            if (systolic >= 91 && systolic <= 120 && diastolic >= 61 && diastolic <= 80) {
                result = "Huyết áp tối ưu";
            } else
                if (systolic >= 121 && systolic <= 129 && diastolic >= 81 && diastolic <= 84) {
                    result = "Huyết áp bình thường: Huyết áp tâm thu từ 90 mmHg đến 129 mmHg. Huyết áp tâm trương: Từ 60 mmHg đến 84 mmHg";
                } else
                    if (systolic >= 131 && systolic <= 139 && diastolic >= 85 && diastolic <= 89) {
                        result = "Huyết áp bình thường cao: Huyết áp tâm thu 130-139 mmHg và/hoặc huyết áp tâm trương 85-89 mmHg.";
                    } else
                        if (systolic >= 140 && systolic <= 159 && diastolic >= 90 && diastolic <= 99) {
                            result = "Tăng huyết áp độ 1 (Tăng huyết áp nhẹ: Huyết áp tâm thu 140-159 mmHg và/hoặc huyết áp tâm trương 90-99 mmHg.";
                        } else
                            if (systolic >= 160 && systolic <= 179 && diastolic >= 100 && diastolic <= 109) {
                                result = "Tăng huyết áp độ 2 (Tăng huyết áp nặng): Huyết áp tâm thu 160-179 mmHg và/hoặc huyết áp tâm trương 100-109 mmHg.";
                            } else
                                if (systolic >= 180 && diastolic >= 110) {
                                    result = "Tăng huyết áp độ 3 (Tăng huyết áp cao): Huyết áp tâm thu ≥ 180 mmHg và/hoặc huyết áp tâm trương ≥ 110 mmHg.";
                                } else
                                    if (systolic >= 140 && diastolic <= 90) {
                                        result = "Tăng huyết áp tâm thu đơn độc: Huyết áp tâm thu ≥ 140 mmHg và huyết áp tâm trương < 90 mmHg.";
                                    }
        return result;
    }

    const getAnalysis = (appointments) => {
        let systolic = 0;
        let diastolic = 0;
        let result1 = pressureConfig(appointments[0]?.systolic, appointments[0]?.diastolic);
        for (let i = 0; i < appointments?.length; i++) {
            if (appointments[i]?.status_id === status.done) {
                systolic = appointments[i]?.systolic;
                diastolic = appointments[i]?.diastolic;
            }
        }
        let result2 = "";
        result2 = systolic !== 0 ? pressureConfig(systolic, diastolic) : "";
        return (
            <div>
                {appointments[0]?.systolic && appointments[0]?.diastolic && (<h3>Huyết áp ban đầu:</h3>)}
                <p>{result1}</p>
                {systolic !== 0 && diastolic !== 0 && (<h3>Huyết áp hiện tại:</h3>)}
                <p>{result2}</p>
            </div>
        )
    }



    const formatDateTime = (dateValue) => {
        dateValue = dateValue?.split("-");
        dateValue = dateValue?.[2] + "-" + dateValue?.[1] + "-" + dateValue?.[0];
        return dateValue;
    }

    useEffect(() => {
        let dataSet = allAppointmentByPackage;
        console.log(dataSet);
        let length = dataSet?.length;
        let tem = [];
        let pulse = [];
        let systolic = [];
        let diastolic = [];
        let arr = [];
        for (let i = 0; i < length; i++) {
            let k = i + 1;
            tem[i] = dataSet[i]?.temperature;
            pulse[i] = dataSet[i]?.pulse;
            systolic[i] = dataSet[i]?.systolic;
            diastolic[i] = dataSet[i]?.diastolic;
            arr[i] = formatDateTime(dataSet[i]?.date) + " " + config(dataSet[i]?.slot_id);
        }

        setListAppointment(arr);
        setTemperature(tem);
        setSystolic(systolic);
        setDiastolic(diastolic);
        setPulse(pulse);

        let series = [{
            name: 'Huyết áp tâm trương',
            type: 'column',
            data: diastolic
        }, {
            name: 'Huyết áp tâm thu',
            type: 'column',
            data: systolic
        }, {
            name: 'Nhịp tim',
            type: 'line',
            data: pulse
        }, {
            name: 'Nhiệt độ',
            type: 'line',
            data: tem
        }]

        setSeries(series);
        
        let options = {

            chart: {
                height: 600,
                type: 'column',
                stacked: false
            },
            dataLabels: {
                enabled: false,
                style: {
                    fontSize: '14px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 'bold',
                }

            },
            fill: {
                colors: ['#ff7b50', '#643969', 'rgba(252, 3, 3, 0.8)', '#1f8ffc']
            },
            colors: ['#ff7b50', '#643969', 'rgba(252, 3, 3, 0.8)', '#1f8ffc'],
            stroke: {
                width: [1, 1, 4, 2]
            },
            title: {
                text: 'Biểu đồ số liệu kết quả của cuộc hẹn',
                align: 'left',
                offsetX: 300,
                style: {
                    fontSize: '20px'
                }
            },

            xaxis: {
                categories: arr,
                show: true,
                labels: {

                    maxHeight: 200,
                }
            },
            yaxis: [
                {
                    seriesName: 'Diatolic',
                    min:0,
                    max:200,
                    tickAmount: 10,
                    opposite: false,
                    axisTicks: {
                        show: true,
                    },
                    axisBorder: {
                        show: true,
                        color: '#ff7b50'
                    },
                    labels: {
                        style: {
                            colors: '#ff7b50'
                        }
                    },
                    title: {
                        text: "Huyết áp tâm trương",
                        style: {
                            color: '#ff7b50'
                        }
                    },
                    tooltip: {
                        enabled: true
                    }
                },
                {
                    seriesName: 'Systolic',
                    min:0,
                    max:200,
                    tickAmount: 10,
                    opposite: false,
                    axisTicks: {
                        show: true,
                    },
                    axisBorder: {
                        show: true,
                        color: '#643969'
                    },
                    labels: {
                        style: {
                            colors: '#643969'
                        }
                    },
                    title: {
                        text: "Huyết áp tâm thu",
                        style: {
                            color: '#643969'
                        }
                    },
                },
                {
                    seriesName: 'Pulse',
                    opposite: true,
                    tickAmount: 4,
                    axisTicks: {
                        show: true,

                    },
                    axisBorder: {
                        show: true,
                        color: 'rgba(252, 3, 3, 0.8)'
                    },
                    labels: {
                        style: {
                            colors: 'rgba(252, 3, 3, 0.8)',
                        },
                        offsetX: -15,
                        rotate: 0,
                    },axisBorder: {
                        show: true,
                        color: 'rgba(252, 3, 3, 0.8)',
                        offsetX: -5,
                        offsetY: 0
                    },
                    axisTicks: {
                        show: true,
                        borderType: 'solid',
                        offsetX: 15,
                        offsetY: 0
                    },
                    title: {
                        text: "Nhịp tim",
                        style: {
                            color: 'rgba(252, 3, 3, 0.8)',
                        }
                    }
                },
                {
                    seriesName: 'Temperature',
                    opposite: true,
                    tickAmount:15,
                    axisTicks: {
                        show: true,
                    },
                    axisBorder: {
                        show: true,
                        color: '#1f8ffc'
                    },
                    labels: {
                        style: {
                            colors: '#1f8ffc',
                        },
                        offsetX: -15,
                        rotate: 0,
                    },axisBorder: {
                        show: true,
                        color: '#1f8ffc',
                        offsetX: -5,
                        offsetY: 0
                    },
                    axisTicks: {
                        show: true,
                        borderType: 'solid',
                        offsetX: 20,
                        offsetY: 0
                    },
                    title: {
                        text: "Nhiệt độ",
                        style: {
                            color: '#1f8ffc',
                        }
                    }
                },
            ],
            tooltip: {
                fixed: {
                    enabled: true,
                    position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
                },
            },
            legend: {
                fontWeight: 400,
                labels: {
                    colors: ['#000', '#000', '#000', '#000'],
                    useSeriesColors: false
                },
                markers: {
                    fillColors: ['#ff7b50', '#643969', 'rgba(252, 3, 3, 0.8)', '#1f8ffc']
                }
            },
        };
        setOptions(options);
    }, [allAppointmentByPackage]);

    return (
        <div className="chart-div">
            <Spin size="large" spinning={isLoad}  >
                <div className="lineChart-div">
                    <Chart
                        options={optionsData}
                        series={seriesData}
                        height="450"
                        width="100%"
                    />
                </div>
                <div className="barChart-div">

                    <div className="tab-change-div">
                        <Tabs defaultActiveKey="1" onChange={callback}>
                            <TabPane tab="Phân tích thông tin" key="1">
                                {getAnalysis(allAppointmentByPackage)}
                            </TabPane>
                            <TabPane tab="Các gợi ý" key="2">

                                <h2>Các biện pháp tích cực thay đổi lối sống
                        áp dụng cho mọi bệnh nhân để ngăn ngừa tiến triển và giảm được huyết áp, giảm số thuốc cần dùng: </h2>
                                <p>- Chế độ ăn hợp lý, đảm bảo đủ kali và các yếu tố vi lượng:</p>
                                <p>+ Giảm ăn mặn (ít hơn 6 gam muối hay 1 thìa cà phê muối mỗi ngày).</p>
                                <p>+ Tăng cường rau xanh, hoa quả tươi.</p>
                                <p>+ Hạn chế thức ăn có nhiều cholesterol và axít béo no.</p>
                                <p>- Tích cực giảm cân (nếu quá cân), duy trì cân nặng lý tưởng với chỉ số khối cơ thể (BMI: </p>
                                <p>2 body mass index) từ 18,5 đến 22,9 kg/m . </p>
                                <p>- Cố gắng duy trì vòng bụng dưới 90cm ở nam và dưới 80cm ở nữ. </p>
                                <p>- Hạn chế uống rượu, bia: số lượng ít hơn 3 cốc chuẩn/ngày (nam), ít hơn 2 cốc chuẩn/ngày (nữ) và tổng cộng ít hơn 14 cốc chuẩn/tuần (nam), ít hơn 9 cốc chuẩn/tuần (nữ). 1 cốc chuẩn chứa 10g ethanol tương đương với 330ml bia hoặc 120ml rượu vang, hoặc 30ml rượu mạnh.</p>
                                <p>- Ngừng hoàn toàn việc hút thuốc lá hoặc thuốc lào. </p>
                                <p>- Tăng cường hoạt động thể lực ở mức thích hợp: tập thể dục, đi bộ hoặc vận động ở mức độ vừa phải, đều đặn khoảng 30-60 phút mỗi ngày. </p>
                                <p>- Tránh lo âu, căng thẳng thần kinh; cần chú ý đến việc thư giãn, nghỉ ngơi hợp lý. - Tránh bị lạnh đột ngột.</p>
                            </TabPane>
                        </Tabs>
                    </div>
                </div>
            </Spin>
        </div>
    );
};

export default ChartForPackage;